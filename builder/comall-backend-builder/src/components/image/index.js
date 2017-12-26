import React, { Component } from 'react';

export class Image extends Component {
    render() {
        const { className, style, imageurl, text } = this.props;

        return (
            <img className={className} style={style} src={imageurl} alt={text} />
        );
    }
}
