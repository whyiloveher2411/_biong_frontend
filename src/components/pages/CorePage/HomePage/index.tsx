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

            <Banner
                subTitle='học viện Spacedev.vn'
                title='Học chuẩn kiến thức, không lo đổi việc'
                description='Nâng cao kỹ năng với các khóa học video trực tuyến của chúng tôi được giảng dạy bởi các chuyên gia trong lĩnh vực của họ'
                color='#ffcAb9'
                image='/images/bn-top.jpg'
            />

            <MyLearning />

            <FeaturedCourses />

        </Page>
    );
};

export default HomePage;
