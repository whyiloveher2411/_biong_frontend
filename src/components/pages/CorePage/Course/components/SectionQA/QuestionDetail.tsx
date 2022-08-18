import { Box, Button, Link, Skeleton, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import MoreButton from 'components/atoms/MoreButton'
import { dateTimefromNow } from 'helpers/date'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import React from 'react'
import { ChapterAndLessonCurrentState, CourseProps } from 'services/courseService'
import elearningService from 'services/elearningService'
import { QuestionAndAnswerProps } from 'services/elearningService/@type'
import SectionDiscussion from '../SectionDiscussion'

function QuestionDetail({ questionID, onBack, chapterAndLessonCurrent, course }: {
    questionID: ID,
    onBack: () => void,
    course: CourseProps,
    chapterAndLessonCurrent: ChapterAndLessonCurrentState,
}) {

    const [questionDetail, setQuestionDetail] = React.useState<QuestionAndAnswerProps | null>(null);

    React.useEffect(() => {

        const question = elearningService.qa.getDetail({
            chapterID: chapterAndLessonCurrent.chapterID,
            courseID: course.id,
            lessonID: chapterAndLessonCurrent.lessonID,
            questionID: questionID,
        });

        Promise.all([question, new Promise(s => setTimeout(s, 500))]).then(([question]) => {
            setQuestionDetail(question);
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
                >
                    {__('Quay lại trang danh sách')}
                </Button>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            p: '3px',
                            width: 54,
                            height: 54,
                        }}
                    >
                        <ImageLazyLoading
                            src={getImageUrl(questionDetail.author.avatar, '/images/user-default.svg')}
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            width: '100%'
                        }}
                    >
                        <Typography
                            variant='h5'
                        >
                            {questionDetail.title}
                        </Typography>
                        <Typography
                            variant='body2'
                            sx={{
                                display: 'flex',
                                gap: 1,
                                mt: 1,
                                mb: 2,
                            }}
                        >
                            <Link>{questionDetail.author.title}</Link>
                            · <Link>{questionDetail.lesson.title}</Link>
                            · <span>{dateTimefromNow(questionDetail.created_at)}</span>
                        </Typography>
                        <div dangerouslySetInnerHTML={{ __html: questionDetail.content }} />

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
                                                //
                                            },
                                            icon: 'ReportGmailerrorredRounded',
                                        }
                                    }
                                ]
                            }
                        />
                    </Box>

                </Box>
                <SectionDiscussion questionID={questionID} chapterAndLessonCurrent={chapterAndLessonCurrent} course={course} />
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
                <Skeleton>
                    <Typography
                        variant='h5'
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </Typography>
                </Skeleton>
                <Typography
                    variant='body2'
                    sx={{
                        display: 'flex',
                        gap: 1,
                        mt: 1,
                        mb: 2,
                    }}
                >
                    <Skeleton>
                        <span>Dang Thuyen Quan</span>
                    </Skeleton>
                    <Skeleton>
                        <span>Introduction to HTML</span>
                    </Skeleton>
                    <Skeleton>
                        <span>2022-04-28 14:42:32</span>
                    </Skeleton>
                </Typography>
                <Skeleton variant='rectangular'>
                    <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos ipsam sit eaque aliquid blanditiis adipisci officiis illum ea. Officiis cumque distinctio ipsam placeat sequi exercitationem architecto molestias optio delectus suscipit!</Typography>
                </Skeleton>
                <Skeleton variant='rectangular' sx={{ mt: 1 }}>
                    <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos ipsam sit eaque aliquid blanditiis adipisci officiis illum ea. Officiis cumque distinctio ipsam placeat sequi exercitationem architecto molestias optio delectus suscipit!</Typography>
                </Skeleton>
            </Box>
            <Box
                sx={{
                    width: 100,
                }}
            >
                <Skeleton>
                    <Button endIcon={<Icon icon='ArrowUpwardRounded' />}>0</Button>
                </Skeleton>
                <Skeleton>
                    <Button endIcon={<Icon icon='ChatBubbleOutlineOutlined' />}>0</Button>
                </Skeleton>
            </Box>

        </Box>
    </>);
}

export default QuestionDetail