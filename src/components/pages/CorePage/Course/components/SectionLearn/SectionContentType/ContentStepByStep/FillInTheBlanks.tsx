import React, { useContext } from 'react'
import { ContentOfStep } from '../StepByStep'
import { Box } from '@mui/material'
import { shuffleArray } from 'helpers/array';
import StepByStepContext from './StepByStepContext';
import CodeBlock from 'components/atoms/CodeBlock';

function FillInTheBlanks({ content }: { content: ContentOfStep }) {

    const [answersOptions, setAnswersOptions] = React.useState<(Array<{
        title: string;
        position?: number | undefined;
        index: number
    }>) | []>([]);

    const stepByStepContext = useContext(StepByStepContext);

    const [questionCurrent, setQuestionCurrent] = React.useState(-1);

    const [contentQuestion, setContentQuestion] = React.useState<string[]>([]);

    const contentRef = React.useRef<HTMLDivElement | null>(null);

    const [errors, setErrors] = React.useState<{ [key: ID]: boolean } | null>(null);

    const refAnswersUser = React.useRef<{
        [key: ID]: {
            title: string;
            position?: number | undefined;
            index: number
        }
    }>({});

    const [stateAnswersUser, setStateAnswersUser] = React.useState<{
        [key: ID]: {
            title: string;
            position?: number | undefined;
            index: number
        }
    }>({});

    const setAnswersUser = (state: typeof stateAnswersUser | ((param: typeof stateAnswersUser) => typeof stateAnswersUser)) => {
        setStateAnswersUser(prev => {

            let result = prev;

            if (typeof state === 'function') {
                result = state(prev);
            } else {
                result = state;
            }

            refAnswersUser.current = result;

            return result;
        });
    }

    React.useEffect(() => {
        stepByStepContext.setShowButtons((prev) => ({
            ...prev,
            checkResult: true,
            continue: false,
            hint: true,
            tryCheckAgain: false,
            stateCheck: false,
        }));
        stepByStepContext.setDisableButtonCheck(true);
    }, []);

    React.useEffect(() => {
        const answersOptions = shuffleArray(content.answer_option ?? []).map((item, index) => ({ ...item, index: index }));
        setAnswersOptions(answersOptions);
        let arrContent = content.content?.split('[option]');
        setContentQuestion(arrContent ?? []);

        if (contentRef.current) {
            let innerHTML = contentRef.current.innerHTML;

            innerHTML = innerHTML.replaceAll('[option]', '<span class="answerOption"></span>');

            contentRef.current.innerHTML = innerHTML;

            contentRef.current.querySelectorAll('.answerOption').forEach((item, index) => {
                item.setAttribute('data-index', index + '');
                item.addEventListener('click', function () {
                    const prev = refAnswersUser.current;
                    if (prev[index]) {
                        delete prev[index];
                        if (Object.keys(prev).length !== (contentQuestion.length - 1)) {
                            stepByStepContext.setDisableButtonCheck(true);
                        }
                        setAnswersUser({ ...prev });
                    } else {
                        setQuestionCurrent(prev2 => prev2 === index ? -1 : index);
                    }
                });
            });
        }

    }, [content]);

    React.useEffect(() => {
        if (contentRef.current) {
            contentRef.current.querySelectorAll('.answerOption').forEach(el => {
                const index = Number(el.getAttribute('data-index'));

                if (refAnswersUser.current[index]) {
                    el.textContent = refAnswersUser.current[index].title;
                } else {
                    el.textContent = '';
                }

                if (questionCurrent > -1 && index === questionCurrent) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }

                if (errors) {

                    if (errors[index]) {
                        el.classList.add('success');
                        el.classList.remove('error');
                    } else {
                        el.classList.add('error');
                        el.classList.remove('success');
                    }

                } else {
                    el.classList.remove('success');
                    el.classList.remove('error');
                }

            })
        }
    }, [stateAnswersUser, questionCurrent, errors]);

    React.useEffect(() => {

        if (stepByStepContext.handleEventClickButton === 'check') {

            let check = true;
            let errorTemp: { [key: ID]: boolean } = {};

            for (let index = 0; index < (contentQuestion.length - 1); index++) {
                if (refAnswersUser.current[index]) {
                    if (refAnswersUser.current[index].position && (Number(refAnswersUser.current[index].position) === index)) {
                        errorTemp[index] = true;
                    } else {
                        check = false;
                        errorTemp[index] = false;
                    }
                } else {
                    check = false;
                    errorTemp[index] = false;
                }
            }

            setErrors(errorTemp);

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
            setErrors(null);
            setAnswersUser({});
        }

    }, [stepByStepContext.handleEventClickButton]);

    const keysOfanswersUser = Object.keys(refAnswersUser.current);

    return (
        <>
            <CodeBlock
                sx={{
                    '& strong': {
                        fontSize: 30,
                        marginLeft: '3px',
                    }
                }}
                html={content.question ?? ''}
            />

            < Box
                ref={contentRef}
                sx={(theme) => ({
                    fontSize: 18,
                    textAlign: 'justify',
                    marginTop: theme.spacing(3),
                    backgroundColor: 'divider',
                    p: 2,
                    // display: 'inline-flex',
                    alignItems: 'center',
                    width: '100%',
                    // flexWrap: 'wrap',
                    // gap: 1,
                    borderRadius: 1,
                    lineHeight: '48px',
                    '&>p>img': {
                        display: 'block',
                        margin: '24px auto',
                    },
                    '&>*': {
                        margin: '0px',
                        display: 'flex',
                        gap: '8px',
                        lineHeight: '48px',
                        marginBottom: '8px',
                    },
                    '& .answerOption': {
                        display: 'inline-flex',
                        minWidth: 120,
                        padding: '0 16px',
                        height: 48,
                        border: '1px solid',
                        borderRadius: 1,
                        borderColor: '#c8d2db',
                        backgroundColor: 'body.background',
                        // borderColor: errors !== null ?
                        //     errors[index] ?
                        //         'success.main'
                        //         :
                        //         'error.main'
                        //     : questionCurrent === index ? 'primary.main' : '#c8d2db',
                        // backgroundColor: errors !== null ?
                        //     errors[index] ?
                        //         'rgba(67, 160, 71, 0.08)'
                        //         :
                        //         'rgba(229, 57, 53, 0.08)'
                        //     : questionCurrent === index ? 'rgba(25, 118, 210, 0.08)' : 'body.background',
                        cursor: 'pointer',
                        pointerEvents: errors !== null ? 'none' : 'unset',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&.active': {
                            borderColor: 'primary.main',
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        },
                        '&.success': {
                            borderColor: 'success.main',
                            backgroundColor: 'rgba(67, 160, 71, 0.08)',
                        },
                        '&.error': {
                            borderColor: 'error.main',
                            backgroundColor: 'rgba(229, 57, 53, 0.08)',
                        },
                    }
                })}
                dangerouslySetInnerHTML={{ __html: content.content ?? '' }}
            />

            {
                // contentQuestion.map((item, index) => (
                //     <React.Fragment
                //         key={index}
                //     >

                //         <Box
                //             component={'span'}
                //             dangerouslySetInnerHTML={{ __html: item }}
                //         />
                //         {
                //             Boolean(index !== (contentQuestion.length - 1)) &&
                //             <Box component='span'
                //                 sx={{
                //                     display: 'inline-flex',
                //                     minWidth: 120,
                //                     height: 48,
                //                     border: '1px solid',
                //                     borderRadius: 1,
                //                     borderColor: errors !== null ?
                //                         errors[index] ?
                //                             'success.main'
                //                             :
                //                             'error.main'
                //                         : questionCurrent === index ? 'primary.main' : '#c8d2db',
                //                     backgroundColor: errors !== null ?
                //                         errors[index] ?
                //                             'rgba(67, 160, 71, 0.08)'
                //                             :
                //                             'rgba(229, 57, 53, 0.08)'
                //                         : questionCurrent === index ? 'rgba(25, 118, 210, 0.08)' : 'body.background',
                //                     cursor: 'pointer',
                //                     pointerEvents: errors !== null ? 'none' : 'unset',
                //                     justifyContent: 'center',
                //                     alignItems: 'center',
                //                 }}
                //                 onClick={() => {
                //                     const prev = answersUser;
                //                     if (prev[index]) {
                //                         delete prev[index];
                //                         if (Object.keys(prev).length !== (contentQuestion.length - 1)) {
                //                             stepByStepContext.setDisableButtonCheck(true);
                //                         }
                //                         setAnswersUser({ ...prev });
                //                     } else {
                //                         setQuestionCurrent(prev2 => prev2 === index ? -1 : index);
                //                     }
                //                 }}
                //             >
                //                 {
                //                     answersUser[index] ?
                //                         answersUser[index].title
                //                         :
                //                         null
                //                 }
                //             </Box>
                //         }
                //     </React.Fragment>
                // ))
            }
            {/* </Box> */}

            <Box
                sx={{
                    mt: 3,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                {
                    answersOptions.map((item, index) => (
                        <Box
                            key={index}
                            sx={(theme) => ({
                                p: 2,
                                display: keysOfanswersUser.findIndex((i) => (refAnswersUser.current[i] && refAnswersUser.current[i].index === item.index)) > -1 ? 'none' : 'flex',
                                minWidth: 68,
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 2,
                                border: '2px solid',
                                borderColor: 'divider',
                                cursor: 'pointer',
                                boxShadow: '0 2px 0 1px ' + theme.palette.divider,
                                pointerEvents: errors !== null ? 'none' : 'unset',
                            })}
                            onClick={() => {

                                if (questionCurrent > -1) {

                                    const result = {
                                        ...refAnswersUser.current,
                                        [questionCurrent]: item
                                    };
                                    if (Object.keys(result).length === (contentQuestion.length - 1)) {
                                        stepByStepContext.setDisableButtonCheck(false);
                                    }
                                    setAnswersUser(result);
                                    setQuestionCurrent(-1);

                                } else {
                                    // setAnswersUser(prev => {
                                    const prev = refAnswersUser.current;
                                    let index = 0;

                                    for (index; index < (contentQuestion.length - 1); index++) {
                                        if (!prev[index]) {
                                            break;
                                        }
                                    }

                                    if (index !== (contentQuestion.length - 1) && !prev[index]) {
                                        prev[index] = item;
                                    }

                                    if (Object.keys(prev).length === (contentQuestion.length - 1)) {
                                        stepByStepContext.setDisableButtonCheck(false);
                                    }

                                    // });

                                    setAnswersUser({ ...prev });
                                }

                            }}
                        >
                            {item.title}
                        </Box>
                    ))
                }
            </Box>
        </>
    )
}

export default FillInTheBlanks