import {
    Box,
    CircularProgress,
    IconButton,
    LinearProgress,
    Typography,
} from '@mui/material';
import CloseRounded from '@mui/icons-material/CloseRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { SPACEDEV_LOGO_FALLBACK } from 'constants/spacedevApp';
import { __ } from 'helpers/i18n';
import {
    MARKETING_NEWS_MINI_PLAYER_HEIGHT,
    useMarketingNewsAudio,
} from 'hook/useMarketingNewsAudio';
import React from 'react';

const ACCENT = '#00E5FF';
const SURFACE = '#152028';

/** Khớp spacedev-app: progress 3px + hàng nội dung 36px + padding dọc 5px mỗi bên */
const PROGRESS_HEIGHT = 3;
const ROW_CONTENT_HEIGHT = 36;
const ROW_PADDING_Y = 5;

function MarketingNewsMiniPlayer() {
    const {
        session,
        isPlaying,
        isLoading,
        position,
        duration,
        loadError,
        togglePlay,
        close,
        seek,
    } = useMarketingNewsAudio();

    const progressRef = React.useRef<HTMLDivElement>(null);

    if (!session) {
        return null;
    }

    const { post } = session;
    const progress = duration > 0 ? Math.min(1, position / duration) : 0;
    const thumbnailSrc = post.thumbnailUrl?.trim() ? post.thumbnailUrl : SPACEDEV_LOGO_FALLBACK;
    const titleText = loadError ? __('Không tải được audio') : post.title;

    const handleProgressPointer = (clientX: number) => {
        const el = progressRef.current;
        if (!el || duration <= 0) {
            return;
        }
        const rect = el.getBoundingClientRect();
        const ratio = (clientX - rect.left) / rect.width;
        seek(ratio);
    };

    return (
        <Box
            component="section"
            aria-label={__('Phát audio bài viết')}
            sx={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: (theme) => theme.zIndex.snackbar,
                height: MARKETING_NEWS_MINI_PLAYER_HEIGHT,
                bgcolor: SURFACE,
                borderTop: `1px solid ${ACCENT}38`,
                boxShadow: '0 -4px 20px rgba(0,0,0,0.35)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Box
                ref={progressRef}
                onClick={(e) => handleProgressPointer(e.clientX)}
                onKeyDown={(e) => {
                    if (duration <= 0) {
                        return;
                    }
                    if (e.key === 'ArrowLeft') {
                        seek(Math.max(0, progress - 0.05));
                    } else if (e.key === 'ArrowRight') {
                        seek(Math.min(1, progress + 0.05));
                    }
                }}
                role="slider"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                tabIndex={duration > 0 ? 0 : -1}
                sx={{
                    flexShrink: 0,
                    height: PROGRESS_HEIGHT,
                    cursor: duration > 0 ? 'pointer' : 'default',
                }}
            >
                <LinearProgress
                    variant="determinate"
                    value={progress * 100}
                    sx={{
                        width: '100%',
                        height: PROGRESS_HEIGHT,
                        borderRadius: 0,
                        bgcolor: '#24303A',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: progress > 0 || isPlaying ? ACCENT : '#4A5F6A',
                        },
                    }}
                />
            </Box>

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1,
                    py: `${ROW_PADDING_Y}px`,
                    boxSizing: 'border-box',
                }}
            >
                <Box
                    sx={{
                        width: ROW_CONTENT_HEIGHT,
                        height: ROW_CONTENT_HEIGHT,
                        borderRadius: 1,
                        overflow: 'hidden',
                        flexShrink: 0,
                        bgcolor: 'action.hover',
                    }}
                >
                    <ImageLazyLoading
                        src={thumbnailSrc}
                        alt=""
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        height: ROW_CONTENT_HEIGHT,
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <Typography
                        variant="body2"
                        component="div"
                        title={titleText}
                        sx={{
                            fontWeight: 700,
                            fontSize: 13,
                            lineHeight: 1.2,
                            color: loadError ? '#FF6B6B' : '#fff',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {titleText}
                    </Typography>
                </Box>

                <IconButton
                    size="small"
                    onClick={togglePlay}
                    aria-label={isPlaying ? __('Tạm dừng') : __('Phát')}
                    sx={{
                        width: 32,
                        height: 32,
                        p: 0,
                        bgcolor: ACCENT,
                        color: '#042A2D',
                        flexShrink: 0,
                        alignSelf: 'center',
                        '&:hover': { bgcolor: '#33EBFF' },
                    }}
                >
                    {isLoading ? (
                        <CircularProgress size={18} sx={{ color: '#042A2D' }} />
                    ) : isPlaying ? (
                        <PauseRounded sx={{ fontSize: 20 }} />
                    ) : (
                        <PlayArrowRounded sx={{ fontSize: 20 }} />
                    )}
                </IconButton>

                <IconButton
                    size="small"
                    onClick={close}
                    aria-label={__('Đóng trình phát')}
                    sx={{
                        width: 32,
                        height: 32,
                        p: 0,
                        color: 'rgba(255,255,255,0.7)',
                        flexShrink: 0,
                        alignSelf: 'center',
                    }}
                >
                    <CloseRounded sx={{ fontSize: 20 }} />
                </IconButton>
            </Box>
        </Box>
    );
}

export default MarketingNewsMiniPlayer;
