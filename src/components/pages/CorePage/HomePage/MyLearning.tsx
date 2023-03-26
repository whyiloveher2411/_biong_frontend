import { Box, Button, Grid, Skeleton, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import CourseProgress from 'components/molecules/CourseProgress';
import { __ } from 'helpers/i18n';
import { useIndexedDB } from 'hook/useApi';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CourseProps } from 'services/courseService';
import elearningService from 'services/elearningService';
import { RootState } from 'store/configureStore';
import { UserState } from 'store/user/user.reducers';

function MyLearning() {

    const user = useSelector((state: RootState) => state.user);

    const { data, setData } = useIndexedDB<Array<CourseProps> | null>({ key: 'Homepage/MyLearning', defaultValue: null, isUseLocalStorage: true });

    React.useEffect(() => {
        if (user._state === UserState.identify) {
            (async () => {
                const courses = await elearningService.getCourseUnfinished();
                setData(courses);
            })()
        }
    }, [user]);

    if (user._state === UserState.identify) {
        return (
            <Box
                component='section'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    mt: data && data.length < 1 ? 0 : 12,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1,
                    }}
                >
                    {
                        data && data.length ?
                            <>
                                <Typography sx={{ fontWeight: 400 }} variant='h3' component='h2'>{__('Tiếp tục học nhé {{user_full_name}}', {
                                    user_full_name: user.full_name
                                })}</Typography>
                                <Button
                                    variant='text'
                                    component={Link}
                                    to={'/user/' + user.slug + '/my-learning'}
                                    startIcon={<Icon icon="ArrowForwardRounded" />}
                                >
                                    {__('Khóa học của tôi')}
                                </Button>
                            </>

                            :
                            !data ?
                                <>
                                    <Skeleton variant='rectangular'>
                                        <Typography sx={{ fontWeight: 400 }} variant='h3' component='h2'>{__('Tiếp tục học nhé {{user_full_name}}', {
                                            user_full_name: user.full_name
                                        })}</Typography>
                                    </Skeleton>
                                    <Skeleton variant='rectangular'>
                                        <Button
                                            variant='text'
                                        >
                                            {__('Khóa học của tôi')}
                                        </Button>
                                    </Skeleton>
                                </>
                                :
                                <></>
                    }
                </Box>
                <Grid
                    container
                    spacing={6}
                >
                    {
                        data ?
                            data.map((course, index) => (
                                course.course_detail?.is_comming_soon ?
                                    <React.Fragment key={index} />
                                    :
                                    <Grid
                                        key={index}
                                        item
                                        xs={12}
                                        md={6}
                                        sm={6}
                                        lg={4}
                                    >
                                        <CourseProgress course={course} />
                                    </Grid>
                            ))
                            :
                            [0, 1, 2].map((_i) => (
                                <Grid
                                    key={_i}
                                    item
                                    xs={12}
                                    md={6}
                                    sm={6}
                                    lg={4}
                                >
                                    <CourseProgress />
                                </Grid>
                            ))
                    }

                </Grid>
            </Box>
        )
    }

    if (user._state === UserState.unknown) {
        return (
            <Box
                component='section'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    mt: 12,
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
                    <Skeleton>
                        <Typography sx={{ fontWeight: 400 }} variant='h3' component='h2'>{__('Tiếp tục học nhé')}</Typography>
                    </Skeleton>
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
                    spacing={6}
                >
                    {
                        [0, 1, 2].map((_i) => (
                            <Grid
                                key={_i}
                                item
                                xs={12}
                                md={6}
                                sm={6}
                                lg={4}
                            >
                                <CourseProgress />
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