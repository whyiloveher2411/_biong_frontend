import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon'
import Dialog from 'components/molecules/Dialog'
import React from 'react'
import courseService from 'services/courseService'
import CourseLearningContext from '../context/CourseLearningContext'

function FirstNotifi({ open, onClose }: { open: boolean, onClose: () => void }) {

    const courseLearningContext = React.useContext(CourseLearningContext);

    const showLoading = React.useState(false);

    const handleClickHidden = async () => {
        showLoading[1](true);
        if (courseLearningContext.course) {
            const result = await courseService.clostNotiFirst(courseLearningContext.course.id);
            showLoading[1](false);
            if (result) {
                onClose();
            }
        }
    }

    return (
        <Dialog
            title="Thông tin liên hệ"
            open={open}
            disableIconClose
            onClose={() => {
                //
            }}
            action={<LoadingButton
                loading={showLoading[0]}
                onClick={handleClickHidden}
                variant='contained'>
                Tôi đã hiểu
            </LoadingButton>}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 1.5,
                    flexDirection: 'column',
                    '& a': {
                        color: 'primary.main',
                    }
                }}
            >
                <Typography sx={{ fontSize: 18, lineHeight: '26px', }}>Ngoài phần hỏi đáp ở mỗi bài học, nếu có bất kỳ thắc mắc nào, bạn có thể liên hệ với chúng tôi qua các kênh sau:</Typography>
                <Typography sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center', }}><Icon icon="FacebookOutlined" /> Trang facebook chính thức của <a target='_blank' href="https://www.facebook.com/spacedev.vn/">Spacedev.vn</a></Typography>
                <Typography sx={{ display: 'flex', gap: 1, alignItems: 'center', }}><Icon icon="Facebook" /> Cộng đồng <a target='_blank' href="https://www.facebook.com/groups/fullstacknodejsreactjs">lập trình fullstack (Notejs/Reactjs)</a></Typography>
                <Typography sx={{ display: 'flex', gap: 1, alignItems: 'center', }}><Icon icon="LanguageOutlined" /> Liên hệ trực tiếp trên website <a target='_blank' href="https://spacedev.vn/contact-us">tại đây</a></Typography>
                <Typography sx={{ pb: 1, display: 'flex', gap: 1, alignItems: 'center', }}><Icon icon="LocalPhoneOutlined" /> Số điện thoại tư vấn trực tiếp <a href='tel:0886871094'>0886871094</a> (Quân)</Typography>
            </Box>
        </Dialog>
    )
}

export default FirstNotifi