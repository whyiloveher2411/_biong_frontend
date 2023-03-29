import Grid from 'components/atoms/Grid';
// import { PaginationProps } from 'components/atoms/TablePagination';
import Typography from 'components/atoms/Typography';
import CourseSingle from 'components/molecules/CourseSingle';
import { __ } from 'helpers/i18n';
import { useIndexedDB } from 'hook/useApi';
// import usePaginate from 'hook/usePaginate';
import React from 'react';
import courseService, { CourseProps } from 'services/courseService';
import { UserState, useUser } from 'store/user/user.reducers';

function FeaturedCourses() {

    const { data: courses, setData: setCourses } = useIndexedDB<CourseProps[] | null>({ key: 'Homepage/FeaturedCourses', defaultValue: null });

    const user = useUser();

    React.useEffect(() => {
        if (user._state !== UserState.unknown) {
            (async () => {
                setCourses(await courseService.course.getFeatured());
            })();
        }
    }, [user]);

    return (
        <>
            <Typography sx={{ fontWeight: 400 }} variant='h3' component='h2'>
                {__('Khóa học nổi bật')}
            </Typography>
            <Grid
                container
                spacing={6}
                sx={{
                    justifyContent: 'center',
                    zIndex: 1,
                }}
            >
                {/* {
                    courses ?
                        paginate.isLoading ?
                            [1, 2, 3, 4, 5, 6].map((item) => (
                                <Grid
                                    key={item}
                                    item
                                    xs={12}
                                    md={6}
                                    lg={4}
                                >
                                    <CourseSingle />
                                </Grid>
                            ))
                            :
                            courses.data?.map((item, index) => (
                                <Grid
                                    key={index}
                                    item
                                    xs={12}
                                    md={6}
                                    lg={4}
                                >
                                    <CourseSingle course={item} />
                                </Grid>
                            ))
                        :
                        [1, 2, 3, 4, 5, 6].map((item) => (
                            <Grid
                                key={item}
                                item
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <CourseSingle />
                            </Grid>
                        ))
                } */}
                {
                    courses !== null ?
                        courses.map((item, index) => (
                            <Grid
                                key={index}
                                item
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <CourseSingle course={item} />
                            </Grid>
                        ))
                        :
                        [1, 2, 3].map((item) => (
                            <Grid
                                key={item}
                                item
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <CourseSingle />
                            </Grid>
                        ))
                }
            </Grid>
            {/* {
                courses !== null &&
                paginate.component
            } */}
        </>
    )
}

export default FeaturedCourses