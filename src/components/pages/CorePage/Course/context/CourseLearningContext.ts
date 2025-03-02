import { createContext } from "react";
import { ChapterAndLessonCurrentState, CourseLessonProps, CourseProps, DataForCourseCurrent } from "services/courseService";
import { LessonPosition } from "../CourseLearning";
import { IconProps } from "components/atoms/Icon";
import { ITestStatus } from "plugins/Vn4Test/testService";

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
    // answerTest: {},
    // addAnswerTest: () => {
    //     //
    // },
    handleClickInputCheckBoxLesson: () => {
        //
    },
    dataForCourseCurrent: null,
    chapterVideoRef: { current: null },
    positionPrevLesson: null,
    positionNextLesson: null,
    iconTypeLesson: {},
    bookmarks: { state: {}, onChange: () => null },
    openLogo: [true, () => null],
    openTabMain: [true, () => null],
    menuReport: null,
    dataReviewCourse: {
        open: false,
        rating: 5,
        detail: '',
        isReviewed: false,
    },
    openReviewDialog: () => null,
    testStatus: {
        entry: null,
        exit: null,
    },
    setTestStatus: () => null,
    checkReviewLesson: () => null,
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
    // answerTest: {
    //     [key: ID]: number;
    // },
    // addAnswerTest: (id: ID) => void,
    handleClickInputCheckBoxLesson: (lesson: CourseLessonProps) => void,
    dataForCourseCurrent: DataForCourseCurrent | null,
    chapterVideoRef: React.MutableRefObject<HTMLElement | null>,
    positionPrevLesson: LessonPosition | null,
    positionNextLesson: LessonPosition | null,
    iconTypeLesson: {
        [key: string]: {
            title: string;
            icon: IconProps;
        };
    },
    bookmarks: {
        state: { [key: ID]: "[none]" | "love" },
        onChange: (lessonID: ID) => void,
    },
    openLogo: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
    openTabMain: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
    menuReport: JSX.Element | null,
    openReviewDialog: () => void,
    dataReviewCourse: {
        open: boolean;
        rating: number;
        detail: string;
        isReviewed: boolean;
    },
    testStatus: {
        entry: ITestStatus | null;
        exit: ITestStatus | null;
    },
    setTestStatus: React.Dispatch<React.SetStateAction<{
        entry: ITestStatus | null;
        exit: ITestStatus | null;
    }>>,
    checkReviewLesson: () => void,
}