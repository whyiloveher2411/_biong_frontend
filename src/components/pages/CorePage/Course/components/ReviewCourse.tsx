import { LoadingButton } from '@mui/lab'
import { Box, Rating, Typography } from '@mui/material'
import FieldForm from 'components/atoms/fields/FieldForm'
import Icon from 'components/atoms/Icon'
import { __ } from 'helpers/i18n'
import React from 'react'
import { CourseProps } from 'services/courseService'
import elearningService from 'services/elearningService'

function ReviewCourse({
    course,
    handleAfterConfimReview,
    data
}: {
    course: CourseProps,
    handleAfterConfimReview: () => void,
    data?: {
        rating: number,
        content: string,
    }
}) {

    const [hover, setHover] = React.useState(-1);

    const [isOnProcess, setIsOnProcess] = React.useState(false);

    const [post, setPost] = React.useState({
        course: course.slug,
        rating: data?.rating ?? 5,
        content: data?.content ?? '',
    })

    const handleConfirmReview = () => {

        setIsOnProcess(true);

        (async () => {
            if (post.content) {
                const result = await elearningService.handleReviewCourse(post);

                if (result) {
                    handleAfterConfimReview();
                }

            } else {
                setIsOnProcess(false);
                window.showMessage(__('Vui lòng nhập nội dung đánh giá.'));
            }
        })()
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography align='center' variant='h5'>{__('Bạn thấy khóa học "{{course_title}}" thế nào?', {
                course_title: course.title
            })}</Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Rating
                    size="large"
                    value={post.rating}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                        if (newValue) {
                            setPost(prev => ({ ...prev, rating: newValue }));
                        }
                    }}
                    onChangeActive={(_event, newHover) => {
                        setHover(newHover);
                    }}
                    emptyIcon={<Icon icon="Star" style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
            </Box>
            <Typography align='center'>
                {post.rating !== null && (
                    labels[hover !== -1 ? hover : post.rating]
                )}
            </Typography>
            <FieldForm
                component='textarea'
                config={{
                    title: __('Content'),
                    inputProps: {
                        placeholder: __('Chia sẽ ý kiến của bạn về chất lượng khóa học'),
                    },
                    rows: 8,
                }}
                post={post}
                name="content"
                onReview={(value) => {
                    setPost(prev => ({ ...prev, content: value }));
                }}
            />
            <LoadingButton loading={isOnProcess} loadingPosition="center" onClick={handleConfirmReview} variant='contained'>{__('Confirm')}</LoadingButton>
        </Box>
    )
}

export default ReviewCourse

function getLabelText(value: number) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const labels: { [index: string]: string } = {
    1: __('Awful, not what I expected at all'),
    2: __('Poor, pretty disappointed'),
    3: __('Average, could be better'),
    4: __('Good, what I expected'),
    5: __('Amazing, above expectations!'),
};