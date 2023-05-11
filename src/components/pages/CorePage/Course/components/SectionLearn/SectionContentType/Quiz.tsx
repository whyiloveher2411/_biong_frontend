import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Icon from 'components/atoms/Icon'
import TestType from 'plugins/Vn4Test/TestType'
import testService from 'plugins/Vn4Test/testService'
import React from 'react'
import { CourseLessonProps, ProcessLearning } from 'services/courseService'
import { ITestType } from 'services/elearningService'
import Divider from 'components/atoms/Divider'
import CourseLearningContext from '../../../context/CourseLearningContext'

function Quiz({ lesson, process }: {
    lesson: QuizContent,
    process: QuizProcessLearning | null,
    style?: React.CSSProperties
}) {

    const [tests, setTests] = React.useState<Array<ITestType>>([]);
    const [showAnswerRight, setShowAnswerRight] = React.useState(false);

    const [showTestAgain, setShowTestAgain] = React.useState(false);

    const [myAnswer, setMyAnswer] = React.useState<{
        [key: string]: ANY
    }>({});

    const [questionIndexCurrent, setQuestionIndexCurrent] = React.useState(0);

    const courseLearningContext = React.useContext(CourseLearningContext);

    React.useEffect(() => {
        if (process?.quiz_data?.tests) {
            const tests = process.quiz_data.tests;
            tests.forEach(item => {
                try {
                    item.optionsObj = JSON.parse(item.options);
                } catch (error) {
                    item.optionsObj = null;
                }
            });
            setTests(tests);
        } else {
            setTests([]);
        }

    }, [process]);

    const handleOnSubmitTests = async () => {

        setShowAnswerRight(true);
        setQuestionIndexCurrent(0);
        setShowTestAgain(false);

        const result = await testService.submitTestOfLesson(lesson.id, myAnswer);

        if (result.point !== result.total_point) {
            setShowTestAgain(true);
        } else {
            setShowTestAgain(false);
            courseLearningContext.handleClickInputCheckBoxLesson(lesson);
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                p: 3,
                pl: 7,
                pr: 7,
                maxWidth: 1200,
                margin: '0 auto',
                minHeight: 'calc(100vh - 112px)',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant='h2'>
                    {lesson.title}
                    {
                        showAnswerRight && showTestAgain ?
                            <Button
                                variant='contained'
                                color='secondary'
                                size="small"
                                sx={{ ml: 1 }}
                                onClick={() => {
                                    setQuestionIndexCurrent(0);
                                    setMyAnswer({});
                                    setShowAnswerRight(false);
                                }}
                            >làm lại</Button>
                            : null
                    }
                </Typography>
                <Typography component='span' variant='h4'>Câu hỏi {questionIndexCurrent + 1}/{tests.length}</Typography>
            </Box>
            <Divider color='dark' />
            {
                tests[questionIndexCurrent] ?
                    <>
                        <Box
                            sx={{
                                width: '100%'
                            }}
                        >
                            <TestType
                                key={tests[questionIndexCurrent].id}
                                type={tests[questionIndexCurrent].optionsObj?.type ?? 'quiz'}
                                id={tests[questionIndexCurrent].id as ID}
                                question={tests[questionIndexCurrent].question}
                                options={tests[questionIndexCurrent].optionsObj}
                                showAnswerRight={showAnswerRight}
                                selected={myAnswer[tests[questionIndexCurrent].id]}
                                onChange={(value: ANY) => {
                                    setMyAnswer(prev => ({
                                        ...prev,
                                        [tests[questionIndexCurrent].id]: value
                                    }))
                                }}
                            />

                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                mt: 3,
                            }}
                        >
                            <Button
                                disabled={questionIndexCurrent === 0}
                                color='inherit'
                                variant='contained'
                                startIcon={<Icon icon="ArrowBackRounded" />}
                                onClick={() => {
                                    setQuestionIndexCurrent(prev => {
                                        if (prev > 0) {
                                            return prev - 1;
                                        }
                                        return prev;
                                    });
                                }}
                            >Quay lại</Button>

                            {
                                showAnswerRight || questionIndexCurrent < (tests.length - 1) ?
                                    <Button
                                        variant='contained'
                                        endIcon={<Icon icon="ArrowForwardRounded" />}
                                        disabled={questionIndexCurrent >= (tests.length - 1)
                                            || !((typeof myAnswer[tests[questionIndexCurrent].id] === 'string'
                                                && myAnswer[tests[questionIndexCurrent].id])
                                                || myAnswer[tests[questionIndexCurrent].id]?.[0] !== undefined)}
                                        onClick={() => {
                                            setQuestionIndexCurrent(prev => {
                                                if (prev < (tests.length - 1)) {
                                                    return prev + 1;
                                                }
                                                return prev;
                                            });
                                        }}
                                    >
                                        Câu hỏi tiếp theo
                                    </Button>
                                    :
                                    <Button
                                        variant='contained'
                                        disabled={Object.keys(myAnswer).filter(key => (typeof myAnswer[key] === 'string' && myAnswer[key]) || myAnswer[key]?.[0] !== undefined).length !== tests.length}
                                        color="success"
                                        onClick={handleOnSubmitTests}
                                    >
                                        Hoàn thành
                                    </Button>
                            }
                        </Box>
                    </>
                    : null
            }
        </Box>
    )
}

export default Quiz


interface QuizContent extends CourseLessonProps {
    description: string,
    pdf_file: string
}


interface QuizProcessLearning extends ProcessLearning {
    quiz_data?: {
        tests: Array<ITestType>,
    }
}