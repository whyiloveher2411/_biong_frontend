import { Box, Card, CardActionArea, CardContent, Chip, Skeleton, Typography } from '@mui/material';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { cssMaxLine } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import React from 'react';
import { AppCatalogCourse } from 'services/spacedevCatalogService';

const SLIDER_CARD_WIDTH = 168;

export function AppCourseCardSkeleton({ compact = false }: { compact?: boolean }) {
    if (compact) {
        return (
            <Card
                elevation={0}
                sx={{
                    width: SLIDER_CARD_WIDTH,
                    flexShrink: 0,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.04)',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Skeleton variant="rounded" height={72} sx={{ mb: 1.25, borderRadius: 1.5 }} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" width="70%" height={16} sx={{ mt: 1 }} />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <CardContent>
                <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
                <Skeleton variant="text" height={28} />
                <Skeleton variant="text" width="60%" />
            </CardContent>
        </Card>
    );
}

type AppCourseCardProps = {
    course?: AppCatalogCourse;
    appStoreUrl: string;
    compact?: boolean;
};

function AppCourseCard({ course, appStoreUrl, compact = false }: AppCourseCardProps) {
    if (!course) {
        return <AppCourseCardSkeleton compact={compact} />;
    }

    if (compact) {
        return (
            <Card
                elevation={0}
                sx={(theme) => ({
                    width: SLIDER_CARD_WIDTH,
                    flexShrink: 0,
                    scrollSnapAlign: 'start',
                    borderRadius: 2,
                    bgcolor:
                        theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.04)'
                            : theme.palette.grey[50],
                    border: '1px solid',
                    borderColor:
                        theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.08)'
                            : theme.palette.divider,
                    transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        borderColor:
                            theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.18)'
                                : theme.palette.primary.light,
                        transform: 'translateY(-3px)',
                        boxShadow:
                            theme.palette.mode === 'dark'
                                ? '0 8px 24px rgba(0,0,0,0.35)'
                                : theme.shadows[4],
                    },
                })}
            >
                <CardActionArea
                    component="a"
                    href={appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ height: '100%' }}
                >
                    <CardContent
                        sx={{
                            p: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            '&:last-child': { pb: 1.5 },
                        }}
                    >
                        <Box
                            sx={(theme) => ({
                                position: 'relative',
                                borderRadius: 1.5,
                                overflow: 'hidden',
                                bgcolor:
                                    theme.palette.mode === 'dark'
                                        ? 'rgba(0,0,0,0.35)'
                                        : theme.palette.grey[100],
                                height: 72,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            })}
                        >
                            {course.iconUrl ? (
                                <ImageLazyLoading
                                    src={course.iconUrl}
                                    alt={course.title}
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        objectFit: 'contain',
                                    }}
                                />
                            ) : (
                                <Typography variant="h5" color="text.secondary">
                                    {course.title.charAt(0).toUpperCase()}
                                </Typography>
                            )}
                            {course.isComingSoon && (
                                <Chip
                                    label={__('Sắp ra mắt')}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 6,
                                        right: 6,
                                        height: 20,
                                        fontSize: 10,
                                        '& .MuiChip-label': { px: 0.75 },
                                    }}
                                />
                            )}
                        </Box>

                        <Typography
                            variant="subtitle2"
                            component="h3"
                            sx={{
                                fontWeight: 700,
                                lineHeight: 1.3,
                                color: 'text.primary',
                                ...cssMaxLine(2),
                            }}
                        >
                            {course.title}
                        </Typography>

                        {course.labels.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {course.labels.slice(0, 2).map((label, index) => (
                                    <Chip
                                        key={`${label.title}-${index}`}
                                        label={label.title}
                                        size="small"
                                        sx={{
                                            height: 22,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: label.color || undefined,
                                            bgcolor: label.background_color || 'rgba(255,255,255,0.08)',
                                            '& .MuiChip-label': { px: 0.75 },
                                        }}
                                    />
                                ))}
                            </Box>
                        )}

                        <Typography
                            variant="caption"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 500,
                                mt: 'auto',
                                pt: 0.25,
                                lineHeight: 1.35,
                                ...cssMaxLine(2),
                            }}
                        >
                            {__('Học trên ứng dụng Spacedev')}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }

    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
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
                sx={{ height: '100%', alignItems: 'stretch' }}
            >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box
                        sx={{
                            position: 'relative',
                            borderRadius: 1.5,
                            overflow: 'hidden',
                            bgcolor: 'action.hover',
                            minHeight: 120,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {course.iconUrl ? (
                            <ImageLazyLoading
                                src={course.iconUrl}
                                alt={course.title}
                                sx={{
                                    width: '100%',
                                    maxHeight: 140,
                                    objectFit: 'contain',
                                }}
                            />
                        ) : (
                            <Typography variant="h4" color="text.secondary">
                                {course.title.charAt(0).toUpperCase()}
                            </Typography>
                        )}
                        {course.isComingSoon && (
                            <Chip
                                label={__('Sắp ra mắt')}
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                }}
                            />
                        )}
                    </Box>

                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {course.title}
                    </Typography>

                    {course.labels.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {course.labels.map((label, index) => (
                                <Chip
                                    key={`${label.title}-${index}`}
                                    label={label.title}
                                    size="small"
                                    sx={{
                                        color: label.color || undefined,
                                        bgcolor: label.background_color || undefined,
                                    }}
                                />
                            ))}
                        </Box>
                    )}

                    <Typography variant="body2" color="primary" sx={{ mt: 'auto', pt: 0.5 }}>
                        {__('Học trên ứng dụng Spacedev')}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default AppCourseCard;
