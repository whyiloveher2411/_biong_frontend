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
            <Typography align='center' variant='h3' sx={{ mb: 2, mt: 4 }}>{__('No announcements posted yet')}</Typography>
            <Typography align='center'>{__('The instructor hasn’t added any announcements to this course yet. Announcements are used to inform you of updates or additions to the course.')}</Typography>
        </Box>
    )
}

export default Announcements