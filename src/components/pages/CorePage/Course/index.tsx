import { useParams } from 'react-router-dom';
import CourseDetail from './CourseDetail';
import CoursePage from './CoursePage';

function index() {

    let { tab } = useParams<{
        tab: string,
    }>();

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