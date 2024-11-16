import { Box, Button, Grid } from '@mui/material';
// import { useTransferLinkDisableScroll } from 'components/atoms/ScrollToTop';
import { PaginationProps } from 'components/atoms/TablePagination';
import ExploreSigle from 'components/molecules/ExploreSingle';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import exploreService, { ExploreProps } from 'services/exploreService';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from 'react-router-dom';
import { useIndexedDB } from 'hook/useApi';
import NotFound from 'components/molecules/NotFound';
import { scrollToTopPage } from 'components/atoms/ScrollToTop';
const ExplorePage = ({ cate }: { cate?: string }) => {

    const catState = React.useState<string | undefined | null>(null);

    const [explores, setExplores] = React.useState<PaginationProps<ExploreProps> | null>(null);

    const { data: categories, setData: setCategories } = useIndexedDB<Array<{
        id: ID;
        title: string;
        slug: string;
    }> | null>({ key: 'explores/categories', defaultValue: null });

    // const disableScroll = useTransferLinkDisableScroll();

    const cateDetailState = React.useState<{ id: ID, title: string } | null>(null);
    const top = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // paginate.set(prev => ({ ...prev, current_page: 0, loadData: true }));
        catState[1](cate);
    }, [cate]);

    React.useEffect(() => {
        if (catState[0] !== null) {
            paginate.set(prev => ({ ...prev, current_page: 0, loadData: true }));
        }
    }, [catState[0]]);


    const paginate = usePaginate<ExploreProps>({
        name: 'ex',
        template: 'page',
        // enableLoadFirst: true,
        // scrollToELementAfterChange: top,
        onChange: async (data) => {
            let dataFormApi = await exploreService.gets(data, cate);
            setExplores(dataFormApi.posts);
            // categoriesState[1](Object.keys(dataFormApi.categories).map(key => dataFormApi.categories[key]));

            if (dataFormApi.cate) {
                cateDetailState[1](dataFormApi.cate);
            } else {
                cateDetailState[1](null);
            }

            setTimeout(() => {
                scrollToTopPage();
            }, 1);
        },
        pagination: explores,
        rowsPerPageOptions: [12, 18, 24],
        data: {
            current_page: 1,
            per_page: 12
        }
    });

    React.useEffect(() => {
        exploreService.getCategories().then(data => {
            setCategories(Object.keys(data).map(key => data[key]));
        });
    }, []);

    return (
        <Page
            title={cateDetailState[0] ? cateDetailState[0].title : __("Khám phá")}
            description={'Sẵn sàng học hỏi và thử thách bản thân để vượt qua giới hạn.'}
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
            maxWidth='xl'
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 3,
                    maxWidth: '1360px',
                    mx: 'auto',
                    pt: 15,
                }}
            >
                <Grid container spacing={4} ref={top}>
                    <Grid item xs={12} md={3}>
                        <Box
                            sx={{
                                borderRight: '1px solid',
                                borderColor: 'dividerDark',
                                position: 'sticky',
                                top: 64,
                            }}
                        >
                            <Box
                                className="custom_scroll custom"
                                sx={{
                                    maxHeight: 'calc(100vh - 64px)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {
                                    // [
                                    //     { title: 'AI', slug: 'ai', icon: 'https://www.svgrepo.com/show/486520/ai.svg' },
                                    //     { title: 'Lập trình', slug: 'lap-trinh', icon: 'https://www.svgrepo.com/show/529788/programming.svg' },
                                    //     { title: 'Bảo mật', slug: 'bao-mat', icon: 'https://www.svgrepo.com/show/521226/security-2.svg' },
                                    //     { title: 'Thiết kế', slug: 'thiet-ke', icon: 'https://www.svgrepo.com/show/421877/design-education-painting.svg' },
                                    //     { title: 'Marketing', slug: 'marketing', icon: 'https://www.svgrepo.com/show/500399/marketing.svg' },
                                    //     { title: 'Kiếm tiền Online', slug: 'kiem-tien-online', icon:  'https://www.svgrepo.com/show/532440/money-check-dollar.svg'},
                                    //     { title: 'Kỹ năng mền', slug: 'ky-nang-men', icon: 'https://www.svgrepo.com/show/374449/skill-entity.svg' },
                                    //     { title: 'Khởi nghiệp', slug: 'khoi-nghiep', icon: 'https://www.svgrepo.com/show/293952/startup-rocket.svg' },
                                    //     { title: 'Khác', slug: 'khac', icon: 'https://www.svgrepo.com/show/511077/more-grid-big.svg'},
                                    //     { title: 'Tất cả', slug: 'tat-ca', icon: 'https://www.svgrepo.com/show/440596/other.svg' },
                                    // ]
                                    categories?.map((category) => (
                                        <Button
                                            // className={cate === category.slug ? 'active' : ''}
                                            component={Link}
                                            to={`/explore/tag/${category.slug}`}
                                            sx={{
                                                textTransform: 'unset',
                                                fontSize: 16,
                                                height: 48,
                                                pl: 2,
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                                ...(cate === category.slug ? {
                                                    ':before': {
                                                        left: '0',
                                                        width: 4,
                                                        height: '40px',
                                                        content: "''",
                                                        position: 'absolute',
                                                        backgroundColor: 'primary.main',
                                                        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                                    },
                                                    color: 'primary.main',
                                                } : {
                                                    color: 'unset',
                                                })
                                            }}
                                            key={category.slug}>
                                            {category.title}
                                        </Button>
                                    ))}

                                <Button
                                    component={Link}
                                    to={`/explore`}
                                    startIcon={<MoreHorizIcon />}
                                    sx={{
                                        textTransform: 'unset',
                                        fontSize: 16,
                                        height: 48,
                                        pl: 2,
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        mt: 3,
                                        ...(!cate ? {
                                            ':before': {
                                                left: '0',
                                                width: 4,
                                                height: '40px',
                                                content: "''",
                                                position: 'absolute',
                                                backgroundColor: 'primary.main',
                                                transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                            },
                                            color: 'primary.main',
                                        } : {
                                            color: 'unset',
                                        })
                                    }}
                                >
                                    Tất cả
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4
                            }}>
                                {
                                    explores ?
                                        paginate.isLoading ?
                                            [1, 2, 3, 4, 5, 6].map((item) => (
                                                <Box key={item}>
                                                    <ExploreSigle />
                                                </Box>
                                            ))
                                            :
                                            explores.data.length > 0 ?
                                                explores.data.map((item, index) => (
                                                    <Box key={index}>
                                                        <ExploreSigle explore={item} />
                                                    </Box>
                                                ))
                                                :
                                                <NotFound
                                                    title='Không tìm thấy bài viết'
                                                    subTitle='Không tìm thấy bài viết nào hãy thử thay đổi bộ lọc'
                                                />
                                        :
                                        [1, 2, 3, 4, 5, 6].map((item) => (
                                            <Box key={item}>
                                                <ExploreSigle />
                                            </Box>
                                        ))
                                }
                            </Box>
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
                    </Grid>
                </Grid>
            </Box>
        </Page>
    );
};

export default ExplorePage;
