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
    handleAfterConfimReview: (data: {
        rating: number,
        content: string,
    }) => void,
    data?: {
        rating: number,
        content: string,
        is_incognito: number,
    },
    open: boolean,
    onClose: () => void,
}) {

    // const [hover, setHover] = React.useState(-1);

    const formUpdateProfileRef = React.useRef<{
        submit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
    }>(null);


    const [isOnProcess, setIsOnProcess] = React.useState(false);

    const updateBitPoint = useUpdateBitPoint();

    const [post, setPost] = React.useState({
        course: course.slug,
        rating: data?.rating ?? 5,
        content: data?.content ?? '',
        // is_incognito: data?.is_incognito ? 1 : 0,
        is_incognito: 0,
    })

    const handleConfirmReview = (postForm: JsonFormat) => {

        setIsOnProcess(true);
        (async () => {
            // if (post.content) {
            const result = await elearningService.handleReviewCourse({ ...post, content: postForm.content });
            if (result.result) {
                if (result.bit_point?.add_in) {
                    updateBitPoint(result.bit_point.total);
                    window.showMessage(__('Chúc mừng bạn vừa được thêm {{bit}} bit!', {
                        bit: result.bit_point.add_in
                    }), 'success');
                }
                handleAfterConfimReview({
                    rating: post.rating,
                    content: post.content,
                });
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
                    <LoadingButton loading={isOnProcess} loadingPosition="center" variant='contained' onClick={() => formUpdateProfileRef.current?.submit()}>{__('Để lại đánh giá')}</LoadingButton>
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
                <Typography variant="h4">{__('Ơ kìa! Bạn định bỏ qua mà không đánh giá "{{course_title}}" thật sao?', {
                    course_title: course.title
                })}</Typography>
                <Typography sx={{ mt: 1, mb: 3, color: 'text.secondary', lineHeight: '26px' }}>
                    Khoan đã! Bạn đang định bỏ qua cơ hội chia sẻ trải nghiệm học tập của mình sao? Chỉ cần vài phút thôi mà! Đừng để những người học sau phải "mò kim đáy bể" nhé. Đánh giá chân thực của bạn sẽ là kim chỉ nam giúp chúng tôi nâng cao chất lượng khóa học và là ngọn đèn soi đường cho những người đang tìm kiếm khóa học phù hợp đấy!
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
                        postDefault={{
                            ...post,
                            // content: post.content ? post.content : template['template_' + post.rating as keyof typeof template] ? __(template['template_' + post.rating as keyof typeof template], {
                            //     name: course.title
                            // }) : ''
                        }}
                        ref={formUpdateProfileRef}
                        onFinish={handleConfirmReview}
                    >
                        <FieldForm
                            component='textarea'
                            config={{
                                title: __('Nội dung đánh giá'),
                                inputProps: {
                                    placeholder: __('Chia sẽ ý kiến của bạn về chất lượng khóa học'),
                                },
                                note: 'Viết một vài câu về cảm nhận của bạn cho đến nay khi học khóa học này.',
                                rules: {
                                    require: true,
                                    minLength: 20,
                                    maxLength: 255,
                                },
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

// const template = {
//     'template_1': 'Khóa học {{name}} quá tệ, không phải như những gì tôi mong đợi',
//     'template_2': 'Khóa học {{name}} thật tệ, Khá thất vọng',
//     'template_3': 'Khóa học {{name}} Trung bình, có thể tốt hơn',
//     'template_4': 'Khóa học {{name}} tương đối tốt, như những gì tôi mong đợi',
//     'template_5': 'Khóa học {{name}} thật tuyệt với, trên cả mong đợi!',
// };

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