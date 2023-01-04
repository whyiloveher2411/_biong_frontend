import { Box, Button, IconButton, Radio, Theme, Typography } from '@mui/material'
import Divider from 'components/atoms/Divider'
import Icon, { IconProps } from 'components/atoms/Icon'
import MoreButton from 'components/atoms/MoreButton'
import Tooltip from 'components/atoms/Tooltip'
import makeCSS from 'components/atoms/makeCSS'
import { convertHMS } from 'helpers/date'
import { addClasses } from 'helpers/dom'
import { __ } from 'helpers/i18n'
import React from 'react'
import { useSelector } from 'react-redux'
import { ChapterAndLessonCurrentState, CourseLessonProps, CourseProps } from 'services/courseService'
import reactionService from 'services/reactionService'
import { RootState } from 'store/configureStore'
import { UserProps } from 'store/user/user.reducers'
import CourseLearningContext, { CourseLearningContextProps } from '../../context/CourseLearningContext'
import { downloadFileInServer } from 'helpers/file'


const useStyle = makeCSS((theme: Theme) => ({
    listItemChapter: {
        border: '1px solid transparent',
        cursor: 'pointer',
        paddingLeft: 16,
        '&:not(.active)': {
            borderBottom: '1px solid',
            borderBottomColor: theme.palette.dividerDark,
        },
        '&.active, &:hover': {
            background: theme.palette.divider,
        }
    },
    listItemLesson: {
        border: '1px solid transparent',
        cursor: 'pointer',
        paddingLeft: 8,
        '&.active, &:hover': {
            background: theme.palette.dividerDark,
        },
        '& .love-reaction:not(.active)': {
            opacity: 0,
        },
        '&:hover .love-reaction': {
            opacity: 1,
        }
    },
    hidden: {
        pointerEvents: 'none',
        opacity: 0,
        visibility: 'hidden',
    },
    checkboxLesson: {
        // color: 'white',
        // opacity: 0.7,
        // '&.Mui-checked': {
        // color: theme.palette.primary.main,
        // opacity: 1,
        // }
        cursor: 'not-allowed',
    },
    iconChaperExpand: {
        '& svg': {
            transition: 'all 300ms',
        }
    },
    iconChaperExpanded: {
        '& svg': {
            transform: 'rotate(-180deg)',
        }
    },
}));

function LessonList({ course, type, chapterAndLessonCurrent, lessonComplete, isPurchased, ...props }: {
    course?: CourseProps | null,
    type: {
        [key: string]: {
            title: string,
            icon: IconProps
        }
    },
    lessonComplete?: {
        [key: string]: boolean;
        [key: number]: boolean;
    },
    handleChangeLesson: (data: ChapterAndLessonCurrentState) => void,
    // handleChangeCompleteLesson: (lesson: CourseLessonProps) => void,
    chapterAndLessonCurrent: ChapterAndLessonCurrentState,
    isPurchased: boolean,
}) {

    const classes = useStyle();

    const user = useSelector((state: RootState) => state.user);

    const courseLearningContext = React.useContext<CourseLearningContextProps>(CourseLearningContext);

    const handleChangeLesson = (data: ChapterAndLessonCurrentState) => () => {
        props.handleChangeLesson(data);
        if (window.__course_auto_next_lesson) {
            clearTimeout(window.__course_auto_next_lesson);
            delete window.__course_auto_next_lesson;
        }
    }

    const lessonListBox = React.useRef<HTMLDivElement>();

    const [openChapter, setOpenChapter] = React.useState<{
        [key: number]: boolean
    }>({
        [chapterAndLessonCurrent.chapterIndex]: true
    });

    React.useEffect(() => {
        setOpenChapter(prev => ({
            ...prev,
            [chapterAndLessonCurrent.chapterIndex]: true
        }))
    }, [chapterAndLessonCurrent]);

    React.useEffect(() => {
        if (lessonListBox.current) {
            lessonListBox.current.style.width = lessonListBox.current.clientWidth + 5 + 'px';
        }
    }, []);

    return (
        courseLearningContext.LessonList.open ?
            <Box
                ref={lessonListBox}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '25%',
                    zIndex: 1030,
                    // background: '#242526',
                    // bgcolor: 'background.paper',
                    overflowY: 'scroll',
                    position: 'fixed',
                    bottom: 0,
                    top: '64px',
                    pb: 1,
                    borderTop: '1px solid',
                    borderRight: '1px solid',
                    borderColor: 'dividerDark',
                    backgroundColor: 'body.background',
                }}
                className='custom_scroll custom'
            >
                <Box
                    sx={{
                        zIndex: '100',
                        position: 'sticky',
                        top: '0px',
                        padding: '8px 0 8px 16px',
                        fontSize: '20px',
                        fontWeight: '400',
                        borderBottom: '1px solid',
                        borderBottomColor: 'dividerDark',
                        backgroundColor: 'body.background',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        // marginTop: '-8px',
                    }}
                >
                    <Button
                        color='inherit'
                        startIcon={<Icon icon="ArrowBackRounded" />}
                        onClick={courseLearningContext.LessonList.onToggle}
                        sx={{ textTransform: 'unset', fontWeight: 400, fontSize: 16, }}
                    >
                        {__('Thu gọn')}
                    </Button>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Button
                            startIcon={<Icon icon="ArrowBackIosRounded" />}
                            color='inherit'
                            disabled={courseLearningContext.positionPrevLesson === null}
                            sx={{ textTransform: 'unset', fontWeight: 400, fontSize: 16, }}
                            onClick={() => {
                                if (courseLearningContext.positionPrevLesson) {
                                    const chapter = course?.course_detail?.content?.[courseLearningContext.positionPrevLesson.chapterIndex];
                                    const lesson = course?.course_detail?.content?.[courseLearningContext.positionPrevLesson.chapterIndex].lessons[courseLearningContext.positionPrevLesson.lessonIndex];

                                    courseLearningContext.handleChangeLesson({
                                        chapter: chapter?.code ?? '',
                                        chapterID: chapter?.id ?? -1,
                                        chapterIndex: courseLearningContext.positionPrevLesson.chapterIndex,
                                        lesson: lesson?.code ?? '',
                                        lessonID: lesson?.id ?? -1,
                                        lessonIndex: courseLearningContext.positionPrevLesson.lessonIndex,
                                    });
                                }
                            }}
                        >Bài trước</Button>
                        <Button
                            endIcon={<Icon icon="ArrowForwardIosRounded" />}
                            color='inherit'
                            disabled={courseLearningContext.positionNextLesson === null}
                            sx={{ textTransform: 'unset', fontWeight: 400, fontSize: 16, }}
                            onClick={() => {
                                if (courseLearningContext.positionNextLesson) {

                                    const chapter = course?.course_detail?.content?.[courseLearningContext.positionNextLesson.chapterIndex];
                                    const lesson = course?.course_detail?.content?.[courseLearningContext.positionNextLesson.chapterIndex].lessons[courseLearningContext.positionNextLesson.lessonIndex];

                                    courseLearningContext.handleChangeLesson({
                                        chapter: chapter?.code ?? '',
                                        chapterID: chapter?.id ?? -1,
                                        chapterIndex: courseLearningContext.positionNextLesson.chapterIndex,
                                        lesson: lesson?.code ?? '',
                                        lessonID: lesson?.id ?? -1,
                                        lessonIndex: courseLearningContext.positionNextLesson.lessonIndex,
                                    });
                                }
                            }}
                        >Bài sau</Button>
                    </Box>
                </Box>
                {
                    course !== null &&
                    course?.course_detail?.content?.map((item, index) => {

                        const lessonCompleteOfChapter = item.lessons.reduce((total, lesson) => {
                            if (lessonComplete && lessonComplete[lesson.id]) {
                                total++;
                            }
                            return total;
                        }, 0);

                        return <React.Fragment key={index}>
                            <Box
                                sx={(theme) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: lessonCompleteOfChapter && lessonCompleteOfChapter === item.lessons.length ? theme.palette.success.light + ' !important' : 'inherit'
                                })}
                                className={addClasses({
                                    [classes.listItemChapter]: true,
                                    ['active']: openChapter[index]
                                })}
                                onClick={() => {

                                    if (window.__course_auto_next_lesson) {
                                        clearTimeout(window.__course_auto_next_lesson);
                                        delete window.__course_auto_next_lesson;
                                    }

                                    setOpenChapter(prev => {
                                        prev[index] = !prev[index];
                                        return { ...prev };
                                    })
                                }}
                            >
                                {/* <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 55,
                                    height: 55,
                                    // color: 'white',
                                    // opacity: 0.7
                                }}
                            >
                                {(index + 1 + '').padStart(2, '0')}
                            </Box> */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        mt: 2,
                                        mb: 2,
                                        flex: '1 1',
                                    }}
                                >
                                    <Typography
                                        variant='h5'
                                        sx={{
                                            letterSpacing: '0.2px',
                                            lineHeight: '28px',
                                            fontWeight: 500,
                                            fontSize: '1.2rem',
                                            color: lessonCompleteOfChapter && lessonCompleteOfChapter === item.lessons.length ? '#263238' : 'inherit',
                                        }}>
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        variant='body2'
                                        sx={{
                                            // color: 'white',
                                            // opacity: 0.5,
                                            display: 'flex',
                                            gap: 1,
                                            mt: 0.5,
                                            alignItems: 'center',
                                            color: lessonCompleteOfChapter && lessonCompleteOfChapter === item.lessons.length ? '#263238' : 'inherit',
                                        }}
                                    >
                                        {lessonCompleteOfChapter} / {item.lessons.length}
                                        &nbsp;|&nbsp;
                                        {convertHMS(item.lessons.reduce((preValue, lesson) => preValue + parseInt(lesson.time ?? 0), 0), true, true, false)}
                                    </Typography>
                                </Box>
                                <Box
                                    className={addClasses({
                                        [classes.iconChaperExpand]: true,
                                        [classes.iconChaperExpanded]: openChapter[index]
                                    })}
                                    sx={{
                                        color: lessonCompleteOfChapter && lessonCompleteOfChapter === item.lessons.length ? '#263238' : 'inherit',
                                    }}
                                >
                                    <Icon
                                        icon="KeyboardArrowDownRounded"
                                        sx={{
                                            mt: 1,
                                        }}
                                    />
                                </Box>
                            </Box>
                            {
                                Boolean(lessonComplete && (openChapter[index])) &&
                                item.lessons.map((lesson, indexOfLesson) => (
                                    <EpisodeItem
                                        key={indexOfLesson}
                                        courseID={course.id}
                                        chapterID={item.id}
                                        chapterIndex={index}
                                        lesson={lesson}
                                        user={user}
                                        index2={indexOfLesson}
                                        isPurchased={isPurchased}
                                        lessonClassName={addClasses({
                                            [classes.listItemLesson]: true,
                                            active: chapterAndLessonCurrent.chapter === item.code && chapterAndLessonCurrent.lesson === lesson.code
                                        })}
                                        checkBoxClassName={classes.checkboxLesson}
                                        icon={type[lesson.type]?.icon}
                                        onClickLesson={handleChangeLesson({
                                            chapter: item.code,
                                            chapterID: item.id,
                                            chapterIndex: index,
                                            lesson: lesson.code,
                                            lessonID: lesson.id,
                                            lessonIndex: indexOfLesson,
                                        })}
                                        defaultChecked={Boolean(lessonComplete?.[lesson.id])}
                                        openTest={courseLearningContext.openTest}
                                        answerTest={courseLearningContext.answerTest}
                                    />
                                ))
                            }
                            <Divider />
                        </React.Fragment>
                    })
                }
            </Box>
            : <>
                <Button
                    onClick={courseLearningContext.LessonList.onToggle}
                    variant="outlined"
                    size='large'
                    endIcon={<Icon icon="ArrowForwardRounded" />}
                    sx={{
                        position: 'fixed',
                        zIndex: 1032,
                        marginTop: 1,
                        color: 'white',
                        backgroundColor: 'black',
                        borderColor: 'dividerDark',
                        transition: 'all 300ms',
                        right: '100%',
                        transform: 'translateX(3rem)',

                        '&:hover': {
                            backgroundColor: 'black',
                            transform: 'translateX(100%)',
                        },
                        '& .show-course-content': {
                            transition: 'all 1000ms',
                            opacity: 0,
                        },
                        '&:hover .show-course-content': {
                            transition: 'all 1000ms',
                            opacity: 1,
                        },
                    }}
                >
                    <Typography sx={{ color: 'white' }} className='show-course-content'>
                        {__('Nội dung khóa học')}
                    </Typography>
                </Button>
            </>
    )
}

function EpisodeItem({ lesson, lessonClassName, index2, onClickLesson, checkBoxClassName, icon, defaultChecked, user, isPurchased, openTest, answerTest, courseID, chapterID, chapterIndex }: {
    lesson: CourseLessonProps,
    index2: number,
    defaultChecked: boolean,
    lessonClassName: string,
    checkBoxClassName: string,
    onClickLesson: () => void,
    icon: IconProps,
    user: UserProps,
    isPurchased: boolean,
    openTest: (id: ID) => void,
    answerTest: {
        [key: ID]: number
    },
    courseID: ID,
    chapterID: ID,
    chapterIndex: number,
}) {

    const [loveState, setLoveState] = React.useState(window.__course_reactions?.[lesson.id] === 'love' ? true : false);

    const classes = useStyle();

    return <Box
        key={index2}
        sx={{
            display: 'flex',
            pl: 1,
            pr: 1,
        }}
        className={lessonClassName}
        onClick={onClickLesson}
        id={'lesson-list-' + lesson.id}
    >
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 55,
                height: 55,
            }}
        >
            {
                defaultChecked ?
                    <IconButton
                        className={checkBoxClassName}
                        color="primary"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
                    >
                        <Icon icon="CheckCircleRounded" />
                    </IconButton>
                    :
                    <Radio id={'course_lesson_' + lesson.code} checked={defaultChecked} onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()} className={checkBoxClassName} />
            }
        </Box>

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: 1,
                mb: 1,
                flex: '1 1',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Typography
                    sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        letterSpacing: '0',
                    }}
                >
                    {(lesson.stt + 1 + '').padStart(2, '0')}. {lesson.title} {Boolean(!isPurchased && !lesson.is_allow_trial) && <Tooltip title="Bài học được bảo vệ"><Icon icon="LockOutlined" /></Tooltip>}
                    {
                        // Boolean(lesson.is_compulsory) &&
                        // <Tooltip title={__('Bài học tiên quyết')}>
                        //     <Icon size="small" icon="HelpOutlineOutlined" />
                        // </Tooltip>
                    }
                </Typography>
                <Tooltip
                    title={__('Yêu thích')}
                >
                    <IconButton
                        onClick={async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            event.stopPropagation();
                            reactionService.post({
                                post: lesson.id,
                                reaction: loveState ? '' : 'love',
                                type: 'vn4_lesson_reaction',
                                user_id: user.id,
                            });
                            setLoveState(prev => {

                                if (window.__course_reactions) {
                                    if (prev) {
                                        window.__course_reactions[lesson.id] = '[none]';
                                    } else {
                                        window.__course_reactions[lesson.id] = 'love';
                                    }
                                }
                                return !prev;
                            });
                        }}
                        className={addClasses({
                            'love-reaction': true,
                            'active': loveState,
                            [classes.hidden]: Boolean(!isPurchased && !lesson.is_allow_trial)
                        })}
                    >
                        {
                            loveState ?
                                <Icon sx={{ color: '#ff2f26' }} icon="FavoriteRounded" />
                                :
                                <Icon icon="FavoriteBorderRounded" />
                        }
                    </IconButton>
                </Tooltip>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 0.5,
                    gap: 1,
                }}

            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                    }}
                >
                    <Icon icon={icon} sx={{ width: 16, height: 16 }} />
                    <Typography
                        variant='body2'
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                        }}>
                        {convertHMS(lesson.time, true, true)}
                    </Typography>
                    {
                        isPurchased || lesson.is_allow_trial ?
                            Boolean(lesson.tests?.length) &&
                            lesson.tests?.map(item => (
                                <Tooltip
                                    key={item.id}
                                    title={item.title}
                                >
                                    <IconButton
                                        color={answerTest[item.id] ? 'success' : 'inherit'}
                                        sx={{
                                            padding: 0,
                                            opacity: 0.7,
                                            '&:hover': {
                                                opacity: 1,
                                            }
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openTest(item.id);
                                        }} >
                                        <Icon sx={{ fontSize: 18 }} icon="CheckCircleRounded" />
                                    </IconButton>
                                </Tooltip>
                            ))
                            :
                            <></>
                    }
                </Box>
                {
                    Boolean((isPurchased || lesson.is_allow_trial) && lesson.resources && lesson.resources.filter(item => item.type === 'download').length > 0) &&
                    <Box
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <MoreButton
                            actions={[
                                [
                                    ...(lesson.resources ? lesson.resources.map((item, index) => ({ ...item, index: index })).filter(item => item.type === 'download').map(item => ({
                                        title: item.title,
                                        icon: 'FileDownloadOutlined',
                                        action: () => {
                                            downloadFileInServer(
                                                courseID,
                                                chapterID,
                                                chapterIndex,
                                                lesson.id,
                                                index2,
                                                item.index
                                            );
                                        }
                                    })) : [])
                                ]
                            ]}
                        >
                            <Button variant='outlined' color="inherit" endIcon={<Icon icon="ArrowDropDownOutlined" />} startIcon={<Icon icon="FolderOutlined" />} >Resources</Button>
                        </MoreButton>
                    </Box>
                }
            </Box>
        </Box>
    </Box >
}

export default LessonList