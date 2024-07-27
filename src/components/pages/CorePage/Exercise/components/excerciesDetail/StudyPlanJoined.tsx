import { Box, Card, CardContent, CardHeader, CircularProgressProps, Skeleton, Theme, Tooltip, Typography } from '@mui/material'
import MuiCircularProgressProps from '@mui/material/CircularProgress'
import { useQuery } from '@tanstack/react-query'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import LinearProgressWithLabel from 'components/molecules/LinearProgressWithLabel'
import { getImageUrl } from 'helpers/image'
import React from 'react'
import { Link } from 'react-router-dom'
import codingChallengeService from 'services/codingChallengeService'
import { getLinkExcercise } from '../..'
import { useChallengeSession } from '../Session'
import { UserState, useUser } from 'store/user/user.reducers'

function StudyPlanJoined() {

    const { isLoading, data: studyPlans, refetch } = useChallengeStudyPlan();
    const { data: session } = useChallengeSession();
    const secondLoad = React.useRef(false);
    const user = useUser();

    React.useEffect(() => {
        (async () => {
            if (user._state !== UserState.unknown && secondLoad.current) {
                refetch();
            }
            secondLoad.current = true;
        })();
    }, [session, user]);

    return (
        <Card
            sx={{
                mb: 3,
            }}

        >
            {
                studyPlans && !isLoading && studyPlans?.length === 0 ?
                    <CardContent>
                        <Typography sx={{ fontWeight: 'bold' }} align="center">Bạn chưa tham gia kế hoạch học tập nào.</Typography>
                    </CardContent>
                    :
                    <>
                        <CardHeader
                            titleTypographyProps={{
                                variant: 'h5',
                            }}
                            title={isLoading || studyPlans === null ? <Skeleton /> : 'Tiếp tục học tập'}
                        />
                        <CardContent
                            sx={{
                                pt: 0,
                                pb: '0 !important'
                            }}
                        >
                            {
                                isLoading || studyPlans === null ?
                                    <>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 2,
                                            }}
                                        >
                                            <Skeleton
                                                variant='circular'
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    flexGrow: 1,
                                                }}
                                            >
                                                <Skeleton />
                                                <Skeleton />
                                            </Box>
                                        </Box>
                                        <Box
                                            sx={{
                                                pt: 1
                                            }}
                                        >
                                            {
                                                [1, 2].map((item) => (
                                                    <Box
                                                        key={item}
                                                        sx={{
                                                            display: 'flex',
                                                            gap: 1.5,
                                                            alignItems: 'center',
                                                            borderTop: '1px solid',
                                                            borderColor: 'dividerDark',
                                                            pt: 1,
                                                            pb: 1,
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <Tooltip
                                                            title="...."
                                                        >
                                                            <Box>
                                                                <Skeleton variant='circular' sx={{ width: 22, height: 22 }} />
                                                            </Box>
                                                        </Tooltip>
                                                        <Box sx={{ width: '100%' }}>
                                                            <Skeleton />
                                                        </Box>
                                                    </Box>
                                                ))
                                            }
                                        </Box>
                                    </>
                                    :
                                    <>
                                        {
                                            studyPlans && studyPlans[0] ?
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                    }}

                                                >
                                                    <Box
                                                        component={Link}
                                                        to={getLinkExcercise(studyPlans[0].slug, 'studyPlan')}
                                                    >
                                                        <ImageLazyLoading
                                                            src={getImageUrl(studyPlans[0].thumbnail)}
                                                            sx={{
                                                                width: 56,
                                                                height: 56,
                                                                borderRadius: 1,
                                                            }}

                                                        />
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            flexGrow: 1,
                                                        }}
                                                    >
                                                        <Typography
                                                            component={Link}
                                                            to={getLinkExcercise(studyPlans[0].slug, 'studyPlan')}
                                                            sx={{ fontWeight: 'bold', fontSize: 12 }}>{studyPlans[0].title}</Typography>
                                                        <LinearProgressWithLabel position='right' value={studyPlans[0].percent} />
                                                        {
                                                            studyPlans[0].last_lesson ?
                                                                <Typography variant='body2'
                                                                    component={Link}
                                                                    to={getLinkExcercise(studyPlans[0].last_lesson.slug)}
                                                                >{studyPlans[0].last_lesson.title}</Typography>
                                                                : null
                                                        }
                                                    </Box>
                                                </Box>
                                                :

                                                null
                                        }
                                        <Box
                                            sx={{
                                                pt: 1
                                            }}
                                        >
                                            {
                                                studyPlans ? studyPlans.filter((_, index) => index !== 0).map((item) => (
                                                    <Box
                                                        key={item.id}
                                                        sx={{
                                                            display: 'flex',
                                                            gap: 1.5,
                                                            alignItems: 'center',
                                                            borderTop: '1px solid',
                                                            borderColor: 'dividerDark',
                                                            pt: 1,
                                                            pb: 1,
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <Tooltip
                                                            title="64% - 1. Hai số bẳng tổng"
                                                        >
                                                            <Box>
                                                                <CircularProgress value={item.percent} size={22} variant="determinate" color={'primary'} />
                                                            </Box>
                                                        </Tooltip>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 'bold', fontSize: 12, flexGrow: 1 }}>{item.title}</Typography>
                                                        </Box>
                                                    </Box>
                                                )) : null
                                            }
                                        </Box>
                                    </>
                            }
                        </CardContent>
                    </>
            }
        </Card>
    )
}

export default StudyPlanJoined

function CircularProgress(
    props: CircularProgressProps,
) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <MuiCircularProgressProps
                {...props}
                variant="determinate"
                sx={{
                    color: (theme: Theme) => theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
                    position: 'absolute',
                    left: 0,
                }}
                thickness={4}
                value={100}
            />
            <MuiCircularProgressProps variant="determinate" {...props} />
        </Box>
    );
}


export const useChallengeStudyPlan = () => useQuery({
    queryKey: ['useChallengeStudyPlan'], queryFn: () => codingChallengeService.getMyStudyPlan(),
    initialData: null,
    staleTime: (st) => { return Infinity },
})