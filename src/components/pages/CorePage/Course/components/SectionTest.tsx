import { Box, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import MoreButton from 'components/atoms/MoreButton';
import Tooltip from 'components/atoms/Tooltip';
import NoticeContent from 'components/molecules/NoticeContent';
import { __ } from 'helpers/i18n';
import React from 'react';
import { ChapterAndLessonCurrentState, CourseProps } from 'services/courseService';
import CourseLearningContext, { CourseLearningContextProps } from '../context/CourseLearningContext';
import useFilterCourse from './useFilterCourse';

function SectionTest({ course, chapterAndLessonCurrent }: { course: CourseProps, chapterAndLessonCurrent: ChapterAndLessonCurrentState }) {

    const filter = useFilterCourse();

    // const [filter, setFilter] = React.useState<'course' | 'chapter' | 'lesson'>('lesson');

    const courseLearningContext = React.useContext<CourseLearningContextProps>(CourseLearningContext);

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            maxWidth: 800,
            margin: '0 auto',
        }}
    >

        {
            (() => {

                const result: Array<React.ReactChild> = [];


                course.course_detail?.content?.forEach((chapter, chapterIndex) => {

                    if (filter.isCourse
                        || (filter.isChapter && (chapterAndLessonCurrent.chapterID + '') === (chapter.id + ''))
                        || filter.isLesson
                    ) {

                        const resourceChapter: Array<React.ReactChild> = [];

                        if (chapter.lessons.length) {

                            chapter.lessons.forEach((lesson, lessonIndex) => {
                                if (lesson.tests?.length) {
                                    if (filter.isCourse
                                        || (filter.isLesson && ((lesson.id + '') === (chapterAndLessonCurrent.lessonID + '')))) {

                                        resourceChapter.push(<Box key={lesson.id} sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            p: 2,
                                            pt: 1,
                                            pb: 1,
                                            backgroundColor: (lesson.id + '') === (chapterAndLessonCurrent.lessonID + '') ? 'divider' : 'unset',
                                        }}>
                                            <Typography sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline', } }}
                                                onClick={() => {
                                                    courseLearningContext.handleChangeLesson({
                                                        chapter: chapter.code,
                                                        chapterID: chapter.id,
                                                        chapterIndex: chapterIndex,
                                                        lesson: lesson.code,
                                                        lessonID: lesson.id,
                                                        lessonIndex: lessonIndex,
                                                    });
                                                }}
                                                variant='h5'>{lesson.title}</Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                }}
                                            >

                                                {
                                                    lesson.tests?.map(item => (
                                                        courseLearningContext.isPurchased || lesson.is_allow_trial ?
                                                            <Tooltip
                                                                key={item.id}
                                                                title={item.title}
                                                            >
                                                                <IconButton
                                                                    color={courseLearningContext.answerTest[item.id] ? 'success' : 'default'}
                                                                    onClick={() => courseLearningContext.openTest(item.id)}
                                                                >
                                                                    <Icon icon="CheckCircleRounded" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            :
                                                            <Tooltip
                                                                key={item.id}
                                                                title={item.title}
                                                                className="notCursor"
                                                            >
                                                                <IconButton>
                                                                    <Icon icon="LockOutlined" />
                                                                </IconButton>
                                                            </Tooltip>
                                                    ))
                                                }
                                            </Box>
                                        </Box>)
                                    }
                                }
                            });
                        }

                        if (resourceChapter.length) {
                            result.push(<Box key={chapter.id}>
                                <Typography
                                    variant='h4'
                                    sx={{
                                        mb: 1,
                                        cursor: 'pointer', '&:hover': { textDecoration: 'underline', }
                                    }}
                                    onClick={() => {
                                        courseLearningContext.handleChangeLesson({
                                            chapter: chapter.code,
                                            chapterID: chapter.id,
                                            chapterIndex: chapterIndex,
                                            lesson: chapter.lessons[0].code,
                                            lessonID: chapter.lessons[0].id,
                                            lessonIndex: 0,
                                        });
                                    }}
                                >{chapter.title}</Typography>
                                <Box
                                    sx={{
                                        paddingLeft: 2
                                    }}
                                >
                                    {resourceChapter}
                                </Box>
                            </Box>);
                            result.push(<Divider key={'divider_' + chapter.id} color="dark" />)
                        }

                    }

                });

                if (result.length) {
                    result.pop();
                }

                return <>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant='h4'>
                            Tất cả các bài tập trong
                        </Typography>
                        &nbsp;
                        <MoreButton
                            transitionDuration={0}
                            actions={[
                                {
                                    course: {
                                        title: 'Trong khóa học',
                                        selected: filter.isCourse,
                                        action: () => {
                                            filter.change('course');
                                        },
                                    },
                                    chapter: {
                                        title: 'Chương hiện tại',
                                        selected: filter.isChapter,
                                        action: () => {
                                            filter.change('chapter');
                                        },
                                    },
                                    lesson: {
                                        title: 'Bài giảng hiện tại',
                                        selected: filter.isLesson,
                                        action: () => {
                                            filter.change('lesson');
                                        },
                                    },
                                }
                            ]}
                        >
                            <Typography variant='h4'
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: '1px solid',
                                    marginBottom: '-1px',
                                    cursor: 'pointer',
                                }}
                            >
                                {
                                    filter.isCourse ? 'khóa học'
                                        : filter.isChapter ? 'chương hiện tại'
                                            : 'bài học hiện tại'
                                }
                                <Icon icon="ArrowDropDown" />
                            </Typography>
                        </MoreButton>
                    </Box>
                    {
                        result.length ?
                            result
                            :
                            <Box sx={{ mt: 2 }}>
                                <NoticeContent
                                    title={__('{{section}} hiện không có bài tập nào?', {
                                        section: filter.isCourse ? 'Khóa học'
                                            : filter.isChapter ? 'Chương' : 'Bài học'

                                    })}
                                    variantDescription='h5'
                                    description='Các bài tập giúp bạn ôn tập lại kiến thức và ghi nhớ tốt hơn, ngoài ra còn giúp giảng viên đánh giá học viên.'
                                    image='/images/undraw_no_data_qbuo.svg'
                                    disableButtonHome
                                />
                            </Box>
                    }
                </>

            })()
        }
    </Box>
}

export default SectionTest