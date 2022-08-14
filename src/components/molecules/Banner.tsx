import { Box, Typography, useTheme } from '@mui/material'
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
                            <Typography sx={{
                                mt: 3, fontWeight: 500, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.palette.text.disabled,
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
                    width: 'auto',
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
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 0H553L285 159.314L0 0Z" fill={props.color}></path>
                    </svg>
                </Box>
                <ImageLazyLoading alt="gallery image" sx={{
                    width: '100%',
                    minHeight: 506,
                    clipPath: 'polygon(-10% 0,100% 0,100% 100%,26% 100%)',
                }} src={props.image} />
            </Box>
        </Box >
    )
}

export default Banner