import { Box, Typography } from '@mui/material'
import { convertHMS } from 'helpers/date';
import React from 'react'

function TestWrapper({ timeRemaining, onTimeOut }: { timeRemaining: number, onTimeOut: () => void }) {

    const [isTimeOut, setIsTimeOut] = React.useState(false);
    const timeRef = React.useRef<HTMLSpanElement | null>(null);
    const timeCurrentRef = React.useRef<NodeJS.Timer | null>(null);
    const timeEnd = React.useRef(parseInt(((new Date()).getTime() / 1000).toFixed()) + timeRemaining);

    React.useEffect(() => {

        timeCurrentRef.current = setInterval(() => {

            const timeCurrent = parseInt(((new Date()).getTime() / 1000).toFixed());

            if (timeEnd.current <= timeCurrent) {
                if (timeRef.current) {
                    timeRef.current.textContent = 'Đã hết giờ';
                    setIsTimeOut(true);
                    if (timeCurrentRef.current) {
                        clearInterval(timeCurrentRef.current);
                    }
                    onTimeOut();
                }
            } else {
                if (timeRef.current) {

                    if ((timeEnd.current - timeCurrent) > 0) {
                        timeRef.current.textContent = convertHMS(timeEnd.current - timeCurrent, true, true, true);
                    } else {
                        timeRef.current.textContent = '[Đang cập nhật....]'
                    }
                }
            }
        }, 1000);

        return () => {
            if (timeCurrentRef.current) {
                clearInterval(timeCurrentRef.current);
            }
        }

    }, []);

    return (<Box>
        {
            timeRemaining > 1 ?
                <Typography sx={{ color: isTimeOut ? 'error.main' : 'inherit', fontSize: 28, fontWeight: 500 }} component='span' ref={timeRef}>{convertHMS(timeRemaining, true, true, true)}</Typography>
                :
                <Typography></Typography>
        }
    </Box>)
}

export default TestWrapper