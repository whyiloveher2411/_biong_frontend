import { Box, Button, Skeleton, Typography } from '@mui/material';
import { trimCharacter } from 'helpers/string';
import React from 'react';
import { convertValue } from 'services/codingChallengeService';
import { useCodingChallengeContext } from './context/CodingChallengeContext';

function Testcase() {
    const codingChallengeContext = useCodingChallengeContext();

    const [caseCurrent, setCaseCurrent] = React.useState(0);

    const boxTestcase: Array<{
        name: string,
        value: string | undefined,
        color: 'error' | 'success' | '',
        addin_info?: string,
    }> = [];

    codingChallengeContext.challenge.testcase?.variable_names.forEach((variable, index) => {
        boxTestcase.push({
            name: variable.name + ' = ',
            value: codingChallengeContext.challenge.testcase?.cases[caseCurrent]?.inputs?.[index],
            color: '',
        });
    });

    if (codingChallengeContext.testPassed[caseCurrent]) {
        boxTestcase.push({
            name: 'Output',
            value: trimCharacter(convertValue(JSON.stringify(codingChallengeContext.testPassed[caseCurrent]?.actual)), '"'),
            color: codingChallengeContext.testPassed[caseCurrent]?.success ? 'success' : 'error',
            addin_info: codingChallengeContext.testPassed[caseCurrent]?.time !== undefined ? (Math.round((codingChallengeContext.testPassed[caseCurrent]?.time + + Number.EPSILON) * 100) / 100) + 'ms' : undefined
        });
    }

    boxTestcase.push({
        name: 'Expected',
        value: trimCharacter(JSON.stringify(codingChallengeContext.challenge.testcase?.cases[caseCurrent]?.output), '"'),
        color: 'success'
    });

    let indexLabelTestcase = 1;

    if (codingChallengeContext.isRunningTest || codingChallengeContext.submissionsPost === 'submitting') {
        return <TestCaseSkeleton />
    }

    return (
        <Box
            className="custom_scroll"
            sx={{
                height: '100%',
                padding: 2,
                pl: 1,
                pr: 1,
                position: 'relative',
            }}
        >
            <Box className='custom_scroll' sx={{ display: 'flex', gap: 1, alignItems: 'center', maxWidth: '100%', overflowX: 'scroll' }}>
                {
                    codingChallengeContext.challenge.testcase?.cases.map((testcase, index) => (
                        testcase.is_public ?
                            <Button
                                key={codingChallengeContext.challenge.id + '_' + index}
                                className={caseCurrent === index ? 'active' : ''}
                                onClick={() => setCaseCurrent(index)}
                                color={'inherit'}
                                sx={{
                                    textTransform: 'unset',
                                    color: 'text.primary',
                                    borderRadius: 1,
                                    pl: 1,
                                    pr: 1,
                                    minWidth: 'unset',
                                    '&.active': {
                                        backgroundColor: 'divider',
                                    },
                                    '&:hover': {
                                        opacity: 0.8,
                                        backgroundColor: 'dividerDark',
                                    }
                                }}
                            >
                                <Box
                                    className={codingChallengeContext.testPassed[index]?.success ? 'success' : ''}
                                    sx={{
                                        display: 'inline-block',
                                        width: 5,
                                        height: 5,
                                        borderRadius: '50%',
                                        backgroundColor: 'error.main',
                                        marginRight: 1,
                                        flexShrink: 0,
                                        '&.success': {
                                            backgroundColor: 'success.main',
                                        }
                                    }}
                                /> Case {indexLabelTestcase++}</Button>
                            : <React.Fragment key={codingChallengeContext.challenge.id + '_' + index} />
                    ))
                }
                <Typography variant='body2'>Thời gian chạy: {Object.keys(codingChallengeContext.testPassed).reduce((total, key) => total + codingChallengeContext.testPassed[key as unknown as number].time, 0)}ms</Typography>
            </Box>
            <Box>
                {
                    boxTestcase.map((input, index) => (
                        <Box
                            key={codingChallengeContext.challenge.id + '_' + index}
                            sx={{
                                pt: 2,
                                fontFamily: 'monospace',
                                fontSize: 14,
                            }}
                        >
                            <Typography variant='body2' sx={{ fontSize: 14, fontFamily: 'monospace', }}>{input.name}</Typography>
                            <Box
                                className={input.color}
                                sx={{
                                    mt: 0.5,
                                    padding: 1,
                                    borderRadius: 1,
                                    backgroundColor: 'divider',
                                    fontFamily: 'monospace',
                                    fontSize: 14,
                                    userSelect: 'text',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    '&.error': {
                                        color: 'error.main',
                                    },
                                    '&.success': {
                                        color: 'success.main',
                                    }
                                }}
                            >
                                {input.value}
                                {
                                    input.addin_info ?
                                        <Typography variant='body2'>{input.addin_info}</Typography>
                                        : null
                                }
                            </Box>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    )
}

export default Testcase

function TestCaseSkeleton() {
    return <Box
        className="custom_scroll"
        sx={{
            height: '100%',
            padding: 2,
            pl: 1,
            pr: 1,
            position: 'relative',
        }}
    >
        <Box className='custom_scroll' sx={{ display: 'flex', gap: 1, maxWidth: '100%', overflowX: 'scroll' }}>
            <Skeleton variant='rectangular' sx={{ width: 78, height: 36.5 }} />
            <Skeleton variant='rectangular' sx={{ width: 78, height: 36.5 }} />
            <Skeleton variant='rectangular' sx={{ width: 78, height: 36.5 }} />
        </Box>
        <Box>
            <Skeleton sx={{ width: 100 }} />
            <Skeleton variant='rectangular' sx={{ width: '100%', height: 46 }} />
            <Skeleton sx={{ width: 100, mt: 2 }} />
            <Skeleton variant='rectangular' sx={{ width: '100%', height: 46 }} />
            <Skeleton sx={{ width: 100, mt: 2 }} />
            <Skeleton variant='rectangular' sx={{ width: '100%', height: 46 }} />
            <Skeleton sx={{ width: 100, mt: 2 }} />
            <Skeleton variant='rectangular' sx={{ width: '100%', height: 46 }} />
        </Box>
    </Box>
}