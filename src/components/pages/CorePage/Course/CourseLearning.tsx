import { AppBar, Badge, Box, Button, CircularProgress, CircularProgressProps, IconButton, Theme, Typography, useTheme } from '@mui/material';
import ButtonGroup from 'components/atoms/ButtonGroup';
import Card from 'components/atoms/Card';
import Icon, { IconFormat, IconProps } from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import Tabs, { TabProps } from 'components/atoms/Tabs';
import Tooltip from 'components/atoms/Tooltip';
import { useWebBrowser } from 'components/atoms/WebBrowser';
import FieldForm from 'components/atoms/fields/FieldForm';
import makeCSS from 'components/atoms/makeCSS';
import Dialog from 'components/molecules/Dialog';
import DrawerCustom from 'components/molecules/DrawerCustom';
import Account from 'components/molecules/Header/Account';
import { shareButtons } from 'components/organisms/Footer';
import { detectDevTool } from 'helpers/customFunction';
import { convertHMS } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { numberWithSeparator } from 'helpers/number';
import { convertTimeStrToTimeInt } from 'helpers/string';
import { getParamsFromUrl, getUrlParams, replaceUrlParam } from 'helpers/url';
import useReaction from 'hook/useReaction';
import useReportPostType from 'hook/useReportPostType';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import courseService, { ChapterAndLessonCurrentState, CourseLessonProps, CourseProps, DataForCourseCurrent, ProcessLearning } from 'services/courseService';
import eCommerceService from 'services/eCommerceService';
import elearningService, { InstructorProps } from 'services/elearningService';
import { UserProps, UserState, updateBitPoint, useUser } from 'store/user/user.reducers';
import CourseTest from './components/CourseTest/CourseTest';
import ReviewCourse from './components/ReviewCourse';
import SectionChangelog from './components/SectionChangelog';
import SectionContentOutlineLesson from './components/SectionContentOutlineLesson';
import LessonList from './components/SectionLearn/LessonList';
import SectionContentOfLesson from './components/SectionLearn/SectionContentOfLesson';
import SectionQA from './components/SectionQA';
import SectionResourceLession from './components/SectionResourceLession';
import SectionVideoNote from './components/SectionVideoNote';
import CourseLearningContext from './context/CourseLearningContext';
import SectionCommentLesson from './components/SectionCommentLesson';
import useQuery from 'hook/useQuery';
import LessonListInAppBar from './components/SectionLearn/LessonListInAppBar';

const useStyle = makeCSS((theme: Theme) => ({
    boxContentLesson: {
        position: 'relative',
        width: '100%',
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
        zIndex: 1031,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px 0 16px',
        backgroundColor: theme.palette.mode === 'light' ? '#f1f3f4' : theme.palette.header.background,
        minHeight: 64,
        borderBottom: '1px solid ' + theme.palette.dividerDark,
    },
    transationShow: {
        animation: `animateShow 500ms ${theme.transitions.easing.easeInOut}`
    },
    tabContent: {
        padding: theme.spacing(3, 0, 3, 0),
    },
}));

function CourseLearning({ slug }: {
    slug: string,
}) {

    const user = useUser();

    const classes = useStyle();

    const theme: Theme = useTheme();

    const webBrowser = useWebBrowser();

    const [showChapterVideo, setShowChapterVideo] = React.useState(user.show_chapter_video === undefined || (user.show_chapter_video - 0) === 1 ? true : false);

    const [openMenuLessonList, setOpenMenuLessonList] = React.useState(!localStorage.getItem('openMenuLessonList') || localStorage.getItem('openMenuLessonList') === '1' ? true : false);

    React.useEffect(() => {
        localStorage.setItem('openMenuLessonList', openMenuLessonList ? '1' : '0');
    }, [openMenuLessonList]);

    const [chapterAndLessonCurrent, setStateChapterAndLessonCurrent] = React.useState<ChapterAndLessonCurrentState>({
        chapter: null,
        lesson: null,
        chapterIndex: -1,
        lessonIndex: -1,
        chapterID: -1,
        lessonID: -1,
    });

    const urlQuery = useQuery({
        tab_course_learn: '',
    });

    const [openDrawerTab, setOpenDrawerTab] = React.useState(-1);

    const chapterVideoRef = React.useRef<HTMLElement | null>(null);

    const [openDialogReview, setOpenDialogReview] = React.useState(false);

    const dispatch = useDispatch();

    const [openDialogShare, setOpenDialogShare] = React.useState(false);

    const [answerTest, setAnswerTest] = React.useState<{ [key: ID]: number }>({});

    const [process, setProcess] = React.useState<ProcessLearning | null>(null);

    const [completedData, setCompletedData] = React.useState({
        precent: 0,
        completed: 0,
        total: 0,
    });

    const [showLoading, setShowLoading] = React.useState(false);

    const [openTest, setOpenTest] = React.useState<ID | null>(null);

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


    const [timeNextLesson, setTimeNextLesson] = React.useState({
        open: false,
        time: 0,
    });

    const timeOutNextLesson = React.useRef<NodeJS.Timeout | null>(null);

    const footer = document.getElementById('footer-main');
    const shareBox = document.getElementById('share-box');

    if (footer) {
        footer.style.display = 'none';
        footer.style.zIndex = '-1';
    }

    if (shareBox) {
        shareBox.style.display = 'none';
        shareBox.style.zIndex = '-1';
    }

    const reactionHook = useReaction({
        post: {
            ...process,
            id: process?.lesson ?? 0,
            type: 'e_course_lesson',
        },
        reactionPostType: 'e_course_lesson_useful',
        keyReactionCurrent: 'my_reaction_type',
        reactionTypes: ['useful', 'not_useful'],
        afterReaction: (result) => {

            setProcess(prev => (prev ? {
                ...prev,
                my_reaction_type: result.my_reaction as ProcessLearning['my_reaction_type'],
                count_useful: result.summary?.useful?.count ?? 0,
                count_not_useful: result.summary?.not_useful?.count ?? 0,
            } : prev));
        },
    });

    const dialogReportLesson = useReportPostType({
        dataProps: {
            post: process?.lesson ?? 0,
            type: 'vn4_report_lesson',
        },
        reasonList: {
            'Kiến thức đã cũ': {
                title: __('Kiến thức đã cũ')
            },
            'Nội dung không đúng': {
                title: __('Nội dung không đúng')
            },
            'Vấn đề khác': {
                title: __('Vấn đề khác')
            },
        },
    })

    React.useEffect(() => {

        if (user._state !== UserState.identify) {
            navigate('/course/' + slug);
            return;
        }

        // let timeOutDialog = setTimeout(() => {
        let courseFormDB = courseService.find(slug);
        let config = courseService.config();
        let checkPurchased = eCommerceService.checkPurchased(slug);
        let dataForCourseCurrent = courseService.getLessonCompleted(slug);
        let reactions = courseService.me.reaction.getReactionOfCourse(slug);

        Promise.all([courseFormDB, config, checkPurchased, dataForCourseCurrent, reactions]).then(([courseFormDB, config, checkPurchased, dataForCourseCurrent, reactions]) => {

            if (!courseFormDB) {
                navigate('/');
                return;
            }

            if (courseFormDB.course_detail?.is_comming_soon) {
                navigate('/course/' + courseFormDB.slug);
                return;
            }

            if (!checkPurchased && !courseFormDB.course_detail?.is_allow_trial) {
                navigate('/course/' + courseFormDB.slug);
                return;
            }


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

                let lessonCode = courseFormDB.course_detail?.content?.[indexOfChapter]?.lessons[indexOfLesson]?.code as string;

                if (lessonCode) {
                    handleChangeLesson({
                        chapter: chapterCode,
                        chapterID: courseFormDB.course_detail?.content?.[indexOfChapter].id ?? -1,
                        chapterIndex: indexOfChapter,
                        lesson: lessonCode,
                        lessonID: courseFormDB.course_detail?.content?.[indexOfChapter]?.lessons[indexOfLesson].id ?? -1,
                        lessonIndex: indexOfLesson
                    });
                } else {
                    navigate('/course/' + slug);
                    window.showMessage('Khóa học đang được cập nhật.', 'warning');
                }
            }

            window.__course_reactions = reactions.reactions;
            setAnswerTest(reactions.answer_test ?? {});

            setData(() => ({
                course: courseFormDB,
                isPurchased: checkPurchased,
                type: config?.type ?? {},
                dataForCourseCurrent: dataForCourseCurrent,
            }));
        });

        // }, 400);

        detectDevTool();

        return () => {

            // clearTimeout(timeOutDialog);
            delete window.__course_content;
            delete window.__course_reactions;

            const footer = document.getElementById('footer-main');
            const shareBox = document.getElementById('share-box');

            if (footer) {
                footer.style.display = 'flex';
                footer.style.zIndex = '0';
            }

            if (shareBox) {
                shareBox.style.display = 'flex';
                shareBox.style.zIndex = '0';
            }

        };
    }, []);


    React.useEffect(() => {
        if (!openTest && data) {
            webBrowser.setTitle(
                (!data.isPurchased && data.course.course_detail?.is_allow_trial ? 'Học thử miễn phí ' : '') + data.course.title
            );
        }
    }, [openTest, data]);

    const setChapterAndLessonCurrent = (dataState: ChapterAndLessonCurrentState | ((param: ChapterAndLessonCurrentState) => ChapterAndLessonCurrentState), focusNextLesson = false) => {

        setStateChapterAndLessonCurrent(prev => {

            let lessonIndex: ChapterAndLessonCurrentState = prev;

            if (typeof dataState === 'function') {
                lessonIndex = dataState(prev);
            } else {
                lessonIndex = dataState;
            }

            if (data?.course.course_detail?.learn_step_by_step && !focusNextLesson && lessonIndex && data?.dataForCourseCurrent.lesson_completed && window.__course_content) {
                const findData = (window.__course_content as LessonPosition[]).findIndex(item => item.lesson === lessonIndex.lesson);

                if (findData > 0) {
                    if (!data?.dataForCourseCurrent.lesson_completed[window.__course_content[findData - 1].lessonID]) {
                        window.showMessage('Hoàn thành các bài học trước để mở khóa bài học này.', 'warning');
                        return prev;
                    }
                }

            }

            return lessonIndex;
        });


    }

    const handleChangeLesson = (lessonIndex: ChapterAndLessonCurrentState) => {

        if (chapterAndLessonCurrent.lessonID !== lessonIndex.lessonID) {

            setChapterAndLessonCurrent(lessonIndex);
            setTimeout(() => {
                let child = document.getElementById('lesson-list-' + lessonIndex.lessonID);

                if (child) {
                    let parent = child.parentElement;

                    if (parent) {
                        parent.scrollTo({ top: child.offsetTop - parent.offsetTop, behavior: "smooth" });
                    }
                }

                document.getElementById('course-learning-content')?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
                // now account for fixed header
                let scrolledY = window.scrollY + 64;

                if (scrolledY) {
                    window.scroll(0, scrolledY - (document.getElementById('course-learning-content')?.offsetHeight ?? 0));
                }
            }, 100);
        }
    }

    React.useEffect(() => {

        setShowLoading(true);
        setProcess(null);

        if (chapterAndLessonCurrent.chapterIndex > -1) {
            navigate('?' + getParamsFromUrl(replaceUrlParam(window.location.href, {
                chapter: chapterAndLessonCurrent.chapter ?? '',
                lesson: chapterAndLessonCurrent.lesson ?? '',
            })));
        }

        (async () => {

            let process = await courseService.upLearningProcess(
                {
                    lesson: data?.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons[chapterAndLessonCurrent.lessonIndex] ?? null,
                    chapter: data?.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].id ?? 0,
                    course: data?.course.id ?? 0,
                    chapter_stt: chapterAndLessonCurrent.chapterIndex,
                }
            );

            setCompletedData({
                precent: (process?.lesson_completed_count ?? 0) * 100 / (data?.course.course_detail?.total_lesson ?? 1),
                total: data?.course.course_detail?.total_lesson ?? 0,
                completed: process?.lesson_completed_count ?? 0,
            });
            setShowLoading(false);
            setProcess(process);

        })();

        document.getElementById('lesson-list-' + chapterAndLessonCurrent.lessonID)?.scrollIntoView({ behavior: 'smooth' });

        if (timeOutNextLesson.current) {
            clearTimeout(timeOutNextLesson.current);
        }

        setTimeNextLesson({
            open: false,
            time: 0,
        });

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

    const handleNextLesson = (focuseNextLesson = false) => {
        if (data?.course) {
            setChapterAndLessonCurrent(prev => {
                let positionCurrent: number = (window.__course_content as LessonPosition[]).findIndex(item => item.lesson === prev.lesson);

                if (positionCurrent < ((window.__course_content as LessonPosition[]).length - 1)) {
                    let positionNext = (window.__course_content as LessonPosition[])[positionCurrent + 1];
                    return {
                        chapter: positionNext.chapter,
                        chapterID: positionNext.chapterID,
                        chapterIndex: positionNext.chapterIndex,
                        lesson: positionNext.lesson,
                        lessonID: positionNext.lessonID,
                        lessonIndex: positionNext.lessonIndex,
                    };
                }
                return prev;
            }, focuseNextLesson);

        }
    }

    const handleClickInputCheckBoxLesson = (lesson: CourseLessonProps) => {
        if (data?.course) {
            if (!data.dataForCourseCurrent.lesson_completed[lesson.id]) {
                (async () => {
                    let completedData = await courseService.toggleLessonCompleted({
                        lesson_id: lesson.id,
                        lesson_code: lesson.code,
                        chapter_id: data.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].id ?? 0,
                        chapterIndex: chapterAndLessonCurrent.chapterIndex,
                        lessonIndex: chapterAndLessonCurrent.lessonIndex,
                        course: data.course.id ?? 0,
                        type: 'auto',
                    });

                    if (completedData.bit_point !== user.getBit()) {
                        dispatch(updateBitPoint(completedData.bit_point));
                        window.showMessage('Chúc mừng bạn vừa được thêm 50 bit, Hãy tiếp tục cố gắng nhé!', 'success');
                    }

                    setCompletedData({
                        completed: completedData.lesson_completed_count,
                        precent: completedData.completion_rate,
                        total: data?.course.course_detail?.total_lesson ?? 0
                    });

                    setData((prev) => (prev ? {
                        ...prev,
                        dataForCourseCurrent: {
                            ...prev.dataForCourseCurrent,
                            lesson_completed: completedData.lesson_completed
                        }
                    } : null));

                    if ((completedData.completion_rate + '') === '100') {
                        let isReviewed = await elearningService.checkStudentReviewedOrNotYet(slug);

                        if (isReviewed !== null && !isReviewed) {
                            setOpenDialogReview(true);
                        }
                    }
                })();
            }
        }
    }

    const tabContentCourse: TabProps[] = data ? [
        {
            title: __('Nội dung outline'),
            key: 'content-outline',
            content: () => <Box className={classes.tabContent}>
                <SectionContentOutlineLesson />
            </Box>,
        },
        {
            title: __('Ghi chú'),
            key: 'notes',
            content: () => <Box className={classes.tabContent}><SectionVideoNote setChapterAndLessonCurrent={setChapterAndLessonCurrent} chapterAndLessonCurrent={chapterAndLessonCurrent} course={data.course} /></Box>,
        },
        {
            title: __('Hỏi đáp'),
            key: 'qa',
            content: () => <Box className={classes.tabContent}><SectionQA chapterAndLessonCurrent={chapterAndLessonCurrent} course={data.course} /></Box>,
        },
        {
            title: <Badge
                badgeContent={process?.comment_count}
                color="secondary"
                sx={{
                    '& .MuiBadge-badge': {
                        right: -12
                    }
                }}
            >
                <Typography sx={{ color: 'inherit', }} component='span'> {__('Thảo luận')}
                </Typography>
            </Badge>,
            key: 'comment',
            content: () => <Box className={classes.tabContent}><SectionCommentLesson
                course={data.course}
                onClickQuestionButton={() => {
                    if (user.getThemeLearningTab() === 'drawer') {
                        setOpenDrawerTab(2);
                    }
                    urlQuery.changeQuery({
                        tab_course_learn: 'qa',
                    });
                }}
            /></Box>,
        },
        {
            title: <Badge
                badgeContent={
                    (data.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons[chapterAndLessonCurrent.lessonIndex].resources?.length ?? 0)
                    + (data.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons[chapterAndLessonCurrent.lessonIndex].tests?.length ?? 0)
                    + (data.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons[chapterAndLessonCurrent.lessonIndex].reference_post?.length ?? 0)
                }
                color="secondary"
                sx={{
                    '& .MuiBadge-badge': {
                        right: -12
                    }
                }}
            >
                <Typography sx={{ color: 'inherit', }} component='span'> {__('Tài nguyên')}
                </Typography>
            </Badge>,
            key: 'resources',
            content: () => <Box className={classes.tabContent}><SectionResourceLession course={data.course} chapterAndLessonCurrent={chapterAndLessonCurrent} /></Box>,
        },
        // {
        //     key: 'test',
        //     title: <Badge badgeContent={data.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons[chapterAndLessonCurrent.lessonIndex].tests?.length ?? 0} color="secondary" sx={{ '& .MuiBadge-badge': { right: 10 } }}><Typography sx={{ paddingRight: data.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons[chapterAndLessonCurrent.lessonIndex].tests?.length ? 2 : 0, color: 'inherit', }} component='span'> {__('Bài tập')} </Typography></Badge>,
        //     content: () => <Box className={classes.tabContent}><SectionTest course={data.course} chapterAndLessonCurrent={chapterAndLessonCurrent} /></Box>
        // },
        // {
        //     key: 'reference-post',
        //     title: <Badge badgeContent={data.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons[chapterAndLessonCurrent.lessonIndex].reference_post?.length ?? 0} color="secondary" sx={{ '& .MuiBadge-badge': { right: 10 } }}><Typography sx={{ paddingRight: data.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons[chapterAndLessonCurrent.lessonIndex].reference_post?.length ? 2 : 0, color: 'inherit', }} component='span'> {__('Bài viết tham khảo')} </Typography></Badge>,
        //     content: () => <Box className={classes.tabContent}><SectionReferencePost course={data.course} chapterAndLessonCurrent={chapterAndLessonCurrent} /></Box>
        // },
        {
            key: 'changelog',
            title: __('Nhật ký thay đổi'),
            content: () => <Box className={classes.tabContent}><SectionChangelog course={data.course} /></Box>
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

        const lessonCurrent = data.course?.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons?.[chapterAndLessonCurrent.lessonIndex];

        const toggleOpenVideoChapter = () => {
            setShowChapterVideo(prev => {
                courseService.me.settingAccount.changeSettingShowVideoChapter(!prev);
                return !prev;
            });
        }
        return (
            <CourseLearningContext.Provider
                value={{
                    course: data.course,
                    chapterAndLessonCurrent: chapterAndLessonCurrent,
                    LessonList: {
                        open: openMenuLessonList,
                        onToggle: () => {
                            setOpenMenuLessonList(prev => !prev);
                        }
                    },
                    nexLesson: (focusNextLesson = false) => {
                        if (focusNextLesson) {
                            handleNextLesson(focusNextLesson);
                        } else {
                            if (getAutolayNextLesson()) {
                                setTimeNextLesson({
                                    open: true,
                                    time: 0,
                                });

                                setTimeout(() => {
                                    setTimeNextLesson({
                                        open: true,
                                        time: 100,
                                    });

                                    if (timeOutNextLesson.current) {
                                        clearTimeout(timeOutNextLesson.current);
                                    }

                                    timeOutNextLesson.current = setTimeout(() => {
                                        handleNextLesson(true);
                                        timeOutNextLesson.current = null;
                                    }, 10100);

                                }, 100);
                            } else {
                                setTimeout(() => {
                                    setTimeNextLesson({
                                        open: true,
                                        time: 100,
                                    });
                                }, 100);
                            }
                        }
                    },
                    setAutoplayNextLesson: (value: boolean) => {
                        courseService.me.settingAccount.changeSettingAutoplayNextLesson(value);
                        window.___AutoNextLesson = value;
                    },
                    toggleOpenVideoChapter: toggleOpenVideoChapter,
                    handleChangeLesson: handleChangeLesson,
                    isPurchased: data.isPurchased,
                    openTest: (id: ID | null) => {
                        setOpenTest(id);
                        if (window.__hls?.player) {
                            if (id && !window.__hls?.player.paused()) {
                                window.__playingvideo = true;
                                window.__hls?.player.pause();
                                setTimeout(() => {
                                    window.__hls?.player.pause();
                                }, 1000);
                            } else {
                                if (!id && window.__playingvideo) {
                                    window.__playingvideo = null;
                                    window.__hls.player.play();
                                }
                            }
                        }
                    },
                    answerTest: answerTest,
                    addAnswerTest: (id: ID) => {
                        setAnswerTest(prev => ({ ...prev, [id]: 1 }));
                    },
                    handleClickInputCheckBoxLesson: handleClickInputCheckBoxLesson,
                    dataForCourseCurrent: data.dataForCourseCurrent,
                    chapterVideoRef: chapterVideoRef,
                    positionPrevLesson: positionPrevLesson,
                    positionNextLesson: positionNextLesson,
                    iconTypeLesson: data.type,
                }}
            >
                <AppBar elevation={0} color='inherit' className={classes.header}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            maxWidth: '50%',
                            gap: 1,
                        }}
                    >
                        <IconButton
                            // onClick={onClose}
                            onClick={() => {
                                if (window.__linkBackCourseLearning) {
                                    navigate(window.__linkBackCourseLearning);
                                    return;
                                }
                                navigate('/course/' + data.course.slug);
                            }}
                        >
                            <Icon icon="ArrowBackIosRounded" />
                        </IconButton>
                        {/* <hr style={{ width: 1, height: 64, margin: 0, border: '1px solid', borderColor: 'white', opacity: 0.1 }} /> */}
                        <Typography
                            component={Link}
                            to={'/course/' + data.course.slug}
                            variant="h5"
                            noWrap
                            sx={{
                                fontWeight: 400,
                                fontSize: 18,
                                letterSpacing: '0.3px',
                            }}
                        >
                            {data.course.title}
                        </Typography>
                        -
                        <LessonListInAppBar />
                    </Box>
                    <Box
                        className={classes.transationShow}
                        sx={{
                            display: "flex",
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <Button
                            color='inherit'
                            startIcon={<CircularProgressWithLabel value={completedData.precent} />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 400,
                                cursor: 'inherit',
                            }}>
                            {__('{{completed}}/{{total}} hoàn thành', {
                                completed: (data.course.course_detail?.content?.reduce((count, chapter) => count + chapter.lessons.reduce((count2, lesson) => count2 + (data.dataForCourseCurrent.lesson_completed?.[lesson.id] ? 1 : 0), 0), 0) as number),
                                total: completedData.total,
                            })}
                        </Button>
                        {
                            data.isPurchased &&
                            <Button
                                color='inherit'
                                startIcon={<Icon sx={{ color: '#faaf00' }} icon="Star" />}
                                onClick={() => {
                                    setOpenDialogReview(true);
                                }} sx={{ textTransform: 'none', fontWeight: 400 }}>
                                {__('Đánh giá khóa học')}
                            </Button>
                        }
                        <Button
                            color='inherit'
                            endIcon={<Icon icon="ShareOutlined" />}
                            sx={{ textTransform: 'none', fontWeight: 400 }}
                            onClick={() => setOpenDialogShare(true)}
                        >
                            {__('Chia sẽ')}
                        </Button>

                        <Account />

                        <Dialog
                            title={__('Chia sẽ khóa học này')}
                            open={openDialogShare}
                            onClose={() => setOpenDialogShare(false)}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    height: 48,
                                }}
                            >
                                <FieldForm
                                    component='text'
                                    config={{
                                        title: false,
                                        inputProps: {
                                            readOnly: true,
                                            sx: {
                                                borderRadius: '4px 0 0 4px',
                                                height: 48,
                                            }
                                        },
                                        size: 'medium',
                                    }}
                                    name="link_share"
                                    post={{
                                        link_share: window.location.href.split('/learning')[0],
                                    }}
                                />
                                <Button
                                    variant='contained'
                                    size='medium'
                                    sx={{
                                        borderRadius: '0px 4px 4px 0',
                                    }}
                                    onClick={() => {
                                        let item = window.location.href.split('/learning')[0];
                                        navigator.clipboard.writeText(item);
                                        window.showMessage(__('Đã sao chép liên kết vào bộ nhớ tạm.'), 'info');
                                    }}
                                >{__('Sao chép')}</Button>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 1,
                                    mt: 2,
                                }}
                            >
                                {
                                    shareButtons.filter((_it, i) => i !== 1).map((item, index) => (
                                        <Tooltip
                                            key={index}
                                            title={item.name}
                                            placement="bottom"
                                            arrow
                                        >
                                            <IconButton
                                                size='large'
                                                sx={{
                                                    border: '1px solid',
                                                    borderColor: theme.palette.dividerDark,
                                                    color: item.color,
                                                }}
                                                onClick={() => {
                                                    const url = window.location.href.split('/learning')[0];
                                                    item.onClick(url)
                                                }}
                                            >
                                                <Icon icon={item.icon} />
                                            </IconButton>
                                        </Tooltip>
                                    ))
                                }
                            </Box>
                        </Dialog>

                        {/* <MoreButton
                            actions={[
                                {
                                    email: {
                                        title: 'Nhận thông báo qua email',
                                        action: () => {
                                            //
                                        }
                                    },
                                    promotional: {
                                        title: 'Nhận khuyến mãi qua email',
                                        action: () => {
                                            //
                                        }
                                    }
                                }
                            ]}
                        /> */}

                    </Box>
                </AppBar>
                <Box className={classes.transationShow}
                    sx={{
                        width: '100%',
                        p: 0,
                        zIndex: 1030,
                        position: 'relative',
                    }}
                >
                    <Box
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
                                    <LessonList
                                        // handleChangeCompleteLesson={handleClickInputCheckBoxLesson}
                                        lessonComplete={data.dataForCourseCurrent.lesson_completed}
                                        handleChangeLesson={handleChangeLesson}
                                        course={data.course}
                                        type={data.type}
                                        chapterAndLessonCurrent={chapterAndLessonCurrent}
                                        isPurchased={data.isPurchased}
                                    />
                                }
                                <Box
                                    id="course-learning-content"
                                    sx={{
                                        flex: '1',
                                        width: 'calc(100vw)',
                                        minHeight: 'calc( 100vh - 65px)',
                                        transition: 'all 0.3s',
                                        pl: user.getThemeLearning() === 'main_right' ?
                                            (openMenuLessonList ? '400px' : '0') : 0
                                        ,
                                        pr: user.getThemeLearning() === 'main_left' ?
                                            (openMenuLessonList ? '400px' : '0') : 0,
                                        background: theme.palette.mode === 'light' ? '#F0F2F5' : theme.palette.body.background,
                                        overflow: 'hidden',
                                        '& .section-course-tab': {
                                            pl: 0,
                                            pr: 0,
                                            borderTop: '1px solid',
                                            borderColor: 'dividerDark',
                                            ...(user.getThemeLearningTab() === 'drawer' ?
                                                {
                                                    pb: 0,
                                                    position: 'fixed',
                                                    bottom: -2,
                                                    p: 0,
                                                    ...(user.getThemeLearning() === 'main_left' ? {
                                                        left: 0,
                                                        right: openMenuLessonList ? '400px' : 0,
                                                        width: 'auto',
                                                    } : {
                                                        left: openMenuLessonList ? '400px' : 0,
                                                        right: '0',
                                                        width: 'auto',
                                                    })
                                                } :
                                                {
                                                    pb: 1,
                                                }
                                            )
                                        },
                                        '& .MuiTabs-flexContainer': {
                                            pl: 3,
                                            pr: 3,
                                        },
                                        '& .section-course-tab .tabItems': {
                                            pr: openMenuLessonList ? 0 : 4,
                                            pl: openMenuLessonList ? 0 : 4,
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            overflow: 'hidden',
                                            overflowY: 'overlay',
                                            height: user.getThemeLearningTab() === 'drawer' ? 'calc(100vh - 112px)' : 'calc(100vh - 64px)',

                                        }}
                                        className="custom_scroll custom autoHiden"
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: user.getThemeLearning() === 'main_left' ? 'row-reverse' : 'unset'
                                            }}
                                        >
                                            <Box
                                                className={classes.boxContentLesson}
                                            >
                                                {
                                                    positionNextLesson !== null && timeNextLesson.open &&
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            zIndex: '1031',
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            transform: 'translateY(-18px)',
                                                            '&:before': {
                                                                content: '""',
                                                                display: 'block',
                                                                position: 'absolute',
                                                                zIndex: '-1',
                                                                width: '100%',
                                                                height: 'calc(100% + 18px)',
                                                                background: 'black',
                                                                opacity: 0.6,
                                                            }
                                                        }}
                                                    >
                                                        <Typography sx={{ color: 'white', mb: 1, }}>{__('Bài tiếp theo')}</Typography>
                                                        <Typography sx={{ color: 'white', mb: 2, }} variant='h2'>{data.course.course_detail?.content?.[positionNextLesson.chapterIndex]?.lessons[positionNextLesson.lessonIndex].title ?? ''}</Typography>
                                                        <Box
                                                            sx={{
                                                                position: 'relative',
                                                                height: 80,
                                                                mb: 1,
                                                            }}
                                                        >
                                                            <CircularProgress
                                                                variant="determinate"
                                                                value={timeNextLesson.time} size={80}
                                                                sx={{
                                                                    cursor: 'pointer',
                                                                    color: 'white',
                                                                    position: 'relative',
                                                                    zIndex: 2,
                                                                    '& .MuiCircularProgress-circle': {
                                                                        transition: 'stroke-dashoffset 10000ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
                                                                    }
                                                                }}
                                                                onClick={() => {
                                                                    setTimeNextLesson({
                                                                        open: false,
                                                                        time: 0,
                                                                    });
                                                                    if (timeOutNextLesson.current) {
                                                                        clearTimeout(timeOutNextLesson.current);
                                                                    }
                                                                    handleNextLesson(true);
                                                                }}
                                                            />
                                                            <Icon icon="PlayArrowRounded"
                                                                sx={{
                                                                    color: 'white',
                                                                    position: 'absolute',
                                                                    top: '50%',
                                                                    left: '50%',
                                                                    transform: 'translate(-50%, -50%)',
                                                                    width: '65px',
                                                                    height: '65px',
                                                                    zIndex: 1,
                                                                }}
                                                            />
                                                        </Box>
                                                        <Button
                                                            onClick={() => {
                                                                setTimeNextLesson({
                                                                    open: false,
                                                                    time: 0,
                                                                });
                                                                if (timeOutNextLesson.current) {
                                                                    clearTimeout(timeOutNextLesson.current);
                                                                }
                                                            }}
                                                            sx={{ color: 'white' }}>{__('Hủy bỏ')}</Button>
                                                    </Box>
                                                }

                                                <Box
                                                    id="uid_video"
                                                    style={{
                                                        display: 'block',
                                                        background: 'rgba(0, 0 ,0 , 0.53)',
                                                        padding: '5px',
                                                        zIndex: '99999',
                                                        opacity: '1',
                                                        fontWeight: 'bold',
                                                        borderRadius: '8px',
                                                        color: 'white',
                                                        top: '10px',
                                                        left: '1px',
                                                        pointerEvents: 'none',
                                                        fontSize: '16px',
                                                        whiteSpace: 'nowrap',
                                                        position: 'absolute',
                                                        height: 'auto',
                                                        visibility: 'visible',
                                                        width: 'auto',
                                                        border: 'none',
                                                    }}
                                                >
                                                    <img
                                                        style={{
                                                            margin: '0 auto 8px',
                                                            height: '33px',
                                                            display: 'block',
                                                            marginBottom: '8px',
                                                        }}
                                                        src="/images/LOGO-image-full.svg"
                                                    />
                                                    UID: {user.id}
                                                </Box>
                                                <SectionContentOfLesson
                                                    process={process}
                                                    chapterAndLessonCurrent={chapterAndLessonCurrent}
                                                    course={data.course}
                                                    isPurchased={data.isPurchased}
                                                />

                                                {
                                                    showLoading &&
                                                    <>
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                backgroundColor: 'dividerDark',
                                                                opacity: 0.3,
                                                                zIndex: 2,
                                                            }}
                                                        />
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                position: 'absolute',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                zIndex: 3,
                                                            }}
                                                        >
                                                            <Loading isWarpper open={true} />
                                                        </Box>
                                                    </>
                                                }
                                            </Box>
                                            {
                                                Boolean(lessonCurrent?.type === 'video' && lessonCurrent.chapter_video?.length) &&
                                                <Card
                                                    sx={{
                                                        width: 340,
                                                        flexShrink: 0,
                                                        position: 'relative',
                                                        borderRadius: 0,
                                                        display: showChapterVideo ? 'flex' : 'none',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            pl: 2,
                                                            pt: 1,
                                                            pb: 1,
                                                        }}
                                                    >
                                                        <Typography sx={{ fontSize: 18, fontWeight: 400 }} variant="h5" component="div">
                                                            Nội dung video
                                                        </Typography>
                                                        <IconButton
                                                            onClick={toggleOpenVideoChapter}
                                                        >
                                                            <Icon icon="ClearRounded" />
                                                        </IconButton>
                                                    </Box>
                                                    <Box
                                                        className='custom custom_scroll'
                                                        sx={{
                                                            position: 'relative',
                                                            overflowY: 'overlay',
                                                            flexGrow: 1,
                                                        }}
                                                    >
                                                        <Box
                                                            ref={chapterVideoRef}
                                                            sx={{
                                                                position: 'absolute',
                                                                top: '0',
                                                                width: '100%',
                                                            }}
                                                        >
                                                            {
                                                                (lessonCurrent as CourseLessonProps).chapter_video?.map((chapter, index) => (
                                                                    <ChapterVideoItem
                                                                        key={(lessonCurrent as CourseLessonProps).id + '-' + index}
                                                                        lesson={lessonCurrent as CourseLessonProps}
                                                                        chapter={chapter}
                                                                        index={index + 1}
                                                                        onClick={(timeInt) => {
                                                                            if (window.__hls?.player) {
                                                                                window.__hls?.player.currentTime(timeInt);
                                                                                if (window.__hls?.player.paused()) {
                                                                                    window.__hls?.player.play();
                                                                                }
                                                                            }
                                                                            if (timeOutNextLesson.current) {
                                                                                clearTimeout(timeOutNextLesson.current);
                                                                            }

                                                                            setTimeNextLesson({
                                                                                open: false,
                                                                                time: 0,
                                                                            });

                                                                        }}
                                                                    />
                                                                ))
                                                            }
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            }
                                        </Box>


                                        {
                                            Boolean(data.isPurchased || data.course?.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons?.[chapterAndLessonCurrent.lessonIndex].is_allow_trial) &&
                                            <Box
                                                className='section-course-tab'
                                                sx={{
                                                    width: '100%',
                                                    pl: 3,
                                                    pr: 3,
                                                    pb: 4,
                                                    transition: 'right 0.3s, left 0.3s',
                                                    '& .MuiTabs-root, & .MuiTabs-scroller': {
                                                        overflow: 'unset',
                                                    }
                                                }}
                                            >
                                                <Tabs
                                                    name='course_learn'
                                                    tabIndex={0}
                                                    isTabSticky
                                                    positionSticky={0}
                                                    activeAutoScrollToTab
                                                    backgroundTabWarper={theme.palette.body.background}
                                                    tabs={tabContentCourse}
                                                    changeUrlWhenOnChange
                                                    onChangeTab={(indexTab) => {
                                                        if (user.getThemeLearningTab() === 'drawer') {
                                                            setOpenDrawerTab(indexTab);
                                                        }
                                                    }}
                                                    hiddenContent={user.getThemeLearningTab() === 'drawer'}
                                                    menuItemAddIn={<Box
                                                        sx={{
                                                            display: 'flex',
                                                            marginLeft: 'auto',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <Typography>Bạn có thấy bài học này hữu ích không?</Typography>

                                                        <ButtonGroup
                                                            variant='text'
                                                            size='large'
                                                            color='inherit'
                                                            disableRipple
                                                            sx={{
                                                                '& .MuiButtonGroup-grouped:not(:last-of-type)': {
                                                                    borderRightColor: 'transparent',
                                                                }
                                                            }}
                                                        >
                                                            <Tooltip title="Bài học hữu ích">
                                                                <Button
                                                                    color={
                                                                        process?.my_reaction_type === 'useful' ? 'primary' : 'inherit'
                                                                    }
                                                                    onClick={() => {
                                                                        reactionHook.handleReactionClick(chapterAndLessonCurrent.lessonID, process?.my_reaction_type === 'useful' ? '' : 'useful');
                                                                    }}
                                                                    sx={{ lineHeight: '18px', }}
                                                                >
                                                                    <Icon sx={{ fontSize: 18, }} icon="ThumbUpAltOutlined" />
                                                                    {
                                                                        process?.count_useful ? <>&nbsp;&nbsp;{numberWithSeparator(process.count_useful)}</> : null
                                                                    }
                                                                </Button>
                                                            </Tooltip>
                                                            <Tooltip title="Bài học không hữu ích">
                                                                <Button
                                                                    color={
                                                                        process?.my_reaction_type === 'not_useful' ? 'primary' : 'inherit'
                                                                    }
                                                                    onClick={() => {
                                                                        reactionHook.handleReactionClick(chapterAndLessonCurrent.lessonID, process?.my_reaction_type === 'not_useful' ? '' : 'not_useful');
                                                                    }}
                                                                    sx={{ lineHeight: '18px', }}
                                                                >
                                                                    <Icon sx={{ fontSize: 18, }} icon="ThumbDownAltOutlined" />
                                                                </Button>
                                                            </Tooltip>
                                                        </ButtonGroup>
                                                        <Button
                                                            size='small'
                                                            startIcon={<Icon icon="BugReportOutlined" />}
                                                            sx={{ lineHeight: '26px', textTransform: 'unset' }}
                                                            color='inherit'
                                                            onClick={() => {
                                                                dialogReportLesson.open();
                                                            }}
                                                        >
                                                            Báo lỗi
                                                        </Button>
                                                    </Box>}
                                                />
                                                {
                                                    user.getThemeLearningTab() === 'drawer' &&
                                                    <DrawerCustom
                                                        open={tabContentCourse[openDrawerTab] !== undefined}
                                                        onClose={() => setOpenDrawerTab(-1)}
                                                        onCloseOutsite
                                                        title={tabContentCourse[openDrawerTab]?.title ?? '...'}
                                                        width={800}
                                                        restDialogContent={{
                                                            sx: {
                                                                backgroundColor: theme.palette.mode === 'light' ? '#F0F2F5' : theme.palette.body.background
                                                            }
                                                        }}
                                                    >
                                                        {
                                                            tabContentCourse[openDrawerTab] !== undefined ?
                                                                tabContentCourse[openDrawerTab].content(null)
                                                                :
                                                                <></>
                                                        }
                                                    </DrawerCustom>
                                                }
                                            </Box>
                                        }
                                    </Box>
                                </Box>
                            </Box>
                            <ReviewCourse
                                open={openDialogReview}
                                onClose={() => setOpenDialogReview(false)}
                                course={data.course}
                                handleAfterConfimReview={() => setOpenDialogReview(false)}
                            />
                        </div>
                    </Box>
                </Box >
                <CourseTest testId={openTest} />
                {
                    dialogReportLesson.component
                }
            </CourseLearningContext.Provider >
        )
    }

    return <>
        <AppBar elevation={0} color='inherit' className={classes.header}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                }}
            >

                <IconButton
                    // onClick={onClose}
                    sx={{ color: 'white' }}
                >
                    <Icon icon="ArrowBackIosRounded" />
                </IconButton>
                <hr style={{ width: 1, height: 64, margin: 0, border: '1px solid', borderColor: 'white', opacity: 0.1 }} />
            </Box>
        </AppBar>
        <Box
            sx={{
                width: '100%',
                height: 'calc(100vh - 64px)',
                p: 0,
            }}
        >
            <Box
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
            </Box>
        </Box>
    </>;
}

export default CourseLearning

export interface LessonPosition extends ChapterAndLessonCurrentState {
    id: ID,
    chapter: string
    chapterIndex: number,
    lesson: string,
    lessonIndex: number,
    stt: number,
}

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                sx={{
                    color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                    position: 'absolute',
                    left: 0,
                }}
                thickness={4}
                value={100}
            />
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* <Icon className="icon-emoj" icon="EmojiEventsOutlined" /> */}
                <Typography
                    variant="caption"
                    component="div"
                    className="text-precent"
                    color="text.secondary"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

export function getAutolayNextLesson() {
    return window.___AutoNextLesson !== undefined ? window.___AutoNextLesson : true;
}

export function checkHasUElementLogo(uiid: HTMLElement, user: UserProps) {
    if (
        uiid.style.zIndex === '99999'
        && uiid.style.opacity === '1'
        && uiid.style.display === 'block'
        && uiid.style.background === 'rgba(0, 0, 0, 0.53)'
        && uiid.style.padding === '5px'
        && uiid.style.fontWeight === 'bold'
        && uiid.style.borderRadius === '8px'
        && uiid.style.color === 'white'
        && uiid.style.pointerEvents === 'none'
        && uiid.style.top === '10px'
        && uiid.style.left === '1px'
        && uiid.style.fontSize === '16px'
        && uiid.style.whiteSpace === 'nowrap'
        && uiid.style.position === 'absolute'
        && uiid.style.visibility === 'visible'
        && uiid.style.width === 'auto'
        && uiid.style.height === 'auto'
        && uiid.style.bottom === ''
        && uiid.textContent === ('UID: ' + user.id + '')
    ) {
        //@ts-ignore
        if (!uiid.checkVisibility || uiid.checkVisibility({
            checkOpacity: true,  // Check CSS opacity property too
            checkVisibilityCSS: true // Check CSS visibility property too
        })) {
            return true;
        }
    }

    return false;

}

function ChapterVideoItem({ lesson, chapter, index, onClick }: {
    index: number,
    chapter: {
        title: string;
        start_time: string;
    },
    onClick: (time: number) => void,
    lesson: CourseLessonProps
}) {

    let timeInt = convertTimeStrToTimeInt(chapter.start_time);

    const title = (index + '').padStart(2, '0') + '. ' + chapter.title;

    let screen2: number | null = null;
    let index2: number | null = null;

    if (lesson.playerStoryboardSpecRenderer?.total && lesson.time) {
        const indexImage = Math.round(timeInt * (lesson.playerStoryboardSpecRenderer?.total ?? 1) / (Number(lesson.time) ?? 1));
        screen2 = Math.floor(indexImage / 25)
        index2 = indexImage % 25;
    }

    return <Box
        data-time={timeInt}
        data-title={title}
        className="chapterVideoItem"
        sx={{
            p: 2,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            cursor: 'pointer',
            '&.active, &:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
            }
        }}
        onClick={() => onClick(timeInt)}
    >
        {
            Boolean(screen2 !== null && index2 !== null) &&
            <Box
                sx={{
                    width: 100,
                    height: 56.25,
                    backgroundImage: 'url(' + lesson.playerStoryboardSpecRenderer?.url2.replace('##', screen2 + '') + ')',
                    backgroundSize: '500px 281.25px',
                    backgroundPosition: '-' + ((index2 as number) % 5 * 100) + 'px -' + (Math.floor((index2 as number) / 5) * 56.25) + 'px',
                    borderRadius: '8px',
                }}
            />
        }
        <Box>
            <Typography variant='h5' sx={{ mb: 0.5, fontSize: 16, lineHeight: '24px', }}>{title}</Typography>
            <Typography
                sx={(theme) => ({
                    padding: '2px 6px',
                    borderRadius: '2px',
                    color: theme.palette.mode === 'light' ? '#065fd4' : '#3ea6ff',
                    backgroundColor: theme.palette.mode === 'light' ? '#def1ff' : '#263850',
                    textTransform: 'uppercase',
                    fontSize: 12,
                    lineHeight: '1.8rem',
                    fontWeight: 500,
                    display: 'inline-block',
                })}>{convertHMS(timeInt) ?? '00:00'}</Typography>
        </Box>
    </Box>
}




export function getLabelInstructor(type: string): {
    title?: string,
    icon?: IconFormat,
    color: string,
} {
    switch (type) {
        case 'Teacher':
            return {
                title: __('Giảng viên'),
                icon: 'BookmarksOutlined',
                color: '#ed6c02',
            };
        case 'Mentor':
            return {
                title: __('Trợ giảng'),
                icon: 'PriorityHighRounded',
                color: '#3f51b5',
            };
        case 'Product Owner':
            return {
                title: __('Chủ sở hữu khóa học'),
                icon: 'Star',
                color: '#8204d9',
            };
        default:
            return {
                color: 'transparent',
            };
    }
}


export const useInstructors = (courseID: ID) => {

    const [instructors, setInstructors] = React.useState<{ [key: ID]: InstructorProps }>({});

    React.useEffect(() => {
        (async () => {
            const instructors = await elearningService.getInstructors(courseID);

            let instructorsById: { [key: ID]: InstructorProps } = {};

            if (instructors) {
                instructors.forEach(instructor => {
                    instructorsById[instructor.id] = instructor;
                });
            }
            setInstructors(instructorsById);

        })();
    }, []);

    return instructors;

}