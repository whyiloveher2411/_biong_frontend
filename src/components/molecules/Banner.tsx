import { Box, Skeleton, Typography, useTheme } from '@mui/material'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import React from 'react'

export interface BannerProps {
    subTitle?: string,
    title?: string,
    description?: string,
    image: string,
    color: string,
    children?: React.ReactNode,
}
function Banner(props: BannerProps) {

    const theme = useTheme();

    return (
        <Box
            component='section'
            sx={
                (theme) => ({
                    display: 'flex',
                    position: 'relative',
                    alignItems: 'center',
                    zIndex: 1,
                    [theme.breakpoints.down('md')]: {
                        flexDirection: 'column-reverse',
                        alignItems: 'flex-end',
                    }
                })
            }
        >
            <Box
                sx={{
                    width: '50%',
                    flexShrink: 0,
                    zIndex: 1,
                    [theme.breakpoints.down('md')]: {
                        width: '100%',
                        marginTop: '-66px',
                    }
                }}

            >
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
                                letterSpacing: '0.5px',
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
                            <Typography sx={{ mt: 3, lineHeight: '56px', letterSpacing: '-0.5px', fontSize: 48, fontWeight: 400 }} variant='h1' component='h2'>{props.title}</Typography>
                            <Typography sx={{ mt: 2, lineHeight: '28px', fontSize: 18 }} variant='subtitle1'>{props.description}</Typography>
                        </>
                }
            </Box>
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 0,
                    display: 'block',
                    width: '50%',
                    [theme.breakpoints.down('md')]: {
                        width: '72%',
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        left: '-42.5%',
                        width: '83.2%',
                        zIndex: 1,
                    }}
                >
                    <svg width="100%" height="100%" viewBox="0 0 553 160" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 0H553L285 159.314L0 0Z" fill={props.color}></path>
                    </svg>
                </Box>
                <Box
                    sx={{
                        overflow: 'hidden',
                        width: '100%',
                        position: 'relative',
                        paddingBottom: '83.09%',
                    }}
                >
                    <ImageLazyLoading alt="gallery image" sx={{
                        clipPath: 'polygon(-10% 0,100% 0,100% 100%,26% 100%)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                    }} src={props.image} />
                </Box>
            </Box>
        </Box >
    )
}

export default Banner

export function BannerLoading(props: {
    children?: React.ReactNode,
}) {
    const theme = useTheme();
    return (
        <Box
            component='section'
            sx={{
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                zIndex: 1,
            }}
        >
            <Box
                sx={{
                    width: '48%',
                    flexShrink: 0,
                    zIndex: 1,
                }}

            >
                {
                    props.children ?
                        props.children
                        :
                        <>
                            <Skeleton variant='rectangular'>
                                <Typography sx={{
                                    mt: 3, fontWeight: 500, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px',
                                    '&:after': {
                                        content: "''",
                                        display: 'block',
                                        height: '2px',
                                        marginTop: '16px',
                                        width: '80px',
                                    }
                                }}>Lorem ipsum, dolor</Typography>
                            </Skeleton>
                            <Skeleton variant='rectangular'
                                sx={{
                                    height: '2px',
                                    marginTop: '16px',
                                    width: '80px',
                                }}
                            />

                            <Skeleton>
                                <Typography sx={{ mt: 2, lineHeight: '56px', letterSpacing: '-0.5px', fontSize: 48, fontWeight: 400 }} variant='h1' component='h2'>Lorem ipsum, dolor sit amet consectetur adipisicing elit</Typography>
                            </Skeleton>
                            <Skeleton>
                                <Typography sx={{ mt: 1, lineHeight: '28px', fontSize: 18 }} variant='subtitle1'>Lorem ipsum, dolor sit amet consectetur adipisicing elit</Typography>
                            </Skeleton>
                            <Skeleton>
                                <Typography sx={{ mt: 1, lineHeight: '28px', fontSize: 18 }} variant='subtitle1'>Lorem ipsum, dolor sit amet consectetur adipisicing elit</Typography>
                            </Skeleton>
                            <Skeleton >
                                <Typography sx={{ mt: 1, lineHeight: '28px', fontSize: 18 }} variant='subtitle1'>Lorem ipsum, dolor sit amet consectetur adipisicing elit</Typography>
                            </Skeleton>
                        </>
                }
            </Box>
            <Box
                sx={{
                    width: '100%',
                    position: 'relative',
                    zIndex: 0,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        left: '-41.5%',
                        width: '83.2%',
                        zIndex: 1,
                    }}
                >
                    <svg width="100%" height="100%" viewBox="0 0 553 160" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 0H553L285 159.314L0 0Z" fill={theme.palette.divider}></path>
                    </svg>
                </Box>
                <Skeleton
                    variant='rectangular'
                    sx={{
                        width: '100%',
                        minHeight: 506,
                        clipPath: 'polygon(-10% 0,100% 0,100% 100%,26% 100%)',
                    }}
                />
            </Box>
        </Box >
    )
}