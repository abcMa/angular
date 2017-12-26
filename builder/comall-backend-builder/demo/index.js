import React from 'react';
import ReactDOM from 'react-dom';

import { builder } from '../src';
import { config } from './config';

builder.init(config);

ReactDOM.render(
    <builder.component />,
    document.getElementById('app')
);