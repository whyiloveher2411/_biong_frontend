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
import Icon from 'components/atoms/Icon';
import Popconfirm from 'components/molecules/Popconfirm';

function TestKnowledge({ keyTest, content, testRule, checkStatus: checkStatusProps, onSetPoint }: {
    keyTest: string,
    content: (status: ITestStatus | null) => React.ReactNode,
    testRule: string,
    checkStatus?: ITestStatus | null,
    onSetPoint?: (point: {
        point: number,
        total_point: number,
        is_continue: boolean,
        is_create: boolean,
    }) => void
}) {

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const user = useUser();

    const [openLoginForm, setOpenLoginForm] = React.useState(false);

    const [status, setStatus] = React.useState<ITestStatus | null>(null);

    const [openDrawTest, setOpenDrawTest] = React.useState(false);

    const [testContent, settestContent] = React.useState<ICourseTest | null>(null);

    const [myAnswer, setMyAnswer] = React.useState<{
        [key: string]: ANY
    }>({});

    const [questionIndexCurrent, setQuestionIndexCurrent] = React.useState(0);

    const [isStartTest, setIsStartTest] = React.useState(false);

    const [showAnswerRight, setShowAnswerRight] = React.useState(false);

    const confirmCreateTest = useConfirmDialog({
        title: 'Đợi một tí đã',
        message: <>
            <Box dangerouslySetInnerHTML={{ __html: status?.test_data?.addin_data?.content ?? '' }} />
            <Box
                component='span'
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
            setIsStartTest(true);
            setQuestionIndexCurrent(parseInt(getCookie('entry_step_test_' + test.id) + '') ? parseInt(getCookie('entry_step_test_' + test.id) + '') : 0)
            setMyAnswer((getCookie('entry_test_' + test.id, true) as null | { [key: string]: ANY }) ?? {});
        }
        setIsLoadingButton(false);
    }


    const seeTestAgain = async (callback?: (test: ICourseTest) => void) => {
        setIsLoadingButton(true);
        setOpenDrawTest(true);
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
        setOpenDrawTest(true);
        const test = await testService.getEntryTest(keyTest, testRule);
        if (test) {
            setStatus({
                is_continue: true,
                is_create: true,
            });
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
        if (checkStatusProps) {
            setStatus(checkStatusProps);
        }
    }, []);

    return (<Box
        className="test-now"
        sx={{
            width: '100%',
            p: 3,
            maxWidth: 990,
            margin: '0 auto',
        }}
    >
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
                            mt: 1,
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

        <DrawerCustom
            title={
                testContent ?
                    testContent.tests.length ?
                        testContent.tests[questionIndexCurrent] ?
                            <>
                                <Typography variant='h2'>Câu hỏi {questionIndexCurrent + 1}/{testContent.tests.length}
                                    &nbsp;<Typography component='span' sx={{ color: (showAnswerRight && !testContent.time_submit) || testContent.my_answer?.['_' + testContent.tests[questionIndexCurrent].id] ? 'error.main' : 'success.main' }}> {testContent.tests[questionIndexCurrent].difficult} điểm </Typography>
                                </Typography>
                                {
                                    showAnswerRight && testContent.total_point ?
                                        <Typography variant='h4'>Điểm số {(testContent.point ?? 0) + '/' + testContent.total_point} ({precentFormat((testContent.point ?? 0) * 100 / (testContent.total_point ? testContent.total_point : 1))})</Typography>
                                        : null
                                }
                            </>
                            : 'Bài kiểm tra'
                        : 'Bài kiểm tra'
                    : 'Bài kiểm tra'
            }
            open={openDrawTest}
            onCloseOutsite
            width={typeWillFullWidth[testContent?.tests[questionIndexCurrent].optionsObj?.type as keyof typeof typeWillFullWidth] ? 1920 : 910}
            onClose={() => {
                setOpenDrawTest(false);
            }}
            sx={{
                zIndex: 2147483647,
                '& .drawer-title': {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                testContent && testContent.tests.length ?
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
                                    endIcon={<Icon icon="ArrowForwardRounded" />}
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
                    </Box>
                    :
                    <></>
            }
        >
            <Box
                sx={{
                    height: 'calc(100vh - 143px)',
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
                                testContent ?
                                    testContent.tests.length ?
                                        testContent.tests[questionIndexCurrent] ?
                                            <Box
                                                style={{ width: '100%' }}
                                            >
                                                {(() => {
                                                    if (testContent.tests[questionIndexCurrent].optionsObj?.type) {
                                                        //@ts-ignore
                                                        let compoment = toCamelCase(testContent.tests[questionIndexCurrent].optionsObj.type);
                                                        try {
                                                            //eslint-disable-next-line
                                                            let resolved = require(`./TestComponent/${compoment}`).default;
                                                            return React.createElement(resolved, {
                                                                id: testContent.tests[questionIndexCurrent].id,
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
        </DrawerCustom>
    </Box >)
}

export default TestKnowledge


const typeWillFullWidth: { [key: string]: 1 } = {
    interface_comparison: 1
};