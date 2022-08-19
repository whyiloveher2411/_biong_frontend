import { createContext } from "react";

const CourseLearningContext = createContext({
    LessonList: {
        open: false,
        onToggle: () => {
            //
        }
    }
});

export default CourseLearningContext;


export interface CourseLearningContextProps {
    LessonList: {
        open: boolean,
        onToggle: () => void
    }
}