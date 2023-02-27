import { Box, Chip, Grid, Typography } from '@mui/material';
import { PaginationProps } from 'components/atoms/TablePagination';
import Banner from 'components/molecules/Banner';
import ExploreSigle from 'components/molecules/ExploreSingle';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import exploreService, { ExploreProps } from 'services/exploreService';

const ExplorePage = ({ cate }: { cate?: string }) => {

    const [explores, setExplores] = React.useState<PaginationProps<ExploreProps> | null>(null);

    const navigate = useNavigate();

    const categoriesState = React.useState<Array<{
        id: ID;
        title: string;
        slug: string;
    }>>([]);

    const cateDetailState = React.useState<{ id: ID, title: string } | null>(null);

    React.useEffect(() => {
        paginate.set(prev => ({ ...prev, current_page: 0, loadData: true }));
    }, [cate]);

    const paginate = usePaginate<ExploreProps>({
        name: 'ex',
        template: 'page',
        onChange: async (data) => {
            let dataFormApi = await exploreService.gets(data, cate);
            setExplores(dataFormApi.posts);
            categoriesState[1](dataFormApi.categories);

            if (dataFormApi.cate) {
                cateDetailState[1](dataFormApi.cate);
            } else {
                cateDetailState[1](null);
            }
        },
        pagination: explores,
        rowsPerPageOptions: [12, 18, 24],
        data: {
            current_page: 1,
            per_page: 12
        }
    });

    return (
        <Page
            title={cateDetailState[0] ? cateDetailState[0].title : __("Khám phá")}
            description={'Sẵn sàng học hỏi và thử thách bản thân để vượt qua giới hạn.'}
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
        >
            <Banner
                image='/images/explore.webp'
                color='rgb(255, 202, 185)'
                title={'Sẵn sàng học hỏi và thử thách bản thân để vượt qua giới hạn.'}
                description={
                    <>
                        <Typography sx={{ mt: 2, lineHeight: '28px', fontSize: 18 }} variant='subtitle1'>Hãy cùng nhau khám phá thế giới lập trình bao la và đầy thú vị! từ frontend, backend đến devops và mobile, mọi thứ đều đang chờ đợi chúng ta. Hãy bắt đầu hành trình khám phá ngay hôm nay!</Typography>
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            mt: 2,
                            '& .MuiChip-root:hover': {
                                backgroundColor: 'primary.dark',
                                color: 'primary.contrastText',
                            },
                            '& .active': {
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                            }
                        }}>
                            {
                                categoriesState[0].map(cat => (
                                    <Chip
                                        onClick={() => {
                                            if (cateDetailState[0] && cateDetailState[0].id.toString() === cat.id.toString()) {
                                                navigate('/explore');
                                            } else {
                                                navigate('/explore/tag/' + cat.slug);
                                            }
                                        }}
                                        className={(cateDetailState[0] && cateDetailState[0].id.toString() === cat.id.toString()) ? 'active' : ''}
                                        key={cat.id} label={cat.title} />
                                ))
                            }
                        </Box>
                    </>
                }
                subTitle='học viện Spacedev.vn'
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    mt: 12
                }}
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
