import { Box, Typography } from '@mui/material'
import { __ } from 'helpers/i18n'
import React from 'react'

function SectionInterview() {
    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: '0 auto',
            }}
        >
            <Typography align='center' variant='h3' sx={{ mb: 2, mt: 4 }}>{__('Bạn không có buổi phỏng vấn nào')}</Typography>
            <Typography align='center'>{__('Để giúp bạn có thể tự tin hơn trong các buổi phỏng vấn kiến thức liên quan đến khóa học, chúng tôi sẽ gợi ý cho bạn những câu hỏi và cách trả lời giúp bạn được đánh giá cao hơn trong quá trình phỏng vấn. Ngoài ra, bạn sẽ có một buổi phỏng vấn thử từ chúng tôi trong khóa học này. hãy quay lại đây khi đã hoàn thành khóa học và bạn thực sự mong muốn một buổi phỏng vấn thử từ đội ngũ của chúng tôi')}</Typography>
        </Box>
    )
}

export default SectionInterview