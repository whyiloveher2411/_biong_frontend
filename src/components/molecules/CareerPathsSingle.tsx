import { LoadingButton } from '@mui/lab';
import { Box, Button, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { cssMaxLine } from 'helpers/dom';
import { getImageUrl } from 'helpers/image';
import { nFormatter } from 'helpers/number';
import useReaction from 'hook/useReaction';
import React from 'react';
import { Link } from 'react-router-dom';
import { ICareerPaths } from 'services/careerPathsService';

export default function CareerPathsSingle({
    careerPaths: careerPathsProps
}: {
    careerPaths?: ICareerPaths
}) {

    const [careerPaths, setCareerPaths] = React.useState<ICareerPaths | undefined>(undefined);

    const reactionHook = useReaction({
        post: {
            ...(careerPaths ? careerPaths : { id: 0 }),
            type: 'e_career_path'
        },
        reactionPostType: 'e_career_path_save',
        keyReactionCurrent: 'my_reaction_type',
        reactionTypes: ['save'],
        afterReaction: (result) => {
            setCareerPaths(prev => (prev ? {
                ...prev,
                count_save: result.summary?.save?.count ?? 0,
                my_reaction_type: result.my_reaction,
            } : prev));
        },
    });


    React.useEffect(() => {
        setCareerPaths(careerPathsProps);
    }, [careerPathsProps]);

    if (!careerPaths) {
        return (
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Box>
                    <CardHeader
                        titleTypographyProps={{
                            variant: 'h5',
                        }}
                        avatar={
                            <Skeleton variant='circular' sx={{ width: 48, height: 48 }} />
                        }
                        title={<Skeleton />}
                        subheader={<Skeleton />}
                    />
                    <Skeleton
                        sx={{
                            height: 194,
                            width: 1
                        }}
                        variant="rectangular"
                    />
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <Skeleton variant='rectangular'>
                            <Typography
                                variant='h4'
                                component='h2'
                                sx={{
                                    ...cssMaxLine(2)
                                }}
                            >
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                            </Typography>
                        </Skeleton>
                        <Skeleton variant='rectangular' >
                            <Typography
                                color="text.secondary"
                                sx={{
                                    ...cssMaxLine(3),
                                    maxHeight: 64,
                                    lineHeight: '24px',
                                }}
                            >
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores, corrupti voluptates? Incidunt similique dignissimos sapiente ipsum praesentium, omnis libero harum illo ipsa eius voluptatem deserunt, voluptate architecto enim assumenda numquam?
                            </Typography>
                        </Skeleton>
                    </CardContent>
                </Box>
                <CardActions disableSpacing>
                    <Skeleton sx={{ marginLeft: 'auto' }} variant='rectangular'>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                            }}
                        >
                        </Box>
                    </Skeleton>
                    <Skeleton sx={{ marginLeft: 'auto' }} variant='rectangular'>
                        <Button color="inherit" variant="text" startIcon={<Icon icon="ThumbUpOutlined" />}>
                            12,34
                        </Button>
                    </Skeleton>
                </CardActions>
            </Card>
        )
    }

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover, &:focus, &:active, &:visited': {
                        borderColor: 'primary.main',
                        // transform: 'scale(1.02)',
                        boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                    },
                    '&:focus, &:active, &:visited': {
                        borderColor: 'primary.main',
                        // transform: 'scale(1.02)',
                    }
                }}
            >
                <Box>
                    <Link to={'/career-path/' + careerPaths.slug} >
                        <ImageLazyLoading ratio="16/9" alt="gallery image" src={getImageUrl(careerPaths.featured_image)} />
                    </Link>
                    <Link to={'/career-path/' + careerPaths.slug} >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                p: 3,
                                pb: 0,
                            }}
                        >
                            <Typography
                                variant='h4'
                                component='h2'
                                sx={{
                                    ...cssMaxLine(2)
                                }}
                            >
                                {careerPaths.title}
                            </Typography>
                            <Typography
                                color="text.secondary"
                                sx={{
                                    ...cssMaxLine(3),
                                    maxHeight: 74,
                                    lineHeight: '24px',
                                }}
                            >
                                {careerPaths.short_description}
                            </Typography>
                        </Box>
                    </Link>
                </Box>
                <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    <LoadingButton
                        loading={reactionHook.isLoading}
                        onClick={() => {
                            if (careerPaths.my_reaction_type === 'save') {
                                reactionHook.handleReactionClick(careerPaths.id, '');
                            } else {
                                reactionHook.handleReactionClick(careerPaths.id, 'save');
                            }
                        }}
                        color={careerPaths.my_reaction_type === 'save' ? "primary" : 'inherit'}
                        startIcon={careerPaths.my_reaction_type === 'save' ? <Icon icon="Bookmark" /> : <Icon icon="BookmarkBorder" />}>
                        Lưu
                    </LoadingButton>
                    {
                        reactionHook.totalReaction ?
                            <Typography>{nFormatter(reactionHook.totalReaction + (Number(careerPaths.count_save_fake) ? Number(careerPaths.count_save_fake) : 0))} người đã lưu</Typography>
                            :
                            <></>
                    }
                </CardActions>
            </Card >
        </>
    );
}