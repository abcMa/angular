// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

// Ensure environment variables are read.
require('../config/env');

const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config.release');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printBuildError = require('react-dev-utils/printBuildError');
const gulp = require('gulp');
const babel = require('gulp-babel');

const compiler = webpack(config);

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.libIndexJs])) {
    process.exit(1);
}

fs.emptyDirSync(paths.libPublic);
fs.emptyDirSync(paths.libRelease);

new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
        if (err) {
            return reject(err);
        }
        const messages = formatWebpackMessages(stats.toJson({}, true));
        if (messages.errors.length) {
            // Only keep the first error. Others are often indicative
            // of the same problem, but confuse the reader with noise.
            if (messages.errors.length > 1) {
                messages.errors.length = 1;
            }
            return reject(new Error(messages.errors.join('\n\n')));
        }
        if (process.env.CI && (typeof process.env.CI !== 'string' ||
            process.env.CI.toLowerCase() !== 'false') &&
            messages.warnings.length) {
            console.log(chalk.yellow(
                '\nTreating warnings as errors because process.env.CI = true.\n' +
                'Most CI servers set it automatically.\n'
            ));
            return reject(new Error(messages.warnings.join('\n\n')));
        }
        return resolve({
            stats,
            warnings: messages.warnings,
        });
    });
})
    .then(
        ({ stats, warnings }) => {
            if (warnings.length) {
                console.log(chalk.yellow('Compiled with warnings.\n'));
                console.log(warnings.join('\n\n'));
                console.log('\nSearch for the ' +
                    chalk.underline(chalk.yellow('keywords')) +
                    ' to learn more about each warning.');
                console.log('To ignore, add ' +
                    chalk.cyan('// eslint-disable-next-line') +
                    ' to the line before.\n');
            } else {
                console.log(chalk.green('Compiled successfully.\n'));
            }
        },
        err => {
            console.log(chalk.red('Failed to compile.\n'));
            printBuildError(err);
            process.exit(1);
        }
    );

// Compile jsx and es6
gulp.src([`${paths.appSrc}/**/*.@(js|jsx)`])
    .pipe(babel({
        presets: [
            require.resolve('babel-preset-react'),
            [
                require.resolve('babel-preset-env'),
                {
                    targets: {
                        browsers: [
                            'last 2 versions',
                            'Firefox ESR',
                            '> 1%',
                            'ie >= 9',
                            'iOS >= 8',
                            'Android >= 4',
                        ],
                    },
                }
            ],
        ],
        plugins: [
            require.resolve('babel-plugin-transform-es3-member-expression-literals'),
            require.resolve('babel-plugin-transform-es3-property-literals'),
            require.resolve('babel-plugin-transform-object-assign'),
            require.resolve('babel-plugin-transform-class-properties'),
            require.resolve('babel-plugin-transform-object-rest-spread'),
            require.resolve('babel-plugin-add-module-exports'),
            [require.resolve('babel-plugin-transform-runtime'), { polyfill: false }]
        ]
    }))
    .pipe(gulp.dest(paths.libRelease));

// Copy assets to /lib
gulp.src([`${paths.appSrc}/**/*.*`, `!${paths.appSrc}/**/*.@(js|jsx)`])
    .pipe(gulp.dest(paths.libRelease));