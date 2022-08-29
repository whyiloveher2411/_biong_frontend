import { Box, Button, Theme, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import makeCSS from 'components/atoms/makeCSS';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
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

function Text({ lesson, process, handleAutoCompleteLesson }: {
    lesson: PDFContent,
    process: PDFProcessLearning | null,
    handleAutoCompleteLesson?: (waitingTime: number, isNextLesson?: boolean) => void,
    style?: React.CSSProperties
}) {

    const classes = useStyle();

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
                maxWidth: 1200,
                margin: '0 auto',
            }}
        >
            <Typography variant='h2'>
                {lesson.title}
            </Typography>
            <Divider color='dark' />
            <Box
                sx={{
                    minHeight: '56.25vh'
                }}
            >

                <div className={classes.rootContent} dangerouslySetInnerHTML={{ __html: lesson.description }} />
            </Box>
            <div
                style={{ marginBottom: '24px' }}
            >
                <Button color='inherit' variant='outlined'
                    onClick={() => {
                        if (handleAutoCompleteLesson) {
                            handleAutoCompleteLesson(0, false);
                        }

                        let elem = document.createElement('iframe');
                        elem.style.cssText = 'width:0;height:0,top:0;position:fixed;opacity:0;pointer-events:none;visibility:hidden;';
                        elem.setAttribute('src', getImageUrl(lesson.pdf_file));
                        document.body.appendChild(elem);
                        setTimeout(() => {
                            elem.remove();
                        }, 10000);

                    }}
                >{__('Download File')}</Button>
            </div>
            <Button onClick={() => {
                if (handleAutoCompleteLesson) {
                    handleAutoCompleteLesson(0);
                }
            }} variant='contained'>{__('Complete & continue')}</Button>
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