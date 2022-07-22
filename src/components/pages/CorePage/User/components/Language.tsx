import { Box, Card, CardContent, Typography } from '@mui/material'
import { __ } from 'helpers/i18n'
import React from 'react'

function Language() {
    return (
        <Card>
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography variant='h5'>{__('Language')}</Typography>
                <Box>
                    <Typography variant='h6' color={'text.secondary'}>{__('Phone')}</Typography>
                    <Typography>0949 *** ****</Typography>
                </Box>
                <Box>
                    <Typography variant='h6'>{__('Email')}</Typography>
                    <Typography>dan********@**.vn</Typography>
                </Box>
                <Box>
                    <Typography variant='h6'>{__('Birthday')}</Typography>
                    <Typography>25/**/**9*</Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default Language