import { Box, SxProps } from '@mui/material'
import React from 'react'

function BrowserFrame({ children, rightButton, sx }: { children?: React.ReactNode, rightButton?: React.ReactNode, sx?: SxProps }) {
    return (
        <Box sx={{
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box className="browserToolbar" sx={{
                padding: '10px',
                background: '#f1f1f1',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'divider',
                gap: 3,
                ...(rightButton ? {} : {
                    '&:after': {
                        content: "''",
                        display: 'table',
                        clear: 'both',
                    }
                })

            }}>
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                }}>
                    {
                        ['#ED594A', '#FDD800', '#5AC05A'].map(color => <Box
                            key={color}
                            component={'span'}
                            sx={{
                                marginTop: '4px',
                                height: '12px',
                                width: '12px',
                                borderRadius: '50%',
                                display: 'inline-block',
                                backgroundColor: color,
                            }}
                        />)
                    }
                </Box>
                <Box sx={{
                    float: 'left',
                    width: '100%',
                }}>
                    <Box component='input' type="text" value="http://spacedev.vn"
                        onChange={() => {
                            // 
                        }}
                        sx={{
                            backgroundColor: 'background.default',
                            color: 'text.primary',
                            outline: 'none',
                            width: '100%',
                            borderRadius: '3px',
                            border: 'none',
                            marginTop: '-8px',
                            height: '25px',
                            padding: '5px',
                        }}
                    />
                </Box>
                <Box sx={{
                    ...(rightButton ? {} : {
                        width: '10%',
                    })

                }}>
                    <Box sx={{
                        float: 'right',
                    }}>
                        {
                            rightButton ?
                                rightButton :
                                [1, 2, 3].map(index => <Box
                                    key={index}
                                    component={'span'}
                                    sx={{
                                        width: '17px',
                                        height: '3px',
                                        backgroundColor: '#aaa',
                                        margin: '3px 0',
                                        display: 'block',
                                    }}
                                />)
                        }
                    </Box>
                </Box>
            </Box>
            <Box className="browserContent" sx={{
                flexGrow: 1,
            }}>
                {children}
            </Box>
        </Box >
    )
}

export default BrowserFrame
