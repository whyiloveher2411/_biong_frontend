import { Alert, Box, Button, Typography } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import Dialog from 'components/molecules/Dialog';
import { __ } from 'helpers/i18n';
import React from 'react';
import reportService from 'services/reportService';

function useReportPostType({
    dataProps,
    title = __('Báo cáo lạm dụng'),
    descriptionTop = __('Nội dung bị gắn cờ sẽ được nhân viên của chúng tôi xem xét để xác định xem nội dung đó có vi phạm Điều khoản dịch vụ hoặc Nguyên tắc cộng đồng hay không. Nếu bạn có câu hỏi hoặc vấn đề kỹ thuật, vui lòng liên hệ với nhóm Hỗ trợ của chúng tôi tại đây.'),
    descriptionBottom = __('Đối với các khóa học và người dùng bị gắn cờ, đội ngũ của chúng tôi xem xét liên tục 24/7 để xác định xem liệu họ có vi phạm hay không. Các tài khoản sẽ bị phạt nếu vi phạm, và những trường hợp vi phạm nghiêm trọng hoặc tái phạm nhiều lần có thể bị chấm dứt tài khoản.'),
    reasonList,
}: {
    title?: string,
    descriptionTop?: string,
    descriptionBottom?: string,
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

    const [post, setPost] = React.useState<{
        [key: string]: ANY,
        reason: string,
        description: string,
    }>({
        reason: '',
        description: '',
    });

    const onClose = () => {
        setOpen(false);
    };

    const handleReport = () => {
        if (dataProps.post) {
            for (let key in post) {

                if (!post[key]) {
                    window.showMessage('Vui lòng nhập đầy đủ thông tin báo cáo');
                    return;
                }
            }

            (async () => {
                const result = await reportService.post({
                    ...dataProps,
                    post: dataProps.post ?? 0,
                    ...post,
                });

                if (result) {
                    window.showMessage('Gửi báo cáo thành công, chúng tôi sẽ thông báo cho bạn biết khi có kết quả báo cáo.', 'success');
                    setPost({
                        reason: '',
                        description: '',
                    });
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
                    color="inherit">{__('Cancel')}</Button>
                <Button
                    variant='contained'
                    onClick={handleReport}
                >{__('Submit')}</Button>
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
                    {descriptionTop}
                </Alert>

                <FieldForm
                    component='select'
                    config={{
                        title: __('Reason'),
                        list_option: reasonList
                    }}
                    post={post}
                    name="reason"
                    onReview={(value) => {
                        setPost(prev => ({ ...prev, reason: value }))
                    }}
                />

                <FieldForm
                    component='textarea'
                    config={{
                        title: __('Chi tiết vấn đề'),
                    }}
                    post={post}
                    name="description"
                    onReview={(value) => {
                        setPost(prev => ({ ...prev, description: value }))
                    }}
                />

                <Typography variant='body2'>
                    {descriptionBottom}
                </Typography>
            </Box>
        </Dialog>
    }
}

export default useReportPostType
