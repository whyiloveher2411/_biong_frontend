import { Box, Button, DialogContent, DialogContentText, IconButton, Theme, Typography, useTheme } from '@mui/material';
import DialogTitle from 'components/atoms/DialogTitle';
import Icon, { IconProps } from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import makeCSS from 'components/atoms/makeCSS';
import Tabs, { TabProps } from 'components/atoms/Tabs';
import Tooltip from 'components/atoms/Tooltip';
import Dialog from 'components/molecules/Dialog';
import { __ } from 'helpers/i18n';
import { getParamsFromUrl, getUrlParams, replaceUrlParam } from 'helpers/url';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import courseService, { ChapterAndLessonCurrentState, CourseLessonProps, CourseProps, DataForCourseCurrent, ProcessLearning } from 'services/courseService';
import eCommerceService from 'services/eCommerceService';
import elearningService from 'services/elearningService';
import Announcements from './Announcements';
import ReviewCourse from './ReviewCourse';
import LessonList from './SectionLearn/LessonList';
import SectionContentOfLesson from './SectionLearn/SectionContentOfLesson';
import SectionQA from './SectionQA';
import SectionVideoNote from './SectionVideoNote';

const useStyle = makeCSS((theme: Theme) => ({
    boxContentLesson: {
        position: 'relative',
        // minHeight: 'calc(100vh - 64px)',
        '&:hover $buttonControl': {
            opacity: '1',
            pointerEvents: 'unset',
        }
    },
    buttonControl: {
        transition: 'all 0.3s',
        opacity: '0',
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: 9999,
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'white',
        background: 'black',
        border: '1px solid #989ea9',
        '&:hover': {
            background: 'rgba(0,0,0,.5)',
        }
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px 0 16px',
        backgroundColor: theme.palette.header?.background ? theme.palette.header.background : theme.palette.primary.main,
        minHeight: 64,
        color: 'white',
        '& .MuiIconButton-root, & .MuiTypography-root': {
            color: 'white',
        }
    },
    transationShow: {
        animation: `animateShow 500ms ${theme.transitions.easing.easeInOut}`
    },
    tabContent: {
        padding: theme.spacing(3),
    }
}));

function SectionLearning({ slug, onClose }: {
    slug: string,
    onClose: () => void,
}) {

    const classes = useStyle();

    const theme: Theme = useTheme();

    const [chapterAndLessonCurrent, setChapterAndLessonCurrent] = React.useState<ChapterAndLessonCurrentState>({
        chapter: null,
        lesson: null,
        chapterIndex: -1,
        lessonIndex: -1,
        chapterID: -1,
        lessonID: -1,
    });

    const [openDialogReview, setOpenDialogReview] = React.useState(false);

    const [process, setProcess] = React.useState<ProcessLearning | null>(null);

    const navigate = useNavigate();

    const [data, setData] = React.useState<{
        course: CourseProps,
        isPurchased: boolean,
        type: {
            [key: string]: {
                title: string,
                icon: IconProps
            }
        },
        dataForCourseCurrent: DataForCourseCurrent,
    } | null>(null);

    React.useEffect(() => {
        // let timeOutDialog = setTimeout(() => {
        let courseFormDB = courseService.find(slug);
        let config = courseService.config();
        let checkPurchased = eCommerceService.checkPurchased(slug);
        let dataForCourseCurrent = courseService.getLessonCompleted(slug);

        Promise.all([courseFormDB, config, checkPurchased, dataForCourseCurrent]).then(([courseFormDB, config, checkPurchased, dataForCourseCurrent]) => {

            if (courseFormDB) {

                let position: LessonPosition[] = [];

                let positionOld: LessonPosition = {
                    chapter: '',
                    chapterIndex: 0,
                    id: 0,
                    lesson: '',
                    lessonIndex: 0,
                    stt: 0,
                    chapterID: -1,
                    lessonID: -1,
                };

                for (let i = 0; i < (courseFormDB.course_detail?.content?.length ?? 0); i++) {

                    courseFormDB.course_detail?.content?.[i]?.lessons.forEach((lesson, index) => {

                        lesson.stt = position.length;

                        if (dataForCourseCurrent.lesson_current + '' === lesson.id + '') {
                            positionOld = {
                                chapter: courseFormDB.course_detail?.content?.[i].code ?? '',
                                lesson: lesson.code,
                                chapterIndex: i,
                                lessonIndex: index,
                                id: lesson.id,
                                stt: i,
                                chapterID: courseFormDB.course_detail?.content?.[i].id ?? -1,
                                lessonID: lesson.id,
                            };
                        }

                        position.push({
                            chapter: courseFormDB.course_detail?.content?.[i].code ?? '',
                            lesson: lesson.code,
                            chapterIndex: i,
                            lessonIndex: index,
                            id: lesson.id,
                            stt: position.length,
                            chapterID: courseFormDB.course_detail?.content?.[i].id ?? -1,
                            lessonID: lesson.id,
                        })
                    });

                }

                window.__course_content = position;

                const chapterAndLessonUrl = getUrlParams(window.location.search, {
                    chapter: 0,
                    lesson: 0
                });

                if (positionOld.chapter && positionOld.lesson) {
                    handleChangeLesson({
                        chapter: positionOld.chapter,
                        chapterID: positionOld.chapterID,
                        chapterIndex: positionOld.chapterIndex,
                        lesson: positionOld.lesson,
                        lessonID: positionOld.lessonID,
                        lessonIndex: positionOld.lessonIndex,
                    });
                } else {
                    let indexOfChapter: number = chapterAndLessonUrl.chapter ? (courseFormDB.course_detail?.content?.findIndex(item => item.code === chapterAndLessonUrl.chapter) ?? 0) : 0;

                    if (indexOfChapter < 0) indexOfChapter = 0;

                    let chapterCode = courseFormDB.course_detail?.content?.[indexOfChapter]?.code as string;

                    let indexOfLesson = 0;

                    if (chapterAndLessonUrl.lesson) {
                        indexOfLesson = courseFormDB.course_detail?.content?.[indexOfChapter]?.lessons.findIndex(item => item.code === chapterAndLessonUrl.lesson) ?? 0;
                    }

                    if (indexOfLesson < 0) indexOfLesson = 0;

                    let lessonCode = courseFormDB.course_detail?.content?.[indexOfChapter].lessons[indexOfLesson].code as string;

                    handleChangeLesson({
                        chapter: chapterCode,
                        chapterID: courseFormDB.course_detail?.content?.[indexOfChapter].id ?? -1,
                        chapterIndex: indexOfChapter,
                        lesson: lessonCode,
                        lessonID: courseFormDB.course_detail?.content?.[indexOfChapter].lessons[indexOfLesson].id ?? -1,
                        lessonIndex: indexOfLesson
                    });
                }

                setData(() => ({
                    course: courseFormDB,
                    isPurchased: checkPurchased,
                    type: config?.type ?? {},
                    dataForCourseCurrent: dataForCourseCurrent,
                }));

            } else {
                // navigate('/course');
            }
        });
        // }, 400);

        return () => {
            // clearTimeout(timeOutDialog);
            delete window.__course_content;

            if (window.__course_auto_next_lesson) {
                clearTimeout(window.__course_auto_next_lesson);
                delete window.__course_auto_next_lesson;
            }
        };
    }, []);

    const handleChangeLesson = (data: ChapterAndLessonCurrentState) => {
        setChapterAndLessonCurrent(data);
    }

    React.useEffect(() => {

        if (chapterAndLessonCurrent.chapterIndex > -1) {
            navigate('?' + getParamsFromUrl(replaceUrlParam(window.location.href, {
                chapter: chapterAndLessonCurrent.chapter ?? '',
                lesson: chapterAndLessonCurrent.lesson ?? '',
            })));
        }

        (async () => {

            let process = await courseService.upLearningProcess(
                {
                    lesson: data?.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].lessons[chapterAndLessonCurrent.lessonIndex] ?? null,
                    chapter: data?.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].id ?? 0,
                    course: data?.course.id ?? 0,
                    chapter_stt: chapterAndLessonCurrent.chapterIndex,
                }
            );

            setProcess(process);
        })();

    }, [chapterAndLessonCurrent]);

    let positionPrevLesson: LessonPosition | null = null, positionNextLesson: LessonPosition | null = null;

    if (data && window.__course_content) {

        const positionCurrent = window.__course_content.findIndex((item: LessonPosition) => item.lessonIndex === chapterAndLessonCurrent.lessonIndex && item.chapterIndex === chapterAndLessonCurrent.chapterIndex);

        if (positionCurrent > 0) {
            positionPrevLesson = window.__course_content[positionCurrent - 1];
        }

        if (positionCurrent < (window.__course_content.length - 1)) {
            positionNextLesson = window.__course_content[positionCurrent + 1];
        }
    }

    const handleAutoCompleteLesson = (waitingTime = 0, isNextLesson = true) => {
        if (data?.course) {

            setChapterAndLessonCurrent(prev => {

                let positionCurrent: number = (window.__course_content as LessonPosition[]).findIndex(item => item.lesson === prev.lesson);

                const checkbox = (document.getElementById('course_lesson_' + prev.lesson) as HTMLInputElement);

                if (checkbox && !checkbox.checked) {
                    checkbox.click();
                }

                if (isNextLesson) {
                    if (positionCurrent < ((window.__course_content as LessonPosition[]).length - 1)) {
                        let positionNext = (window.__course_content as LessonPosition[])[positionCurrent + 1];

                        window.__course_auto_next_lesson = setTimeout(() => {
                            handleChangeLesson(
                                {
                                    chapter: positionNext.chapter,
                                    chapterID: positionNext.chapterID,
                                    chapterIndex: positionNext.chapterIndex,
                                    lesson: positionNext.lesson,
                                    lessonID: positionNext.lessonID,
                                    lessonIndex: positionNext.lessonIndex,
                                }
                            );
                        }, waitingTime);
                    }
                }
                return prev;
            });

        }
    }

    const handleClickInputCheckBoxLesson = (lesson: CourseLessonProps) => {
        if (data?.course) {
            (async () => {
                let complete_rate = await courseService.toggleLessonCompleted({
                    lesson_id: lesson.id,
                    lesson_code: lesson.code,
                    chapter_id: data.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].id ?? 0,
                    chapterIndex: chapterAndLessonCurrent.chapterIndex,
                    lessonIndex: chapterAndLessonCurrent.lessonIndex,
                    course: data.course.id ?? 0,
                    type: 'auto',
                });

                if ((complete_rate + '') === '100') {
                    let isReviewed = await elearningService.checkStudentReviewedOrNotYet(slug);

                    if (isReviewed !== null && !isReviewed) {
                        setOpenDialogReview(true);
                    }
                }
            })()
        }
    }

    const tabContentCourse: TabProps[] = data ? [
        {
            title: __('Notes'),
            key: 'notes',
            content: () => <Box className={classes.tabContent}><SectionVideoNote setChapterAndLessonCurrent={setChapterAndLessonCurrent} chapterAndLessonCurrent={chapterAndLessonCurrent} course={data.course} /></Box>,
        },
        {
            title: __('Q&A'),
            key: 'qa',
            content: () => <Box className={classes.tabContent}><SectionQA chapterAndLessonCurrent={chapterAndLessonCurrent} course={data.course} /></Box>,
        },
        {
            title: __('Announcements'),
            key: 'announcements',
            content: () => <Box className={classes.tabContent}><Announcements /></Box>
        },
        // {
        //     title: __('Interview'),
        //     key: 'interview',
        //     content: () => <Box className={classes.tabContent}><SectionInterview /></Box>
        // },
        // {
        //     title: __('Certificate'),
        //     key: 'certificate',
        //     content: () => <Box className={classes.tabContent}><SectionCertificate /></Box>
        // },
    ] : [];

    if (data) {
        return (
            <>
                <DialogTitle className={classes.header}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                        }}
                    >
                        <IconButton
                            onClick={onClose}
                            sx={{ color: 'white' }}
                        >
                            <Icon icon="ArrowBackIosRounded" />
                        </IconButton>
                        <hr style={{ width: 1, height: 64, margin: 0, border: '1px solid', borderColor: 'white', opacity: 0.1 }} />
                        <Link
                            to={'/course/' + data.course.slug}
                            onClick={onClose}
                        >
                            <Typography
                                variant="h5"
                            >
                                {data.course.title}
                            </Typography>
                        </Link>
                    </Box>
                    <Box
                        className={classes.transationShow}
                        sx={{
                            display: "flex",
                            gridGap: 16
                        }}
                    >

                        <Button
                            startIcon={<Icon icon="Star" />}
                            onClick={() => {
                                setOpenDialogReview(true);
                            }} sx={{ color: 'white', textTransform: 'none', fontWeight: 200 }}>
                            {__('Leave a rating')}
                        </Button>
                    </Box>
                </DialogTitle>
                <DialogContent className={'custom_scroll ' + classes.transationShow}
                    sx={{
                        width: '100%',
                        p: 0,
                    }}
                >
                    <DialogContentText
                        component="div"
                        style={{ height: '100%', margin: 0 }}
                    >
                        <div style={{ maxWidth: '100%', height: '100%', width: '100%', margin: '0 auto' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    mb: -5,
                                    flex: '1',
                                    width: '100%',
                                }}
                                id="popupLearning"
                            >
                                {
                                    chapterAndLessonCurrent.chapterIndex > -1 &&
                                    <LessonList handleChangeCompleteLesson={handleClickInputCheckBoxLesson} lessonComplete={data.dataForCourseCurrent.lesson_completed} handleChangeLesson={handleChangeLesson} course={data.course} type={data.type} chapterAndLessonCurrent={chapterAndLessonCurrent} />
                                }
                                <Box
                                    sx={{
                                        flex: '1',
                                        width: 'calc(100vw)',
                                        minHeight: 'calc( 100vh - 65px)',
                                        pl: '25%',
                                        pr: 0,
                                        background: theme.palette.body.background,
                                    }}
                                >
                                    <Box
                                        className={classes.boxContentLesson}
                                    >
                                        {
                                            positionPrevLesson !== null &&
                                            <Tooltip placement='right' title={data.course.course_detail?.content?.[positionPrevLesson.chapterIndex].lessons[positionPrevLesson.lessonIndex].title ?? ''}>
                                                <Button
                                                    className={classes.buttonControl}
                                                    sx={{
                                                        left: 10,
                                                    }}
                                                    onClick={() => {
                                                        if (positionPrevLesson) {
                                                            const chapter = data.course.course_detail?.content?.[positionPrevLesson.chapterIndex];
                                                            const lesson = data.course.course_detail?.content?.[positionPrevLesson.chapterIndex].lessons[positionPrevLesson.lessonIndex];

                                                            setChapterAndLessonCurrent({
                                                                chapter: chapter?.code ?? '',
                                                                chapterID: chapter?.id ?? -1,
                                                                chapterIndex: positionPrevLesson.chapterIndex,
                                                                lesson: lesson?.code ?? '',
                                                                lessonID: lesson?.id ?? -1,
                                                                lessonIndex: positionPrevLesson.lessonIndex,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Icon icon="ArrowBackIosNewRounded" />
                                                </Button>
                                            </Tooltip>
                                        }

                                        {
                                            positionNextLesson !== null &&
                                            <Tooltip placement='left' title={data.course.course_detail?.content?.[positionNextLesson.chapterIndex].lessons[positionNextLesson.lessonIndex].title ?? ''}>
                                                <Button
                                                    className={classes.buttonControl}
                                                    sx={{
                                                        right: 10,
                                                    }}
                                                    onClick={() => {
                                                        if (positionNextLesson) {

                                                            const chapter = data.course.course_detail?.content?.[positionNextLesson.chapterIndex];
                                                            const lesson = data.course.course_detail?.content?.[positionNextLesson.chapterIndex].lessons[positionNextLesson.lessonIndex];

                                                            setChapterAndLessonCurrent({
                                                                chapter: chapter?.code ?? '',
                                                                chapterID: chapter?.id ?? -1,
                                                                chapterIndex: positionNextLesson.chapterIndex,
                                                                lesson: lesson?.code ?? '',
                                                                lessonID: lesson?.id ?? -1,
                                                                lessonIndex: positionNextLesson.lessonIndex,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Icon icon="ArrowForwardIosRounded" />
                                                </Button>
                                            </Tooltip>
                                        }
                                        <SectionContentOfLesson handleAutoCompleteLesson={handleAutoCompleteLesson} process={process} chapterAndLessonCurrent={chapterAndLessonCurrent} course={data.course} />
                                    </Box>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            pl: 3,
                                            pr: 3,
                                            pb: 4,
                                        }}
                                    >
                                        <Tabs
                                            name='course_learn'
                                            tabIndex={1}
                                            isTabSticky={true}
                                            activeAutoScrollToTab
                                            backgroundTabWarper={theme.palette.body.background}
                                            tabs={tabContentCourse}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                            <Dialog
                                title={__('Review Course')}
                                open={openDialogReview}
                                onClose={() => setOpenDialogReview(false)}
                            >
                                <ReviewCourse
                                    course={data.course}
                                    handleAfterConfimReview={() => setOpenDialogReview(false)}
                                />
                            </Dialog>
                        </div>
                    </DialogContentText>
                </DialogContent>
            </>
        )
    }

    return <>
        <DialogTitle className={classes.header}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                }}
            >

                <IconButton
                    onClick={onClose}
                    sx={{ color: 'white' }}
                >
                    <Icon icon="ArrowBackIosRounded" />
                </IconButton>
                <hr style={{ width: 1, height: 64, margin: 0, border: '1px solid', borderColor: 'white', opacity: 0.1 }} />
            </Box>
        </DialogTitle>
        <DialogContent className="custom_scroll"
            sx={{
                width: '100%',
                p: 0,
            }}
        >
            <DialogContentText
                component="div"
                style={{ height: '100%', margin: 0 }}
            >
                <div style={{ maxWidth: '100%', height: '100%', width: '100%', margin: '0 auto' }}>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Loading open={true} isWarpper />
                    </Box>
                </div>
            </DialogContentText>
        </DialogContent>
    </>;
}

export default SectionLearning

export interface LessonPosition extends ChapterAndLessonCurrentState {
    id: ID,
    chapter: string
    chapterIndex: number,
    lesson: string,
    lessonIndex: number,
    stt: number,
}