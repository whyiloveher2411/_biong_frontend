import Icon from 'components/atoms/Icon';
import ListItemIcon from 'components/atoms/ListItemIcon';
import ListItemText from 'components/atoms/ListItemText';
import Menu from 'components/atoms/Menu';
import MenuItem from 'components/atoms/MenuItem';
import Typography from 'components/atoms/Typography';
import React from 'react';
import CourseLearningContext, { CourseLearningContextProps } from '../../context/CourseLearningContext';
import { CourseChapterProps, CourseLessonProps } from 'services/courseService';
import Divider from 'components/atoms/Divider';

function LessonListInAppBar() {

    const courseLearningContext = React.useContext(CourseLearningContext);

    const [openMenuDetail, setOpenMenuDetail] = React.useState<{
        anchorEl: Element | null,
        open: boolean,
        type: 'chapter' | 'lesson'
    }>({
        anchorEl: null,
        open: false,
        type: 'lesson',
    });

    const [openMenuDetailLesson, setOpenMenuDetailLesson] = React.useState<{
        anchorEl: Element | null,
        open: boolean,
        chapter: CourseChapterProps | null,
        chapterIndex: number,
    }>({
        anchorEl: null,
        open: false,
        chapter: null,
        chapterIndex: -1,
    });


    if (courseLearningContext.course
        && courseLearningContext.chapterAndLessonCurrent
        && courseLearningContext.dataForCourseCurrent
    ) {
        return (<>
            <Typography
                noWrap
                sx={{
                    cursor: 'pointer'
                }}
                onClick={(e) => setOpenMenuDetail({ open: true, anchorEl: e.currentTarget, type: 'chapter' })}
            >
                {courseLearningContext.course.course_detail?.content?.[courseLearningContext.chapterAndLessonCurrent.chapterIndex]?.title}
            </Typography>
            -
            <Typography
                noWrap
                sx={{
                    cursor: 'pointer'
                }}
                onClick={(e) => setOpenMenuDetail({ open: true, anchorEl: e.currentTarget, type: 'lesson' })}
            >
                {courseLearningContext.course.course_detail?.content?.[courseLearningContext.chapterAndLessonCurrent.chapterIndex]?.lessons?.[courseLearningContext.chapterAndLessonCurrent.lessonIndex]?.title}
            </Typography>

            <Menu
                anchorEl={openMenuDetail.anchorEl}
                open={openMenuDetail.open}
                onClose={() => setOpenMenuDetail(prev => ({ ...prev, open: false }))}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                sx={{
                    maxHeight: 400,
                }}
            >
                {
                    openMenuDetail.type === 'chapter' ?
                        courseLearningContext.course.course_detail?.content?.map((chapter, chapterIndex) => (
                            <MenuItem
                                key={chapter.id}
                                selected={
                                    chapter.id === courseLearningContext.chapterAndLessonCurrent?.chapterID
                                }
                                disabled={!chapter.lessons || chapter.lessons.length < 1}
                                onClick={(e) => {

                                    setOpenMenuDetailLesson({
                                        open: true,
                                        chapter: chapter,
                                        chapterIndex: chapterIndex,
                                        anchorEl: e.currentTarget,
                                    });

                                }}
                            >{chapterIndex + 1}. {chapter.title}</MenuItem>
                        ))
                        :
                        courseLearningContext.course.course_detail?.content?.[courseLearningContext.chapterAndLessonCurrent.chapterIndex]?.lessons?.map((lesson, lessonIndex) => (
                            <MenuLessonItem
                                key={lesson.id}
                                lesson={lesson}
                                onAfterChangeLesson={() => setOpenMenuDetail(prev => ({ ...prev, open: false }))}
                                lessonIndex={lessonIndex}
                                courseLearningContext={courseLearningContext}
                                chapter={courseLearningContext.chapterAndLessonCurrent?.chapter ?? ''}
                                chapterID={courseLearningContext.chapterAndLessonCurrent?.chapterID ?? ''}
                                chapterIndex={courseLearningContext.chapterAndLessonCurrent?.chapterIndex ?? 0}
                            />
                        ))
                }
            </Menu>

            {
                Boolean(openMenuDetailLesson.open && openMenuDetailLesson.chapter !== null) &&
                <Menu
                    anchorEl={openMenuDetailLesson.anchorEl}
                    open={openMenuDetailLesson.open}
                    onClose={() => setOpenMenuDetailLesson(prev => ({ ...prev, open: false }))}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    sx={{
                        maxHeight: 400,
                    }}
                >
                    <MenuItem
                        onClick={() => setOpenMenuDetailLesson(prev => ({ ...prev, open: false }))}
                    >
                        <ListItemIcon>
                            <Icon icon='ArrowBackRounded' />
                        </ListItemIcon>
                        <ListItemText> Quay lại</ListItemText>
                    </MenuItem>
                    <Divider color='dark' />
                    {
                        openMenuDetailLesson.chapter !== null &&
                        openMenuDetailLesson.chapter.lessons?.map((lesson, lessonIndex) => (
                            <MenuLessonItem
                                key={lesson.id}
                                lesson={lesson}
                                onAfterChangeLesson={() => {
                                    setOpenMenuDetail(prev => ({ ...prev, open: false }));
                                    setOpenMenuDetailLesson(prev => ({ ...prev, open: false }));
                                }}
                                lessonIndex={lessonIndex}
                                courseLearningContext={courseLearningContext}
                                chapter={openMenuDetailLesson.chapter?.code ?? ''}
                                chapterID={openMenuDetailLesson.chapter?.id ?? ''}
                                chapterIndex={openMenuDetailLesson.chapterIndex}
                            />

                        ))
                    }
                </Menu>
            }

        </>
        )
    }

    return null;
}

export default LessonListInAppBar

function MenuLessonItem({ courseLearningContext, lesson, lessonIndex, onAfterChangeLesson, chapter, chapterID, chapterIndex }: {
    courseLearningContext: CourseLearningContextProps,
    lesson: CourseLessonProps,
    lessonIndex: number, onAfterChangeLesson: () => void,
    chapter: string,
    chapterID: ID,
    chapterIndex: number,
}) {


    return <MenuItem
        key={lesson.id}
        selected={
            lesson.id === courseLearningContext.chapterAndLessonCurrent?.lessonID
        }
        onClick={() => {
            courseLearningContext.handleChangeLesson({
                chapter: chapter,
                chapterID: chapterID,
                chapterIndex: chapterIndex,
                lesson: lesson.code,
                lessonID: lesson.id,
                lessonIndex: lessonIndex,
            });
            onAfterChangeLesson();
        }}
    >
        <ListItemIcon>
            <Icon sx={{
                color: courseLearningContext.dataForCourseCurrent?.lesson_completed[lesson.id] ? 'success.main' : 'inherit'
            }} icon={courseLearningContext.iconTypeLesson[lesson.type]?.icon} />
        </ListItemIcon>
        <ListItemText> {lesson.title}</ListItemText>
    </MenuItem>;

}