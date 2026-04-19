import { Box } from '@mui/material';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';
import FeaturedCourses from './FeaturedCourses';
import MyLearning from './MyLearning';
import Roadmaps from './Roadmaps';
// import CareerPaths from './CareerPaths';
import Banner from 'components/molecules/Banner';
import Blogs from './Blogs';
import TestQuiz from './TestQuiz';
import { HomeAppHeroContent } from './HomeAppHeroContent';
import { SpacedevAppHeroVisual } from './SpacedevAppHeroVisual';

const SPACEDEV_IOS_APP_STORE_URL =
    process.env.REACT_APP_IOS_APP_STORE_URL ?? 'https://apps.apple.com/us/app/spacedev/id6754308004';

/** Logo ứng dụng — hiển thị giữa khối banner phải */
const SPACEDEV_APP_LOGO_URL = '/images/spacedev-logo.png';

/** Nền tím đậm phần clip-path (tương tự thumbnail khóa học) */
const SPACEDEV_APP_BANNER_THUMB_COLOR = '#0c051f';

/** Ảnh marketing 1200×630 từ App Store (OG / chia sẻ) */

const HomePage = () => {

    const settings = useSelector((state: RootState) => state.settings);

    return (
        <Page
            title={__('Trang chủ')}
            description='Spacedev: học AI, lập trình và kỹ năng nghề trên điện thoại — bài ngắn, thực hành tức thì, streak và XP, học offline. Khóa học trên web tại Spacedev.vn.'
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                }}
            >
                {
                    settings.times && settings.times % 2 === 1 ?
                        <ContentHomePage />
                        :
                        <Box>
                            <ContentHomePage />
                        </Box>
                }

            </Box>
        </Page>
    );
};

export default HomePage;


function ContentHomePage() {
    const featuredCoursesRef = React.useRef<HTMLElement>(null);

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <Banner
            color='#0c051f'
            image={SPACEDEV_APP_LOGO_URL}
            imageCustom={
                <SpacedevAppHeroVisual
                    color={SPACEDEV_APP_BANNER_THUMB_COLOR}
                    logo={SPACEDEV_APP_LOGO_URL}
                    logoAlt="Spacedev app"
                />
            }
        >
            <HomeAppHeroContent
                appStoreUrl={SPACEDEV_IOS_APP_STORE_URL}
                onExploreCourses={() => {
                    featuredCoursesRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
            />
        </Banner>

        <MyLearning />

        {/* <SectionEarnBit /> */}

        <TestQuiz />

        <Roadmaps />

        <Box
            component='section'
            sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                mt: 15,
                mb: 3,
                position: 'relative',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: -36,
                    left: -48,
                    right: -48,
                    bottom: -36,
                    backgroundColor: '#c9b40f',
                    opacity: 0.2,
                    borderRadius: 3,
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                    [theme.breakpoints.down('md')]: {
                        left: -16,
                        right: -16,
                    },
                }
            })}
            ref={featuredCoursesRef}
        >
            <FeaturedCourses />
            <Box
                sx={(theme) => ({
                    position: 'absolute',
                    bottom: -36,
                    left: -48,
                    right: -48,
                    opacity: 0.2,
                    [theme.breakpoints.down('md')]: {
                        left: -16,
                        right: -16,
                    },
                })}
            >
                <svg style={{
                    fill: '#c9b40f',
                    overflowX: 'hidden',
                    position: 'absolute',
                    width: '100%',
                    pointerEvents: 'none',
                }}>
                    <path d="M 0 31 C 313 -17 359 19 530 29 S 905 -20 1303 21 S 1677 -28 2537 29 L 2537 0 L 0 0 L 0 31"></path>
                </svg>
            </Box>
        </Box>

        {/* <CareerPaths /> */}

        <Blogs />

    </Box>
}