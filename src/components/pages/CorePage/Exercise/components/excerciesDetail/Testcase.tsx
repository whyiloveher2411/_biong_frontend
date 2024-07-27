import { Box, Button, Skeleton, Typography } from '@mui/material';
import { formatTime } from 'helpers/string';
import React from 'react';
import { convertValue } from 'services/codingChallengeService';
import { useCodingChallengeContext } from './context/CodingChallengeContext';

function Testcase() {
    const codingChallengeContext = useCodingChallengeContext();

    const [caseCurrent, setCaseCurrent] = React.useState(0);

    // const boxTestcase: Array<{
    //     name: string,
    //     value: string | undefined,
    //     color: 'error' | 'success' | '',
    //     addin_info?: string,
    // }> = [];

    // codingChallengeContext.challenge.testcase?.variable_names.forEach((variable, index) => {
    //     boxTestcase.push({
    //         name: variable.name + ' = ',
    //         value: codingChallengeContext.challenge.testcase?.cases[caseCurrent]?.inputs?.[index],
    //         color: '',
    //     });
    // });

    // if (codingChallengeContext.testPassed[caseCurrent]) {
    //     boxTestcase.push({
    //         name: 'Output',
    //         value: trimCharacter(convertValue(JSON.stringify(codingChallengeContext.testPassed[caseCurrent]?.actual)), '"'),
    //         color: codingChallengeContext.testPassed[caseCurrent]?.success ? 'success' : 'error',
    //         addin_info: codingChallengeContext.testPassed[caseCurrent]?.time !== undefined ? (Math.round((codingChallengeContext.testPassed[caseCurrent]?.time + + Number.EPSILON) * 100) / 100) + 'ms' : undefined
    //     });
    // }

    // boxTestcase.push({
    //     name: 'Expected',
    //     value: trimCharacter(JSON.stringify(codingChallengeContext.challenge.testcase?.cases[caseCurrent]?.output), '"'),
    //     color: 'success'
    // });

    if (codingChallengeContext.isRunningTest) {
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
                    codingChallengeContext.challenge.public_testcase?.map((_, index) => (
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
                            {
                                codingChallengeContext.runer !== null &&
                                <Box
                                    className={codingChallengeContext.runer.result[index]?.isCorrect ? 'success' : ''}
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
                                />
                            }
                            Case {index + 1}
                        </Button>
                    ))
                }
                {
                    codingChallengeContext.runer !== null &&
                    <Typography variant='body2'>Thời gian chạy: {formatTime(codingChallengeContext.runer.result.reduce((total, item) => total + item.executionTime, 0))}</Typography>
                }
            </Box>
            <Box>
                {
                    !!codingChallengeContext.challenge.public_testcase && Object.keys(codingChallengeContext.challenge.public_testcase[caseCurrent]).map((key, index) => {
                        const input = codingChallengeContext.challenge.public_testcase[caseCurrent];
                        return <Box
                            key={codingChallengeContext.challenge.id + '_' + index}
                            sx={{
                                pt: 2,
                                fontFamily: 'monospace',
                                fontSize: 14,
                            }}
                        >
                            <Typography variant='body2' sx={{ fontSize: 14, fontFamily: 'monospace', }}>{key}</Typography>
                            <Box
                                // className={}
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
                                {JSON.stringify(input[key])}
                                {/* {
                                    input.addin_info ?
                                        <Typography variant='body2'>{input.addin_info}</Typography>
                                        : null
                                } */}
                            </Box>
                        </Box>
                    })
                }

                {
                    codingChallengeContext.runer !== null &&
                    <Box
                        sx={{
                            pt: 2,
                            fontFamily: 'monospace',
                            fontSize: 14,
                        }}
                    >
                        <Typography variant='body2' sx={{ fontSize: 14, fontFamily: 'monospace', }}>output</Typography>
                        <Box
                            className={codingChallengeContext.runer.result[caseCurrent]?.isCorrect ? 'success' : 'error'}
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
                            {convertValue(JSON.stringify(codingChallengeContext.runer.result[caseCurrent]?.result))}
                            <Typography variant='body2'>{formatTime(codingChallengeContext.runer.result[caseCurrent]?.executionTime)}</Typography>
                        </Box>
                    </Box>
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