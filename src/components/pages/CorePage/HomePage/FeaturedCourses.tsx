import { Box } from '@mui/material';
import Grid from 'components/atoms/Grid';
// import { PaginationProps } from 'components/atoms/TablePagination';
import Typography from 'components/atoms/Typography';
import CourseSingle from 'components/molecules/CourseSingle';
import { __ } from 'helpers/i18n';
// import usePaginate from 'hook/usePaginate';
import React from 'react';
import courseService, { CourseProps } from 'services/courseService';

function FeaturedCourses() {

    const [courses, setCourses] = React.useState<CourseProps[] | null>(null);

    // const titleCourseRef = React.useRef<HTMLDivElement>(null);

    // const paginate = usePaginate<CourseProps>({
    //     name: 'co',
    //     enableLoadFirst: true,
    //     onChange: async (data) => {
    //         setCourses(await courseService.course.getFeatured());
    //     },
    //     scrollToELementAfterChange: titleCourseRef,
    //     isChangeUrl: false,
    //     pagination: courses,
    //     rowsPerPageOptions: [6, 12, 18, 24],
    //     data: {
    //         current_page: 1,
    //         per_page: 6
    //     }
    // });

    React.useEffect(() => {
        (async () => {
            setCourses(await courseService.course.getFeatured());
        })()
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                mt: 6
            }}
        // ref={titleCourseRef}
        >
            <Typography variant='h3' component='h2'>
                {__('Featured Courses')}
            </Typography>
            <Grid
                container
                spacing={3}
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
                }
            </Grid>
            {/* {
                courses !== null &&
                paginate.component
            } */}
        </Box>
    )
}

export default FeaturedCourses