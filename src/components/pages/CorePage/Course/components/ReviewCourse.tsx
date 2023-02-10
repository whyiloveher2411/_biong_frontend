import { LoadingButton } from '@mui/lab'
import { Box, Rating, Typography } from '@mui/material'
import FieldForm from 'components/atoms/fields/FieldForm'
import FormWrapper from 'components/atoms/fields/FormWrapper'
import Icon from 'components/atoms/Icon'
import Dialog from 'components/molecules/Dialog'
import { __ } from 'helpers/i18n'
import React from 'react'
import { CourseProps } from 'services/courseService'
import elearningService from 'services/elearningService'
import { useUpdateBitPoint } from 'store/user/user.reducers'

function ReviewCourse({
    course,
    handleAfterConfimReview,
    data,
    open,
    onClose
}: {
    course: CourseProps,
    handleAfterConfimReview: () => void,
    data?: {
        rating: number,
        content: string,
        is_incognito: number,
    },
    open: boolean,
    onClose: () => void,
}) {

    // const [hover, setHover] = React.useState(-1);

    const [isOnProcess, setIsOnProcess] = React.useState(false);

    const updateBitPoint = useUpdateBitPoint();

    const [post, setPost] = React.useState({
        course: course.slug,
        rating: data?.rating ?? 5,
        content: data?.content ?? '',
        // is_incognito: data?.is_incognito ? 1 : 0,
        is_incognito: 0,
    })

    const handleConfirmReview = () => {

        setIsOnProcess(true);
        (async () => {
            // if (post.content) {
            const result = await elearningService.handleReviewCourse(post);
            if (result.result) {
                if (result.bit_point?.add_in) {
                    updateBitPoint(result.bit_point.total);
                    window.showMessage(__('Chúc mừng bạn vừa được thêm {{bit}} bit, Hãy tiếp tục cố gắng nhé!', {
                        bit: result.bit_point.add_in
                    }), 'success');
                }
                handleAfterConfimReview();
            }
            // } else {
            // window.showMessage(__('Vui lòng nhập nội dung đánh giá.'));
            // }
            setIsOnProcess(false);
        })()
    };

    return (
        <Dialog
            title={__('Đánh giá khóa học')}
            open={open}
            onClose={onClose}
            action={
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                    }}
                >
                    <LoadingButton loading={isOnProcess} loadingPosition="center" variant='contained' onClick={handleConfirmReview}>{__('Để lại đánh giá')}</LoadingButton>
                </Box>
            }
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    '& textarea.MuiInputBase-input': {
                        minHeight: '48px',
                    }
                }}
            >
                <Typography variant="h4">{__('Bạn thấy khóa học "{{course_title}}" thế nào?', {
                    course_title: course.title
                })}</Typography>
                <Typography sx={{ mt: 1, mb: 3, color: 'text.secondary', lineHeight: '26px' }}>
                    Để lại một đánh giá sẽ giúp chúng tôi quản lý nội dung tốt hơn cho tất cả những người tìm hiểu về khóa học. Chọn một đánh giá trong số 5 sao và cho chúng tôi biết một chút bạn nghĩ gì về khóa học trong một vài từ.
                </Typography>

                <Typography variant='h5' sx={{ mb: 1 }}>Đánh giá của bạn sẽ được công khai</Typography>

                <Rating
                    size="large"
                    value={post.rating}
                    // getLabelText={getLabelText}
                    onChange={(_event, newValue) => {
                        if (newValue) {
                            setPost(prev => ({ ...prev, rating: newValue }));
                        }
                    }}
                    // onChangeActive={(_event, newHover) => {
                    //     setHover(newHover);
                    // }}
                    emptyIcon={<Icon icon="Star" style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                {/* <Typography align='center'>
                    {post.rating !== null && (
                        labels[hover !== -1 ? hover : post.rating]
                    )}
                </Typography> */}
                <Box
                    sx={{ mt: 3 }}
                >
                    <FormWrapper
                        postDefault={post}
                    >
                        <FieldForm
                            component='textarea'
                            config={{
                                title: __('Nội dung đánh giá'),
                                inputProps: {
                                    placeholder: __('Chia sẽ ý kiến của bạn về chất lượng khóa học'),
                                },
                                note: 'Viết một vài câu về cảm nhận của bạn cho đến nay khi học khóa học này.',
                            }}
                            name="content"
                            onReview={(value) => {
                                setPost(prev => ({ ...prev, content: value }));
                            }}
                        />
                        {/* <Box
                        sx={{ mt: 1 }}
                    >
                        <FieldForm
                            component='true_false'
                            config={{
                                title: 'Đăng ẩn danh',
                            }}
                            post={post}
                            name="is_incognito"
                            onReview={(value) => {
                                setPost(prev => ({
                                    ...prev,
                                    is_incognito: value ? 1 : 0,
                                }))
                            }}
                        />
                    </Box> */}
                    </FormWrapper>
                </Box>
            </Box>
        </Dialog>
    )
}

export default ReviewCourse

// function getLabelText(value: number) {
//     return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
// }

// const labels: { [index: string]: string } = {
//     1: __('Kinh khủng, không phải như những gì tôi mong đợi'),
//     2: __('Khá thất vọng'),
//     3: __('Trung bình, có thể tốt hơn'),
//     4: __('Tốt, như những gì tôi mong đợi'),
//     5: __('Thật tuyệt vời, trên cả mong đợi!'),
// };