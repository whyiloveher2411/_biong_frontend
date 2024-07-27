import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import { Box, Button, Grid, Skeleton, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import codingChallengeService, { StudyPlanProps } from 'services/codingChallengeService';
import StudyPlanSingle from './StudyPlanSingle';
import { useIndexedDB } from 'hook/useApi';

function CourseSection() {

    const { data: studyPlans } = useIndexedDB<StudyPlanProps[] | null>({
        key: 'listStudyFeatured',
        defaultValue: [],
        initFc: () => codingChallengeService.listStudyFeatured(),
        cacheTime: 24 * 60 * 60
    });

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography variant='h4' sx={{ fontWeight: 600 }}>Kế hoạch học tập</Typography>
                <Button
                    component={Link}
                    to="/exercise/study-plan"
                    sx={{ height: 24 }}
                    startIcon={<ArrowForwardRounded />}
                >Xem tất cả</Button>
            </Box>

            <Grid
                container
                spacing={3}
                sx={{ pt: 1 }}
            >
                {
                    studyPlans ?
                        studyPlans.map(study => (
                            <Grid
                                key={study.id}
                                item
                                md={4}

                            >
                                <StudyPlanSingle
                                    study={study}
                                />
                            </Grid>
                        ))
                        :
                        [...Array(6)].map((_, index) => (
                            <Grid
                                key={'empty_' + index}
                                item
                                md={4}
                            >
                                <Skeleton variant='rectangular' height={96} />
                            </Grid>
                        ))
                }
            </Grid>
        </Box>
    )
}

export default CourseSection