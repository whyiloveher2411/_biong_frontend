import { Alert, Badge, Box, Typography } from '@mui/material'
import { useTheme } from '@mui/system'
import Icon, { IconFormat } from 'components/atoms/Icon'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import Tooltip from 'components/atoms/Tooltip'
import { getImageUrl } from 'helpers/image'
import Comments from 'plugins/Vn4Comment/Comments'
import React from 'react'
import { CourseProps } from 'services/courseService'
import { getLabelInstructor, useInstructors } from '../CourseLearning'
import CourseLearningContext from '../context/CourseLearningContext'

function SectionCommentLesson({ course }: { course: CourseProps }) {

    const courseLearningContext = React.useContext(CourseLearningContext);

    const theme = useTheme();

    const instructors = useInstructors(course.id);


    if (courseLearningContext.course && courseLearningContext.chapterAndLessonCurrent?.lessonID) {
        return (
            <Box
                sx={{
                    maxWidth: 800,
                    margin: '0 auto',
                    p: 3,
                }}
            >
                <Alert severity='info' icon={false}>
                    <Typography><strong>Mẹo:</strong> Nếu bài học là video, hãy mô tả bạn gặp vấn đề từ giây thứ mấy sẽ giúp chúng tôi nhanh chóng xác định vấn đề và có thể trả lời cho bạn nhanh chóng. ❤️❤️❤️</Typography>
                </Alert>
                <Comments
                    keyComment={courseLearningContext.chapterAndLessonCurrent.lessonID}
                    type="e_lesson_comment"
                    backgroundContentComment={theme.palette.mode === 'light' ? 'white' : 'commentItemBackground'}
                    customAvatar={(comment, level) => {

                        let label: {
                            title?: string | undefined;
                            icon?: IconFormat | undefined;
                            color: string;
                        };

                        if (comment.author) {
                            if ((courseLearningContext.course?.course_detail?.owner + '') === (comment.author.id + '')) {
                                label = getLabelInstructor('Product Owner');
                            } else if (instructors[comment.author.id] !== undefined) {
                                label = getLabelInstructor(instructors[comment.author.id].position);
                            } else {
                                label = getLabelInstructor('Student');
                            }
                        } else {
                            label = getLabelInstructor('Student');
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
            </Box>
        )
    }

    return null;
}

export default SectionCommentLesson