import { Box, Button, Card, CardContent, Typography, useTheme } from '@mui/material';
import Icon from 'components/atoms/Icon';
import MoreButton from 'components/atoms/MoreButton';
import useAjax from 'hook/useApi';
import useQuery from 'hook/useQuery';
import React from 'react';
import { CourseContent } from 'services/courseService';
import useCourse from '../../useCourse';
import Label from 'components/atoms/Label';
import DrawerCustom from 'components/molecules/DrawerCustom';
import Comments from 'plugins/Vn4Comment/Comments';
import { LoadingButton } from '@mui/lab';

function Courses({ setTitle }: { setTitle: (title: string) => void }) {

    const { courses } = useCourse();

    const theme = useTheme();

    const [courseDetail, setCourseDetail] = React.useState<CourseContent | null>(null);
    // communication/qa/update-readed
    const urlParam = useQuery({
        course: 0,
    });

    const [openCommentDetail, setOpenCommentDetail] = React.useState<ID | null>(null);

    const useApi = useAjax();

    React.useEffect(() => {
        setTitle('Courses');
    }, []);

    const handleUpdateIsReaded = (id: ID) => {
        useApi.ajax({
            url: 'vn4-e-learning/instructor/communication/course/update-unread',
            data: {
                id: id
            },
            success: (result: { is_unread: number }) => {
                if (result.is_unread !== undefined) {
                    setCourseDetail(prev => prev ?
                        prev.map(chapter => ({
                            ...chapter,
                            lessons: Array.isArray(chapter.lessons) ? chapter.lessons?.map(lesson => ({
                                ...lesson,
                                is_unread: (id + '') === (lesson.id + '') ? result.is_unread : lesson.is_unread
                            })) : []
                        }))
                        : prev
                    )
                }
                setOpenCommentDetail(null);
                // if (result.content) {
                //     setCourseDetail(result.content);
                // }
            }
        });
    };

    const handleUpdateAllReaded = (id: ID) => {
        useApi.ajax({
            url: 'vn4-e-learning/instructor/communication/course/update-unread',
            data: {
                course: id
            },
            success: (result: { result: number }) => {
                if (result.result) {
                    setCourseDetail(prev => prev ?
                        prev.map(chapter => ({
                            ...chapter,
                            lessons: Array.isArray(chapter.lessons) ? chapter.lessons?.map(lesson => ({
                                ...lesson,
                                is_unread: 0,
                            })) : []
                        }))
                        : prev
                    )
                }
            }
        });
    };

    const handleOnLoadCourseDetail = () => {
        useApi.ajax({
            url: 'vn4-e-learning/instructor/communication/course/get',
            data: {
                course_id: courses?.[Number(urlParam.query.course)] ? courses[Number(urlParam.query.course)].id : courses?.[0].id
            },
            success: (result: { content: CourseContent }) => {
                if (result.content) {
                    console.log(result.content);
                    window.___content = result.content;
                    setCourseDetail(result.content);
                }
            }
        });
    }

    React.useEffect(() => {
        if (courses) {
            handleOnLoadCourseDetail();
        }
    }, [urlParam.query.course, courses]);

    const indexCourseSelected = (courses && courses[Number(urlParam.query.course)]) ? Number(urlParam.query.course) : 0;

    const listSelectCourse = courses ? courses.map((item, index) => ({
        title: item.title,
        // selected: (urlParam.query.course + '') === (item.id + ''),
        action() {
            urlParam.changeQuery({
                course: index,
            })
        },
    })) : [];

    return (<>
        <Typography variant='h2' sx={{
            mb: 4, display: 'flex',
            alignItems: 'center',
            '& .MoreButton-root': {
                display: 'flex',
            }
        }}>
            Khóa học
            <MoreButton
                actions={[listSelectCourse]}
            >
                <Button
                    endIcon={<Icon icon="ExpandMoreOutlined" />}
                    sx={{
                        fontSize: 'inherit',
                        padding: 0,
                        marginLeft: 3,
                        textTransform: 'initial',
                        color: 'inherit',
                        lineHeight: 'unset',
                    }}
                >
                    {
                        listSelectCourse[indexCourseSelected]?.title ?? '...'
                    }
                </Button>
            </MoreButton>
        </Typography>
        <Card
            sx={{
                mt: 6
            }}
        >
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                }}
            >
                <Box>
                    <LoadingButton
                        loading={useApi.open}
                        variant='outlined'
                        sx={{
                            ml: 1
                        }}
                        onClick={() => handleUpdateAllReaded(courses?.[indexCourseSelected]?.id ?? 0)}
                    >
                        Cập nhất dã đọc tất cả bài học
                    </LoadingButton>
                </Box>
                {
                    courseDetail ?
                        courseDetail.map(chapter => (<Box
                            key={chapter.id}
                        >
                            <Typography variant='h4'>
                                {chapter.title}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    pl: 3,
                                    mt: 1,
                                }}
                            >
                                {
                                    (() => {
                                        try {
                                            return chapter.lessons.map(lesson => (
                                                <Box key={lesson.id}
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 1,
                                                        alignItems: 'center',
                                                        height: 28,
                                                    }}
                                                >
                                                    <Typography>
                                                        [{lesson.id}]
                                                    </Typography>
                                                    {lesson.title} {
                                                        lesson.is_unread ? <>
                                                            <Label color='#d32f2f'>Chưa trả lời</Label>
                                                            <Button
                                                                size="small"
                                                                sx={{
                                                                    textTransform: 'unset',
                                                                    p: 0,
                                                                    minWidth: 'unset',
                                                                    fontSize: 16,
                                                                    fontWeight: 400,
                                                                }}
                                                                onClick={() => {
                                                                    setOpenCommentDetail(lesson.id)
                                                                }}
                                                            >Trả lời</Button>
                                                        </>
                                                            :
                                                            null
                                                    }
                                                </Box>
                                            ))
                                        } catch (error) {
                                            return null
                                        }
                                    })()
                                }
                            </Box>
                        </Box>
                        ))
                        :
                        null
                }
            </CardContent>
        </Card>

        <DrawerCustom
            title={<>
                Comment
                <LoadingButton
                    loading={useApi.open}
                    variant='outlined'
                    sx={{
                        ml: 1
                    }}
                    onClick={() => handleUpdateIsReaded(openCommentDetail ?? 0)}
                >
                    Đánh dấu đã đọc
                </LoadingButton>
            </>}
            open={openCommentDetail !== null}
            onClose={() => {
                setOpenCommentDetail(null);
            }}
            onCloseOutsite
            restDialogContent={{
                sx: (theme) => ({
                    backgroundColor: theme.palette.mode === 'light' ? '#F0F2F5' : theme.palette.body.background
                })
            }}
        >
            {
                openCommentDetail !== null &&
                <Comments
                    keyComment={openCommentDetail}
                    type={'e_lesson_comment'}
                    backgroundContentComment={theme.palette.mode === 'light' ? 'white' : 'commentItemBackground'}
                />
            }
        </DrawerCustom>
    </>)
}

export default Courses