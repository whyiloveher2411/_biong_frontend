import { Box, Typography } from '@mui/material'
import { __ } from 'helpers/i18n'
import React from 'react'

function Announcements() {
    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: '0 auto',
            }}
        >
            <Typography align='center' variant='h3' sx={{ mb: 2, mt: 4 }}>{__('Chưa có thông báo nào được đăng')}</Typography>
            <Typography align='center'>{__('Người hướng dẫn chưa thêm bất kỳ thông báo nào vào khóa học này. Thông báo được sử dụng để thông báo cho bạn về các cập nhật hoặc bổ sung cho khóa học.')}</Typography>
        </Box>
    )
}

export default Announcements