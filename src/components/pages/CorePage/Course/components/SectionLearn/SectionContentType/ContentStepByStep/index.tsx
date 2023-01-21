import { toCamelCase } from 'helpers/string';
import React from 'react';
import { ContentOfStep } from '../StepByStep';

function ContentStepByStep({ content }: {
    content: ContentOfStep,
}) {

    try {
        //eslint-disable-next-line
        let resolved = require(`./${toCamelCase(content.type)}`).default;
        return React.createElement(resolved, {
            content: content,
        });
    } catch (error) {
        console.log(content.type);
    }

    return null;
}

export default ContentStepByStep