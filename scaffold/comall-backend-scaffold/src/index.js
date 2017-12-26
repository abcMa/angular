import React from 'react';
import ReactDOM from 'react-dom';
import { builder } from 'comall-backend-builder';

import { InfoContainer } from './containers/info-container';
import { TitleFormat } from './type/string/title';
import { InfoLoader } from './loaders/info-loader';
import { config } from './config';

// Customized component example
builder.registerComponent('InfoContainer', InfoContainer);
// Customized type example
builder.registerType('title', new TitleFormat());
// Customized loader example
builder.registerLoader('/info', InfoLoader);

// Config example
builder.init(config);

ReactDOM.render(
    <builder.component />,
    document.getElementById('app')
);