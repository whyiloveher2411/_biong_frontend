import { Box, Button, Chip, CircularProgress, CircularProgressProps, IconButton, Theme, Typography } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import Divider from 'components/atoms/Divider'
import Icon, { IconProps } from 'components/atoms/Icon'
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
import React from 'react'
import { useSelector } from 'react-redux'
import { ChapterAndLessonCurrentState, CourseLessonProps, CourseProps } from 'services/courseService'
import reactionService from 'services/reactionService'
import { RootState } from 'store/configureStore'
import { UserProps } from 'store/user/user.reducers'
import CourseLearningContext, { CourseLearningContextProps } from '../../context/CourseLearningContext'
import ButtonShowLessonContent from './ButtonShowLessonContent'


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

    const [filterLessonLove, setFilterLessonLove] = React.useState(false);

    const [searchByName, setSearchByName] = React.useState('');

    const courseLearningContext = React.useContext<CourseLearningContextProps>(CourseLearningContext);

    const handleChangeLesson = (data: ChapterAndLessonCurrentState) => () => {
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

    return (<>
        <Box
            sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                width: '400px',
                zIndex: 1031,
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
                        transform: 'translateX(calc(100% - 40px))',
                    } : {
                        transform: 'translateX(calc(-100% + 40px))',
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
                <Tooltip title="Bài học bạn thích">
                    <IconButton
                        size="small"
                        onClick={() => setFilterLessonLove(prev => !prev)}
                    >
                        {
                            filterLessonLove ?
                                <Icon sx={{ color: '#ff2f26' }} icon="FavoriteRounded" />
                                :
                                <Icon icon="FavoriteBorderRounded" />
                        }
                    </IconButton>
                </Tooltip>
            </Box>

            <Box
                sx={{
                    overflowX: 'hidden',
                    flexGrow: 1,
                    backgroundColor: 'background.paper',
                    overflowY: 'overlay',
                }}
                className='custom_scroll custom'
            >
                {

                    (() => {
                        if (course !== null) {

                            let chapters = course?.course_detail?.content;
                            if (chapters) {
                                const hiddenChapter: { [key: ID]: true } = {};
                                const allwayShowChapter: { [key: ID]: true } = {};

                                if (filterLessonLove) {

                                    chapters.forEach(chapter => {
                                        if (chapter.lessons.filter(lesson => window.__course_reactions?.[lesson.id] === 'love').length === 0) {
                                            hiddenChapter[chapter.id] = true;
                                        }
                                    });

                                }
                                let searchBySlugName = convertToSlug(searchByName, '');

                                if (searchBySlugName) {
                                    chapters.forEach(chapter => {

                                        if (!convertToSlug(chapter.title, '').includes(searchBySlugName)) {
                                            if (chapter.lessons.filter(lesson => convertToSlug(lesson.title, '').includes(searchBySlugName)).length === 0) {
                                                hiddenChapter[chapter.id] = true;
                                            }
                                        } else {
                                            allwayShowChapter[chapter.id] = true;
                                        }
                                    });
                                }

                                if (Object.keys(hiddenChapter).length === chapters.length) {
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

                                return chapters.map((item, index) => {

                                    if (hiddenChapter[item.id]) {
                                        return <React.Fragment key={index} />;
                                    }

                                    const lessonCompleteOfChapter = item.lessons.reduce((total, lesson) => {
                                        if (lessonComplete && lessonComplete[lesson.id]) {
                                            total++;
                                        }
                                        return total;
                                    }, 0);

                                    return <Box key={index}>
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
                                            <Box
                                                sx={{
                                                    height: '100%',
                                                    pr: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >

                                                <CircularProgressWithLabel
                                                    value={(!lessonCompleteOfChapter || !item.lessons.length) ? 0 : lessonCompleteOfChapter * 100 / item.lessons.length}
                                                    nComlete={lessonCompleteOfChapter ? lessonCompleteOfChapter : 0}
                                                    nTotal={item.lessons.length ? item.lessons.length : 0}
                                                    label={index + 1}
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
                                                    {lessonCompleteOfChapter}&nbsp;&nbsp;/&nbsp;&nbsp;{item.lessons.length}
                                                    &nbsp;&nbsp;|
                                                    <Icon sx={{ fontSize: 16 }} icon="AccessTimeRounded" />
                                                    {convertHMS(item.lessons.reduce((preValue, lesson) => preValue + parseInt(lesson.time ?? 0), 0), true, true, false)}
                                                </Typography>
                                            </Box>
                                            <Box
                                                className={addClasses({
                                                    [classes.iconChaperExpand]: true,
                                                    [classes.iconChaperExpanded]: openChapter[index]
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
                                            Boolean(lessonComplete && (openChapter[index])) &&
                                            item.lessons.map((lesson, indexOfLesson) => (
                                                <EpisodeItem
                                                    key={indexOfLesson}
                                                    filterLessonLove={filterLessonLove}
                                                    searchByName={searchBySlugName}
                                                    allwayShowChapter={allwayShowChapter[item.id]}
                                                    courseID={course?.id ?? 0}
                                                    chapterID={item.id}
                                                    chapterIndex={index}
                                                    lesson={lesson}
                                                    user={user}
                                                    index2={indexOfLesson}
                                                    isPurchased={isPurchased}
                                                    lessonClassName={addClasses({
                                                        [classes.listItemLesson]: true,
                                                        active: chapterAndLessonCurrent.chapter === item.code && chapterAndLessonCurrent.lesson === lesson.code,
                                                        showDeep: Boolean(lessonComplete?.[lesson.id])
                                                    })}
                                                    icon={type[lesson.type]?.icon}
                                                    onClickLesson={handleChangeLesson({
                                                        chapter: item.code,
                                                        chapterID: item.id,
                                                        chapterIndex: index,
                                                        lesson: lesson.code,
                                                        lessonID: lesson.id,
                                                        lessonIndex: indexOfLesson,
                                                    })}
                                                    isComplete={Boolean(lessonComplete?.[lesson.id])}
                                                    openTest={courseLearningContext.openTest}
                                                    answerTest={courseLearningContext.answerTest}
                                                    active={chapterAndLessonCurrent.chapter === item.code && chapterAndLessonCurrent.lesson === lesson.code}
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

                    endIcon={user.getThemeLearning() === 'main_left' ? <Icon icon="ArrowForwardRounded" /> : undefined}
                    startIcon={user.getThemeLearning() === 'main_right' ? <Icon icon="ArrowBackRounded" /> : undefined}

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
        </Box >
        <ButtonShowLessonContent />
    </>
    )
}

function EpisodeItem({ lesson, lessonClassName, index2, onClickLesson, icon, isComplete, user, isPurchased, openTest, answerTest, courseID, chapterID, chapterIndex, active, filterLessonLove, searchByName, allwayShowChapter }: {
    lesson: CourseLessonProps,
    index2: number,
    isComplete: boolean,
    lessonClassName: string,
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
    active: boolean,
    filterLessonLove: boolean,
    searchByName: string,
    allwayShowChapter: boolean
}) {

    const [loveState, setLoveState] = React.useState(window.__course_reactions?.[lesson.id] === 'love' ? true : false);

    const classes = useStyle();

    if (!allwayShowChapter && filterLessonLove && !loveState) {
        return null;
    }

    if (!allwayShowChapter && searchByName && !convertToSlug(lesson.title, '').includes(searchByName)) {
        return null;
    }

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
                            <Tooltip title="Hoàn thành bài học để nhận ngay 10 bit">
                                <Chip component='span' sx={{ ml: 1, cursor: 'pointer' }} size="small" label={<Typography component='span' sx={{ display: 'flex', alignItems: 'center', fontSize: 12 }}><Icon sx={{ fontSize: 16 }} icon={IconBit} />&nbsp;+10</Typography>} />
                            </Tooltip>
                            : null
                    }
                </Typography>
                <Tooltip
                    title={__('Tôi thích bài học này')}
                >
                    <IconButton
                        size="small"
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
                    {
                        Boolean(lesson.tests?.length) &&
                        lesson.tests?.map(item => (
                            <Tooltip
                                key={item.id}
                                title={item.title}
                            >
                                {
                                    (isPurchased || lesson.is_allow_trial) ?
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
                                        :
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
                                            }}
                                        >
                                            <Icon sx={{ fontSize: 18 }} icon="LockOutlined" />
                                        </IconButton>
                                }

                            </Tooltip>
                        ))
                    }
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
                            actions={[
                                [
                                    ...(lesson.resources && (isPurchased || lesson.is_allow_trial) ? lesson.resources.map((item, index) => ({ ...item, index: index })).filter(item => item.type === 'download').map(item => ({
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
                    {/* <Icon className="icon-emoj" icon="EmojiEventsOutlined" /> */}
                    <Typography
                        variant="h5"
                    >{label}</Typography>
                </Box>
            </Box>
        </Tooltip>
    );
}