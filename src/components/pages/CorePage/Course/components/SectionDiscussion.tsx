import { LoadingButton } from '@mui/lab';
import { Avatar, AvatarGroup, Badge, Box, Button, IconButton, Paper, Skeleton, Theme, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import DraftEditor, { getDarftContent } from 'components/atoms/DraftEditor';
import DraftEditorView from 'components/atoms/DraftEditor/DraftEditorView';
import Icon, { IconFormat } from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import makeCSS from 'components/atoms/makeCSS';
import { PaginationProps } from 'components/atoms/TablePagination';
import Tooltip from 'components/atoms/Tooltip';
import { EditorState } from 'draft-js';
import { dateTimefromNow } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import { useSelector } from 'react-redux';
import commentService, { CommentProps } from 'services/commentService';
import courseService, { ChapterAndLessonCurrentState, CourseProps } from 'services/courseService';
import elearningService, { COMMENT_TYPE, InstructorProps, QA_VOTE_TYPE, REACTION_COURSE_COMMENT_TYPE } from 'services/elearningService';
import reactionService, { ReactionSummaryProps } from 'services/reactionService';
import { RootState } from "store/configureStore";

const useStyle = makeCSS((theme: Theme) => ({
    root: {
        '--lineCommentColor': theme.palette.dividerDark,
    }
}));

function SectionDiscussion({
    course,
    chapterAndLessonCurrent,
    questionID,
}: {
    course: CourseProps,
    chapterAndLessonCurrent: ChapterAndLessonCurrentState,
    questionID: ID,
}) {

    const classes = useStyle();

    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );

    const [comments, setComments] = React.useState<PaginationProps<CommentProps> | null>(null);

    const paginate = usePaginate<CommentProps>({
        name: 'dis',
        template: 'page',
        onChange: async (data) => {
            await loadComments(data.current_page, data.per_page);
        },
        pagination: comments,
        data: {
            current_page: 0,
            per_page: 10
        }
    });

    const [instructors, setInstructors] = React.useState<{ [key: ID]: InstructorProps } | null>(null);

    const [times, setTimes] = React.useState(0);

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const user = useSelector((state: RootState) => state.user);

    React.useEffect(() => {
        (async () => {
            const instructors = elearningService.getInstructors(course.id);
            const comments = courseService.getComments({
                current_page: paginate.data.current_page,
                per_page: paginate.data.per_page,
                postID: questionID,
                type: COMMENT_TYPE,
            });

            Promise.all([instructors, comments]).then(([instructors, comments]) => {

                let instructorsById: { [key: ID]: InstructorProps } = {};

                if (instructors) {
                    instructors.forEach(instructor => {
                        instructorsById[instructor.id] = instructor;
                    });
                }

                setInstructors(instructorsById);
                setComments(comments);
            });
        })()
    }, []);

    const loadComments = async (current_page: number, per_page: number) => {
        const comments = await courseService.getComments({
            current_page: current_page,
            per_page: per_page,
            postID: questionID,
            type: COMMENT_TYPE,
        });
        setTimes(prev => prev + 1);
        setComments(comments);
    };

    const handleSubmitComment = () => {

        setIsLoadingButton(true);
        (async () => {

            let content = getDarftContent(editorState);

            if (content) {

                let result = await commentService.post({
                    content: content,
                    post: questionID,
                    type: COMMENT_TYPE,
                    _addInInfo: {
                        chat_group_owner: user.id + '',
                    }
                });

                if (result) {
                    setEditorState(EditorState.createEmpty());
                    loadComments(0, 10);
                }

            } else {
                window.showMessage(__('Vui lòng nhập nội dung thảo luận'), 'error');
            }

            setIsLoadingButton(false);

        })()
    }

    return (
        <Box
            className={classes.root}
        >

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
                        <ImageLazyLoading src={getImageUrl(user.avatar, '/images/user-default.svg')} sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                        }} />
                    </Box>
                    <DraftEditor
                        editorState={editorState}
                        setEditorState={setEditorState}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <LoadingButton
                        disabled={!(editorState.getCurrentContent().hasText() && editorState.getCurrentContent().getPlainText().trim())}
                        loading={isLoadingButton}
                        loadingPosition="center"
                        onClick={handleSubmitComment}
                        variant="contained"
                    >
                        {__('Post')}
                    </LoadingButton>
                </Box>
            </Box>
            {
                comments !== null &&
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 2,
                        mt: 4,
                    }}
                >
                    <Typography align='center' variant='h4'>{
                        comments.total > 1 ?
                            __('{{reply_count}} replies', {
                                reply_count: comments.total
                            }) :
                            __('{{reply_count}} reply', {
                                reply_count: comments.total
                            })
                    }</Typography>
                    <Button color="inherit">{__('Follow replies')}</Button>
                </Box>
            }
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    mt: 3,
                }}
            >
                {
                    comments && instructors ?
                        paginate.isLoading ?
                            <DiscussionLoading />
                            :
                            (
                                times % 2 === 0 ?
                                    <CommentList
                                        key={times}
                                        comments={comments}
                                        course={course}
                                        questionID={questionID}
                                        instructors={instructors}
                                    />
                                    :
                                    <CommentList
                                        key={times}
                                        comments={comments}
                                        course={course}
                                        questionID={questionID}
                                        instructors={instructors}
                                    />
                            )
                        :
                        <></>
                }
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
        </Box>
    )
}

const CommentList = ({ comments, course, instructors, questionID }: {
    comments: PaginationProps<CommentProps>,
    course: CourseProps,
    questionID: ID,
    instructors: {
        [key: ID]: InstructorProps;
    }
}) => {
    return <>
        {
            comments.data.map((item, index) => {
                let label: {
                    title?: string | undefined;
                    icon?: IconFormat | undefined;
                    color: string;
                };

                if (item.author) {
                    if ((course.course_detail?.owner + '') === (item.author.id + '')) {
                        label = getLabelProp('Product Owner');
                    } else if (instructors[item.author.id] !== undefined) {
                        label = getLabelProp(instructors[item.author.id].position);
                    } else {
                        label = getLabelProp('Student');
                    }
                } else {
                    label = getLabelProp('Student');
                }

                return <Box
                    key={index}
                    sx={{
                        p: 3,
                        border: '1px solid',
                        borderColor: 'dividerDark',
                        borderRadius: 1,
                    }}
                > <CommentItem questionID={questionID} course={course} label={label} comment={item} instructors={instructors} level={1} />
                </Box>
            })
        }
    </>
}

const getLabelProp = (type: string): {
    title?: string,
    icon?: IconFormat,
    color: string,
} => {
    switch (type) {
        case 'Teacher':
            return {
                title: __('Teacher'),
                icon: 'BookmarksOutlined',
                color: '#ed6c02',
            };
        case 'Mentor':
            return {
                title: __('Mentor'),
                icon: 'PriorityHighRounded',
                color: '#3f51b5',
            };
        case 'Product Owner':
            return {
                title: __('Product Owner'),
                icon: 'Star',
                color: '#8204d9',
            };
        default:
            return {
                color: 'transparent',
            };
    }
}

function DiscussionLoading({ length = 10 }: { length?: number }) {
    return <>
        {
            [...Array(length)].map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        gap: 2,
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
                        <Skeleton variant='circular' sx={{
                            width: 48,
                            height: 48,
                        }} />
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
                                gap: 1,
                                alignItems: 'center',
                            }}
                        >
                            <Skeleton>
                                <Typography variant='h5'>................................</Typography>
                            </Skeleton>
                            <Skeleton>
                                <Typography color="text.secondary">................</Typography>
                            </Skeleton>
                        </Box>
                        <Skeleton variant='rectangular' sx={{ height: 80 }} />
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                mt: 1,
                            }}
                        >
                            <Skeleton variant='rectangular'>
                                <Button color='inherit' startIcon={<Icon icon="ThumbUpOutlined" />}>
                                    123,567
                                </Button>
                            </Skeleton>
                            <Skeleton variant='rectangular'>
                                <Button color='inherit' startIcon={<Icon icon="ThumbDownOutlined" />}>
                                    123
                                </Button>
                            </Skeleton>
                            <Skeleton variant='rectangular'>
                                <Button
                                    color='inherit'
                                >
                                    {__('Reply')}
                                </Button>
                            </Skeleton>
                        </Box>
                    </Box>
                </Box>
            ))
        }
    </>
}

function CommentItem({ level, course, comment, label, instructors, isLastComment, questionID }: {
    instructors: { [key: ID]: InstructorProps }
    course: CourseProps,
    comment: CommentProps,
    level: number,
    isLastComment?: boolean,
    questionID: ID,
    label: {
        title?: string | undefined;
        icon?: IconFormat | undefined;
        color: string;
    }
}) {

    const comment_child_number = React.useRef(comment.comment_child_number);

    const [reactionSummary, setReactionSummary] = React.useState<ReactionSummaryProps[] | null>(comment.reaction_summary);
    const [voteSummary, setVoteSummary] = React.useState<ReactionSummaryProps[] | null>(comment.vote_summary);

    const user = useSelector((state: RootState) => state.user);

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const [activeReplyForm, setActiveReplyForm] = React.useState(false);

    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );

    const [showCommentChild, setShowCommentChild] = React.useState(false);

    const [comments, setComments] = React.useState<PaginationProps<CommentProps> | null>(null);

    const paginate = usePaginate<CommentProps>({
        name: 'commentItem-' + questionID,
        template: 'page',
        onChange: async (data) => {
            await loadComments(data.current_page, data.per_page);
        },
        pagination: comments,
        data: {
            current_page: 0,
            per_page: 10
        }
    });

    React.useEffect(() => {
        if (showCommentChild && comments === null) {
            loadComments(0, 10);
        }
    }, [showCommentChild]);

    const loadComments = async (current_page: number, per_page: number) => {
        const comments = await courseService.getComments({
            current_page: current_page,
            per_page: per_page,
            parent: comment.id,
            postID: questionID,
            type: COMMENT_TYPE,
        });
        setComments(comments);
    };

    const handleSubmitComment = () => {

        setIsLoadingButton(true);
        (async () => {

            let content = getDarftContent(editorState);

            if (content) {

                let result = await commentService.post({
                    content: content,
                    post: questionID,
                    parent: comment.id,
                    type: COMMENT_TYPE,
                    _addInInfo: {
                        chat_group_owner: user.id + '',
                    }
                });

                if (result) {
                    comment_child_number.current++;
                    setShowCommentChild(true);
                    setEditorState(EditorState.createEmpty());
                    setActiveReplyForm(false);
                    loadComments(0, 10);
                }

            } else {
                window.showMessage(__('Vui lòng nhập nội dung thảo luận'), 'error');
            }

            setIsLoadingButton(false);

        })()
    }

    const handleReactionClick = (type: string) => () => {
        (async () => {
            const result: {
                summary: Array<ReactionSummaryProps> | null,
                my_reaction: string,
            } = await reactionService.post({
                post: comment.id,
                reaction: type,
                type: REACTION_COURSE_COMMENT_TYPE,
            });

            if (result) {
                comment.my_reaction_type = result.my_reaction;
                setReactionSummary(result.summary ?? []);
            }
        })()
    }

    const handleVoteClick = (type: string) => () => {
        (async () => {
            const result: {
                summary: Array<ReactionSummaryProps> | null,
                my_reaction: string,
            } = await reactionService.post({
                post: comment.id,
                reaction: type,
                type: QA_VOTE_TYPE,
            });

            if (result) {
                comment.my_vote = result.my_reaction;
                setVoteSummary(result.summary ?? []);
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
                gap: 2,
                position: 'relative',
            }}
        >
            {
                Boolean((showCommentChild && comments?.data.length) || (activeReplyForm && level <= 3)) &&
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
                    background: label.color,
                    '& .MuiBadge-badge': {
                        top: 40,
                        width: 20,
                        height: 20,
                        background: label.color,
                        color: 'white',
                    }
                }}
            >
                {
                    label.title ?
                        <Tooltip title={label.title}>
                            <Badge badgeContent={label.icon ? <Icon sx={{ width: 16 }} icon={label.icon} /> : <></>}>
                                <ImageLazyLoading src={getImageUrl(comment.author?.avatar, '/images/user-default.svg')} sx={{
                                    width: style.avatar,
                                    height: style.avatar,
                                    borderRadius: '50%',
                                }} />
                            </Badge>
                        </Tooltip>
                        :
                        <Badge badgeContent={label.icon ? <Icon sx={{ width: 16 }} icon={label.icon} /> : <></>}>
                            <ImageLazyLoading src={getImageUrl(comment.author?.avatar, '/images/user-default.svg')} sx={{
                                width: style.avatar,
                                height: style.avatar,
                                borderRadius: '50%',
                            }} />
                        </Badge>
                }
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                }}
            >
                <Paper elevation={0} sx={{ padding: '8px 12px', position: 'relative' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant='h6'>{comment.author?.title}</Typography>
                        <Typography color="text.secondary">{dateTimefromNow(comment.created_at)}</Typography>
                    </Box>
                    <DraftEditorView value={comment.content} />
                    {
                        Array.isArray(reactionSummary) && reactionSummary.length ?
                            <Tooltip title={
                                <>
                                    {
                                        reactionSummary?.map((reaction) => (
                                            reactionList[reaction.reaction_type] && reaction.count ?
                                                <Box key={reaction.reaction_type} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <Avatar key={reaction.reaction_type} alt={reactionList[reaction.reaction_type].title} src={reactionList[reaction.reaction_type].image} sx={{ width: 18, height: 18 }} />
                                                    {reaction.count}
                                                </Box>
                                                :
                                                <React.Fragment key={reaction.reaction_type} />
                                        ))
                                    }
                                </>
                            }>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        position: 'absolute',
                                        right: 2,
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
                                >
                                    <AvatarGroup sx={{ '& .MuiAvatar-root': { borderColor: 'transparent' } }}>
                                        {
                                            reactionSummary?.map((reaction) => (
                                                reactionList[reaction.reaction_type] && reaction.count ?
                                                    <Avatar key={reaction.reaction_type} alt={reactionList[reaction.reaction_type].title} src={reactionList[reaction.reaction_type].image} sx={{ width: 18, height: 18 }} />
                                                    :
                                                    <React.Fragment key={reaction.reaction_type} />
                                            ))
                                        }
                                    </AvatarGroup>
                                    {reactionSummary.reduce((total, item) => total + item.count, 0)}
                                </Box>
                            </Tooltip>
                            : <></>
                    }
                </Paper>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        mt: 1,
                    }}
                >
                    <TooltipReaction
                        leaveDelay={50}
                        enterDelay={500}
                        title={
                            <Box
                                sx={{
                                    display: 'flex',
                                    padding: '5px 0',
                                    '& .reactionItem': {
                                        transition: '0.3s all',
                                        cursor: 'pointer',
                                        margin: '0 5px',
                                        width: 39,
                                        height: 39,
                                        zIndex: 1,
                                    },
                                    '& .reactionItem:hover': {
                                        transform: 'perspective(1px) translate(0, -3px) scale(1.3, 1.3)',
                                    }
                                }}
                            >
                                {
                                    Object.keys(reactionList).map((key) => (
                                        <Tooltip key={key} title={__(reactionList[key].title)} onClick={handleReactionClick(key)}>
                                            <img className='reactionItem' src={reactionList[key].image} />
                                        </Tooltip>
                                    ))
                                }

                            </Box>
                        }
                        disableInteractive={false}
                        sx={{ background: 'red' }}
                    >
                        {
                            comment.my_reaction_type && reactionList[comment.my_reaction_type] ?
                                <Button
                                    size='small'
                                    color='inherit'
                                    onClick={handleReactionClick('')}
                                    sx={{
                                        textTransform: 'unset',
                                        minWidth: 'unset',
                                        color: reactionList[comment.my_reaction_type].color
                                    }}
                                    startIcon={
                                        <Avatar alt={reactionList[comment.my_reaction_type].title} src={reactionList[comment.my_reaction_type].image} sx={{ width: 18, height: 18 }} />
                                    }
                                >
                                    {reactionList[comment.my_reaction_type].title}
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
                            <Button
                                size='small'
                                color='inherit'
                                sx={{ textTransform: 'unset', minWidth: 'unset' }}
                            >
                                {__('Tag')}
                            </Button>
                            :
                            <Button
                                size='small'
                                color='inherit'
                                onClick={() => setActiveReplyForm(prev => !prev)}
                                sx={{ textTransform: 'unset', minWidth: 'unset' }}
                            >
                                {__('Reply')}
                            </Button>
                    }
                </Box>
                {
                    comment_child_number.current > 0 &&
                    <Box
                        sx={{
                            display: 'flex',
                            cursor: 'pointer',
                            alignItems: 'center',
                            color: 'link',
                        }}
                        onClick={() => setShowCommentChild(prev => !prev)}
                    >
                        {
                            showCommentChild ?
                                <>
                                    <Icon icon="ArrowDropUp" />
                                    {
                                        comment_child_number.current > 1 ?
                                            __('Hide {{count}} replies', {
                                                count: comment_child_number.current
                                            })
                                            :
                                            __('Hide reply')
                                    }
                                </>
                                :
                                <>
                                    <Icon icon="ArrowDropDown" />
                                    {
                                        comment_child_number.current > 1 ?

                                            __('View {{count}} replies', {
                                                count: comment_child_number.current
                                            })
                                            :
                                            __('View reply', {
                                                count: comment_child_number.current
                                            })
                                    }
                                </>
                        }
                    </Box>
                }
            </Box>
            {
                level === 1 &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {
                        voteList.map(voteType => (
                            voteType.showCallBack !== undefined ?
                                <span key={voteType.key}>{voteType.showCallBack(voteSummary)}</span>
                                :
                                < Tooltip key={voteType.key} title={voteType.title} >
                                    <IconButton
                                        size='small'
                                        onClick={handleVoteClick(comment.my_vote === voteType.key ? '' : voteType.key)}
                                        color={comment.my_vote === voteType.key ? 'primary' : 'inherit'}
                                    >
                                        <Icon sx={{ fontSize: 40 }} icon={voteType.icon} />
                                    </IconButton>
                                </Tooltip>
                        ))
                    }
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
                    showCommentChild &&
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
                            <ImageLazyLoading src={getImageUrl(user.avatar, '/images/user-default.svg')} sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                            }} />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1,
                            }}
                        >
                            <DraftEditor
                                editorState={editorState}
                                setEditorState={setEditorState}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 1,
                                    mt: 2,
                                }}
                            >
                                <Button color="inherit" onClick={() => setActiveReplyForm(false)} >{__('Cancel')}</Button>
                                <LoadingButton
                                    disabled={!(editorState.getCurrentContent().hasText() && editorState.getCurrentContent().getPlainText().trim())}
                                    loading={isLoadingButton}
                                    loadingPosition="center"
                                    onClick={handleSubmitComment}
                                    variant="contained"
                                >{__('Post')}</LoadingButton>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        }
        {
            showCommentChild &&
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    paddingLeft: '70px',
                }}
            >
                {
                    comments && instructors ?
                        paginate.isLoading ?
                            <DiscussionLoading length={comment.comment_child_number >= 10 ? 10 : comment.comment_child_number} />
                            :
                            comments.data.map((item, index) => {
                                let label: {
                                    title?: string | undefined;
                                    icon?: IconFormat | undefined;
                                    color: string;
                                };

                                if (item.author) {
                                    if ((course.course_detail?.owner + '') === (item.author.id + '')) {
                                        label = getLabelProp('Product Owner');
                                    } else if (instructors[item.author.id] !== undefined) {
                                        label = getLabelProp(instructors[item.author.id].position);
                                    } else {
                                        label = getLabelProp('Student');
                                    }
                                } else {
                                    label = getLabelProp('Student');
                                }

                                return <CommentItem
                                    questionID={questionID}
                                    course={course}
                                    level={level + 1}
                                    label={label}
                                    comment={item}
                                    instructors={instructors}
                                    key={index}
                                    isLastComment={index === (comments.data.length - 1)}
                                />
                            })
                        :
                        <DiscussionLoading length={comment.comment_child_number >= 10 ? 10 : comment.comment_child_number} />
                }
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


const reactionList: {
    [key: string]: {
        key: string,
        title: string,
        color: string,
        image: string,
    }
} = {
    like: {
        key: 'like',
        title: 'Like',
        color: 'rgb(32, 120, 244)',
        image: '/images/like.gif',
    },
    love: {
        key: 'love',
        title: 'Love',
        color: 'rgb(243, 62, 88)',
        image: '/images/love.gif',
    },
    care: {
        key: 'care',
        title: 'Care',
        color: 'rgb(247, 177, 37)',
        image: '/images/care.gif',
    },
    haha: {
        key: 'haha',
        title: 'Haha',
        color: 'rgb(247, 177, 37)',
        image: '/images/haha.gif',
    },
    wow: {
        key: 'wow',
        title: 'Wow',
        color: 'rgb(247, 177, 37)',
        image: '/images/wow.gif',
    },
    sad: {
        key: 'sad',
        title: 'Sad',
        color: 'rgb(247, 177, 37)',
        image: '/images/sad.gif',
    },
    angry: {
        key: 'angry',
        title: 'Angry',
        color: 'rgb(233, 113, 15)',
        image: '/images/angry.gif',
    },
};


const voteList: Array<
    {
        key: string,
        title: string,
        icon?: string,
        showCallBack?: (summary: ReactionSummaryProps[] | null) => number
    }
> = [
        {
            key: 'useful',
            title: __('This answer is useful'),
            icon: 'ArrowDropUpOutlined',
        },
        {
            key: 'total',
            title: 'Total',
            showCallBack: (summary: ReactionSummaryProps[] | null) => {
                let total = 0;
                if (Array.isArray(summary)) {
                    summary.forEach(item => {
                        if (item.reaction_type === 'useful') {
                            total += parseInt(item.count + '');
                        } else {
                            total -= parseInt(item.count + '');
                        }
                    });
                }
                return total;
            }
        },
        {
            key: 'not_useful',
            title: __('This answer is not useful'),
            icon: 'ArrowDropDownOutlined',
        },
    ];



export default SectionDiscussion