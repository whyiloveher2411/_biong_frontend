import { Box } from '@mui/material'
import React from 'react'
import { useCodingChallengeContext } from './context/CodingChallengeContext'

function Description() {

    const codingChallengeContext = useCodingChallengeContext();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Box
                className={"custom_scroll"}
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    margin: 0,
                    maxHeight: '100%',
                    overflowY: 'scroll',
                    pl: 2,
                    pr: 2,
                    pt: 2,
                    '&>.tab-horizontal': {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '& .tabWarper': {
                            pl: 1,
                        },
                        '& .tabContent': {
                            flexGrow: 1,
                        }
                    },
                    '& .iframe_result': {
                        opacity: 0,
                        position: 'absolute',
                        pointerEvents: 'none !important',
                        background: 'white',
                        left: 0,
                        top: 48,
                        border: 'none',
                        width: '100%',
                        height: 'calc( 100% - 48px)',
                    },
                }}
            >
                <div dangerouslySetInnerHTML={{ __html: codingChallengeContext.challenge.description }} />
            </Box>
        </Box>
    )
}

export default Description