import { Skeleton, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import makeCSS from 'components/atoms/makeCSS';
import Tabs from 'components/atoms/Tabs';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import courseService, { CourseProps } from 'services/courseService';
import eCommerceService from 'services/eCommerceService';
import SectionAbout from './components/SectionAbout';
import SectionContent from './components/SectionContent';
import SectionCourseSumary from './components/SectionCourseSumary';
import SectionFAQ from './components/SectionFAQ';
import SectionInstructors from './components/SectionInstructors';
import SectionProjects from './components/SectionProjects';
import SectionReview from './components/SectionReview';

const useStyles = makeCSS({
    tabsContent: {
        '& .MuiTabs-flexContainer': {
            justifyContent: 'center',
        },
        // '& .tabContent': {
        //     marginTop: 64,
        // }
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

            <SectionCourseSumary course={data.course} isPurchased={data.isPurchased} type={data.config.type} />
            {
                data.course ?
                    <>
                        {/* <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pt: 3,
                            pb: 3,
                            pl: 3,
                            pr: 3,
                            maxWidth: 1440,
                            margin: '0 auto',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                            }}
                        >
                            {
                                data.course.course_detail?.owner_detail ?
                                    <>
                                        <Link to={'/user/' + data.course.course_detail?.owner_detail?.slug}>
                                            <ImageLazyLoading
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: '50%',
                                                }}
                                                src={getImageUrl(data.course.course_detail?.owner_detail?.avatar, '/images/user-default.svg')}
                                                name={data.course.course_detail?.owner_detail?.title}
                                            />
                                        </Link>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <Link to={'/user/' + data.course.course_detail?.owner_detail?.slug}>
                                                <Typography component='h3' variant='h5'>{data.course.course_detail?.owner_detail?.title}</Typography>
                                            </Link>
                                            <Button size="small" variant='contained' color="secondary" >Subscribe</Button>
                                        </Box>
                                    </>
                                    :
                                    <></>
                            }
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                            }}
                        >
                        </Box>
                    </Box> */}

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
                                positionSticky={64}
                                activeAutoScrollToTab
                                backgroundTabWarper={theme.palette.body.background}
                                tabs={[
                                    {
                                        key: 'about',
                                        title: __('Giới thiệu'),
                                        content: () => <Box sx={{ pt: 2, maxWidth: 800, margin: '0 auto ' }}><SectionAbout course={data.course} /></Box>
                                    },
                                    {
                                        key: 'instructors',
                                        title: __('Người hướng dẫn'),
                                        content: () => <Box sx={{ pt: 2, maxWidth: 800, margin: '0 auto ' }}><SectionInstructors course={data.course} /></Box>
                                    },
                                    {
                                        key: 'course-content',
                                        title: __('Nội dung khóa học'),
                                        content: () => <Box sx={{ pt: 2, maxWidth: 800, margin: '0 auto ' }}><SectionContent type={data.config.type} course={data.course} /></Box>
                                    },
                                    {
                                        key: 'projects',
                                        title: __('Dự án'),
                                        content: () => <Box sx={{ pt: 2, maxWidth: 800, margin: '0 auto ' }}><SectionProjects course={data.course} /></Box>
                                    },
                                    {
                                        key: 'faq',
                                        title: __('Câu hỏi'),
                                        content: () => <Box sx={{ pt: 2, maxWidth: 800, margin: '0 auto ' }}><SectionFAQ course={data.course} /></Box>
                                    },
                                    {
                                        key: 'reviews',
                                        title: __('Đánh giá'),
                                        content: () => <Box sx={{ pt: 2, maxWidth: 800, margin: '0 auto ' }}><SectionReview course={data.course} /></Box>
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
