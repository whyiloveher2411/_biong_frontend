import { Box, Button, Theme, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import makeCSS from 'components/atoms/makeCSS';
import { downloadFileInServer } from 'helpers/file';
import { __ } from 'helpers/i18n';
import React from 'react';
import { CourseLessonProps, ProcessLearning } from 'services/courseService';
import CourseLearningContext, { CourseLearningContextProps } from '../../../context/CourseLearningContext';
// ffmpeg -i SampleVideo_1280x720_10mb.mp4 -codec: copy -bsf:v h264_mp4toannexb -start_number 0 -hls_time 10 -hls_list_size 0 -f hls filename.m3u8

const useStyle = makeCSS((theme: Theme) => ({
    rootContent: {
        lineHeight: '26px',
        color: theme.palette.text.primary,
        '& *': {
            maxWidth: '100%',
        },
        '& img': {
            height: 'auto',
            width: 'auto',
        },
    }
}));

function Text({ lesson, process }: {
    lesson: PDFContent,
    process: PDFProcessLearning | null,
    style?: React.CSSProperties
}) {

    const classes = useStyle();

    const courseLearningContext = React.useContext<CourseLearningContextProps>(CourseLearningContext);

    React.useEffect(() => {
        if (process) {
            //
        }
    }, [lesson, process]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                p: 3,
                pl: 7,
                pr: 7,
                maxWidth: 1200,
                margin: '0 auto',
            }}
        >
            <Typography variant='h2'>
                {lesson.title}
            </Typography>
            <Divider color='dark' />
            <Box
                className={classes.rootContent} dangerouslySetInnerHTML={{ __html: process?.content ?? '' }}
            />

            {/* <Box
                sx={{
                    minHeight: '56.25vh'
                }}
            >
                <div className={classes.rootContent} dangerouslySetInnerHTML={{ __html: lesson.description }} />
            </Box> */}
            <div
                style={{ marginBottom: '24px' }}
            >
                <Button color='inherit' variant='outlined'
                    onClick={() => {
                        courseLearningContext.handleClickInputCheckBoxLesson(lesson);
                        downloadFileInServer(
                            courseLearningContext.course?.id ?? 0,
                            courseLearningContext.chapterAndLessonCurrent?.chapterID ?? 0,
                            courseLearningContext.chapterAndLessonCurrent?.chapterIndex ?? 0,
                            courseLearningContext.chapterAndLessonCurrent?.lessonID ?? 0,
                            courseLearningContext.chapterAndLessonCurrent?.lessonIndex ?? 0,
                            0, 'pdf'
                        );
                    }}
                >{__('Download File')}</Button>
            </div>
            <Button onClick={() => {
                courseLearningContext.handleClickInputCheckBoxLesson(lesson);
                courseLearningContext.nexLesson(true);
            }} variant='contained'>{__('Hoàn thành và tiếp tục')}</Button>
        </Box>
    )
}

export default Text

interface PDFContent extends CourseLessonProps {
    description: string,
    pdf_file: string
}
interface PDFProcessLearning extends ProcessLearning {
    pdf_file: string,
}