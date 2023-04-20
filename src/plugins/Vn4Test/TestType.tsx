import { toCamelCase } from 'helpers/string';
import React from 'react'
import { QuestionTestProps } from 'services/elearningService';

function TestType({ type, id, question, options, showAnswerRight, selected, onChange }: {
    type: string,
    id: ID,
    question: string,
    options?: QuestionTestProps | null,
    showAnswerRight: boolean,
    selected: ANY,
    onChange: (value: ANY) => void
}) {

    let compoment = toCamelCase(type);
    try {
        //eslint-disable-next-line
        let resolved = require(`./TestComponent/${compoment}`).default;
        return React.createElement(resolved, {
            id: id,
            question: question,
            options: options,
            showAnswerRight: showAnswerRight,
            selected: selected,
            onChange: onChange
        });
    } catch (error) {
        console.log(compoment);
    }

    return null;
}

export default TestType