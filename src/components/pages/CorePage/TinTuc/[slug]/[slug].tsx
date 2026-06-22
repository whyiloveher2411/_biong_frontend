import { Box, Breadcrumbs, Button, Chip, Skeleton } from '@mui/material';
import Divider from 'components/atoms/Divider';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Typography from 'components/atoms/Typography';
import MarketingArticleBlocks from 'components/molecules/MarketingArticleBlocks';
import Page from 'components/templates/Page';
import { SPACEDEV_DEFAULT_OG_IMAGE_URL, SPACEDEV_IOS_APP_STORE_URL, SPACEDEV_LOGO_FALLBACK } from 'constants/spacedevApp';
import { dateTimefromNow } from 'helpers/date';
import { __ } from 'helpers/i18n';
import moment from 'moment';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import marketingNewsService, {
    buildArticleAudioStreamUrl,
    MarketingArticleDetail,
} from 'services/marketingNewsService';
import { UserState, useUser } from 'store/user/user.reducers';

type TinTucDetailProps = {
    /** Post id từ URL segment cuối */
    slug: string;
    /** Năm archive từ URL segment giữa */
    category: string;
};

function formatPublishLabel(unixSec?: number): string {
    if (!unixSec || unixSec <= 0) {
        return '';
    }

    return dateTimefromNow(moment.unix(unixSec).toDate());
}

const TinTucDetail = ({ slug, category }: TinTucDetailProps) => {
    const navigate = useNavigate();
    const user = useUser();
    const [article, setArticle] = React.useState<MarketingArticleDetail | null>(null);
    const [loading, setLoading] = React.useState(true);

    const year = Number.parseInt(category, 10);
    const postId = slug?.trim() ?? '';

    React.useEffect(() => {
        if (user._state === UserState.unknown) {
            return undefined;
        }

        if (!postId || !Number.isFinite(year) || year < 2000) {
            navigate('/');
            return undefined;
        }

        let cancelled = false;

        (async () => {
            setLoading(true);
            setArticle(null);
            const detail = await marketingNewsService.getArticleDetail({ id: postId, year });
            if (cancelled) {
                return;
            }
            if (!detail) {
                navigate('/');
                return;
            }
            setArticle(detail);
            setLoading(false);
        })();

        return () => {
            cancelled = true;
        };
    }, [user._state, postId, year, navigate]);

    const audioUrl = article ? buildArticleAudioStreamUrl(article) : null;
    const thumbnail = article?.thumbnailUrl?.trim() ? article.thumbnailUrl : SPACEDEV_LOGO_FALLBACK;
    const publishedLabel = formatPublishLabel(article?.datePublish);
    const pageTitle = article?.title?.trim() || __('Tin tức');
    const pageDescription = article?.description?.trim() || pageTitle;
    const pageImage = article?.thumbnailUrl?.trim() || SPACEDEV_DEFAULT_OG_IMAGE_URL;

    return (
        <Page
            title={pageTitle}
            description={pageDescription}
            image={pageImage}
            type="article"
            maxWidth="800px"
            sxRoot={{ pt: { xs: 3, md: 5 } }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mt: { xs: 1, md: 2 } }}>
                    <Link to="/">{__('Trang chủ')}</Link>
                    <Typography color="text.primary">{__('Tin tức')}</Typography>
                </Breadcrumbs>

                {loading || !article ? (
                    <>
                        <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '16 / 9', borderRadius: 2 }} />
                        <Skeleton variant="text" height={40} />
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="rectangular" height={120} />
                    </>
                ) : (
                    <>
                        <Box
                            sx={{
                                width: '100%',
                                aspectRatio: '16 / 9',
                                borderRadius: 2,
                                overflow: 'hidden',
                                bgcolor: 'action.hover',
                            }}
                        >
                            <ImageLazyLoading
                                src={thumbnail}
                                alt={article.title}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                            {article.categoryName?.trim() ? (
                                <Chip
                                    label={article.categoryName}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                />
                            ) : null}
                            {publishedLabel ? (
                                <Typography variant="caption" color="text.secondary">
                                    {publishedLabel}
                                </Typography>
                            ) : null}
                            {article.isPro ? (
                                <Chip label={__('Premium')} size="small" color="secondary" />
                            ) : null}
                        </Box>

                        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                            {article.title}
                        </Typography>

                        {audioUrl ? (
                            <Box
                                component="section"
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: 'action.hover',
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    {__('Nghe bài viết')}
                                </Typography>
                                <Box
                                    component="audio"
                                    controls
                                    preload="metadata"
                                    src={audioUrl}
                                    sx={{ width: '100%' }}
                                />
                            </Box>
                        ) : null}

                        <Divider />

                        <MarketingArticleBlocks blocks={article.blocks} />

                        <Box
                            sx={{
                                position: 'sticky',
                                bottom: 0,
                                zIndex: 20,
                                mt: 3,
                                mb: { xs: 2, md: 3 },
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'stretch', sm: 'center' },
                                justifyContent: 'space-between',
                                gap: 2,
                                p: 2.5,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper',
                                boxShadow: (theme) => theme.shadows[8],
                            }}
                        >
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {__('Tải app Spacedev')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {__('Nghe audio, đọc tin mới và học mỗi ngày trên ứng dụng.')}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                component="a"
                                href={SPACEDEV_IOS_APP_STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ flexShrink: 0, textTransform: 'none' }}
                            >
                                {__('Tải trên App Store')}
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Page>
    );
};

export default TinTucDetail;
