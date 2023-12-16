import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CloseIcon from '@mui/icons-material/Close';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { Alert, Box, Button, IconButton, Skeleton, Typography } from '@mui/material';
import { ImageProps } from 'components/atoms/Avatar';
import CodeBlock from 'components/atoms/CodeBlock';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import MoreButton from 'components/atoms/MoreButton';
import SidebarThumbnail from 'components/atoms/SidebarThumbnail';
import TooltipWhite from 'components/atoms/TooltipWhite';
import DrawerCustom from 'components/molecules/DrawerCustom';
import NoticeContent from 'components/molecules/NoticeContent';
import Popconfirm from 'components/molecules/Popconfirm';
import { LoginForm } from 'components/organisms/components/Auth/Login';
import { deleteCookie, getCookie, setCookie } from 'helpers/cookie';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import useConfirmDialog from 'hook/useConfirmDialog';
import { precentFormat } from 'plugins/Vn4Ecommerce/helpers/Money';
import React from 'react';
import { ICourseTest, ITestType, QuestionTestProps } from 'services/elearningService';
import { UserState, useUser } from 'store/user/user.reducers';
import TestType from './TestType';
import testService from './testService';
import Timer from './Timer';


function TestCategory({ category, title, image }: {
    category: ID,
    title: string,
    image: ImageProps
}) {

    // const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    // const [showLoadingButton, setShowLoadingButton] = React.useState <

    const user = useUser();

    const [openLoginForm, setOpenLoginForm] = React.useState(false);

    const [showResultSummary, setShowResultSummary] = React.useState(false);

    const [timerRefresh, setTimerRefresh] = React.useState<{
        question_time_report: Array<{
            count: number,
            created_time: number,
        }>,
        time_server: number,
        times_refresh: number,
    }>({
        question_time_report: [],
        time_server: 0,
        times_refresh: 0,
    });

    const [openDrawTest, setOpenDrawTest] = React.useState(false);

    const [tests, setTests] = React.useState<Array<ITestType> | null>(null);
    const [questionIsRight, setQuestionIsRight] = React.useState(0);
    const [answersWrongOrRight, setAnswersWrongOrRight] = React.useState<{
        [key: ID]: boolean
    }>({});
    const [questionIndex, setQuestionIndex] = React.useState(-1);

    const [countQuestionOneHour, setCountQuestionOneHour] = React.useState(0);

    // const [testHistory, setTestHistory] = React.useState<Array<ICourseTest> | null>(null);

    const [testContent, settestContent] = React.useState<ICourseTest | null>(null);

    const [myAnswer, setMyAnswer] = React.useState<{
        [key: string]: ANY
    }>({});

    const [myAnswerOfSummary, setMyAnswerOfSummary] = React.useState<{
        [key: string]: ANY
    }>({});

    const [questionIndexCurrent, setQuestionIndexCurrent] = React.useState(0);

    const [showAnswerRight, setShowAnswerRight] = React.useState(false);

    const acceptCloseWhenTesting = useConfirmDialog({
        title: 'Bạn có chắc muốn thoát bài kiểm tra?',
        message: 'Bạn đang làm bài kiểm tra và chưa nộp bài, bạn có chắc muốn đóng của số làm bài không?'
    });

    const onSubmitTest = () => {
        setMyAnswer(myAnswer => {
            (async () => {
                if (testContent) {
                    const submitTest = await testService.submitAnswer('test/free/' + category, testContent.id, myAnswer);
                    if (submitTest) {
                        seeTestAgain();
                    }
                    setMyAnswerOfSummary(prev => ({
                        ...prev,
                        ...myAnswer,
                    }));
                }
            })();
            return myAnswer;
        });
    }

    const showContinuteTest = (isReset = 0, isRefresh = false) => async () => {
        setOpenDrawTest(true);

        if (!testContent || isReset || isRefresh) {
            const data = testService.getCategoryTest('test/free/' + category, category, isReset);

            Promise.all([data]).then(([data]) => {

                if (data) {

                    setTests(data.summary.tests);
                    setAnswersWrongOrRight(data.summary.answers);
                    setCountQuestionOneHour(data.summary.count_question_one_hour);
                    setQuestionIsRight(Object.keys(data.summary.answers).filter(key => data.summary.answers[key]).length);
                    setTimerRefresh(prev => ({
                        time_server: data.summary.time_server,
                        question_time_report: data.summary.question_time_report,
                        times_refresh: ++prev.times_refresh
                    }));

                    if (isReset) {
                        deleteCookie('entry_step_test_' + data.test.id);
                        deleteCookie('entry_test_' + data.test.id);
                    }

                    settestContent(data.test);
                    // setIsStartTest(true);
                    if (data.test.is_continue) {
                        setShowResultSummary(false);
                        setShowAnswerRight(false);
                        setQuestionIndexCurrent(parseInt(getCookie('entry_step_test_' + data.test.id) + '') ? parseInt(getCookie('entry_step_test_' + data.test.id) + '') : 0)
                        setMyAnswer((getCookie('entry_test_' + data.test.id, true) as null | { [key: string]: ANY }) ?? {});
                    } else {
                        setShowResultSummary(true);
                        setShowAnswerRight(true);
                        setQuestionIndexCurrent(0);
                    }
                }
            });

        }
    }

    const seeTestAgain = async () => {
        setOpenDrawTest(true);
        setShowResultSummary(true);
        const data = await testService.getCategoryTest('test/free/' + category, category, 0);

        if (data) {

            setTests(data.summary.tests);
            setAnswersWrongOrRight(data.summary.answers);
            setCountQuestionOneHour(data.summary.count_question_one_hour);
            setQuestionIsRight(Object.keys(data.summary.answers).filter(key => data.summary.answers[key]).length);
            setTimerRefresh(prev => ({
                time_server: data.summary.time_server,
                question_time_report: data.summary.question_time_report,
                times_refresh: ++prev.times_refresh
            }));

            settestContent(data.test);
            // setIsStartTest(true);
            setShowAnswerRight(true);
            setQuestionIndexCurrent(0);
        }
    }

    React.useEffect(() => {
        if (testContent?.id) {
            setCookie('entry_test_' + testContent.id, myAnswer, 7);
        }
    }, [myAnswer]);

    React.useEffect(() => {
        if (user._state === UserState.nobody) {
            settestContent(null);
        }
    }, [user]);

    const handleOnCloseDrawer = () => setOpenDrawTest(false);

    const handleOnCloseDrawMain = () => {
        if (!testContent || showAnswerRight) {
            handleOnCloseDrawer();
            return;
        }

        acceptCloseWhenTesting.onConfirm(() => {
            handleOnCloseDrawer();
        });
    }

    const getAnswer = async (testId: ID) => {
        if (!myAnswerOfSummary[testId]) {
            const answer = await testService.getAnswer(testId);
            setMyAnswerOfSummary(prev => ({
                ...prev,
                [testId]: answer ? answer : ['__']
            }));
        }
    }

    const precentComplete = questionIsRight * 100 / (tests?.length ?? 1);

    return (<Box
        className="test-now"
        sx={{
            width: '100%',
            maxWidth: 990,
            margin: '0 auto',
            '& button': {
                m: 0,
                pl: 2,
                pr: 2,
                pt: 0.5,
                pb: 0.5,
                fontSize: 12,
            }
        }}
    >
        {acceptCloseWhenTesting.component}
        <Button
            variant='contained'
            size='large'
            sx={{
                mt: 2,
                pl: 4,
                pr: 4,
            }}
            onClick={() => {
                if (user._state === UserState.identify) {
                    showContinuteTest(0)
                } else {
                    setOpenLoginForm(true);
                }
            }}
        >
            Kiểm tra
        </Button>
        <DrawerCustom
            title={'Đăng nhập'}
            open={openLoginForm && user._state !== UserState.identify}
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
                !showResultSummary && testContent?.tests[questionIndexCurrent] ?
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
                    :
                    'Kiểm tra kiến thức ' + title
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
            action={
                !showResultSummary && testContent && testContent.tests.length ?
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
                                    disabled={questionIndexCurrent >= (testContent.tests.length - 1)}
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
                    position: 'relative',
                }}
            >

                {
                    questionIndex > -1 && tests && questionIndex < tests.length && tests[questionIndex] ?
                        <Box
                            sx={{
                                minHeight: '100%',
                                pb: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                                position: 'absolute',
                                top: 0,
                                backgroundColor: 'body.background',
                                zIndex: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <Button variant='outlined' onClick={() => setQuestionIndex(-1)} startIcon={<ArrowBackRoundedIcon />}>Trang dashboard</Button>
                            </Box>
                            <Box
                                style={{ width: '100%' }}
                            >
                                {(() => {
                                    if (tests[questionIndex].optionsObj?.type) {
                                        return <TestType
                                            type={(tests[questionIndex].optionsObj as QuestionTestProps).type as string}
                                            id={tests[questionIndex].id as ID}
                                            question={tests[questionIndex].question}
                                            options={tests[questionIndex].optionsObj}
                                            showAnswerRight={true}
                                            selected={myAnswerOfSummary[tests[questionIndex].id] ?? []}
                                            onChange={(value: ANY) => {
                                                // setMyAnswer(prev => ({
                                                //     ...prev,
                                                //     [tests[questionIndex].id]: value
                                                // }))
                                            }}
                                        />
                                    }
                                    return;
                                })()}
                            </Box>
                        </Box>
                        : null
                }
                <Box
                    sx={{
                        display: showResultSummary && !(questionIndex > -1 && tests && questionIndex < tests.length && tests[questionIndex]) ? 'unset' : 'none',
                    }}
                >
                    {
                        countQuestionOneHour > 10 ?
                            <Alert
                                variant='filled'
                                severity='error'
                                color="error"
                                sx={{
                                    mb: 4,
                                    fontSize: 16,
                                    borderRadius: 1,
                                    backgroundColor: '#B71C22 !important',
                                    '& .timer': {
                                        fontSize: 16,
                                        color: 'inherit',
                                    }
                                }}
                                action={
                                    timerRefresh.question_time_report[0] ?
                                        timerRefresh.times_refresh % 2 === 0 ?
                                            <Timer timeEndLabel="" timeRemaining={(timerRefresh.question_time_report[0].created_time + 900) - timerRefresh.time_server} onTimeOut={() => {
                                                showContinuteTest(0, true)();
                                            }} />
                                            :
                                            <div>
                                                <Timer timeEndLabel="" timeRemaining={(timerRefresh.question_time_report[0].created_time + 900) - timerRefresh.time_server} onTimeOut={() => {
                                                    showContinuteTest(0, true)();
                                                }} />
                                            </div>
                                        : undefined
                                }
                            >
                                Bạn đã làm sai {countQuestionOneHour} câu trong 15 phút qua (&gt;10 câu), hãy chờ để có thể làm lại bài kiểm tra nhé!
                            </Alert>
                            : <Alert
                                variant='filled'
                                severity='info'
                                color="info"
                                sx={{
                                    mb: 4,
                                    fontSize: 16,
                                    borderRadius: 1,
                                    backgroundColor: '#0288d1 !important',
                                    color: 'white',
                                }}
                            >
                                {
                                    countQuestionOneHour > 0 ?
                                        'Trong 15 phút qua bạn đã làm sai ' + countQuestionOneHour + ' câu, hãy chú ý giới hạn 10 câu sai trong 15 phút nhé!'
                                        :
                                        'Hãy nhớ là bạn sẽ không thể tiếp tục trả lời nếu làm sai quá 10 câu hỏi trong 15 phút nhé!'
                                }
                            </Alert>
                    }

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {
                            testContent?.total_point ?
                                <>
                                    <Typography variant='h4'>Lần kiểm tra gần nhất {(testContent.point ?? 0) + '/' + testContent.total_point} ({precentFormat((testContent.point ?? 0) * 100 / (testContent.total_point ? testContent.total_point : 1))})</Typography> <Button disabled={countQuestionOneHour > 10} size='small' sx={{ pl: 2, pr: 2 }} variant='contained' onClick={showContinuteTest(12)}>Làm lại</Button>
                                </>
                                : null
                        }
                    </Box>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(10, 1fr)',
                            gap: 1,
                            pt: 2,
                            flexWrap: 'wrap',

                        }}
                    >
                        {
                            testContent?.tests ?
                                testContent.tests.map((test, index) => (
                                    <Box key={index}
                                        sx={{
                                            display: 'flex',
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

                    <Box sx={{ mb: 4, }}>
                        <Typography variant='h4' sx={{ mt: 3, mb: 2 }}>Kiểm tra lại</Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                height: 70,
                                gap: 1,
                                mt: 1,
                            }}
                        >
                            <Button disabled={countQuestionOneHour > 10} variant='contained' sx={{ flexDirection: 'column', borderRadius: 1, height: '100%', fontSize: 16, }} onClick={showContinuteTest(99)} size="small" >
                                Ngẫu nhiên
                                <Typography component='span' sx={{ color: 'white', fontSize: 14, opacity: 0.7, textTransform: 'initial' }} variant='body2'>Chọn ngẫu nhiên 20 câu</Typography>
                            </Button>
                            <MoreButton
                                actions={countQuestionOneHour > 10 ? [] : [
                                    {
                                        point1: {
                                            title: 'Câu 1 điểm',
                                            action: () => {
                                                showContinuteTest(1)();
                                            }
                                        },
                                        point2: {
                                            title: 'Câu 2 điểm',
                                            action: () => {
                                                showContinuteTest(2)();
                                            }
                                        },
                                        point3: {
                                            title: 'Câu 3 điểm',
                                            action: () => {
                                                showContinuteTest(3)();
                                            }
                                        },
                                    }
                                ]}
                            >
                                <Button disabled={countQuestionOneHour > 10} variant='contained' color="success" sx={{ flexDirection: 'column', borderRadius: 1, width: '100%', height: '100%', fontSize: 16, }} size="small">
                                    Theo điểm số
                                    <Typography component='span' sx={{ color: 'white', fontSize: 14, opacity: 0.7, textTransform: 'initial' }} variant='body2'>Ngẫu nhiên 20 câu theo điểm</Typography>
                                </Button>
                            </MoreButton>
                            <Button disabled={countQuestionOneHour > 10 || testContent?.has_wrong_answer === 0} variant='contained' onClick={showContinuteTest(11)} color="error" sx={{ flexDirection: 'column', borderRadius: 1, height: '100%', fontSize: 16, }} size="small">Câu sai {testContent?.has_wrong_answer ? '(' + testContent.has_wrong_answer + ')' : ''}
                                <Typography component='span' sx={{ color: 'white', fontSize: 14, opacity: 0.7, textTransform: 'initial' }} variant='body2'>Ngẫu nhiên 20 câu đã làm sai</Typography>
                            </Button>
                        </Box>
                    </Box>

                </Box>
                {
                    !showResultSummary ?
                        user._state === UserState.identify && testContent ?
                            <Box
                                sx={{
                                    minHeight: '100%',
                                    pt: 2,
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
                                            <Button variant='outlined' onClick={() => setShowResultSummary(true)} startIcon={<ArrowBackRoundedIcon />}>Trang dashboard</Button>
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
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(item => (
                                    <Skeleton variant='rectangular' sx={{ height: 30 }} key={item} />
                                ))}
                            </Box>
                        : null
                }

                <Box
                    sx={{
                        width: '100%',
                        mt: 4,
                        display: !showResultSummary || (questionIndex > -1 && tests && questionIndex < tests.length && tests[questionIndex]) ? 'none' : 'unset'
                    }}
                >
                    {
                        tests ?
                            <>
                                <Typography sx={{ fontSize: 18 }}>Bạn đã hoàn thành <Typography component='span' sx={{ fontSize: '1.2rem', fontWeight: 600, color: 'success.main' }}>{tests?.length ? precentFormat(precentComplete) : '------'}</Typography> câu hỏi về {title}. {
                                    precentComplete === 0 ? 'Bắt đầu thôi nào!' :
                                        precentComplete === 100 ? 'Thật tuyệt vời!' :
                                            precentComplete > 90 ? 'Một chút nữa thôi!' :
                                                precentComplete > 50 ? 'Bạn đang làm rất tốt!' :
                                                    'Tiếp tục cố lên!'
                                } 🚀</Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 1,
                                        gap: 1,
                                    }}
                                >
                                    <SidebarThumbnail
                                        value={questionIsRight}
                                        max={tests?.length ?? 0}
                                    />
                                    <ImageLazyLoading
                                        src={getImageUrl(image)}
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            objectFit: 'contain',
                                            flexShrink: 0,
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        pb: 3
                                    }}
                                >
                                    {
                                        tests.map((item, index) => (
                                            <TooltipWhite
                                                title={answersWrongOrRight[item.id] === undefined ? undefined : <CodeBlock html={item.question} />}
                                                key={item.id}
                                            >
                                                <IconButton
                                                    onMouseEnter={() => {
                                                        if (answersWrongOrRight[item.id] !== undefined) {
                                                            getAnswer(item.id);
                                                        }
                                                    }}
                                                    onClick={() => {
                                                        if (answersWrongOrRight[item.id] !== undefined) {
                                                            setQuestionIndex(index);
                                                            getAnswer(item.id);
                                                        }
                                                    }} sx={{ opacity: answersWrongOrRight[item.id] === undefined ? 0.2 : 1 }} size="small">
                                                    {
                                                        answersWrongOrRight[item.id] === undefined ?
                                                            <BlockRoundedIcon />
                                                            :
                                                            answersWrongOrRight[item.id] === true ?
                                                                <CheckCircleOutlineRoundedIcon color='success' />
                                                                :
                                                                <HighlightOffRoundedIcon color="error" />
                                                    }
                                                </IconButton>
                                            </TooltipWhite>
                                        ))
                                    }
                                </Box>
                            </>
                            :
                            null
                    }
                </Box>
            </Box>
        </DrawerCustom >
    </Box >)
}

export default TestCategory


const typeWillFullWidth: { [key: string]: 1 } = {
    interface_comparison: 1,
    live_code: 1,
};

// enum LoadingButtonType {
//     'None', 'Random', 'RandomPoint', 'QuestionWrong', 'TestAgain'
// }