import { Skeleton, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import Tabs from 'components/atoms/Tabs';
import makeCSS from 'components/atoms/makeCSS';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import { useIndexedDB } from 'hook/useApi';
import useResponsive from 'hook/useResponsive';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import courseService, { CourseProps } from 'services/courseService';
import eCommerceService from 'services/eCommerceService';
import { UserState, useUser } from 'store/user/user.reducers';
import SectionAbout from './components/SectionAbout';
import SectionContent from './components/SectionContent';
import SectionCourseSumary from './components/SectionCourseSumary';
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

    const { tab } = useParams();

    const { data, setData } = useIndexedDB<{
        course: CourseProps | null,
        config: {
            type: JsonFormat
        }
    }>(
        {
            key: 'CourseDetail/' + (tab ?? 0),
            defaultValue: {
                course: null,
                config: {
                    type: {}
                }
            }
        });

    const { data: isPurchased, setData: setIsPurchased } = useIndexedDB({ key: 'IsPurchased/' + (tab ?? 0), defaultValue: false });

    const user = useUser();

    const theme = useTheme();


    const navigate = useNavigate();

    const isMobile = useResponsive('down', 'sm');

    React.useEffect(() => {

        if (tab && user._state !== UserState.unknown) {

            let courseFormDB = courseService.find(tab);
            let config = courseService.config();

            Promise.all([courseFormDB, config]).then(([courseFormDB, config]) => {

                if (courseFormDB) {
                    setData({
                        course: courseFormDB,
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


    React.useEffect(() => {
        if (tab) {
            (async () => {
                if (user._state === UserState.identify) {
                    let checkPurchased = await eCommerceService.checkPurchased(tab);
                    setIsPurchased(checkPurchased);
                } else {
                    setIsPurchased(false);
                }
            })()
        }
    }, [tab, user]);

    return (
        <Page
            title={data.course ? data.course.title : __("...")}
        >

            <SectionCourseSumary course={data.course} isPurchased={isPurchased} />
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
                                        key: 'reviews',
                                        title: __('Đánh giá'),
                                        content: () => <SectionReview course={data.course} isPurchased={isPurchased} />
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
