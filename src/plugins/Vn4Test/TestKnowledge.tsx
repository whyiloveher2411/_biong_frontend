import { LoadingButton } from '@mui/lab';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import NoticeContent from 'components/molecules/NoticeContent';
import { getCookie, setCookie } from 'helpers/cookie';
import { __ } from 'helpers/i18n';
import { toCamelCase } from 'helpers/string';
import React from 'react';
import { ICourseTest } from 'services/elearningService';
import useConfirmDialog from 'hook/useConfirmDialog';
import Timer from './Timer';
import testService, { ITestStatus } from './testService';
import { UserState, useUser } from 'store/user/user.reducers';
import DrawerCustom from 'components/molecules/DrawerCustom';
import { LoginForm } from 'components/organisms/components/Auth/Login';
import { precentFormat } from 'plugins/Vn4Ecommerce/helpers/Money';
import { Link } from 'react-router-dom';

function TestKnowledge({ keyTest, content, testRule, onCreateButton }: {
    keyTest: string,
    content: (status: ITestStatus | null) => React.ReactNode,
    testRule: string,
    onCreateButton?: (createEntryTest: () => void) => void
}) {

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const user = useUser();

    const [openLoginForm, setOpenLoginForm] = React.useState(false);

    const [status, setStatus] = React.useState<ITestStatus | null>(null);

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

    const confirmCreateTest = useConfirmDialog({
        title: 'Đợi một tí đã',
        message: <>
            {status?.test_data?.addin_data?.content ?? ''}
            <Box
                sx={{
                    mt: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {
                    status?.test_data?.addin_data?.learn_link?.length ?
                        status?.test_data?.addin_data?.learn_link.map((item, index) => <Typography key={index} component={Link} sx={{ color: 'text.link', textDecoration: 'underline', '&:hover': { textDecoration: 'underline' } }} to={item.link} target='_blank' >{item.lable_button}</Typography>)
                        :
                        null
                }
            </Box>
        </>,
        renderButtons: (onConfirm, onClose) => <>
            <Button color='inherit' onClick={onClose}>Tôi sẽ làm sau</Button>
            <Button onClick={onConfirm}>Làm bài ngay</Button>
        </>
    });

    const onSubmitTest = () => {
        setMyAnswer(myAnswer => {
            (async () => {
                if (testContent) {
                    const submitTest = await testService.submitAnswer(keyTest, testContent.id, myAnswer);
                    if (submitTest) {
                        seeTestAgain((test) => {
                            setStatus({
                                is_continue: false,
                                is_create: true,
                                point: test.point,
                                total_point: test.total_point
                            });
                            // courseLearningContext.setEntryTestStatus({
                            //     is_continue: false,
                            //     is_create: true,
                            //     point: test.point,
                            //     total_point: test.total_point,
                            // });
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
        const test = await testService.getEntryTest(keyTest, testRule);
        if (test) {
            settestContent(test);
            setIsStartTest(true);
            setQuestionIndexCurrent(parseInt(getCookie('entry_step_test_' + test.id) + '') ? parseInt(getCookie('entry_step_test_' + test.id) + '') : 0)
            setMyAnswer((getCookie('entry_test_' + test.id, true) as null | { [key: string]: ANY }) ?? {});
        }
        setIsLoadingButton(false);
    }


    const seeTestAgain = async (callback?: (test: ICourseTest) => void) => {
        setIsLoadingButton(true);
        const test = await testService.getEntryTest(keyTest, testRule);
        if (test) {
            settestContent(test);
            setIsStartTest(true);
            setShowAnswerRight(true);
            setQuestionIndexCurrent(0);
            if (callback) {
                callback(test);
            }
        }
        setIsLoadingButton(false);
    }

    const createEntryTest = async () => {
        setIsLoadingButton(true);
        const test = await testService.getEntryTest(keyTest, testRule);
        if (test) {
            settestContent(test);
            setIsStartTest(true);
            setQuestionIndexCurrent(0);
        }
        setIsLoadingButton(false);
    }

    React.useEffect(() => {
        if (testContent?.id) {
            setCookie('entry_test_' + testContent.id, myAnswer, 1 / 48);
        }
    }, [myAnswer]);

    React.useEffect(() => {
        if (user._state === UserState.identify) {
            if (keyTest) {
                (async () => {
                    const checkStatus = await testService.checkEntryTest(keyTest, testRule);
                    setStatus(checkStatus);

                    if (checkStatus.is_continue) {
                        showContinuteTest();
                    }
                })();
            }
        }
    }, [keyTest, user]);

    return (<Box
        sx={{
            width: '100%',
            p: 3,
            maxWidth: 990,
            margin: '0 auto',
        }}
    >


        {
            user._state === UserState.identify && isStartTest && testContent ?
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
                        <Timer timeRemaining={testContent.time_remaining} onTimeOut={onSubmitTest} />
                    }
                    {

                        testContent ?
                            testContent.tests.length ?
                                testContent.tests[questionIndexCurrent] ?
                                    <Box
                                        sx={{
                                            width: '100%',
                                        }}
                                    >
                                        {
                                            showAnswerRight && testContent.total_point ?
                                                <Typography sx={{ mb: 1 }} variant='h4'>Điểm số {(testContent.point ?? 0) + ' / ' + testContent.total_point} ({precentFormat((testContent.point ?? 0) * 100 / (testContent.total_point ? testContent.total_point : 1))})</Typography>
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
                                                showAnswerRight ?
                                                    <Button color="inherit" variant='contained' onClick={() => setIsStartTest(false)}>Quay lại</Button>
                                                    :
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
                                                        let resolved = require(`./TestComponent/${compoment}`).default;
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
                                    disabled={questionIndexCurrent === 0}
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
                    {content(status)}
                    {/* {
                        status?.test_data?.time ?
                            <Typography sx={{ mt: 1 }}><strong>Thời gian làm bài:</strong> {convertHMS(status?.test_data?.time, true)}</Typography>
                            : null
                    } */}
                    {
                        user._state === UserState.identify ?
                            <>
                                <LoadingButton
                                    loading={isLoadingButton}
                                    variant='contained'
                                    sx={{
                                        mt: 2,
                                    }}
                                    onClick={() => {
                                        if (status?.is_create) {
                                            if (status.is_continue) {
                                                showContinuteTest();
                                            } else {
                                                seeTestAgain();
                                            }
                                        } else {
                                            confirmCreateTest.onConfirm(() => {
                                                createEntryTest();
                                            })
                                            // if (onCreateButton) {
                                            //     onCreateButton(createEntryTest);
                                            // } else {
                                            //     createEntryTest();
                                            // }
                                        }
                                    }}
                                >
                                    {
                                        status?.is_create ?
                                            status.is_continue ?
                                                'Tiếp tục làm bài'
                                                :
                                                'Xem lại đáp án'
                                            :

                                            'Bắt đầu làm bài'
                                    }
                                </LoadingButton>
                                {
                                    status?.is_create && !status.is_continue && status.total_point ?
                                        <Typography sx={{ mt: 2 }} variant='h4'>Điểm số: {(status.point ?? 0) + ' / ' + status.total_point} ({precentFormat((status.point ?? 0) * 100 / (status.total_point ? status.total_point : 1))})</Typography>
                                        : null
                                }
                            </>
                            :
                            <Button
                                variant='contained'
                                sx={{
                                    mt: 2,
                                }}
                                onClick={() => setOpenLoginForm(true)}
                            >Đăng nhập để làm bài</Button>
                    }
                </>
        }

        {confirmDialog.component}
        {confirmCreateTest.component}

        <DrawerCustom
            title={'Đăng nhập'}
            open={openLoginForm && user._state !== UserState.identify}
            onCloseOutsite
            onClose={() => {
                setOpenLoginForm(false);
            }}
            restDialogContent={{
                sx: {
                    display: 'flex',
                    alignItems: 'center',
                }
            }}
        >
            <Box
                sx={{
                    pt: 3
                }}
            >
                <LoginForm />
            </Box>
        </DrawerCustom>
    </Box >)
}

export default TestKnowledge