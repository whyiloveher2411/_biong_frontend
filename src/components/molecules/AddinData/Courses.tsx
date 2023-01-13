import { Grid } from '@mui/material'
import React from 'react'
import { CourseProps } from 'services/courseService'
import CourseSingle from '../CourseSingle'

function Courses({ courses }: { courses?: CourseProps[] }) {
    return (
        <>
            {/* <Typography sx={{ fontWeight: 400 }} variant='h3' component='h2'>
                {__('Khóa học nổi bật')}
            </Typography> */}
            <Grid
                container
                spacing={6}
                sx={{
                    justifyContent: 'center',
                }}
            >
                {
                    courses ?
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
        </>
    )
}

export default Courses