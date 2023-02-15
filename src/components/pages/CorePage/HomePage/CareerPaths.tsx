import { Box } from '@mui/material';
import Grid from 'components/atoms/Grid';
// import { PaginationProps } from 'components/atoms/TablePagination';
import Typography from 'components/atoms/Typography';
import CareerPathsSingle from 'components/molecules/CareerPathsSingle';
import { __ } from 'helpers/i18n';
import { useIndexedDB } from 'hook/useApi';
// import usePaginate from 'hook/usePaginate';
import React from 'react';
import careerPathsService, { ICareerPaths } from 'services/careerPathsService';
import { UserState, useUser } from 'store/user/user.reducers';

function CareerPaths() {

    const { data: careerPaths, setData: setCareerPaths } = useIndexedDB<ICareerPaths[] | null>({ key: 'Homepage/careerPaths', defaultValue: null });

    const user = useUser();

    React.useEffect(() => {
        if (user._state !== UserState.unknown) {
            (async () => {
                setCareerPaths(await careerPathsService.getHomepage());
            })();
        }
    }, [user]);

    return (
        <Box
            component='section'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                mt: 15,
                mb: 3,
                position: 'relative',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: -36,
                    left: -48,
                    right: -48,
                    bottom: -36,
                    backgroundColor: '#c9b40f',
                    opacity: 0.2,
                    borderRadius: 3,
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                }
            }}
        >
            <Typography sx={{ fontWeight: 400 }} variant='h3' component='h2'>
                {__('Lộ trình phát triển')}
            </Typography>
            <Grid
                container
                spacing={6}
                sx={{
                    justifyContent: 'center',
                    zIndex: 1,
                }}
            >
                {
                    careerPaths ?
                        careerPaths.map((item, index) => (
                            <Grid
                                key={index}
                                item
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <CareerPathsSingle careerPaths={item} />
                            </Grid>
                        ))
                        :
                        [1, 2, 3].map((item) => (
                            <Grid
                                key={item}
                                item
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <CareerPathsSingle />
                            </Grid>
                        ))
                }
            </Grid>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: -36,
                    left: -48,
                    right: -48,
                    opacity: 0.2,
                }}
            >
                <svg style={{
                    fill: '#c9b40f',
                    overflowX: 'hidden',
                    position: 'absolute',
                    width: '100%',
                    pointerEvents: 'none',
                }}>
                    <path d="M 0 31 C 313 -17 359 19 530 29 S 905 -20 1303 21 S 1677 -28 2537 29 L 2537 0 L 0 0 L 0 31"></path>
                </svg>
            </Box>
        </Box>
    )
}

export default CareerPaths