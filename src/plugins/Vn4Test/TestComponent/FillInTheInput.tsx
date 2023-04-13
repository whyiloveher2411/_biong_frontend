import CodeBlock from 'components/atoms/CodeBlock';
import React from 'react';
import { QuestionTestProps } from 'services/elearningService';


function FillInTheInput({ id, question, options, showAnswerRight, selected, onChange }: {
    id: ID,
    question: string,
    options: QuestionTestProps,
    showAnswerRight: boolean,
    selected?: { [key: string]: string | number },
    onChange: (value: ANY) => void,
}) {


    // const [contentQuestion, setContentQuestion] = React.useState<string[]>([]);

    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const indexNumber = React.useRef(0);

    const [errors,] = React.useState<{ [key: ID]: boolean } | null>(null);


    const refAnswersUser = React.useRef<{
        [key: ID]: string | number
    }>(selected ? selected : {});


    const setAnswersUser = (state: {
        [key: ID]: string | number
    }) => {

        let result = { ...refAnswersUser.current, ...state };
        refAnswersUser.current = result;

        let check = 1;

        for (let i = 0; i < indexNumber.current; i++) {
            if (!result[i] || !result['_' + i]) {
                check = 0;
                break;
            }
        }
        result['check'] = check;

        console.log(result);
        onChange(result);
    }



    React.useEffect(() => {
        // const answersOptions = (options.answer_option ?? []).map((item, index) => ({ ...item, index: index }));
        // let arrContent = options.content?.split('[option]');
        // setContentQuestion(arrContent ?? []);

        if (contentRef.current) {
            let innerHTML = contentRef.current.innerHTML;

            innerHTML = innerHTML.replaceAll('[option]', '<input ' + (showAnswerRight ? 'readonly style="cursor:not-allowed;" ' : '') + ' class="answerOption" />');

            contentRef.current.innerHTML = innerHTML;

            const inputText = contentRef.current.querySelectorAll('.answerOption');

            inputText.forEach((item, index) => {

                (item as HTMLInputElement).value = selected?.[index] ? selected[index].toString() : ''

                if (showAnswerRight) {
                    if (refAnswersUser.current['_' + index]) {
                        item.classList.add('success');
                    } else {
                        item.classList.add('error');
                    }
                } else {
                    item.setAttribute('data-index', index + '');

                    item.addEventListener('keyup', function (e) {

                        let check = 1;

                        const value = (item as HTMLInputElement).value;

                        if (value && (value.toLowerCase() === options.results[index]?.title.toLowerCase())) {
                            check = 1;
                        } else {
                            check = 0;
                        }

                        setAnswersUser({
                            [index]: value,
                            ['_' + index]: check,
                        });
                    });
                }

            });

            indexNumber.current = inputText.length;

        }

    }, [id]);

    // React.useEffect(() => {
    //
    // if (Object.keys(stateAnswersUser).filter(i => stateAnswersUser[i]).length !== (contentQuestion.length - 1)) {
    // stepByStepContext.setDisableButtonCheck(true);
    // } else {
    // stepByStepContext.setDisableButtonCheck(false);
    // }

    // }, [stateAnswersUser]);

    return (
        <>
            <CodeBlock
                sx={{
                    '& strong': {
                        fontSize: 30,
                        marginLeft: '3px',
                    }
                }}
                html={question}
            />

            <CodeBlock
                ref={contentRef}
                sx={(theme) => ({
                    fontSize: 18,
                    textAlign: 'justify',
                    marginTop: theme.spacing(3),
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
                        marginBottom: '-30px',
                        height: '28px',
                        fontSize: '16px',
                        padding: '0 16px',
                        border: '1px solid',
                        borderRadius: 1,
                        borderColor: '#c8d2db',
                        color: 'inherit',
                        textAlign: 'center',
                        backgroundColor: 'body.background',
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
                            color: 'white',
                        },
                        '&.error': {
                            borderColor: 'error.main',
                            backgroundColor: 'rgba(229, 57, 53, 0.08)',
                            color: 'white',
                        },
                    },
                    '&>pre': {
                        margin: '-16px !important',
                        // '& .token.tag': {
                        //     display: 'inline-flex',
                        //     alignItems: 'center',
                        // },
                    }
                })}
                html={options.content ?? ''}
            />
        </>
    )
}

export default FillInTheInput