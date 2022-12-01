import { Box, Grid, Rating, Typography } from '@mui/material';
import Tooltip from 'components/atoms/Tooltip';
import CourseSingle from 'components/molecules/CourseSingle';
import NoticeContent from 'components/molecules/NoticeContent';
import { __ } from 'helpers/i18n';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import courseService, { CourseProps } from 'services/courseService';
import eCommerceService, { ProductWithMyReview } from 'services/eCommerceService';
import { RootState } from 'store/configureStore';
import { UserProps, UserState } from 'store/user/user.reducers';
import ReviewCourse from '../../Course/components/ReviewCourse';

function MyLearning({ user }: {
    user: UserProps
}) {

    const myAccount = useSelector((state: RootState) => state.user);

    const [data, setData] = React.useState<{
        courses: ProductWithMyReview[],
        completed: {
            [key: ID]: number
        }
    } | false>(false);

    const [openDialogReviews, setOpenDialogReviews] = React.useState<{
        [key: ID]: boolean,
    }>({});

    React.useEffect(() => {

        (async () => {

            const coursesApi = eCommerceService.getProductOfMe();

            const courseComplete = courseService.getAllLessonCompleted();

            Promise.all([coursesApi, courseComplete]).then(([coursesApi, courseComplete]) => {

                if (coursesApi) {
                    coursesApi.forEach(course => {
                        courseService.parseContent(course as CourseProps);
                    });

                    setData({
                        courses: coursesApi,
                        completed: courseComplete,
                    });
                }
            });

        })()

    }, []);

    const handleReloadCourse = async () => {
        const coursesApi = await eCommerceService.getProductOfMe();

        if (coursesApi) {
            coursesApi.forEach(course => {
                courseService.parseContent(course as CourseProps);
            });

            setData(prev => ({
                completed: prev ? prev.completed : {},
                courses: coursesApi,
            }));
        }
    };

    if (myAccount._state === UserState.identify && ((myAccount.id + '') === (user.id + ''))) {

        if (data) {

            if (data.courses.length) {
                return (
                    <Grid
                        container
                        spacing={6}
                        sx={{
                            mt: -4
                        }}
                    >

                        {
                            data.courses.map((course, index) => (
                                <Grid item key={index} xs={12} md={4}>
                                    <CourseSingle
                                        course={course as CourseProps}
                                        isPurchased={true}
                                        completed={data.completed[course.id] ?? 0}
                                        disableRating
                                        actionChild={
                                            (course as CourseProps).course_detail?.is_comming_soon ?
                                                <></>
                                                :
                                                course.my_review ?
                                                    <Tooltip
                                                        title={course.my_review.detail}>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'flex-end',
                                                                cursor: 'pointer',
                                                                '&:hover .text_item': {
                                                                    display: 'var(--hoverDisplay) !important',
                                                                }
                                                            }}
                                                            onClick={() => setOpenDialogReviews(prev => ({ ...prev, [course.id]: true }))}
                                                        >
                                                            <Rating name="read-only" precision={0.1} value={parseFloat(course.my_review.rating + '')} readOnly />
                                                            <Typography variant='body2' className="text_item" style={{ ['--hoverDisplay' as string]: 'none' }}>{__('Đánh giá của bạn')}</Typography>
                                                            <Typography variant='body2' className="text_item" style={{ ['--hoverDisplay' as string]: 'block', display: 'none' }}>{__('Chỉnh sửa đánh giá')}</Typography>
                                                        </Box>
                                                    </Tooltip>
                                                    :
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-end',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => setOpenDialogReviews(prev => ({ ...prev, [course.id]: true }))}
                                                    >
                                                        <Rating name="read-only" precision={0.1} value={0} readOnly />
                                                        <Typography variant='body2'>{__('Đánh giá khóa học')}</Typography>
                                                    </Box>
                                        }
                                    />
                                    <ReviewCourse
                                        course={course as CourseProps}
                                        open={Boolean(openDialogReviews[course.id])}
                                        onClose={() => setOpenDialogReviews(prev => ({ ...prev, [course.id]: false }))}
                                        data={{
                                            content: course.my_review?.detail ?? '',
                                            rating: course.my_review?.rating ?? 5,
                                            is_incognito: course.my_review?.is_incognito ?? 0,
                                        }}
                                        handleAfterConfimReview={() => {
                                            handleReloadCourse();
                                            setOpenDialogReviews(prev => ({ ...prev, [course.id]: false }));
                                        }}
                                    />
                                </Grid>
                            ))
                        }
                    </Grid>
                )
            }

            return <NoticeContent
                title={__('Không tìm thấy khóa học')}
                description={__('Hiện tại bạn không đăng ký khóa học nào, hãy đăng ký ngay và tiếp tục trải nghiệm.')}
                image="/images/undraw_work_chat_erdt.svg"
                buttonLink="/"
                buttonLabel={__("Quay về trang chủ")}
            />
        }

        return <Grid
            container
            spacing={6}
            sx={{
                mt: -4
            }}
        >
            {
                [1, 2, 3].map((index) => (
                    <Grid item key={index} xs={12} md={4}>
                        <CourseSingle completed={100} />
                    </Grid>
                ))
            }
        </Grid>

    }

    return <Navigate to={'/user/' + user.slug} />
}

export default MyLearning