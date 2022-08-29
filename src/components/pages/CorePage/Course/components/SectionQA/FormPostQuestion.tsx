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
                <Typography variant="h4">{__('Câu hỏi của tôi liên quan đến')}</Typography>
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
                                title: __('Nội dung khóa học'),
                                description: __('Điều này có thể bao gồm nhận xét, câu hỏi, mẹo hoặc dự án để chia sẻ'),
                                key: 'course_content',
                            },
                            {
                                title: __('Thứ gì khác'),
                                description: __('Điều này có thể bao gồm các câu hỏi về chứng chỉ, khắc phục sự cố âm thanh và video hoặc các sự cố tải xuống'),
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
                    <Typography variant="h5">{__('Mẹo giúp câu hỏi của bạn được trả lời nhanh hơn')}</Typography>
                    <ul style={{ marginBottom: 0 }}>
                        <li>{__('Tìm kiếm để xem liệu câu hỏi của bạn đã được hỏi trước đây chưa')}</li>
                        <li>{__('Hãy chi tiết; cung cấp ảnh chụp màn hình, thông báo lỗi, mã hoặc các manh mối khác bất cứ khi nào có thể')}</li>
                        <li>{__('Kiểm tra ngữ pháp và chính tả')}</li>
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
                                    placeholder: __('ví dụ. Tại sao chúng tôi sử dụng fit_transform () cho training_set?')
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
                        <Typography>{__('Chi tiết (tùy chọn)')}</Typography>
                        <FieldForm
                            component='editor'
                            config={{
                                title: undefined,
                                disableScrollToolBar: true,
                                inputProps: {
                                    height: 500,
                                    placeholder: __('ví dụ. Vào lúc 05:28, tôi không hiểu phần này, đây là ảnh chụp màn hình của những gì tôi đã thử ...')
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
                        {__('Quay lại')}
                    </Button>
                </Box>
                <Box
                    sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'dividerDark',
                    }}
                >
                    <Typography variant="h5">{__('Câu hỏi của tôi liên quan đến điều gì đó ngoài nội dung khóa học.')}</Typography>
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
                            __('Chứng chỉ'),
                            __('Khắc phục sự cố âm thanh và video'),
                            __('Tải xuống tài nguyên'),
                            __('Nó là một cái gì đó khác')
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