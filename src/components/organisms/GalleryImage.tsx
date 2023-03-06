import { Box, IconButton } from '@mui/material'
import Icon from 'components/atoms/Icon'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import DrawerCustom from 'components/molecules/DrawerCustom'
import React from 'react'

function GalleryImage({ open, onClose, images, imageDefault }: {
    open: boolean,
    onClose: () => void,
    images: string[],
    imageDefault: string | null,
}) {
    const imageCurrent = React.useState(0);

    React.useEffect(() => {
        if (imageDefault) {
            const findIndex = images.findIndex(item => item === imageDefault) ?? 0;
            imageCurrent[1](findIndex);
        }
    }, [imageDefault])

    return (
        <DrawerCustom
            open={open}
            onClose={onClose}
            width={'3020px'}
            transitionDuration={0}
            restDialogContent={{
                sx: {
                    height: '100vh',
                    pt: 0,
                    pb: 0,
                    overflow: 'hidden',
                    backgroundColor: '#242526',
                }
            }}
            height={'100%'}

        >
            <ImageLazyLoading
                src={images[imageCurrent[0]]}
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    filter: 'blur(20px)',
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                }}
            />
            <IconButton
                size='large'
                sx={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    position: 'absolute',
                    left: 10,
                    top: 10,
                    zIndex: 5,
                    '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                    }
                }}
                onClick={onClose}
            >
                <Icon sx={{ color: 'white' }} icon="ClearRounded" />
            </IconButton>

            <Box
                className="gallery-back"
                sx={{
                    position: 'absolute',
                    left: 0,
                    zIndex: 4,
                    top: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pl: 2,
                    pr: 2,
                    background: 'rgba(0,0,0,0.1)',
                    opacity: 0.4,
                    cursor: 'pointer',
                    '&:hover': {
                        opacity: 0.7,
                    }
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    imageCurrent[1](prev => {
                        if (prev > 0) {
                            return --prev;
                        }
                        if (prev === 0) {
                            return images.length - 1;
                        }
                        return prev;
                    })
                }}
            >
                <IconButton
                    size='large'
                    sx={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 4,
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                        }
                    }}
                >
                    <Icon sx={{ color: 'white' }} icon="ArrowBackIosNewRounded" />
                </IconButton>
            </Box>

            <Box
                className="gallery-next"
                sx={{
                    position: 'absolute',
                    right: 0,
                    zIndex: 4,
                    top: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pl: 2,
                    pr: 2,
                    background: 'rgba(0,0,0,0.1)',
                    opacity: 0.4,
                    cursor: 'pointer',
                    '&:hover': {
                        opacity: 0.7,
                    }
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    imageCurrent[1](prev => {
                        if (prev < (images.length - 1)) {
                            return ++prev;
                        }
                        if (prev === (images.length - 1)) {
                            return 0;
                        }
                        return prev;
                    })
                }}
            >
                <IconButton
                    size='large'
                    sx={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 4,
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                        }
                    }}
                >
                    <Icon sx={{ color: 'white' }} icon="ArrowForwardIosRounded" />
                </IconButton>
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    filter: 'blur(10px)',
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    background: 'black',
                    opacity: 0.5,
                }}
            />
            <Box
                sx={{
                    width: '100%',
                    height: '100vh',
                    position: 'relative',
                    zIndex: 3,
                    display: 'flex',
                    gap: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    '& .image-detail': {
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        '& .wrapper': {
                            height: 'auto',
                        },
                    }
                }}
                onClick={onClose}
            >
                <ImageLazyLoading
                    src={images[imageCurrent[0]]}
                    className="image-detail"
                    sx={{
                        height: 'auto',
                        maxHeight: 'calc(100vh - 48px)',
                        maxWidth: '90vw',
                        margin: '0 auto',
                        objectFit: 'contain',
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1.5,
                        pb: 1
                    }}
                >
                    {
                        images.map((item, index) => (
                            <ImageLazyLoading
                                key={index}
                                src={item}
                                onClick={(e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
                                    e.stopPropagation();
                                    imageCurrent[1](index);
                                }}
                                sx={{
                                    width: 36,
                                    opacity: index === imageCurrent[0] ? 1 : 0.6,
                                    cursor: 'pointer',
                                    height: 36,
                                    borderRadius: '6px',
                                    '&:hover': {
                                        opacity: 1,
                                    }
                                }}
                            />
                        ))
                    }
                </Box>
            </Box>

        </DrawerCustom>
    )
}

export default GalleryImage