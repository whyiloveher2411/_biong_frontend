import { Box, Button, Link, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import { downloadFileInServer } from 'helpers/file';
import React from 'react';
import { ChapterAndLessonCurrentState, CourseLessonProps, CourseProps } from 'services/courseService';
import CourseLearningContext, { CourseLearningContextProps } from '../context/CourseLearningContext';
import { __ } from 'helpers/i18n';
import NoticeContent from 'components/molecules/NoticeContent';

function SectionResourceLession({ course, chapterAndLessonCurrent }: { course: CourseProps, chapterAndLessonCurrent: ChapterAndLessonCurrentState }) {

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

                const lessionCurrent = course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].lessons?.[chapterAndLessonCurrent.lessonIndex];

                if (lessionCurrent) {

                    if ((Array.isArray(lessionCurrent.resources) && lessionCurrent.resources.length)
                        || lessionCurrent.tests?.length
                        || (Array.isArray(lessionCurrent.reference_post) && lessionCurrent.reference_post.length)
                    ) {
                        return <>
                            <ResourceContent
                                course={course}
                                lesson={lessionCurrent}
                                chapterAndLessonCurrent={chapterAndLessonCurrent}
                                courseLearningContext={courseLearningContext}
                            />
                            <TestLessonContent
                                lesson={lessionCurrent}
                                courseLearningContext={courseLearningContext}
                            />
                            <ReferencePostLessonContent
                                lesson={lessionCurrent}
                                courseLearningContext={courseLearningContext}
                            />
                        </>
                    }

                    return <Box sx={{ mt: 2 }}>
                        <NoticeContent
                            title={__('Không tìm thấy tài nguyên nào.')}
                            variantDescription='h5'
                            description='Các tài nguyên có thể bao gồm thông báo, file, api, bài tập, bài viết liên quan, video,...'
                            image='/images/undraw_no_data_qbuo.svg'
                            disableButtonHome
                        />
                    </Box>
                }
            })()
        }
    </Box>
}

export default SectionResourceLession

function Notification({ title, description }: { index: number, title: string, description: string, activeOnclick: boolean }) {
    return <>
        <Typography variant='h5'>
            {title}
        </Typography>
        <Box
            dangerouslySetInnerHTML={{ __html: description }}
        />
    </>
}

function ResourceLink({ title, description, link, activeOnclick }: { index: number, title: string, description?: string, link: string, activeOnclick: boolean }) {
    return (
        description ?
            <>
                <Typography variant='h5'>
                    {title}
                </Typography>
                <Box
                    dangerouslySetInnerHTML={{ __html: description }}
                />
                <Box>
                    <Link href={activeOnclick ? link : '#'} target='_blank'>
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
                <Typography variant='h5'>
                    {title}
                </Typography>
                -
                <Box>
                    <Link href={activeOnclick ? link : '#'} rel="nofollow" target='_blank'>
                        Visit
                    </Link>
                </Box>
            </Box>
    );
}

function ResourceDownload({ index, course, title, description, file_download, chapterAndLessonCurrent, activeOnclick }: { index: number, course: CourseProps, title: string, description?: string, file_download: string, chapterAndLessonCurrent: ChapterAndLessonCurrentState, activeOnclick: boolean }) {
    return (

        description ?
            <>
                <Typography variant='h5'>
                    {title}
                </Typography>
                <Box
                    dangerouslySetInnerHTML={{ __html: description }}
                />
                <Box>
                    <Button
                        variant='text'
                        startIcon={activeOnclick ? <Icon icon="CloudDownloadOutlined" /> : <Icon icon="LockOutlined" />}
                        sx={{
                            cursor: activeOnclick ? 'pointer' : 'not-allowed',
                            textTransform: 'unset',
                            fontWeight: 400,
                            fontSize: 16,
                        }}
                        onClick={() => {
                            if (activeOnclick) {
                                downloadFileInServer(
                                    course.id,
                                    chapterAndLessonCurrent.chapterID,
                                    chapterAndLessonCurrent.chapterIndex,
                                    chapterAndLessonCurrent.lessonID,
                                    chapterAndLessonCurrent.lessonIndex,
                                    index
                                );
                            }
                        }}
                    >
                        Tải xuống
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
                <Typography variant='h5'>
                    {title}
                </Typography>
                -
                <Box>
                    <Button
                        variant='text'
                        startIcon={activeOnclick ? <Icon icon="CloudDownloadOutlined" /> : <Icon icon="LockOutlined" />}
                        sx={{
                            cursor: activeOnclick ? 'pointer' : 'not-allowed',
                            textTransform: 'unset',
                            fontWeight: 400,
                            fontSize: 16,
                        }}
                        onClick={() => {
                            if (activeOnclick) {
                                downloadFileInServer(
                                    course.id,
                                    chapterAndLessonCurrent.chapterID,
                                    chapterAndLessonCurrent.chapterIndex,
                                    chapterAndLessonCurrent.lessonID,
                                    chapterAndLessonCurrent.lessonIndex,
                                    index
                                );
                            }
                        }}
                    >
                        Tải xuống
                    </Button>
                </Box>
            </Box>
    );
}


function ResourceContent({ course, lesson, chapterAndLessonCurrent, courseLearningContext }: { course: CourseProps, lesson: CourseLessonProps, chapterAndLessonCurrent: ChapterAndLessonCurrentState, courseLearningContext: CourseLearningContextProps }) {


    const activeOnclick = Boolean(lesson.is_allow_trial || courseLearningContext.isPurchased);

    if (Array.isArray(lesson.resources) && lesson.resources.length) {
        return <Box key={lesson.id} sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            p: 2,
        }}>
            <Typography sx={{ cursor: 'pointer', mb: 2 }}
                variant='h4'>Tài nguyên</Typography>
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
                                return <ResourceLink activeOnclick={activeOnclick} index={index} link={item.link ?? '#'} title={item.title} description={item.description} />
                            }

                            if (item.type === 'download') {
                                return <ResourceDownload
                                    index={index}
                                    activeOnclick={activeOnclick}
                                    file_download={item.file_download ?? ''}
                                    title={item.title}
                                    description={item.description}
                                    course={course}
                                    chapterAndLessonCurrent={chapterAndLessonCurrent}
                                />
                            }

                            return <Notification activeOnclick={activeOnclick} index={index} title={item.title} description={item.description} />

                        })()}
                    </Box>
                ))
            }
        </Box>
        // resourceChapter.push(<Divider key={'divider_' + chapter.id} color="dark" />)
    }

    return null;
}


function TestLessonContent({ lesson, courseLearningContext }: { lesson: CourseLessonProps, courseLearningContext: CourseLearningContextProps }) {

    if (lesson.tests?.length) {
        return (<Box key={lesson.id} sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 2,
            pt: 1,
            pb: 1,
        }}>
            <Typography sx={{ cursor: 'pointer' }}
                variant='h4'>Bài tập: </Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                }}
            >

                {
                    lesson.tests?.map(item => (
                        courseLearningContext.isPurchased || lesson.is_allow_trial ?
                            <Button
                                key={item.id}
                                variant='contained'
                                color='inherit'
                                onClick={() => courseLearningContext.openTest(item.id)}
                                startIcon={<Icon sx={{
                                    color: courseLearningContext.answerTest[item.id] ? 'success.main' : 'inherit'
                                }} icon="CheckCircleRounded" />}
                            >
                                {item.title}
                            </Button>
                            :
                            <Button
                                key={item.id}
                                variant='contained'
                                className="notCursor"
                                startIcon={<Icon icon="LockOutlined" />}
                            >
                                {item.title}
                            </Button>
                    ))
                }
            </Box>
        </Box>
        )

    }

    return null;

}



function ReferencePostLessonContent({ lesson, courseLearningContext }: { lesson: CourseLessonProps, courseLearningContext: CourseLearningContextProps }) {

    const isPurchased = Boolean(courseLearningContext.isPurchased || lesson.is_allow_trial);

    if (Array.isArray(lesson.reference_post) && lesson.reference_post.length) {
        return (<Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            p: 2,
        }}>
            <Typography sx={{ cursor: 'pointer' }}
                variant='h4'>Bài viết tham khảo </Typography>
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
    }
    return null;

}


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