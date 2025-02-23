import { LoadingButton } from '@mui/lab'
import { Box, Button, Rating, Typography } from '@mui/material'
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
            title={<Typography
                variant="h4"
                sx={{
                    fontWeight: 600,
                    color: 'primary.main'
                }}
            >
                {__('Đánh giá khóa học "{{course_title}}"', {
                    course_title: course.title
                })}
            </Typography>}
            open={open}
            onClose={onClose}
            disableIconClose
            action={
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                        width: '100%',
                    }}
                >
                    <Button variant='contained' sx={{ color: 'inherit' }} color='inherit' onClick={onClose}>Tôi sẽ đánh giá sau</Button>
                    <LoadingButton loading={isOnProcess} loadingPosition="center" color='success' variant='contained' onClick={() => formUpdateProfileRef.current?.submit()}>Đánh giá</LoadingButton>
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
                <Typography
                    sx={{
                        mb: 4,
                        color: 'text.secondary',
                        lineHeight: '1.8',
                        fontSize: '1.1rem'
                    }}
                >
                    Chỉ mất vài phút thôi nhưng đánh giá của bạn sẽ giúp chúng tôi cải thiện chất lượng khóa học và giúp những người học sau chọn được khóa học phù hợp với mình!
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <Typography
                        variant='h5'
                        sx={{
                            fontWeight: 500,
                            color: 'text.primary',
                            borderLeft: '4px solid',
                            borderColor: 'primary.main',
                            pl: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                        }}
                    >
                        Đánh giá của bạn sẽ được {post.is_incognito ? <Typography variant='h5' component='span' fontWeight={500} sx={{ color: 'error.main' }}>ẩn danh</Typography> : <Typography variant='h5' component='span' fontWeight={500} sx={{ color: 'success.main' }}>công khai</Typography>}
                    </Typography>
                    <Box>
                        <FieldForm
                            component='true_false'
                            config={{
                                title: 'ẩn danh',
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
                    </Box>
                </Box>

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
                                // rules: {
                                //     require: true,
                                //     minLength: 20,
                                //     maxLength: 255,
                                // },
                            }}
                            name="content"
                            onReview={(value) => {
                                setPost(prev => ({ ...prev, content: value }));
                            }}
                        />

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