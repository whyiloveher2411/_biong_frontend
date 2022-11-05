import { createContext } from "react";

const CourseLearningContext = createContext<CourseLearningContextProps>({
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
    }
});

export default CourseLearningContext;


export interface CourseLearningContextProps {
    LessonList: {
        open: boolean,
        onToggle: () => void
    },
    nexLesson: () => void,
    setAutoplayNextLesson: (value: boolean) => void,
}