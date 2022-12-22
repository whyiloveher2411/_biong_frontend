import { Box, Button, Link, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import MoreButton from 'components/atoms/MoreButton';
import NoticeContent from 'components/molecules/NoticeContent';
import { downloadFileInServer } from 'helpers/file';
import { __ } from 'helpers/i18n';
import React from 'react';
import { ChapterAndLessonCurrentState, CourseProps } from 'services/courseService';
import CourseLearningContext, { CourseLearningContextProps } from '../context/CourseLearningContext';

function SectionResources({ course, chapterAndLessonCurrent }: { course: CourseProps, chapterAndLessonCurrent: ChapterAndLessonCurrentState }) {

    // const lesson = course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].lessons[chapterAndLessonCurrent.lessonIndex];

    // const resources = course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].lessons[chapterAndLessonCurrent.lessonIndex].resources;

    // if (Array.isArray(resources) && resources.length) {
    const [filter, setFilter] = React.useState<'course' | 'chapter' | 'lesson'>('course');

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

                    if (filter === 'course'
                        || (filter === 'chapter' && (chapterAndLessonCurrent.chapterID + '') === (chapter.id + ''))
                        || filter === 'lesson'
                    ) {

                        const resourceChapter: Array<React.ReactChild> = [];

                        if (chapter.lessons.length) {

                            chapter.lessons.forEach((lesson, lessonIndex) => {

                                if (filter === 'course' || filter === 'chapter'
                                    || (filter === 'lesson' && ((lesson.id + '') === (chapterAndLessonCurrent.lessonID + '')))) {

                                    if (Array.isArray(lesson.resources) && lesson.resources.length) {
                                        resourceChapter.push(<Box key={lesson.id} sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
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
                                                lesson.resources.map((item, index) => (
                                                    <Box
                                                        key={lesson?.id + ' ' + index}
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            paddingLeft: 4,
                                                        }}
                                                    >

                                                        {(() => {

                                                            if (item.type === 'link') {
                                                                return <ResourceLink index={index} link={item.link ?? '#'} title={item.title} description={item.description} />
                                                            }

                                                            if (item.type === 'download') {
                                                                return <ResourceDownload
                                                                    index={index}
                                                                    file_download={item.file_download ?? ''}
                                                                    title={item.title}
                                                                    description={item.description}
                                                                    course={course}
                                                                    chapterAndLessonCurrent={chapterAndLessonCurrent}
                                                                />
                                                            }

                                                            return <Notification index={index} title={item.title} description={item.description} />

                                                        })()}
                                                    </Box>
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
                                        mb: 3,
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
                                        paddingLeft: 4
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 3,
                                        }}
                                    >
                                        {resourceChapter}
                                    </Box>
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
                            transitionDuration={0}
                            actions={[
                                {
                                    course: {
                                        title: 'Trong khóa học',
                                        selected: filter === 'course',
                                        action: () => {
                                            setFilter('course');
                                        },
                                    },
                                    chapter: {
                                        title: 'Chương hiện tại',
                                        selected: filter === 'chapter',
                                        action: () => {
                                            setFilter('chapter');
                                        },
                                    },
                                    lesson: {
                                        title: 'Bài giảng hiện tại',
                                        selected: filter === 'lesson',
                                        action: () => {
                                            setFilter('lesson');
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
                                    filter === 'course' ? 'Khóa học'
                                        : filter === 'chapter' ? 'chương hiện tại'
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
                                    title={__('{{section}} hiện không có tài nguyên nào?', {
                                        section: filter === 'course' ? 'Khóa học'
                                            : filter === 'chapter' ? 'Chương' : 'Bài học'

                                    })}
                                    variantDescription='h5'
                                    description='Các tài nguyên có thể bao gôm source code, tài liệu chính thức, các bài viết hoặc các file cần thiết cho quá trình thực hành'
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

export default SectionResources

function Notification({ title, description }: { index: number, title: string, description: string }) {
    return <>
        <Typography variant='h6'>
            {title}
        </Typography>
        <Box
            dangerouslySetInnerHTML={{ __html: description }}
        />
    </>
}

function ResourceLink({ title, description, link }: { index: number, title: string, description?: string, link: string }) {
    return (
        description ?
            <>
                <Typography variant='h6'>
                    {title}
                </Typography>
                <Box
                    dangerouslySetInnerHTML={{ __html: description }}
                />
                <Box>
                    <Link href="#" target='_blank'>
                        {title}
                    </Link>
                </Box>
            </>
            :
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <Typography variant='h6'>
                    {title}
                </Typography>
                -
                <Box>
                    <Link href={link} rel="nofollow" target='_blank'>
                        Visit
                    </Link>
                </Box>
            </Box>
    );
}

function ResourceDownload({ index, course, title, description, file_download, chapterAndLessonCurrent }: { index: number, course: CourseProps, title: string, description?: string, file_download: string, chapterAndLessonCurrent: ChapterAndLessonCurrentState }) {
    return (

        description ?
            <>
                <Typography variant='h6'>
                    {title}
                </Typography>
                <Box
                    dangerouslySetInnerHTML={{ __html: description }}
                />
                <Box>
                    <Button
                        variant='outlined'
                        color='inherit'
                        onClick={() => {
                            downloadFileInServer(
                                course.id,
                                chapterAndLessonCurrent.chapterID,
                                chapterAndLessonCurrent.chapterIndex,
                                chapterAndLessonCurrent.lessonID,
                                chapterAndLessonCurrent.lessonIndex,
                                index
                            );
                        }}
                    >
                        Download
                    </Button>
                </Box>
            </>
            :
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <Typography variant='h6'>
                    {title}
                </Typography>
                -
                <Box>
                    <Button
                        variant='outlined'
                        color='inherit'
                        startIcon={<Icon icon="CloudDownloadOutlined" />}
                        onClick={() => {
                            downloadFileInServer(
                                course.id,
                                chapterAndLessonCurrent.chapterID,
                                chapterAndLessonCurrent.chapterIndex,
                                chapterAndLessonCurrent.lessonID,
                                chapterAndLessonCurrent.lessonIndex,
                                index
                            );
                        }}
                    >
                        Download
                    </Button>
                </Box>
            </Box>
    );
}
