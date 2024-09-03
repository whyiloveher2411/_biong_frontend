import React from 'react'
import { useDocsCourseRelated } from './TopicDetail';
import { Grid, Typography } from '@mui/material';
import { UserState, useUser } from 'store/user/user.reducers';
import CourseSingle from 'components/molecules/CourseSingle';

function CourseRelated({ slugTopic }: { slugTopic: string }) {

    const { data: courses, refetch } = useDocsCourseRelated(slugTopic);
    const firstLoad = React.useRef(false);

    const user = useUser();

    React.useEffect(() => {
        if (user._state !== UserState.unknown && firstLoad.current) {
            refetch();
        }
        firstLoad.current = true;
    }, [user]);

    if (courses === null) {
        return (
            <>
                <Typography variant='h2' sx={{ fontWeight: 'bold', mt: 6, mb: 3 }}>Khóa học liên quan</Typography>
                <Grid
                    container
                    spacing={3}
                    sx={{
                        zIndex: 1,
                    }}
                >
                    {
                        [1, 2].map((item) => (
                            <Grid
                                key={item}
                                item
                                xs={12}
                                md={6}
                            >
                                <CourseSingle />
                            </Grid>
                        ))
                    }
                </Grid>
            </>
        )
    }

    if (courses.length) {
        return (
            <>
                <Typography variant='h2' sx={{ fontWeight: 'bold', mt: 6, mb: 3 }}>Khóa học liên quan</Typography>
                <Grid
                    container
                    spacing={3}
                    sx={{
                        zIndex: 1,
                    }}
                >
                    {
                        courses.map((item, index) => (
                            <Grid
                                key={index}
                                item
                                xs={12}
                                md={6}
                            >
                                <CourseSingle course={item} />
                            </Grid>
                        ))
                    }
                </Grid>
            </>
        )
    }

    return <React.Fragment />
}

export default CourseRelated
