import { Box, Button, Theme, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import makeCSS from 'components/atoms/makeCSS';
import { __ } from 'helpers/i18n';
import React from 'react';
import { CourseLessonProps, ProcessLearning } from 'services/courseService';
import CourseLearningContext, { CourseLearningContextProps } from '../../../context/CourseLearningContext';
import Loading from 'components/atoms/Loading';
import AddinData from 'components/molecules/AddinData';
// ffmpeg -i SampleVideo_1280x720_10mb.mp4 -codec: copy -bsf:v h264_mp4toannexb -start_number 0 -hls_time 10 -hls_list_size 0 -f hls filename.m3u8

const useStyle = makeCSS((theme: Theme) => ({
    rootContent: {
        lineHeight: '26px',
        color: theme.palette.text.primary,
        '& p': {
            margin: theme.spacing(1, 0)
        },
        '&>p>img': {
            display: 'block',
            margin: '24px auto',
        }
    }
}));

function Text({ lesson, process, style }: {
    lesson: TextContent,
    process: ProcessLearning | null,
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
                backgroundColor: 'body.background',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    p: 3,
                    pl: 7,
                    pr: 7,
                    minHeight: 450,
                    maxWidth: 1072,
                    margin: '0 auto',
                }}
            >
                <Typography variant='h2'>
                    {lesson.title}
                </Typography>
                <Divider color='dark' />
                {
                    ((process?.lesson + '') !== (lesson.id + '')) ?
                        <Loading open isCover />
                        :
                        <>
                            < Box
                                className={classes.rootContent}
                                sx={{
                                    lineHeight: '32px',
                                    fontSize: 18,
                                    textAlign: 'justify',
                                }}>
                                {
                                    (() => {
                                        if (process && process.content) {
                                            let arrContent = process.content.split('[option]');
                                            return arrContent.map((item, index) => (
                                                <React.Fragment
                                                    key={index}
                                                >

                                                    <Box
                                                        dangerouslySetInnerHTML={{ __html: item }}
                                                    />
                                                    {
                                                        Boolean(index !== (arrContent.length - 1) && process.addin_data?.[index]) &&
                                                        <Box sx={{ mt: 3, mb: 3, }}><AddinData type={process.addin_data?.[index].type ? process.addin_data[index].type : ''} {...process.addin_data?.[index]} /></Box>
                                                    }
                                                </React.Fragment>
                                            ));
                                        }

                                        return null;
                                    })()
                                }
                            </Box>
                            <Button sx={{ mt: 'auto' }} onClick={() => {
                                courseLearningContext.handleClickInputCheckBoxLesson(lesson);
                                courseLearningContext.nexLesson(true);
                            }} variant='contained'>{__('Hoàn thành và tiếp tục')}</Button>
                        </>
                }
            </Box>
        </Box>
    )
}

export default Text

interface TextContent extends CourseLessonProps {
    content: string
}