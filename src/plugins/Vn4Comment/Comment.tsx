import { LoadingButton } from '@mui/lab';
import { Avatar, AvatarGroup, Badge, Box, Button, IconButton, Paper, Theme, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import CodeBlock from 'components/atoms/CodeBlock';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import MoreButton from 'components/atoms/MoreButton';
import Tooltip from 'components/atoms/Tooltip';
import FieldForm from 'components/atoms/fields/FieldForm';
import TooltipVerifiedAccount from 'components/molecules/TooltipVerifiedAccount';
import { dateTimefromNow } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import { ShowReactionDetail } from 'hook/useReaction';
import useReportPostType from 'hook/useReportPostType';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CommentProps } from 'services/commentService';
import reactionService, { ReactionSummaryProps } from 'services/reactionService';
import { UserState, useUser } from 'store/user/user.reducers';
import CommentsContext, { CommentsContextProps } from './CommentContext';
import DiscussionLoading from './DiscussionLoading';


function Comment({ level, comment, isLastComment, customAvatar, activeVote, commentType, disableAnonymously, backgroundContentComment }: {
    comment: CommentProps,
    commentType: string,
    level: number,
    isLastComment?: boolean,
    customAvatar?: (comment: CommentProps, level: number) => React.ReactElement,
    activeVote?: boolean,
    disableAnonymously?: boolean,
    backgroundContentComment?: string,
}) {

    const [activeEditComment, setActiveEditComment] = React.useState<ID>(0);

    const [commentEdit, setCommentEdit] = React.useState<CommentProps & { contentEdit?: string, is_incognito2?: number }>(comment);

    const [reactionSummary, setReactionSummary] = React.useState<{
        [K in ReactionType]: number
    }>({
        like: comment.count_like ?? 0,
        love: comment.count_love ?? 0,
        care: comment.count_care ?? 0,
        haha: comment.count_haha ?? 0,
        wow: comment.count_wow ?? 0,
        sad: comment.count_sad ?? 0,
        angry: comment.count_angry ?? 0,
    });

    const [openReactionDetail, setOpenReactionDetail] = React.useState(false);

    React.useEffect(() => {
        setReactionSummary({
            like: comment.count_like ?? 0,
            love: comment.count_love ?? 0,
            care: comment.count_care ?? 0,
            haha: comment.count_haha ?? 0,
            wow: comment.count_wow ?? 0,
            sad: comment.count_sad ?? 0,
            angry: comment.count_angry ?? 0,
        })
    }, [comment]);

    const [voteSummary, setVoteSummary] = React.useState<{
        [K in VoteType]: number
    }>({
        useful: comment.count_useful ?? 0,
        not_useful: comment.count_not_useful ?? 0,
    });

    const user = useUser();

    const navigate = useNavigate();

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const [activeReplyForm, setActiveReplyForm] = React.useState(false);

    const [isIncognito, setIsIncognito] = React.useState(false);

    const [contentReply, setContentReply] = React.useState('');

    // const [showCommentChild, setShowCommentChild] = React.useState(false);

    const commentsContext = React.useContext<CommentsContextProps>(CommentsContext);

    const dialogReport = useReportPostType({
        dataProps: {
            post: comment.id,
            type: commentType + '_report',
        },
        reasonList: {
            'Inappropriate Content': {
                title: __('Nội dung không phù hợp')
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
            'Other': {
                title: __('Khác')
            },
        },
    })


    const handleSubmitComment = () => {

        setIsLoadingButton(true);
        (async () => {

            if (contentReply.trim()) {


                let result = await commentsContext.addComment(comment.id, contentReply, isIncognito);

                if (result) {
                    setContentReply('');
                    setActiveReplyForm(false);
                    commentsContext.loadCommentChild(comment.id, 0, 10);
                }

            } else {
                window.showMessage(__('Vui lòng nhập nội dung thảo luận'), 'error');
            }

            setIsLoadingButton(false);

        })()
    }

    const handleSubmitEditComment = () => {

        if (user.id.toString() === commentEdit.account.toString()) {
            setIsLoadingButton(true);
            (async () => {
                let content = commentEdit.contentEdit;
                if (!content) {
                    content = commentEdit.content;
                }

                if (content.trim()) {

                    let is_incognito = commentEdit.is_incognito2 !== undefined ?
                        (commentEdit.is_incognito2 ? true : false)
                        : commentEdit.is_incognito ? true : false;
                    let result = await commentsContext.editComment(commentEdit.id, content.trim(), is_incognito);

                    if (result) {
                        setCommentEdit(prev => ({
                            ...prev,
                            content: content + '',
                            is_incognito: is_incognito ? 1 : 0,
                            author: is_incognito ? undefined : {
                                avatar: user.avatar,
                                id: user.id,
                                slug: user.slug,
                                title: user.full_name,
                                is_verified: user.is_verified,
                            }
                        }));
                        setActiveEditComment(0);
                    }

                } else {
                    window.showMessage(__('Vui lòng nhập nội dung thảo luận'), 'error');
                }

                setIsLoadingButton(false);

            })();
        }
    }

    const handleReactionClick = (type: string) => () => {

        if (user._state !== UserState.identify) {
            navigate('/auth');
            return;
        }

        (async () => {
            const result: {
                summary: { [key: string]: ReactionSummaryProps } | null,
                my_reaction: string,
            } = await reactionService.post({
                post: comment.id,
                reaction: type,
                type: commentType + '_reaction',
                user_id: user.id,
            });

            if (result && result.summary) {
                comment.my_reaction_type = result.my_reaction;
                setReactionSummary({
                    like: result.summary.like?.count ?? 0,
                    love: result.summary.love?.count ?? 0,
                    care: result.summary.care?.count ?? 0,
                    haha: result.summary.haha?.count ?? 0,
                    wow: result.summary.wow?.count ?? 0,
                    sad: result.summary.sad?.count ?? 0,
                    angry: result.summary.angry?.count ?? 0,
                });
            }
        })()
    }

    const handleVoteClick = (type: string) => () => {
        (async () => {
            const result: {
                summary: { [key: string]: ReactionSummaryProps } | null,
                my_reaction: string,
            } = await reactionService.post({
                post: comment.id,
                reaction: type,
                type: commentType + '_vote',
                user_id: user.id,
            });

            if (result && result.summary) {
                comment.my_vote = result.my_reaction;
                setVoteSummary({
                    useful: result.summary.useful?.count ?? 0,
                    not_useful: result.summary.not_useful?.count ?? 0,
                });
            }
        })()
    }

    const style = level > 1 ? {
        avatarWraper: 30,
        avatar: 24,
        line2: {
            left: 14,
            top: 33,
        },
    } : {
        avatarWraper: 54,
        avatar: 48,
        line2: {
            left: 27,
            top: 59,
        },
    };

    const styleLine1 = level === 2 ?
        {
            left: -43,
            width: 41,
        } :
        {
            left: -56,
            width: 54,
        };

    const totalReaction = reactionType.reduce((total, name) => total + reactionSummary[name], 0);

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            position: 'relative',
        }}
    >
        {
            level > 1 &&
            <>
                <Box
                    sx={{
                        borderBottomLeftRadius: '10px',
                        position: 'absolute',
                        right: 0,
                        borderTop: 'var(--lineCommentColor)',
                        borderColor: 'var(--lineCommentColor)',
                        borderWidth: '0 0 2px 2px',
                        borderStyle: 'solid',
                        height: 18,
                        ...styleLine1,
                    }}
                />
                {
                    !isLastComment &&
                    <Box
                        sx={{
                            position: 'absolute',
                            left: styleLine1.left,
                            width: '2px',
                            right: '27px',
                            top: '0',
                            bottom: '-20px',
                            background: 'var(--lineCommentColor)',
                        }}
                    />
                }
            </>
        }
        <Box
            sx={{
                display: 'flex',
                gap: 1,
                position: 'relative',
            }}
        >
            {
                Boolean((commentsContext.commentsData[comment.id]?.showCommentChild && commentsContext.commentsData[comment.id]?.comments?.length) || (activeReplyForm && level <= 3)) &&
                <Box
                    sx={{
                        position: 'absolute',
                        width: '2px',
                        bottom: '-20px',
                        background: 'var(--lineCommentColor)',
                        ...style.line2
                    }}
                />
            }
            <Box
                sx={{
                    borderRadius: '50%',
                    p: '3px',
                    width: style.avatarWraper,
                    height: style.avatarWraper,
                    cursor: 'pointer',
                }}
            >
                {
                    customAvatar && !commentEdit.is_incognito ?
                        <Box
                            component={Link} to={'/user/' + commentEdit.author?.slug}
                        >
                            {customAvatar(commentEdit, level)}
                        </Box>
                        :
                        commentEdit.is_incognito ?
                            <Box
                                sx={{
                                    borderRadius: '50%',
                                    p: '3px',
                                    width: style.avatarWraper,
                                    height: style.avatarWraper,
                                    cursor: 'pointer',
                                    backgroundColor: 'text.third',
                                    '& .MuiBadge-badge': {
                                        top: level === 1 ? 40 : 20,
                                        width: 20,
                                        height: 20,
                                        backgroundColor: 'text.third',
                                        color: 'white',
                                    }
                                }}
                            >
                                <Tooltip title={'Người dùng ẩn danh'}>
                                    <Badge badgeContent={<Icon sx={{ width: 16 }} icon={'StarOutlined'} />}>
                                        <ImageLazyLoading src={'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMTIwdjEyMEgweiIvPjxwYXRoIGQ9Ik02MCAwYzMzLjEzNyAwIDYwIDI2Ljg2MyA2MCA2MHMtMjYuODYzIDYwLTYwIDYwUzAgOTMuMTM3IDAgNjAgMjYuODYzIDAgNjAgMHptMTcuNSA2NC44MzdjLTYuNDU2IDAtMTEuODIyIDQuNTAyLTEzLjIyMiAxMC41MTYtMy4yNjctMS4zOTctNi4zLTEuMDA5LTguNTU2LS4wMzlDNTQuMjgzIDY5LjMgNDguOTE3IDY0LjgzNyA0Mi41IDY0LjgzN2MtNy41MDYgMC0xMy42MTEgNi4wOTItMTMuNjExIDEzLjU4MkMyOC44ODkgODUuOTA4IDM0Ljk5NCA5MiA0Mi41IDkyYzcuMTU2IDAgMTIuOTUtNS41MSAxMy40OTQtMTIuNDk1IDEuMTY3LS44MTUgNC4yNC0yLjMyOCA4LjAxMi4wNzhDNjQuNjI4IDg2LjUyOSA3MC4zODMgOTIgNzcuNSA5MmM3LjUwNiAwIDEzLjYxMS02LjA5MiAxMy42MTEtMTMuNTgxIDAtNy40OS02LjEwNS0xMy41ODItMTMuNjExLTEzLjU4MnptLTM1IDMuODhjNS4zNjcgMCA5LjcyMiA0LjM0NyA5LjcyMiA5LjcwMiAwIDUuMzU1LTQuMzU1IDkuNy05LjcyMiA5LjctNS4zNjcgMC05LjcyMi00LjM0NS05LjcyMi05LjcgMC01LjM1NSA0LjM1NS05LjcwMSA5LjcyMi05LjcwMXptMzUgMGM1LjM2NyAwIDkuNzIyIDQuMzQ3IDkuNzIyIDkuNzAyIDAgNS4zNTUtNC4zNTUgOS43LTkuNzIyIDkuNy01LjM2NyAwLTkuNzIyLTQuMzQ1LTkuNzIyLTkuNyAwLTUuMzU1IDQuMzU1LTkuNzAxIDkuNzIyLTkuNzAxek05NSA1N0gyNXY0aDcwdi00ek03Mi44NzQgMjkuMzRjLS44LTEuODItMi44NjYtMi43OC00Ljc4NS0yLjE0M0w2MCAyOS45MTRsLTguMTI4LTIuNzE3LS4xOTItLjA1OGMtMS45MjgtLjUzMy0zLjk1NC41MS00LjY2OSAyLjM4N0wzOC4xNDQgNTNoNDMuNzEyTDcyLjk1IDI5LjUyNnoiIGZpbGw9IiNEQURDRTAiLz48L2c+PC9zdmc+'} sx={{
                                            width: style.avatar,
                                            height: style.avatar,
                                            borderRadius: '50%',
                                        }} />
                                    </Badge>
                                </Tooltip>
                            </Box>
                            :
                            <Box
                                component={Link} to={'/user/' + commentEdit.author?.slug}
                            >
                                <ImageLazyLoading src={getImageUrl(commentEdit.author?.avatar, '/images/user-default.svg')} sx={{
                                    width: style.avatar,
                                    height: style.avatar,
                                    borderRadius: '50%',
                                }} />
                            </Box>
                }
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&>.MoreButton-root': {
                            opacity: 0,
                        },
                        '&:hover>.MoreButton-root': {
                            opacity: 1,
                        }
                    }}
                >
                    <Paper elevation={0} sx={{ minWidth: 200, width: activeEditComment ? '100%' : 'unset', padding: '9px 16px', position: 'relative', backgroundColor: backgroundContentComment ? backgroundContentComment : 'commentItemBackground' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {
                                commentEdit.is_incognito ?
                                    <Typography variant='h6'>{__('Người dùng ẩn danh')}</Typography>
                                    :
                                    <>
                                        <Typography component={Link} to={'/user/' + commentEdit.author?.slug} variant='h6'>{commentEdit.author?.title}</Typography>
                                        {
                                            Boolean(commentEdit.author?.is_verified) &&
                                            <TooltipVerifiedAccount iconSize={20} />
                                        }
                                    </>
                            }
                            <Typography color="text.secondary">{dateTimefromNow(commentEdit.created_at)}</Typography>
                        </Box>
                        {
                            activeEditComment ?
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flex: 1,
                                    }}
                                >

                                    <FieldForm
                                        component='editor'
                                        config={{
                                            title: undefined,
                                            editorObjectName: 'SectionDiscussion-comment-' + commentEdit.id,
                                            disableScrollToolBar: true,
                                            inputProps: {
                                                height: 250,
                                                placeholder: __('Viết bình luận...'),
                                                menubar: false,
                                            },
                                            plugins: ['codesample', 'link', 'hr', 'lists', 'emoticons', 'paste'],
                                            toolbar: ['bold italic underline | bullist numlist | hr codesample strikeout | blockquote link emoticons'],
                                            setup: (editor: ANY) => {
                                                editor.ui.registry.addIcon('code-sample', '<svg width="24" height="24"><path d="M11 14.17 8.83 12 11 9.83 9.59 8.41 6 12l3.59 3.59zm3.41 1.42L18 12l-3.59-3.59L13 9.83 15.17 12 13 14.17z"></path><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04-.39.08-.74.28-1.01.55-.18.18-.33.4-.43.64-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 15v4H5V5h14v10z"></path></svg>');
                                                editor.ui.registry.addButton('strikeout', {
                                                    icon: 'sourcecode',
                                                    tooltip: "Format as code",
                                                    onAction: function () {
                                                        editor.execCommand('mceToggleFormat', false, 'code');
                                                    }
                                                });
                                            }
                                        }}
                                        name="content"
                                        post={{ content: commentEdit.contentEdit ? commentEdit.contentEdit : commentEdit.content }}
                                        onReview={(value) => {
                                            setCommentEdit(prev => ({ ...prev, contentEdit: value }));
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gap: 1,
                                            mt: 2,
                                        }}
                                    >
                                        <Button color="inherit" onClick={() => setActiveEditComment(0)} >{__('Hủy bỏ')}</Button>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                            }}
                                        >
                                            {
                                                !disableAnonymously &&
                                                <FieldForm
                                                    component='true_false'
                                                    config={{
                                                        title: 'Đăng ẩn danh',
                                                    }}
                                                    post={{ is_incognito: commentEdit.is_incognito2 !== undefined ? commentEdit.is_incognito2 : commentEdit.is_incognito ? 1 : 0 }}
                                                    name="is_incognito"
                                                    onReview={(value) => {
                                                        setCommentEdit(prev => ({ ...prev, is_incognito2: value ? 1 : 0 }));
                                                    }}
                                                />
                                            }
                                            <LoadingButton
                                                loading={isLoadingButton}
                                                loadingPosition="center"
                                                onClick={handleSubmitEditComment}
                                                variant="contained"
                                            >{__('Cập nhật')}</LoadingButton>
                                        </Box>
                                    </Box>
                                </Box>
                                :
                                <CodeBlock sx={{ '& p': { marginTop: 1, marginBottom: 1, } }} html={commentEdit.content} />
                        }
                        {
                            totalReaction > 0 &&
                            < Tooltip title={
                                <>
                                    {
                                        reactionType.map((reaction) => (
                                            reactionList[reaction] && reactionSummary[reaction] ?
                                                <Box key={reaction} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <Avatar alt={reactionList[reaction].title} src={reactionList[reaction].image} sx={{ width: 18, height: 18 }} />
                                                    {reactionSummary[reaction]}
                                                </Box>
                                                :
                                                <React.Fragment key={reaction} />
                                        ))
                                    }
                                </>
                            }>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        position: 'absolute',
                                        right: 8,
                                        gap: 0.2,
                                        bottom: '-11px',
                                        padding: '2px',
                                        backgroundColor: 'background.paper',
                                        borderRadius: 5,
                                        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 20%)',
                                        fontSize: 11,
                                        color: 'text.secondary',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setOpenReactionDetail(true)}
                                >
                                    <AvatarGroup sx={{ '& .MuiAvatar-root': { borderColor: 'transparent' } }}>
                                        {
                                            reactionType.filter(reaction => reactionList[reaction] && reactionSummary[reaction]).map((reaction) => (
                                                <Avatar key={reaction} alt={reactionList[reaction].title} src={reactionList[reaction].image} sx={{ width: 18, height: 18 }} />
                                            ))
                                        }
                                    </AvatarGroup>
                                    {reactionType.reduce((total, name) => total + reactionSummary[name], 0)}
                                </Box>
                            </Tooltip>
                        }
                    </Paper>
                    <MoreButton
                        icon='MoreHorizRounded'
                        actions={
                            [
                                {
                                    ...(user._state === UserState.identify && user.id.toString() === commentEdit.account.toString() ? {
                                        edit: {
                                            title: __('Chỉnh sửa'),
                                            action: () => {
                                                setActiveEditComment(commentEdit.id);
                                            },
                                            icon: 'EditOutlined',
                                        }
                                    } : {}),
                                    report: {
                                        title: __('Báo cáo vi phạm'),
                                        action: () => {
                                            dialogReport.open();
                                        },
                                        icon: 'ReportGmailerrorredRounded',
                                    },

                                },

                            ]
                        }
                    />
                </Box>
                {
                    dialogReport.component
                }
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                    }}
                >
                    <TooltipReaction
                        leaveDelay={50}
                        enterDelay={500}
                        placement="top"
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
                                    }
                                }}
                            >
                                {
                                    reactionType.map((key) => (
                                        <Tooltip key={key} title={__(reactionList[key].title)} onClick={handleReactionClick(key)}>
                                            <Box>
                                                <ImageLazyLoading className='reactionItem' sx={{ transition: '0.3s all', }} src={reactionList[key].image} />
                                            </Box>
                                        </Tooltip>
                                    ))
                                }

                            </Box>
                        }
                        disableInteractive={false}
                        sx={{ background: 'red' }}
                    >
                        {
                            comment.my_reaction_type && reactionList[comment.my_reaction_type as ReactionType] ?
                                <Button
                                    size='small'
                                    color='inherit'
                                    onClick={handleReactionClick('')}
                                    sx={{
                                        textTransform: 'unset',
                                        minWidth: 'unset',
                                        color: reactionList[comment.my_reaction_type as ReactionType].color
                                    }}
                                    startIcon={
                                        <Avatar alt={reactionList[comment.my_reaction_type as ReactionType].title} src={reactionList[comment.my_reaction_type as ReactionType].image} sx={{ width: 18, height: 18 }} />
                                    }
                                >
                                    {reactionList[comment.my_reaction_type as ReactionType].title}
                                </Button>
                                :
                                <Button
                                    size='small'
                                    color='inherit'
                                    onClick={handleReactionClick(reactionList.like.key)}
                                    sx={{ textTransform: 'unset', minWidth: 'unset' }}
                                >
                                    {__('Like')}
                                </Button>
                        }
                    </TooltipReaction>
                    {
                        level >= 3 ?
                            <></>
                            // <Button
                            //     size='small'
                            //     color='inherit'
                            //     sx={{ textTransform: 'unset', minWidth: 'unset' }}
                            // >
                            //     {__('Tag')}
                            // </Button>
                            :
                            <Button
                                size='small'
                                color='inherit'
                                onClick={() => setActiveReplyForm(prev => !prev)}
                                sx={{ textTransform: 'unset', minWidth: 'unset' }}
                            >
                                {__('Phản hồi')}
                            </Button>
                    }
                </Box>
                {
                    commentsContext.commentsData[comment.id]?.comment_child_number > 0 &&
                    <Box
                        sx={{
                            display: 'flex',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'inline-flex',
                                cursor: 'pointer',
                                alignItems: 'center',
                                color: 'link',
                            }}
                            onClick={() => commentsContext.toogleShowCommentChild(comment.id)}
                        >
                            {
                                commentsContext.commentsData[comment.id]?.showCommentChild ?
                                    <>
                                        <Icon icon="ArrowDropUp" />
                                        {
                                            commentsContext.commentsData[comment.id]?.comment_child_number > 1 ?
                                                __('Ẩn {{count}} bình luận', {
                                                    count: commentsContext.commentsData[comment.id]?.comment_child_number
                                                })
                                                :
                                                __('Ẩn phản hồi')
                                        }
                                    </>
                                    :
                                    <>
                                        <Icon icon="ArrowDropDown" />
                                        {
                                            commentsContext.commentsData[comment.id]?.comment_child_number > 1 ?

                                                __('Xem {{count}} bình luận', {
                                                    count: commentsContext.commentsData[comment.id]?.comment_child_number
                                                })
                                                :
                                                __('Xem phản hồi')
                                        }
                                    </>
                            }
                        </Box>
                    </Box>
                }
            </Box>
            {
                Boolean(level === 1 && activeVote) &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    < Tooltip title={voteList.useful.title} >
                        <IconButton
                            size='small'
                            onClick={handleVoteClick(comment.my_vote === voteList.useful.key ? '' : voteList.useful.key)}
                            color={comment.my_vote === voteList.useful.key ? 'primary' : 'inherit'}
                            sx={{ width: 24, height: 24 }}
                        >
                            <Icon sx={{ fontSize: 40 }} icon={voteList.useful.icon} />
                        </IconButton>
                    </Tooltip>
                    < Tooltip title={<>
                        <Typography color='inherit' variant='body2'>{voteList.useful.shortTitle + ': ' + voteSummary.useful}</Typography>
                        <Typography color='inherit' variant='body2'>{voteList.not_useful.shortTitle + ': ' + voteSummary.not_useful}</Typography>
                    </>}
                    >
                        <span>
                            {voteSummary.useful - voteSummary.not_useful}
                        </span>
                    </Tooltip>
                    < Tooltip title={voteList.not_useful.title} >
                        <IconButton
                            size='small'
                            onClick={handleVoteClick(comment.my_vote === voteList.not_useful.key ? '' : voteList.not_useful.key)}
                            color={comment.my_vote === voteList.not_useful.key ? 'primary' : 'inherit'}
                            sx={{ width: 24, height: 24 }}
                        >
                            <Icon sx={{ fontSize: 40 }} icon={voteList.not_useful.icon} />
                        </IconButton>
                    </Tooltip>
                </Box>
            }
        </Box >
        {
            activeReplyForm && level <= 3 &&
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        borderBottomLeftRadius: '10px',
                        position: 'absolute',
                        borderTop: 'var(--lineCommentColor)',
                        borderColor: 'var(--lineCommentColor)',
                        borderWidth: '0 0 2px 2px',
                        borderStyle: 'solid',
                        height: 18,
                        left: level > 1 ? 14 : 27,
                        width: level > 1 ? 54 : 41,
                    }}
                />
                {
                    commentsContext.commentsData[comment.id]?.showCommentChild &&
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '2px',
                            top: '0',
                            bottom: '-20px',
                            background: 'var(--lineCommentColor)',
                            left: level > 1 ? 14 : 27,
                        }}
                    />
                }

                <Box
                    sx={{
                        p: '3px',
                        width: 54,
                        height: 54,
                    }}
                >
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: '50%',
                                p: '3px',
                                width: 30,
                                height: 30,
                                cursor: 'pointer',
                            }}
                        >
                            <ImageLazyLoading src={getImageUrl(user._state === UserState.identify ? user.avatar : '/images/user-default.svg', '/images/user-default.svg')} sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                            }} />
                        </Box>
                        {
                            user._state === UserState.identify ?
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flex: 1,
                                    }}
                                >

                                    <FieldForm
                                        component='editor'
                                        config={{
                                            title: undefined,
                                            editorObjectName: 'SectionDiscussion-comment-' + comment.id,
                                            disableScrollToolBar: true,
                                            inputProps: {
                                                height: 250,
                                                placeholder: __('Viết bình luận...'),
                                                menubar: false,
                                            },
                                            plugins: ['codesample', 'link', 'hr', 'lists', 'emoticons', 'paste'],
                                            toolbar: ['bold italic underline | bullist numlist | hr codesample strikeout | blockquote link emoticons'],
                                            setup: (editor: ANY) => {
                                                editor.ui.registry.addIcon('code-sample', '<svg width="24" height="24"><path d="M11 14.17 8.83 12 11 9.83 9.59 8.41 6 12l3.59 3.59zm3.41 1.42L18 12l-3.59-3.59L13 9.83 15.17 12 13 14.17z"></path><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04-.39.08-.74.28-1.01.55-.18.18-.33.4-.43.64-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 15v4H5V5h14v10z"></path></svg>');
                                                editor.ui.registry.addButton('strikeout', {
                                                    icon: 'sourcecode',
                                                    tooltip: "Format as code",
                                                    onAction: function () {
                                                        editor.execCommand('mceToggleFormat', false, 'code');
                                                    }
                                                });
                                            }
                                        }}
                                        name="content"
                                        post={{ content: contentReply }}
                                        onReview={(value) => {
                                            setContentReply(value);
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gap: 1,
                                            mt: 2,
                                        }}
                                    >
                                        <Button color="inherit" onClick={() => setActiveReplyForm(false)} >{__('Hủy bỏ')}</Button>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                            }}
                                        >
                                            {
                                                !disableAnonymously &&
                                                <FieldForm
                                                    component='true_false'
                                                    config={{
                                                        title: 'Đăng ẩn danh',
                                                    }}
                                                    post={{ is_incognito: isIncognito ? 1 : 0 }}
                                                    name="is_incognito"
                                                    onReview={(value) => {
                                                        setIsIncognito(value ? true : false)
                                                    }}
                                                />
                                            }
                                            <LoadingButton
                                                loading={isLoadingButton}
                                                loadingPosition="center"
                                                onClick={handleSubmitComment}
                                                variant="contained"
                                            >{__('Đăng')}</LoadingButton>
                                        </Box>
                                    </Box>
                                </Box>
                                :
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Button variant='outlined' component={Link} color="inherit" to="/auth" >
                                        {__('Đăng nhập để bình luận')}
                                    </Button>
                                </Box>
                        }
                    </Box>
                </Box>
            </Box>
        }
        {
            commentsContext.commentsData[comment.id]?.showCommentChild &&
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    paddingLeft: '70px',
                }}
            >
                {
                    commentsContext.commentsData[comment.id]?.comments ?
                        commentsContext.commentsData[comment.id]?.comments?.map((item, index) => {
                            return <Comment
                                level={level + 1}
                                commentType={commentType}
                                comment={item}
                                key={index}
                                customAvatar={customAvatar}
                                isLastComment={index === ((commentsContext.commentsData[comment.id]?.comments?.length as number) - 1)}
                                backgroundContentComment={backgroundContentComment}
                            />
                        })
                        :
                        <DiscussionLoading length={comment.comment_child_number >= 10 ? 10 : comment.comment_child_number} />
                }
            </Box>
        }
        {
            openReactionDetail &&
            <ShowReactionDetail
                onClose={() => setOpenReactionDetail(false)}
                post={{
                    ...comment,
                    type: commentType
                }}
                reactionTypes={['like', 'love', 'care', 'haha', 'wow', 'sad', 'angry']}
            />
        }
    </Box >;
}

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


const reactionType = [
    'like', 'love', 'care', 'haha', 'wow', 'sad', 'angry'
] as const;

const voteType = [
    'useful', 'not_useful'
] as const;

type ReactionType = (typeof reactionType)[number];
type VoteType = (typeof voteType)[number];

const reactionList: {
    [K in ReactionType]: {
        key: string,
        title: string,
        color: string,
        image: string,
        count_column: string,
    }
} = {
    like: {
        key: 'like',
        title: __('Thích'),
        color: 'rgb(32, 120, 244)',
        image: '/images/like.gif',
        count_column: 'count_like',
    },
    love: {
        key: 'love',
        title: __('Yêu thích'),
        color: 'rgb(243, 62, 88)',
        image: '/images/love.gif',
        count_column: 'count_love',
    },
    care: {
        key: 'care',
        title: __('Thương thương'),
        color: 'rgb(247, 177, 37)',
        image: '/images/care.gif',
        count_column: 'count_care',
    },
    haha: {
        key: 'haha',
        title: __('Haha'),
        color: 'rgb(247, 177, 37)',
        image: '/images/haha.gif',
        count_column: 'count_haha',
    },
    wow: {
        key: 'wow',
        title: __('Wow'),
        color: 'rgb(247, 177, 37)',
        image: '/images/wow.gif',
        count_column: 'count_wow',
    },
    sad: {
        key: 'sad',
        title: __('Buồn'),
        color: 'rgb(247, 177, 37)',
        image: '/images/sad.gif',
        count_column: 'count_sad',
    },
    angry: {
        key: 'angry',
        title: __('Phẫn nộ'),
        color: 'rgb(233, 113, 15)',
        image: '/images/angry.gif',
        count_column: 'count_angry',
    },
};


const voteList: {
    [K in VoteType]: {
        key: string,
        title: string,
        shortTitle: string,
        icon?: string,
    }
} = {
    useful: {
        key: 'useful',
        title: __('Câu trả lời này rất hữu ích'),
        shortTitle: __('Hữu ích'),
        icon: 'ArrowDropUpOutlined',
    },
    not_useful: {
        key: 'not_useful',
        title: __('Câu trả lời này không hữu ích'),
        shortTitle: __('Không hữu ích'),
        icon: 'ArrowDropDownOutlined',
    },
};


export default Comment
