import { Box } from '@mui/material';
import Banner from 'components/molecules/Banner';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import FeaturedCourses from './FeaturedCourses';
import MyLearning from './MyLearning';

const HomePage = () => {

    return (
        <Page
            title={__("Home page")}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                }}
            >
                <Banner
                    subTitle='học viện Spacedev.vn'
                    title='Kiến thức mở ra trang mới cuộc đời bạn'
                    description='Cho dù bạn muốn tìm kiếm công việc, khởi nghiệp, phát triển hoạt động kinh doanh hay chỉ đơn giản là muốn khám phá thế giới, hãy chọn lộ trình học tập mà bạn muốn và bắt đầu câu chuyện thành công của bạn.'
                    color='#ffcAb9'
                    image='/images/bn-top.jpg'
                />

                <MyLearning />

                <FeaturedCourses />
            </Box>
        </Page>
    );
};

export default HomePage;
