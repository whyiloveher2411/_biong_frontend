import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from 'components/atoms/Button';
import { __ } from 'helpers/i18n';
import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

const MotionBox = motion(Box);

export type HomeAppHeroContentProps = {
    appStoreUrl: string;
    onExploreCourses: () => void;
    onExploreMobileCourses: () => void;
};

export function HomeAppHeroContent({
    appStoreUrl,
    onExploreCourses,
    onExploreMobileCourses,
}: HomeAppHeroContentProps) {
    const reduceMotion = useReducedMotion();

    const stagger = reduceMotion ? 0 : 0.07;
    const container = React.useMemo(
        () => ({
            hidden: { opacity: reduceMotion ? 1 : 0 },
            show: {
                opacity: 1,
                transition: {
                    staggerChildren: stagger,
                    delayChildren: reduceMotion ? 0 : 0.06,
                },
            },
        }),
        [reduceMotion, stagger],
    );

    const item = React.useMemo(
        () => ({
            hidden: reduceMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 18 },
            show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
            },
        }),
        [reduceMotion],
    );

    const accent = React.useMemo(
        () => ({
            hidden: reduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.96, opacity: 0 },
            show: {
                scale: 1,
                opacity: 1,
                transition: { delay: reduceMotion ? 0 : 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
            },
        }),
        [reduceMotion],
    );

    return (
        <MotionBox variants={container} initial="hidden" animate="show" sx={{ maxWidth: 1 }}>
            <MotionBox variants={item}>
                <Typography
                    sx={(theme) => ({
                        mt: 3,
                        fontWeight: 500,
                        fontSize: 14,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: theme.palette.text.disabled,
                        '&:after': {
                            backgroundColor: theme.palette.primary.main,
                            content: "''",
                            display: 'block',
                            height: '2px',
                            marginTop: '16px',
                            width: '80px',
                        },
                    })}
                >
                    {__('Học viện spacedev.vn')}
                </Typography>
            </MotionBox>

            <MotionBox variants={item}>
                <Typography
                    sx={{
                        mt: 3,
                        lineHeight: { xs: 1.15, sm: 1.2 },
                        letterSpacing: '-0.5px',
                        fontSize: { xs: 32, sm: 40, md: 48 },
                        fontWeight: 400,
                    }}
                    variant="h1"
                    component="h2"
                >
                    <Typography component="span" sx={{ fontSize: 'inherit', color: 'text.primary' }}>
                        <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}>
                            Học{' '}
                        </Box>
                        <Box component="span" sx={{ color: 'warning.main', fontWeight: 600 }}>
                            sử dụng AI
                        </Box>
                        <Box component="span" sx={{ color: 'text.secondary' }}>, </Box>
                        <Box component="span" sx={{ color: 'success.main', fontWeight: 600 }}>
                            code
                        </Box>
                        <Box component="span" sx={{ color: 'text.secondary' }}> và </Box>
                        <Box component="span" sx={{ color: 'info.main', fontWeight: 500 }}>
                            kỹ năng mới
                        </Box>
                    </Typography>{' '}
                    <Typography component="span" sx={{ color: 'text.primary', fontSize: 'inherit' }}>
                        ngay trên
                    </Typography>{' '}
                    <Box
                        component="span"
                        sx={{
                            display: 'inline-block',
                            fontSize: 'inherit',
                            fontWeight: 500,
                            ...(reduceMotion
                                ? { color: 'error.main' }
                                : {
                                      background: (theme) =>
                                          `linear-gradient(105deg, ${theme.palette.error.main} 0%, #ff7043 40%, ${theme.palette.error.main} 100%)`,
                                      backgroundSize: '220% auto',
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                      backgroundClip: 'text',
                                      animation: 'heroWordShimmer 8s ease-in-out infinite',
                                      '@keyframes heroWordShimmer': {
                                          '0%, 100%': { backgroundPosition: '0% center' },
                                          '50%': { backgroundPosition: '100% center' },
                                      },
                                  }),
                        }}
                    >
                        điện thoại
                    </Box>
                </Typography>
            </MotionBox>

            <MotionBox variants={item}>
                <Typography
                    sx={{
                        mt: 2,
                        mb: 2,
                        lineHeight: 1.6,
                        fontSize: { xs: 16, sm: 17 },
                        color: 'text.secondary',
                    }}
                    variant="subtitle1"
                    component="p"
                >
                    Spacedev đưa lộ trình{' '}
                    <Box component="em" sx={{ fontStyle: 'normal', color: 'text.primary' }}>
                        Master AI, Coding &amp; Future Skills
                    </Box>{' '}
                    vào một ứng dụng — bạn học từng bài ngắn, luyện ngay trong app, giữ nhịp với streak và XP trong giao diện hiện đại, và vẫn học được khi không có mạng.
                </Typography>
            </MotionBox>

            <MotionBox variants={accent}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                    <MotionBox
                        whileHover={reduceMotion ? undefined : { scale: 1.04, y: -2 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                        sx={{ lineHeight: 0, display: 'inline-block' }}
                    >
                        <Box
                            component="a"
                            href={appStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ lineHeight: 0, display: 'inline-block' }}
                        >
                            <Box 
                                component="img"
                                src="/images/download-on-the-app-store.svg"
                                alt="Download on the App Store"
                                sx={{ height: 40, width: 'auto', display: 'block' }}
                            />
                        </Box>
                    </MotionBox>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            flexWrap: 'wrap',
                            alignItems: { xs: 'stretch', sm: 'center' },
                            gap: 1.5,
                            width: { xs: '100%', sm: 'auto' },
                        }}
                    >
                        <Button
                            size="medium"
                            variant="contained"
                            onClick={onExploreMobileCourses}
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            {__('Khóa học trên điện thoại')}
                        </Button>
                        <Button
                            size="medium"
                            variant="outlined"
                            onClick={onExploreCourses}
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            {__('Khám phá khóa học trên web')}
                        </Button>
                    </Box>
                </Box>
            </MotionBox>
        </MotionBox>
    );
}
