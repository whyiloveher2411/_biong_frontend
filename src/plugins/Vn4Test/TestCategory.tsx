import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
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
import { precentFormat } from 'plugins/Vn4Ecommerce/helpers/Money';
import React from 'react';
import { ICourseTest, QuestionTestProps } from 'services/elearningService';
import { UserState, useUser } from 'store/user/user.reducers';
import TestType from './TestType';
import testService, { IHomePageTestItem } from './testService';
import useConfirmDialog from 'hook/useConfirmDialog';
import MoreButton from 'components/atoms/MoreButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function TestCategory({ category }: {
    category: IHomePageTestItem
}) {

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const user = useUser();

    const [openLoginForm, setOpenLoginForm] = React.useState(false);

    const [showResultSummary, setShowResultSummary] = React.useState(false);

    const [openDrawTest, setOpenDrawTest] = React.useState(false);

    const [testContent, settestContent] = React.useState<ICourseTest | null>(null);

    const [myAnswer, setMyAnswer] = React.useState<{
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
                    const submitTest = await testService.submitAnswer('test/free/' + category.category, testContent.id, myAnswer);
                    if (submitTest) {
                        seeTestAgain();
                    }
                }
            })();
            return myAnswer;
        });
    }

    const showContinuteTest = (isReset = 0) => async () => {
        setIsLoadingButton(true);
        setOpenDrawTest(true);

        const test = await testService.getCategoryTest('test/free/' + category.category, category.category, isReset);

        if (test) {

            if (isReset) {
                deleteCookie('entry_step_test_' + test.id);
                deleteCookie('entry_test_' + test.id);
            }

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
        setIsLoadingButton(true);
        setOpenDrawTest(true);
        setShowResultSummary(true);
        const test = await testService.getCategoryTest('test/free/' + category.category, category.category, 0);

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

    React.useEffect(() => {
        if (testContent?.id) {
            setCookie('entry_test_' + testContent.id, myAnswer, 7);
        }
    }, [myAnswer]);

    const handleOnCloseDrawer = () => setOpenDrawTest(false);

    const handleOnCloseDrawMain = () => {
        if (showResultSummary) {
            handleOnCloseDrawer();
            return;
        }

        if (showAnswerRight) {
            setShowResultSummary(true);
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
        {
            user._state === UserState.identify ?
                <LoadingButton
                    loading={isLoadingButton}
                    variant='contained'
                    size='large'
                    sx={{
                        mt: 2,
                        pl: 4,
                        pr: 4,
                    }}
                    onClick={showContinuteTest(0)}
                >
                    Khám phá
                </LoadingButton>
                :
                <Button
                    size='large'
                    variant='contained'
                    sx={{
                        mt: 2,
                    }}
                    onClick={() => setOpenLoginForm(true)}
                >Đăng nhập</Button>
        }

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
                    {
                        showResultSummary || !showAnswerRight ?
                            <CloseIcon />
                            :
                            <ArrowBackIosNewRoundedIcon />
                    }
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
                                : "Kiểm tra " + category.title
                            : "Kiểm tra " + category.title
                        : "Kiểm tra " + category.title
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
                            disabled={!showAnswerRight && questionIndexCurrent === 0}
                            color='inherit'
                            variant='contained'
                            startIcon={<Icon icon="ArrowBackRounded" />}
                            onClick={() => {
                                if (showAnswerRight && questionIndexCurrent === 0) {
                                    setShowResultSummary(true);
                                    return;
                                }

                                setQuestionIndexCurrent(prev => {
                                    if (prev > 0) {
                                        setCookie('entry_step_test_' + testContent.id, prev - 1 + '', 7);
                                        return prev - 1;
                                    }
                                    return prev;
                                });
                            }}
                        >
                            {
                                showAnswerRight && questionIndexCurrent === 0 ?
                                    'Danh sách câu hỏi'
                                    :
                                    'Quay lại'
                            }
                        </Button>

                        {
                            showAnswerRight ?
                                <Button
                                    variant='contained'
                                    endIcon={<Icon icon="ArrowForwardRounded" />}
                                    onClick={() => {
                                        if (questionIndexCurrent >= (testContent.tests.length - 1)) {
                                            setShowResultSummary(true);
                                            return;
                                        }

                                        setQuestionIndexCurrent(prev => {
                                            if (prev < (testContent.tests.length - 1)) {
                                                return prev + 1;
                                            }
                                            return prev;
                                        });
                                    }}
                                >
                                    {
                                        questionIndexCurrent >= (testContent.tests.length - 1) ?
                                            'Danh sách câu hỏi'
                                            :
                                            'Câu hỏi tiếp theo'
                                    }
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
                    showResultSummary ?
                        <>
                            <Box sx={{ mb: 4, }}>
                                <Typography variant='h4' sx={{ fontWeight: 600 }}>{category.title}</Typography>
                                <Typography sx={{ mt: 1 }}>{category.description}</Typography>
                                <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                                    Kiểm tra lại: <Button variant='contained' sx={{ fontSize: 12, }} onClick={showContinuteTest(11)} size="small" >Ngẫu nhiên</Button>

                                    <MoreButton
                                        actions={[
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
                                        <Button endIcon={<ArrowDropDownIcon />} variant='contained' color="success" sx={{ fontSize: 12, }} size="small">Theo điểm số</Button>
                                    </MoreButton>




                                    {/* <Button variant='contained' color="error" sx={{ fontSize: 12, }} onClick={showContinuteTest(2)} size="small">Câu sai</Button>
                                    <Button variant='contained' color="warning" sx={{ fontSize: 12, }} onClick={showContinuteTest(3)} size="small">Câu hay sai</Button> */}
                                </Box>
                            </Box>
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

export default TestCategory


const typeWillFullWidth: { [key: string]: 1 } = {
    interface_comparison: 1
};