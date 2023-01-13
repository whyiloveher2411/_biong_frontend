import { toCamelCase } from 'helpers/string'
import React from 'react'

function AddinData({ type, ...rest }: { [key: string]: ANY, type: string }) {

    try {
        //eslint-disable-next-line
        let resolved = require(`./${toCamelCase(type)}`).default;
        return React.createElement(resolved, rest);
    } catch (error) {
        console.log(type);
    }

    return null;
}

export default AddinData