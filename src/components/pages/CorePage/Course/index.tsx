import { Box } from '@mui/material';
import Loading from 'components/atoms/Loading';
import { Navigate, useParams } from 'react-router-dom';
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

    if (tab && subtab1 && subtab1 === 'learning' && user._state !== UserState.nobody) {
        if (user._state === UserState.unknown) {
            return <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc( 100vh - 64px)',
                }}
            > <Loading open={true} isWarpper /></Box>
        }
        return (<CourseLearning slug={tab} />)
    }

    if (subtab1 === 'learning' && user._state === UserState.nobody) {
        return <Navigate to={'/auth'} />
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