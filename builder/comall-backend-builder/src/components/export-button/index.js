import React, { Component } from 'react';

import { Button } from '../button';
import { api, interpolate } from '../../services';

export class ExportButton extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            loading: false
        };
    }

    /**
     * 处理按钮的点击事件
     */
    handleClick(event) {
        let [url, query] = interpolate(this.props.downloadUrl, this.props).split('?');
        let params = {};

        if (query) {
            query.split('&').forEach((expression) => {
                let [key, value] = expression.split('=');
                params[key] = value;
            });
        }

        this.setState({loading: true});

        let finish = () => {
            this.setState({loading: false});
        };
        api.download({apiPath: url, params})
            .then(finish, finish);
    }

    render() {
        const props = Object.assign({}, this.props, {
            loading: this.state.loading,
            onClick: this.handleClick
        });

        return (<Button {...props} />);
    }
}
