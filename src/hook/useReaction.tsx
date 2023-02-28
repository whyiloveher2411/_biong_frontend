import { Avatar, AvatarGroup, Badge, Button, ButtonProps, Skeleton, Theme, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import Box from 'components/atoms/Box';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Tooltip from 'components/atoms/Tooltip';
import Dialog from 'components/molecules/Dialog';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import React from 'react';
import { Link } from 'react-router-dom';
import reactionService, { ReactionDetailProps, ReactionSummaryProps } from 'services/reactionService';
import { UserState, useUser } from 'store/user/user.reducers';
import usePaginate from './usePaginate';
import { PaginationProps } from 'components/atoms/TablePagination';
import { nFormatter } from 'helpers/number';

function useReaction<T extends ReactionType>({
    post, reactionPostType, reactionTypes, afterReaction, keyReactionCurrent, propsTootipButton, disableDetailReaction
}: {
    post: {
        [key: string]: ANY,
        id: ID,
        type: string,
    },
    reactionPostType: string,
    reactionTypes: Array<T>,
    afterReaction: (result: {
        summary: {
            [key: string]: ReactionSummaryProps;
        } | null,
        my_reaction: string,
    }) => void,
    keyReactionCurrent: string,
    propsTootipButton?: ButtonProps,
    disableDetailReaction?: boolean,
}) {

    const user = useUser();

    const [openReactionDetail, setOpenReactionDetail] = React.useState(false);

    const [isLoading, setLoading] = React.useState(false);

    const handleReactionClick = (postID: ID, type: string) => {
        if (user._state === UserState.identify) {

            setLoading(true);
            (async () => {
                const result: {
                    summary: { [key: string]: ReactionSummaryProps } | null,
                    my_reaction: string,
                } = await reactionService.post({
                    post: postID,
                    reaction: type,
                    type: reactionPostType,
                    user_id: user.id,
                });

                if (result && result.summary) {
                    //
                    afterReaction(result);
                }

                setLoading(false);

            })();
        } else {
            window.showMessage('Vui lòng đăng nhập trước khi thực hiện hành động này', 'warning');
        }
    }

    const totalReaction = reactionTypes.reduce((total, name) => total + (post['count_' + name] ? post['count_' + name] : 0), 0);

    return ({
        totalReaction: totalReaction,
        handleReactionClick: handleReactionClick,
        isLoading: isLoading,
        toolTip: <>
            <TooltipReaction
                leaveDelay={50}
                title={
                    <Box
                        sx={{
                            display: 'flex',
                            padding: '5px 0',
                            '& .MuiBox-root': {
                                overflow: 'unset',
                            },
                            '& .reactionItem': {
                                transition: '0.3s all',
                                cursor: 'pointer',
                                margin: '0 5px',
                                width: '39px !important',
                                height: '39px !important',
                                zIndex: 1,
                            },
                            '& .reactionItem:hover': {
                                transform: 'perspective(1px) translate(0, -3px) scale(1.3, 1.3)',
                                transition: '0.3s all',
                            }
                        }}
                    >
                        {
                            reactionTypes.map(key => (
                                <Tooltip
                                    key={key}
                                    title={__(reactionList[key].title)}
                                    onClick={() => handleReactionClick(post.id, key)}>
                                    <Box>
                                        <ImageLazyLoading className='reactionItem' sx={{ transition: '0.3s all', }} src={reactionList[key].image} />
                                    </Box>
                                </Tooltip>
                            ))
                        }

                    </Box>
                }
                disableInteractive={false}
            // sx={{ background: 'red' }}
            >
                {
                    post[keyReactionCurrent] && reactionList[post[keyReactionCurrent] as keyof typeof reactionList] ?
                        <Button
                            sx={{
                                textTransform: 'none',
                                fontSize: 16,
                                color: reactionList[post[keyReactionCurrent] as keyof typeof reactionList].color
                            }}
                            color="inherit"
                            startIcon={
                                <Avatar
                                    alt={reactionList[post[keyReactionCurrent] as keyof typeof reactionList].title}
                                    src={reactionList[post[keyReactionCurrent] as keyof typeof reactionList].image}
                                    sx={{ width: 18, height: 18 }}
                                />
                            }
                            onClick={() => handleReactionClick(post.id, '')}
                            {...propsTootipButton}
                        >
                            {reactionList[post[keyReactionCurrent] as keyof typeof reactionList].title}
                        </Button>
                        :
                        <Button
                            sx={{ textTransform: 'none', fontSize: 16, }}
                            color="inherit"
                            startIcon={<Icon icon="ThumbUpOffAltOutlined" />}
                            onClick={() => handleReactionClick(post.id, reactionTypes[0])}
                            {...propsTootipButton}
                        >
                            {reactionList[reactionTypes[0]].title}
                        </Button>
                }
            </TooltipReaction>
            {
                openReactionDetail &&
                <ShowReactionDetail
                    onClose={() => setOpenReactionDetail(false)}
                    post={post}
                    reactionTypes={reactionTypes}
                />
            }
        </>
        ,
        componentSummary: totalReaction ?
            <Tooltip title={
                <>
                    {
                        reactionTypes.map((reaction) => (
                            reactionList[reaction] && post['count_' + reaction] ?
                                <Box key={reaction} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Avatar
                                        alt={reactionList[reaction].title}
                                        src={reactionList[reaction].image}
                                        sx={{ width: 18, height: 18 }}
                                    />
                                    {post['count_' + reaction]}
                                </Box>
                                :
                                <React.Fragment key={reaction} />
                        ))
                    }
                </>
            }>
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.2,
                        bottom: '-11px',
                        padding: '2px',
                        borderRadius: 5,
                        fontSize: 15,
                        color: 'text.secondary',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        if (!disableDetailReaction) {
                            setOpenReactionDetail(true)
                        }
                    }}
                >
                    <AvatarGroup sx={{ '& .MuiAvatar-root': { borderColor: 'transparent' } }}>
                        {
                            reactionTypes.filter(reaction => reactionList[reaction] && post['count_' + reaction]).map((reaction) => (
                                <Avatar
                                    key={reaction}
                                    alt={reactionList[reaction].title}
                                    src={reactionList[reaction].image}
                                    sx={{ width: 18, height: 18 }} />
                            ))
                        }
                    </AvatarGroup>
                    {nFormatter(totalReaction)}
                </Box>
            </Tooltip>
            :
            null
    });
}

export default useReaction



const TooltipReaction = withStyles((theme: Theme) => ({
    tooltip: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        margin: 5,
        minWidth: 250,
        maxWidth: 450,
        fontSize: 13,
        borderRadius: 50,
        boxShadow: '0 4px 5px 0 rgb(0 0 0 / 14%), 0 1px 10px 0 rgb(0 0 0 / 12%), 0 2px 4px -1px rgb(0 0 0 / 20%)',
        fontWeight: 400,
        lineHeight: '22px',
        '& .MuiTooltip-arrow': {
            color: theme.palette.background.paper,
        }
    }
}))(Tooltip);


export function ShowReactionDetail({
    post, onClose, reactionTypes
}: {
    post: {
        [key: string]: ANY,
        type: string,
        id: ID,
    },
    onClose: () => void,
    reactionTypes: Array<ReactionType>,
    // summary: { [K in ReactionType]: number }
}) {

    const [reactions, setRections] = React.useState<PaginationProps<ReactionDetailProps> | null>(null);

    const [filter, setFilter] = React.useState('all');

    const paginate = usePaginate({
        name: post.type + '_reaction' + post.id,
        data: { current_page: 0, per_page: 25 },
        enableLoadFirst: false,
        isChangeUrl: false,
        template: 'page',
        onChange: async (data) => {
            const dataApi = await reactionService.getReaction({
                ...data,
                postId: post.id,
                postType: post.type,
                reactionType: post.type + '_reaction',
                filter: filter,
            });

            setRections(dataApi);
        },
        pagination: reactions,
    });

    React.useEffect(() => {
        paginate.set({
            current_page: 0,
            per_page: 25,
            loadData: true,
        });
    }, [filter]);

    const buttonsTitle = reactionTypes.filter(key => post['count_' + key]).map(key => (
        <Button
            sx={{
                borderRadius: 0,
                borderBottom: '2px solid',
                borderColor: filter === key ? 'primary.main' : 'transparent',
            }}
            onClick={() => setFilter(key)} key={key}
            startIcon={
                <Icon
                    icon={{
                        custom: '<image style="width: 100%;" href="' + reactionList[key as keyof typeof reactionList].image + '" />'
                    }}
                />
            }>
            {post['count_' + key]}
        </Button>
    ));

    if (buttonsTitle.length > 1) {
        buttonsTitle.unshift(
            <Button sx={{ borderRadius: 0, textTransform: 'unset', borderBottom: '2px solid', borderColor: filter === 'all' ? 'primary.main' : 'transparent', }} onClick={() => setFilter('all')} key='all'>Tất cả</Button>
        )
    }

    return <Dialog
        open={true}
        title={buttonsTitle}
        onClose={onClose}
    >
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: '50vh',
            }}
            className="custom_scroll custom"
        >
            {
                reactions && !paginate.isLoading ?
                    reactions.data.filter(item => filter === 'all' || item.reaction_type === filter).map((item) => (
                        <Box
                            key={item.id}
                            sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                            }}
                        >
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <Icon sx={{ width: 20, height: 20 }} icon={{ custom: '<image style="width: 100%;" href="' + reactionList[item.reaction_type as keyof typeof reactionList]?.image + '" />' }} />
                                }
                            >
                                <Link
                                    to={'/user/' + item.account.slug}
                                >
                                    <ImageLazyLoading src={getImageUrl(item.account?.avatar, '/images/user-default.svg')} sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                    }} />
                                </Link>
                            </Badge>
                            <Typography
                                component={Link}
                                variant='h5'
                                to={'/user/' + item.account.slug}
                                sx={{
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    }
                                }}
                            >
                                {item.account.full_name}
                            </Typography>
                        </Box>
                    ))
                    :
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                            }}
                        >
                            <Skeleton variant='circular'>
                                <ImageLazyLoading src={'/images/user-default.svg'} sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                }} />
                            </Skeleton>
                            <Skeleton sx={{ width: '100%', maxWidth: 'unset', }}>
                                <Typography
                                    variant='h5'
                                    sx={{
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        }
                                    }}
                                >
                                    Dang Thuyen Quan
                                </Typography>
                            </Skeleton>
                        </Box>
                    ))
            }
            <Box sx={{ mt: 'auto' }}>
                {paginate.component}
            </Box>
        </Box>
    </Dialog >
}



export const reactionFB = [
    'like', 'love', 'care', 'haha', 'wow', 'sad', 'angry', 'save', 'useful', 'not_useful'
] as const;

type ReactionType = (typeof reactionFB)[number];

const reactionList: {
    [K in ReactionType]: IReactionProps
} = {
    save: {
        key: 'save',
        title: __('Lưu'),
        color: 'rgb(32, 120, 244)',
        image: '/images/like2.gif',
        count_column: 'count_save',
    },
    like: {
        key: 'like',
        title: __('Thích'),
        color: 'rgb(32, 120, 244)',
        image: '/images/like2.gif',
        count_column: 'count_like',
    },
    love: {
        key: 'love',
        title: __('Yêu thích'),
        color: 'rgb(243, 62, 88)',
        image: '/images/love2.gif',
        count_column: 'count_love',
    },
    care: {
        key: 'care',
        title: __('Thương thương'),
        color: 'rgb(247, 177, 37)',
        image: '/images/care2.gif',
        count_column: 'count_care',
    },
    haha: {
        key: 'haha',
        title: __('Haha'),
        color: 'rgb(247, 177, 37)',
        image: '/images/haha2.gif',
        count_column: 'count_haha',
    },
    wow: {
        key: 'wow',
        title: __('Wow'),
        color: 'rgb(247, 177, 37)',
        image: '/images/wow2.gif',
        count_column: 'count_wow',
    },
    sad: {
        key: 'sad',
        title: __('Buồn'),
        color: 'rgb(247, 177, 37)',
        image: '/images/sad2.gif',
        count_column: 'count_sad',
    },
    angry: {
        key: 'angry',
        title: __('Phẫn nộ'),
        color: 'rgb(233, 113, 15)',
        image: '/images/angry2.gif',
        count_column: 'count_angry',
    },
    useful: {
        key: 'useful',
        title: __('Câu trả lời này rất hữu ích'),
        count_column: 'count_useful',
        color: 'rgb(32, 120, 244)',
        image: '/images/like2.gif',
    },
    not_useful: {
        key: 'not_useful',
        title: __('Câu trả lời này không hữu ích'),
        count_column: 'count_not_useful',
        color: 'rgb(233, 113, 15)',
        image: '/images/angry2.gif',
    },
};

export interface IReactionProps {
    key: string,
    title: string,
    color: string,
    image: string,
    count_column: string,
}

