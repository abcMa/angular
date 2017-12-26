import React, { Component } from 'react';
import xssFilters from 'xss-filters';

import { Image } from '../image';
import { Text } from '../text';

export class Link extends Component {

    render() {
        const { style, url, imageurl, text, imgStyle, className} = this.props;

        let sanitizedUrl = xssFilters.uriInDoubleQuotedAttr(url);

        // 根据当前是否有imageurl来判断当前的超链接为文本OR图片
        return imageurl ?
            (<a href={sanitizedUrl} style={style} className={className}>
                <Image imageurl={imageurl} alt={text} style={imgStyle}/>
            </a>) :
            (<a href={sanitizedUrl} style={style}><Text text={text} /></a>);
    }
}
