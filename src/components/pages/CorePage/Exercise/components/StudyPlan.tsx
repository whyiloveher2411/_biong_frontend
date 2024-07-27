import { Box, Breadcrumbs, Grid, Typography } from '@mui/material';
import Page from 'components/templates/Page';
import React from 'react';
import { Link } from 'react-router-dom';
import codingChallengeService, { StudyPlanGroup } from 'services/codingChallengeService';
import StudyPlanSingle from './excerciesDetail/StudyPlanSingle';


function StudyPlan() {

    const [studyPlanGroups, setStudyPlanGroups] = React.useState<Array<StudyPlanGroup>>([]);

    React.useEffect(() => {

        (async () => {

            const studyPlanGroups = await codingChallengeService.listStudyPlanGroup();
            setStudyPlanGroups(studyPlanGroups);

        })();

    }, []);

    return (<Page
        title={'Kế hoạch học tập'}
        description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
        image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
    >
        <Box
            sx={{
                maxWidth: 1000,
                m: '0 auto',
                mt: 15,
            }}
        >
            <Breadcrumbs maxItems={5} aria-label="breadcrumb">
                <Link color="inherit" to="/">
                    Trang chủ
                </Link>
                <Link color="inherit" to="/exercise">
                    Luyện tập
                </Link>
            </Breadcrumbs>

            <Typography variant='h1'
                sx={{
                    mb: 3,
                    mt: 1,
                }}
            >
                Kế hoạch học tập
            </Typography>
            <Box sx={{
                display: 'flex',
                gap: 5,
                flexDirection: 'column',
            }}>
                {
                    studyPlanGroups.map((group, index) => <Box
                        key={index}
                    >
                        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>{group.title}</Typography>
                        <Grid
                            container
                            spacing={3}
                            sx={{ pt: 1 }}
                        >
                            {
                                group.study_plans.map((study) => <Grid
                                    key={study.id}
                                    item
                                    md={4}
                                >
                                    <StudyPlanSingle
                                        study={study}
                                    />
                                </Grid>)
                            }
                        </Grid>
                    </Box>)
                }
            </Box>
        </Box>
    </Page >)
}

export default StudyPlan