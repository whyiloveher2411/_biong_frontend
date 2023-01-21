import React, { useContext } from 'react'
import { ContentOfStep } from '../StepByStep'
import { Box } from '@mui/material'
import Checkbox from 'components/atoms/Checkbox'
import Typography from 'components/atoms/Typography'
import { shuffleArray } from 'helpers/array'
import StepByStepContext from './StepByStepContext'
import CodeBlock from 'components/atoms/CodeBlock'

function Quiz({ content }: { content: ContentOfStep }) {

    const [answers, setAnswers] = React.useState<number[]>([]);

    const stepByStepContext = useContext(StepByStepContext);

    const refAnswers = React.useRef<number[]>([]);

    const [answersOptions, setAnswersOptions] = React.useState<(Array<{
        title: string,
        is_answer: number,
        explain: string,
        index: number
    }>) | null>(null);

    React.useEffect(() => {
        stepByStepContext.setShowButtons(({
            checkResult: true,
            continue: false,
            hint: true,
            tryCheckAgain: false,
            stateCheck: false,
        }));
        stepByStepContext.setDisableButtonCheck(true);
    }, []);

    React.useEffect(() => {
        refAnswers.current = answers;
        if (answers.length) {
            stepByStepContext.setDisableButtonCheck(false);
        } else {
            stepByStepContext.setDisableButtonCheck(true);
        }
    }, [answers]);


    React.useEffect(() => {
        if (stepByStepContext.handleEventClickButton === 'check') {
            const result = (() => {
                if (answersOptions && refAnswers.current.length) {

                    const answersTrue = answersOptions.filter(item => item.is_answer);
                    const answersFalse = answersOptions.filter(item => !item.is_answer);

                    if (answersTrue.length) {
                        let result = true;
                        answersTrue.every((el) => {
                            if (refAnswers.current.findIndex(item => item === el.index) < 0) {
                                result = false;
                                return false;
                            }
                            return true;
                        });

                        if (!result) return false;

                        answersFalse.every(el => {
                            if (refAnswers.current.findIndex(item => item === el.index) !== -1) {
                                result = false;
                                return false;
                            }
                            return true;
                        });

                        return result;

                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            })();

            if (result) {
                stepByStepContext.setShowButtons(prev => ({
                    ...prev,
                    continue: true,
                    hint: false,
                    checkResult: false,
                    tryCheckAgain: false,
                    stateCheck: true,
                }));
            } else {
                stepByStepContext.setShowButtons(prev => ({
                    ...prev,
                    checkResult: false,
                    continue: false,
                    hint: true,
                    tryCheckAgain: true,
                    stateCheck: true,
                }));
            }
        } else if (stepByStepContext.handleEventClickButton === 'checkagain') {
            setAnswers([]);
        }

    }, [stepByStepContext.handleEventClickButton]);

    React.useEffect(() => {
        const answersOptions = shuffleArray(content.answers ?? []).map((item, index) => ({ ...item, index: index }));
        setAnswersOptions(answersOptions);
    }, [content.answers]);

    return (
        <>
            <CodeBlock
                sx={{
                    width: '100%',
                    '& strong': {
                        fontSize: 30,
                        marginLeft: '3px',
                    }
                }}
                html={content.question ?? ''}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                }}
            >
                {
                    answersOptions ?
                        answersOptions.filter(item => item.is_answer).length > 1 ?
                            answersOptions.map((item, index) => {
                                const isSelect = answers.findIndex(i => i === index) > -1;

                                return <Box key={index}
                                    sx={(theme) => ({
                                        p: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        border: '2px solid',
                                        pointerEvents: stepByStepContext.showButtons.stateCheck ? 'none' : 'unset',
                                        borderColor: isSelect ?
                                            (
                                                stepByStepContext.showButtons.stateCheck ?
                                                    item.is_answer ?
                                                        'success.main'
                                                        :
                                                        'error.main'
                                                    :
                                                    'primary.main'
                                            )
                                            : 'divider',
                                        cursor: 'pointer',
                                        backgroundColor: isSelect ? (
                                            stepByStepContext.showButtons.stateCheck ?
                                                item.is_answer ?
                                                    'rgba(67, 160, 71, 0.08)'
                                                    :
                                                    'rgba(229, 57, 53, 0.08)'
                                                :
                                                'rgba(25, 118, 210, 0.08)'
                                        ) : 'unset',
                                        boxShadow: '0 2px 0 1px ' + theme.palette.divider,
                                    })}
                                    onClick={() => {
                                        if (!stepByStepContext.showButtons.stateCheck) {
                                            setAnswers(prev => {
                                                if (prev.findIndex(i => i === index) > -1) {
                                                    return prev.filter(i => i !== index);
                                                }
                                                prev.push(index);
                                                return [...prev];
                                            });
                                        }
                                    }}
                                >
                                    <Checkbox checked={isSelect} />
                                    <Typography sx={{ fontSize: 20 }}>{item.title}</Typography>
                                </Box>
                            })
                            :
                            answersOptions.map((item, index) => {

                                const isSelect = answers[0] === index;

                                return <Box key={index}
                                    sx={(theme) => ({
                                        p: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        border: '2px solid',
                                        pointerEvents: stepByStepContext.showButtons.stateCheck ? 'none' : 'unset',
                                        borderColor: isSelect ?
                                            (
                                                stepByStepContext.showButtons.stateCheck ?
                                                    item.is_answer ?
                                                        'success.main'
                                                        :
                                                        'error.main'
                                                    :
                                                    'primary.main'
                                            )
                                            : 'divider',
                                        cursor: 'pointer',
                                        backgroundColor: isSelect ? (
                                            stepByStepContext.showButtons.stateCheck ?
                                                item.is_answer ?
                                                    'rgba(67, 160, 71, 0.08)'
                                                    :
                                                    'rgba(229, 57, 53, 0.08)'
                                                :
                                                'rgba(25, 118, 210, 0.08)'
                                        ) : 'unset',
                                        boxShadow: '0 2px 0 1px ' + theme.palette.divider,
                                    })}
                                    onClick={() => {
                                        if (!stepByStepContext.showButtons.stateCheck) {
                                            if (answers.length === 0) {
                                                setAnswers([index]);
                                            } else {

                                                if (answers.findIndex(i => i === index) > -1) {
                                                    setAnswers([]);
                                                } else {
                                                    setAnswers([index]);
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <Typography sx={{ fontSize: 20 }}>{item.title}</Typography>
                                </Box>
                            })
                        :
                        null
                }
            </Box>
        </>
    )
}

export default Quiz