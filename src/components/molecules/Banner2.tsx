import { Box, Typography, useTheme, Skeleton } from '@mui/material';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import React from 'react';

export interface BannerProps {
    subTitle?: string,
    title?: string,
    description?: string,
    image: string,
    imageCustom?: React.ReactNode,
    color: string,
    children?: React.ReactNode,
}
function Banner2(props: BannerProps) {

    const theme = useTheme();

    return (
        <Box
            component='section'
            sx={
                (theme) => ({
                    display: 'flex',
                    position: 'relative',
                    zIndex: 1,
                    padding: 4,
                    [theme.breakpoints.down('md')]: {
                        flexDirection: 'column-reverse',
                        alignItems: 'flex-end',
                    },
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: props.color,
                        opacity: 0.2,
                    }
                })
            }
        >
            <Box
                sx={{
                    width: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    zIndex: 1,
                    paddingRight: 3,
                    [theme.breakpoints.down('md')]: {
                        paddingRight: 0,
                        width: '100%',
                    }
                }}

            >
                <Box>
                    {
                        props.children ?
                            props.children
                            :
                            <>
                                <Typography sx={{
                                    mt: 3,
                                    fontWeight: 500,
                                    fontSize: 14,
                                    textTransform: 'uppercase',
                                    color: theme.palette.text.disabled,
                                    '&:after': {
                                        backgroundColor: theme.palette.primary.main,
                                        content: "''",
                                        display: 'block',
                                        height: '2px',
                                        marginTop: '16px',
                                        width: '80px',
                                    }
                                }}>{props.subTitle}</Typography>
                                <Typography sx={{ mt: 3, lineHeight: '56px', fontSize: 48, fontWeight: 400 }} variant='h1' component='h2'>{props.title}</Typography>
                                <Typography sx={{ mt: 2, lineHeight: '28px', fontSize: 18 }} variant='subtitle1'>{props.description}</Typography>
                            </>
                    }
                </Box>
            </Box>
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 0,
                    display: 'block',
                    width: '50%',
                    [theme.breakpoints.down('md')]: {
                        width: '100%',
                    }
                }}
            >
                <Box
                    sx={{
                        overflow: 'hidden',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        pt: '56.25%',
                        '& img': {
                            overflow: 'hidden !important',
                        }
                    }}
                >
                    {
                        props.imageCustom ?
                            props.imageCustom
                            :
                            <ImageLazyLoading alt="gallery image" sx={{
                                height: 'auto',
                                borderRadius: '16px',
                                width: '100%',
                                top: 0,
                                overflow: 'initial',
                                position: 'absolute',
                            }} src={props.image} />
                    }
                </Box>
            </Box>
            <Box
                sx={{
                    left: '0',
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    opacity: 0.2,
                }}
            >
                <svg style={{
                    fill: props.color,
                    overflowX: 'hidden',
                    position: 'absolute',
                    width: '100%',
                    pointerEvents: 'none',
                }}>
                    <path d="M 0 31 C 313 -17 359 19 530 29 S 905 -20 1303 21 S 1677 -28 2537 29 L 2537 0 L 0 0 L 0 31"></path>
                </svg>
            </Box>
        </Box >
    )
}

export default Banner2

export function Banner2Loading() {

    const theme = useTheme();

    return (
        <Box
            component='section'
            sx={
                (theme) => ({
                    display: 'flex',
                    position: 'relative',
                    zIndex: 1,
                    padding: 4,
                    [theme.breakpoints.down('md')]: {
                        flexDirection: 'column-reverse',
                        alignItems: 'flex-end',
                    },
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: theme.palette.divider,
                        opacity: 0.2,
                    }
                })
            }
        >
            <Box
                sx={{
                    width: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    zIndex: 1,
                    paddingRight: 3,
                    [theme.breakpoints.down('md')]: {
                        paddingRight: 0,
                        width: '100%',
                    }
                }}

            >
                <Box>

                    <Skeleton>
                        <Typography sx={{
                            mt: 3,
                            fontWeight: 500,
                            fontSize: 14,
                            textTransform: 'uppercase',
                            color: theme.palette.text.disabled,
                            '&:after': {
                                backgroundColor: theme.palette.primary.main,
                                content: "''",
                                display: 'block',
                                height: '2px',
                                marginTop: '16px',
                                width: '80px',
                            }
                        }}>Học viện spacedev.vn</Typography>
                    </Skeleton>
                    <Skeleton>
                        <Typography sx={{ mt: 3, lineHeight: '56px', fontSize: 48, fontWeight: 400 }} variant='h1' component='h2'>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</Typography>
                    </Skeleton>
                    <Skeleton>
                        <Typography sx={{ mt: 2, lineHeight: '28px', fontSize: 18 }} variant='subtitle1'>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi adipisci neque alias. Soluta maxime voluptatem error accusantium corporis at molestiae deserunt! Eaque, unde itaque harum saepe natus sed recusandae quidem.
                        </Typography>
                    </Skeleton>
                </Box>
            </Box>
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 0,
                    display: 'block',
                    width: '50%',
                    [theme.breakpoints.down('md')]: {
                        width: '100%',
                    }
                }}
            >
                <Box
                    sx={{
                        overflow: 'hidden',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        pt: '56.25%',
                        '& img': {
                            overflow: 'hidden !important',
                        }
                    }}
                >
                    <Skeleton
                        variant='rectangular'
                        sx={{
                            height: '100%',
                            borderRadius: '16px',
                            width: '100%',
                            top: 0,
                            overflow: 'initial',
                            position: 'absolute',
                        }}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    left: '0',
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    opacity: 0.2,
                }}
            >
                <svg style={{
                    fill: theme.palette.divider,
                    overflowX: 'hidden',
                    position: 'absolute',
                    width: '100%',
                    pointerEvents: 'none',
                }}>
                    <path d="M 0 31 C 313 -17 359 19 530 29 S 905 -20 1303 21 S 1677 -28 2537 29 L 2537 0 L 0 0 L 0 31"></path>
                </svg>
            </Box>
        </Box >
    )
}