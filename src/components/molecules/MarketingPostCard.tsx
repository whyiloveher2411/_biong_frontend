import { Box, Card, CardActionArea, CardContent, Chip, Skeleton, Typography } from '@mui/material';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { SPACEDEV_LOGO_FALLBACK } from 'constants/spacedevApp';
import { cssMaxLine } from 'helpers/dom';
import { dateTimefromNow } from 'helpers/date';
import moment from 'moment';
import React from 'react';
import { MarketingHomePost } from 'services/marketingNewsService';

function formatMarketingDatePublish(unixSec?: number): string {
    if (!unixSec || unixSec <= 0) {
        return '';
    }

    return dateTimefromNow(moment.unix(unixSec).toDate());
}

export function MarketingPostCardSkeleton() {
    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
            }}
        >
            <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '16 / 9' }} />
            <CardContent sx={{ pt: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 1 }}>
                    <Skeleton variant="rounded" width={72} height={22} />
                    <Skeleton variant="text" width={72} height={18} />
                </Box>
                <Skeleton variant="text" height={22} />
                <Skeleton variant="text" width="80%" height={18} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="100%" height={16} sx={{ mt: 0.5 }} />
            </CardContent>
        </Card>
    );
}

type MarketingPostCardProps = {
    post?: MarketingHomePost;
    appStoreUrl: string;
};

function MarketingPostCard({ post, appStoreUrl }: MarketingPostCardProps) {
    if (!post) {
        return <MarketingPostCardSkeleton />;
    }

    const imageSrc = post.thumbnailUrl?.trim() ? post.thumbnailUrl : SPACEDEV_LOGO_FALLBACK;
    const categoryLabel = post.categoryName?.trim() ?? '';
    const datePublishTs =
        typeof post.datePublish === 'number' && post.datePublish > 0 ? post.datePublish : undefined;
    const publishedLabel = formatMarketingDatePublish(datePublishTs);
    const hasCategory = categoryLabel !== '';
    const hasMetaRow = hasCategory || publishedLabel !== '';

    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <CardActionArea
                component="a"
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
                <Box
                    sx={{
                        width: '100%',
                        aspectRatio: '16 / 9',
                        bgcolor: 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <ImageLazyLoading
                        src={imageSrc}
                        alt={post.title}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </Box>
                <CardContent sx={{ flex: 1, pt: 1.5, pb: 2 }}>
                    {hasMetaRow ? (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 1,
                                mb: 1,
                                minHeight: 22,
                            }}
                        >
                            {hasCategory ? (
                                <Chip
                                    label={categoryLabel}
                                    size="small"
                                    sx={{
                                        height: 22,
                                        maxWidth: hasCategory && publishedLabel ? 'calc(100% - 88px)' : '100%',
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: 'primary.main',
                                        borderColor: 'primary.main',
                                        bgcolor: 'action.hover',
                                        '& .MuiChip-label': {
                                            px: 0.75,
                                            display: 'block',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        },
                                    }}
                                    variant="outlined"
                                />
                            ) : (
                                <Box />
                            )}
                            {publishedLabel ? (
                                <Typography
                                    component="time"
                                    dateTime={
                                        datePublishTs
                                            ? moment.unix(datePublishTs).utc().format()
                                            : undefined
                                    }
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        flexShrink: 0,
                                        fontSize: 12,
                                        lineHeight: 1.2,
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {publishedLabel}
                                </Typography>
                            ) : null}
                        </Box>
                    ) : null}
                    <Typography
                        variant="subtitle1"
                        component="h3"
                        sx={{
                            fontWeight: 600,
                            lineHeight: 1.35,
                            ...cssMaxLine(2),
                        }}
                    >
                        {post.title}
                    </Typography>
                    {post.description ? (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 1,
                                lineHeight: 1.5,
                                maxHeight: 72,
                                ...cssMaxLine(3),
                            }}
                        >
                            {post.description}
                        </Typography>
                    ) : null}
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default MarketingPostCard;
