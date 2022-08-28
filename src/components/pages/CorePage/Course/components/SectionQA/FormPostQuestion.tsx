import { Box, Button, FormControlLabel, Radio, Theme, Typography } from '@mui/material'
import FieldForm from 'components/atoms/fields/FieldForm'
import Icon from 'components/atoms/Icon'
import makeCSS from 'components/atoms/makeCSS'
import { __ } from 'helpers/i18n'
import React from 'react'
import { ChapterAndLessonCurrentState, CourseProps } from 'services/courseService'
import elearningService from 'services/elearningService'

const useStyle = makeCSS((theme: Theme) => ({
    typeItem: {
        display: 'flex',
        border: '1px solid',
        borderColor: theme.palette.text.disabled,
        cursor: 'pointer',
        padding: theme.spacing(1, 3),
        position: 'relative',
        '&:before': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 9,
            cursor: 'pointer',
        }
    },
    centerItem: {
        alignItems: 'center',
    }
}));

function FormPostQuestion({ course, onBack, chapterAndLessonCurrent, handleOnLoadQA }: {
    course: CourseProps,
    chapterAndLessonCurrent: ChapterAndLessonCurrentState,
    onBack: () => void,
    handleOnLoadQA: () => void,
}) {

    const classes = useStyle();

    const [data, setData] = React.useState<{
        step: number,
        type: null | string,
        something_else: number,
        title: string,
        content: string,
    }>({
        step: 0,
        type: null,
        something_else: -1,
        title: '',
        content: '',
    });

    const handleSubmitQuestion = () => {
        (async () => {
            const result = await elearningService.qa.post({
                title: data.title,
                content: data.content,
                courseID: course.id,
                lessonID: chapterAndLessonCurrent.lessonID,
                chapterID: chapterAndLessonCurrent.chapterID,
            });

            if (result) {
                handleOnLoadQA();
                onBack();
            }
        })()
    };

    if (data.step === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <Box>
                    <Button
                        color='inherit'
                        variant='outlined'
                        onClick={onBack}
                        disableRipple
                        startIcon={<Icon icon="ArrowBackRounded" />}
                    >
                        {__('Quay lại trang danh sách')}
                    </Button>
                </Box>
                <Typography variant="h4">{__('My question relates to')}</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    {
                        [
                            {
                                title: __('Course content'),
                                description: __('This might include comments, questions, tips, or projects to share'),
                                key: 'course_content',
                            },
                            {
                                title: __('Something else'),
                                description: __('This might include questions about certificates, audio and video troubleshooting, or download issues'),
                                key: 'something_else',
                            },
                        ].map(item => (
                            <div
                                key={item.key}
                                className={classes.typeItem}
                                onClick={() => {
                                    setData(prev => ({ ...prev, type: item.key }))
                                }}
                            >
                                <Box>
                                    <FormControlLabel value="course_content" control={<Radio checked={data.type === item.key} />} label="" />
                                </Box>
                                <Box>
                                    <Typography variant='h4'>{item.title}</Typography>
                                    <Typography color="text.secondary">{item.description}</Typography>
                                </Box>
                            </div>
                        ))
                    }
                    <Button
                        variant='contained'
                        disableRipple
                        sx={{ mt: 1 }}
                        onClick={() => {
                            setData(prev => ({ ...prev, step: prev.type === 'something_else' ? 2 : 1 }))
                        }}
                    >
                        {__('Tiếp tục')}
                    </Button>
                </Box>
            </Box >
        )
    }

    if (data.step === 1) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <Box>
                    <Button
                        color='inherit'
                        variant='outlined'
                        onClick={onBack}
                        disableRipple
                        startIcon={<Icon icon="ArrowBackRounded" />}
                    >
                        {__('Quay lại trang danh sách')}
                    </Button>
                </Box>
                <Box
                    sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'dividerDark',
                    }}
                >
                    <Typography variant="h5">{__('Tips on getting your questions answered faster')}</Typography>
                    <ul style={{ marginBottom: 0 }}>
                        <li>{__('Search to see if your question has been asked before')}</li>
                        <li>{__('Be detailed; provide screenshots, error messages, code, or other clues whenever possible')}</li>
                        <li>{__('Check grammar and spelling')}</li>
                    </ul>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <Typography>{__('Title or summary')}</Typography>
                        <FieldForm
                            component='text'
                            config={{
                                title: undefined,
                                inputProps: {
                                    placeholder: __('e.g. Why do we use fit_transform() for training_set?')
                                }
                            }}
                            name="title"
                            post={data}
                            onReview={(value) => {
                                setData(prev => ({ ...prev, title: value }));
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <Typography>{__('Details (optional)')}</Typography>
                        <FieldForm
                            component='editor'
                            config={{
                                title: undefined,
                                disableScrollToolBar: true,
                                inputProps: {
                                    height: 500,
                                    placeholder: __('e.g.  At 05:28, I didn\'t understand this part, here is a screenshot of what I tried...')
                                }
                            }}
                            name="content"
                            post={data}
                            onReview={(value) => {
                                setData(prev => ({ ...prev, content: value }));
                            }}
                        />
                    </Box>
                    <Button
                        variant='contained'
                        sx={{ mt: 1 }}
                        onClick={handleSubmitQuestion}
                    >
                        {__('Đăng câu hỏi')}
                    </Button>
                </Box>

            </Box>
        )
    }

    if (data.step === 2) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <Box>
                    <Button
                        color='inherit'
                        variant='outlined'
                        onClick={() => {
                            setData(prev => ({ ...prev, step: 0 }))
                        }}
                    >
                        {__('Back')}
                    </Button>
                </Box>
                <Box
                    sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'dividerDark',
                    }}
                >
                    <Typography variant="h5">{__('My question relates to something outside of course content.')}</Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    {
                        [
                            __('Certificates and accreditation'),
                            __('Audio and video troubleshooting'),
                            __('Downloading resources'),
                            __('It’s something else')
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={classes.typeItem + ' ' + classes.centerItem}
                                onClick={() => {
                                    setData(prev => ({ ...prev, something_else: index }))
                                }}
                            >
                                <Box>
                                    <FormControlLabel value="course_content" control={<Radio checked={data.something_else === index} />} label="" />
                                </Box>
                                <Box>
                                    <Typography variant='h4'>{item}</Typography>
                                </Box>
                            </div>
                        ))
                    }
                    <Button
                        variant='contained'
                        disableRipple
                        sx={{ mt: 1 }}
                        onClick={() => {
                            setData(prev => ({ ...prev, step: 1 }))
                        }}
                    >
                        {__('Tiếp tục')}
                    </Button>
                </Box>
            </Box>
        );
    }

    return <></>
}

export default FormPostQuestion