import { createContext } from "react";

const CourseLearningContext = createContext({
    LessonList: {
        open: false,
        onToggle: () => {
            //
        }
    },
    nexLesson: () => {
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
}