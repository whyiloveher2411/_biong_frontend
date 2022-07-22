import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { PaginationProps } from 'components/atoms/TablePagination'
import CourseSingle from 'components/molecules/CourseSingle'
import { __ } from 'helpers/i18n'
import usePaginate from 'hook/usePaginate'
import React from 'react'
import courseService, { CourseProps } from 'services/courseService'
import { UserProps } from 'store/user/user.reducers'

function MyCourse({ user }: {
    user: UserProps
}) {

    const [courses, setCourses] = React.useState<PaginationProps<CourseProps> | null>(null)

    const titleCourseRef = React.useRef<HTMLDivElement>(null);

    const paginate = usePaginate<CourseProps>({
        name: 'ex',
        enableLoadFirst: true,
        onChange: async (data) => {
            setCourses(await courseService.getCourseOfMe({
                ...data,
                user: user.id,
            }));
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
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                mt: 2
            }}
            ref={titleCourseRef}
        >
            <Grid
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
                        align='center'
                    >
                        {__('Courses that {{username}} is product owner, teaching or mentor', {
                            username: user.full_name
                        })}
                    </Typography>
                </Grid>
                {
                    (() => {
                        if (courses) {
                            if (paginate.isLoading) {
                                return [1, 2, 3, 4, 5, 6].map((item) => (
                                    <Grid
                                        key={item}
                                        item
                                        xs={12}
                                        md={6}
                                        lg={4}
                                    >
                                        <CourseSingle />
                                    </Grid>
                                ));
                            }

                            if (courses.total) {
                                return courses.data?.map((item, index) => (
                                    <Grid
                                        key={index}
                                        item
                                        xs={12}
                                        md={6}
                                        lg={4}
                                    >
                                        <CourseSingle course={item} />
                                    </Grid>
                                ));
                            }

                            return <Grid
                                item
                                xs={12}
                                md={12}
                                sx={{ paddingTop: '8px !important' }}
                            >
                                <Typography align='center'>
                                    {__('Có vẻ như {{username}} hiện không sở hữu hoặc đăng ký giảng dạy khóa học nào', {
                                        username: user.full_name
                                    })}
                                </Typography>
                            </Grid>

                        }

                        return [1, 2, 3, 4, 5, 6].map((item) => (
                            <Grid
                                key={item}
                                item
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <CourseSingle />
                            </Grid>
                        ));

                    })()
                }
            </Grid>
            {
                courses !== null &&
                paginate.component
            }
        </Box>
    )
}

export default MyCourse