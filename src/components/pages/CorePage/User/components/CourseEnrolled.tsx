import { Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { PaginationProps } from 'components/atoms/TablePagination'
import CourseSingle from 'components/molecules/CourseSingle'
import { __ } from 'helpers/i18n'
import usePaginate from 'hook/usePaginate'
import React from 'react'
import courseService, { CourseProps } from 'services/courseService'
import { UserProps } from 'store/user/user.reducers'

function CourseEnrolled({ user }: {
    user: UserProps
}) {

    const [courses, setCourses] = React.useState<PaginationProps<CourseWithReviewProp> | null>(null)

    const titleCourseRef = React.useRef<HTMLDivElement>(null);

    const paginate = usePaginate<CourseWithReviewProp>({
        template: 'page',
        name: 'ex',
        onChange: async (data) => {
            handleOnloadCourses();
        },
        scrollToELementAfterChange: titleCourseRef,
        pagination: courses,
        rowsPerPageOptions: [6, 12, 18, 24],
        data: {
            current_page: 1,
            per_page: 6
        }
    });

    const handleOnloadCourses = async () => {
        setCourses(await courseService.getCourseSharing({
            ...paginate.data,
            user: user.id,
        }));
    }

    React.useEffect(() => {

        if (user.active_course_sharing) {
            handleOnloadCourses();
        }

    }, []);

    if (user.active_course_sharing) {
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
                <Typography
                    component="h4"
                    variant="h4"
                    align='center'
                    sx={{
                        mb: 4
                    }}
                >
                    {__('Các khóa học {{username}} đã tham gia', {
                        username: user.full_name
                    })}
                </Typography>
                <Grid
                    container
                    spacing={6}
                >
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
                                            <CourseSingle
                                                course={item}
                                            // actionChild={
                                            //     item.my_review ?
                                            //         <Tooltip title={item.my_review.detail}>
                                            //             <Box
                                            //                 sx={{
                                            //                     display: 'flex',
                                            //                     flexDirection: 'column',
                                            //                     alignItems: 'flex-end',
                                            //                     cursor: 'pointer',
                                            //                 }}
                                            //             >
                                            //                 <Rating name="read-only" precision={0.1} value={parseFloat(item.my_review.rating + '')} readOnly />
                                            //                 <Typography variant='body2'>{__('Ratting of {{username}}', {
                                            //                     username: user.full_name
                                            //                 })}</Typography>
                                            //             </Box>
                                            //         </Tooltip>
                                            //         :
                                            //         <></>
                                            // }
                                            />
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
                                        {__('Có vẻ như {{username}} hiện vẫn chưa đăng ký khóa học nào', {
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

    return (<Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: 800,
            margin: '24px auto 0',
        }}
    >
        <Typography variant="h4">{__('Tài khoản riêng tư')}</Typography>
        <Typography>{__('Hiện tại, Thông tin liên quan đến khóa học đã đăng ký của tài khoản này không được chia sẽ với người khác.')}</Typography>
    </Box>
    );

}

export default CourseEnrolled

interface CourseWithReviewProp extends CourseProps {
    my_review?: {
        detail: string,
        id: ID,
        rating: number,
    }
}