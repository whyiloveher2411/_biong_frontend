import { Box, useMediaQuery, useTheme } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

export type SpacedevAppHeroVisualProps = {
    logo: string;
    logoAlt: string;
    color: string;
};

const CLIP = 'polygon(-10% 0,100% 0,100% 100%,26% 100%)';

/** Sao nhỏ (CSS), tọa độ % trong khung clip-path */
const STAR_DOTS: { top: string; left: string; size: number; delay: string }[] = [
    { top: '12%', left: '72%', size: 3, delay: '0s' },
    { top: '22%', left: '88%', size: 2, delay: '0.4s' },
    { top: '38%', left: '78%', size: 4, delay: '0.2s' },
    { top: '55%', left: '92%', size: 2, delay: '0.7s' },
    { top: '68%', left: '70%', size: 3, delay: '1s' },
    { top: '18%', left: '58%', size: 2, delay: '0.5s' },
    { top: '78%', left: '85%', size: 3, delay: '0.3s' },
];

export function SpacedevAppHeroVisual({ logo, logoAlt, color }: SpacedevAppHeroVisualProps) {
    const theme = useTheme();
    const reduceMotion = useReducedMotion();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

    const showHeavy = isMdUp && !reduceMotion;

    return (
        <Box
            sx={{
                position: 'absolute',
                height: '100%',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    clipPath: CLIP,
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                    backgroundColor: color,
                    overflow: 'hidden',
                }}
            >
                {/* Aurora / mesh */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: '-20%',
                        opacity: showHeavy ? 0.55 : 0.35,
                        background: `radial-gradient(ellipse 80% 50% at 60% 40%, rgba(58, 223, 250, 0.22) 0%, transparent 55%),
              radial-gradient(ellipse 60% 40% at 75% 70%, rgba(175, 136, 255, 0.18) 0%, transparent 50%),
              radial-gradient(ellipse 50% 35% at 45% 80%, rgba(255, 110, 132, 0.1) 0%, transparent 45%)`,
                        filter: showHeavy ? 'blur(28px)' : 'blur(18px)',
                        animation: reduceMotion ? 'none' : 'heroAuroraDrift 14s ease-in-out infinite',
                        '@keyframes heroAuroraDrift': {
                            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                            '50%': { transform: 'translate(-3%, 2%) scale(1.04)' },
                        },
                    }}
                />

                {/* Wave GIFs — nhẹ hơn, chỉ desktop */}
                {showHeavy && (
                    <>
                        <Box
                            component="img"
                            src="/images/gif/wave-ball.gif"
                            alt=""
                            sx={{
                                position: 'absolute',
                                opacity: 0.1,
                                width: '55%',
                                top: '48%',
                                left: '54%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                        <Box
                            component="img"
                            src="/images/gif/wave-ball.gif"
                            alt=""
                            sx={{
                                position: 'absolute',
                                opacity: 0.08,
                                width: '48%',
                                top: '52%',
                                left: '58%',
                                transform: 'translate(-50%, -50%) rotate(-18deg)',
                            }}
                        />
                    </>
                )}

                {/* Sao tĩnh + pulse */}
                {STAR_DOTS.map((s, i) => (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            top: s.top,
                            left: s.left,
                            width: s.size,
                            height: s.size,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255,255,255,0.55)',
                            boxShadow: '0 0 6px rgba(58,223,250,0.5)',
                            animation: reduceMotion
                                ? 'none'
                                : `heroStarPulse 3.2s ease-in-out ${s.delay} infinite`,
                            '@keyframes heroStarPulse': {
                                '0%, 100%': { opacity: 0.35, transform: 'scale(1)' },
                                '50%': { opacity: 1, transform: 'scale(1.35)' },
                            },
                        }}
                    />
                ))}

                {/* Orbit rings */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '55%',
                        width: 'min(72%, 420px)',
                        height: 'min(72%, 420px)',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        opacity: showHeavy ? 0.9 : 0.45,
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Box
                            component="svg"
                            viewBox="0 0 200 200"
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                overflow: 'visible',
                                animation: reduceMotion ? 'none' : 'heroOrbitSpin 32s linear infinite',
                                '@keyframes heroOrbitSpin': {
                                    from: { transform: 'rotate(0deg)' },
                                    to: { transform: 'rotate(360deg)' },
                                },
                            }}
                        >
                            <circle
                                cx="100"
                                cy="100"
                                r="88"
                                fill="none"
                                stroke="rgba(58, 223, 250, 0.2)"
                                strokeWidth="0.8"
                                strokeDasharray="8 14"
                            />
                        </Box>
                        <Box
                            component="svg"
                            viewBox="0 0 200 200"
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                overflow: 'visible',
                                animation: reduceMotion ? 'none' : 'heroOrbitSpinReverse 48s linear infinite',
                                '@keyframes heroOrbitSpinReverse': {
                                    from: { transform: 'rotate(360deg)' },
                                    to: { transform: 'rotate(0deg)' },
                                },
                            }}
                        >
                            <circle
                                cx="100"
                                cy="100"
                                r="72"
                                fill="none"
                                stroke="rgba(175, 136, 255, 0.18)"
                                strokeWidth="0.6"
                                strokeDasharray="4 10"
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Logo */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '55%',
                        transform: 'translate(-50%, -50%)',
                        maxHeight: '45%',
                        maxWidth: '45%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        filter: showHeavy ? 'drop-shadow(0 0 24px rgba(58, 223, 250, 0.35))' : 'none',
                    }}
                >
                    <motion.img
                        src={logo}
                        alt={logoAlt}
                        animate={
                            reduceMotion
                                ? undefined
                                : {
                                      y: [0, -7, 0],
                                  }
                        }
                        transition={
                            reduceMotion
                                ? undefined
                                : {
                                      duration: 4.2,
                                      repeat: Infinity,
                                      ease: 'easeInOut',
                                  }
                        }
                        style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            width: 'auto',
                            height: 'auto',
                            display: 'block',
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}
