import { Box, Button, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import Dialog from 'components/molecules/Dialog';
import React from 'react'
import CourseLearningContext from '../context/CourseLearningContext';
import courseService from 'services/courseService';

function ButtonGroupHelper({ open, onClose, onOpen }: { open: boolean, onClose: () => void, onOpen: () => void }) {

    const courseLearningContext = React.useContext(CourseLearningContext);

    const handleClickHidden = () => {
        if (courseLearningContext.course) {
            courseService.clostNotiFirst(courseLearningContext.course.id);
        }
        onClose();
    }

    return (<>
        <Button
            color='inherit'
            startIcon={<Icon icon="Groups2Outlined" />}
            sx={{ textTransform: 'none', fontWeight: 400 }}
            onClick={onOpen}
        >
            Cộng đồng hỗ trợ
        </Button>
        <Dialog
            title="Thông tin liên hệ"
            open={open}
            disableIconClose
            onClose={onClose}
            action={<Button
                onClick={handleClickHidden}
                variant='contained'>
                Tôi đã hiểu
            </Button>}
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
                <Typography sx={{ display: 'flex', gap: 1, alignItems: 'center', }}><Icon icon="Groups2Outlined" /> Cộng đồng <a target='_blank' href="https://www.facebook.com/groups/1653227468954919">Cộng đồng học lập trình</a></Typography>
                <Typography sx={{ display: 'flex', gap: 1, alignItems: 'center', }}><Icon icon="LanguageOutlined" /> Liên hệ trực tiếp trên website <a target='_blank' href="https://spacedev.vn/contact-us">Liên hệ</a></Typography>
                <Typography sx={{ pb: 1, display: 'flex', gap: 1, alignItems: 'center', }}><Icon icon="LocalPhoneOutlined" /> Số điện thoại tư vấn trực tiếp <a href='tel:0886871094'>0886871094</a> (Quân)</Typography>
            </Box>
        </Dialog>
    </>
    )
}

export default ButtonGroupHelper