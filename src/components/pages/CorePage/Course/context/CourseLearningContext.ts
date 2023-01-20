import { createContext } from "react";
import { ChapterAndLessonCurrentState, CourseLessonProps, CourseProps, DataForCourseCurrent } from "services/courseService";
import { LessonPosition } from "../CourseLearning";

const CourseLearningContext = createContext<CourseLearningContextProps>({
    course: null,
    LessonList: {
        open: false,
        onToggle: () => {
            //
        }
    },
    nexLesson: () => {
        //
    },
    setAutoplayNextLesson: () => {
        //
    },
    toggleOpenVideoChapter: () => {
        //
    },
    chapterAndLessonCurrent: null,
    handleChangeLesson: () => {
        //
    },
    isPurchased: false,
    openTest: () => {
        //
    },
    answerTest: {},
    addAnswerTest: () => {
        //
    },
    handleClickInputCheckBoxLesson: () => {
        //
    },
    dataForCourseCurrent: null,
    chapterVideoRef: { current: null },
    positionPrevLesson: null,
    positionNextLesson: null,
});

export default CourseLearningContext;


export interface CourseLearningContextProps {
    course: CourseProps | null,
    chapterAndLessonCurrent: null | ChapterAndLessonCurrentState,
    handleChangeLesson: (data: ChapterAndLessonCurrentState) => void,
    LessonList: {
        open: boolean,
        onToggle: () => void
    },
    nexLesson: (focusNextLesson?: boolean) => void,
    setAutoplayNextLesson: (value: boolean) => void,
    toggleOpenVideoChapter: () => void,
    isPurchased: boolean,
    openTest: (id: ID | null) => void,
    answerTest: {
        [key: ID]: number;
    },
    addAnswerTest: (id: ID) => void,
    handleClickInputCheckBoxLesson: (lesson: CourseLessonProps) => void,
    dataForCourseCurrent: DataForCourseCurrent | null,
    chapterVideoRef: React.MutableRefObject<HTMLElement | null>,
    positionPrevLesson: LessonPosition | null,
    positionNextLesson: LessonPosition | null,
}