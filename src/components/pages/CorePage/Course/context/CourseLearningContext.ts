import { createContext } from "react";
import { ChapterAndLessonCurrentState, CourseProps } from "services/courseService";

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
    chapterAndLessonCurrent: null,
    handleChangeLesson: () => {
        //
    }
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
    nexLesson: () => void,
    setAutoplayNextLesson: (value: boolean) => void,
}