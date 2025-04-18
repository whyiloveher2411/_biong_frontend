import { Alert, AppBar, Badge, Box, Button, Chip, CircularProgress, CircularProgressProps, IconButton, Theme, Typography, useTheme } from '@mui/material';
import ButtonGroup from 'components/atoms/ButtonGroup';
import Card from 'components/atoms/Card';
import Icon, { IconFormat, IconProps } from 'components/atoms/Icon';
import IconBit from 'components/atoms/IconBit';
import Loading from 'components/atoms/Loading';
import Tabs, { TabProps } from 'components/atoms/Tabs';
import Tooltip from 'components/atoms/Tooltip';
import { useWebBrowser } from 'components/atoms/WebBrowser';
import makeCSS from 'components/atoms/makeCSS';
import DrawerCustom from 'components/molecules/DrawerCustom';
import Account from 'components/molecules/Header/Account';
import { detectDevTool } from 'helpers/customFunction';
import { convertHMS } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { numberWithSeparator } from 'helpers/number';
import { convertTimeStrToTimeInt } from 'helpers/string';
import { getParamsFromUrl, getUrlParams, replaceUrlParam } from 'helpers/url';
import useConfirmDialog from 'hook/useConfirmDialog';
import useQuery from 'hook/useQuery';
import useReaction from 'hook/useReaction';
import useReportPostType from 'hook/useReportPostType';
import testService, { ITestStatus } from 'plugins/Vn4Test/testService';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import courseService, { ChapterAndLessonCurrentState, CourseLessonProps, CourseProps, DataForCourseCurrent, ProcessLearning } from 'services/courseService';
import eCommerceService from 'services/eCommerceService';
import elearningService, { InstructorProps } from 'services/elearningService';
import reactionService from 'services/reactionService';
import { UserProps, UserState, updateBitPoint, useUser } from 'store/user/user.reducers';
import BuottonForum from './components/BuottonForum';
import ButtonCourseResource from './components/ButtonCourseResource';
import ButtonGroupHelper from './components/ButtonGroupHelper';
import ReviewCourse from './components/ReviewCourse';
// import SectionChangelog from './components/SectionChangelog';
import SectionCommentLesson from './components/SectionCommentLesson';
// import SectionContentOutlineLesson from './components/SectionContentOutlineLesson';
import LessonList from './components/SectionLearn/LessonList';
import SectionContentOfLesson from './components/SectionLearn/SectionContentOfLesson';
import SectionResourceLession from './components/SectionResourceLession';
import SectionVideoNote from './components/SectionVideoNote';
import CourseLearningContext from './context/CourseLearningContext';
import SectionEntryTest from './components/CourseDetailComponent/SectionEntryTest';
import LoadingButton from '@mui/lab/LoadingButton';
import SectionExitTest from './components/SectionExitTest';
import { getCookie, setCookie } from 'helpers/cookie';

const disbaleAccountId: { [key: number]: true } = { 918: true };

const useStyle = makeCSS((theme: Theme) => ({
    boxContentLesson: {
        position: 'relative',
        width: '100%',
        height: '100%',
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

    const urlQuery = useQuery({
        screen: '',
    });

    const webBrowser = useWebBrowser();

    const openLogo = React.useState(true);

    const loadingButtonComplete = React.useState(false);

    const openFirstNoti = React.useState(false);

    const openTabMain = React.useState(true);

    const bookmarks = React.useState<{ [key: ID]: "[none]" | "love" }>({});

    const [testStatus, setTestStatus] = React.useState<{
        entry: ITestStatus | null,
        exit: ITestStatus | null,
    }>({
        entry: null,
        exit: null,
    });

    const [showChapterVideo, setShowChapterVideo] = React.useState(user.show_chapter_video === undefined || (user.show_chapter_video - 0) === 1 ? true : false);

    const [openMenuLessonList, setOpenMenuLessonList] = React.useState(!localStorage.getItem('openMenuLessonList') || localStorage.getItem('openMenuLessonList') === '1' ? true : false);

    React.useEffect(() => {
        localStorage.setItem('openMenuLessonList', openMenuLessonList ? '1' : '0');
    }, [openMenuLessonList]);

    const confirmLogoutLearning = useConfirmDialog({
        message: 'Bạn có chắc chắn muốn thoát khỏi khu vực học tập không?',
        title: 'Đợi một tí đã!',
        renderButtons: (onConfirm, onClose) => <>
            <Button variant='contained' onClick={onClose}>
                Tiếp tục học tập  😍
            </Button>
            <Button color="inherit" onClick={onConfirm}>
                Rời khỏi trang
            </Button>
        </>
    });

    const [chapterAndLessonCurrent, setStateChapterAndLessonCurrent] = React.useState<ChapterAndLessonCurrentState>({
        chapter: null,
        lesson: null,
        chapterIndex: -1,
        lessonIndex: -1,
        chapterID: -1,
        lessonID: -1,
    });

    const [openDrawerTab, setOpenDrawerTab] = React.useState(-1);

    const chapterVideoRef = React.useRef<HTMLElement | null>(null);

    const [dataReviewCourse, setDataReviewCourse] = React.useState<{
        open: boolean,
        rating: number,
        detail: string,
        isReviewed: boolean,
    }>({
        open: false,
        rating: 5,
        detail: '',
        isReviewed: false,
    });

    const dispatch = useDispatch();

    // const [answerTest, setAnswerTest] = React.useState<{ [key: ID]: number }>({});

    const [process, setProcess] = React.useState<ProcessLearning | null>(null);

    const [completedData, setCompletedData] = React.useState({
        precent: 0,
        completed: 0,
        total: 0,
    });

    const [showLoading, setShowLoading] = React.useState(false);

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
    // const shareBox = document.getElementById('share-box');

    if (footer) {
        footer.style.display = 'none';
        footer.style.zIndex = '-1';
    }

    // if (shareBox) {
    //     shareBox.style.display = 'none';
    //     shareBox.style.zIndex = '-1';
    // }

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
        descriptionBottom: <Alert severity='warning' icon={false}>
            <Typography>
                Hãy mô tả chi tiết bạn đang gặp lỗi ở bài học nào hoặc bước mấy. Nếu là bài học video, hãy cho chúng tôi biết chi tiết từ khoảng thời gian nào. Việc mô tả chính xác sẽ giúp chúng tôi nhanh chóng xác định lỗi và cập nhật kịp thời. Cuối cùng, cám ơn bạn đã báo cáo lỗi với chúng tôi 💓.
            </Typography>
        </Alert>
    })

    React.useEffect(() => {
        if (disbaleAccountId[(user.id as number) - 0]) {
            return;
        }

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
        let checkReview = elearningService.checkStudentReviewedOrNotYet(slug);
        const checkStatus = testService.checkCourseTest(slug);

        Promise.all([courseFormDB, config, checkPurchased, dataForCourseCurrent, reactions, checkReview, checkStatus]).then(([courseFormDB, config, checkPurchased, dataForCourseCurrent, reactions, checkReview, checkStatus]) => {

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

            // setAnswerTest(reactions.answer_test ?? {});
            bookmarks[1](reactions.reactions ?? {});

            setDataReviewCourse({
                detail: checkReview.detail,
                rating: checkReview.rating ? checkReview.rating : 5,
                open: false,
                isReviewed: checkReview.isReviewed ? true : false,
            });

            setData(() => ({
                course: courseFormDB,
                isPurchased: checkPurchased,
                type: config?.type ?? {},
                dataForCourseCurrent: dataForCourseCurrent,
            }));
            setTestStatus(checkStatus);
        });

        // }, 400);

        detectDevTool();

        hidenSectionMainLayout();

        return () => {
            showSectionMainLayout();
        };
    }, []);

    React.useEffect(() => {
        if (data) {
            webBrowser.setSeo(prev => ({
                ...prev,
                title: (!data.isPurchased && data.course.course_detail?.is_allow_trial ? 'Học thử miễn phí ' : '') + data.course.title
            }));
        }
    }, [data]);

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
                if (!Number(urlQuery.query.screen)) {

                    if (data?.course.course_detail?.learn_step_by_step && lessonIndex && data?.dataForCourseCurrent.lesson_completed && window.__course_content) {

                        const findData = (window.__course_content as LessonPosition[]).findIndex(item => item.lesson === lessonIndex.lesson);

                        if (findData > 0) {
                            if (!data?.dataForCourseCurrent.lesson_completed[window.__course_content[findData - 1].lessonID]) {
                                return;
                            }
                        }
                    }

                    let child = document.getElementById('lesson-list-' + lessonIndex.lessonID);

                    if (child) {
                        let parent = child.parentElement;

                        if (parent) {
                            parent.scrollTo({ top: child.offsetTop - parent.offsetTop, behavior: "smooth" });
                        }
                    }

                    document.getElementById('course-learning-content')?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
                    // now account for fixed header
                    // let scrolledY = window.scrollY + 64 + 112;
                    // if (scrolledY) {
                    document.getElementById('lesson-list-' + lessonIndex.lessonID)?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
                    // window.scroll(0, scrolledY - (document.getElementById('course-learning-content')?.offsetHeight ?? 0));
                    // }
                } else {
                    document.getElementById('lesson_list_main')?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
                }
            }, 100);
        }
    }

    function checkReviewLesson() {

        if (dataReviewCourse.isReviewed) {
            return;
        }

        const nameCookie = 'review_' + slug;
        const timeNow = parseInt(((new Date()).getTime() / 1000) + '');
        const firstNoti = getCookie(nameCookie);

        if (!firstNoti) {
            setCookie(nameCookie, timeNow + '', (120 / 1440));
            return;
        }

        if (timeNow - (parseInt(firstNoti + '') ?? 0) > 420) {
            setTimeout(() => {
                setCookie(nameCookie, timeNow + '', (120 / 1440));
            }, 2000);

            setDataReviewCourse(prev => ({
                ...prev,
                open: true,
            }));
            return;
        }
    }

    React.useEffect(() => {

        const fbRoot = document.getElementById('fb-root');
        if (fbRoot) {
            fbRoot.style.opacity = '0';
            fbRoot.style.pointerEvents = 'none';
        }

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

            if (process && !process.show_first_noti) {
                openFirstNoti[1](true);
            }

            setCompletedData({
                precent: (process?.lesson_completed_count ?? 0) * 100 / (data?.course.course_detail?.total_lesson ?? 1),
                total: data?.course.course_detail?.total_lesson ?? 0,
                completed: process?.lesson_completed_count ?? 0,
            });
            setShowLoading(false);
            setProcess(process);
            checkReviewLesson();

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
                    loadingButtonComplete[1](true);
                    let completedData = await courseService.toggleLessonCompleted({
                        lesson_id: lesson.id,
                        lesson_code: lesson.code,
                        chapter_id: data.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].id ?? 0,
                        chapterIndex: chapterAndLessonCurrent.chapterIndex,
                        lessonIndex: chapterAndLessonCurrent.lessonIndex,
                        course: data.course.id ?? 0,
                        type: 'auto',
                    });

                    if (completedData.bit_point && completedData.bit_point.total !== (user.getBit() - 0)) {
                        dispatch(updateBitPoint(completedData.bit_point.total));
                        window.showMessage(__('Chúc mừng bạn vừa được thêm {{bit}} bit, Hãy tiếp tục cố gắng nhé!', { bit: completedData.bit_point.add_in }), 'success');
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
                        setDataReviewCourse(prev => {
                            if (!prev.isReviewed) {
                                return {
                                    ...prev,
                                    open: true,
                                };
                            }

                            return prev;
                        });
                    }

                    loadingButtonComplete[1](false);

                })();
            }
        }
    }

    const tabContentCourse: TabProps[] = data ? [
        // {
        //     title: __('Nội dung outline'),
        //     key: 'content-outline',
        //     content: () => <Box className={classes.tabContent}>
        //         <SectionContentOutlineLesson />
        //     </Box>,
        // },
        {
            title: __('Ghi chú'),
            key: 'notes',
            content: () => <Box className={classes.tabContent}><SectionVideoNote setChapterAndLessonCurrent={setChapterAndLessonCurrent} chapterAndLessonCurrent={chapterAndLessonCurrent} course={data.course} /></Box>,
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
            /></Box>,
        },
        {
            title: <Badge
                badgeContent={
                    (data.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons[chapterAndLessonCurrent.lessonIndex].resources?.length ?? 0)
                    + (data.course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons[chapterAndLessonCurrent.lessonIndex].reference_post?.length ?? 0)
                }
                color="secondary"
                sx={{
                    '& .MuiBadge-badge': {
                        right: -12
                    }
                }}
            >
                <Typography sx={{ color: 'inherit', }} component='span'> {__('Bài viết liên quan')}
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
        // {
        //     key: 'changelog',
        //     title:
        //         <Badge
        //             badgeContent={data.course.course_detail?.changelog?.length ?? 0}
        //             color="secondary"
        //             sx={{
        //                 '& .MuiBadge-badge': {
        //                     right: -12
        //                 }
        //             }}
        //         >
        //             Nhật ký thay đổi
        //         </Badge >,
        //     content: () => <Box className={classes.tabContent}><SectionChangelog course={data.course} /></Box>
        // },
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

        const menuReport = (<Box
            sx={{
                display: 'flex',
                marginLeft: 'auto',
                alignItems: 'center',
                gap: 1,
            }}
        >
            {
                lessonCurrent ?
                    data.dataForCourseCurrent.lesson_completed[lessonCurrent.id] ?
                        <Typography sx={{ fontSize: 14, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', color: 'success.main' }}><Icon icon="CheckRounded" /> Bài học đã hoàn thành</Typography>
                        :
                        lessonCurrent.type === 'video' ?
                            <LoadingButton
                                size='small'
                                loading={loadingButtonComplete[0]}
                                variant='contained'
                                color='success'
                                sx={{
                                    textTransform: 'unset',
                                    mt: '-4px',
                                }}
                                onClick={() => {
                                    if (lessonCurrent) {
                                        handleClickInputCheckBoxLesson(lessonCurrent);
                                    }
                                }}
                            >
                                Đánh dấu đã hoàn thành
                            </LoadingButton>
                            : null
                    : null
            }

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
        </Box>);
        return (
            <CourseLearningContext.Provider
                value={{
                    course: data.course,
                    chapterAndLessonCurrent: chapterAndLessonCurrent,
                    bookmarks: {
                        state: bookmarks[0],
                        onChange: (lessonID: ID) => {
                            reactionService.post({
                                post: lessonID,
                                reaction: bookmarks[0][lessonID] === 'love' ? '' : 'love',
                                type: 'vn4_lesson_reaction',
                                user_id: user.id,
                            });

                            bookmarks[1](prev => {
                                if (prev[lessonID] === '[none]') {
                                    prev[lessonID] = 'love';
                                } else {
                                    prev[lessonID] = '[none]';
                                }
                                return { ...prev };
                            });
                        },
                    },
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
                    // answerTest: answerTest,
                    // addAnswerTest: (id: ID) => {
                    //     setAnswerTest(prev => ({ ...prev, [id]: 1 }));
                    // },
                    handleClickInputCheckBoxLesson: handleClickInputCheckBoxLesson,
                    dataForCourseCurrent: data.dataForCourseCurrent,
                    chapterVideoRef: chapterVideoRef,
                    positionPrevLesson: positionPrevLesson,
                    positionNextLesson: positionNextLesson,
                    iconTypeLesson: data.type,
                    openLogo,
                    openTabMain,
                    menuReport,
                    dataReviewCourse: dataReviewCourse,
                    openReviewDialog: () => setDataReviewCourse(prev => ({ ...prev, open: true })),
                    testStatus: testStatus,
                    setTestStatus: setTestStatus,
                    checkReviewLesson: checkReviewLesson,
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
                                confirmLogoutLearning.onConfirm(() => {
                                    if (window.__linkBackCourseLearning) {
                                        navigate(window.__linkBackCourseLearning);
                                        return;
                                    }
                                    navigate('/course/' + data.course.slug);
                                });
                            }}
                        >
                            <Icon icon="ArrowBackIosRounded" />
                        </IconButton>
                        <Typography

                            onClick={() => {
                                confirmLogoutLearning.onConfirm(() => {
                                    navigate('/course/' + data.course.slug);
                                });
                            }}
                            variant="h5"
                            noWrap
                            sx={{
                                cursor: 'pointer',
                                fontWeight: 400,
                                fontSize: 18,
                                letterSpacing: '0.3px',
                            }}
                        >
                            {data.course.title}
                        </Typography>
                        {/* -
                        <LessonListInAppBar /> */}
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

                        <Button
                            color='inherit'
                            startIcon={<Icon sx={{ color: '#faaf00' }} icon="Star" />}
                            onClick={() => {
                                if (data.isPurchased) {
                                    setDataReviewCourse(prev => ({ ...prev, open: true }));
                                } else {
                                    window.showMessage('Chỉ học viên mới có thể đánh giá khóa học.', 'error');
                                }
                            }} sx={{ textTransform: 'none', fontWeight: 400 }}>
                            {__('Đánh giá khóa học')}
                            {
                                !dataReviewCourse.isReviewed &&
                                <Chip component='span' sx={{ ml: '4px', cursor: 'pointer' }} size="small"
                                    label={
                                        <Typography
                                            component='span'
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: 12
                                            }}><Icon sx={{ fontSize: 16 }} icon={IconBit} />&nbsp;+200
                                        </Typography>}
                                />
                            }
                        </Button>
                        <ButtonCourseResource />

                        <ButtonGroupHelper
                            open={openFirstNoti[0]}
                            onClose={() => openFirstNoti[1](false)}
                            onOpen={() => openFirstNoti[1](true)}
                        />

                        {/* <ButtonLearningLayout /> */}

                        <BuottonForum />
                        <Account />

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
                                        '& .section-course-tab .tabWarper': {
                                            pr: openMenuLessonList ? 3 : 7,
                                            pl: openMenuLessonList ? 3 : 7,
                                        }
                                    }}
                                >
                                    {
                                        data.course.course_detail?.active_entry_test && Number(urlQuery.query.screen) === LearningScreen.EntryTest ?
                                            <Box sx={{ p: 4 }}>
                                                <SectionEntryTest
                                                    course={data.course}
                                                    onSetPoint={(point) => {
                                                        setTestStatus(prev => prev ? {
                                                            ...prev,
                                                            entry: {
                                                                ...prev.entry,
                                                                ...point
                                                            },
                                                        } : prev);
                                                    }}
                                                />
                                            </Box>
                                            :
                                            data.course.course_detail?.active_exit_test && Number(urlQuery.query.screen) === LearningScreen.ExitTest ?
                                                <Box sx={{ p: 4 }}>
                                                    <SectionExitTest
                                                        course={data.course}
                                                        isPurchased={data.isPurchased}
                                                        onSetPoint={(point) => {
                                                            setTestStatus(prev => prev ? {
                                                                ...prev,
                                                                exit: {
                                                                    ...prev.entry,
                                                                    ...point
                                                                },
                                                            } : prev);
                                                        }}
                                                    />
                                                </Box>
                                                :
                                                <Box
                                                    sx={{
                                                        overflow: 'hidden',
                                                        overflowY: 'overlay',
                                                        height: !openTabMain[0] ?
                                                            'calc(100vh - 64px)' :
                                                            user.getThemeLearningTab() === 'drawer'
                                                                ? 'calc(100vh - 112px)' : 'calc(100vh - 64px)',

                                                    }}
                                                    className="custom_scroll custom autoHiden"
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: user.getThemeLearning() === 'main_left' ? 'row-reverse' : 'unset',
                                                            height: user.getThemeLearningTab() === 'tab' ? 'calc(100% - 48px)' : '100%',
                                                            // overflowY: 'scroll',
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
                                                            {
                                                                openLogo[0] &&
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
                                                            }
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
                                                        openTabMain[0] && Boolean(data.isPurchased || data.course?.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex]?.lessons?.[chapterAndLessonCurrent.lessonIndex].is_allow_trial) ?
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
                                                                    menuItemAddIn={menuReport}
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
                                                            : null
                                                    }
                                                </Box>
                                    }
                                </Box>
                            </Box>
                            <ReviewCourse
                                open={dataReviewCourse.open}
                                onClose={() => setDataReviewCourse(prev => ({ ...prev, open: false }))}
                                course={data.course}
                                data={{
                                    rating: dataReviewCourse.rating,
                                    content: dataReviewCourse.detail,
                                    is_incognito: 0,
                                }}
                                handleAfterConfimReview={(data) => setDataReviewCourse({
                                    rating: data.rating,
                                    detail: data.content,
                                    open: false,
                                    isReviewed: true,
                                })}
                            />
                        </div>
                    </Box>
                </Box >
                {
                    dialogReportLesson.component
                }
                {
                    confirmLogoutLearning.component
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
                icon: 'SchoolOutlined',
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


export enum LearningScreen {
    'Learning', 'EntryTest', 'ExitTest'
}

export function showSectionMainLayout() {
    // clearTimeout(timeOutDialog);
    delete window.__course_content;

    const footer = document.getElementById('footer-main');
    // const shareBox = document.getElementById('share-box');
    const fbRoot = document.getElementById('fb-root');

    if (footer) {
        footer.style.display = 'flex';
        footer.style.zIndex = '0';
    }

    // if (shareBox) {
    //     shareBox.style.display = 'flex';
    //     shareBox.style.zIndex = '0';
    // }

    if (fbRoot) {
        fbRoot.style.opacity = '1';
        fbRoot.style.pointerEvents = 'unset';
    }
}

export function hidenSectionMainLayout() {
    const footer = document.getElementById('footer-main');
    // const shareBox = document.getElementById('share-box');

    if (footer) {
        footer.style.display = 'none';
        footer.style.zIndex = '-1';
    }

    const fbRoot = document.getElementById('fb-root');
    if (fbRoot) {
        fbRoot.style.opacity = '0';
        fbRoot.style.pointerEvents = 'none';
    }
}