import { Badge, Box, Button, Skeleton, Typography } from '@mui/material'
import Icon, { IconFormat } from 'components/atoms/Icon'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import MoreButton from 'components/atoms/MoreButton'
import Tooltip from 'components/atoms/Tooltip'
import { dateTimefromNow } from 'helpers/date'
import { cssMaxLine } from 'helpers/dom'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import useReportPostType from 'hook/useReportPostType'
import Comments from 'plugins/Vn4Comment/Comments'
import React from 'react'
import { ChapterAndLessonCurrentState, CourseProps } from 'services/courseService'
import elearningService, { InstructorProps } from 'services/elearningService'
import { QuestionAndAnswerProps } from 'services/elearningService/@type'

function QuestionDetail({ questionID, onBack, chapterAndLessonCurrent, course, handleOnLoadQA }: {
    questionID: ID,
    onBack: () => void,
    course: CourseProps,
    chapterAndLessonCurrent: ChapterAndLessonCurrentState,
    handleOnLoadQA: () => void,
}) {

    const [questionDetail, setQuestionDetail] = React.useState<QuestionAndAnswerProps | null>(null);

    const dialogReport = useReportPostType({
        dataProps: {
            post: questionDetail?.id,
            type: 'vn4_report_course_qa',
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

    const [instructors, setInstructors] = React.useState<{ [key: ID]: InstructorProps }>({});

    React.useEffect(() => {

        const question = elearningService.qa.getDetail({
            chapterID: chapterAndLessonCurrent.chapterID,
            courseID: course.id,
            lessonID: chapterAndLessonCurrent.lessonID,
            questionID: questionID,
        });

        const instructors = elearningService.getInstructors(course.id);

        Promise.all([question, instructors, new Promise(s => setTimeout(s, 500))]).then(([question, instructors]) => {
            if (question) {
                setQuestionDetail(question);

                let instructorsById: { [key: ID]: InstructorProps } = {};

                if (instructors) {
                    instructors.forEach(instructor => {
                        instructorsById[instructor.id] = instructor;
                    });
                }

                setInstructors(instructorsById);
            } else {
                onBack();
            }
        });

        // (async () => {
        //     const question = await elearningService.qa.getDetail({
        //         chapterID: chapterAndLessonCurrent.chapterID,
        //         courseID: course.id,
        //         lessonID: chapterAndLessonCurrent.lessonID,
        //         questionID: questionID,
        //     });
        // })()
    }, []);

    if (questionDetail) {
        return (
            <>
                <Button
                    color='inherit'
                    variant='outlined'
                    disableRipple
                    onClick={onBack}
                    sx={{
                        mb: 3
                    }}
                    startIcon={<Icon icon="ArrowBackRounded" />}
                >
                    {__('Quay lại trang danh sách')}
                </Button>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        mb: 5,
                    }}
                >
                    {
                        questionDetail.is_incognito ?
                            <Box
                                sx={{
                                    borderRadius: '50%',
                                    p: '3px',
                                    width: 54,
                                    height: 54,
                                    cursor: 'pointer',
                                    backgroundColor: 'primary.main',
                                    '& .MuiBadge-badge': {
                                        top: 40,
                                        width: 20,
                                        height: 20,
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                    }
                                }}
                            >
                                <Tooltip title={'Người dùng ẩn danh'}>
                                    <Badge badgeContent={<Icon sx={{ width: 16 }} icon={'StarOutlined'} />}>
                                        <ImageLazyLoading src={'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMTIwdjEyMEgweiIvPjxwYXRoIGQ9Ik02MCAwYzMzLjEzNyAwIDYwIDI2Ljg2MyA2MCA2MHMtMjYuODYzIDYwLTYwIDYwUzAgOTMuMTM3IDAgNjAgMjYuODYzIDAgNjAgMHptMTcuNSA2NC44MzdjLTYuNDU2IDAtMTEuODIyIDQuNTAyLTEzLjIyMiAxMC41MTYtMy4yNjctMS4zOTctNi4zLTEuMDA5LTguNTU2LS4wMzlDNTQuMjgzIDY5LjMgNDguOTE3IDY0LjgzNyA0Mi41IDY0LjgzN2MtNy41MDYgMC0xMy42MTEgNi4wOTItMTMuNjExIDEzLjU4MkMyOC44ODkgODUuOTA4IDM0Ljk5NCA5MiA0Mi41IDkyYzcuMTU2IDAgMTIuOTUtNS41MSAxMy40OTQtMTIuNDk1IDEuMTY3LS44MTUgNC4yNC0yLjMyOCA4LjAxMi4wNzhDNjQuNjI4IDg2LjUyOSA3MC4zODMgOTIgNzcuNSA5MmM3LjUwNiAwIDEzLjYxMS02LjA5MiAxMy42MTEtMTMuNTgxIDAtNy40OS02LjEwNS0xMy41ODItMTMuNjExLTEzLjU4MnptLTM1IDMuODhjNS4zNjcgMCA5LjcyMiA0LjM0NyA5LjcyMiA5LjcwMiAwIDUuMzU1LTQuMzU1IDkuNy05LjcyMiA5LjctNS4zNjcgMC05LjcyMi00LjM0NS05LjcyMi05LjcgMC01LjM1NSA0LjM1NS05LjcwMSA5LjcyMi05LjcwMXptMzUgMGM1LjM2NyAwIDkuNzIyIDQuMzQ3IDkuNzIyIDkuNzAyIDAgNS4zNTUtNC4zNTUgOS43LTkuNzIyIDkuNy01LjM2NyAwLTkuNzIyLTQuMzQ1LTkuNzIyLTkuNyAwLTUuMzU1IDQuMzU1LTkuNzAxIDkuNzIyLTkuNzAxek05NSA1N0gyNXY0aDcwdi00ek03Mi44NzQgMjkuMzRjLS44LTEuODItMi44NjYtMi43OC00Ljc4NS0yLjE0M0w2MCAyOS45MTRsLTguMTI4LTIuNzE3LS4xOTItLjA1OGMtMS45MjgtLjUzMy0zLjk1NC41MS00LjY2OSAyLjM4N0wzOC4xNDQgNTNoNDMuNzEyTDcyLjk1IDI5LjUyNnoiIGZpbGw9IiNEQURDRTAiLz48L2c+PC9zdmc+'} sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: '50%',
                                        }} />
                                    </Badge>
                                </Tooltip>
                            </Box>
                            :
                            <Box
                                sx={{
                                    p: '3px',
                                    width: 54,
                                    height: 54,
                                }}
                            >
                                <ImageLazyLoading
                                    src={getImageUrl(questionDetail.author?.avatar, '/images/user-default.svg')}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                    }}
                                />
                            </Box>
                    }
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box>
                                <Typography
                                    variant='h5'
                                >
                                    {questionDetail.title}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        mt: 1,
                                        mb: 2,
                                        alignItems: 'center',
                                    }}
                                >
                                    {
                                        questionDetail.is_incognito ?
                                            <Typography>{__('Người dùng ẩn danh')}</Typography>
                                            :
                                            <Typography>{questionDetail.author?.title}</Typography>
                                    }
                                    · <Typography
                                        sx={{
                                            ...cssMaxLine(1),
                                            maxWidth: '50%'
                                        }}>{questionDetail.lesson.title}</Typography>
                                    · <span>{dateTimefromNow(questionDetail.created_at)}</span>
                                    {/*
                                    <Link>{questionDetail.author.title}</Link>
                                    · <Link>{questionDetail.lesson.title}</Link>
                                    · <span>{dateTimefromNow(questionDetail.created_at)}</span> */}
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    width: 100,
                                }}
                            >
                                <Button endIcon={<Icon icon='ArrowUpwardRounded' />}>{questionDetail.vote_count ?? 0}</Button>
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
                        </Box>
                        <div dangerouslySetInnerHTML={{ __html: questionDetail.content }} />
                    </Box>
                </Box>
                <Comments
                    keyComment={questionID}
                    type="vn4_comment_course_qa"
                    followType='vn4_elearning_course_qa_follow'
                    activeVote
                    customAvatar={(comment, level) => {

                        let label: {
                            title?: string | undefined;
                            icon?: IconFormat | undefined;
                            color: string;
                        };

                        if (comment.author) {
                            if ((course.course_detail?.owner + '') === (comment.author.id + '')) {
                                label = getLabelProp('Product Owner');
                            } else if (instructors[comment.author.id] !== undefined) {
                                label = getLabelProp(instructors[comment.author.id].position);
                            } else {
                                label = getLabelProp('Student');
                            }
                        } else {
                            label = getLabelProp('Student');
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

                        return <Box
                            sx={{
                                borderRadius: '50%',
                                p: '3px',
                                width: style.avatarWraper,
                                height: style.avatarWraper,
                                cursor: 'pointer',
                                background: label.color,
                                '& .MuiBadge-badge': {
                                    top: level === 1 ? 40 : 20,
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
                    }}
                />
                {
                    dialogReport.component
                }
            </>
        )
    }

    return (<>
        <Skeleton variant='rectangular'
            sx={{
                mb: 3
            }}>
            <Button
                color='inherit'
                variant='outlined'
            >
                {__('Back to all questions')}
            </Button>
        </Skeleton>
        <Box
            sx={{
                display: 'flex',
                gap: 2,
            }}
        >
            <Box
                sx={{
                    width: 48,
                }}
            >
                <Skeleton variant='circular'
                    sx={{
                        width: 48,
                        height: 48,
                    }}
                />
            </Box>
            <Box
                sx={{
                    width: '100%'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box>
                        <Skeleton variant='text'>
                            <Typography
                                variant='h5'
                                noWrap
                            >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </Typography>
                        </Skeleton>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                mt: 1,
                                mb: 2,
                            }}
                        >
                            <Skeleton variant='text'>
                                <span style={{ whiteSpace: 'nowrap' }}>Dang Thuyen Quan</span>
                            </Skeleton>
                            <Skeleton variant='text'>
                                <span style={{ whiteSpace: 'nowrap' }}>Introduction to HTML</span>
                            </Skeleton>
                            <Skeleton variant='text'>
                                <span style={{ whiteSpace: 'nowrap' }}>2022-04-28 14:42:32</span>
                            </Skeleton>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1,
                        }}
                    >
                        <Skeleton>
                            <Button>0</Button>
                        </Skeleton>
                        <Skeleton>
                            <Button>0</Button>
                        </Skeleton>
                    </Box>
                </Box>
                <Box>
                    <Skeleton variant='rectangular' sx={{ width: '100%' }}>
                        <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos ipsam sit eaque aliquid blanditiis adipisci officiis illum ea. Officiis cumque distinctio ipsam placeat sequi exercitationem architecto molestias optio delectus suscipit!</Typography>
                    </Skeleton>
                    <Skeleton variant='rectangular' sx={{ width: '100%', mt: 1 }}>
                        <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos ipsam sit eaque aliquid blanditiis adipisci officiis illum ea. Officiis cumque distinctio ipsam placeat sequi exercitationem architecto molestias optio delectus suscipit!</Typography>
                    </Skeleton>
                </Box>
            </Box>
        </Box>
    </>);
}

export default QuestionDetail


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