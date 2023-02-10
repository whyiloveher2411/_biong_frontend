import { Button, IconButton } from '@mui/material';
import Slider, { SliderThumb } from '@mui/material/Slider';
import Box from 'components/atoms/Box';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Typography from 'components/atoms/Typography';
import { BoxFillHeartInfo } from 'components/molecules/Header/Account';
import { getImageUrl } from 'helpers/image';
import React from 'react';
import { useDispatch } from 'react-redux';
import accountService from 'services/accountService';
import { CourseLessonProps, ProcessLearning } from 'services/courseService';
import { updateBitPoint, updateHeart, useUser } from 'store/user/user.reducers';
import CourseLearningContext, { CourseLearningContextProps } from '../../../context/CourseLearningContext';
import ContentStepByStep from './ContentStepByStep';
import StepByStepContext from './ContentStepByStep/StepByStepContext';
import Dialog from 'components/molecules/Dialog';
import IconBit from 'components/atoms/IconBit';
import { LoadingButton } from '@mui/lab';

function StepByStep({ lesson, process }: {
    lesson: StepByStepContent,
    process: StepByStepProcessLearning | null,
}) {

    const user = useUser();

    const [stepCurrent, setStepCurrent] = React.useState(0);

    const [handleEventClickButton, setHandleEventClickButton] = React.useState<null | 'check' | 'checkagain' | 'hint'>(null);

    const [disableButtonCheck, setDisableButtonCheck] = React.useState(true);

    const [openDialogConfirmHint, setOpenDialogConfirmHint] = React.useState(false);

    const [openScreenLessonComplete, setOpenScreenLessonComplete] = React.useState(false);

    const courseLearningContext = React.useContext<CourseLearningContextProps>(CourseLearningContext);

    const [showButtons, setShowButtons] = React.useState({
        continue: false,
        tryCheckAgain: false,
        checkResult: false,
        hint: false,
        stateCheck: false,
    });

    const dispath = useDispatch();

    React.useEffect(() => {
        setStepCurrent(0);
    }, [process]);

    React.useEffect(() => {
        setOpenScreenLessonComplete(false);
        setHandleEventClickButton(null);
    }, [lesson]);

    React.useEffect(() => {
        setHandleEventClickButton(null);
    }, [user.heart]);

    const handleClickNextButton = () => {
        if (process?.content_step && stepCurrent >= (process.content_step.length - 1)) {
            courseLearningContext.handleClickInputCheckBoxLesson(lesson);
            setOpenScreenLessonComplete(true);
        } else {
            setStepCurrent(prev => ++prev);
        }
        setDisableButtonCheck(true);
        setHandleEventClickButton(null);
    }

    if (user.getHeart() < 1 && !courseLearningContext.dataForCourseCurrent?.lesson_completed[lesson.id]) {
        return <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                width: '100%',
                maxWidth: 400,
                minHeight: 'calc(100vh - 112px)',
                margin: '0 auto',
                pb: 7,
                pt: 12,
            }}
        >
            <BoxFillHeartInfo
                actionAfterUpdateHeart={() => {
                    setHandleEventClickButton(null)
                }}
                afterFillHeart={() => {
                    setHandleEventClickButton(null)
                }}
            />
        </Box>
    }

    return (
        <StepByStepContext.Provider
            value={{
                showButtons: showButtons,
                setShowButtons: setShowButtons,
                handleEventClickButton: handleEventClickButton,
                setHandleEventClickButton: setHandleEventClickButton,
                setDisableButtonCheck: setDisableButtonCheck,
                updateHeartWrongAnswer: async () => {
                    if (!courseLearningContext.dataForCourseCurrent?.lesson_completed[lesson.id]) {
                        const heart = await accountService.updateHeartWrongAnswer();
                        dispath(updateHeart(heart));
                        window.showMessage('Bạn trả lời sai, tim của bạn bị -1. Hãy cố gắng nhé!');
                        return true;
                    }
                    return false;
                },
                handleClickNextButton: handleClickNextButton,
            }}
        >
            {
                openScreenLessonComplete ?
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1,
                            width: '100%',
                            minHeight: 'calc(100vh - 112px)',
                            maxWidth: 400,
                            margin: '0 auto',
                            pb: 6,
                        }}
                    >
                        <ImageLazyLoading
                            src={'/images/gif/lesson-complete.gif'}
                            sx={{
                                width: 400,
                                height: 300,
                            }}
                        />
                        <Typography variant='h4'>Bài học đã hoàn thành!</Typography>
                        <Typography align='center'>Bạn vừa học {lesson.title}. Đừng quên kiểm tra kiến thức của bạn bằng thực hành!</Typography>
                        <Box>

                            <Button
                                variant='contained'
                                size='large'
                                sx={{ margin: '16px auto', pl: 4, pr: 4 }}
                                onClick={() => {
                                    courseLearningContext.nexLesson(true);
                                }}
                            >Bài học tiếp theo
                            </Button>

                        </Box>
                    </Box>
                    :
                    <Box
                        sx={{
                            backgroundColor: 'body.background',
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                width: '100%',
                                p: 3,
                                pl: 7,
                                pr: 7,
                                minHeight: 450,
                                maxWidth: 1072,
                                margin: '0 auto',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >

                                <Typography variant='h2' noWrap>
                                    {lesson.title}
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'center',
                                        maxWidth: '100%',
                                        width: 400,
                                    }}
                                >
                                    <Slider
                                        size="medium"
                                        value={stepCurrent}
                                        max={(process?.content_step?.length ?? 100) - 1}
                                        sx={{
                                            '& .MuiBox-root': {
                                                overflow: 'unset',
                                            }
                                        }}
                                        components={{
                                            Thumb: AvatarUser
                                        }}
                                    />

                                    <Button
                                        startIcon={<Icon sx={{ color: '#ff2f26' }} icon="FavoriteRounded" />}
                                    >
                                        {user.getHeart()}
                                    </Button>
                                </Box>
                            </Box>

                            <Divider color='dark' />

                            <Box
                                sx={{
                                    minHeight: 'calc(100vh - 230px)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                    maxWidth: '100%',
                                    width: 648,
                                    margin: '0 auto',
                                    lineHeight: '32px',
                                    fontSize: 18,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                    }}
                                >
                                    {
                                        stepCurrent % 2 === 0 ?
                                            <Box>
                                                {
                                                    process?.content_step?.[stepCurrent] ?
                                                        <ContentStepByStep
                                                            content={process.content_step[stepCurrent]}
                                                        />
                                                        :
                                                        null
                                                }
                                            </Box>
                                            :
                                            process?.content_step?.[stepCurrent] ?
                                                <ContentStepByStep
                                                    content={process.content_step[stepCurrent]}
                                                />
                                                :
                                                null
                                    }
                                </Box>
                                <Box
                                    sx={{
                                        mt: 'auto',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: 3,
                                        pt: 6
                                    }}
                                >

                                    <Button
                                        variant='contained'
                                        onClick={() => {
                                            setHandleEventClickButton(null);
                                            setStepCurrent(prev => --prev);
                                            setDisableButtonCheck(true);
                                        }}
                                        sx={{
                                            opacity: stepCurrent <= 0 ? 0 : 1,
                                            pointerEvents: stepCurrent <= 0 ? 'none' : 'unset',
                                        }}
                                        color='inherit'
                                        size='large'>
                                        Quay lại
                                    </Button>
                                    {
                                        Boolean(courseLearningContext.dataForCourseCurrent?.lesson_completed[lesson.id]) && process?.content_step?.[stepCurrent] && process.content_step[stepCurrent].type !== 'text' && !showButtons.continue ?
                                            <Button
                                                variant={process?.content_step && stepCurrent >= (process.content_step.length - 1) ?
                                                    'contained'
                                                    : 'outlined'}
                                                onClick={() => {

                                                    if (process?.content_step && stepCurrent >= (process.content_step.length - 1)) {
                                                        courseLearningContext.handleClickInputCheckBoxLesson(lesson);
                                                        setOpenScreenLessonComplete(true);
                                                    } else {
                                                        setStepCurrent(prev => ++prev);
                                                    }
                                                    setDisableButtonCheck(true);
                                                    setHandleEventClickButton(null);
                                                }}
                                                size='large'>
                                                {
                                                    (process?.content_step && stepCurrent >= (process.content_step.length - 1)) ?
                                                        'Hoàn thành'
                                                        : 'Tiếp tục'
                                                }
                                            </Button>
                                            : null
                                    }
                                    {
                                        showButtons.hint &&
                                        <IconButton onClick={() => {
                                            setOpenDialogConfirmHint(true);
                                        }} size='large' color="primary">
                                            <Icon icon="HelpOutlineRounded" />
                                        </IconButton>
                                    }

                                    {
                                        showButtons.checkResult &&
                                        <Button
                                            disabled={disableButtonCheck}
                                            variant='contained'
                                            size='large' onClick={() => {
                                                setHandleEventClickButton('check');
                                            }}>Kiểm tra</Button>
                                    }

                                    {
                                        showButtons.tryCheckAgain &&
                                        <Button
                                            variant='outlined'
                                            onClick={() => {
                                                setHandleEventClickButton('checkagain');
                                                setShowButtons(prev => ({
                                                    ...prev,
                                                    hint: true,
                                                    tryCheckAgain: false,
                                                    checkResult: true,
                                                    stateCheck: false,
                                                }))
                                            }}
                                        >
                                            Kiểm tra lại
                                        </Button>
                                    }

                                    {
                                        showButtons.continue &&
                                        <Button
                                            variant='contained'
                                            color={(process?.content_step && stepCurrent >= (process.content_step.length - 1)) ? 'success' : 'primary'}
                                            onClick={handleClickNextButton}
                                            sx={{
                                                opacity: (process?.content_step?.length && stepCurrent <= (process.content_step.length - 1)) ? 1 : 0,
                                                pointerEvents: (process?.content_step?.length && stepCurrent <= (process.content_step.length - 1)) ? 'unset' : 'none',
                                            }}
                                            size='large'>
                                            {
                                                (process?.content_step && stepCurrent >= (process.content_step.length - 1)) ?
                                                    'Hoàn thành'
                                                    :
                                                    'Tiếp tục'
                                            }
                                        </Button>
                                    }
                                </Box>
                            </Box>
                        </Box>
                        <Dialog
                            open={openDialogConfirmHint}
                            onClose={() => setOpenDialogConfirmHint(false)}
                        >
                            <InfoUseBit
                                callback={() => {
                                    setHandleEventClickButton('hint');
                                    setOpenDialogConfirmHint(false);
                                }}
                            />
                        </Dialog>
                    </Box>
            }

        </StepByStepContext.Provider>
    )
}

export default StepByStep


interface StepByStepContent extends CourseLessonProps {
    content: string
}

export interface StepByStepProcessLearning extends ProcessLearning {
    content_step?: Array<ContentOfStep>,
}

export interface ContentOfStep {
    type: 'text' | 'quiz' | 'fill_in_the_blanks' | 'fill_in_the_input' | 'order_list',
    content?: string,
    question?: string,
    answers?: Array<{
        title: string,
        is_answer: number,
        explain: string,
    }>,
    answer_option: Array<{
        title: string,
        position?: number,
    }>,
    items?: Array<{
        title: string,
    }>
}


type AvatarUserThumbComponentProps = React.HTMLAttributes<unknown>

function AvatarUser(props: AvatarUserThumbComponentProps) {
    const { children, ...other } = props;
    const user = useUser();
    return (
        <SliderThumb {...other}>
            {children}
            <ImageLazyLoading
                src={getImageUrl(user.avatar, '/images/user-default.svg')}
                placeholderSrc='/images/user-default.svg'
                name={user.full_name}
                sx={{
                    '& .blur': {
                        filter: 'unset !important',
                    },
                    width: "24px",
                    height: "24px",
                    borderRadius: '50%',
                }}
            />
        </SliderThumb>
    );
}

function InfoUseBit({ callback }: { callback: () => void }) {

    const user = useUser();

    const [isLoading, setLoading] = React.useState(false);

    const dispath = useDispatch();

    const handleClick = async () => {

        setLoading(true);

        const minusBit = await accountService.me.game.minusBit(8, 'hint/question');

        if (minusBit.result && minusBit.bit !== undefined) {

            dispath(updateBitPoint(minusBit.bit));

            callback();
        }
        setLoading(false);
    }

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            alignItems: 'center',
            maxWidth: 320,
            margin: '0 auto',
            pt: 3,
            pb: 3,
        }}
    >
        <Icon sx={{ fontSize: 52 }} icon={IconBit} />
        <Typography variant='h3' >Gợi ý câu trả lời</Typography>
        <Typography variant='h5' align='center' sx={{ color: 'text.secondary', lineHeight: '26px' }}>
            Sử dụng bit của bạn để có được câu trả lời<br />(Bạn có <Icon sx={{ mb: -1 }} icon={IconBit} /> {user.getBitToString()})
        </Typography>
        <LoadingButton
            loading={isLoading}
            variant='outlined'
            size='large'
            sx={{
                width: '100%'
            }}
            onClick={handleClick}
            disabled={user.getBit() < 8}
        >
            Mở khóa với <Icon sx={{ ml: 1, mr: 1, opacity: isLoading ? 0 : 1 }} icon={IconBit} /> 8
        </LoadingButton>
    </Box>
}