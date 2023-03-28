import Icon from 'components/atoms/Icon'
import MoreButton from 'components/atoms/MoreButton'
import Typography from 'components/atoms/Typography'
import { extractContent } from 'helpers/string'
import React from 'react'
import { QuestionTestProps } from 'services/elearningService'

function FillInTheBlanks({ question, showAnswerRight, selected, onChange }: {
    question: QuestionTestProps,
    showAnswerRight: boolean,
    selected?: { [key: number]: string },
    onChange: (value: ANY) => void,
}) {

    return (<>
        <Typography variant='h3'>{question.content}</Typography>
        <Typography component="div" sx={{ lineHeight: '32px', fontSize: 18, mt: 2, }}>
            {
                (() => {
                    let arrContent = question.content.split('[option]');

                    return arrContent.map((item, index) => (
                        <React.Fragment key={index}>
                            {extractContent(item)}
                            {
                                showAnswerRight ?
                                    (
                                        index !== (arrContent.length - 1)
                                            && question.answer_option[index] ?
                                            (() => {

                                                const anwser = question.answer_option[index]?.options.find(item => item.is_answer);
                                                let rightAnwser = selected?.[index] ? selected[index] : '';
                                                const myAnwser = selected?.[index] ? selected[index] : '';

                                                if (anwser) {
                                                    rightAnwser = anwser.title;
                                                }

                                                if (rightAnwser === myAnwser) {
                                                    return <Typography component='span' sx={{ color: 'success.main', textDecoration: 'underline', }}>{myAnwser}&nbsp;</Typography>
                                                }

                                                if (myAnwser) {
                                                    return <>
                                                        <Typography component='span' sx={{ color: 'error.main', textDecoration: 'line-through', }}>{myAnwser}&nbsp;</Typography>
                                                        <Typography component='span' sx={{ color: 'success.main', textDecoration: 'underline', }}>({rightAnwser})&nbsp;</Typography>
                                                    </>
                                                }

                                                return <Typography component='span' sx={{ color: 'warning.main', textDecoration: 'underline', }}>({rightAnwser})&nbsp;</Typography>
                                            })()
                                            :
                                            <></>
                                    )
                                    :
                                    (
                                        Boolean(index !== (arrContent.length - 1) && question.answer_option[index]) &&
                                        <MoreButton
                                            actions={[
                                                {
                                                    ...(question.answer_option[index].options.map((item, indexOption) => ({
                                                        title: item.title,
                                                        selected: selected && selected[index] === item.title ? true : false,
                                                        action: () => {
                                                            if (selected === undefined || typeof selected !== 'object') {
                                                                onChange({
                                                                    [index]: item.title
                                                                });
                                                            } else {
                                                                onChange({
                                                                    ...selected,
                                                                    [index]: item.title
                                                                })
                                                            }

                                                        }
                                                    })))
                                                }
                                            ]}
                                        >
                                            <Typography
                                                component={'span'}
                                                sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    borderBottom: '1px solid',
                                                    marginBottom: '-1px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {
                                                    selected && selected[index] !== undefined ?
                                                        selected[index]
                                                        : [...Array(question.answer_option[index]?.options.reduce((a, b) => {
                                                            if (b.title.length > a) return b.title.length;
                                                            return a;
                                                        }, 0))].map((i, indexSpace) => <span key={indexSpace}>&nbsp;&nbsp;</span>)
                                                }

                                                <Icon icon="ArrowDropDown" />
                                            </Typography>
                                        </MoreButton>
                                    )
                            }
                        </React.Fragment>
                    ))
                })()
            }
        </Typography>
    </>)
}

export default FillInTheBlanks