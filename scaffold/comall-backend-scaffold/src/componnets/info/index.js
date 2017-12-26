import React, { Component } from 'react';
import * as _ from 'lodash';

import { getTypeSystem } from 'comall-backend-builder/lib/type';

export class Info extends Component {
    render() {
        const { fields, entity } = this.props;
        const properties = entity.metainfo.properties;

        return fields ? <ul>
            {_.map(properties, (property, name) => {
                let { type, format, options } = property;
                return <li key={name}>
                    {getTypeSystem(type, format).getDisplayComponent(fields[name], {
                        ...properties.displayConfig,
                        name: name,
                        options: options
                    })}
                </li>;
            })}
        </ul> : null;
    }
}
