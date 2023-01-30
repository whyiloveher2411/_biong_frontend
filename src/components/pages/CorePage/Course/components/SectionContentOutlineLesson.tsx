import { Box, Typography } from '@mui/material'
import { __ } from 'helpers/i18n'
import React from 'react'

function SectionContentOutlineLesson() {
    return (
        <Box
            sx={{
                maxWidth: 800,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 3,
                border: '1px solid',
                borderColor: 'dividerDark',
                backgroundColor: 'background.paper',
            }}
        >
            <Typography variant='h3'>{__('Nội dung đang được cập nhật')}</Typography>
            <Typography>{__('Nơi đây chứa nội dung toàn bộ của buổi học, giúp học viên biết được những ý chính trong bài học này.')}</Typography>
        </Box>
    )
}

export default SectionContentOutlineLesson