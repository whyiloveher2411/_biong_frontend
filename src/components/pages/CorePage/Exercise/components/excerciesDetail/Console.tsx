import { Box } from '@mui/material'
import React from 'react'
import { useCodingChallengeContext } from './context/CodingChallengeContext';

function Console() {
    const codingChallengeContext = useCodingChallengeContext();

    return (
        <Box
            className="custom_scroll"
            sx={{
                overflowY: 'overlay',
                pl: 1,
                pr: 1,
                height: '100%',
                '& *': {
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    whiteSpace: 'break-spaces',
                }
            }}
        >
            <Box
                sx={{
                    pb: 1,
                }}
                dangerouslySetInnerHTML={{ __html: codingChallengeContext.contentLog[0].log }}
            />
        </Box>
    )
}

export default Console