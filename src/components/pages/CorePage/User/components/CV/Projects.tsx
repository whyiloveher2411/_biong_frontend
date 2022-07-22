import { Box, Card, CardContent, IconButton, Link, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import SwiperSlideImage from 'components/atoms/SwiperSlideImage';
import { cssMaxLine } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import React from 'react';
import { UserCV } from 'services/elearningService/@type';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import EditProject from './edit/EditProject';


function Projects({ cv, onReloadCV, editAble }: { cv: UserCV | null, editAble: boolean, onReloadCV: () => Promise<void> }) {

    const [isEditProject, setIsEditProject] = React.useState(false);

    if (isEditProject && editAble) {
        return <EditProject onBack={() => setIsEditProject(false)} onReloadCV={onReloadCV} />
    }

    if (cv?.projects) {
        return (
            <Card
                sx={{ overflow: 'hidden', width: '100%' }}
            >
                <CardContent
                    sx={{
                        display: 'flex',
                        gap: 2,
                        flexDirection: 'column',
                        position: 'relative',
                    }}
                >
                    {
                        editAble &&
                        <>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                }}
                                onClick={() => {
                                    setIsEditProject(true);
                                }}
                            >
                                <Icon icon="EditOutlined" />
                            </IconButton>
                        </>
                    }
                    <Typography variant='overline' sx={{ fontSize: 15 }} color="text.secondary">{__('Featured projects')}</Typography>
                    <SwiperSlideImage
                        navigation={false}
                        items={cv.projects}
                        renderItem={(project) => <Box
                            sx={{
                                display: 'flex',
                                gap: 4,
                            }}
                        >
                            <ImageLazyLoading src={getImageUrl(project.featured_image)} sx={{ width: '55%', height: '100%', borderRadius: 2 }} />
                            <Box
                                sx={{ flex: 1, display: 'flex', gap: 1, flexDirection: 'column', justifyContent: 'center', }}
                            >
                                <Typography variant='overline'>{project.role}</Typography>
                                <Typography variant='h3'>{project.title}</Typography>
                                <Typography
                                    sx={{
                                        ...cssMaxLine(5),
                                        lineHeight: '28px',
                                        fontSize: 16,
                                    }}
                                >{project.description}</Typography>
                                {
                                    Boolean(project.website) &&
                                    <Typography><strong>{__('Website')}:</strong> <Link target={'_blank'} href={project.website}>{project.website}</Link></Typography>
                                }
                            </Box>
                        </Box>}
                    />
                </CardContent>
            </Card>
        )
    }

    return null;
}

export default Projects