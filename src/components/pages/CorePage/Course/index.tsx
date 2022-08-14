import { useParams } from 'react-router-dom';
import CourseDetail from './CourseDetail';
import CourseLearning from './CourseLearning';
import CoursePage from './CoursePage';

function index() {

    let { tab, subtab1 } = useParams<{
        tab: string,
        subtab1: string,
    }>();

    if (tab && subtab1 && subtab1 === 'learning') {
        return (<CourseLearning slug={tab}/>)
    }

    if (tab) {
        return (
            <CourseDetail />
        )
    }

    return (
        <CoursePage />
    )
}

export default index