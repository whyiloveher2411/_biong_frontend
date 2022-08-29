import { LoadingButton } from '@mui/lab';
import { Avatar, AvatarGroup, Badge, Box, Button, IconButton, Paper, Skeleton, Theme, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import DraftEditor, { getDarftContent } from 'components/atoms/DraftEditor';
import DraftEditorView from 'components/atoms/DraftEditor/DraftEditorView';
import Icon, { IconFormat } from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import makeCSS from 'components/atoms/makeCSS';
import MoreButton from 'components/atoms/MoreButton';
import { PaginationProps } from 'components/atoms/TablePagination';
import Tooltip from 'components/atoms/Tooltip';
import { EditorState } from 'draft-js';
import { dateTimefromNow } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import usePaginate from 'hook/usePaginate';
import useReportPostType from 'hook/useReportPostType';
import React from 'react';
import { useSelector } from 'react-redux';
import commentService, { CommentProps } from 'services/commentService';
import courseService, { CourseProps } from 'services/courseService';
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
    questionID,
    isFollow,
    handleOnLoadQA
}: {
    course: CourseProps,
    questionID: ID,
    isFollow: string,
    handleOnLoadQA: () => void,
}) {

    const classes = useStyle();

    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );

    const [comments, setComments] = React.useState<PaginationProps<CommentProps> | null>(null);

    const [myFollow, setMyFollow] = React.useState(isFollow);
    const [loadingButtonFollow, setLoadingButtonFollow] = React.useState(false);

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
                        {__('Đăng')}
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
                            __('{{reply_count}} trả lời', {
                                reply_count: comments.total
                            }) :
                            __('{{reply_count}} trả lời', {
                                reply_count: comments.total
                            })
                    }</Typography>
                    <LoadingButton
                        loading={loadingButtonFollow}
                        color="inherit"
                        variant='outlined'
                        onClick={async () => {
                            setLoadingButtonFollow(true);
                            const result: {
                                summary: { [key: string]: ReactionSummaryProps } | null,
                                my_reaction: string,
                            } = await reactionService.post({
                                post: questionID,
                                reaction: myFollow === 'follow' ? '' : 'follow',
                                type: 'vn4_comment_course_qa_follow',
                            });

                            setMyFollow(result.my_reaction);
                            setLoadingButtonFollow(false);
                            handleOnLoadQA()
                        }}
                    >
                        {myFollow === 'follow' ? __('Bỏ theo dõi câu hỏi này') : __('Theo dõi câu trả lời')}
                    </LoadingButton>
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
        </Box >
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

                return <CommentItem key={index} questionID={questionID} course={course} label={label} comment={item} instructors={instructors} level={1} />
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
                title: __('Giảng viên'),
                icon: 'BookmarksOutlined',
                color: '#ed6c02',
            };
        case 'Mentor':
            return {
                title: __('Trợ giảng'),
                icon: 'PriorityHighRounded',
                color: '#3f51b5',
            };
        case 'Product Owner':
            return {
                title: __('Chủ sở hữu khóa học'),
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
                                    {__('Phản hồi')}
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

    const [voteSummary, setVoteSummary] = React.useState<{
        [K in VoteType]: number
    }>({
        useful: comment.count_useful ?? 0,
        not_useful: comment.count_not_useful ?? 0,
    });

    const user = useSelector((state: RootState) => state.user);

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const [activeReplyForm, setActiveReplyForm] = React.useState(false);

    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );

    const [showCommentChild, setShowCommentChild] = React.useState(false);

    const dialogReport = useReportPostType({
        dataProps: {
            post: comment.id,
            type: 'vn4_report_comment_qa',
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

    const [comments, setComments] = React.useState<CommentProps[] | null>(null);

    // const paginate = usePaginate<CommentProps>({
    //     name: 'commentItem-' + questionID,
    //     template: 'page',
    //     onChange: async (data) => {
    //         await loadComments(data.current_page, data.per_page);
    //     },
    //     pagination: comments,
    //     data: {
    //         current_page: 0,
    //         per_page: 10
    //     }
    // });

    React.useEffect(() => {
        if (showCommentChild && comments === null) {
            loadComments(0, 10);
        }
    }, [showCommentChild]);

    const loadComments = async (current_page: number, per_page: number) => {
        const comments = await courseService.getCommentsChildren({
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
                summary: { [key: string]: ReactionSummaryProps } | null,
                my_reaction: string,
            } = await reactionService.post({
                post: comment.id,
                reaction: type,
                type: REACTION_COURSE_COMMENT_TYPE,
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
                type: QA_VOTE_TYPE,
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
                gap: 2,
                position: 'relative',
            }}
        >
            {
                Boolean((showCommentChild && comments?.length) || (activeReplyForm && level <= 3)) &&
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
                    <Paper elevation={0} sx={{ padding: '8px 12px', position: 'relative', backgroundColor: 'commentItemBackground' }}>
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
                                    report: {
                                        title: __('Báo cáo vi phạm'),
                                        action: () => {
                                            dialogReport.open();
                                        },
                                        icon: 'ReportGmailerrorredRounded',
                                    }
                                }
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
                                    reactionType.map((key) => (
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
                                            __('Ẩn {{count}} bình luận', {
                                                count: comment_child_number.current
                                            })
                                            :
                                            __('Ẩn phản hồi')
                                    }
                                </>
                                :
                                <>
                                    <Icon icon="ArrowDropDown" />
                                    {
                                        comment_child_number.current > 1 ?

                                            __('Xem {{count}} bình luận', {
                                                count: comment_child_number.current
                                            })
                                            :
                                            __('Xem phản hồi', {
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
                        comments.map((item, index) => {
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
                                isLastComment={index === (comments.length - 1)}
                            />
                        })
                        :
                        <DiscussionLoading length={comment.comment_child_number >= 10 ? 10 : comment.comment_child_number} />
                }
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



export default SectionDiscussion