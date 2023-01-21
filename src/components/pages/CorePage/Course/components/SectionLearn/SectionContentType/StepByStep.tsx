import Slider, { SliderThumb } from '@mui/material/Slider';
import Box from 'components/atoms/Box';
import Divider from 'components/atoms/Divider';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Typography from 'components/atoms/Typography';
import { getImageUrl } from 'helpers/image';
import React from 'react';
import { CourseLessonProps, ProcessLearning } from 'services/courseService';
import { useUser } from 'store/user/user.reducers';
import ContentStepByStep from './ContentStepByStep';
import { Button, IconButton } from '@mui/material';
import Icon from 'components/atoms/Icon';
import StepByStepContext from './ContentStepByStep/StepByStepContext';
import CourseLearningContext, { CourseLearningContextProps } from '../../../context/CourseLearningContext';

function StepByStep({ lesson, process }: {
    lesson: StepByStepContent,
    process: StepByStepProcessLearning | null,
}) {

    const [stepCurrent, setStepCurrent] = React.useState(0);

    const [handleEventClickButton, setHandleEventClickButton] = React.useState<null | 'check' | 'checkagain'>(null);

    const [disableButtonCheck, setDisableButtonCheck] = React.useState(true);

    const [openScreenLessonCompelete, setOpenScreenLessonCompelete] = React.useState(false);

    const courseLearningContext = React.useContext<CourseLearningContextProps>(CourseLearningContext);

    const [showButtons, setShowButtons] = React.useState({
        continue: false,
        tryCheckAgain: false,
        checkResult: false,
        hint: false,
        stateCheck: false,
    });


    React.useEffect(() => {
        setStepCurrent(0);
    }, [process]);

    React.useEffect(() => {
        setOpenScreenLessonCompelete(false);
    }, [lesson]);

    return (
        <StepByStepContext.Provider
            value={{
                showButtons: showButtons,
                setShowButtons: setShowButtons,
                handleEventClickButton: handleEventClickButton,
                setDisableButtonCheck: setDisableButtonCheck,
            }}
        >
            {
                openScreenLessonCompelete ?
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1,
                            width: '100%',
                            maxWidth: 400,
                            margin: '0 auto',
                            pb: 6,
                        }}
                    >
                        <ImageLazyLoading
                            src={'/images/gif/lesson-compelete.gif'}
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
                                color='success'
                                size='large'
                                sx={{ margin: '0 auto', pl: 4, pr: 4 }}
                                onClick={() => {
                                    courseLearningContext.handleClickInputCheckBoxLesson(lesson);
                                    courseLearningContext.nexLesson(true);
                                }}
                            >Hoàn thành bài học
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
                                </Box>
                            </Box>

                            <Divider color='dark' />

                            <Box
                                sx={{
                                    minHeight: 700,
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
                                        showButtons.hint &&
                                        <IconButton size='large' color="primary">
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
                                                // if (refCheckCallback.current) {
                                                //     refCheckCallback.current();
                                                // }
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
                                            onClick={() => {
                                                if ((process?.content_step?.length && stepCurrent === (process.content_step.length - 1))) {
                                                    setOpenScreenLessonCompelete(true);
                                                } else {
                                                    setStepCurrent(prev => ++prev);
                                                    setDisableButtonCheck(true);
                                                    setHandleEventClickButton(null);
                                                }
                                            }}
                                            sx={{
                                                opacity: (process?.content_step?.length && stepCurrent <= (process.content_step.length - 1)) ? 1 : 0,
                                                pointerEvents: (process?.content_step?.length && stepCurrent <= (process.content_step.length - 1)) ? 'unset' : 'none',
                                            }}
                                            size='large'>
                                            {
                                                (process?.content_step?.length && stepCurrent === (process.content_step.length - 1)) ?
                                                    'Hoàn thành'
                                                    :
                                                    'Tiếp tục'
                                            }
                                        </Button>
                                    }
                                </Box>
                            </Box>
                        </Box>
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
    type: 'text' | 'quiz' | 'fill_in_the_blanks',
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