import { toCamelCase } from 'helpers/string';
import React from 'react';
import { ChapterAndLessonCurrentState, CourseProps, ProcessLearning } from 'services/courseService';
import ContentOnlyPurchased from './SectionContentType/ContentOnlyPurchased';
import NoticeContent from 'components/molecules/NoticeContent';
import { __ } from 'helpers/i18n';

function SectionContentOfLesson({ course, chapterAndLessonCurrent, process, isPurchased }: {
    chapterAndLessonCurrent: ChapterAndLessonCurrentState,
    course: CourseProps,
    process: ProcessLearning | null,
    isPurchased: boolean,
}) {

    let lessonCurrent = course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons[chapterAndLessonCurrent.lessonIndex];

    if (lessonCurrent) {
        if (isPurchased || Boolean(lessonCurrent.is_allow_trial)) {

            let compoment = toCamelCase(lessonCurrent.type);
            try {
                //eslint-disable-next-line
                let resolved = require(`./SectionContentType/${compoment}`).default;
                return React.createElement(resolved, { lesson: lessonCurrent, process: process });
            } catch (error) {
                return <NoticeContent
                    title={__('Nội dung đang cập nhật')}
                    description=''
                    image='/images/undraw_no_data_qbuo.svg'
                    disableButtonHome
                />;
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