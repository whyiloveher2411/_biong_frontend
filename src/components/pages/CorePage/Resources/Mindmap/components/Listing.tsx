import { Box, Button, Skeleton } from '@mui/material'
import NotFound from 'components/molecules/NotFound'
import Page from 'components/templates/Page'
import useBookmarks from 'hook/useBookmarks'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import mindmapService, { Mindmap, MindmapCategory } from 'services/mindmapService'
import MindMapSingle from '../MindMapSingle'
import Bookmark from '@mui/icons-material/Bookmark'
import Divider from 'components/atoms/Divider'
import { PaginationProps } from 'components/atoms/TablePagination'
import usePaginate from 'hook/usePaginate'

function Listing({ page, tab, subtab1, subtab2 }: { page: string, tab: string, subtab1: string, subtab2: string }) {
    const [selectedCategory, setSelectedCategory] = useState<{
        title: string,
        slug: string,
        status: string,
    } | null>(null);

    const [mindmapCategories, setMindmapCategories] = useState<MindmapCategory[] | null>(null);

    const topListing = React.useRef<HTMLDivElement>(null);

    const [mindmaps, setMindmaps] = useState<PaginationProps<Mindmap> | null>(null);

    const firstLoad = React.useRef(true);

    const bookmark = useBookmarks('mindmap');

    const navigate = useNavigate();

    React.useEffect(() => {
        (async () => {
            const mindmapCategories = await mindmapService.getMindmapCategories();
            setMindmapCategories(mindmapCategories);
        })();
    }, []);

    React.useEffect(() => {
        if (mindmapCategories) {
            if (mindmapCategories.find(category => category.slug === subtab1)) {
                setSelectedCategory(mindmapCategories.find(category => category.slug === subtab1) || mindmapCategories[0]);
            } else {
                if (subtab1) {
                    navigate(`/resources/mindmap`);
                }
            }
        }
        firstLoad.current = false;
    }, [subtab1, mindmapCategories]);

    const paginate = usePaginate<Mindmap>({
        name: 'mindmap',
        template: 'page',
        // enableLoadFirst: true,
        scrollToELementAfterChange: topListing,
        onChange: async (data) => {
            let dataFormApi = await mindmapService.getMindmaps(subtab1, data);
            setMindmaps(dataFormApi);
        },
        pagination: mindmaps,
        rowsPerPageOptions: [12, 18, 24],
        data: {
            current_page: 1,
            per_page: 12
        }
    });

    React.useEffect(() => {
        (async () => {
            setMindmaps(null);
            const mindmaps = await mindmapService.getMindmaps(subtab1, paginate.data);
            setMindmaps(mindmaps);
        })();
    }, [subtab1]);
    // const bookmark = useBookmarks('mindmap')
    return (
        <Page
            title="Mindmap Công nghệ"
            description="Khám phá các mindmap về công nghệ và lập trình"
            image="https://example.com/mindmap-banner.jpg"
            width="xl"
        >
            <Box ref={topListing} sx={{ margin: '0 auto', py: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 4,
                    }}
                >
                    <Box
                        sx={{
                            position: 'sticky',
                            flexShrink: 0,
                            top: 64,
                        }}
                    >
                        <Box
                            className="custom_scroll custom"
                            sx={{
                                maxHeight: 'calc(100vh - 64px)',
                                display: 'flex',
                                flexDirection: 'column',
                                width: 180,
                                position: 'sticky',
                                top: 64,
                            }}
                        >

                            {
                                mindmapCategories ?
                                    <>
                                        {mindmapCategories.map((category) => (
                                            <Button
                                                className={selectedCategory?.title === category.title ? 'active' : ''}
                                                onClick={() => setSelectedCategory(category)}
                                                component={Link}
                                                to={`/resources/mindmap/${category.slug}`}

                                                sx={{
                                                    textTransform: 'unset',
                                                    display: 'flex',
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'center',
                                                    borderRadius: 2,
                                                    height: 40,
                                                    color: 'text.primary',
                                                    px: 1.5,
                                                    fontSize: 14,
                                                    ':hover': {
                                                        backgroundColor: 'dividerDark',
                                                    },
                                                    ...(selectedCategory?.title === category.title ? {
                                                        backgroundColor: 'divider',
                                                    } : {})
                                                }}
                                                key={category.title}>
                                                <Box
                                                    sx={(theme) => ({
                                                        width: 24,
                                                        height: 24,
                                                        mr: 1,
                                                        'svg': {
                                                            fill: theme.palette.text.primary,
                                                        },
                                                        'path': {
                                                            stroke: theme.palette.text.primary,
                                                        }
                                                    })}
                                                    dangerouslySetInnerHTML={{
                                                        __html: category.icon
                                                    }}
                                                />
                                                {category.title}
                                            </Button>
                                        ))
                                        }
                                        <Button
                                            component={Link}
                                            to={`/resources/mindmap`}
                                            onClick={() => setSelectedCategory(null)}
                                            sx={{
                                                textTransform: 'unset',
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                                borderRadius: 2,
                                                height: 40,
                                                color: 'text.primary',
                                                px: 1.5,
                                                fontSize: 14,
                                                ':hover': {
                                                    backgroundColor: 'dividerDark',
                                                },
                                                ...(!subtab1 ? {
                                                    backgroundColor: 'divider',
                                                } : {})
                                            }}
                                        >
                                            <Box
                                                sx={(theme) => ({
                                                    width: 24,
                                                    height: 24,
                                                    mr: 1,
                                                    'svg': {
                                                        fill: theme.palette.text.primary,
                                                    },
                                                    'path': {
                                                        stroke: theme.palette.text.primary,
                                                    }
                                                })}
                                            >
                                            </Box>
                                            Tất cả
                                        </Button>
                                    </>
                                    :
                                    [...Array(12)].map((_, index) => (

                                        <Skeleton key={index} variant="rectangular" height={24} sx={{ mb: 2 }} width={'100%'} />
                                    ))
                            }
                            <Divider color='dividerDark' sx={{ my: 2 }} />
                            <Box>
                                <Button
                                    sx={{
                                        textTransform: 'unset',
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        borderRadius: 2,
                                        height: 40,
                                        color: 'text.primary',
                                        px: 1.5,
                                        fontSize: 14,
                                        width: '100%',
                                        ':hover': {
                                            backgroundColor: 'dividerDark',
                                        },
                                        ...(bookmark.isFilterByBookmark ? {
                                            backgroundColor: 'divider',
                                        } : {})
                                    }}
                                    onClick={() => bookmark.setFilterByBookmark()}
                                >
                                    <Box
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            mr: 1,
                                        }}
                                    >
                                        <Bookmark color='warning' />
                                    </Box>
                                    Đã lưu
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            width: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 3,
                                width: '100%',
                                flexWrap: 'wrap',
                                ['--item-per-row']: '1',
                                ['--item-margin']: '16px',
                                ['--row-usable-w']: '100%',
                                ['@media(min-width: 668px)']: {
                                    ['--item-per-row']: '2',
                                    ['--item-margin']: '16px',
                                    ['--row-usable-w']: '100%',
                                },
                                ['@media(min-width: 1082px)']: {
                                    ['--item-per-row']: '3',
                                    ['--item-margin']: '16px',
                                    ['--row-usable-w']: 'calc(100% - var(--item-margin) *1 )',
                                },
                                ['@media(min-width: 1576px)']: {
                                    ['--item-per-row']: '4',
                                    ['--item-margin']: '16px',
                                    ['--row-usable-w']: 'calc(100% - var(--item-margin) *1 )',
                                },
                                ['@media(min-width: 1902px)']: {
                                    ['--item-per-row']: '5',
                                    ['--item-margin']: '16px',
                                    ['--row-usable-w']: 'calc(100% - var(--item-margin) *2 )',
                                },
                                ['@media(min-width: 2228px)']: {
                                    ['--item-per-row']: '6',
                                    ['--item-margin']: '16px',
                                    ['--row-usable-w']: 'calc(100% - var(--item-margin) *2 )',
                                },
                            }}
                        >
                            {
                                (() => {

                                    const loading = (count: number) => [...Array(count)].map((_, index) => (
                                        <Skeleton key={index} variant="rectangular"
                                            sx={{ width: 'calc(var(--row-usable-w) / var(--item-per-row) - var(--item-margin) - .01px)' }}
                                            height={200} />
                                    ));

                                    if (paginate.isLoading || mindmaps === null) {
                                        return loading(mindmaps?.data.length || 24);
                                    }

                                    let mindmaps2 = bookmark.filterByBookmark(mindmaps?.data || []);

                                    return mindmaps2 !== null ?
                                        mindmaps2.length > 0 ?
                                            mindmaps2.map((mindmap) => (
                                                <MindMapSingle
                                                    key={mindmap.id}
                                                    mindmap={mindmap}
                                                    link={`/resources/mindmap/${mindmap.category?.slug}/${mindmap.slug}`}
                                                    bookmark={bookmark}
                                                />
                                            ))
                                            :
                                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <NotFound

                                                    title="Chưa có video nào cho danh mục này!"
                                                    subTitle="Hãy thử chọn danh mục khác để xem video hữu ích khác!"
                                                />
                                            </Box>
                                        :
                                        loading(24)
                                })()
                            }
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            {paginate.component}
                        </Box>
                    </Box>
                </Box>
            </Box >
        </Page >
    )
}

export default Listing
