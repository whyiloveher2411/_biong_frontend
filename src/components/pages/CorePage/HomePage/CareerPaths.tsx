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
                mt: 12,
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
        </Box>
    )
}

export default CareerPaths