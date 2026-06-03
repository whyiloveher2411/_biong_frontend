import { Box, CircularProgress } from '@mui/material';
import HeadphonesRounded from '@mui/icons-material/HeadphonesRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import React from 'react';

const SESSION_ACCENT = '#00E5FF';

type MarketingNewsAudioThumbnailBadgeProps = {
    isPlaying: boolean;
    isLoading: boolean;
    isPausedSession: boolean;
    size?: number;
    iconSize?: number;
};

function MarketingNewsAudioThumbnailBadge({
    isPlaying,
    isLoading,
    isPausedSession,
    size = 56,
    iconSize = 32,
}: MarketingNewsAudioThumbnailBadgeProps) {
    const [pulsePhase, setPulsePhase] = React.useState(0);

    React.useEffect(() => {
        if (isPlaying || isLoading) {
            return undefined;
        }
        const id = window.setInterval(() => {
            setPulsePhase((p) => (p + 1) % 60);
        }, 50);
        return () => window.clearInterval(id);
    }, [isPlaying, isLoading]);

    const showPulse = !isPlaying && !isLoading;
    const pulseScale = 1 + (pulsePhase / 60) * 0.45;
    const pulseOpacity = 0.5 * (1 - pulsePhase / 60);

    const idleIcon = isPausedSession ? (
        <PlayArrowRounded sx={{ fontSize: iconSize, color: SESSION_ACCENT }} />
    ) : (
        <HeadphonesRounded sx={{ fontSize: iconSize, color: 'rgba(255,255,255,0.55)' }} />
    );

    let center: React.ReactNode = idleIcon;
    if (isPlaying) {
        center = (
            <Box
                sx={{
                    width: iconSize * 0.85,
                    height: iconSize * 0.35,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: '3px',
                }}
            >
                {[0.4, 0.7, 1, 0.65, 0.5].map((h, i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 4,
                            height: `${h * 100}%`,
                            bgcolor: SESSION_ACCENT,
                            borderRadius: 1,
                            animation: 'newsAudioBar 0.8s ease-in-out infinite',
                            animationDelay: `${i * 0.1}s`,
                            '@keyframes newsAudioBar': {
                                '0%, 100%': { transform: 'scaleY(0.45)' },
                                '50%': { transform: 'scaleY(1)' },
                            },
                        }}
                    />
                ))}
            </Box>
        );
    } else if (isLoading) {
        center = (
            <CircularProgress
                size={iconSize * 0.72}
                thickness={3}
                sx={{ color: 'rgba(255,255,255,0.55)' }}
            />
        );
    }

    return (
        <Box
            sx={{
                width: size,
                height: size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}
        >
            {showPulse ? (
                <Box
                    sx={{
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: `scale(${pulseScale})`,
                        opacity: pulseOpacity,
                        pointerEvents: 'none',
                    }}
                >
                    {idleIcon}
                </Box>
            ) : null}
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {center}
            </Box>
        </Box>
    );
}

export default MarketingNewsAudioThumbnailBadge;
