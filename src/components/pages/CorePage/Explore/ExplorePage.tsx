import { Box, Grid } from '@mui/material';
import { PaginationProps } from 'components/atoms/TablePagination';
import Typography from 'components/atoms/Typography';
import ExploreSigle from 'components/molecules/ExploreSingle';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import exploreService, { ExploreProps } from 'services/exploreService';

const ExplorePage = () => {

    const [explores, setExplores] = React.useState<PaginationProps<ExploreProps> | null>(null);

    const exploreRef = React.useRef<HTMLElement>(null);

    const paginate = usePaginate<ExploreProps>({
        name: 'ex',
        enableLoadFirst: true,
        onChange: async (data) => {
            let dataFormApi = await exploreService.gets(data);
            setExplores(dataFormApi);
        },
        scrollToELementAfterChange: exploreRef,
        pagination: explores,
        rowsPerPageOptions: [6, 12, 18, 24],
        data: {
            current_page: 1,
            per_page: 6
        }
    });

    return (
        <Page
            title={__("Explore")}
        >
            <Typography
                component="h2"
                gutterBottom
                variant="overline"
            >
                {__('Explore')}
            </Typography>
            <Typography
                component="h1"
                gutterBottom
                variant="h3"
            >
                {__("Insights, ideas, and stories")}
            </Typography>
            <Typography variant="subtitle1">
                {
                    [
                        '“Act as if what you do makes a difference. It does.” — William James',
                        '“It is when we are most lost that we sometimes find our truest friends.” — Brothers Grimm',
                        '“Life isn’t finding shelter in the storm. It’s about learning to dance in the rain.” ― Sherrilyn Kenyon',
                        '“When you have a dream, you’ve got to grab it and never let go.” — Carol Burnett',
                        '“Everything that’s broken was beautiful at one time. And our mistakes make us better people.” — Jamie Hoang',
                        '“We all can dance when we find music that we love.” — Giles Andreae',
                        '“I can’t change the direction of the wind, but I can adjust my sails to always reach my destination.” — Jimmy Dean'
                    ][Math.floor(Math.random() * 7)]
                }
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    mt: 6
                }}
                ref={exploreRef}
            >
                <Grid container spacing={4}>
                    {
                        explores ?
                            paginate.isLoading ?
                                [1, 2, 3, 4, 5, 6].map((item) => (
                                    <Grid key={item} item xs={12} md={4}>
                                        <ExploreSigle />
                                    </Grid>
                                ))
                                :
                                explores.data.map((item, index) => (
                                    <Grid key={index} item xs={12} md={4}>
                                        <ExploreSigle explore={item} />
                                    </Grid>
                                ))
                            :
                            [1, 2, 3, 4, 5, 6].map((item) => (
                                <Grid key={item} item xs={12} md={4}>
                                    <ExploreSigle />
                                </Grid>
                            ))
                    }
                </Grid>
                {
                    explores !== null &&
                    paginate.component
                }
            </Box>
        </Page>
    );
};

export default ExplorePage;
