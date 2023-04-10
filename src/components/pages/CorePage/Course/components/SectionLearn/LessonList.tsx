import { Box, Button, Chip, CircularProgress, CircularProgressProps, IconButton, Rating, Theme, Typography } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import Divider from 'components/atoms/Divider'
import Icon, { IconFormat, IconProps } from 'components/atoms/Icon'
import IconBit from 'components/atoms/IconBit'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import MoreButton from 'components/atoms/MoreButton'
import Tooltip from 'components/atoms/Tooltip'
import makeCSS from 'components/atoms/makeCSS'
import { convertHMS } from 'helpers/date'
import { addClasses } from 'helpers/dom'
import { downloadFileInServer } from 'helpers/file'
import { __ } from 'helpers/i18n'
import { convertToSlug } from 'helpers/string'
import useQuery from 'hook/useQuery'
import React from 'react'
import { useSelector } from 'react-redux'
import { ChapterAndLessonCurrentState, CourseChapterProps, CourseLessonProps, CourseProps } from 'services/courseService'
import { RootState } from 'store/configureStore'
import CourseLearningContext, { CourseLearningContextProps } from '../../context/CourseLearningContext'
import ButtonShowLessonContent from './ButtonShowLessonContent'
import { precentFormat } from 'plugins/Vn4Ecommerce/helpers/Money'


const useStyle = makeCSS((theme: Theme) => ({
    listItemChapter: {
        border: '1px solid transparent',
        cursor: 'pointer',
        paddingLeft: 16,
        paddingRight: 10,
        '&:not(.active)': {
            borderBottom: '1px solid',
            borderBottomColor: theme.palette.dividerDark,
        },
        '&.active, &:hover': {
            background: theme.palette.divider,
        },
        '&:last-child': {
            borderBottom: '0',
        }
    },
    listItemLesson: {
        display: 'flex',
        paddingRight: 8,
        paddingLeft: 20,
        opacity: 0.6,
        cursor: 'pointer',
        '&.showDeep': {
            opacity: 1,
        },
        '&.active, &:hover': {
            background: 'rgba(25, 118, 210, 0.08)',
            opacity: 1,
        },
        '&.active .iconContentType': {
            color: theme.palette.primary.main,
        },
        '& .love-reaction': {
            marginTop: '-9px',
            '&:not(.active)': {
                opacity: 0,
            },
        },
        '&:hover .love-reaction': {
            opacity: '1 !important',
        }
    },
    hidden: {
        pointerEvents: 'none',
        opacity: 0,
        visibility: 'hidden',
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

    const urlQuery = useQuery({
        test_first: '',
    });

    const [filterLesson, setFilterLesson] = React.useState<KeyOfFilter | null>(null);

    const [searchByName, setSearchByName] = React.useState('');

    const courseLearningContext = React.useContext<CourseLearningContextProps>(CourseLearningContext);

    const handleChangeLesson = (data: ChapterAndLessonCurrentState) => () => {
        urlQuery.changeQuery({
            test_first: 0
        });
        props.handleChangeLesson(data);
        if (window.__course_auto_next_lesson) {
            clearTimeout(window.__course_auto_next_lesson);
            delete window.__course_auto_next_lesson;
        }
    }

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


    const filterList = {
        complete: {
            title: 'Đã hoàn thành',
            iconComponent: <Icon sx={{ color: 'success.main' }} icon='CheckRounded' />,
            selected: filterLesson === 'complete',
            action: () => {
                setFilterLesson('complete');
            }
        },
        notComplete: {
            title: 'Chưa hoàn thành',
            iconComponent: <Icon sx={{ color: 'error.main' }} icon='ClearRounded' />,
            selected: filterLesson === 'notComplete',
            action: () => {
                setFilterLesson('notComplete');
            },
        },
        free: {
            title: 'Miễn phí',
            iconComponent: <Icon sx={{ color: 'primary.main' }} icon='MoneyOffCsredRounded' />,
            selected: filterLesson === 'free',
            action: () => {
                setFilterLesson('free');
            }
        },
        advance: {
            title: 'Nâng cao',
            iconComponent: <Icon sx={{ color: 'success.main' }} icon='SchoolOutlined' />,
            description: 'Các bài học trả phí',
            selected: filterLesson === 'advance',
            action: () => {
                setFilterLesson('advance');
            },
        },
        saved: {
            title: 'Đã lưu',
            iconComponent: <Icon sx={{ color: 'warning.main' }} icon='Bookmark' />,
            selected: filterLesson === 'saved',
            action: () => {
                setFilterLesson('saved');
            }
        },
        noted: {
            title: 'Ghi chú',
            iconComponent: <Icon sx={{ color: 'info.main' }} icon='NoteOutlined' />,
            description: 'Bài học có ghi chú',
            selected: filterLesson === 'noted',
            action: () => {
                setFilterLesson('noted');
            }
        }
    };

    return (<>
        <Box
            sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                width: '400px',
                zIndex: 100000,
                overflowY: 'scroll',
                overflowX: 'hidden',
                position: 'fixed',
                bottom: 0,
                gap: 1,
                top: '64px',
                backgroundColor: theme.palette.mode === 'light' ? '#F0F2F5' : theme.palette.body.background,
                ...(user.getThemeLearning() === 'main_left' ? {
                    right: 0,
                    pl: 1,
                } : {
                    pr: 1,
                }),
                overflow: 'hidden',
                transition: 'all 0.3s',
                ...(courseLearningContext.LessonList.open ? {
                    transform: 'translateX(0)',
                } : {
                    opacity: 0,
                    ...(user.getThemeLearning() === 'main_left' ? {
                        transform: 'translateX(calc(100% - 20px))',
                    } : {
                        transform: 'translateX(calc(-100% + 20px))',
                    }),
                }),
                '&:hover, &.active': {
                    transform: 'translateX(0)',
                    opacity: 1,
                }
            })}
            onMouseEnter={() => {
                document.body.classList.add('hidden');
            }}
            onMouseLeave={() => {
                document.body.classList.remove('hidden');
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    p: 1,
                    pt: 0.5,
                    pb: 0.5,
                    alignItems: 'center',
                    backgroundColor: 'background.paper',
                    '& .MuiOutlinedInput-root': {
                        width: '100%',
                        borderRadius: 1,
                        backgroundColor: 'rgba(25, 118, 210, 0.08)'
                    },
                    '& .adormentEnd': {
                        opacity: searchByName ? 1 : 0,
                        pointerEvents: searchByName ? 'unset' : 'none',
                    }
                }}
            >
                <OutlinedInput
                    size='small'
                    placeholder='Tìm theo tên chương, bài học'
                    startAdornment={<InputAdornment position="start"><Icon sx={{ mr: 1 }} icon="Search" /></InputAdornment>}
                    endAdornment={<InputAdornment
                        onClick={() => setSearchByName('')}
                        className="adormentEnd"
                        position="end">
                        <IconButton edge="end" ><Icon sx={{ mr: 1 }} icon="Clear" /></IconButton>
                    </InputAdornment>}
                    onChange={(e) => {
                        setSearchByName((e.target as HTMLInputElement).value)
                    }}
                    value={searchByName}
                />
                <MoreButton
                    actions={[
                        {
                            complete: filterList.complete,
                            notComplete: filterList.notComplete,
                        },
                        {
                            free: filterList.free,
                            advance: filterList.advance,
                        },
                        {
                            saved: filterList.saved,
                            // noted: filterList.noted,
                        },
                        {
                            clear: {
                                title: 'Tất cả',
                                icon: 'FilterListRounded',
                                action: () => {
                                    setFilterLesson(null);
                                }
                            }
                        }
                    ]}
                >
                    <IconButton
                        size="small"
                    >
                        {
                            filterLesson ?
                                filterList[filterLesson].iconComponent :
                                <Icon icon="FilterListRounded" />
                        }
                    </IconButton>
                </MoreButton>
            </Box>

            <Box
                sx={{
                    overflowX: 'hidden',
                    flexGrow: 1,
                    backgroundColor: 'background.paper',
                    overflowY: 'overlay',
                    '& *': {
                        scrollMarginTop: '112px',
                    }
                }}
                className='custom_scroll custom'
                id="lesson_list_main"
            >
                {
                    courseLearningContext.course?.course_detail?.active_entry_test ?
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                pt: 2,
                                pb: 2,
                                alignItems: 'center',
                                top: 0,
                                zIndex: 1,
                                backgroundColor: Number(urlQuery.query.test_first) ? 'primary.dark' : 'primary.main',
                                border: '1px solid transparent',
                                cursor: 'pointer',
                                paddingLeft: 2,
                                paddingRight: '10px',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                }
                            }}
                            onClick={() => {
                                urlQuery.changeQuery({
                                    test_first: 1,
                                });
                            }}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    pr: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    '& .MuiTypography-root': {
                                        color: 'white',
                                    }
                                }}
                            >
                                <CircularProgressWithLabel
                                    value={0}
                                    nComlete={0}
                                    nTotal={1}
                                    label={0}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    flex: '1 1',
                                }}
                            >
                                <Typography
                                    variant='h5'
                                    sx={{
                                        letterSpacing: '0.2px',
                                        lineHeight: '28px',
                                        fontWeight: 500,
                                        fontSize: '1.1rem',
                                        color: 'white',
                                    }}>Kiểm tra đầu vào
                                </Typography>

                                <Typography sx={{ fontSize: 12, color: 'white' }}>
                                    {
                                        courseLearningContext.entryTestStatus ?
                                            courseLearningContext.entryTestStatus.is_create ?
                                                courseLearningContext.entryTestStatus.is_continue ?
                                                    'Chưa hoàn thành'
                                                    :
                                                    'Điểm số ' + (courseLearningContext.entryTestStatus.point ?? 0) + ' / ' + courseLearningContext.entryTestStatus.total_point + ' (' + precentFormat((courseLearningContext.entryTestStatus.point ?? 0) * 100 / (courseLearningContext.entryTestStatus.total_point ? courseLearningContext.entryTestStatus.total_point : 1)) + ')'
                                                :
                                                'Chưa làm bài'
                                            :
                                            null
                                    }


                                </Typography>
                            </Box>
                        </Box>
                        : null
                }
                {

                    (() => {
                        if (course !== null) {

                            let chaptersOld = course?.course_detail?.content;
                            if (chaptersOld) {

                                let chapters: Array<CourseChapterProps & { stt: number, total_complete: number }> = chaptersOld.map((chapter, index) => ({
                                    ...chapter,
                                    stt: index,
                                    total_lesson: chapter.lessons.length,
                                    total_complete: chapter.lessons.filter(lesson => lessonComplete?.[lesson.id]).length
                                }));

                                let checkFilter = false;

                                if (filterLesson) {
                                    checkFilter = true;
                                    switch (filterLesson) {
                                        case 'complete':
                                            chapters = chapters.map(chapter => ({
                                                ...chapter,
                                                lessons: chapter.lessons.filter(lesson => lessonComplete?.[lesson.id])
                                            }));
                                            break;
                                        case 'notComplete':
                                            chapters = chapters.map(chapter => ({
                                                ...chapter,
                                                lessons: chapter.lessons.filter(lesson => !(lessonComplete?.[lesson.id]))
                                            }));
                                            break;
                                        case 'free':
                                            chapters = chapters.map(chapter => ({
                                                ...chapter,
                                                lessons: chapter.lessons.filter(lesson => lesson.is_allow_trial)
                                            }));
                                            break;
                                        case 'advance':
                                            chapters = chapters.map(chapter => ({
                                                ...chapter,
                                                lessons: chapter.lessons.filter(lesson => !lesson.is_allow_trial)
                                            }));
                                            break;
                                        case 'saved':
                                            chapters = chapters.map(chapter => ({
                                                ...chapter,
                                                lessons: chapter.lessons.filter(lesson => courseLearningContext.bookmarks.state[lesson.id] === 'love')
                                            }));
                                            break;
                                        case 'noted':

                                            break;
                                    }
                                }

                                let searchBySlugName = convertToSlug(searchByName, '');

                                if (searchBySlugName) {
                                    checkFilter = true;
                                    chapters = chapters.map(chapter => ({
                                        ...chapter,
                                        lessons: convertToSlug(chapter.title, '').includes(searchBySlugName) ?
                                            chapter.lessons
                                            : chapter.lessons.filter(lesson => convertToSlug(lesson.title, '').includes(searchBySlugName))
                                    }))
                                }

                                if (checkFilter) {
                                    chapters = chapters.filter(chapter => chapter.lessons.length > 0);
                                }

                                if (chapters.length === 0) {
                                    return <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 3,
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '100%',
                                            p: 2
                                        }}
                                    >
                                        <ImageLazyLoading
                                            src='/images/undraw_no_data_qbuo.svg'
                                            sx={{
                                                maxWidth: '100%',
                                                width: 320,
                                                height: 'auto'
                                            }}
                                        />
                                        <Typography align='center' sx={{ color: 'text.secondary' }} variant='h4'>Không tìm thấy kết quả phù hợp</Typography>
                                    </Box>
                                }

                                return chapters.map((item) => {

                                    return <Box key={item.id}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                                pt: 2,
                                                pb: 2,
                                                alignItems: 'center',
                                                position: 'sticky',
                                                top: 0,
                                                zIndex: 1,
                                            }}
                                            className={addClasses({
                                                [classes.listItemChapter]: true,
                                                ['active']: openChapter[item.stt]
                                            })}
                                            onClick={() => {

                                                if (window.__course_auto_next_lesson) {
                                                    clearTimeout(window.__course_auto_next_lesson);
                                                    delete window.__course_auto_next_lesson;
                                                }

                                                setOpenChapter(prev => {
                                                    prev[item.stt] = !prev[item.stt];
                                                    return { ...prev };
                                                })
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: '100%',
                                                    pr: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >

                                                <CircularProgressWithLabel
                                                    value={(!item.total_complete || !item.total_lesson) ? 0 : item.total_complete * 100 / item.total_lesson}
                                                    nComlete={item.total_complete ? item.total_complete : 0}
                                                    nTotal={item.total_lesson ? item.total_lesson : 0}
                                                    label={item.stt + 1}
                                                />
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    flex: '1 1',
                                                }}
                                            >
                                                <Typography
                                                    variant='h5'
                                                    sx={{
                                                        letterSpacing: '0.2px',
                                                        lineHeight: '28px',
                                                        fontWeight: 500,
                                                        fontSize: '1.1rem',
                                                    }}>{item.title}
                                                </Typography>
                                                <Typography
                                                    variant='body2'
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 1,
                                                        mt: 0.5,
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {item.total_complete}&nbsp;&nbsp;/&nbsp;&nbsp;{item.total_lesson}
                                                    &nbsp;&nbsp;|
                                                    <Icon sx={{ fontSize: 16 }} icon="AccessTimeRounded" />
                                                    {convertHMS(item.lessons.reduce((preValue, lesson) => preValue + parseInt(lesson.time ?? 0), 0), true, true, false)}
                                                </Typography>
                                            </Box>
                                            <Box
                                                className={addClasses({
                                                    [classes.iconChaperExpand]: true,
                                                    [classes.iconChaperExpanded]: openChapter[item.stt]
                                                })}
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
                                            Boolean(openChapter[item.stt]) &&
                                            item.lessons.map((lesson) => (
                                                <EpisodeItem
                                                    key={lesson.id}
                                                    courseID={course?.id ?? 0}
                                                    chapterID={item.id}
                                                    chapterIndex={item.stt}
                                                    lesson={lesson}
                                                    index2={lesson.index}
                                                    isPurchased={isPurchased}
                                                    lessonClassName={addClasses({
                                                        [classes.listItemLesson]: true,
                                                        active: !Number(urlQuery.query.test_first) && chapterAndLessonCurrent.chapter === item.code && chapterAndLessonCurrent.lesson === lesson.code,
                                                        showDeep: Boolean(lessonComplete?.[lesson.id])
                                                    })}
                                                    icon={type[lesson.type]?.icon}
                                                    onClickLesson={handleChangeLesson({
                                                        chapter: item.code,
                                                        chapterID: item.id,
                                                        chapterIndex: item.stt,
                                                        lesson: lesson.code,
                                                        lessonID: lesson.id,
                                                        lessonIndex: lesson.index,
                                                    })}
                                                    isComplete={Boolean(lessonComplete?.[lesson.id])}
                                                    active={!Number(urlQuery.query.test_first) && chapterAndLessonCurrent.chapter === item.code && chapterAndLessonCurrent.lesson === lesson.code}
                                                    courseLearningContext={courseLearningContext}
                                                />
                                            ))
                                        }
                                        <Divider />
                                    </Box>
                                })
                            }
                        }

                        return null;
                    })()
                }
                <Box
                    sx={{
                        pt: 2,
                        pb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                            opacity: 0.7,
                        }
                    }}
                    onClick={() => {
                        if (isPurchased) {
                            courseLearningContext.openReviewDialog()
                        } else {
                            window.showMessage('Chỉ học viên mới có thể đánh giá khóa học.', 'error');
                        }
                    }}
                >
                    <Rating
                        size="large"
                        precision={0.1}
                        emptyIcon={<Icon icon="Star" style={{ opacity: 0.55 }} fontSize="inherit" />}
                        name="read-only"
                        value={courseLearningContext.dataReviewCourse.rating}
                        readOnly />
                    {
                        !courseLearningContext.dataReviewCourse.isReviewed &&
                        <Chip component='span' sx={{ mt: '4px', cursor: 'pointer' }} size="small" label={<Typography component='span' sx={{ display: 'flex', alignItems: 'center', fontSize: 12 }}><Icon sx={{ fontSize: 16 }} icon={IconBit} />&nbsp;+200</Typography>} />
                    }
                </Box>
            </Box>

            <Box
                sx={{
                    zIndex: '100',
                    padding: '3px 0 4px 16px',
                    fontSize: '20px',
                    fontWeight: '400',
                    mt: '-1px',
                    backgroundColor: 'background.paper',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // marginTop: '-8px',
                    flexDirection: user.getThemeLearning() === 'main_right' ? 'unset' : 'row-reverse',

                }}
            >
                <Button
                    color='inherit'
                    {...(
                        courseLearningContext.LessonList.open ?
                            {
                                endIcon: user.getThemeLearning() === 'main_left' ? <Icon icon="ArrowForwardRounded" /> : undefined,
                                startIcon: user.getThemeLearning() === 'main_right' ? <Icon icon="ArrowBackRounded" /> : undefined,
                            }
                            :
                            {
                                endIcon: user.getThemeLearning() === 'main_right' ? <Icon icon="ArrowForwardRounded" /> : undefined,
                                startIcon: user.getThemeLearning() === 'main_left' ? <Icon icon="ArrowBackRounded" /> : undefined,
                            }
                    )}
                    onClick={courseLearningContext.LessonList.onToggle}
                    sx={{ textTransform: 'unset', fontWeight: 400, fontSize: 16, }}
                >
                    {
                        courseLearningContext.LessonList.open ?
                            __('Thu gọn')
                            :
                            __('Mở rộng')
                    }
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
        </Box >
        <ButtonShowLessonContent />
    </>
    )
}

function EpisodeItem({ lesson, lessonClassName, index2, onClickLesson, icon, isComplete, isPurchased, courseID, chapterID, chapterIndex, active, courseLearningContext }: {
    lesson: CourseLessonProps,
    index2: number,
    isComplete: boolean,
    lessonClassName: string,
    onClickLesson: () => void,
    icon: IconProps,
    isPurchased: boolean,
    courseID: ID,
    chapterID: ID,
    chapterIndex: number,
    active: boolean,
    courseLearningContext: CourseLearningContextProps,
}) {

    const classes = useStyle();

    return <Box
        key={index2}
        className={lessonClassName}
        onClick={onClickLesson}
        id={'lesson-list-' + lesson.id}
    >
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: 52,
            }}
        >

            {
                !isPurchased && !lesson.is_allow_trial ?
                    <Tooltip title="Bài học được bảo vệ">
                        <IconButton
                            color='inherit'
                            size="small"
                            className="notCursor"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
                        >
                            <Icon className="notCursor" fontSize="small" icon="LockOutlined" />
                        </IconButton>
                    </Tooltip>
                    :
                    <IconButton
                        color={isComplete ? (active ? 'primary' : 'success') : 'inherit'}
                        size="small"
                        className="notCursor"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
                    >
                        <Icon className="iconContentType" icon={icon} />
                    </IconButton>
            }
        </Box>

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                pt: 1,
                pb: 1,
                flex: '1 1',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    sx={{
                        letterSpacing: '0',
                        color: active ? 'primary.main' : 'inherit',
                    }}
                >
                    {(lesson.stt + 1 + '').padStart(2, '0')}. {lesson.title}
                    {
                        // Boolean(lesson.is_compulsory) &&
                        // <Tooltip title={__('Bài học tiên quyết')}>
                        //     <Icon size="small" icon="HelpOutlineOutlined" />
                        // </Tooltip>
                    }
                    {
                        !isComplete ?
                            <Tooltip title={__('Hoàn thành bài học để nhận ngay {{bit_bonus}} bit', {
                                bit_bonus: lesson.bit_bonus ?? 10
                            })}>
                                <Chip component='span' sx={{ ml: 1, cursor: 'pointer' }} size="small" label={<Typography component='span' sx={{ display: 'flex', alignItems: 'center', fontSize: 12 }}><Icon sx={{ fontSize: 16 }} icon={IconBit} />&nbsp;+{lesson.bit_bonus ?? 10}</Typography>} />
                            </Tooltip>
                            : null
                    }
                </Typography>
                <Tooltip
                    title={__('Lưu bài học này')}
                >
                    <IconButton
                        size="small"
                        onClick={async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            event.stopPropagation();
                            courseLearningContext.bookmarks.onChange(lesson.id);
                        }}
                        className={addClasses({
                            'love-reaction': true,
                            'active': courseLearningContext.bookmarks.state[lesson.id] === 'love',
                            [classes.hidden]: Boolean(!isPurchased && !lesson.is_allow_trial)
                        })}
                    >
                        {
                            courseLearningContext.bookmarks.state[lesson.id] === 'love' ?
                                <Icon sx={{ color: 'warning.main' }} icon="Bookmark" />
                                :
                                <Icon icon="BookmarkBorder" />
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
                    <Typography
                        variant='body2'
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            color: active ? 'primary.main' : 'inherit'
                        }}>
                        {convertHMS(lesson.time, true, true)}
                    </Typography>
                </Box>
                {
                    Boolean(lesson.resources && lesson.resources.filter(item => item.type === 'download').length > 0) &&
                    <Box
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        sx={{
                            opacity: (!isPurchased && !lesson.is_allow_trial) ? 0.6 : 1,
                            pointerEvents: (!isPurchased && !lesson.is_allow_trial) ? 'none' : 'unset',
                        }}
                    >
                        <MoreButton
                            onClose={() => {
                                document.body.classList.remove('hidden');
                            }}
                            actions={[
                                [
                                    ...(lesson.resources && (isPurchased || lesson.is_allow_trial) ? lesson.resources.map((item, index) => ({ ...item, index: index })).filter(item => item.type === 'download').map(item => ({
                                        title: item.title,
                                        icon: 'FileDownloadOutlined' as IconFormat,
                                        action: () => {
                                            document.body.classList.remove('hidden');
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
                            <Button size="small" sx={{ textTransform: 'unset', marginTop: '-10px', }} variant='outlined' color="inherit" endIcon={<Icon icon="ArrowDropDownOutlined" />} startIcon={<Icon icon="FolderOutlined" />} >Resources</Button>
                        </MoreButton>
                    </Box>
                }
            </Box>
        </Box>
    </Box >
}

export default LessonList



function CircularProgressWithLabel(
    { nComlete, nTotal, label, ...props }: CircularProgressProps & { nComlete: number, nTotal: number, value: number, label: number },
) {
    return (
        <Tooltip
            title={<Typography color='inherit' variant='body2' component='div' align='center'>{Math.round(props.value) + '%'} <br /> {nComlete + '/' + nTotal + ' hoàn thành'}</Typography>}
        >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                    variant="determinate"
                    sx={{
                        color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
                        position: 'absolute',
                        left: 0,
                    }}
                    thickness={4}
                    value={100}
                />
                <CircularProgress variant="determinate" {...props} color={props.value === 100 ? 'success' : 'primary'} />
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
                    <Typography
                        variant="h5"
                    >{label}</Typography>
                </Box>
            </Box>
        </Tooltip>
    );
}

type KeyOfFilter = 'complete' | 'notComplete' | 'free' | 'advance' | 'saved' | 'noted'
