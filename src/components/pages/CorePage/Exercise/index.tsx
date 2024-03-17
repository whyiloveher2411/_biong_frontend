import { Grid } from '@mui/material'
import Page from 'components/templates/Page'
import CourseSection from './components/CourseSection'
import Problems from './components/Problems'
import { useParams } from 'react-router-dom';
import ExerciseDetail from './ExerciseDetail';

function Excercise() {

    let { tab, subtab1 } = useParams<{
        tab: string,
        subtab1: string,
    }>();

    if (tab && !subtab1) {
        return <ExerciseDetail slug={tab} />
    }

    return (
        <Page
            title='Luyện tập'
            description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
        >
            <Grid
                container
                spacing={3}
                sx={{
                    paddingTop: 6
                }}
            >
                <Grid item md={9}>
                    <CourseSection />
                    {/* <StudyPlan /> */}
                    <Problems />
                </Grid>
                <Grid item md={3}>


                </Grid>
            </Grid>
        </Page>
    )
}

export default Excercise