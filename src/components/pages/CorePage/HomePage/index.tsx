import { Box, Card, CardContent } from '@mui/material';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Typography from 'components/atoms/Typography';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';
import FeaturedCourses from './FeaturedCourses';
import MyLearning from './MyLearning';

const HomePage = () => {

    const user = useSelector((state: RootState) => state.user);

    return (
        <Page
            title={__("Home page")}
            disableTitle
        >
            <Typography
                component="h1"
                gutterBottom
                variant="h3"
                sx={{ pt: 3 }}
            >
                {__("Welcome back {{user}}", {
                    user: user.full_name
                })}
            </Typography>
            <Typography variant="subtitle1">
                {
                    [
                        '“Act as if what you do makes a difference. It does.” — William James',
                        '“It is when we are most lost that we sometimes find our truest friends.” — Brothers Grimm',
                        '“Life isn’t finding shelter in the storm. It’s about learning to dance in the rain.” ― Sherrilyn Kenyon',
                        '“When you have a dream, you’ve got to grab it and never let go.” — Carol Burnett',
                        '“Everything that’s broken was beautiful at one time. And our mistakes make us better people.” — Jamie Hoang',
                        '“We all can dance when we find music that we love.” — Giles Andreae',
                        '“I can’t change the direction of the wind, but I can adjust my sails to always reach my destination.” — Jimmy Dean'
                    ][Math.floor(Math.random() * 7)]
                }
            </Typography>

            <Box
                sx={{
                    mt: 3,
                    position: 'relative',
                }}
            >
                <Card
                    sx={{
                        position: 'absolute',
                        zIndex: 1,
                        top: 64,
                        left: 64,
                        maxWidth: 500,
                    }}

                >
                    <CardContent>
                        <Typography variant='h3' component='h2'>Học chuẩn kiến thức, không lo đổi việc</Typography>
                        <Typography sx={{ mt: 1 }} variant='subtitle1'>Nâng cao kỹ năng với các khóa học video trực tuyến của chúng tôi được giảng dạy bởi các chuyên gia trong lĩnh vực của họ</Typography>
                    </CardContent>
                </Card>
                <ImageLazyLoading alt="gallery image" sx={{ borderRadius: '8px', height: '400px' }} src={'/images/bn-top.jpg'} />
            </Box>

            <MyLearning />

            <FeaturedCourses />

        </Page>
    );
};

export default HomePage;
