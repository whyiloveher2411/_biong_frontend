import { Box } from '@mui/material';
import React from 'react';

function SpacedevLanding() {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                minHeight: '100vh',
                backgroundColor: '#070e1c',
            }}
        >
            <iframe
                title="Spacedev Landing"
                src="/spacedev-landing.html"
                style={{
                    width: '100%',
                    minHeight: '100vh',
                    border: 0,
                    display: 'block',
                }}
            />
        </Box>
    );
}

export default SpacedevLanding;
