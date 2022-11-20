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

const HomePage = () => {

    const settings = useSelector((state: RootState) => state.settings);

    return (
        <Page
            title={__('Trang chủ')}
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
            <Typography sx={{ mt: 3, lineHeight: '56px', letterSpacing: '-0.5px', fontSize: 48, fontWeight: 400 }} variant='h1' component='h2'>Kiến thức mở ra trang mới cuộc đời bạn</Typography>
            <Typography sx={{ mt: 2, mb: 3, lineHeight: '28px', fontSize: 18 }} variant='subtitle1'>Cho dù bạn muốn tìm kiếm công việc, khởi nghiệp, phát triển hoạt động kinh doanh hay chỉ đơn giản là muốn khám phá thế giới, hãy chọn lộ trình học tập mà bạn muốn và bắt đầu câu chuyện thành công của bạn.</Typography>
            <Button size="large" variant='contained' onClick={() => {
                featuredCoursesRef.current?.scrollIntoView({ behavior: "smooth" });
            }}>Khám phá các khóa học</Button>
        </Banner>

        <MyLearning />

        <Roadmaps />

        <Box
            component='section'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                mt: 8,
            }}
            ref={featuredCoursesRef}
        >
            <FeaturedCourses />
        </Box>
    </Box>
}