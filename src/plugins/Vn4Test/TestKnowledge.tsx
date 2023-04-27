import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, Skeleton, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import DrawerCustom from 'components/molecules/DrawerCustom';
import NoticeContent from 'components/molecules/NoticeContent';
import Popconfirm from 'components/molecules/Popconfirm';
import { LoginForm } from 'components/organisms/components/Auth/Login';
import { deleteCookie, getCookie, setCookie } from 'helpers/cookie';
import { __ } from 'helpers/i18n';
import useConfirmDialog from 'hook/useConfirmDialog';
import { precentFormat } from 'plugins/Vn4Ecommerce/helpers/Money';
import React from 'react';
import { Link } from 'react-router-dom';
import { ICourseTest, QuestionTestProps } from 'services/elearningService';
import { UserState, useUser } from 'store/user/user.reducers';
import TestType from './TestType';
import Timer from './Timer';
import testService, { ITestStatus } from './testService';

function TestKnowledge({ keyTest, title, content, testRule, checkStatus: checkStatusProps, onSetPoint, renderAfterSummary }: {
    keyTest: string,
    title: string,
    content: (status: ITestStatus | null) => React.ReactNode,
    renderAfterSummary?: (onResetTestQuiz: () => void) => React.ReactNode,
    testRule: string,
    checkStatus?: ITestStatus | null,
    onSetPoint?: (point: {
        point: number,
        total_point: number,
        is_continue: boolean,
        is_create: boolean,
    }) => void,
}) {

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);
    const [isLoadingButtonFirst, setIsLoadingButtonFirst] = React.useState(false);

    const user = useUser();

    const [openLoginForm, setOpenLoginForm] = React.useState(false);

    const [showInstructionalContent, setShowInstructionalContent] = React.useState(false);

    const [showResultSummary, setShowResultSummary] = React.useState(false);

    const [status, setStatus] = React.useState<ITestStatus | null>(null);

    const [openDrawTest, setOpenDrawTest] = React.useState(false);

    const [testContent, settestContent] = React.useState<ICourseTest | null>(null);

    const [myAnswer, setMyAnswer] = React.useState<{
        [key: string]: ANY
    }>({});

    const [questionIndexCurrent, setQuestionIndexCurrent] = React.useState(0);

    // const [isStartTest, setIsStartTest] = React.useState(false);

    const [showAnswerRight, setShowAnswerRight] = React.useState(false);

    const acceptCloseWhenTesting = useConfirmDialog({
        title: 'Bạn có chắc muốn thoát bài kiểm tra?',
        message: 'Bạn đang làm bài kiểm tra và chưa nộp bài, bạn có chắc muốn đóng của số làm bài không?'
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

                            if (onSetPoint) {
                                onSetPoint({
                                    is_continue: false,
                                    is_create: true,
                                    point: test.point,
                                    total_point: test.total_point,
                                });
                            }
                        });
                    }
                }
            })();
            return myAnswer;
        });
    }

    const showContinuteTest = async () => {
        setIsLoadingButton(true);
        setOpenDrawTest(true);
        const test = await testService.getEntryTest(keyTest, testRule);
        if (test) {
            settestContent(test);
            // setIsStartTest(true);
            if (test.is_continue) {
                setQuestionIndexCurrent(parseInt(getCookie('entry_step_test_' + test.id) + '') ? parseInt(getCookie('entry_step_test_' + test.id) + '') : 0)
                setMyAnswer((getCookie('entry_test_' + test.id, true) as null | { [key: string]: ANY }) ?? {});
            } else {
                setShowResultSummary(true);
                setShowAnswerRight(true);
                setQuestionIndexCurrent(0);
            }
        }
        setIsLoadingButton(false);
    }

    const handleResetTest = async () => {
        setIsLoadingButton(true);
        setOpenDrawTest(true);
        const test = await testService.getEntryTest(keyTest, testRule, 1);
        if (test) {

            deleteCookie('entry_step_test_' + test.id);
            deleteCookie('entry_test_' + test.id);

            settestContent(test);
            // setIsStartTest(true);
            if (test.is_continue) {
                setShowResultSummary(false);
                setShowAnswerRight(false);
                setQuestionIndexCurrent(parseInt(getCookie('entry_step_test_' + test.id) + '') ? parseInt(getCookie('entry_step_test_' + test.id) + '') : 0)
                setMyAnswer((getCookie('entry_test_' + test.id, true) as null | { [key: string]: ANY }) ?? {});
            } else {
                setShowResultSummary(true);
                setShowAnswerRight(true);
                setQuestionIndexCurrent(0);
            }
        }
        setIsLoadingButton(false);
    }

    const seeTestAgain = async (callback?: (test: ICourseTest) => void) => {
        setOpenDrawTest(true);

        if (!testContent) {
            setIsLoadingButton(true);
            setShowResultSummary(true);

            const test = await testService.getEntryTest(keyTest, testRule);
            if (test) {
                settestContent(test);
                // setIsStartTest(true);
                setShowAnswerRight(true);
                setQuestionIndexCurrent(0);
                if (callback) {
                    callback(test);
                }
            }
            setIsLoadingButton(false);
        }
    }

    const createEntryTest = async () => {
        setIsLoadingButtonFirst(true);
        setOpenDrawTest(true);

        const test = await testService.getEntryTest(keyTest, testRule);

        if (test) {
            setStatus({
                is_continue: true,
                is_create: true,
            });
            settestContent(test);
            // setIsStartTest(true);
            setQuestionIndexCurrent(0);
        }
        setIsLoadingButtonFirst(false);
        setShowInstructionalContent(false);
    }

    React.useEffect(() => {
        if (testContent?.id) {
            setCookie('entry_test_' + testContent.id, myAnswer, 7);
        }
    }, [myAnswer]);

    React.useEffect(() => {
        if (!checkStatusProps && user._state === UserState.identify) {
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

    React.useEffect(() => {
        if (user._state === UserState.nobody) {
            settestContent(null);
        }
    }, [user]);

    React.useEffect(() => {
        if (checkStatusProps) {
            setStatus(checkStatusProps);
        }
    }, []);

    const handleOnCloseDrawer = () => setOpenDrawTest(false);

    const handleOnCloseDrawMain = () => {

        if (showInstructionalContent || showAnswerRight) {
            handleOnCloseDrawer();
            return;
        }

        acceptCloseWhenTesting.onConfirm(() => {
            handleOnCloseDrawer();
        });
    }
    return (<Box
        className="test-now"
        sx={{
            width: '100%',
            p: 3,
            maxWidth: 990,
            margin: '0 auto',
        }}
    >
        {acceptCloseWhenTesting.component}
        {content(status)}
        {
            user._state === UserState.identify ?
                <>
                    {
                        status?.is_create && !status.is_continue && status.total_point ?
                            <Typography sx={{ mt: 1, fontSize: 18 }} variant='h4'>Bạn đã đạt: {(status.point ?? 0) + '/' + status.total_point} ({precentFormat((status.point ?? 0) * 100 / (status.total_point ? status.total_point : 1))})</Typography>
                            : null
                    }
                    <LoadingButton
                        loading={isLoadingButton}
                        variant='contained'
                        size='large'
                        sx={{
                            mt: 2,
                            pl: 4,
                            pr: 4,
                        }}
                        onClick={() => {
                            if (status?.is_create) {
                                if (status.is_continue) {
                                    showContinuteTest();
                                } else {
                                    seeTestAgain();
                                }
                            } else {

                                setShowInstructionalContent(true);
                                setOpenDrawTest(true);
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
                </>
                :
                <Button
                    size='large'
                    variant='contained'
                    sx={{
                        mt: 2,
                    }}
                    onClick={() => setOpenLoginForm(true)}
                >Đăng nhập để làm bài</Button>
        }

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

        <DrawerCustom
            iconClose={
                <IconButton onClick={handleOnCloseDrawMain}>
                    <CloseIcon />
                </IconButton>
            }
            title={
                showResultSummary ? 'Kết quả bài kiểm tra' :
                    testContent ?
                        testContent.tests.length ?
                            testContent.tests[questionIndexCurrent] ?
                                <>
                                    <Typography variant='h2'>Câu hỏi {questionIndexCurrent + 1}/{testContent.tests.length}
                                        &nbsp;<Typography component='span' sx={{ color: (showAnswerRight && !testContent.time_submit) || !testContent.my_answer?.[testContent.tests[questionIndexCurrent].id] || testContent.my_answer?.['_' + testContent.tests[questionIndexCurrent].id] ? 'error.main' : 'success.main' }}> {testContent.tests[questionIndexCurrent].difficult} điểm </Typography>
                                    </Typography>
                                    {
                                        showAnswerRight && testContent.total_point ?
                                            <Typography variant='h4'>Điểm số {(testContent.point ?? 0) + '/' + testContent.total_point} ({precentFormat((testContent.point ?? 0) * 100 / (testContent.total_point ? testContent.total_point : 1))})</Typography>
                                            : null
                                    }
                                </>
                                : title
                            : title
                        : title
            }
            open={openDrawTest}
            width={typeWillFullWidth[testContent?.tests[questionIndexCurrent].optionsObj?.type as keyof typeof typeWillFullWidth] ? 1920 : 910}
            onClose={handleOnCloseDrawMain}
            onCloseOutsite
            sx={{
                zIndex: 2147483647,
                '& .drawer-title': {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                },
                '& .MuiPaper-root': {
                    backgroundColor: 'body.background',
                }
            }}
            restDialogContent={{
                sx: {
                    display: 'flex',
                    alignItems: 'center',
                }
            }}

            headerAction={<Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                {
                    !showAnswerRight && testContent ?
                        <Timer timeRemaining={testContent.time_remaining} onTimeOut={onSubmitTest} />
                        : <></>
                }
            </Box>
            }
            action={
                !showResultSummary && !showInstructionalContent && testContent && testContent.tests.length ?
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
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
                                        setCookie('entry_step_test_' + testContent.id, prev - 1 + '', 7);
                                        return prev - 1;
                                    }
                                    return prev;
                                });
                            }}
                        >
                            Quay lại
                        </Button>

                        {
                            showAnswerRight ?
                                <Button
                                    variant='contained'
                                    endIcon={<Icon icon="ArrowForwardRounded" />}
                                    disabled={questionIndexCurrent >= (testContent.tests.length - 1)}
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
                                questionIndexCurrent >= (testContent.tests.length - 1) ?
                                    !showAnswerRight && testContent ?
                                        <Popconfirm
                                            title='Bạn có chắc muốn gửi bài kiểm tra?'
                                            message='Bạn đã kiểm tra tất cả câu hỏi và chắc chắn muốn gửi bài kiểm tra.'
                                            onConfirm={onSubmitTest}
                                        >
                                            <Button
                                                variant='contained'
                                                color="success"
                                                disabled={Object.keys(myAnswer).filter(key => (typeof myAnswer[key] === 'string' && myAnswer[key]) || myAnswer[key]?.[0] !== undefined).length !== testContent.tests.length}
                                            >
                                                Hoàn thành
                                            </Button>
                                        </Popconfirm>
                                        : null
                                    :
                                    <Button
                                        disabled={questionIndexCurrent >= (testContent.tests.length - 1)
                                            || !((typeof myAnswer[testContent.tests[questionIndexCurrent].id] === 'string'
                                                && myAnswer[testContent.tests[questionIndexCurrent].id])
                                                || myAnswer[testContent.tests[questionIndexCurrent].id]?.[0] !== undefined)}
                                        variant='contained'
                                        endIcon={<Icon icon="ArrowForwardRounded" />}
                                        onClick={() => {
                                            setQuestionIndexCurrent(prev => {
                                                if (prev < (testContent.tests.length - 1)) {
                                                    setCookie('entry_step_test_' + testContent.id, prev + 1 + '', 7);
                                                    return prev + 1;
                                                }
                                                return prev;
                                            });
                                        }}
                                    >
                                        Câu hỏi tiếp theo
                                    </Button>
                        }
                    </Box>
                    :
                    <></>
            }
        >
            <Box
                sx={{
                    height: 'calc(100vh - 143px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: showResultSummary ? 'center' : 'unset'
                }}
            >
                {
                    showInstructionalContent ?
                        <>
                            <Typography variant='h4'>Đợi một tí đã</Typography>
                            <Box sx={{ mt: 2 }} dangerouslySetInnerHTML={{ __html: status?.test_data?.addin_data?.content ?? '' }} />
                            <Box
                                component='span'
                                sx={{
                                    mt: 2,
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
                            <Box
                                sx={{
                                    mt: 3
                                }}
                            >
                                <LoadingButton loading={isLoadingButtonFirst} variant='contained' onClick={() => {
                                    createEntryTest();
                                }}>Làm bài ngay</LoadingButton>
                            </Box>
                        </>
                        :
                        showResultSummary && testContent ?
                            <>

                                {
                                    testContent?.total_point ?
                                        <Typography variant='h4'>Tổng điểm số {(testContent.point ?? 0) + '/' + testContent.total_point} ({precentFormat((testContent.point ?? 0) * 100 / (testContent.total_point ? testContent.total_point : 1))})</Typography>
                                        : null
                                }
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        pt: 3,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {
                                        testContent?.tests ?
                                            testContent.tests.map((test, index) => (
                                                <Box key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        width: 70,
                                                        height: 70,
                                                        borderRadius: 1,
                                                        border: '1px solid',
                                                        borderColor: 'dividerDark',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        backgroundColor: testContent.my_answer?.[test.id] && !testContent.my_answer?.['_' + test.id] ? 'success.main' : 'error.main',
                                                        color: 'white',
                                                        fontSize: 24,
                                                        '&:hover': {
                                                            opacity: 0.6,
                                                        }
                                                    }}
                                                    onClick={() => {
                                                        setShowResultSummary(false);
                                                        setQuestionIndexCurrent(index);
                                                    }}
                                                >
                                                    {index + 1}
                                                    <Typography sx={{ color: 'white' }} variant='body2' noWrap>{test.difficult} Điểm</Typography>
                                                </Box>
                                            ))
                                            :
                                            null
                                    }

                                </Box>
                                {
                                    renderAfterSummary ? renderAfterSummary(handleResetTest) : null
                                }
                            </>
                            :
                            user._state === UserState.identify && testContent ?
                                <Box
                                    sx={{
                                        minHeight: '100%',
                                        pt: 3,
                                        pb: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 3,
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        width: '100%',
                                    }}
                                >
                                    {
                                        showAnswerRight && testContent.total_point ?
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                }}
                                            >
                                                <Button variant='outlined' onClick={() => setShowResultSummary(true)} startIcon={<ArrowBackRoundedIcon />}>Danh sách câu hỏi</Button>
                                            </Box>
                                            : null
                                    }
                                    {
                                        testContent ?
                                            testContent.tests.length ?
                                                testContent.tests[questionIndexCurrent] ?
                                                    <Box
                                                        style={{ width: '100%' }}
                                                    >
                                                        {(() => {
                                                            if (testContent.tests[questionIndexCurrent].optionsObj?.type) {
                                                                return <TestType
                                                                    type={(testContent.tests[questionIndexCurrent].optionsObj as QuestionTestProps).type as string}
                                                                    id={testContent.tests[questionIndexCurrent].id as ID}
                                                                    question={testContent.tests[questionIndexCurrent].question}
                                                                    options={testContent.tests[questionIndexCurrent].optionsObj}
                                                                    showAnswerRight={showAnswerRight}
                                                                    selected={showAnswerRight ? testContent.my_answer?.[testContent.tests[questionIndexCurrent].id] : myAnswer[testContent.tests[questionIndexCurrent].id]}
                                                                    onChange={(value: ANY) => {
                                                                        setMyAnswer(prev => ({
                                                                            ...prev,
                                                                            [testContent.tests[questionIndexCurrent].id]: value
                                                                        }))
                                                                    }}
                                                                />
                                                            }
                                                            return;
                                                        })()}
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
                                </Box>
                                :
                                null
                }
            </Box>
        </DrawerCustom >
    </Box >)
}

export default TestKnowledge


const typeWillFullWidth: { [key: string]: 1 } = {
    interface_comparison: 1
};