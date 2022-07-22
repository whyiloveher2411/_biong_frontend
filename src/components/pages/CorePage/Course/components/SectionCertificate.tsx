import { Box, Typography } from '@mui/material'
import { __ } from 'helpers/i18n'
import React from 'react'

function SectionCertificate() {
    return (
        <Box
            sx={{
                maxWidth: 650,
                margin: '0 auto',
            }}
        >
            <Typography align='center' variant='h3' sx={{ mb: 2, mt: 4 }}>{__('Xác nhận chứng chỉ')}</Typography>
            <Typography align='center'>{__('Tùy thuộc vào khóa học, chúng tôi có thể cung cấp cho bạn một chứng chỉ để xác nhận rằng bạn đã hoàn thành khóa học trên nền tảng của chúng tôi, hãy quay lại đây khi đã hoàn thành khóa học.')}</Typography>
        </Box>
    )
}

export default SectionCertificate