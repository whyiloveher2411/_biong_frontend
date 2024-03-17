import React from 'react'
import { useCodingChallengeContext } from './context/CodingChallengeContext';
import { Box, Rating, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
function Editorial() {

    const codingChallengeContext = useCodingChallengeContext();

    return (
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
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    pt: 2,
                }}
            >
                <Rating
                    size="medium"
                    value={5}
                    // getLabelText={getLabelText}
                    onChange={(_event, newValue) => {
                        //
                    }}
                    // onChangeActive={(_event, newHover) => {
                    //     setHover(newHover);
                    // }}
                    emptyIcon={<Icon icon="Star" style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                <Typography fontSize={14} ><strong>4.61</strong> (3356 lượt đánh giá)</Typography>
            </Box>
            <div dangerouslySetInnerHTML={{ __html: codingChallengeContext.challenge.editorial }} />
        </Box>
    )
}

export default Editorial