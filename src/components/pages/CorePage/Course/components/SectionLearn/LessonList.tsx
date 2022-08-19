import { Box, Button, Checkbox, IconButton, Theme, Tooltip, Typography } from '@mui/material'
import Divider from 'components/atoms/Divider'
import Icon, { IconProps } from 'components/atoms/Icon'
import makeCSS from 'components/atoms/makeCSS'
import MoreButton from 'components/atoms/MoreButton'
import { convertHMS } from 'helpers/date'
import { addClasses } from 'helpers/dom'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import React from 'react'
import { ChapterAndLessonCurrentState, CourseLessonProps, CourseProps } from 'services/courseService'
import CourseLearningContext, { CourseLearningContextProps } from '../../context/CourseLearningContext'


const useStyle = makeCSS((theme: Theme) => ({
    listItemChapter: {
        border: '1px solid transparent',
        cursor: 'pointer',
        borderRadius: 4,
        paddingLeft: 16,
        '&.active, &:hover': {
            background: theme.palette.dividerDark,
        }
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
    chapterAndLessonCurrent: ChapterAndLessonCurrentState
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
                                className={classes.listItemChapter}
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
                                        {__('Bài học {{lessonCount}}', { lessonCount: item.lessons.length })}
                                        <Icon icon="AccessTimeFilledRounded" sx={{ width: 16, height: 16 }} />
                                        {convertHMS(item.lessons.reduce((preValue, lesson) => preValue + parseInt(lesson.time ?? 0), 0))}
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
                                            [classes.listItemChapter]: true,
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
                        position: 'absolute',
                        zIndex: 9,
                        marginTop: 2,
                        color: 'white',
                        background: 'black',
                        borderColor: 'dividerDark',
                        transition: 'all 300ms',
                        right: '100%',
                        transform: 'translateX(3rem)',
                        '&:hover': {
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

    return <Box
        key={index2}
        sx={{
            display: 'flex',
            pl: 1,
            pr: 1,
        }}
        className={lessonClassName}
        onClick={onClickLesson}
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
            <Checkbox id={'course_lesson_' + lesson.code} onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()} defaultChecked={defaultChecked} className={checkBoxClassName} onChange={onChangeCheckBox} />
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
            <Typography
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    fontSize: 14,
                    letterSpacing: '0',
                }}
            >
                {(lesson.stt + 1 + '').padStart(2, '0')}. {lesson.title}
                {
                    Boolean(lesson.is_compulsory) &&
                    <Tooltip title={__('Bài học tiên quyết')}>
                        <img src="/images/crown.svg" style={{ width: 24 }} />
                    </Tooltip>
                }
            </Typography>
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
                    {convertHMS(lesson.time)}
                </Typography>
                {
                    Boolean(Array.isArray(lesson.resources) && lesson.resources.length) &&
                    <Box
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <MoreButton
                            autoFocus={false}
                            actions={[
                                lesson.resources?.map(item => ({
                                    title: item.title,
                                    action: () => {
                                        if (item.type === 'download') {

                                            let elem = document.createElement('iframe');
                                            elem.style.cssText = 'width:0;height:0,top:0;position:fixed;opacity:0;pointer-events:none;visibility:hidden;';
                                            elem.setAttribute('src', getImageUrl(item.file_download));
                                            document.body.appendChild(elem);
                                            setTimeout(() => {
                                                elem.remove();
                                            }, 10000);

                                        } else {
                                            item.link && window.open(item.link, '_blank');
                                        }
                                    },
                                    icon: item.type === 'link' ? 'OpenInNewOutlined' : 'CloudDownloadOutlined'
                                })) ?? []
                            ]}
                        >
                            <Button
                                variant='outlined'
                                color='inherit'
                                size="small"
                                sx={{
                                    // color: '#b0b3b8'
                                }}
                                startIcon={<Icon icon="FolderOpenOutlined" />}
                                endIcon={<Icon icon="ArrowDropDownOutlined" />}
                            >
                                {__('Tài nguyên')}
                            </Button>
                        </MoreButton>
                    </Box>
                }
            </Box>
        </Box>
    </Box>
}

export default LessonList