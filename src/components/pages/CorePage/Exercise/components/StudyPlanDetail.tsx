import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { LoadingButton } from '@mui/lab';
import { Box, Breadcrumbs, Grid, Typography } from '@mui/material';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Page from 'components/templates/Page';
import { getImageUrl } from 'helpers/image';
import useAjax from 'hook/useApi';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import codingChallengeService, { StudyPlanProps } from 'services/codingChallengeService';
import { getLinkExcercise } from '..';
import { DifficultyItem } from './ProblemsTable';
import { useChallengeSession } from './Session';

function StudyPlanDetail({ slug }: { slug: string }) {

    const [studyPlan, setStudyPlan] = React.useState<StudyPlanProps | null>(null);

    const { data: session } = useChallengeSession();

    const apiMutation = useAjax();

    const navigate = useNavigate();

    React.useEffect(() => {
        (async () => {
            const studyPlan = await codingChallengeService.getStudyPlanDetail(slug);
            setStudyPlan(studyPlan);
        })();

    }, [slug]);

    const redirectToChallenge = () => {
        if (!studyPlan) return;
        for (let i = 0; i < studyPlan.structure.length; i++) {
            for (let j = 0; j < studyPlan.structure[i].challenges.length; j++) {
                if (!session.challenge_solved[studyPlan.structure[i].challenges[j].id.toString()]) {
                    navigate(getLinkExcercise(studyPlan.structure[i].challenges[j].slug, 'challenge'));
                    return;
                }
            }
        }
    }

    return (<Page
        title={(studyPlan ? studyPlan.title + ' | ' : '') + 'Luyện tập'}
        description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
        image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
    >
        <Grid
            container
            spacing={4}
            sx={{
                mt: 15,
                mb: 3
            }}
        >
            <Grid item md={8}>
                <Box>
                    <Breadcrumbs maxItems={5} aria-label="breadcrumb">
                        <Link color="inherit" to="/">
                            Trang chủ
                        </Link>
                        <Link color="inherit" to="/exercise">
                            Luyện tập
                        </Link>
                        <Link color="inherit" to="/exercise/study-plan">
                            Kế hoạch học tập
                        </Link>
                    </Breadcrumbs>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        pb: 2,
                        pt: 1,
                    }}
                >
                    <Typography variant='h1'> {studyPlan?.title}</Typography>
                    {
                        studyPlan ?
                            studyPlan.joined ?
                                <LoadingButton loading={apiMutation.open} onClick={() => redirectToChallenge()} variant='contained' startIcon={<PlayArrowRoundedIcon />}>Tiếp tục học tập</LoadingButton>
                                :
                                <LoadingButton loading={apiMutation.open} onClick={async () => {
                                    apiMutation.request(async () => {
                                        const result = await codingChallengeService.joinStudyPlan(studyPlan?.id ? studyPlan.id : 0);
                                        if (result) {
                                            redirectToChallenge();
                                        }
                                    });
                                }} variant='contained' startIcon={<PlayArrowRoundedIcon />}>Bắt đầu</LoadingButton>
                            :
                            <LoadingButton variant='contained' loading startIcon={<PlayArrowRoundedIcon />}>Tiếp tục học tập</LoadingButton>
                    }

                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    {
                        studyPlan?.structure.map((chapter, index) => (
                            <Box
                                key={studyPlan.id + '_' + index}
                                sx={{
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'dividerDark',
                                }}
                            >
                                <Typography sx={{ pt: 1, pb: 1, pl: 2, pr: 3, backgroundColor: 'divider', fontSize: 14, fontWeight: 600 }}>{chapter.title}</Typography>
                                <Box>
                                    {
                                        chapter.challenges.map((problem, index) => (
                                            <Box
                                                key={problem.id}
                                                sx={{
                                                    display: 'flex',
                                                    width: '100%',
                                                    gap: 2,
                                                    alignItems: 'center',
                                                    pl: 2,
                                                    pr: 2,
                                                    pt: 1,
                                                    pb: 1,
                                                    ...(index === chapter.challenges.length - 1 ? {} : {
                                                        borderBottom: '1px solid',
                                                        borderColor: 'dividerDark',
                                                    })
                                                }}
                                                component={Link}
                                                to={'/exercise/' + problem.slug}
                                            >
                                                {
                                                    session.challenge_solved[problem.id.toString()] ?
                                                        <CheckCircleRoundedIcon color='success' />
                                                        :
                                                        <RadioButtonUncheckedRoundedIcon />
                                                }
                                                <Typography sx={{ fontSize: 14, flexGrow: 1, fontWeight: 500 }}>{problem.title}</Typography>
                                                <Typography sx={{ fontSize: 14 }}> Solution</Typography>
                                                <Box>
                                                    <DifficultyItem difficulty={problem.difficulty} />
                                                </Box>
                                            </Box>
                                        ))
                                    }
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
            </Grid>
            <Grid item sm={4}>
                <Box>
                    <Typography variant='h3' sx={{ fontWeight: 600 }}>Tóm tắt</Typography>
                    <Box
                        dangerouslySetInnerHTML={{ __html: studyPlan?.summary || '' }}
                    />
                </Box>
                <Box
                    sx={{
                        pt: 3
                    }}
                >
                    <Typography variant='h3' sx={{ fontWeight: 600 }}>Liên quan</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flexDirection: 'column',
                            pt: 2,
                        }}
                    >
                        {
                            studyPlan?.study_plans.map(study => <Box
                                key={study.id}
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                }}
                                component={Link}
                                to={getLinkExcercise(study.slug, 'studyPlan')}
                            >
                                <ImageLazyLoading
                                    src={getImageUrl(study.thumbnail)}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 1,
                                    }}
                                />
                                <Box>
                                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{study.title}</Typography>
                                    <Typography variant='body2'>{study.description}</Typography>
                                </Box>
                            </Box>
                            )
                        }
                    </Box>
                </Box>
            </Grid>
        </Grid>
    </Page>
    )
}

export default StudyPlanDetail