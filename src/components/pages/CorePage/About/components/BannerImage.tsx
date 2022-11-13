import { Box, SxProps, Theme, Typography } from '@mui/material'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import { Link } from 'react-router-dom'

function BannerImage(props: {
    subTitle: string,
    title: string,
    image: string,
    sx?: SxProps<Theme>,
    to?: string,
}) {
    return (
        <Box
            component={props.to ? Link : 'div'}
            to={props.to ? props.to : undefined}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                // height: 810,
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                zIndex: 2,
                cursor: 'pointer',
                '&:before': {
                    content: '""',
                    display: 'block',
                    paddingTop: '56.25%',
                },
                '&:after': {
                    content: '""',
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    transition: 'all 300ms',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: 0,
                    zIndex: 1,
                    background: 'black',
                    opacity: 0.3,
                    pointerEvents: 'none',
                },
                '&:hover:after': {
                    opacity: 0.5,
                },
                ...props.sx
            }}
        >
            <ImageLazyLoading
                sx={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    pointerEvents: 'none',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: 0,
                    zIndex: 1,
                }}
                src={props.image}
            />
            <Box
                sx={{
                    zIndex: 3,
                    maxWidth: 572,
                    padding: 4,
                    color: 'white',
                }}
            >
                <Typography
                    variant='overline'
                    sx={{
                        fontSize: 16,
                        letterSpacing: '1.5px',
                        fontWeight: 400,
                        color: 'white',
                    }}
                >{props.subTitle}</Typography>
                <Typography
                    sx={{
                        fontSize: 28,
                        fontWeight: 400,
                        lineHeight: '38px',
                        color: 'white',
                        mt: 2,
                        mb: 3,
                    }}
                >{props.title}</Typography>
            </Box>
        </Box>

    )
}

export default BannerImage