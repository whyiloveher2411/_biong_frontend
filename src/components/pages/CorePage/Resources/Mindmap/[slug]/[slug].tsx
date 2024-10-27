import { Box, Breadcrumbs, Button, Grid, Skeleton, Typography } from '@mui/material';
import Page from 'components/templates/Page';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import mindmapService, { Mindmap } from 'services/mindmapService';
import MindmapMarkdown from '../MindmapMarkdown';
import VideoWithTranscript from './components/VideoWithTranscript';
import { getImageUrl } from 'helpers/image';
import MindMapSingle from '../MindMapSingle';
import NotFound from 'components/molecules/NotFound';
import useBookmarks from 'hook/useBookmarks';

interface MindmapDetailProps {
    slug: string,
    category?: string
}

function MindmapDetail({ slug, category }: MindmapDetailProps) {

    const [mindmap, setMindmap] = React.useState<Mindmap | null>(null);
    const navigate = useNavigate();
    const bookmark = useBookmarks('mindmap');


    React.useEffect(() => {
        mindmapService.getMindmap(slug).then((mindmap) => {
            if (mindmap) {
                setMindmap(mindmap);
                return;
            }

            navigate(`/resources/mindmap/${category}`);
        });
    }, [slug]);


    return (<Page
        title='Mindmap Detail'
        description='Mindmap Detail'
        image={getImageUrl(mindmap?.thumbnail)}
        maxWidth='xl'
    >
        <Box>

            <VideoWithTranscript bookmark={bookmark} mindmap={mindmap} youtubeId={mindmap?.id_youtube_video || ''} slug={slug} transcript={mindmap?.subtitles_combined || []} />
            <Grid
                container
                sx={{
                    mt: 3,
                }}
            >
                <Grid item xs={12} md={12}>
                    <Box
                        sx={{}}
                    >
                        <Breadcrumbs>
                            <Link
                                to={'/resources/mindmap'}
                            >
                                Mindmap
                            </Link>
                            {
                                mindmap?.category ?
                                    <Link
                                        to={`/resources/mindmap/${mindmap?.category?.slug}`}
                                    >
                                        {mindmap?.category?.title}
                                    </Link>
                                    : null
                            }

                            <Typography>{mindmap?.title}</Typography>
                        </Breadcrumbs>
                        <Typography variant='h1' sx={{ fontSize: '32px', fontWeight: 'bold', color: 'primary.main' }}>{mindmap?.title}</Typography>
                    </Box>
                    <Box>
                        <MindmapMarkdown md={mindmap?.mindmap || ''} />
                    </Box>
                </Grid>
                {/* <Grid item xs={12} md={4}>

                </Grid> */}
            </Grid>

            <Box
                sx={{
                    maxWidth: 1200,
                    mx: 'auto',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 7,
                        mb: 2,
                    }}
                >
                    <Typography variant='h2' sx={{ fontSize: '24px', fontWeight: 'bold', color: 'primary.main' }}>Video liên quan</Typography>
                    <Button component={Link} to={`/resources/mindmap/${mindmap?.category?.slug}`} variant='text' color='primary'>Xem tất cả</Button>
                </Box>
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
                    }}
                >
                    {
                        mindmap?.mindmap_related !== undefined ?
                            mindmap?.mindmap_related.length > 0 ?
                                mindmap?.mindmap_related.map((item) => (
                                    <MindMapSingle
                                        key={item.id}
                                        mindmap={item}
                                        link={`/resources/mindmap/${mindmap.category?.slug}/${item.slug}`}
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
                            [...Array(3)].map((_, index) => (
                                <Skeleton key={index} variant="rectangular"
                                    sx={{ width: 'calc(var(--row-usable-w) / var(--item-per-row) - var(--item-margin) - .01px)' }}
                                    height={200} />
                            ))
                    }
                </Box>
            </Box>
        </Box>
    </Page>)
}

export default MindmapDetail
