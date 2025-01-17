import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from 'components/atoms/Button';
import Banner from 'components/molecules/Banner';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';
import FeaturedCourses from './FeaturedCourses';
import MyLearning from './MyLearning';
import Roadmaps from './Roadmaps';
// import CareerPaths from './CareerPaths';
import Blogs from './Blogs';
import TestQuiz from './TestQuiz';


const HomePage = () => {

    const settings = useSelector((state: RootState) => state.settings);

    return (
        <Page
            title={__('Trang chủ')}
            description='Từ việc học kiến thức mới đến tìm kiếm công việc, khởi nghiệp hoặc phát triển kinh doanh, hãy chọn lộ trình học tập phù hợp với ước mơ của bạn và bắt đầu chuyến hành trình thành công của bạn.'
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
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
            color='#ffcAb9'
            image='/images/bn-top.jpg'
        >
            <Typography sx={theme => ({
                mt: 3,
                fontWeight: 500,
                fontSize: 14,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: theme.palette.text.disabled,
                '&:after': {
                    backgroundColor: theme.palette.primary.main,
                    content: "''",
                    display: 'block',
                    height: '2px',
                    marginTop: '16px',
                    width: '80px',
                }
            })}>học viện Spacedev.vn</Typography>
            <Typography sx={{ mt: 3, lineHeight: '56px', letterSpacing: '-0.5px', fontSize: 48, fontWeight: 400 }} variant='h1' component='h2'><Typography component='span' sx={{ color: 'primary.main', fontSize: 'inherit', }}>Học tập</Typography> không <Typography component='span' sx={{ color: 'error.main', fontSize: 'inherit', }}>giới hạn</Typography></Typography>
            <Typography sx={{ mt: 2, mb: 3, lineHeight: '28px', fontSize: 18 }} variant='subtitle1'>Từ việc học kiến thức mới đến tìm kiếm công việc, khởi nghiệp hoặc phát triển kinh doanh, hãy chọn lộ trình học tập phù hợp với ước mơ của bạn và bắt đầu chuyến hành trình thành công của bạn.</Typography>
            <Button size="large" variant='contained' onClick={() => {
                featuredCoursesRef.current?.scrollIntoView({ behavior: "smooth" });
            }}>Khám phá các khóa học</Button>
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