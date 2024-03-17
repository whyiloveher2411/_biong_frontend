import { Box } from '@mui/material'
import Comments from 'plugins/Vn4Comment/Comments'
import React from 'react'
import { useCodingChallengeContext } from './context/CodingChallengeContext';

function Discussion() {

    const codingChallengeContext = useCodingChallengeContext();

    return (<Box
        className={"custom_scroll"}
        sx={{
            maxHeight: '100%',
            overflowY: 'scroll',
            p: 2,
            pt: 0,
        }}
    >
        <Comments
            keyComment={codingChallengeContext.challenge.id}
            type={'e_challenge_comment'}
        // backgroundContentComment={theme.palette.mode === 'light' ? 'white' : 'commentItemBackground'}
        />
    </Box>)
}

export default Discussion