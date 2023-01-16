import { Badge, Box, Button, Skeleton, Typography } from '@mui/material'
import Icon, { IconFormat } from 'components/atoms/Icon'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import Tooltip from 'components/atoms/Tooltip'
import Dialog from 'components/molecules/Dialog'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import useReportPostType from 'hook/useReportPostType'
import Comments from 'plugins/Vn4Comment/Comments'
import React from 'react'
import { ChapterAndLessonCurrentState, CourseProps } from 'services/courseService'
import elearningService, { InstructorProps } from 'services/elearningService'
import { QuestionAndAnswerProps } from 'services/elearningService/@type'
import QuestionAndAnswerItem from './QuestionAndAnswerItem'

function QuestionDetail({ chapterAndLessonCurrent, course, questionDetail, onClose, setQuestion }: {
    course: CourseProps,
    questionDetail: QuestionAndAnswerProps | null,
    chapterAndLessonCurrent: ChapterAndLessonCurrentState,
    onClose: () => void,
    setQuestion: (callback: (prev: QuestionAndAnswerProps) => QuestionAndAnswerProps) => void
}) {

    // const [questionDetail, setQuestionDetail] = React.useState<QuestionAndAnswerProps | null>(null);

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
        (async () => {

            const instructors = await elearningService.getInstructors(course.id);

            let instructorsById: { [key: ID]: InstructorProps } = {};

            if (instructors) {
                instructors.forEach(instructor => {
                    instructorsById[instructor.id] = instructor;
                });
            }
            setInstructors(instructorsById);
        })();
    }, []);

    let questionDetailDom: null | React.ReactElement = null;

    if (questionDetail) {
        questionDetailDom = (
            <>
                <QuestionAndAnswerItem
                    QAItem={questionDetail}
                    limitRowContent={100}
                    setQuestion={setQuestion}
                    handleOnChooseQuestion={() => {
                        //
                    }} />

                <Comments
                    keyComment={questionDetail.id}
                    type="vn4_comment_course_qa"
                    disableCountComment
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
    } else {
        questionDetailDom = (<>
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

    return (
        <Dialog
            open={questionDetail !== null}
            onClose={onClose}
            title={"Câu hỏi" + (questionDetail?.author?.title ? ' của ' + questionDetail?.author?.title : '')}
            sx={{
                '&>.MuiDialog-container>.MuiPaper-root': {
                    maxWidth: '100%',
                    width: 700,
                }
            }}
        >
            {
                questionDetailDom
            }
        </Dialog>
    )
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