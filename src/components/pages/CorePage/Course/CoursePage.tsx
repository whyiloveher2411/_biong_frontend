import { Box, Theme } from '@mui/material';
import Grid from 'components/atoms/Grid';
import makeCSS from 'components/atoms/makeCSS';
import { PaginationProps } from 'components/atoms/TablePagination';
import Typography from 'components/atoms/Typography';
import CourseSingle from 'components/molecules/CourseSingle';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import courseService, { CourseProps } from 'services/courseService';


const useStyles = makeCSS((theme: Theme) => ({
    root: {
        padding: theme.spacing(3)
    },
    container: {
        marginTop: theme.spacing(3)
    },
    dates: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    startDateButton: {
        marginRight: theme.spacing(1)
    },
    endDateButton: {
        marginLeft: theme.spacing(1)
    },
    calendarTodayIcon: {
        marginRight: theme.spacing(1)
    }
}));

const CoursePage = () => {
    const classes = useStyles();

    const [courses, setCourses] = React.useState<PaginationProps<CourseProps> | null>(null)

    const titleCourseRef = React.useRef<HTMLDivElement>(null);

    const paginate = usePaginate<CourseProps>({
        name: 'ex',
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


    return (
        <Page
            title={__("Course")}
        >
            <Typography
                component="h2"
                gutterBottom
                variant="overline"
            >
                {__('Course')}
            </Typography>
            <Typography
                component="h1"
                gutterBottom
                variant="h3"
            >
                {__("Development Courses")}
            </Typography>
            <Typography variant="subtitle1">
                {
                    [
                        '“Act as if what you do makes a difference. It does.” — William James',
                        '“It is when we are most lost that we sometimes find our truest friends.” — Brothers Grimm',
                        '“Life isn’t finding shelter in the storm. It’s about learning to dance in the rain.” ― Sherrilyn Kenyon',
                        '“When you have a dream, you’ve got to grab it and never let go.” — Carol Burnett',
                        '“Everything that’s broken was beautiful at one time. And our mistakes make us better people.” — Jamie Hoang',
                        '“We all can dance when we find music that we love.” — Giles Andreae',
                        '“I can’t change the direction of the wind, but I can adjust my sails to always reach my destination.” — Jimmy Dean'
                    ][Math.floor(Math.random() * 7)]
                }
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    mt: 6
                }}
                ref={titleCourseRef}
            >
                <Grid
                    className={classes.container}
                    container
                    spacing={4}
                >
                    <Grid
                        item
                        xs={12}
                    >
                        <Typography
                            component="h4"
                            variant="h4"
                        >
                            {__('Courses to get you started')}
                        </Typography>
                    </Grid>
                    {
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
                    }

                </Grid>
                {
                    courses !== null &&
                    paginate.component
                }
            </Box>
        </Page>
    );
};

export default CoursePage;
