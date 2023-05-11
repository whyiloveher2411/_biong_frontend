import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import Button from 'components/atoms/Button'
import Icon from 'components/atoms/Icon'
import TestType from 'plugins/Vn4Test/TestType'
import React from 'react'
import { ITestType } from 'services/elearningService'

function Tests({ tests: testProps, exploreId, index }: {
    tests?: Array<ITestType>,
    exploreId: ID,
    index: number
}) {

    const firstLoadData = React.useRef(true);
    const [tests, setTests] = React.useState<Array<ITestType> | undefined>(undefined);
    const [questionIndexCurrent, setQuestionIndexCurrent] = React.useState(0);
    const [myAnswer, setMyAnswer] = React.useState<{
        [key: string]: ANY
    }>({});
    const [showAnswerRight, setShowAnswerRight] = React.useState(false);

    const handleOnSubmitTests = async () => {
        setShowAnswerRight(true);
        setQuestionIndexCurrent(0);
    }

    React.useEffect(() => {
        if (testProps) {
            const tests = testProps;
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

    }, [testProps]);

    React.useEffect(() => {
        if (!firstLoadData.current) {
            localStorage.setItem('explore_t_' + exploreId + '_' + index, JSON.stringify({
                myAnswer: myAnswer,
                questionIndexCurrent: questionIndexCurrent,
                showAnswerRight: showAnswerRight,
            }));
        }
    }, [questionIndexCurrent, myAnswer, showAnswerRight]);

    React.useEffect(() => {

        let dataStorage = localStorage.getItem('explore_t_' + exploreId + '_' + index);

        if (dataStorage) {

            try {
                let data: {
                    myAnswer: {
                        [key: string]: ANY
                    },
                    questionIndexCurrent: number,
                    showAnswerRight: boolean,
                } = JSON.parse(dataStorage);
                console.log(data);
                if (data && typeof data === 'object') {
                    setMyAnswer(data.myAnswer);
                    setQuestionIndexCurrent(data.questionIndexCurrent);
                    setShowAnswerRight(data.showAnswerRight);
                }
                firstLoadData.current = false;
            } catch (error) {
                //
            }
        }
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
            }}
        >
            {
                tests ?
                    <>
                        <Typography component='span' variant='h4'>Câu hỏi {questionIndexCurrent + 1}/{tests.length}</Typography>
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
                    :
                    <></>
            }
        </Box>
    )
}

export default Tests