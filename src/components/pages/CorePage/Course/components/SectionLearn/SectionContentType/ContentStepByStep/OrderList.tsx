import { Box } from '@mui/material'
import CodeBlock from 'components/atoms/CodeBlock'
import FieldForm from 'components/atoms/fields/FieldForm'
import { shuffleArray } from 'helpers/array'
import React, { useContext } from 'react'
import { ContentOfStep } from '../StepByStep'
import StepByStepContext from './StepByStepContext'

function OrderList({ content }: { content: ContentOfStep }) {


    const stepByStepContext = useContext(StepByStepContext);

    const [answersOptions, setAnswersOptions] = React.useState<{
        values: Array<{
            title: string,
            index: number,
            error: boolean | null,
        }>,
        times: number,
    }>({
        times: 0,
        values: []
    });

    const handleRandomAnsersOption = () => {

        let answersOptions;

        do {
            answersOptions = shuffleArray((content.items ?? []).map((item, index) => ({ ...item, index: index, error: null })));
        } while (answersOptions[0].index === 0);

        return answersOptions;

    }

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
        if (stepByStepContext.handleEventClickButton === 'check') {
            let check = true;
            answersOptions.values.forEach((item, index) => {
                if (item.index !== index) {
                    check = false;
                }
            });

            if (check) {
                stepByStepContext.setShowButtons(prev => ({
                    ...prev,
                    continue: true,
                    hint: false,
                    checkResult: false,
                    tryCheckAgain: false,
                    stateCheck: true,
                }));
            } else {
                stepByStepContext.updateHeartWrongAnswer();
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
            const answersOptions = handleRandomAnsersOption();
            setAnswersOptions(prev => ({
                times: ++prev.times,
                values: answersOptions,
            }));

        } else if (stepByStepContext.handleEventClickButton === 'hint') {
            setAnswersOptions(prev => ({
                times: ++prev.times,
                values: (content.items ?? []).map((item, index) => ({ ...item, index: index, error: null })),
            }));
            stepByStepContext.setShowButtons(prev => ({
                ...prev,
                continue: true,
                hint: false,
                checkResult: false,
                tryCheckAgain: false,
                stateCheck: true,
            }));
        }

    }, [stepByStepContext.handleEventClickButton]);

    React.useEffect(() => {
        const answersOptions = handleRandomAnsersOption();
        setAnswersOptions(prev => ({
            times: ++prev.times,
            values: answersOptions,
        }));
    }, [content.items]);

    React.useEffect(() => {
        stepByStepContext.setDisableButtonCheck(false);
    }, [answersOptions]);

    let cssCheckResult: { [key: string]: ANY } = {};

    if (stepByStepContext.showButtons.stateCheck) {
        answersOptions.values.forEach((item, index) => {
            if (item.index !== index) {
                cssCheckResult['& .MuiAccordion-root:nth-of-type(' + (index + 1) + ')'] = {
                    borderColor: 'error.main',
                    backgroundColor: 'rgba(229, 57, 53, 0.08)',
                    pointerEvents: 'none',
                };
            } else {
                cssCheckResult['& .MuiAccordion-root:nth-of-type(' + (index + 1) + ')'] = {
                    borderColor: 'success.main',
                    backgroundColor: 'rgba(67, 160, 71, 0.08)',
                    pointerEvents: 'none',
                };
            }
        });
    }

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
                    '& .MuiAccordion-root': {
                        border: '2px solid',
                        borderColor: 'divider',
                        marginBottom: 2,
                        padding: 0,
                    },
                    ...cssCheckResult,
                }}
            >
                {
                    answersOptions.times % 2 === 0 ?
                        <FieldForm
                            component='repeater'
                            config={{
                                title: '',
                                sub_fields: {
                                    title: { title: 'Title', view: 'text' },
                                },
                                disableAddNewItem: true,
                                disableMoreAction: true,
                                disableNumberOrder: true,
                                activeOrderIcon: true,
                                disableShowInfo: true,
                            }}
                            post={answersOptions}
                            name='values'
                            onReview={(values) => {
                                setAnswersOptions(prev => ({
                                    times: ++prev.times,
                                    values: values
                                }));
                            }}
                        />
                        :
                        <Box>
                            <FieldForm
                                component='repeater'
                                config={{
                                    title: '',
                                    sub_fields: {
                                        title: { title: 'Title', view: 'text' },
                                    },
                                    disableAddNewItem: true,
                                    disableMoreAction: true,
                                    disableNumberOrder: true,
                                    activeOrderIcon: true,
                                    disableShowInfo: true,
                                }}
                                post={answersOptions}
                                name='values'
                                onReview={(values) => {
                                    setAnswersOptions(prev => ({
                                        times: ++prev.times,
                                        values: values
                                    }));
                                }}
                            />
                        </Box>
                }
                {
                    // answersOptions ?
                    //     answersOptions.map((item, index) => {

                    //         return <Box key={index}
                    //             sx={(theme) => ({
                    //                 p: 2,
                    //                 display: 'flex',
                    //                 alignItems: 'center',
                    //                 gap: 2,
                    //                 border: '2px solid',
                    //                 pointerEvents: stepByStepContext.showButtons.stateCheck ? 'none' : 'unset',
                    //                 borderColor:
                    //                     // isSelect ?
                    //                     //     (
                    //                     //         stepByStepContext.showButtons.stateCheck ?
                    //                     //             item.is_answer ?
                    //                     //                 'success.main'
                    //                     //                 :
                    //                     //                 'error.main'
                    //                     //             :
                    //                     //             'primary.main'
                    //                     //     )
                    //                     //     :
                    //                     'divider',
                    //                 cursor: 'pointer',
                    //                 backgroundColor:
                    //                     // isSelect ? (
                    //                     //     stepByStepContext.showButtons.stateCheck ?
                    //                     //         item.is_answer ?
                    //                     //             'rgba(67, 160, 71, 0.08)'
                    //                     //             :
                    //                     //             'rgba(229, 57, 53, 0.08)'
                    //                     //         :
                    //                     //         'rgba(25, 118, 210, 0.08)'
                    //                     // ) :
                    //                     'unset',
                    //                 boxShadow: '0 2px 0 1px ' + theme.palette.divider,
                    //             })}
                    //         >
                    //             <Typography sx={{ fontSize: 20 }}>{item.title}</Typography>
                    //         </Box>
                    //     })
                    //     :
                    //     null
                }
            </Box>
        </>
    )
}

export default OrderList