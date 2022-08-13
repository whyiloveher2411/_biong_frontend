import { Box, Grid, Typography } from '@mui/material';
import { PaginationProps } from 'components/atoms/TablePagination';
import CourseSingle from 'components/molecules/CourseSingle';
import ExploreSingle from 'components/molecules/ExploreSingle';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import courseService, { CourseProps } from 'services/courseService';
import exploreService, { ExploreProps } from 'services/exploreService';

function index() {

    const [courses, setCourses] = React.useState<PaginationProps<CourseProps> | null>(null);

    const titleCourseRef = React.useRef<HTMLDivElement>(null);
    const titleExploreRef = React.useRef<HTMLDivElement>(null);

    const paginate = usePaginate<CourseProps>({
        name: 'co',
        enableLoadFirst: true,
        onChange: async (data) => {
            setCourses(await courseService.getAll(data));
        },
        scrollToELementAfterChange: titleCourseRef,
        pagination: courses,
        rowsPerPageOptions: [6, 12, 18, 24],
        data: {
            current_page: 1,
            per_page: 6
        }
    });

    const [explores, setExplores] = React.useState<PaginationProps<ExploreProps> | null>(null);

    const paginateExplore = usePaginate<ExploreProps>({
        name: 'ex',
        enableLoadFirst: true,
        onChange: async (data) => {
            let dataFormApi = await exploreService.gets(data);
            setExplores(dataFormApi);
        },
        scrollToELementAfterChange: titleExploreRef,
        pagination: explores,
        rowsPerPageOptions: [6, 12, 18, 24],
        data: {
            current_page: 1,
            per_page: 6
        }
    });

    return (
        <Page
            title={__('Favorites')}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                    mt: 4,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                    ref={titleCourseRef}
                >
                    <Typography variant='h3' component='h2'>{__('Course')}</Typography>
                    <Grid
                        container
                        spacing={3}
                    >
                        {
                            courses ?
                                paginate.isLoading ?
                                    <LoadingSeketonCourse />
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
                                <LoadingSeketonCourse />
                        }
                    </Grid>
                    {
                        explores !== null &&
                        paginate.component
                    }
                </Box>



                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                    ref={titleExploreRef}
                >
                    <Typography variant='h3' component='h2'>{__('Explore')}</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <Grid container spacing={4}>
                            {
                                explores ?
                                    paginateExplore.isLoading ?
                                        <LoadingSeketonExplore />
                                        :
                                        explores.data.map((item, index) => (
                                            <Grid key={index} item xs={12} md={4}>
                                                <ExploreSingle explore={item} />
                                            </Grid>
                                        ))
                                    :
                                    <LoadingSeketonExplore />
                            }
                        </Grid>
                        {
                            explores !== null &&
                            paginateExplore.component
                        }
                    </Box>
                </Box>
            </Box>
        </Page>
    )
}

function LoadingSeketonCourse() {
    return <>
        {
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
    </>
}

function LoadingSeketonExplore() {
    return <>
        {
            [1, 2, 3, 4, 5, 6].map((item) => (
                <Grid key={item} item xs={12} md={4}>
                    <ExploreSingle />
                </Grid>
            ))
        }
    </>
}

export default index