import { Box, Link, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import MoreButton from 'components/atoms/MoreButton';
import NoticeContent from 'components/molecules/NoticeContent';
import { __ } from 'helpers/i18n';
import React from 'react';
import { ChapterAndLessonCurrentState, CourseProps } from 'services/courseService';
import CourseLearningContext, { CourseLearningContextProps } from '../context/CourseLearningContext';
import useFilterCourse from './useFilterCourse';

function SectionReferencePost({ course, chapterAndLessonCurrent }: { course: CourseProps, chapterAndLessonCurrent: ChapterAndLessonCurrentState }) {

    const filter = useFilterCourse();

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

                                if (filter.isCourse
                                    || filter.isChapter
                                    || (filter.isLesson && ((lesson.id + '') === (chapterAndLessonCurrent.lessonID + '')))) {

                                    const isPurchased = Boolean(courseLearningContext.isPurchased || lesson.is_allow_trial);

                                    if (Array.isArray(lesson.reference_post) && lesson.reference_post.length) {
                                        resourceChapter.push(<Box key={lesson.id} sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1.5,
                                            p: 2,
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
                                            {
                                                lesson.reference_post.map((item, index) => (
                                                    <Link
                                                        key={lesson?.id + ' ' + index}
                                                        target='_blank'
                                                        rel={"nofollow"}
                                                        href={isPurchased ? item.link : '#'}
                                                        sx={{
                                                            paddingLeft: 4,
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            textDecoration: 'none',
                                                            cursor: isPurchased ? 'pointer' : 'not-allowed',
                                                        }}
                                                        onClick={(e) => {
                                                            if (!isPurchased) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <Typography sx={{ textTransform: 'uppercase', p: '0px 4px', color: '#263238', fontSize: 12, fontWeight: 500, backgroundColor: colorContentType[item.content_type] }}>{item.custom_label ?? item.content_type}</Typography>
                                                        <Typography
                                                            sx={{
                                                                '&:hover': {
                                                                    textDecoration: 'underline',
                                                                }
                                                            }}
                                                        >
                                                            {item.title}
                                                        </Typography>
                                                    </Link>
                                                ))
                                            }
                                        </Box>)
                                        // resourceChapter.push(<Divider key={'divider_' + chapter.id} color="dark" />)
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
                                        pl: 2
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
                            Tất cả các tài nguyên trong
                        </Typography>
                        &nbsp;
                        <MoreButton
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
                                            filter.change('chapter')
                                        },
                                    },
                                    lesson: {
                                        title: 'Bài giảng hiện tại',
                                        selected: filter.isLesson,
                                        action: () => {
                                            filter.change('lesson')
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
                                    title={__('{{section}} hiện không có bài viết liên quan nào?', {
                                        section: filter.isCourse ? 'Khóa học'
                                            : filter.isChapter ? 'Chương' : 'Bài học'

                                    })}
                                    variantDescription='h5'
                                    description='Các bài viết liên quan có thể là nguồn tài nguyên, các mẹo hoặc các kiến thức có thể giúp bạn hoàn thiện kiến thức của mình hơn'
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

export default SectionReferencePost


const colorContentType: {
    [key: string]: string
} = {
    'official-website': '#bee3f8',
    'official-documentation': '#bee3f8',
    'library': '#bee3f8',
    'read': '#fefcbf',
    'sanbox': '#fefcbf',
    'watch': '#e9d8fd',
    'course': '#c6f6d5',
    'challenge': '#c6f6d5',
};