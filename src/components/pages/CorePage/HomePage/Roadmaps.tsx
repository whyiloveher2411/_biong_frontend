import Box from 'components/atoms/Box'
import Button from 'components/atoms/Button'
import Grid from 'components/atoms/Grid'
import Typography from 'components/atoms/Typography'
import { __ } from 'helpers/i18n'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import elearningService, { Roadmap } from 'services/elearningService'
import { RootState } from 'store/configureStore'
import { UserState } from 'store/user/user.reducers'
import RoadmapSingle from '../Roadmap/components/RoadmapSingle'

function Roadmaps() {

    const [roadmaps, setRoadmaps] = React.useState<Array<Roadmap> | null | undefined>(null);

    const user = useSelector((state: RootState) => state.user);

    React.useEffect(() => {
        if (user._state !== UserState.unknown) {
            (async () => {
                const roadmapApi = await elearningService.roadmap.getHomePage();
                setRoadmaps(roadmapApi?.roadmaps);
            })()
        }
    }, [user]);

    return (
        <Box
            component='section'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                }}
            >
                <Typography sx={{ fontWeight: 400 }} variant='h3' component='h2'>{__('Khám phá roamap cho riêng mình')}</Typography>
                <Button
                    variant='text'
                    component={Link}
                    to={'/roadmap'}
                >
                    {__('Tất cả roadmap')}
                </Button>
            </Box>
            <Grid
                container
                spacing={2}
            >
                {
                    roadmaps?.map(item => (
                        <Grid
                            key={item.id + '_' + item.is_save}
                            item
                            md={3}
                            sm={6}
                            xs={12}
                        >
                            <RoadmapSingle roadmap={item} />
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    )
}

export default Roadmaps