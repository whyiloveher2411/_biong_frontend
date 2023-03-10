import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Typography } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import { FormData, useFormWrapper } from 'components/atoms/fields/FormWrapper';
import Dialog from 'components/molecules/Dialog';
import { __ } from 'helpers/i18n';
import React from 'react';
import { Link } from 'react-router-dom';
import reportService from 'services/reportService';

function useReportPostType({
    dataProps,
    title = __('Báo cáo lạm dụng'),
    descriptionTop = __('Nội dung bị gắn cờ sẽ được xem xét để xác định xem nội dung đó có vi phạm Điều khoản dịch vụ hoặc Nguyên tắc cộng đồng hay không. Nếu bạn có câu hỏi hoặc vấn đề kỹ thuật, vui lòng liên hệ với nhóm Hỗ trợ của chúng tôi'),
    descriptionBottom = __('Đối với các khóa học và người dùng bị gắn cờ, chúng tôi xem xét liên tục 24/7 để xác định xem liệu họ có vi phạm hay không. Các tài khoản sẽ bị phạt nếu vi phạm, và những trường hợp vi phạm nghiêm trọng hoặc tái phạm nhiều lần có thể bị chấm dứt tài khoản.'),
    reasonList,
}: {
    title?: string,
    descriptionTop?: string,
    descriptionBottom?: React.ReactNode,
    reasonList: {
        [key: string]: {
            title: string,
        }
    },
    dataProps: {
        post: ID | undefined,
        type: string,
    }
}) {

    const [open, setOpen] = React.useState(false);

    const [onLoading, setOnloading] = React.useState(false);

    const formWarpper = useFormWrapper({
        onFinish: (post) => {
            handleReport(post)
        }
    })

    // const [post, setPost] = React.useState<{
    //     [key: string]: ANY,
    //     reason: string,
    //     description: string,
    // }>({
    //     reason: '',
    //     description: '',
    // });



    const onClose = () => {
        setOpen(false);
    };

    const handleReport = (post: FormData) => {
        if (dataProps.post) {
            setOnloading(true);
            (async () => {
                const result = await reportService.post({
                    ...dataProps,
                    post: dataProps.post ?? 0,
                    reason: post.reason,
                    description: post.description,
                });

                if (result) {
                    window.showMessage('Gửi báo cáo thành công, chúng tôi sẽ thông báo cho bạn biết khi có kết quả báo cáo.', 'success');
                    setOnloading(false);
                    setOpen(false);
                }
            })()
        }
    }

    return {
        open: () => setOpen(true),
        close: () => setOpen(false),
        component: <Dialog
            title={title}
            open={open}
            onClose={onClose}
            maxWidth={'xs'}
            action={<>
                <Button
                    onClick={onClose}
                    color="inherit">{__('Hủy bỏ')}
                </Button>
                <LoadingButton
                    loading={onLoading}
                    variant='contained'
                    onClick={() => {
                        formWarpper.onSubmit()
                    }}
                >{__('Gửi báo cáo')}</LoadingButton>
            </>}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <Alert color='info' >
                    {descriptionTop} <Link to='/contact-us'>Tại đây.</Link>
                </Alert>

                {
                    formWarpper.renderFormWrapper(
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            <FieldForm
                                component='select'
                                config={{
                                    title: __('Lý do'),
                                    list_option: reasonList,
                                    rules: {
                                        require: true,
                                    }
                                }}
                                // post={post}
                                name="reason"
                            // onReview={(value) => {
                            //     setPost(prev => ({ ...prev, reason: value }))
                            // }}
                            />

                            <FieldForm
                                component='textarea'
                                config={{
                                    title: __('Chi tiết vấn đề'),
                                    rules: {
                                        require: true,
                                    }
                                }}
                                // post={post}
                                name="description"
                            // onReview={(value) => {
                            //     setPost(prev => ({ ...prev, description: value }))
                            // }}
                            />
                        </Box>
                    )
                }

                {
                    typeof descriptionBottom === 'string' ?
                        <Typography variant='body2'>
                            {descriptionBottom}
                        </Typography>
                        :
                        descriptionBottom
                }
            </Box>
        </Dialog>
    }
}

export default useReportPostType
