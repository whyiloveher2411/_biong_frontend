import { Box, Grid } from '@mui/material';
import { PaginationProps } from 'components/atoms/TablePagination';
import Banner from 'components/molecules/Banner';
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
        template: 'page',
        enableLoadFirst: true,
        onChange: async (data) => {
            let dataFormApi = await exploreService.gets(data);
            setExplores(dataFormApi);
        },
        scrollToELementAfterChange: exploreRef,
        pagination: explores,
        rowsPerPageOptions: [12, 18, 24],
        data: {
            current_page: 1,
            per_page: 12
        }
    });

    return (
        <Page
            title={__("Khám phá")}
        >
            <Banner
                image='/images/bn-top.jpg'
                color='rgb(255, 202, 185)'
                title='Câu chuyện thành công của bạn'
                description='Từ nhà phát triển trò chơi ở Uruguay cho đến sinh viên ở Malaysia, mọi người trên toàn cầu đang sử dụng Học viện Google Play để giúp họ đạt được mục tiêu của mình.'
                subTitle='học viện Spacedev.vn'
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    mt: 12
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
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    {
                        explores !== null &&
                        paginate.component
                    }
                </Box>
            </Box>
        </Page>
    );
};

export default ExplorePage;
