import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { Box, Button, Card, CardContent, IconButton, InputAdornment, Typography } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import FormWrapper from 'components/atoms/fields/FormWrapper';
import AuthGuard from 'components/templates/AuthGuard';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import courseService, { CourseChapterProps, CourseProps } from 'services/courseService';
// import { useUser } from 'store/user/user.reducers';

const FormCreateCourse = ({ course, onloadCourse }: { course?: CourseProps | null, onloadCourse?: () => void }) => {

    // const user = useUser();

    const [postData, setPostData] = React.useState<JsonFormat>({
        title: course?.title || '',
    });

    const navigate = useNavigate();

    const [activeEditTitle, setActiveEditTitle] = React.useState<boolean>(course ? false : true);

    const [activeAddChapter, setActiveAddChapter] = React.useState<boolean>(course ? true : false);

    const formAddChapter = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (course) {
            setActiveAddChapter(true);
            setActiveEditTitle(false);
            setPostData({
                title: course?.title || '',
            });
        }
    }, [course]);

    return <AuthGuard
        title={'Tạo khóa học'}
        description={'Tạo khóa học'}
    >
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            pt: 8
        }}>
            {
                activeEditTitle ?
                    <Card>
                        <CardContent>
                            <FormWrapper
                                onFinish={async (post) => {
                                    let course_id = await courseService.me.course.create(post.title, course?.id);

                                    if (!course_id) return;

                                    if (!course) {
                                        navigate(`/create-course/${course_id}`);
                                        return;
                                    }

                                    setPostData(post);
                                    setActiveAddChapter(true);
                                    setActiveEditTitle(false);
                                }}
                                postDefault={postData}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}>
                                    <FieldForm
                                        name='title'
                                        component={'text'}
                                        config={{
                                            title: 'Tên khóa học',
                                            rules: {
                                                require: true,
                                            }
                                        }}
                                        post={postData}
                                        onReview={(value: string) => setPostData({ ...postData, title: value })}
                                    />
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <Button variant='contained' type='submit'>{activeAddChapter ? 'Cập nhật' : 'Tạo khóa học'}</Button>
                                    </Box>
                                </Box>
                            </FormWrapper>
                        </CardContent>
                    </Card>
                    :
                    <Typography variant='h1' align='center'>
                        {postData.title}
                        <IconButton
                            onClick={() => setActiveEditTitle(true)}
                        >
                            <CreateOutlinedIcon />
                        </IconButton>
                    </Typography>
            }
        </Box>

        {
            activeAddChapter &&
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                pt: 8
            }}>
                <Typography variant='body2' sx={{ mb: -4 }}>{course?.course_detail?.content?.length} Chương, {course?.course_detail?.content?.reduce((prev, curr) => prev + curr.lessons.length, 0)} Bài học</Typography>
                {
                    course?.course_detail?.content?.map((chapter, index) => (
                        <ChapterItem
                            key={index}
                            chapter={chapter}
                        />
                    ))
                }
                <Card>
                    <CardContent>
                        <FormWrapper
                            onFinish={async (post, clearData) => {

                                if (!course) return;

                                const result = await courseService.me.course.addChapter(course.id, post.title);

                                if (result && onloadCourse) {
                                    await onloadCourse();
                                    clearData();
                                    setTimeout(() => {
                                        formAddChapter.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
                                    }, 100);

                                }
                            }}
                        >
                            <Box ref={formAddChapter}>
                                <FieldForm
                                    name='title'
                                    component={'text'}
                                    config={{
                                        title: 'Tên chương',
                                        rules: {
                                            require: true,
                                        },
                                        inputProps: {
                                            endAdornment: <InputAdornment position='end'>
                                                <Button variant='contained' type='submit'>Thêm chương</Button>
                                            </InputAdornment>,
                                        }
                                    }}
                                />
                            </Box>
                        </FormWrapper>
                    </CardContent>
                </Card>
            </Box>
        }
    </AuthGuard >
};

export default FormCreateCourse;

function ChapterItem({ chapter }: {
    chapter: CourseChapterProps,
}) {

    const [activeEdit, setActiveEdit] = React.useState<boolean>(false);

    return <Card
        sx={{
            boxShadow: '',
            position: 'relative',
        }}
    >


        <CardContent>
            {
                activeEdit ?
                    <FormWrapper
                        postDefault={{ title: chapter.title }}
                        onFinish={(post, clearData) => {
                            // setChapters(prev => {
                            //     prev[index].title = post.title;
                            //     return [...prev];
                            // })
                            // clearData();
                            // setActiveEdit(false);
                        }}
                    >
                        <FieldForm
                            name='title'
                            component={'text'}
                            config={{
                                title: 'Tên chương',
                                size: 'small',
                            }}
                        />
                    </FormWrapper>
                    :
                    <Typography variant='h2'>{chapter.title}  <IconButton
                        onClick={() => setActiveEdit(true)}
                        sx={{
                        }}
                    >
                        <CreateOutlinedIcon />
                    </IconButton></Typography>
            }
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    pl: 3,
                }}
            >
                {
                    chapter.lessons.map((lesson, index) => (
                        <Box key={index} sx={{ mt: 2 }}>
                            <Typography variant='body1'>{lesson.title}</Typography>
                        </Box>
                    ))
                }
            </Box>
            <Box
                sx={{
                    mt: 3,
                    pl: 3,
                }}
            >
                <FormWrapper
                    onFinish={(post, clearData) => {

                        console.log(chapter.id);
                        // setChapters(prev => {
                        //     prev[index].lessons.push({
                        //         link: post.link,
                        //     })
                        //     return [...prev];
                        // })
                        clearData();
                    }}
                >
                    <FieldForm
                        name='link'
                        component={'text'}
                        config={{
                            title: 'Link video youtube',
                            rules: {
                                require: true,
                            },
                            inputProps: {
                                endAdornment: <InputAdornment position='end'>
                                    <Button variant='contained' type='submit'>Thêm bài học</Button>
                                </InputAdornment>,
                            }
                        }}
                    />
                </FormWrapper>
            </Box>
        </CardContent>
    </Card>
}