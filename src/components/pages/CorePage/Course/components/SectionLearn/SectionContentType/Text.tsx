import { Box, Button, Theme, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import makeCSS from 'components/atoms/makeCSS';
import { __ } from 'helpers/i18n';
import React from 'react';
import { CourseLessonProps, ProcessLearning } from 'services/courseService';
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
        },
    }
}));

function Text({ lesson, process, style, handleAutoCompleteLesson }: {
    lesson: TextContent,
    process: ProcessLearning | null,
    handleAutoCompleteLesson?: (waitingTime: number) => void,
    style?: React.CSSProperties
}) {

    const classes = useStyle();

    React.useEffect(() => {
        if (process) {
            //
        }
    }, [lesson, process]);

    if (process) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    p: 3,
                    maxWidth: 1200,
                    margin: '0 auto',
                }}
            >
                <Typography variant='h2'>
                    {lesson.title}
                </Typography>
                <Divider color='dark' />
                <div className={classes.rootContent} dangerouslySetInnerHTML={{ __html: process.content }} />
                <Button onClick={() => {
                    if (handleAutoCompleteLesson) {
                        handleAutoCompleteLesson(0);
                    }
                }} variant='contained'>{__('Complete & continue')}</Button>
            </Box>
        )
    }

    return null;
}

export default Text

interface TextContent extends CourseLessonProps {
    content: string
}