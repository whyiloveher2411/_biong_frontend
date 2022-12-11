import { toCamelCase } from 'helpers/string';
import React from 'react';
import { ChapterAndLessonCurrentState, CourseProps, ProcessLearning } from 'services/courseService';
import ContentOnlyPurchased from './SectionContentType/ContentOnlyPurchased';

function SectionContentOfLesson({ course, chapterAndLessonCurrent, process, handleAutoCompleteLesson, isPurchased }: {
    chapterAndLessonCurrent: ChapterAndLessonCurrentState,
    course: CourseProps,
    process: ProcessLearning | null,
    handleAutoCompleteLesson: (waitingTime: number) => void,
    isPurchased: boolean,
}) {

    let lessonCurrent = course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons[chapterAndLessonCurrent.lessonIndex];

    if (lessonCurrent) {
        if (isPurchased || Boolean(lessonCurrent.is_allow_trial)) {

            let compoment = toCamelCase(lessonCurrent.type);
            try {
                //eslint-disable-next-line
                let resolved = require(`./SectionContentType/${compoment}`).default;
                return React.createElement(resolved, { lesson: lessonCurrent, process: process, handleAutoCompleteLesson: handleAutoCompleteLesson });
            } catch (error) {
                console.log(compoment);
            }
        }

        if (!lessonCurrent.is_allow_trial) {
            return <ContentOnlyPurchased
                course={course}
                lesson={lessonCurrent}
                process={process}
            />
        }
    }

    return null;
}

export default SectionContentOfLesson