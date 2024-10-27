import { Box, Button, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import Loading from 'components/atoms/Loading';
import AddinData from 'components/molecules/AddinData';
import { __ } from 'helpers/i18n';
import React from 'react';
import { CourseLessonProps, ProcessLearning } from 'services/courseService';
import CourseLearningContext, { CourseLearningContextProps } from '../../../context/CourseLearningContext';
import CodeBlock from 'components/atoms/CodeBlock';
import ContentInfoAi from './ContentInfoAi';
// ffmpeg -i SampleVideo_1280x720_10mb.mp4 -codec: copy -bsf:v h264_mp4toannexb -start_number 0 -hls_time 10 -hls_list_size 0 -f hls filename.m3u8

function Text({ lesson, process }: {
    lesson: TextContent,
    process: ProcessLearning | null,
    style?: React.CSSProperties
}) {

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
                height: '100%',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'body.background',
                    position: 'relative',
                    minHeight: 'calc(100vh - 112px)',
                    height: '100%',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: '100%',
                        height: '100%',
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
                                <Box
                                    className="custom_scroll custom"
                                    sx={{
                                        height: '100%',
                                        overflowY: 'scroll',
                                        pr: 1,
                                        '& .codeBlock strong': {
                                            color: 'primary.main',
                                        },
                                        '& .codeBlock p': {
                                            margin: '18px 0 8px 0',
                                            lineHeight: '36px',
                                        },
                                        '& .codeBlock img': {
                                            display: 'block',
                                            margin: '24px auto',
                                        },
                                        '& .codeBlock h1': {
                                            margin: 0,
                                            pt: 3.5,
                                            pb: 1,
                                            color: 'primary.main',
                                        },
                                        '& .codeBlock h2': {
                                            margin: 0,
                                            pt: 3.2,
                                            pb: 1,
                                            lineHeight: 1.2,
                                            fontSize: 34,
                                            color: 'primary.main',
                                        },
                                        '& .codeBlock h3': {
                                            margin: 0,
                                            pt: 3,
                                            pb: 1,
                                            lineHeight: 1.2,
                                            fontSize: 28,
                                            color: 'primary.main',
                                        },
                                        '& .codeBlock h4': {
                                            margin: 0,
                                            pt: 2.5,
                                            pb: 1,
                                            lineHeight: '24px',
                                            fontSize: 24,
                                            color: 'primary.main',
                                        },
                                        '& .codeBlock h5': {
                                            margin: 0,
                                            pt: 2,
                                            pb: 1,
                                            lineHeight: '20px',
                                            fontSize: 20,
                                            color: 'primary.main',
                                        },
                                        '& .codeBlock h6': {
                                            margin: 0,
                                            pt: 1,
                                            pb: 1,
                                            lineHeight: '18px',
                                            fontSize: 16,
                                            color: 'primary.main',
                                        },
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
                                                        <CodeBlock
                                                            html={item}
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
            <ContentInfoAi
                playerRef={{
                    current: null,
                }}
                process={process}
                indexTranscript={0}
                setIndexTranscript={() => {
                    // 
                }}
            />
        </Box>
    )
}

export default Text

interface TextContent extends CourseLessonProps {
    content: string
}