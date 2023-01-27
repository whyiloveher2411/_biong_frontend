import CodeBlock from 'components/atoms/CodeBlock';
import React, { useContext } from 'react';
import { ContentOfStep } from '../StepByStep';
import StepByStepContext from './StepByStepContext';

function FillInTheInput({ content }: { content: ContentOfStep }) {

    const [answersOptions, setAnswersOptions] = React.useState<(Array<{
        title: string;
        position?: number | undefined;
        index: number
    }>) | []>([]);

    const stepByStepContext = useContext(StepByStepContext);

    const [contentQuestion, setContentQuestion] = React.useState<string[]>([]);

    const contentRef = React.useRef<HTMLDivElement | null>(null);

    const [errors, setErrors] = React.useState<{ [key: ID]: boolean } | null>(null);

    const refAnswersUser = React.useRef<{
        [key: ID]: string
    }>({});

    const [stateAnswersUser, setStateAnswersUser] = React.useState<{
        [key: ID]: string,
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
        setErrors(null);
    }, []);

    React.useEffect(() => {
        const answersOptions = (content.answer_option ?? []).map((item, index) => ({ ...item, index: index }));
        setAnswersOptions(answersOptions);
        let arrContent = content.content?.split('[option]');
        setContentQuestion(arrContent ?? []);

        if (contentRef.current) {
            let innerHTML = contentRef.current.innerHTML;

            innerHTML = innerHTML.replaceAll('[option]', '<input class="answerOption" />');

            contentRef.current.innerHTML = innerHTML;

            contentRef.current.querySelectorAll('.answerOption').forEach((item, index) => {
                item.setAttribute('data-index', index + '');
                item.addEventListener('keyup', function () {
                    setAnswersUser(prev => ({
                        ...prev,
                        [index]: (item as HTMLInputElement).value
                    }));
                });
            });
        }

    }, [content]);

    React.useEffect(() => {
        if (contentRef.current) {

            contentRef.current.querySelectorAll('.answerOption').forEach(el => {
                const index = Number(el.getAttribute('data-index'));

                if (errors) {
                    (el as HTMLInputElement).value = refAnswersUser.current[index] ?? ''

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
    }, [errors]);

    React.useEffect(() => {
        //
        if (Object.keys(stateAnswersUser).filter(i => stateAnswersUser[i]).length !== (contentQuestion.length - 1)) {
            stepByStepContext.setDisableButtonCheck(true);
        } else {
            stepByStepContext.setDisableButtonCheck(false);
        }

    }, [stateAnswersUser]);

    React.useEffect(() => {

        if (stepByStepContext.handleEventClickButton === 'check') {

            let check = true;
            let errorTemp: { [key: ID]: boolean } = {};

            for (let index = 0; index < (contentQuestion.length - 1); index++) {
                if (refAnswersUser.current[index]) {
                    if (refAnswersUser.current[index] && ((refAnswersUser.current[index]).toLowerCase() === answersOptions[index].title.toLowerCase())) {
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
            setErrors(null);
            setAnswersUser({});

            contentRef.current?.querySelectorAll('.answerOption').forEach((item, index) => {
                (item as HTMLInputElement).value = '';
            });
        } else if (stepByStepContext.handleEventClickButton === 'hint') {
            const answersUserTemp: typeof stateAnswersUser = {};
            const errorTemp: typeof errors = {};

            answersOptions.forEach((item, index) => {
                answersUserTemp[index] = item.title;
                errorTemp[index] = true;
            });

            setAnswersUser(answersUserTemp);
            setErrors(errorTemp);
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

            <CodeBlock
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
                        width: 120,
                        padding: '0 16px',
                        height: 48,
                        border: '1px solid',
                        borderRadius: 1,
                        borderColor: '#c8d2db',
                        color: 'text.primary',
                        textAlign: 'center',
                        fontSize: 18,
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
                    },
                    '&>pre': {
                        margin: '-16px !important',
                        '& .token.tag': {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                        },
                    }
                })}
                html={content.content ?? ''}
            />
        </>
    )
}

export default FillInTheInput