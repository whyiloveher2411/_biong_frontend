import { Box, Button, IconButton, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import MoreButton from 'components/atoms/MoreButton';
import { dateTimeFormat } from 'helpers/date';
import { cssMaxLine } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import useReaction from 'hook/useReaction';
import useReportPostType from 'hook/useReportPostType';
import React from 'react';
import { Link } from 'react-router-dom';
import { ExploreProps, REPORT_TYPE } from 'services/exploreService';

export default function ExploreSingle({
    explore: exploreProps
}: {
    explore?: ExploreProps
}) {

    const [explore, setExplore] = React.useState<ExploreProps | undefined>(undefined);

    const reactionHook = useReaction({
        post: {
            ...(explore ? explore : { id: 0 }),
            type: 'blog_post'
        },
        reactionPostType: 'blog_post_reaction',
        keyReactionCurrent: 'my_reaction_type',
        reactionTypes: ['like', 'love', 'care', 'haha', 'wow', 'sad', 'angry'],
        afterReaction: (result) => {
            setExplore(prev => (prev ? {
                ...prev,
                count_like: result.summary?.like?.count ?? 0,
                count_love: result.summary?.love?.count ?? 0,
                count_care: result.summary?.care?.count ?? 0,
                count_haha: result.summary?.haha?.count ?? 0,
                count_wow: result.summary?.wow?.count ?? 0,
                count_sad: result.summary?.sad?.count ?? 0,
                count_angry: result.summary?.angry?.count ?? 0,
                my_reaction_type: result.my_reaction,
            } : prev));
        },
    });

    const dialogReport = useReportPostType({
        dataProps: {
            post: explore?.id ?? 0,
            type: REPORT_TYPE,
        },
        reasonList: {
            'Inappropriate Course Content': {
                title: __('Nội dung khóa học không phù hợp')
            },
            'Inappropriate Behavior': {
                title: __('Hành vi không phù hợp')
            },
            'Policy Violation': {
                title: __('Vi phạm Chính sách')
            },
            'Spammy Content': {
                title: __('Nội dung spam')
            },
        },
    });

    React.useEffect(() => {
        setExplore(exploreProps);
    }, [exploreProps]);

    if (!explore) {
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
                    <CardHeader
                        titleTypographyProps={{
                            variant: 'h5',
                        }}
                        avatar={
                            <Link to={'/user/' + explore.account_author_detail?.slug + (new Date()).getTime()}>
                                <ImageLazyLoading
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                    }}
                                    src={getImageUrl(explore.account_author_detail?.avatar, '/images/user-default.svg')}
                                    name={explore.account_author_detail?.title}
                                />
                            </Link>
                        }
                        action={
                            <MoreButton
                                actions={[
                                    {
                                        report: {
                                            title: 'Báo cáo bài viết',
                                            action: () => {
                                                dialogReport.open();
                                            },
                                            icon: 'OutlinedFlagRounded'
                                        },
                                    }
                                ]}
                            />
                        }
                        title={<Link to={'/user/' + explore.account_author_detail?.slug}>{explore.account_author_detail?.title}</Link>}
                        subheader={dateTimeFormat(explore.updated_at)}
                    />
                    <Link to={'/explore/' + explore.slug} >
                        <ImageLazyLoading ratio="16/9" alt="gallery image" src={getImageUrl(explore.featured_image)} />
                    </Link>
                    <Link to={'/explore/' + explore.slug} >
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
                                {explore.title}
                            </Typography>
                            <Typography
                                color="text.secondary"
                                sx={{
                                    ...cssMaxLine(3),
                                    maxHeight: 74,
                                    lineHeight: '24px',
                                }}
                            >
                                {explore.description}
                            </Typography>
                        </Box>
                    </Link>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pt: 1.5,
                            pb: 1.5,
                            height: 52,
                            pr: 3,
                            pl: 3,
                        }}
                    >
                        <Box>
                            {reactionHook.componentSummary}
                        </Box>
                        <Typography
                            component={Link}
                            to={'/explore/' + explore.slug}
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline',
                                }
                            }}
                        >{explore.comment_count ? explore.comment_count : 0} bình luận</Typography>
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            pt: 0.5,
                            pb: 0.5,
                            pr: 3,
                            pl: 3,
                        }}
                    >
                        {reactionHook.toolTip}

                        <IconButton
                            component={Link}
                            to={'/explore/' + explore.slug}
                            color='primary'
                        >
                            <Icon icon="ArrowForwardRounded" />
                        </IconButton>


                    </Box>
                </Box>
            </Card >
            {dialogReport.component}
        </>
    );
}