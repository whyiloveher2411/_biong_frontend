import { Box, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import MoreButton from 'components/atoms/MoreButton';
import { useReactionSavePost } from 'components/pages/CorePage/Explore/ExploreDetail';
import { convertHMS, dateTimefromNow } from 'helpers/date';
import { cssMaxLine } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import useReaction from 'hook/useReaction';
import useReportPostType from 'hook/useReportPostType';
import React from 'react';
import { Link } from 'react-router-dom';
import { ExploreProps, REPORT_TYPE } from 'services/exploreService';
import TooltipVerifiedAccount from './TooltipVerifiedAccount';

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

    const reactionSave = useReactionSavePost(explore ?? null, (result) => {
        setExplore(prev => (prev ? {
            ...prev,
            count_save: result.summary?.save?.count ?? 0,
            my_save: result.my_reaction,
        } : prev));
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
                <Box
                    sx={{
                        display: 'flex',
                    }}
                >
                    <Skeleton variant='rectangular' width={240} sx={{ height: '168px' }} />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            position: 'relative',
                            flex: 1,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                px: 3,
                                py: 2,
                                flex: 1,
                            }}
                        >
                            <Skeleton variant='text' />
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    py: 1,
                                }}
                            >
                                <Skeleton variant='circular' width={24} height={24} />
                                <Skeleton variant='text' width={100} />
                                <Skeleton variant='text' width={100} />
                                <Skeleton variant='text' width={100} />

                            </Box>

                            <Skeleton variant='text' />
                            <Skeleton variant='text' />

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 1,
                                    }}
                                >
                                    <Skeleton variant='text' width={100} />
                                </Box>
                                <Skeleton variant='text' width={100} />
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </Card >
        )
    }

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
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
                <Box
                    sx={{
                        display: 'flex',
                    }}
                >
                    <Link to={'/explore/' + explore.slug} >
                        <Box
                            sx={{
                                position: 'relative',
                                width: '240px',
                                height: '100%'
                            }}
                        >
                            <ImageLazyLoading sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} alt="gallery image" src={getImageUrl(explore.featured_image)} />
                        </Box>
                    </Link>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                            }}
                        >
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
                        </Box>
                        <Box
                            component={Link}
                            to={'/explore/' + explore.slug}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                px: 3,
                                py: 2,
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
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    py: 1,
                                }}
                            >
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Link to={'/user/' + explore.account_author_detail?.slug + (new Date()).getTime()}>
                                        <ImageLazyLoading
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                            }}
                                            src={getImageUrl(explore.account_author_detail?.avatar, '/images/user-default.svg')}
                                            name={explore.account_author_detail?.title}
                                        />
                                    </Link>
                                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                        <Typography variant='body2' component={Link} to={'/user/' + explore.account_author_detail?.slug}>{explore.account_author_detail?.title}</Typography>
                                        {
                                            explore.account_author_detail?.is_verified ?
                                                <TooltipVerifiedAccount iconSize={20} />
                                                : null
                                        }
                                    </Box>
                                </Box>
                                <Typography variant='body2'>
                                    {
                                        explore.read_time ?
                                            convertHMS(explore.read_time * 60, true) + ' đọc'
                                            :
                                            ''
                                    }
                                </Typography>

                                <Typography variant='body2'>
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
                                </Typography>

                            </Box>
                            <Typography
                                color="text.secondary"
                                sx={{
                                    ...cssMaxLine(3),
                                    lineHeight: '24px',
                                }}
                            >
                                {explore.description}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 1,
                                    }}
                                >

                                    <Box>
                                        {reactionHook.componentSummary}
                                    </Box>
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
                        </Box>

                    </Box>
                </Box>
            </Card >
            {dialogReport.component}
        </>
    );
}