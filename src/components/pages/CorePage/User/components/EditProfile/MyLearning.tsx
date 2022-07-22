import { Grid } from '@mui/material';
import CourseSingle from 'components/molecules/CourseSingle';
import NoticeContent from 'components/molecules/NoticeContent';
import { __ } from 'helpers/i18n';
import React from 'react';
import courseService, { CourseProps } from 'services/courseService';
import eCommerceService, { ProductWithMyReview } from 'services/eCommerceService';

function MyLearning() {

    const [data, setData] = React.useState<{
        courses: ProductWithMyReview[],
        completed: {
            [key: ID]: number
        }
    } | false>(false);

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
                    })
                }
            });

        })()

    }, []);

    if (data) {

        if (data.courses.length) {
            return (
                <Grid
                    container
                    spacing={4}
                >

                    {
                        data.courses.map((course, index) => (
                            <Grid item key={index} xs={12} md={4}>
                                <CourseSingle course={course as CourseProps} isPurchased={true} completed={data.completed[course.id] ?? 0} />
                            </Grid>
                        ))
                    }
                </Grid>
            )
        }

        return <NoticeContent
            title={__('Không tìm khóa học')}
            description={__('Có thể hiện tại bạn không đăng ký khóa học nào, hãy đăng ký ngay để có thể học những điều mới mẽ từ chúng tôi')}
            image="/images/undraw_work_chat_erdt.svg"
            buttonLink="/course"
            buttonLabel="Đi đến trang danh sách khóa học"
        />
    }

    return <Grid
        container
        spacing={4}
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

export default MyLearning