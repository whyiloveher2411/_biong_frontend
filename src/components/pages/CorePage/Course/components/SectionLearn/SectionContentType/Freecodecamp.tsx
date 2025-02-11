import { Badge, Typography } from '@mui/material';
import Box from 'components/atoms/Box';
import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import DrawerCustom from 'components/molecules/DrawerCustom';
import TemplateFreecode, { IContentTemplateCode } from 'components/pages/CorePage/Course/components/SectionLearn/SectionContentType/Freecodecamp/TemplateFreecode';
import TemplateFreecodeOld from 'components/pages/CorePage/Course/components/SectionLearn/SectionContentType/Freecodecamp/TemplateFreecodeOld';
import { addClasses } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { addScript, addStyleLink, delayUntil } from 'helpers/script';
import useQuery from 'hook/useQuery';
import React from 'react';
import courseService, { CourseLessonProps, ProcessLearning } from 'services/courseService';
import CourseLearningContext from '../../../context/CourseLearningContext';
import SectionCommentLesson from './ContentLiveCode/SectionCommentLesson';
import TemplateFreecodeOldHtmlCss from './Freecodecamp/TemplateFreecodeOldHtmlCss';
import TemplateFreecodeReact from './Freecodecamp/TemplateFreecodeReact';
import NewJs from './Freecodecamp/NewJs';
import Python from './Freecodecamp/python/Python';


const templateForEditorArg = {
    python: { component: Python, layout: 'new' },
    new_js: { component: NewJs, layout: 'new' },
    new: { component: TemplateFreecode, layout: 'new' },
    old: { component: TemplateFreecodeOld, layout: 'old' },
    old2: { component: TemplateFreecodeOldHtmlCss, layout: 'old' },
    codesanbox: { component: TemplateFreecodeReact, layout: 'new' },
} as const

export type TemplateVersion = keyof typeof templateForEditorArg;

function Freecodecamp({ lesson, process }: {
    lesson: LiveCodeContent,
    process: FreecodeProcessLearning | null,
}) {

    const [stepCurrent, setStepCurrentState] = React.useState(-1);

    const lessonComplete = React.useState<{ [key: ID]: string }>({});

    const courseLearningContext = React.useContext(CourseLearningContext);

    const urlQuery = useQuery({
        tab_tab_c_b: '',
        tab_files: '',
        ['step_' + lesson.id]: -1,
    });

    const setStepCurrent = (param: number | ((prev: number) => number)) => {

        if (typeof param === 'number') {
            setStepCurrentState(param);
            urlQuery.changeQuery({
                ['step_' + lesson.id]: param
            });
        } else {
            setStepCurrentState(prev => {
                return param(prev);
            });
            urlQuery.changeQuery({
                ['step_' + lesson.id]: param(stepCurrent)
            });
        }
        times[1](prev => ++prev);
        urlQuery.changeQuery({ tab_files: '' });
    }


    React.useEffect(() => {
        courseLearningContext.openLogo[1](false);
        courseLearningContext.openTabMain[1](false);


        (async () => {
            addStyleLink('/monaco/editor/editor.main.css', 'monaco-editor');
            addScript('/js/video.min.js', 'video.js', () => {
                addScript('/js/videojs-contrib-quality-levels.min.js', 'ideojs-contrib-quality-levels', () => {

                    addScript('/js/videojs-hls-quality-selector.min.js', 'videojs-hls-quality', () => {
                        addScript('/js/videojs-youtube.min.js', 'videojs-youtube', function () {
                            addScript('/monaco/loader.js', 'monaco-loader', function () {
                                addScript('/monaco/editor/editor.main.nls.js', 'monaco-main.nls', function () {
                                    addScript('/monaco/editor/editor.main.js', 'monaco-main', function () {
                                        addScript('/monaco/emmet-monaco.min.js', 'emmet-monaco', function () {
                                            //
                                        }, 10, 10, () => {
                                            if (window.emmetMonaco && window.monaco) return true;
                                            return false;
                                        });
                                    }, 10, 10, () => {
                                        if (window.monaco?.editor) return true;
                                        return false;
                                    });
                                });
                            });
                        });
                    });
                });
            }, 10, 10, () => {
                if (window.videojs) return true;
                return false;
            });
        })();

        return () => {
            courseLearningContext.openLogo[1](true);
            courseLearningContext.openTabMain[1](true);
        };
    }, []);

    const times = React.useState(0);

    const [openDetailLesson, setDetailLesson] = React.useState(false);
    const openComment = React.useState(false);

    const commentCount = React.useState(0);

    const handleSubmitLiveCode = async () => {

        const lessonID = process?.content_freecode?.content[stepCurrent]?.id;

        if (lessonID) {
            const result = await courseService.me.feecode.submit(
                process?.content_freecode?.course_id ?? '0',
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
        if (process?.lesson === lesson.id && process.content_freecode) {

            const step = Number(urlQuery.query['step_' + lesson.id]) > -1 ? Number(urlQuery.query['step_' + lesson.id]) : process.content_freecode.content.length + 1;

            // if (
            //     step > -1 && step < process.content_freecode.content.length
            //     && (step === 0
            //         || (process.content_freecode?.complete[process.content_freecode.content[step - 1].id])
            //     )
            // ) {
            setStepCurrent(step);
            // } else {
            // setStepCurrent(process.content_freecode.content.length + 1);
            // }

            lessonComplete[1](process.content_freecode?.complete ?? {});
        } else {
            if (process && process.lesson !== lesson.id) {
                setStepCurrent(-1);
            }
        }

        if (process && process.lesson !== lesson.id) {
            setStepCurrent(999);
        }
    }, [process?.lesson]);

    React.useEffect(() => {
        if (stepCurrent > -1) {
            (async () => {
                const lessonID = process?.content_freecode?.content[stepCurrent]?.id;
                if (lessonID) {
                    const result = await courseService.me.feecode.getCommentCount(
                        lessonID
                    );

                    commentCount[1](result);
                }
            })();
        }
    }, [stepCurrent]);

    React.useEffect(() => {

        const courseComplete = process?.content_freecode?.content.filter(item => lessonComplete[0][item.id] ? true : false).length ?? 0;

        if (courseComplete === process?.content_freecode?.content.length) {
            courseLearningContext.handleClickInputCheckBoxLesson(lesson);
        }

    }, [lessonComplete[0], stepCurrent]);

    const courseComplete = process?.content_freecode?.content.filter(item => lessonComplete[0][item.id] ? true : false).length ?? 0;

    const TemplateForEditor = (process?.content_freecode?.template_version && templateForEditorArg[process.content_freecode.template_version]) ?
        templateForEditorArg[process.content_freecode.template_version as keyof typeof templateForEditorArg] : templateForEditorArg.new;

    if (process?.content_freecode?.content && (stepCurrent >= process.content_freecode.content.length || stepCurrent < 0)) {

        return <ContentOverviewLesson
            process={process}
            lessonComplete={lessonComplete[0]}
            stepCurrent={stepCurrent}
            templateVersion={TemplateForEditor.layout}
            setStepCurrent={(step) => {
                // if (step === 0 || lessonComplete[0][process?.content_freecode?.content?.[step - 1]?.id ?? '0']) {
                setStepCurrent(step);
                setDetailLesson(false);
                // } else if (step !== 0) {
                // window.showMessage('Vui lòng học lần lượt!.', 'error');
                // }
            }}
        />
    }

    return (<Box
        sx={{
            position: 'relative',
            minHeight: 'calc(100vh - 64px)',
            '& code': {
                '--color': '#dfdfe2',
            }
        }}
    >
        <Box>
            {
                process?.content_freecode?.content[stepCurrent] ?
                    times[0] % 2 === 0 ?
                        <TemplateForEditor.component
                            content={process.content_freecode.content[stepCurrent]}
                            contentNextStep={process.content_freecode.content[stepCurrent + 1]}
                            finalyResult={process.content_freecode.final_result}
                            onSubmit={handleSubmitLiveCode}
                            lessonNumber={stepCurrent + 1}
                            idPassed={lessonComplete[0][process.content_freecode.content[stepCurrent].id] ? true : false}
                            menuItemAddIn={<Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <Badge
                                    badgeContent={courseComplete + ' / ' + process.content_freecode.content.length}
                                    color={courseComplete === process.content_freecode.content.length ? 'success' : 'secondary'}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            right: 8,
                                            top: 4,
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
                                        Bài học
                                        {/* {stepCurrent + 1} */}
                                    </Button>
                                </Badge>
                                <Badge
                                    badgeContent={commentCount[0]}
                                    onClick={() => openComment[1](true)}
                                    color="secondary"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            right: 24,
                                            top: 8,
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
                            </Box>}
                        />
                        :
                        <Box>
                            <TemplateForEditor.component
                                content={process.content_freecode.content[stepCurrent]}
                                contentNextStep={process.content_freecode.content[stepCurrent + 1]}
                                finalyResult={process.content_freecode.final_result}
                                lessonNumber={stepCurrent + 1}
                                onSubmit={handleSubmitLiveCode}
                                idPassed={lessonComplete[0][process.content_freecode.content[stepCurrent].id] ? true : false}
                                menuItemAddIn={<Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                    }}
                                >
                                    <Badge
                                        badgeContent={courseComplete + ' / ' + process.content_freecode.content.length}
                                        color={courseComplete === process.content_freecode.content.length ? 'success' : 'secondary'}
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                right: 8,
                                                top: 4,
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
                                            Bài học
                                        </Button>
                                    </Badge>
                                    <Badge
                                        badgeContent={commentCount[0]}
                                        onClick={() => openComment[1](true)}
                                        color="secondary"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                right: 24,
                                                top: 8,
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
                                </Box>}
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
                            templateVersion={TemplateForEditor.layout}
                            setStepCurrent={(step) => {
                                // if (step === 0 || lessonComplete[0][process?.content_freecode?.content?.[step - 1]?.id ?? '0']) {
                                setStepCurrent(step);
                                setDetailLesson(false);
                                // } else if (step !== 0) {
                                // window.showMessage('Vui lòng học lần lượt!.', 'error');
                                // }
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
                            lessonID={process?.content_freecode?.content[stepCurrent]?.id ?? 0}
                            courseID={courseLearningContext.course?.id ?? 0}
                        />
                    </DrawerCustom>
                </>
                : null
        }
    </Box >
    )
}

export default Freecodecamp

export interface LiveCodeContent extends CourseLessonProps {
    content_freecode: {
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

export interface FreecodeProcessLearning extends ProcessLearning {
    content_freecode?: {
        course_id: ID,
        title: string,
        description: string,
        template_version: TemplateVersion,
        final_result: string,
        content: Array<IContentTemplateCode>,
        complete: {
            [key: ID]: string,
        },
    }
}


function ContentOverviewLesson({ process, setStepCurrent, stepCurrent, lessonComplete, templateVersion }: {
    process: FreecodeProcessLearning,
    setStepCurrent: (step: number) => void,
    stepCurrent: number,
    lessonComplete: { [key: ID]: string },
    templateVersion: string
}) {

    const [openFinalResult, setOpenFinalResult] = React.useState(false);

    const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

    React.useEffect(() => {

        if (openFinalResult) {
            delayUntil(() => iframeRef.current?.contentWindow?.load, () => {
                if ((iframeRef.current as HTMLIFrameElement).contentWindow?.load) {
                    (iframeRef.current as HTMLIFrameElement).contentWindow?.load(process.content_freecode?.final_result);
                }
            })
        }

    }, [openFinalResult]);

    if (templateVersion !== 'new') {
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
            <Typography variant='h2' sx={{ lineHeight: 1.3 }}>{process.content_freecode?.title}</Typography>
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
                dangerouslySetInnerHTML={{ __html: process.content_freecode?.description ?? '' }}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexDirection: 'column', }}>
                <Typography variant='h3'>Bài học</Typography>
                {
                    process.content_freecode?.content ?
                        process.content_freecode?.content.map((item, index) => (
                            <Box
                                key={item.id}
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        opacity: 0.6,
                                    }
                                }}
                                onClick={() => {
                                    if (process.content_freecode?.content) {
                                        // if (process.content_freecode.content.findIndex(item => !lessonComplete[item.id]) === -1) {
                                        //     setStepCurrent(0);
                                        // } else {
                                        //     let i = 0;
                                        // for (i; i < process.content_freecode.content.length; i++) {
                                        //     if (!lessonComplete[process.content_freecode.content[i].id]) {
                                        setStepCurrent(index);
                                        // break;
                                        // }
                                        // }
                                        // }
                                    }
                                }}
                            >
                                {
                                    lessonComplete[item.id] ?
                                        <Icon renderVersion='CheckCircleRounded' icon="CheckCircleRounded" sx={{ flexShink: 0, color: 'success.main' }} />
                                        :
                                        <Icon renderVersion='RadioButtonUnchecked' icon="RadioButtonUnchecked" sx={{ flexShink: 0 }} />
                                }
                                <Typography
                                    sx={{
                                        color: stepCurrent === index ? 'primary.main' : 'inherit',
                                        fontSize: 18
                                    }}
                                >Bài {index + 1}: {item.title}</Typography>
                            </Box>
                        ))
                        :
                        null}
            </Box>
        </Box>);
    }

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
        <Typography variant='h2' sx={{ lineHeight: 1.3 }}>{process.content_freecode?.title}</Typography>
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
            dangerouslySetInnerHTML={{ __html: process.content_freecode?.description ?? '' }}
        />

        <Box sx={{
            display: 'flex',
            gap: 2,
        }}>
            {
                process.content_freecode?.final_result ?
                    <Button
                        variant='contained'
                        onClick={() => setOpenFinalResult(true)}
                    >
                        {
                            process.content_freecode?.content.findIndex(item => !lessonComplete[item.id]) === -1 ?
                                'Xem kết quả của bạn' : 'Xem kết quả cuối cùng'
                        }
                    </Button>
                    :
                    null
            }
            {
                process.content_freecode?.content ?
                    <Button
                        variant='contained'
                        onClick={() => {
                            if (process.content_freecode?.content) {
                                if (process.content_freecode.content.findIndex(item => !lessonComplete[item.id]) === -1) {
                                    setStepCurrent(0);
                                } else {
                                    let i = 0;
                                    for (i; i < process.content_freecode.content.length; i++) {
                                        if (!lessonComplete[process.content_freecode.content[i].id]) {
                                            setStepCurrent(i);
                                            break;
                                        }
                                    }
                                }
                            }
                        }}
                    >
                        {
                            process.content_freecode.content.findIndex(item => !lessonComplete[item.id]) > -1 ?
                                (process.content_freecode?.content?.[0] && lessonComplete[process.content_freecode?.content[0].id] ?
                                    'Tiếp tục học' : 'Bắt đầu') :
                                'Bắt đầu lại'
                        }
                    </Button>
                    : null
            }
        </Box>
        <Box sx={{ mt: 2 }}>
            <Typography variant='h3'>Bài học</Typography>
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
                    process.content_freecode?.content?.map((lesson, index) => (
                        <Box
                            key={index}
                            className={addClasses({
                                complete: lessonComplete[lesson.id] ? true : false,
                                active: stepCurrent === index,
                            })}
                            onClick={() => setStepCurrent(index)}
                            sx={(theme) => ({
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: 700,
                                fontSize: 32,
                                width: 64,
                                height: 64,
                                cursor: 'pointer',
                                borderRadius: 1,
                                border: '1px dashed',
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
                                    backgroundColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.15)' : 'divider',
                                    '&.complete': {
                                        color: 'white',
                                        backgroundColor: 'success.dark',
                                        '&:hover': {
                                            backgroundColor: 'success.main',
                                        }
                                    }
                                },
                            })}
                        >
                            {index + 1}
                        </Box>
                    ))
                }
            </Box>
        </Box>


        <DrawerCustom
            title={'Kết quả bài học: ' + process.content_freecode?.title}
            open={openFinalResult}
            onCloseOutsite
            width={990}
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

            <iframe
                // srcDoc={process.content_freecode?.final_result}
                src="/browser/new.html"
                ref={iframeRef}
                style={{
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    border: 'none',
                }}
            ></iframe>
        </DrawerCustom>

    </Box >)

}
