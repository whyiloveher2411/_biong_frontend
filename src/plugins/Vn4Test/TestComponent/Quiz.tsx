import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import Box from 'components/atoms/Box';
import CodeBlock from 'components/atoms/CodeBlock';
import FormControl from 'components/atoms/FormControl';
import Icon from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import Typography from 'components/atoms/Typography';
import { QuestionTestProps } from 'services/elearningService';


function Quiz({ question, options, showAnswerRight, selected, onChange }: {
    question: string,
    options: QuestionTestProps,
    showAnswerRight: boolean,
    selected?: string[],
    onChange: (value: ANY) => void,
}) {

    const isMultiChoose = options.answers && options.answers?.filter(item => item.is_answer).length > 1 ? true : false;

    return (<>
        <CodeBlock
            html={question}
        />
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                mt: 2,
            }}
        >
            {
                options.answers.map((answer, index2) => {

                    const isSelect = selected && selected.findIndex(code => code === answer.code) > -1 ? true : false;

                    return <Box key={index2}
                        sx={{
                            p: 1,
                            display: 'flex',
                            gap: 1,
                            border: '1px solid',
                            borderColor: 'dividerDark',
                            borderRadius: 1,
                            cursor: showAnswerRight ? 'initial' : 'pointer',
                            backgroundColor: showAnswerRight && answer.is_answer ?
                                isSelect ?
                                    'success.light'
                                    :
                                    'dividerDark'
                                :
                                showAnswerRight && !answer.is_answer && isSelect ?
                                    'error.light' :
                                    'unset',
                            '&:hover': {
                                backgroundColor: showAnswerRight && answer.is_answer ?
                                    isSelect ?
                                        'success.light'
                                        :
                                        'dividerDark'
                                    :
                                    showAnswerRight && !answer.is_answer && isSelect ?
                                        'error.light' :
                                        showAnswerRight ? 'initial' : 'divider',
                            }
                        }}
                        onClick={() => {
                            if (!showAnswerRight) {

                                if (isMultiChoose) {
                                    // setSelected(prev => ({
                                    //     ...prev,
                                    //     [questionIndexCurrent]: {
                                    //         ...prev[questionIndexCurrent],
                                    //         [index2]: !prev[questionIndexCurrent]?.[index2]
                                    //     },
                                    // }))

                                    if (selected === undefined || !Array.isArray(selected)) {
                                        onChange([answer.code]);
                                    } else {
                                        if (isSelect) {
                                            onChange(selected.filter(code => code !== answer.code));
                                        } else {
                                            selected.push(answer.code);
                                            onChange([...selected]);
                                        }
                                    }
                                } else {

                                    onChange([answer.code]);
                                    // setSelected(prev => ({
                                    //     ...prev,
                                    //     [questionIndexCurrent]: {
                                    //         [index2]: true
                                    //     },
                                    // }))
                                }

                            }
                        }}
                    >
                        <FormControl sx={{
                            flexShrink: 0,
                            '& .MuiCheckbox-root, & .MuiRadio-root': {
                                color: showAnswerRight && (answer.is_answer || isSelect) ? 'success.contrastText' : 'primari.main',
                            }
                        }}>
                            {
                                showAnswerRight ?
                                    answer.is_answer ?
                                        isSelect ?
                                            <IconButton sx={{ pointerEvents: 'none' }}>
                                                <Icon renderVersion="success" color="success" icon="CheckRounded" />
                                            </IconButton>
                                            :
                                            <IconButton sx={{ opacity: 0, pointerEvents: 'none' }}>
                                                <Icon renderVersion="none" icon="CheckRounded" />
                                            </IconButton>
                                        :
                                        isSelect ?
                                            <IconButton sx={{ pointerEvents: 'none' }}>
                                                <Icon renderVersion="error" color="error" icon="ClearRounded" />
                                            </IconButton>
                                            :
                                            <IconButton sx={{ opacity: 0, pointerEvents: 'none' }}>
                                                <Icon renderVersion="none" icon="CheckRounded" />
                                            </IconButton>
                                    // selected[questionIndexCurrent] !== undefined ?
                                    //     (
                                    //         selected[questionIndexCurrent]?.[index2] && answer.is_answer ?
                                    //             <IconButton sx={{ pointerEvents: 'none' }}>
                                    //                 <Icon color="success" icon="CheckRounded" />
                                    //             </IconButton>
                                    //             :
                                    //             <IconButton sx={{ pointerEvents: 'none' }}>
                                    //                 <Icon color="error" icon="ClearRounded" />
                                    //             </IconButton>
                                    //     )
                                    //     :
                                    //     <IconButton sx={{ opacity: 0, pointerEvents: 'none' }}>
                                    //         <Icon icon="Abc" />
                                    //     </IconButton>
                                    :
                                    isMultiChoose ?
                                        <Checkbox
                                            checked={isSelect ? true : false}
                                        />
                                        :
                                        <Radio checked={isSelect ? true : false} />
                            }
                        </FormControl>
                        <Box>
                            <Typography
                                variant='h5'
                                sx={(theme) => ({
                                    width: '100%',
                                    lineHeight: '38px',
                                    color: showAnswerRight
                                        && isSelect
                                        && theme.palette.mode === 'dark' ? '#263238' : 'text.primary',
                                })}>
                                {answer.title}
                            </Typography>
                            {
                                Boolean(showAnswerRight && answer.explain) &&
                                <Box sx={(theme) => ({
                                    marginTop: '-8px',
                                    fontSize: '15px',
                                    opacity: 0.8,
                                    '& p': { margin: 0 },
                                    color: showAnswerRight
                                        && isSelect
                                        && theme.palette.mode === 'dark' ? '#263238' : 'text.primary',
                                })} dangerouslySetInnerHTML={{ __html: answer.explain }} />
                            }
                        </Box>
                        <Box
                            sx={{
                                width: 'auto',
                                minWidth: 165,
                                flexShrink: 0,
                                marginLeft: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: showAnswerRight ? 1 : 0,
                            }}
                        >
                            {
                                isSelect ?
                                    <Typography
                                        sx={{
                                            p: 1,
                                            pt: 0.5,
                                            pb: 0.5,
                                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                            color: 'white',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >Câu trả lời của bạn</Typography>
                                    :
                                    answer.is_answer ?
                                        <Typography
                                            sx={{
                                                p: 1,
                                                pt: 0.5,
                                                pb: 0.5,
                                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                color: 'white',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >Câu trả lời chính xác</Typography>
                                        :
                                        ''
                            }
                        </Box>
                    </Box>
                })
            }
        </Box>
    </>)
}

export default Quiz