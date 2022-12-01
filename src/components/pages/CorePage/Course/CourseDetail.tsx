import { Skeleton, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import makeCSS from 'components/atoms/makeCSS';
import Tabs from 'components/atoms/Tabs';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import useResponsive from 'hook/useResponsive';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import courseService, { CourseProps } from 'services/courseService';
import eCommerceService from 'services/eCommerceService';
import SectionAbout from './components/SectionAbout';
import SectionContent from './components/SectionContent';
import SectionCourseSumary from './components/SectionCourseSumary';
import SectionFAQ from './components/SectionFAQ';
import SectionInstructors from './components/SectionInstructors';
import SectionPolicy from './components/SectionPolicy';
import SectionProjects from './components/SectionProjects';
import SectionReview from './components/SectionReview';

const useStyles = makeCSS({
    tabsContent: {
        '& .tabContent': {
            paddingTop: 32,
            maxWidth: 910,
            margin: '0 auto',
        }
    }
});

const CoursePage = () => {

    const classes = useStyles();

    const [data, setData] = React.useState<{
        course: CourseProps | null,
        isPurchased: boolean,
        config: {
            type: JsonFormat
        }
    }>({
        course: null,
        isPurchased: false,
        config: {
            type: {}
        }
    });

    const theme = useTheme();

    const { tab } = useParams();

    const navigate = useNavigate();

    const isMobile = useResponsive('down', 'sm');

    React.useEffect(() => {

        setData(() => ({
            course: null,
            isPurchased: false,
            config: {
                type: {}
            }
        }));


        if (tab) {

            let courseFormDB = courseService.find(tab);
            let config = courseService.config();
            let checkPurchased = eCommerceService.checkPurchased(tab);

            Promise.all([courseFormDB, config, checkPurchased]).then(([courseFormDB, config, checkPurchased]) => {

                if (courseFormDB) {
                    setData({
                        course: courseFormDB,
                        isPurchased: checkPurchased,
                        config: {
                            type: config?.type ?? {}
                        }
                    });
                } else {
                    navigate('/');
                }

            });

        }

    }, [tab]);

    return (
        <Page
            title={data.course ? data.course.title : __("Course")}
        >

            <SectionCourseSumary course={data.course} isPurchased={data.isPurchased} />
            {
                data.course ?
                    <>
                        <Box
                            className={classes.tabsContent}
                            sx={{
                                mt: 8
                            }}
                        >
                            <Tabs
                                name="course_detail"
                                isDenseLabel={false}
                                isTabSticky
                                positionSticky={isMobile ? 52 : 64}
                                activeAutoScrollToTab
                                backgroundTabWarper={theme.palette.body.background}
                                tabsProps={{
                                    scrollButtons: isMobile ? true : 'auto',
                                    allowScrollButtonsMobile: true,
                                }}
                                tabItemCenter
                                tabs={[
                                    {
                                        key: 'about',
                                        title: __('Giới thiệu'),
                                        content: () => <SectionAbout course={data.course} />
                                    },
                                    {
                                        key: 'instructors',
                                        title: __('Người hướng dẫn'),
                                        content: () => <SectionInstructors course={data.course} />
                                    },
                                    {
                                        key: 'course-content',
                                        title: __('Nội dung khóa học'),
                                        content: () => <SectionContent type={data.config.type} course={data.course} />
                                    },
                                    {
                                        key: 'projects',
                                        title: __('Dự án'),
                                        content: () => <SectionProjects course={data.course} />
                                    },
                                    {
                                        key: 'faq',
                                        title: __('Câu hỏi'),
                                        content: () => <SectionFAQ course={data.course} />
                                    },
                                    {
                                        key: 'reviews',
                                        title: __('Đánh giá'),
                                        content: () => <SectionReview course={data.course} isPurchased={data.isPurchased} />
                                    },
                                    {
                                        key: 'policy',
                                        title: __('Chính sách khóa học'),
                                        content: () => <SectionPolicy />
                                    },
                                    // {
                                    //     key: 'changelog',
                                    //     title: __('Nhật ký thay đổi'),
                                    //     content: () => <Box sx={{ pt: 2, maxWidth: 800, margin: '0 auto ' }}><SectionChangelog course={data.course} /></Box>
                                    // },
                                ]}
                            />

                        </Box>
                    </>
                    :
                    <Box
                        sx={{
                            mt: 8
                        }}
                    >
                        <Skeleton variant='rectangular' sx={{ height: 48 }} />
                        <Skeleton variant='rectangular' sx={{ height: 32, mt: 2 }} />
                        <Skeleton variant='rectangular' sx={{ height: 32, mt: 2 }} />
                        <Skeleton variant='rectangular' sx={{ height: 32, mt: 2 }} />
                        <Skeleton variant='rectangular' sx={{ height: 32, mt: 2 }} />
                        <Skeleton variant='rectangular' sx={{ height: 32, mt: 2 }} />
                        <Skeleton variant='rectangular' sx={{ height: 32, mt: 2 }} />
                        <Skeleton variant='rectangular' sx={{ height: 32, mt: 2 }} />
                    </Box>
            }
        </Page >
    );

};


export default CoursePage;
