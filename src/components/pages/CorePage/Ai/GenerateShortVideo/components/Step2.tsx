import { Box, Button, Typography } from '@mui/material';
import React from 'react';

const Step2 = ({ onBack, onNext }: { onBack: () => void, onNext: () => void }) => {
    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                <Typography variant="h6">
                    Step 2: Generate Script
                </Typography>

            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="contained" sx={{ color: 'text.primary' }} color="inherit" onClick={onBack}>
                    Quay lại
                </Button>
                <Button variant="contained" color="primary" onClick={onNext}>
                    Tiếp tục
                </Button>
            </Box>
        </Box>
    );
};

export default Step2;