import { useParams } from 'react-router-dom';
import { UserState, useUser } from 'store/user/user.reducers';
import CourseDetail from './CourseDetail';
import CourseLearning from './CourseLearning';
import CoursePage from './CoursePage';

function index() {

    const user = useUser();

    let { tab, subtab1 } = useParams<{
        tab: string,
        subtab1: string,
    }>();

    if (tab && subtab1 && subtab1 === 'learning' && user._state === UserState.identify) {
        return (<CourseLearning slug={tab} />)
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