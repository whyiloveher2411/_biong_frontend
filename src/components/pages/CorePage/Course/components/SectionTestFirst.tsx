import { LoadingButton } from '@mui/lab';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import NoticeContent from 'components/molecules/NoticeContent';
import { getCookie, setCookie } from 'helpers/cookie';
import { __ } from 'helpers/i18n';
import { toCamelCase } from 'helpers/string';
import React from 'react';
import { CourseProps } from 'services/courseService';
import elearningService, { ICourseTest } from 'services/elearningService';
import TestWrapper from './CourseTest/TestWrapper';
import useConfirmDialog from 'hook/useConfirmDialog';
import CourseLearningContext from '../context/CourseLearningContext';

function SectionTestFirst({ course }: { course: CourseProps }) {

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const courseLearningContext = React.useContext(CourseLearningContext);

    const [testContent, settestContent] = React.useState<ICourseTest | null>(null);

    const [myAnswer, setMyAnswer] = React.useState<{
        [key: string]: ANY
    }>({});

    const [questionIndexCurrent, setQuestionIndexCurrent] = React.useState(0);

    const [isStartTest, setIsStartTest] = React.useState(false);

    const [showAnswerRight, setShowAnswerRight] = React.useState(false);

    const confirmDialog = useConfirmDialog({
        title: 'Bạn có chắc muốn gửi bài kiểm tra?',
        message: 'Bạn đã kiểm tra tất cả câu hỏi và chắc chắn muốn gửi bài kiểm tra.'
    });

    const onSubmitTest = () => {
        setMyAnswer(myAnswer => {
            (async () => {
                if (testContent) {
                    const submitTest = await elearningService.test.submitAnswer(course.id, testContent.id, myAnswer);
                    if (submitTest) {
                        seeTestAgain((test) => {
                            courseLearningContext.setEntryTestStatus({
                                is_continue: false,
                                is_create: true,
                                point: test.point,
                                total_point: test.total_point,
                            });
                        });
                    }
                }
            })();
            return myAnswer;
        });
    }

    // React.useEffect(() => {
    //     setIsLoadingButton(true);
    //     (async () => {

    //         const checkStatus = await elearningService.test.checkEntryTest(course.id);

    //         setCheckStatus(checkStatus);

    //         if (checkStatus.is_continue) {
    //             showContinuteTest();
    //         } else {
    //             setIsLoadingButton(false);
    //         }

    //         // const test = await elearningService.test.getEntryTest(course.id);
    //         // setTest(test);
    //         // setShowAnswerRight(test.show_answer);
    //         // if (test?.my_answer) {
    //         //     setShowAnswerRight(true);
    //         //     setSelected(test?.my_answer);
    //         // } else {
    //         //     setSelected({});
    //         //     setShowAnswerRight(false);
    //         // }

    //         // setQuestionIndexCurrent(0);
    //     })();
    // }, []);

    const showContinuteTest = async () => {
        setIsLoadingButton(true);
        const test = await elearningService.test.getEntryTest(course.id);
        settestContent(test);
        setIsStartTest(true);
        setIsLoadingButton(false);
        setQuestionIndexCurrent(parseInt(getCookie('entry_step_test_' + test.id) + '') ? parseInt(getCookie('entry_step_test_' + test.id) + '') : 0)
        setMyAnswer((getCookie('entry_test_' + test.id, true) as null | { [key: string]: ANY }) ?? {});
    }

    const seeTestAgain = async (callback?: (test: ICourseTest) => void) => {
        setIsLoadingButton(true);
        const test = await elearningService.test.getEntryTest(course.id);
        settestContent(test);
        setIsStartTest(true);
        setShowAnswerRight(true);
        setIsLoadingButton(false);
        setQuestionIndexCurrent(0);
        if (callback) {
            callback(test);
        }
    }

    const createEntryTest = async () => {
        setIsLoadingButton(true);
        const test = await elearningService.test.getEntryTest(course.id);
        settestContent(test);
        setIsStartTest(true);
        setIsLoadingButton(false);
        setQuestionIndexCurrent(0);
    }

    React.useEffect(() => {
        if (testContent?.id) {
            setCookie('entry_test_' + testContent.id, myAnswer, 1 / 48);
        }
    }, [myAnswer]);

    return (<Box
        sx={{
            p: 3,
            pt: 7,
            maxWidth: 990,
            margin: '0 auto',
        }}
    >


        {
            isStartTest && testContent ?
                <Box
                    sx={{
                        minHeight: '100%',
                        pt: 3,
                        pb: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {
                        !showAnswerRight &&
                        <TestWrapper timeRemaining={testContent.time_remaining} onTimeOut={onSubmitTest} />
                    }
                    {

                        testContent ?
                            testContent.tests.length ?
                                testContent.tests[questionIndexCurrent] ?
                                    <Box
                                        sx={{
                                            width: '100%',
                                            pt: 6,
                                        }}
                                    >
                                        {
                                            showAnswerRight && testContent.total_point ?
                                                <Typography sx={{ mb: 1 }} variant='h4'>Điểm số {(testContent.point ?? 0) + ' / ' + testContent.total_point}</Typography>
                                                : null
                                        }
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                mb: 3,
                                            }}
                                        >
                                            <Typography variant='h2'>Câu hỏi {questionIndexCurrent + 1} / {testContent.tests.length}
                                                &nbsp;<Typography component='span' sx={{ color: (showAnswerRight && !testContent.time_submit) || testContent.my_answer?.['_' + testContent.tests[questionIndexCurrent].id] ? 'error.main' : 'success.main' }}> {testContent.tests[questionIndexCurrent].difficult} điểm </Typography>
                                            </Typography>
                                            {
                                                !showAnswerRight &&
                                                <Button
                                                    variant='contained'
                                                    color="success"
                                                    disabled={Object.keys(myAnswer).filter(key => (typeof myAnswer[key] === 'string' && myAnswer[key]) || myAnswer[key].length).length !== testContent.tests.length}
                                                    onClick={() => {
                                                        confirmDialog.onConfirm(() => {
                                                            onSubmitTest();
                                                        });
                                                    }}
                                                >
                                                    Hoàn thành
                                                </Button>
                                            }
                                        </Box>
                                        {
                                            (() => {
                                                if (testContent.tests[questionIndexCurrent].optionsObj?.type) {
                                                    //@ts-ignore
                                                    let compoment = toCamelCase(testContent.tests[questionIndexCurrent].optionsObj.type);
                                                    try {
                                                        //eslint-disable-next-line
                                                        let resolved = require(`./CourseTest/${compoment}`).default;
                                                        return React.createElement(resolved, {
                                                            question: testContent.tests[questionIndexCurrent].question,
                                                            options: testContent.tests[questionIndexCurrent].optionsObj,
                                                            showAnswerRight: showAnswerRight,
                                                            selected: showAnswerRight ? testContent.my_answer?.[testContent.tests[questionIndexCurrent].id] : myAnswer[testContent.tests[questionIndexCurrent].id],
                                                            onChange: (value: ANY) => {
                                                                setMyAnswer(prev => ({
                                                                    ...prev,
                                                                    [testContent.tests[questionIndexCurrent].id]: value
                                                                }))
                                                            }
                                                        });
                                                    } catch (error) {
                                                        console.log(compoment);
                                                    }
                                                }
                                                return;
                                            })()
                                        }
                                    </Box>
                                    :
                                    <></>
                                :
                                <NoticeContent
                                    title={__('Nội dung đang cập nhật')}
                                    description=''
                                    image='/images/undraw_no_data_qbuo.svg'
                                    disableButtonHome
                                />
                            :
                            [1, 2, 3, 4, 5, 6, 7].map(item => (
                                <Skeleton key={item} variant='rectangular' sx={{ width: '100%', height: 42 }} />
                            ))
                    }
                    {
                        testContent && testContent.tests.length ?
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    pt: 3,
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                {/* <Button
                            disabled={questionIndexCurrent < 1}
                            color='inherit'
                            variant='contained'
                            onClick={() => {
                                setShowAnswerRight(false);
                                setQuestionIndexCurrent(prev => {
                                    if (selected[prev - 1]) {
                                        delete selected[prev - 1];
                                        setSelected({ ...selected });
                                    }
                                    return prev - 1;
                                });
                            }}
                        >Quay lại</Button> */}
                                <Button
                                    disabled={questionIndexCurrent < 1}
                                    color='inherit'
                                    variant='contained'
                                    onClick={() => {
                                        setQuestionIndexCurrent(prev => {
                                            if (prev > 0) {
                                                setCookie('entry_step_test_' + testContent.id, prev - 1 + '', 1 / 48);
                                                return prev - 1;
                                            }
                                            return prev;
                                        });
                                    }}
                                >Quay lại</Button>

                                {
                                    showAnswerRight ?
                                        <Button
                                            disabled={questionIndexCurrent >= (testContent.tests.length - 1)}
                                            variant='contained'
                                            onClick={() => {
                                                setQuestionIndexCurrent(prev => {
                                                    if (prev < (testContent.tests.length - 1)) {
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
                                            disabled={questionIndexCurrent >= (testContent.tests.length - 1)
                                                || !((typeof myAnswer[testContent.tests[questionIndexCurrent].id] === 'string'
                                                    && myAnswer[testContent.tests[questionIndexCurrent].id])
                                                    || myAnswer[testContent.tests[questionIndexCurrent].id]?.length)}
                                            variant='contained'
                                            onClick={() => {
                                                setQuestionIndexCurrent(prev => {
                                                    if (prev < (testContent.tests.length - 1)) {
                                                        setCookie('entry_step_test_' + testContent.id, prev + 1 + '', 1 / 48);
                                                        return prev + 1;
                                                    }
                                                    return prev;
                                                });
                                            }}
                                        >
                                            Câu hỏi tiếp theo
                                        </Button>
                                }

                                {
                                    // testContent.my_answer ?
                                    //     <>
                                    //         <Button
                                    //             disabled={questionIndexCurrent < 1}
                                    //             color='inherit'
                                    //             variant='contained'
                                    //             onClick={() => {
                                    //                 setQuestionIndexCurrent(prev => prev > 0 ? --prev : prev);
                                    //             }}
                                    //         >Quay lại</Button>
                                    //         {
                                    //             questionIndexCurrent >= (testContent.tests.length - 1) ?
                                    //                 <Button
                                    //                     disabled={!myAnswer[testContent.tests[questionIndexCurrent].id] || !myAnswer[testContent.tests[questionIndexCurrent].id]?.length}
                                    //                     variant='contained'
                                    //                     onClick={() => {
                                    //                         //
                                    //                     }}
                                    //                 >
                                    //                     Hoàn thành
                                    //                 </Button>
                                    //                 :
                                    //                 <Button
                                    //                     disabled={!showAnswerRight && (!myAnswer[testContent.tests[questionIndexCurrent].id] || !myAnswer[testContent.tests[questionIndexCurrent].id]?.length)}
                                    //                     variant='contained'
                                    //                     onClick={() => {
                                    //                         setQuestionIndexCurrent(prev => prev < (testContent.tests.length - 1) ? ++prev : prev);
                                    //                     }}
                                    //                 >
                                    //                     Câu hỏi tiếp theo
                                    //                 </Button>
                                    //         }

                                    //     </>
                                    //     :
                                    //     <>
                                    //         <Box></Box>
                                    //         {
                                    //             showAnswerRight && (questionIndexCurrent === (testContent.tests.length - 1)) ?
                                    //                 <LoadingButton
                                    //                     variant='contained'
                                    //                     loading={false}
                                    //                     color='success'
                                    //                     onClick={() => {
                                    //                         onSubmitTest();
                                    //                     }}
                                    //                 >
                                    //                     Hoàn thành
                                    //                 </LoadingButton>
                                    //                 :
                                    //                 <Button
                                    //                     variant='contained'
                                    //                     color='primary'
                                    //                     onClick={() => {
                                    //                         if (showAnswerRight) {
                                    //                             setShowAnswerRight(false);
                                    //                             setQuestionIndexCurrent(prev => {

                                    //                                 if (myAnswer[prev + 1]) {
                                    //                                     delete myAnswer[prev + 1];
                                    //                                     setMyAnswer({ ...myAnswer });
                                    //                                 }

                                    //                                 return prev + 1;
                                    //                             });
                                    //                         } else {
                                    //                             setShowAnswerRight(true);
                                    //                         }
                                    //                     }}
                                    //                 >
                                    //                     {
                                    //                         showAnswerRight ?
                                    //                             'Câu hỏi tiếp theo' :
                                    //                             'Xem đáp án'
                                    //                     }
                                    //                 </Button>
                                    //         }
                                    //     </>
                                }
                            </Box>
                            :
                            <></>
                    }
                </Box>
                :
                <>
                    <Typography variant='h2'>Kiểm tra đầu vào</Typography>
                    <Typography sx={{ mt: 1, }}>Kiểm tra kiến thức cơ bản trước khi trước khi vào học, nhanh chống và tiện lợi. Ngoài ra bạn có thể nhận được các khuyến mãi nếu bài kiểm tra của bạn hoàn thành đúng điều kiện</Typography>
                    <LoadingButton
                        loading={isLoadingButton}
                        variant='contained'
                        sx={{
                            mt: 2,
                        }}
                        onClick={() => {
                            if (courseLearningContext.entryTestStatus?.is_create) {
                                if (courseLearningContext.entryTestStatus.is_continue) {
                                    showContinuteTest();
                                } else {
                                    seeTestAgain();
                                }
                            } else {
                                createEntryTest();
                            }
                        }}
                    >
                        {
                            courseLearningContext.entryTestStatus?.is_create ?
                                courseLearningContext.entryTestStatus.is_continue ?
                                    'Tiếp tục làm bài'
                                    :
                                    'Xem lại bài kiểm tra'
                                :

                                'Bắt đầu làm bài'
                        }
                    </LoadingButton>
                    {
                        courseLearningContext.entryTestStatus?.is_create && !courseLearningContext.entryTestStatus.is_continue && courseLearningContext.entryTestStatus.total_point ?
                            <Typography sx={{ mt: 2 }} variant='h4'>Điểm số {(courseLearningContext.entryTestStatus.point ?? 0) + ' / ' + courseLearningContext.entryTestStatus.total_point}</Typography>
                            : null
                    }
                </>
        }

        {confirmDialog.component}
    </Box >)
}

export default SectionTestFirst