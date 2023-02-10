import { Badge, Typography } from '@mui/material';
import Box from 'components/atoms/Box';
import Button from 'components/atoms/Button';
import DrawerCustom from 'components/molecules/DrawerCustom';
import TemplateCode, { IContentTemplateCode } from 'components/organisms/TemplateCode';
import { addClasses } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import useQuery from 'hook/useQuery';
import React from 'react';
import courseService, { CourseLessonProps, ProcessLearning } from 'services/courseService';
import CourseLearningContext from '../../../context/CourseLearningContext';
import SectionCommentLesson from './ContentLiveCode/SectionCommentLesson';

function LiveCode({ lesson, process }: {
    lesson: LiveCodeContent,
    process: LiveCodeProcessLearning | null,
}) {

    const [stepCurrent, setStepCurrentState] = React.useState(-1);

    const lessonComplete = React.useState<{ [key: ID]: string }>({});

    const courseLearningContext = React.useContext(CourseLearningContext);

    const urlQuery = useQuery({
        tab_tab_c_b: '',
        tab_files: '',
        step: -1,
    });

    const setStepCurrent = (param: number | ((prev: number) => number)) => {

        if (typeof param === 'number') {
            setStepCurrentState(param);
            urlQuery.changeQuery({
                step: param
            });
        } else {
            setStepCurrentState(prev => {
                return param(prev);
            });
            urlQuery.changeQuery({
                step: param(stepCurrent)
            });
        }
        times[1](prev => ++prev);
        urlQuery.changeQuery({ tab_files: '' });
    }


    React.useEffect(() => {
        courseLearningContext.openLogo[1](false);
        courseLearningContext.openTabMain[1](false);

        return () => {
            courseLearningContext.openLogo[1](true);
            courseLearningContext.openTabMain[1](true);
        };
    }, []);

    const times = React.useState(0);

    const [openDetailLesson, setDetailLesson] = React.useState(false);
    const openComment = React.useState(false);

    const commentCount = React.useState(0);

    const handleSubmitLiveCode = async (html: string, script: string, css: string) => {

        const lessonID = process?.content_live_code?.content[stepCurrent]?.id;

        if (lessonID) {
            const result = await courseService.me.liveCode.submit(
                process?.content_live_code?.course_id ?? '0',
                lessonID
            );

            if (result) {
                lessonComplete[1](prev => ({
                    ...prev,
                    [lessonID]: 'true',
                }));

                setStepCurrent(prev => ++prev);

            }
        }
    }

    React.useEffect(() => {
        if (process?.lesson === lesson.id && process.content_live_code) {

            const step = Number(urlQuery.query.step);

            if (
                !Number.isNaN(step) && step > -1 && step < process.content_live_code.content.length
                && (step === 0 || (process.content_live_code?.complete[process.content_live_code.content[step - 1].id]))
            ) {
                setStepCurrent(step);
            } else {
                setStepCurrent(process.content_live_code?.index ? process.content_live_code.index : 0);
            }

            lessonComplete[1](process.content_live_code?.complete ?? {});
        }
    }, [process]);

    React.useEffect(() => {
        if (stepCurrent > -1) {
            (async () => {
                const lessonID = process?.content_live_code?.content[stepCurrent]?.id;
                if (lessonID) {
                    const result = await courseService.me.liveCode.getCommentCount(
                        lessonID
                    );

                    commentCount[1](result);
                }
            })();
        }
    }, [stepCurrent]);

    React.useEffect(() => {

        const courseComplete = process?.content_live_code?.content.filter(item => lessonComplete[0][item.id] ? true : false).length ?? 0;

        if (courseComplete === process?.content_live_code?.content.length) {
            courseLearningContext.handleClickInputCheckBoxLesson(lesson);
        }

    }, [lessonComplete[0], stepCurrent]);

    const courseComplete = process?.content_live_code?.content.filter(item => lessonComplete[0][item.id] ? true : false).length ?? 0;

    if (process?.content_live_code?.content?.length && stepCurrent >= process.content_live_code.content.length) {

        return <ContentOverviewLesson
            process={process}
            lessonComplete={lessonComplete[0]}
            stepCurrent={stepCurrent}
            setStepCurrent={(step) => {
                setStepCurrent(step);
                setDetailLesson(false);
            }}
        />
    }

    return (<Box
        sx={{
            position: 'relative',
            minHeight: 'calc(100vh - 64px)',
        }}
    >
        <Box>
            {
                process?.content_live_code?.content[stepCurrent] ?
                    times[0] % 2 === 0 ?
                        <TemplateCode
                            content={process.content_live_code.content[stepCurrent]}
                            onSubmit={handleSubmitLiveCode}
                            idPassed={lessonComplete[0][process.content_live_code.content[stepCurrent].id] ? true : false}
                            menuItemAddIn={<>
                                <Badge
                                    badgeContent={courseComplete + ' / ' + process.content_live_code.content.length}
                                    color={courseComplete === process.content_live_code.content.length ? 'success' : 'secondary'}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            right: 8
                                        }
                                    }}
                                >
                                    <Button
                                        size='small'
                                        color="inherit"
                                        onClick={() => {
                                            setDetailLesson(true)
                                        }}
                                        sx={{
                                            textTransform: 'unset',
                                            fontSize: 16,
                                            mr: 2,
                                        }}
                                    >
                                        Outline
                                        {/* {stepCurrent + 1} */}
                                    </Button>
                                </Badge>
                                <Badge
                                    badgeContent={commentCount[0]}
                                    onClick={() => openComment[1](true)}
                                    color="secondary"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            right: 24
                                        }
                                    }}
                                >
                                    <Button
                                        size='small'
                                        color='inherit'
                                        sx={{
                                            mr: 4,
                                            textTransform: 'unset',
                                            fontSize: 16,
                                        }}
                                    >
                                        {__('Thảo luận lời giải')}
                                    </Button>
                                </Badge>
                            </>}
                        />
                        :
                        <Box>
                            <TemplateCode
                                content={process.content_live_code.content[stepCurrent]}
                                onSubmit={handleSubmitLiveCode}
                                idPassed={lessonComplete[0][process.content_live_code.content[stepCurrent].id] ? true : false}
                                menuItemAddIn={<>
                                    <Badge
                                        badgeContent={courseComplete + ' / ' + process.content_live_code.content.length}
                                        color={courseComplete === process.content_live_code.content.length ? 'success' : 'secondary'}
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                right: 8
                                            }
                                        }}
                                    >
                                        <Button
                                            size='small'
                                            color="inherit"
                                            onClick={() => {
                                                setDetailLesson(true)
                                            }}
                                            sx={{
                                                textTransform: 'unset',
                                                fontSize: 16,
                                                mr: 2,
                                            }}
                                        >
                                            Outline
                                            {/* {stepCurrent + 1} */}
                                        </Button>
                                    </Badge>
                                    <Badge
                                        badgeContent={commentCount[0]}
                                        onClick={() => openComment[1](true)}
                                        color="secondary"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                right: 24
                                            }
                                        }}
                                    >
                                        <Button
                                            size='small'
                                            color='inherit'
                                            sx={{
                                                mr: 4,
                                                textTransform: 'unset',
                                                fontSize: 16,
                                            }}
                                        >
                                            {__('Thảo luận lời giải')}
                                        </Button>
                                    </Badge>
                                </>}
                            />
                        </Box>
                    : null
            }

        </Box>
        {
            process ?
                <>
                    <DrawerCustom
                        title={__('Outline bài học')}
                        open={openDetailLesson}
                        onCloseOutsite
                        width={800}
                        onClose={() => {
                            setDetailLesson(false);
                        }}
                        restDialogContent={{
                            sx: (theme) => ({
                                backgroundColor: theme.palette.mode === 'light' ? '#F0F2F5' : theme.palette.body.background
                            })
                        }}
                    >
                        <ContentOverviewLesson
                            process={process}
                            lessonComplete={lessonComplete[0]}
                            stepCurrent={stepCurrent}
                            setStepCurrent={(step) => {

                                if (step === 0 || lessonComplete[0][process?.content_live_code?.content?.[step - 1]?.id ?? '0']) {
                                    setStepCurrent(step);
                                    setDetailLesson(false);
                                } else if (step !== 0) {
                                    window.showMessage('Vui lòng học lần lượt!.', 'error');
                                }


                            }}
                        />
                    </DrawerCustom>

                    <DrawerCustom
                        title={<Badge
                            badgeContent={commentCount[0]}
                            color="secondary"
                            sx={{
                                '& .MuiBadge-badge': {
                                    right: -12
                                }
                            }}
                        >
                            <Typography sx={{ color: 'inherit', }} component='span'> {__('Thảo luận')}
                            </Typography>
                        </Badge>}
                        open={openComment[0]}
                        onCloseOutsite
                        width={800}
                        onClose={() => {
                            openComment[1](false);
                        }}
                        restDialogContent={{
                            sx: (theme) => ({
                                backgroundColor: theme.palette.mode === 'light' ? '#F0F2F5' : theme.palette.body.background
                            })
                        }}
                    >
                        <SectionCommentLesson
                            lessonID={process?.content_live_code?.content[stepCurrent]?.id ?? 0}
                            courseID={courseLearningContext.course?.id ?? 0}
                        />
                    </DrawerCustom>
                </>
                : null
        }
    </Box >
    )
}

export default LiveCode

export interface LiveCodeContent extends CourseLessonProps {
    content_live_code: {
        title: string,
        description: string,
        content: Array<{
            question: string,
            content: string,
            answer_option: Array<{
                title: string,
                position: number
            }>
        }>
    }

}

export interface LiveCodeProcessLearning extends ProcessLearning {
    content_live_code?: {
        course_id: ID,
        title: string,
        description: string,
        final_result: string,
        content: Array<IContentTemplateCode>,
        complete: {
            [key: ID]: string,
        },
        index: number,
    }
}


function ContentOverviewLesson({ process, setStepCurrent, stepCurrent, lessonComplete }: { process: LiveCodeProcessLearning, setStepCurrent: (step: number) => void, stepCurrent: number, lessonComplete: { [key: ID]: string } }) {

    const [openFinalResult, setOpenFinalResult] = React.useState(false);

    return (<Box
        sx={{
            maxWidth: 800,
            p: 3,
            display: 'flex',
            gap: 3,
            flexDirection: 'column',
            m: '0 auto',
            minHeight: 'calc(100vh - 112px)',
        }}
    >
        <Typography variant='h2' sx={{ lineHeight: 1.3 }}>{process.content_live_code?.title}</Typography>
        < Box
            sx={(theme) => ({
                lineHeight: '32px',
                fontSize: 18,
                textAlign: 'justify',
                '& p': {
                    margin: theme.spacing(1, 0)
                },
                '&>p>img': {
                    display: 'block',
                    margin: '24px auto',
                }
            })}
            dangerouslySetInnerHTML={{ __html: process.content_live_code?.description ?? '' }}
        />
        <Box>
            <Button
                variant='contained'
                onClick={() => setOpenFinalResult(true)}
            >
                Xem kết quả cuối cùng
            </Button>
        </Box>
        <Box
            sx={{
                display: 'flex',
                gap: 1.5,
                flexWrap: 'wrap',
                mt: 3,
                mb: 3,
            }}
        >
            {
                process.content_live_code?.content?.map((lesson, index) => (
                    <Box
                        key={index}
                        className={addClasses({
                            complete: lessonComplete[lesson.id] ? true : false,
                            active: stepCurrent === index,
                        })}
                        onClick={() => setStepCurrent(index)}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 700,
                            fontSize: 32,
                            width: 64,
                            height: 64,
                            cursor: 'pointer',
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: 'dividerDark',
                            },
                            '&.complete': {
                                color: 'white',
                                backgroundColor: 'success.main',
                                '&:hover': {
                                    backgroundColor: 'success.dark',
                                }
                            },
                            '&.active': {
                                backgroundColor: 'divider',
                                '&.complete': {
                                    color: 'white',
                                    backgroundColor: 'success.dark',
                                    '&:hover': {
                                        backgroundColor: 'success.main',
                                    }
                                }
                            },
                        }}
                    >
                        {index + 1}
                    </Box>
                ))
            }
        </Box>


        <DrawerCustom
            title={'Kết quả bài học: ' + process.content_live_code?.title}
            open={openFinalResult}
            onCloseOutsite
            width={800}
            onClose={() => {
                setOpenFinalResult(false);
            }}
            restDialogContent={{
                sx: (theme) => ({
                    backgroundColor: theme.palette.mode === 'light' ? '#F0F2F5' : theme.palette.body.background,
                    padding: 0,
                    overflow: 'hidden',
                })
            }}
            height="100%"
        >
            <iframe srcDoc={process.content_live_code?.final_result}
                style={{
                    background: 'white',
                    width: '100%',
                    height: '100%',
                }}
            ></iframe>
        </DrawerCustom>

    </Box >)

}
