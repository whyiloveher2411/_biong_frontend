import { Box } from '@mui/material'
import React from 'react'

function BannerText(props: {
    children: React.ReactNode,
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 5,
                paddingBottom: 5,
                fontSize: 50,
                lineHeight: '65px',
            }}
        >
            <Box>
                {
                    props.children
                }
            </Box>
        </Box>
    )
}

export default BannerText