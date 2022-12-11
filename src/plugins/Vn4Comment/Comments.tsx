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
    disableUpdateUnread = false,
}: {
    keyComment: ID,
    type?: string,
    customAvatar?: (comment: CommentProps, level: number) => React.ReactElement,
    activeVote?: boolean,
    followType?: string,
    isFollow?: string,
    disableAnonymously?: boolean,
    disableUpdateUnread?: boolean,
}) {
    const classes = useStyle();

    const user = useSelector((state: RootState) => state.user);

    const [comments, setComments] = React.useState<PaginationProps<CommentProps> | null>(null);

    const [isIncognito, setIsIncognito] = React.useState(false);

    const [myFollow, setMyFollow] = React.useState(isFollow);
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

    const paginate = usePaginate<CommentProps>({
        name: 'dis',
        template: 'page',
        onChange: async (data) => {

            const commentApi = await commentService.getComments({
                current_page: data.current_page,
                per_page: data.per_page,
                key: keyComment,
                type: type,
                followType: followType ?? '',
            });

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
                    if (window.__editor['SectionDiscussion-reply']) {
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

    }, [keyComment]);

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
                }
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
                                                    height: 300,
                                                    placeholder: __('Viết một cái gì đó tuyệt vời ...'),
                                                    menubar: false,
                                                },
                                                plugins: ['codesample', 'link', 'hr', 'lists', 'emoticons', 'paste'],
                                                toolbar: ['undo redo | formatselect  | bold italic underline | forecolor backcolor | outdent indent | bullist numlist | hr codesample | blockquote link emoticons'],
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
                                        alignItems: 'center',
                                    }}
                                >
                                    <Button variant='outlined' component={Link} color="inherit" to="/auth" >
                                        {__('Đăng nhập để bình luận')}
                                    </Button>
                                </Box>
                            </Box>
                    }
                </Box>

                {
                    Boolean(comments?.total || (followType !== undefined && user._state === UserState.identify)) &&
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 2,
                            mt: 4,
                        }}
                    >
                        <Typography align='center' variant='h4'>
                            {__('{{reply_count}} Bình luận', {
                                reply_count: comments?.total ?? 0
                            })}
                        </Typography>
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