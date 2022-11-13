import Grid from 'components/atoms/Grid';
import CourseSingle from 'components/molecules/CourseSingle';
import React from 'react'
import courseService, { CourseProps } from 'services/courseService';

function Advertisement({ postID, index }: { postID: ID, index: number }) {

    const [courses, setCourses] = React.useState<CourseProps[] | null>(null);

    React.useEffect(() => {
        (async () => {
            setCourses(await courseService.course.getFeatured());
        })()
    }, []);

    return (
        <Grid
            container
            spacing={6}
            sx={{
                justifyContent: 'center',
            }}
        >
            {
                courses !== null ?
                    [0, 1].map((item) => (
                        courses[item + index] ?
                            <Grid
                                key={item + index}
                                item
                                xs={12}
                                md={6}
                            >
                                <CourseSingle course={courses[item + index]} />
                            </Grid>
                            :
                            <React.Fragment key={index} />
                    ))
                    :
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
    )
}

export default Advertisement