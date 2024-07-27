import { Box, Tooltip } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment, { Moment } from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import codingChallengeService, { CodingChallengeProps } from 'services/codingChallengeService';
import { getLinkExcercise } from '../..';

const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const momentToday = moment();

// function getRandomNumber(min: number, max: number) {
//     return Math.round(Math.random() * (max - min) + min);
// }

function fakeFetch(date: Moment, { signal }: { signal: AbortSignal }) {
    return new Promise<{ [key: number]: CodingChallengeProps }>((resolve, reject) => {
        resolve(codingChallengeService.getDailyChallenges(date.month() + 1, date.year()));

        // const timeout = setTimeout(() => {
        //     const daysInMonth = date.daysInMonth();
        //     const daysToHighlight = [1, 2, 3].map(() => getRandomNumber(1, daysInMonth));

        //     resolve({ daysToHighlight });
        // }, 500);

        signal.onabort = () => {
            // clearTimeout(timeout);
            reject(new DOMException('aborted', 'AbortError'));
        };
    });
}

const initialValue = moment();

function Calendar() {
    const requestAbortController = React.useRef<AbortController | null>(null);
    const [highlightedDays, setHighlightedDays] = React.useState<{ [key: number]: CodingChallengeProps }>({});

    const fetchHighlightedDays = (date: Moment) => {
        const controller = new AbortController();
        fakeFetch(date, {
            signal: controller.signal,
        })
            .then((daysToHighlight) => {
                setHighlightedDays(daysToHighlight);
            })
            .catch((error) => {
                // ignore the error if it's caused by `controller.abort`
                if (error.name !== 'AbortError') {
                    throw error;
                }
            });

        requestAbortController.current = controller;
    };

    React.useEffect(() => {
        fetchHighlightedDays(initialValue);
        // abort request on unmount
        return () => requestAbortController.current?.abort();
    }, []);

    const handleMonthChange = (date: Moment) => {
        if (requestAbortController.current) {
            // make sure that you are aborting useless requests
            // because it is possible to switch between months pretty quickly
            requestAbortController.current.abort();
        }

        setHighlightedDays([]);
        fetchHighlightedDays(date);
    };

    return (<>
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateCalendar
                onMonthChange={handleMonthChange}
                dayOfWeekFormatter={(date) => {
                    return days[date.day()];
                }}
                readOnly
                defaultValue={momentToday}
                slots={{
                    day: ServerDay,
                }}
                slotProps={{
                    day: {
                        highlightedDays,
                    } as { [key: number]: CodingChallengeProps },
                }}
            />
        </LocalizationProvider>
    </>
    );
}


export default Calendar


function ServerDay(props: PickersDayProps<Moment> & { highlightedDays?: { [key: number]: CodingChallengeProps } }) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
        !props.outsideCurrentMonth && highlightedDays[props.day.date()] !== undefined;

    if (isSelected) {

        const challenge = highlightedDays[props.day.date()];

        return (
            <Tooltip
                title={challenge.id + '. ' + challenge.title}
                key={props.day.toString()}
            >
                <Box
                    component={Link}
                    to={getLinkExcercise(challenge.slug)}
                    sx={{
                        position: 'relative',
                        ':before': {
                            content: '""',
                            position: 'absolute',
                            left: '50%',
                            bottom: 5,
                            transform: 'translateX(-50%)',
                            display: 'inline-block',
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            backgroundColor: 'error.main',
                        }
                    }}
                >
                    <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
                </Box>
            </Tooltip>
        );
    }

    return <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
}