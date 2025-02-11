import { Box, ListItemText, MenuItem, MenuList, Typography } from '@mui/material'
import Page from 'components/templates/Page'
import React from 'react'

function YoutubeBuilder() {
    return (
        <   Page
            title='Youtube Builder'
            description='Youtube Builder'
            sx={{
                display: 'flex',
            }}
            sxRoot={{
                display: 'flex',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    minHeight: '100%',
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'background.paper',
                        width: '200px',
                        height: '100%',
                        borderRadius: '10px',
                    }}
                >
                    <Typography>Channel</Typography>

                    <MenuList>
                        <MenuItem>
                            <ListItemText>Channel</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemText>Channel</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemText>Channel</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemText>Channel</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemText>Channel</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemText>Channel</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemText>Channel</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemText>Channel</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemText>Channel</ListItemText>
                        </MenuItem>
                    </MenuList>
                </Box>
            </Box>
        </Page>
    )
}

export default YoutubeBuilder