import { toCamelCase } from 'helpers/string';
import React from 'react';
import { ChapterAndLessonCurrentState, CourseProps, ProcessLearning } from 'services/courseService';

function SectionContentOfLesson({ course, chapterAndLessonCurrent, process, handleAutoCompleteLesson }: {
    chapterAndLessonCurrent: ChapterAndLessonCurrentState,
    course: CourseProps,
    process: ProcessLearning | null,
    handleAutoCompleteLesson: (waitingTime: number) => void,
}) {

    let lessonCurrent = course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons[chapterAndLessonCurrent.lessonIndex];

    if (lessonCurrent) {
        let compoment = toCamelCase(lessonCurrent.type);
        try {
            //eslint-disable-next-line
            let resolved = require(`./SectionContentType/${compoment}`).default;
            return React.createElement(resolved, { lesson: lessonCurrent, process: process, handleAutoCompleteLesson: handleAutoCompleteLesson });
        } catch (error) {
            console.log(compoment);
        }
    }

    return null;
}

export default SectionContentOfLesson