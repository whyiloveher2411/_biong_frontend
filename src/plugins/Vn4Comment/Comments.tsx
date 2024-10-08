import { Box, Theme } from '@mui/material';
import makeCSS from 'components/atoms/makeCSS';
import { PaginationProps } from 'components/atoms/TablePagination';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import commentService, { CommentProps } from 'services/commentService';
import Comment from './Comment';

import { LoadingButton } from '@mui/lab';
import Button from 'components/atoms/Button';
import FieldForm from 'components/atoms/fields/FieldForm';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Loading from 'components/atoms/Loading';
import Typography from 'components/atoms/Typography';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import reactionService, { ReactionSummaryProps } from 'services/reactionService';
import { RootState } from 'store/configureStore';
import { UserState } from 'store/user/user.reducers';
import CommentsContext from './CommentContext';
import MoreButton from 'components/atoms/MoreButton';


const useStyle = makeCSS((theme: Theme) => ({
    root: {
        '--lineCommentColor': theme.palette.dividerDark,
    }
}));

function Comments({
    keyComment,
    type = 'vn4_comment',
    customAvatar,
    activeVote,
    isFollow,
    followType,
    disableAnonymously,
    backgroundContentComment,
    disableUpdateUnread = false,
    disableCountComment = false,
    onChange
}: {
    keyComment: ID,
    type?: string,
    customAvatar?: (comment: CommentProps, level: number) => React.ReactElement,
    activeVote?: boolean,
    followType?: string,
    isFollow?: string,
    backgroundContentComment?: string,
    disableAnonymously?: boolean,
    disableUpdateUnread?: boolean,
    disableCountComment?: boolean,
    onChange?: (comment: PaginationProps<CommentProps> | null) => void,
}) {
    const classes = useStyle();

    const user = useSelector((state: RootState) => state.user);

    const [comments, setComments] = React.useState<PaginationProps<CommentProps> | null>(null);

    const [isIncognito, setIsIncognito] = React.useState(false);

    const [myFollow, setMyFollow] = React.useState(isFollow);

    const orderBy = React.useState<'default' | 'recently' | 'all'>('default');

    const [loadingButtonFollow, setLoadingButtonFollow] = React.useState(false);

    const [commentObjectID, setCommentObjectID] = React.useState<ID | null>(null);

    const [contentReply, setContentReply] = React.useState('');

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const [commentsData, setCommentsData] = React.useState<{
        [key: ID]: {
            showCommentChild: boolean,
            comment_child_number: number,
            comments: CommentProps[] | null
        }
    }>({});

    // const contentCommentRef = React.useRef<HTMLDivElement>(null);

    const paginate = usePaginate<CommentProps>({
        name: 'dis',
        template: 'page',
        // scrollToELementAfterChange: contentCommentRef,
        onChange: async (data) => {

            const commentApi = await commentService.getComments({
                current_page: data.current_page,
                per_page: data.per_page,
                key: keyComment,
                type: type,
                followType: followType ?? '',
                order: orderBy[0],
            });
            if (onChange) {
                onChange(commentApi.comments);
            }
            const commentsDataTemp: {
                [key: ID]: {
                    showCommentChild: boolean,
                    comment_child_number: number,
                    comments: CommentProps[] | null
                }
            } = {};

            if (commentApi.comments?.data) {
                commentApi.comments.data.forEach(item => {
                    commentsDataTemp[item.id] = {
                        comments: commentsData[item.id]?.comments,
                        showCommentChild: commentsData[item.id]?.showCommentChild,
                        comment_child_number: item.comment_child_number,
                    };
                });
            }

            setCommentsData(prev => ({
                ...prev,
                ...commentsDataTemp,
            }));
            setMyFollow(commentApi.my_follow);
            setCommentObjectID(commentApi.key_id);
            setComments(commentApi.comments);
        },
        pagination: comments,
        data: {
            current_page: 0,
            per_page: 10
        }
    });

    const handleSubmitComment = () => {

        setIsLoadingButton(true);
        (async () => {


            if (contentReply.trim()) {

                let result = await commentService.postComment({
                    content: contentReply,
                    key: keyComment,
                    type: type,
                    use_id: user.id,
                    is_incognito: isIncognito,
                    disableUpdateUnread: disableUpdateUnread,
                });


                if (result) {
                    setContentReply('');
                    if (window.__editor?.['SectionDiscussion-reply']) {
                        window.__editor['SectionDiscussion-reply'].setContent('');
                    }
                    paginate.set(() => ({
                        current_page: 0,
                        per_page: 10,
                    }));
                }

            } else {
                window.showMessage(__('Vui lòng nhập nội dung thảo luận'), 'error');
            }

            setIsLoadingButton(false);

        })()
    }

    const loadCommentChild = async (commentID: ID, current_page: number, per_page: number) => {

        return await commentService.getCommentsChildren({
            current_page: current_page,
            per_page: per_page,
            parent: commentID,
            key: keyComment,
            type: type,
        });
    }

    const parseCommentsToContext = (data: CommentProps[]) => {
        const commentsDataTemp: {
            [key: ID]: {
                showCommentChild: boolean,
                comment_child_number: number,
                comments: CommentProps[] | null
            }
        } = {};

        if (data) {
            data.forEach(item => {
                commentsDataTemp[item.id] = {
                    comments: commentsData[item.id]?.comments,
                    showCommentChild: commentsData[item.id]?.showCommentChild,
                    comment_child_number: item.comment_child_number,
                };
            });
        }

        return commentsDataTemp;
    }

    React.useEffect(() => {

        if (keyComment) {
            paginate.set(() => ({
                current_page: 0,
                per_page: 10,
                loadData: true,
            }));

            setIsIncognito(false);
        }

    }, [keyComment, orderBy[0]]);

    return (
        <CommentsContext.Provider
            value={{
                commentsData: commentsData,
                toogleShowCommentChild: async (commentID: ID, open?: boolean) => {

                    const openBox = open !== undefined ? open : commentsData[commentID]?.showCommentChild ? false : true;

                    setCommentsData(prev => {
                        return {
                            ...prev,
                            // [commentID]: open !== undefined ? open : prev[commentID] ? false : true,
                            [commentID]: {
                                ...prev[commentID],
                                showCommentChild: openBox,
                            }
                        };
                    });

                    let comments = commentsData[commentID]?.comments;

                    if (openBox && !comments) {
                        comments = await loadCommentChild(commentID, 0, 10);
                    }

                    const commentsToContext = comments ? parseCommentsToContext(comments) : {};

                    setCommentsData(prev => {
                        return {
                            ...prev,
                            // [commentID]: open !== undefined ? open : prev[commentID] ? false : true,
                            ...commentsToContext,
                            [commentID]: {
                                ...prev[commentID],
                                comments: comments,
                                showCommentChild: openBox,
                            },
                        };
                    });
                },
                loadCommentChild: (commentID: ID, current_page: number, per_page: number) => {

                    (async () => {
                        const comments = await loadCommentChild(commentID, current_page, per_page);
                        const commentsToContext = comments ? parseCommentsToContext(comments) : {};

                        setCommentsData(prev => ({
                            ...prev,
                            ...commentsToContext,
                            [commentID]: {
                                ...prev[commentID],
                                comments: comments,
                            }
                        }));

                    })()
                },
                addComment: async (commentID: ID, content: string, isIncognito: boolean) => {
                    const result = await commentService.postComment({
                        content: content,
                        parent: commentID,
                        key: keyComment,
                        type: type,
                        use_id: user.id,
                        is_incognito: isIncognito,
                        disableUpdateUnread: disableUpdateUnread,
                    });

                    setCommentsData(prev => ({
                        ...prev,
                        [commentID]: {
                            ...prev[commentID],
                            comment_child_number: prev[commentID]?.comment_child_number ? prev[commentID].comment_child_number + 1 : 1,
                            showCommentChild: true,
                        }
                    }))
                    return result;
                },
                editComment: async (commentID: ID, content: string, isIncognito: boolean) => {
                    const result = await commentService.postComment({
                        content: content,
                        id: commentID,
                        key: keyComment,
                        type: type,
                        use_id: user.id,
                        is_incognito: isIncognito,
                        disableUpdateUnread: disableUpdateUnread,
                    });
                    return result;
                },
            }}
        >
            <Box className={classes.root}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mb: 4,
                        width: '100%',
                        mt: 3
                    }}
                >
                    {
                        user._state === UserState.identify ?
                            <>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        flex: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            borderRadius: '50%',
                                            p: '3px',
                                            width: 54,
                                            height: 54,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <ImageLazyLoading src={getImageUrl(user._state === UserState.identify ? user.avatar : '/images/user-default.svg', '/images/user-default.svg')} sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: '50%',
                                        }} />
                                    </Box>
                                    <Box
                                        sx={{
                                            width: '100%',
                                        }}
                                    >
                                        <FieldForm
                                            component='editor'
                                            config={{
                                                title: undefined,
                                                editorObjectName: 'SectionDiscussion-reply',
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
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
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
                                    >
                                        {__('Đăng')}
                                    </LoadingButton>
                                </Box>

                            </>
                            :
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    flex: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        borderRadius: '50%',
                                        p: '3px',
                                        width: 54,
                                        height: 54,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <ImageLazyLoading src={getImageUrl('/images/user-default.svg', '/images/user-default.svg')} sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                    }} />
                                </Box>
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        gap: 1,
                                        p: 3,
                                        border: '1px dashed',
                                        borderColor: 'dividerDark',
                                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography variant='h4'>Chào mừng đến với Spacedev.vn</Typography>
                                    <Typography>Hãy đăng nhập và để lại ý kiến hoặc suy nghĩ của bạn.</Typography>
                                    <Button variant='contained' sx={{ mt: 1, }} component={Link} to="/auth" >
                                        Đăng nhập
                                    </Button>
                                </Box>
                            </Box>
                    }
                </Box>

                {
                    Boolean(!disableCountComment && (comments?.total || (followType !== undefined && user._state === UserState.identify))) &&
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                            mt: 4,
                        }}
                    >
                        <Typography align='center' variant='h4'>
                            {__('{{reply_count}} Bình luận', {
                                reply_count: comments?.total ?? 0
                            })}
                        </Typography>

                        <MoreButton
                            actions={[
                                {
                                    default: {
                                        title: 'Bình luận liên quan nhất',
                                        description: 'Hiển thị bình luận có nhiều lượt tương tác nhất trước.',
                                        selected: orderBy[0] === 'default',
                                        action: () => {
                                            orderBy[1]('default');
                                        }
                                    },
                                    recently: {
                                        title: 'Gần đây nhất',
                                        description: 'Hiển thị bình luận từ mới nhất đến cũ nhất.',
                                        selected: orderBy[0] === 'recently',
                                        action: () => {
                                            orderBy[1]('recently');
                                        }
                                    },
                                    all: {
                                        title: 'Tất cả bình luận',
                                        description: 'Hiển thị tất cả bình luận theo thứ tự thời gian.',
                                        selected: orderBy[0] === 'all',
                                        action: () => {
                                            orderBy[1]('all');
                                        }
                                    },
                                }
                            ]}
                        >
                            <Button
                                sx={{
                                    textTransform: 'unset',
                                    fontSize: 16,
                                }}
                                color='inherit'
                                endIcon={<Icon icon="KeyboardArrowDownRounded" />}
                            >
                                {
                                    orderBy[0] === 'default' ? 'Bình luận liên quan nhất'
                                        : orderBy[0] === 'recently' ? 'Gần đây nhất'
                                            : 'Tất cả bình luận'
                                }
                            </Button>
                        </MoreButton>
                        {
                            followType !== undefined && user._state === UserState.identify &&
                            <LoadingButton
                                loading={loadingButtonFollow}
                                color="inherit"
                                variant='outlined'
                                endIcon={myFollow === 'follow' ? <Icon icon="StarRounded" sx={{ color: '#faaf00' }} /> : <Icon icon="StarBorderRounded" sx={{ color: 'inherit' }} />}
                                onClick={async () => {
                                    setLoadingButtonFollow(true);
                                    const result: {
                                        summary: { [key: string]: ReactionSummaryProps } | null,
                                        my_reaction: string,
                                    } = await reactionService.post({
                                        post: commentObjectID ?? 0,
                                        reaction: myFollow === 'follow' ? '' : 'follow',
                                        type: followType,
                                        user_id: user.id
                                    });

                                    setMyFollow(result.my_reaction);
                                    setLoadingButtonFollow(false);
                                }}
                            >
                                {myFollow === 'follow' ? __('Bỏ theo dõi') : __('Theo dõi')}
                            </LoadingButton>
                        }
                    </Box>
                }
                <Box
                    // ref={contentCommentRef}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        mt: 3,
                        position: 'relative',
                    }}
                >
                    {
                        comments?.data.map((item, index) => {
                            return <Comment
                                key={item.id}
                                commentType={type}
                                comment={item}
                                level={1}
                                customAvatar={customAvatar}
                                activeVote={activeVote}
                                disableAnonymously={disableAnonymously}
                                backgroundContentComment={backgroundContentComment}
                            />
                        })
                    }
                    <Loading open={paginate.isLoading} isCover />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 4,
                    }}
                >
                    {paginate.component}
                </Box>
            </Box>
        </CommentsContext.Provider>
    )
}

export default Comments