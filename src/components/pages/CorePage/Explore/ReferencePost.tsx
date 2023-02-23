import { Box, Button } from '@mui/material';
import Grid from 'components/atoms/Grid';
import Icon from 'components/atoms/Icon';
// import { PaginationProps } from 'components/atoms/TablePagination';
import Typography from 'components/atoms/Typography';
import ExploreSingle from 'components/molecules/ExploreSingle';
import { __ } from 'helpers/i18n';
// import usePaginate from 'hook/usePaginate';
import { Link } from 'react-router-dom';
import { ExploreProps } from 'services/exploreService';

function ReferencePost({ posts }: { posts: Array<ExploreProps> }) {

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
                    gap: 1,
                }}
            >
                <Typography sx={{ fontWeight: 400 }} variant='h3' component='h2'>
                    {__('Bài viết dành cho bạn')}
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
                    posts !== null ?
                        posts.map((item, index) => (
                            <Grid
                                key={item.id}
                                item
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <ExploreSingle explore={item} />
                            </Grid>
                        ))
                        :
                        [1, 2, 3, 4, 5, 6].map((item) => (
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

export default ReferencePost