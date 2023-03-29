import { Box, Button } from '@mui/material';
import Grid from 'components/atoms/Grid';
import Icon from 'components/atoms/Icon';
// import { PaginationProps } from 'components/atoms/TablePagination';
import Typography from 'components/atoms/Typography';
import ExploreSingle from 'components/molecules/ExploreSingle';
import { __ } from 'helpers/i18n';
import { useIndexedDB } from 'hook/useApi';
// import usePaginate from 'hook/usePaginate';
import React from 'react';
import { Link } from 'react-router-dom';
import exploreService, { ExploreProps } from 'services/exploreService';
import { UserState, useUser } from 'store/user/user.reducers';

function Blogs() {

    const { data: courses, setData: setCourses } = useIndexedDB<ExploreProps[] | null>({ key: 'Homepage/explores', defaultValue: null });

    const user = useUser();

    React.useEffect(() => {
        if (user._state !== UserState.unknown) {
            (async () => {
                setCourses(await exploreService.getHomepage());
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
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                }}
            >
                <Typography sx={{ fontWeight: 400 }} variant='h3' component='h2'>
                    {__('Bài viết mới nhất')}
                </Typography>

                <Button
                    variant='text'
                    component={Link}
                    to={'/explore'}
                    startIcon={<Icon icon="ArrowForwardRounded" />}
                >
                    {__('Tất cả bài viết')}
                </Button>

            </Box>
            <Grid
                container
                spacing={6}
                sx={{
                    justifyContent: 'center',
                }}
            >
                {
                    courses !== null ?
                        courses.map((item, index) => (
                            <Grid
                                key={index}
                                item
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <ExploreSingle explore={item} />
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
                                <ExploreSingle />
                            </Grid>
                        ))
                }
            </Grid>
        </Box>
    )
}

export default Blogs