import { Grid } from '@mui/material';
import Page from 'components/templates/Page';
import Calendar from './excerciesDetail/Calendar';
import CourseSection from './excerciesDetail/CourseSection';
import ProblemsTable from './ProblemsTable';
import Session from './Session';
import TrendingCompanies from './TrendingCompanies';
import StudyPlanJoined from './excerciesDetail/StudyPlanJoined';

function ProblemListing() {

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
                    <ProblemsTable type='all' />
                </Grid>
                <Grid item md={3}>
                    <Calendar />
                    <StudyPlanJoined />
                    <TrendingCompanies />
                    <Session />
                </Grid>
            </Grid>
        </Page>
    )
}

export default ProblemListing