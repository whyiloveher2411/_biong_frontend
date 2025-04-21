import { Box, Button, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { dateTimefromNow } from 'helpers/date';
import { cssMaxLine } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
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

    // const reactionHook = useReaction({
    //     post: {
    //         ...(explore ? explore : { id: 0 }),
    //         type: 'blog_post'
    //     },
    //     reactionPostType: 'blog_post_reaction',
    //     keyReactionCurrent: 'my_reaction_type',
    //     reactionTypes: ['like', 'love', 'care', 'haha', 'wow', 'sad', 'angry'],
    //     afterReaction: (result) => {
    //         setExplore(prev => (prev ? {
    //             ...prev,
    //             count_like: result.summary?.like?.count ?? 0,
    //             count_love: result.summary?.love?.count ?? 0,
    //             count_care: result.summary?.care?.count ?? 0,
    //             count_haha: result.summary?.haha?.count ?? 0,
    //             count_wow: result.summary?.wow?.count ?? 0,
    //             count_sad: result.summary?.sad?.count ?? 0,
    //             count_angry: result.summary?.angry?.count ?? 0,
    //             my_reaction_type: result.my_reaction,
    //         } : prev));
    //     },
    // });

    // const reactionSave = useReactionSavePost(explore ?? null, (result) => {
    //     setExplore(prev => (prev ? {
    //         ...prev,
    //         count_save: result.summary?.save?.count ?? 0,
    //         my_save: result.my_reaction,
    //     } : prev));
    // });

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
                            height: 209,
                            width: 1
                        }}
                        variant="rectangular"
                    />
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            paddingBottom: '0 !important',
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
                                    maxHeight: 72,
                                    lineHeight: '24px',
                                }}
                            >
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores, corrupti voluptates? Incidunt similique dignissimos sapiente ipsum praesentium, omnis libero harum illo ipsa eius voluptatem deserunt, voluptate architecto enim assumenda numquam?
                            </Typography>
                        </Skeleton>
                    </CardContent>
                </Box>

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
                    <Skeleton sx={{ width: 50 }} variant='rectangular' />

                    <Skeleton sx={{ marginLeft: 'auto' }} variant='rectangular'>
                        <Typography>123 bình luận</Typography>
                    </Skeleton>
                </Box>
                <Divider />

                <CardActions disableSpacing sx={{ paddingTop: '9px', paddingBottom: '8px' }}>
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
                        <Button size='small' color="inherit" variant="text" startIcon={<Icon icon="ThumbUpOutlined" />}>
                            12,34567890
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
                    position: 'relative',
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
                {
                    explore.category_data?.id ?
                        <>
                            <Button
                                variant='contained'
                                color='primary'
                                size='small'
                                sx={{
                                    position: 'absolute',
                                    top: 20,
                                    left: 20,
                                    zIndex: 101,
                                    fontSize: 12,
                                    textTransform: 'none',
                                }}
                            >
                                {explore.category_data.title}
                            </Button>
                        </>
                        : null
                }
                {/* <CardHeader
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
                                    save: {
                                        title: explore.my_save === 'save' ? 'Bỏ lưu' : 'Lưu bài viết',
                                        description: 'Thêm vào danh sách cá nhân',
                                        disabled: reactionSave.isLoading,
                                        action: () => {
                                            if (explore.my_save === 'save') {
                                                reactionSave.handleReactionClick(explore.id, '');
                                            } else {
                                                reactionSave.handleReactionClick(explore.id, 'save');
                                            }
                                        },
                                        iconComponent: explore.my_save === 'save' ? <Icon sx={{ color: 'warning.main' }} icon="Bookmark" /> : <Icon icon="BookmarkBorder" />
                                    },
                                },
                                {
                                    report: {
                                        title: 'Báo cáo bài viết',
                                        description: 'Tôi lo ngại bài viết này',
                                        action: () => {
                                            dialogReport.open();
                                        },
                                        icon: 'OutlinedFlagRounded'
                                    },
                                }
                            ]}
                        />
                    }
                    title={<Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        <Link to={'/user/' + explore.account_author_detail?.slug}>{explore.account_author_detail?.title}</Link>
                        {
                            explore.account_author_detail?.is_verified ?
                                <TooltipVerifiedAccount iconSize={20} />
                                : null
                        }
                    </Box>}
                    subheader={
                        <>
                            {
                                explore.category_data?.id ?
                                    <>
                                        <Link to={'/explore/tag/' + explore.category_data.slug}>
                                            {explore.category_data.title}
                                        </Link>
                                        &nbsp;&nbsp;·&nbsp;&nbsp;
                                    </>
                                    : null
                            }
                            {dateTimefromNow(explore.public_date ? explore.public_date : explore.created_at)}
                        </>
                    }
                /> */}
                <Link to={'/explore/' + explore.slug} >
                    <ImageLazyLoading ratio="40/21" alt="gallery image" src={getImageUrl(explore.featured_image)} />
                </Link>
                <Box
                    component={Link}
                    to={'/explore/' + explore.slug}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        p: 3,
                        flex: 1,
                    }}
                >
                    <Typography
                        variant='h4'
                        component='h2'
                        sx={{
                            ...cssMaxLine(2),
                        }}
                    >
                        {explore.title}
                    </Typography>
                    <Typography
                        color="text.secondary"
                        sx={{
                            ...cssMaxLine(3),
                            height: 72,
                            lineHeight: '24px',
                        }}
                    >
                        {explore.description}
                    </Typography>
                </Box>
                {/* <Box
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
                </Box> */}
                <Divider />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        pt: 2,
                        pb: 3,
                        pr: 3,
                        pl: 3,
                    }}
                >
                    <Box
                        component={Link}
                        to={'/user/' + explore.account_author_detail?.slug + '?time=' + (new Date()).getTime()}
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <ImageLazyLoading
                            sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                            }}
                            src={getImageUrl(explore.account_author_detail?.avatar, '/images/user-default.svg')}
                            name={explore.account_author_detail?.title}
                        />
                        <Typography>{explore.account_author_detail?.title}</Typography>
                    </Box>
                    <Typography>{dateTimefromNow(explore.public_date ? explore.public_date : explore.created_at)}</Typography>
                </Box>
            </Card >
            {dialogReport.component}
        </>
    );
}