import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, Typography, Skeleton } from '@mui/material';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import SidebarThumbnail from 'components/atoms/SidebarThumbnail';
import DrawerCustom from 'components/molecules/DrawerCustom';
import { LoginForm } from 'components/organisms/components/Auth/Login';
import useConfirmDialog from 'hook/useConfirmDialog';
import React from 'react';
import { ITestType, QuestionTestProps } from 'services/elearningService';
import { UserState, useUser } from 'store/user/user.reducers';
import testService, { IHomePageTestItem } from './testService';
import { getImageUrl } from 'helpers/image';
import TooltipWhite from 'components/atoms/TooltipWhite';
import CodeBlock from 'components/atoms/CodeBlock';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { precentFormat } from 'plugins/Vn4Ecommerce/helpers/Money';
import TestType from './TestType';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';

function TestCategory({ category }: {
    category: IHomePageTestItem
}) {

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const user = useUser();

    const [openLoginForm, setOpenLoginForm] = React.useState(false);

    const [questionIsRight, setQuestionIsRight] = React.useState(0);

    const [questionIndex, setQuestionIndex] = React.useState(-1);

    const [myAnswer, setMyAnswer] = React.useState<{
        [key: string]: ANY
    }>({});

    const [showResultQuestion, setShowResultQuestion] = React.useState<{ [key: ID]: boolean }>({});

    const [openDrawTest, setOpenDrawTest] = React.useState(false);

    const [tests, setTests] = React.useState<Array<ITestType> | null>(null);
    const [answers, setAnswers] = React.useState<{
        [key: ID]: boolean
    }>({});

    const acceptCloseWhenTesting = useConfirmDialog({
        title: 'Bạn có chắc muốn thoát bài kiểm tra?',
        message: 'Bạn đang làm bài kiểm tra và chưa nộp bài, bạn có chắc muốn đóng của số làm bài không?'
    });


    const showContinuteTest = (isReset = 0) => async () => {
        setIsLoadingButton(true);
        setOpenDrawTest(true);

        if (!tests) {
            const data = await testService.getAllTestOfCategory(category.category);
            if (data) {
                setTests(data.tests);
                setAnswers(data.answers);
                setQuestionIsRight(Object.keys(data.answers).filter(key => data.answers[key]).length);
            }
        }
        setIsLoadingButton(false);
    }

    const onSubmitTest = () => {
        setMyAnswer(myAnswer => {
            (async () => {

                if (tests) {
                    const submitTest = await testService.submitAnswerQuestion(tests[questionIndex].id, myAnswer[tests[questionIndex].id]);
                    if (submitTest !== null) {
                        answers[tests[questionIndex].id] = submitTest ? true : false;
                        setAnswers({ ...answers });
                        setQuestionIsRight(Object.keys(answers).filter(key => answers[key]).length);
                        setShowResultQuestion(prev => ({
                            ...prev,
                            [tests[questionIndex].id]: true,
                        }));
                    }
                }
            })();
            return myAnswer;
        });
    }


    React.useEffect(() => {
        if (user._state === UserState.nobody) {
            setTests(null);
        }
    }, [user]);

    const handleOnCloseDrawer = () => setOpenDrawTest(false);

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
            title={category.title}
            open={openDrawTest}
            width={910}
            onClose={handleOnCloseDrawer}
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
            action={<Box>
                {
                    questionIndex > -1 && tests && questionIndex < tests.length && tests[questionIndex] ?
                        showResultQuestion[tests[questionIndex].id] ?
                            <Button
                                disabled={
                                    questionIndex === (tests.length - 1)
                                }
                                endIcon={<ArrowForwardRounded />}
                                variant='contained' onClick={() => {
                                    setQuestionIndex(prev => {
                                        if (prev < (tests.length - 1)) {
                                            return prev + 1;
                                        }
                                        return prev;
                                    });
                                }}>Câu hỏi tiếp theo</Button>
                            :
                            <Button
                                sx={{
                                    opacity: showResultQuestion[tests[questionIndex].id] ? 0 : 1
                                }}
                                disabled={
                                    showResultQuestion[tests[questionIndex].id] ||
                                    !((typeof myAnswer[tests[questionIndex].id] === 'string'
                                        && myAnswer[tests[questionIndex].id])
                                        || myAnswer[tests[questionIndex].id]?.[0] !== undefined)
                                }
                                variant='contained' color='success' onClick={onSubmitTest}>Trả lời</Button>
                        :
                        null
                }
            </Box>}
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
                                pt: 3,
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
                                <Button variant='outlined' onClick={() => setQuestionIndex(-1)} startIcon={<ArrowBackRoundedIcon />}>Danh sách câu hỏi</Button>
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
                                            showAnswerRight={showResultQuestion[tests[questionIndex].id] ? true : false}
                                            selected={myAnswer[tests[questionIndex].id] ?? []}
                                            onChange={(value: ANY) => {
                                                setMyAnswer(prev => ({
                                                    ...prev,
                                                    [tests[questionIndex].id]: value
                                                }))
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
                        width: '100%',
                        display: questionIndex > -1 && tests && questionIndex < tests.length && tests[questionIndex] ? 'none' : 'unset'
                    }}
                >

                    <Box sx={{ mb: 4, }}>
                        <Typography variant='h4' sx={{ fontWeight: 600 }}>{category.title}</Typography>
                        <Typography sx={{ mt: 1 }}>{category.description}</Typography>


                        <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                            Kiểm tra lại: <Button variant='contained' sx={{ fontSize: 12, }} onClick={showContinuteTest(99)} size="small" >Ngẫu nhiên</Button>


                            {/* <Button variant='contained' color="warning" sx={{ fontSize: 12, }} onClick={showContinuteTest(3)} size="small">Câu hay sai</Button> */}
                        </Box>
                    </Box>
                    <Typography sx={{ fontSize: 18 }}>Bạn đã hoàn thành <Typography component='span' sx={{ fontSize: '1.2rem', fontWeight: 600, color: 'primary.main' }}>{tests?.length ? precentFormat(questionIsRight * 100 / (tests?.length ?? 1)) : '------'}</Typography> câu hỏi về {category.title}. Tiếp tục cố lên! 🚀</Typography>
                    {
                        tests ?


                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1,
                                }}
                            >
                                <SidebarThumbnail
                                    value={questionIsRight}
                                    max={tests?.length ?? 0}
                                />
                                <ImageLazyLoading
                                    src={getImageUrl(category.image)}
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        objectFit: 'contain',
                                        flexShrink: 0,
                                    }}
                                />
                            </Box>
                            :
                            <Skeleton sx={{ width: '100%', height: 6, mt: 3, mb: 3, }} variant='rectangular' />
                    }
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            pb: 3
                        }}
                    >
                        {
                            tests ?
                                tests.map((item, index) => (
                                    <TooltipWhite
                                        title={<CodeBlock html={item.question} />}
                                    >
                                        <IconButton onClick={() => setQuestionIndex(index)} sx={{ opacity: answers[item.id] === undefined ? 0.2 : 1 }} size="small">
                                            {
                                                answers[item.id] === undefined ?
                                                    <BlockRoundedIcon />
                                                    :
                                                    answers[item.id] === true ?
                                                        <CheckCircleOutlineRoundedIcon color='success' />
                                                        :
                                                        <HighlightOffRoundedIcon color="error" />
                                            }
                                        </IconButton>
                                    </TooltipWhite>
                                ))
                                :
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        width: '100%',
                                    }}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
                                        <Skeleton key={item} />
                                    ))}
                                </Box>
                        }
                    </Box>
                </Box>
            </Box>
        </DrawerCustom >
    </Box >)
}

export default TestCategory