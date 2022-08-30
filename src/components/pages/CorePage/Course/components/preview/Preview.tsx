import { toCamelCase } from 'helpers/string';
import React from 'react'
import { CourseLessonProps, ProcessLearning } from 'services/courseService'

function Preview({ lesson, process, style, handleAutoCompleteLesson }: {
    lesson: CourseLessonProps,
    process: ProcessLearning | null,
    handleAutoCompleteLesson?: (waitingTime: number) => void,
    style?: React.CSSProperties
}) {

    let lessonCurrent = lesson;

    if (lessonCurrent) {
        let compoment = toCamelCase(lessonCurrent.type);
        try {
            //eslint-disable-next-line
            let resolved = require(`./${compoment}`).default;
            return React.createElement(resolved, { lesson: lessonCurrent, process: process, handleAutoCompleteLesson: handleAutoCompleteLesson });
        } catch (error) {
            console.log(compoment);
        }
    }

    return null;
}

export default Preview