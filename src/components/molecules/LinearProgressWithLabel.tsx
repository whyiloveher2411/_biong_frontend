import { Box, LinearProgress, LinearProgressProps, Typography } from '@mui/material';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number , position?: 'left' | 'right'}) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {
                props.position === 'left' &&
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            }
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            {
                props.position !== 'left' &&
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            }
        </Box>
    );
}

export default LinearProgressWithLabel