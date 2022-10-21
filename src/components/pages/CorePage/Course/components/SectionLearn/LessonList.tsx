import { Box, Button, Checkbox, IconButton, Theme, Typography } from '@mui/material'
import Divider from 'components/atoms/Divider'
import Icon, { IconProps } from 'components/atoms/Icon'
import makeCSS from 'components/atoms/makeCSS'
import Tooltip from 'components/atoms/Tooltip'
import { convertHMS } from 'helpers/date'
import { addClasses } from 'helpers/dom'
import { __ } from 'helpers/i18n'
import React from 'react'
import { ChapterAndLessonCurrentState, CourseLessonProps, CourseProps } from 'services/courseService'
import reactionService from 'services/reactionService'
import CourseLearningContext, { CourseLearningContextProps } from '../../context/CourseLearningContext'


const useStyle = makeCSS((theme: Theme) => ({
    listItemChapter: {
        border: '1px solid transparent',
        cursor: 'pointer',
        borderRadius: 4,
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
        borderRadius: 4,
        paddingLeft: 16,
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
    lessonItem: {
        paddingLeft: 0,
    },
    checkboxLesson: {
        // color: 'white',
        // opacity: 0.7,
        // '&.Mui-checked': {
        // color: theme.palette.primary.main,
        // opacity: 1,
        // }
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

function LessonList({ course, type, chapterAndLessonCurrent, lessonComplete, handleChangeCompleteLesson, ...props }: {
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
    handleChangeCompleteLesson: (lesson: CourseLessonProps) => void,
    chapterAndLessonCurrent: ChapterAndLessonCurrentState,
}) {

    const classes = useStyle();

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

    const handleClickCheckBoxLesson = (lesson: CourseLessonProps) => () => {
        handleChangeCompleteLesson(lesson);
    }

    React.useEffect(() => {
        setOpenChapter(prev => ({
            ...prev,
            [chapterAndLessonCurrent.chapterIndex]: true
        }))
    }, [chapterAndLessonCurrent]);

    return (
        courseLearningContext.LessonList.open ?
            <Box
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
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        // marginTop: '-8px',
                    }}
                >
                    {__('Nội dung khóa học')}
                    <IconButton
                        onClick={courseLearningContext.LessonList.onToggle}
                    >
                        <Icon icon="ClearRounded" />
                    </IconButton>
                </Box>
                {
                    course !== null &&
                    course?.course_detail?.content?.map((item, index) => (
                        <React.Fragment key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
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
                                            color: 'inherit',
                                            letterSpacing: '0',
                                            fontWeight: 500,
                                            fontSize: '1.2rem',
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
                                        }}
                                    >
                                        {item.lessons.reduce((total, lesson) => {
                                            if (lessonComplete && lessonComplete[lesson.id]) {
                                                total++;
                                            }
                                            return total;
                                        }, 0)} / {item.lessons.length}
                                        &nbsp;|&nbsp;
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
                                            // color: 'white',
                                            // opacity: 0.7,
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
                                        lesson={lesson}
                                        index2={indexOfLesson}
                                        lessonClassName={addClasses({
                                            [classes.listItemLesson]: true,
                                            [classes.lessonItem]: true,
                                            active: chapterAndLessonCurrent.chapter === item.code && chapterAndLessonCurrent.lesson === lesson.code
                                        })}
                                        checkBoxClassName={classes.checkboxLesson}
                                        icon={type[lesson.type]?.icon}
                                        onChangeCheckBox={handleClickCheckBoxLesson(lesson)}
                                        onClickLesson={handleChangeLesson({
                                            chapter: item.code,
                                            chapterID: item.id,
                                            chapterIndex: index,
                                            lesson: lesson.code,
                                            lessonID: lesson.id,
                                            lessonIndex: indexOfLesson,
                                        })}
                                        defaultChecked={Boolean(lessonComplete?.[lesson.id])}
                                    />
                                ))
                            }
                            <Divider sx={{
                                // background: 'white',
                                // opacity: 0.1
                            }} />
                        </React.Fragment>
                    ))
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

function EpisodeItem({ lesson, lessonClassName, index2, onChangeCheckBox, onClickLesson, checkBoxClassName, icon, defaultChecked }: {
    lesson: CourseLessonProps,
    index2: number,
    defaultChecked: boolean,
    lessonClassName: string,
    checkBoxClassName: string,
    onChangeCheckBox: () => void,
    onClickLesson: () => void,
    icon: IconProps,
}) {

    const [loveState, setLoveState] = React.useState(window.__course_reactions[lesson.id] === 'love' ? true : false);

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
                // color: 'white',
                // opacity: 0.7
            }}
        >
            <Checkbox id={'course_lesson_' + lesson.code} onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()} checked={defaultChecked} className={checkBoxClassName} onChange={onChangeCheckBox} />
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
                    {(lesson.stt + 1 + '').padStart(2, '0')}. {lesson.title}
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
                            });
                            setLoveState(prev => {
                                if (prev) {
                                    window.__course_reactions[lesson.id] = '[none]';
                                } else {
                                    window.__course_reactions[lesson.id] = 'love';
                                }

                                return !prev;
                            });
                        }}
                        className={'love-reaction ' + (loveState ? 'active' : '')}
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
                <Typography
                    variant='body2'
                    sx={{
                        // color: 'white',
                        // opacity: 0.5,
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                    }}>
                    <Icon icon={icon} sx={{ width: 16, height: 16 }} />
                    {convertHMS(lesson.time, true, true)}
                </Typography>
                {
                    // Boolean(Array.isArray(lesson.resources) && lesson.resources.length) &&
                    // <Box
                    //     onClick={(e) => {
                    //         e.stopPropagation();
                    //     }}
                    // >
                    //     <MoreButton
                    //         autoFocus={false}
                    //         actions={[
                    //             lesson.resources?.map(item => ({
                    //                 title: item.title,
                    //                 action: () => {
                    //                     if (item.type === 'download') {

                    //                         let elem = document.createElement('iframe');
                    //                         elem.style.cssText = 'width:0;height:0,top:0;position:fixed;opacity:0;pointer-events:none;visibility:hidden;';
                    //                         elem.setAttribute('src', getImageUrl(item.file_download));
                    //                         document.body.appendChild(elem);
                    //                         setTimeout(() => {
                    //                             elem.remove();
                    //                         }, 10000);

                    //                     } else {
                    //                         item.link && window.open(item.link, '_blank');
                    //                     }
                    //                 },
                    //                 icon: item.type === 'link' ? 'OpenInNewOutlined' : 'CloudDownloadOutlined'
                    //             })) ?? []
                    //         ]}
                    //     >
                    //         <Button
                    //             variant='outlined'
                    //             color='inherit'
                    //             size="small"
                    //             sx={{
                    //                 // color: '#b0b3b8'
                    //             }}
                    //             startIcon={<Icon icon="FolderOpenOutlined" />}
                    //             endIcon={<Icon icon="ArrowDropDownOutlined" />}
                    //         >
                    //             {__('Tài nguyên')}
                    //         </Button>
                    //     </MoreButton>
                    // </Box>
                }
            </Box>
        </Box>
    </Box>
}

export default LessonList