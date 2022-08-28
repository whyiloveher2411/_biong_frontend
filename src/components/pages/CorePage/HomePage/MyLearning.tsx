import { Box, Button, Grid, Typography } from '@mui/material';
import CourseProgress from 'components/molecules/CourseProgress';
import { __ } from 'helpers/i18n';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CourseProps } from 'services/courseService';
import elearningService from 'services/elearningService';
import { RootState } from 'store/configureStore';
import { UserState } from 'store/user/user.reducers';

function MyLearning() {

    const user = useSelector((state: RootState) => state.user);

    const [data, setData] = React.useState<Array<CourseProps> | null>(null);

    React.useEffect(() => {
        if (user._state === UserState.identify) {
            (async () => {
                const courses = await elearningService.getCourseUnfinished();
                setData(courses);
            })()
        }
    }, [user]);

    if (user._state === UserState.identify && data && data.length > 0) {

        return (
            <Box
                component='section'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    mt: 6
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                    }}
                >
                    <Typography sx={{ fontWeight: 400 }} variant='h3' component='h2'>{__('Tiếp tục học nhé {{user_full_name}}', {
                        user_full_name: user.full_name
                    })}</Typography>
                    <Button
                        variant='text'
                        component={Link}
                        to={'/user/' + user.slug + '/my-learning'}
                    >
                        {__('Khóa học của tôi')}
                    </Button>
                </Box>
                <Grid
                    container
                    spacing={3}
                >
                    {
                        data.map((course, index) => (
                            <Grid
                                key={index}
                                item
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <CourseProgress course={course} />
                            </Grid>
                        ))
                    }

                </Grid>
            </Box>
        )

    }

    return null;
}

export default MyLearning