import { Box, Button, Card, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Label from 'components/atoms/Label';
import Loading from 'components/atoms/Loading';
import MoreButton from 'components/atoms/MoreButton';
import { PaginationProps } from 'components/atoms/TablePagination';
import Tooltip from 'components/atoms/Tooltip';
import FieldForm from 'components/atoms/fields/FieldForm';
import { cssMaxLine } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import usePaginate from 'hook/usePaginate';
import useQuery from 'hook/useQuery';
import clone from 'lodash/clone';
import moment from 'moment';
import React from 'react';
import elearningService from 'services/elearningService';
import { ProcessComplete } from 'services/elearningService/instructor/performance/students/getProcessOfStudent';
import { StudentProps } from 'services/elearningService/instructor/performance/students/getStudents';
import DrawerGroupAccount from '../../components/DrawerGroupAccount';
import useCourse from '../../useCourse';


function Students({ setTitle }: { setTitle: (title: string) => void }) {

    const urlParam = useQuery({
        course: 0,
        student: 0,
        unread: 1,
        noAnswer: 0,
        noMyAnser: 0,
        serach: '',
        time: 1,
        add_group: 0,
    });

    const [search, setSearch] = React.useState('');

    const { courses } = useCourse();

    const [students, setStudents] = React.useState<PaginationProps<StudentProps> | null>(null);

    const [userAddToGroup, setUserAddToGroup] = React.useState<StudentProps | null>(null);

    const [studentCurrent, setStudentCurrent] = React.useState<StudentProps | null>(null);

    const [process, setProcess] = React.useState<ProcessComplete[] | null>(null);

    // const [openDialogListGroup, setOpenDialogListGroup] = React.useState<ID | false>(false);
    // const [openDialogAddGroup, setOpenDialogAddGroup] = React.useState(false);

    const paginate = usePaginate({
        name: 'i_s',
        data: { current_page: 0, per_page: 10 },
        enableLoadFirst: true,
        onChange: async (data) => {
            const studentsData = await elearningService.instructor.performance.students.get(urlParam.query.course, data, {
                noAnswer: (urlParam.query.noAnswer + '') === '1',
                unread: (urlParam.query.unread + '') === '1',
                noMyAnser: (urlParam.query.noMyAnser + '') === '1',
                serach: urlParam.query.serach + '',
            }, timeRange[Number(urlParam.query.time)] ? {
                ...(timeRange[Number(urlParam.query.time)].range()),
            } : {
                ...(timeRange[1].range()),
            });
            setStudents(studentsData);

            if (studentsData?.data.length && !studentCurrent) {

                let findIndex = 0;

                if (urlParam.query.student) {
                    findIndex = studentsData?.data.findIndex(item => (item.id + '') === (urlParam.query.student + ''));
                }

                if (findIndex < 0) {
                    findIndex = 0;
                }

                urlParam.changeQuery({
                    student: studentsData?.data[findIndex].id
                });
                setStudentCurrent(studentsData?.data[findIndex]);
            }

        },
        isChangeUrl: true,
        pagination: students,
    });


    React.useEffect(() => {

        if (urlParam.query.student && students && students.data.length) {

            const indexStudent = students.data.findIndex(item => (item.id + '') === (urlParam.query.student + ''));

            if (indexStudent > -1) {
                setStudentCurrent(students.data[indexStudent]);
                setProcess(null);
            }
        }

    }, [urlParam.query.student]);

    React.useEffect(() => {
        if (studentCurrent?.id) {
            (async () => {
                const dataProcess = await elearningService.instructor.performance.students.getProcessOfStudent(studentCurrent.id);
                setProcess(dataProcess);
            })();
        }
    }, [studentCurrent]);


    React.useEffect(() => {
        // paginate.set({
        //     current_page: 0,
        //     per_page: 10,
        //     loadData: true,
        // });

        setTitle('Học viên');
    }, []);

    React.useEffect(() => {
        if (!urlParam.isFirstLoad) {
            (async () => {
                paginate.set({
                    current_page: 0,
                    per_page: 10,
                    loadData: true,
                });
            })();
        }
    }, [
        urlParam.query.course,
        urlParam.query.unread,
        urlParam.query.noAnswer,
        urlParam.query.noMyAnser,
        urlParam.query.serach,
        urlParam.query.time
    ]);

    React.useEffect(() => {
        setSearch(urlParam.query.serach + '');
    }, [urlParam.query.serach]);


    const listSelectCourse = courses ? courses.map((item) => ({
        title: item.title,
        selected: (urlParam.query.course + '') === (item.id + ''),
        action() {
            urlParam.changeQuery({
                course: item.id,
            })
            paginate.set({
                current_page: 0,
                per_page: 10,
            });
        },
    })) : [];

    let indexCourseSelected = -1;

    if (courses && courses?.length > 1) {
        indexCourseSelected = courses.findIndex(item => (item.id + '') === (urlParam.query.course + ''));
        listSelectCourse.unshift({
            title: 'Tất cả khóa học',
            selected: indexCourseSelected === -1,
            action() {
                urlParam.changeQuery({
                    course: 0,
                });
                paginate.set({
                    current_page: 0,
                    per_page: 10,
                });
            },
        });
        if (indexCourseSelected === -1) {
            indexCourseSelected = 0;
        } else {
            indexCourseSelected++;
        }
    } else {
        indexCourseSelected = 0;
    }

    return (<>
        <Typography variant='h2' sx={{
            mb: 4, display: 'flex',
            alignItems: 'center',
            '& .MoreButton-root': {
                display: 'flex',
            }
        }}>
            Học viên
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
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
            }}
        >
            <Box />
            <MoreButton
                actions={[
                    timeRange.map((item, index) => ({
                        title: item.title,
                        selected: (index + '') === (urlParam.query.time + ''),
                        action: () => {
                            urlParam.changeQuery({
                                time: index
                            });
                        }
                    }))
                ]}
            >
                <Button variant='outlined' color='inherit' startIcon={<Icon icon="AccessTimeOutlined" />}>
                    {timeRange[Number(urlParam.query.time)] ? timeRange[Number(urlParam.query.time)].title : '7 Ngày qua'}
                </Button>
            </MoreButton>
        </Box>
        <Card>
            <Box
                sx={{
                    display: 'flex',
                    // border: '1px solid',
                    // borderTop: 0,
                    // borderColor: 'dividerDark',
                    height: 'calc(100vh - 64px - 24px - 64px - 42px - 24px - 24px )',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        width: 400,
                        maxWidth: '100%',
                        flexShrink: 0,
                        borderRight: '1px solid',
                        borderColor: 'dividerDark',
                        position: 'relative',
                    }}
                >
                    <Loading open={paginate.isLoading} isCover />
                    <Box
                        sx={{
                            display: 'flex',
                            borderBottom: '1px solid',
                            borderColor: 'dividerDark',
                            '& .MuiInputBase-root': {
                                borderRadius: '0',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: "none",
                            },
                        }}
                    >
                        <FieldForm
                            component='text'
                            config={{
                                title: false,
                                size: 'small',
                                placeholder: 'Tìm kiêm bằng từ khóa',
                                inputProps: {
                                    onKeyUp: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        if (e.key === 'Enter') {
                                            urlParam.changeQuery({
                                                serach: (e.target as HTMLInputElement).value
                                            });
                                        }
                                    },
                                }
                            }}
                            name="search"
                            post={{ search: search }}
                            onReview={() => {
                                //
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid',
                                borderColor: 'dividerDark',
                                width: 40,
                                borderTop: 0,
                                borderRight: 0,
                                borderBottom: 0,
                                cursor: 'pointer',

                            }}
                        >
                            <Icon sx={{
                                opacity: 0.7,
                                '&:hover': {
                                    opacity: 1,
                                }
                            }} icon="SearchOutlined" />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            height: 'calc(100% - 40px - 52px)',
                            overflow: 'auto',
                            borderBottom: '1px solid',
                            borderColor: 'dividerDark',
                        }}
                    >
                        {
                            students?.data.map((student, index) => (
                                <Box
                                    key={student.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: 2,
                                        padding: 2,
                                        borderBottom: (index + 1) < students?.data.length ? '1px solid' : '',
                                        borderColor: 'dividerDark',
                                        cursor: 'pointer',
                                        backgroundColor: studentCurrent?.id === student.id ? 'divider' : 'unset',
                                        '&:hover': {
                                            backgroundColor: 'divider',
                                        },
                                    }}
                                    onClick={() => {
                                        urlParam.changeQuery({
                                            student: student.id
                                        });
                                    }}
                                >
                                    <Box>
                                        <ImageLazyLoading
                                            src={getImageUrl(student.avatar, '/images/user-default.svg')}
                                            sx={{
                                                width: 54,
                                                height: 54,
                                                borderRadius: '50%',
                                                flexShrink: 0,
                                            }} />
                                    </Box>
                                    <Box
                                        sx={{
                                            width: '100%',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                ...cssMaxLine(3)
                                            }}
                                        >
                                            {student.full_name}
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <Typography variant='subtitle2'>{student.email}</Typography>
                                            {/* <Typography variant='body2'>{dateTimefromNow(QAItem.created_at)}</Typography> */}

                                        </Box>
                                    </Box>
                                    <Box
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <MoreButton
                                            actions={[
                                                [
                                                    {
                                                        title: 'Thông báo',
                                                        action() {
                                                            //
                                                        },
                                                    },
                                                    {
                                                        title: 'Chỉnh sửa nhóm',
                                                        action() {
                                                            setUserAddToGroup(student);
                                                        },
                                                    }
                                                ]
                                            ]}
                                        />
                                    </Box>
                                </Box>
                            ))
                        }
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        {
                            paginate.component
                        }
                    </Box>
                </Box>

                <Box
                    sx={{
                        width: '100%',
                        position: 'relative',
                    }}
                >


                    {(() => {

                        if (studentCurrent) {

                            // const index = questions.data.findIndex(item => (item.id + '') === (urlParam.query.question + ''));

                            // if (index > -1) {

                            // const courseIndex = courses ? courses.findIndex(item => (item.id + '') === (questionCurrent.course + '')) : -1;

                            // if (courseIndex > -1)
                            return <>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        padding: 1,
                                        borderBottom: '1px solid',
                                        borderColor: 'dividerDark',
                                    }}
                                >
                                    <ImageLazyLoading src={getImageUrl(studentCurrent.avatar)} sx={{
                                        width: 54,
                                        height: 54,
                                        flexShrink: 0,
                                        borderRadius: '50%',
                                    }} />
                                    <Box
                                        sx={{
                                            width: '100%',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                ...cssMaxLine(1)
                                            }}
                                        >{
                                                studentCurrent.full_name
                                            }
                                        </Typography>
                                        <Typography variant='body2'>{studentCurrent.email}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <MoreButton
                                            actions={[
                                                [
                                                    {
                                                        title: 'Thông báo',
                                                        action() {
                                                            //
                                                        },
                                                    },
                                                    {
                                                        title: 'Chỉnh sửa nhóm',
                                                        action() {
                                                            setUserAddToGroup(studentCurrent);
                                                        },
                                                    }
                                                ]
                                            ]}
                                        />
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        height: 'calc(100% - 50px)',
                                        overflow: 'auto',
                                        padding: 2,
                                        position: 'relative',
                                    }}
                                >

                                    {
                                        process !== null ?
                                            process.map((item) => (
                                                <Box
                                                    key={item.id}
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 1,
                                                        mb: 2,
                                                    }}
                                                >
                                                    <ImageLazyLoading
                                                        src={getImageUrl(item.featured_image)}
                                                        sx={{
                                                            borderRadius: 1,
                                                            width: 50,
                                                            height: 50,
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    {
                                                        (() => {

                                                            let max = 0;
                                                            let countLesson = 0;
                                                            let lessonComplete = 0;

                                                            item.content.filter(item => !item.delete).forEach(chapter => {
                                                                const length = chapter.lessons.filter(item => !item.delete).length;
                                                                countLesson += length;
                                                                if (length > max) max = length;
                                                            })

                                                            const result = item.content.filter(chapter => !chapter.delete).map(chapter => (
                                                                <React.Fragment
                                                                    key={chapter.id}
                                                                >
                                                                    <Typography variant='subtitle1'>{chapter.title}</Typography>
                                                                    <Box
                                                                        sx={{
                                                                            height: 20,
                                                                            width: '100%',
                                                                            display: 'grid',
                                                                            gap: '2px',
                                                                            gridTemplateColumns: 'repeat(' + max + ', 1fr)',
                                                                            mb: 1,
                                                                        }}
                                                                    >
                                                                        {
                                                                            chapter.lessons.filter(lesson => !lesson.delete).map(lesson => {

                                                                                if (item.process?.lesson_completed_parse?.[lesson.id]) {
                                                                                    lessonComplete++;
                                                                                }

                                                                                return <Tooltip
                                                                                    key={lesson.id}
                                                                                    title={<>
                                                                                        {lesson.title}
                                                                                    </>}
                                                                                >
                                                                                    <Box
                                                                                        sx={{
                                                                                            height: 20,
                                                                                            borderRadius: 1,
                                                                                            display: 'flex',
                                                                                            cursor: 'pointer',
                                                                                            backgroundColor: item.process?.lesson_completed_parse?.[lesson.id] ? 'success.main' : 'secondary.main',
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            item.love?.[lesson.id] === 'love' &&
                                                                                            <Icon sx={{ height: 18, color: '#fff' }} icon="FavoriteRounded" />
                                                                                        }
                                                                                    </Box>
                                                                                </Tooltip>
                                                                            })
                                                                        }
                                                                    </Box>
                                                                </React.Fragment>
                                                            ));

                                                            const precent = Number((lessonComplete * 100 / (countLesson ?? 1)));

                                                            return <Box
                                                                sx={{
                                                                    width: '100%',
                                                                }}
                                                            >
                                                                <Typography sx={{ display: 'flex', alignItems: 'center' }} variant='h4'>{item.title}&nbsp;&nbsp;{Boolean(precent) && <Label>{precent.toFixed(2)}%</Label>}</Typography>
                                                                <Box sx={{ mt: 2 }}>
                                                                    {result}
                                                                </Box>
                                                            </Box>
                                                                ;
                                                        })()
                                                    }
                                                </Box>
                                            ))
                                            :
                                            <Loading open={true} isCover />
                                    }
                                </Box>
                            </>
                            // }
                        }

                    })()}
                </Box>
            </Box>
        </Card>

        <DrawerGroupAccount
            open={userAddToGroup !== null}
            groupIDs={clone(userAddToGroup?.groupID)}
            onClose={() => setUserAddToGroup(null)}
            onChooseGroup={async (groups) => {
                const result = await elearningService.instructor.performance.students.addAccountToGroup(userAddToGroup?.id ?? 0, groups.map(item => item.id));
                if (result) {
                    window.showMessage('Thêm học viên vào nhóm thành công', 'success');
                } else {
                    window.showMessage('Thêm học viên vào nhóm thất bại', 'error');
                }

                if ((userAddToGroup?.id + '') === (studentCurrent?.id + '')) {
                    setStudentCurrent(prev => (prev ? {
                        ...prev,
                        groupID: groups.map(item => ({ id: item.id })),
                    } : prev))
                }

                if (students) {
                    const findIndex = students.data.findIndex(i => (i.id + '') === (userAddToGroup?.id + ''));

                    if (findIndex > -1) {
                        setStudents(prev => {
                            if (prev) {
                                prev.data[findIndex].groupID = groups.map(item => ({ id: item.id }));
                                return { ...prev };
                            }
                            return prev;
                        })
                    }
                }
            }}
        />
    </>)
}

export default Students

const timeRange = [
    {
        title: __('Hôm nay'),
        range: () => {
            const objMoment = moment();
            return {
                endDate: objMoment.format('YYYY-MM-DD 23:59:59'),
                startDate: objMoment.format('YYYY-MM-DD 00:00:00'),
            }
        }
    },
    {
        title: __('7 ngày qua'),
        range: () => {
            const objMoment = moment();
            return {
                endDate: objMoment.subtract(1, 'days').format('YYYY-MM-DD 23:59:59'),
                startDate: objMoment.subtract(6, 'days').format('YYYY-MM-DD 00:00:00'),
            }
        }
    },
    {
        title: __('30 ngày qua'),
        range: () => {
            const objMoment = moment();
            return {
                endDate: objMoment.subtract(1, 'days').format('YYYY-MM-DD 23:59:59'),
                startDate: objMoment.subtract(29, 'days').format('YYYY-MM-DD 00:00:00'),
            }
        }
    },
    {
        title: __('60 ngày qua'),
        range: () => {
            const objMoment = moment();
            return {
                endDate: objMoment.subtract(1, 'days').format('YYYY-MM-DD 23:59:59'),
                startDate: objMoment.subtract(59, 'days').format('YYYY-MM-DD 00:00:00'),
            }
        }
    },
    {
        title: __('90 ngày qua'),
        range: () => {
            const objMoment = moment();
            return {
                endDate: objMoment.subtract(1, 'days').format('YYYY-MM-DD 23:59:59'),
                startDate: objMoment.subtract(89, 'days').format('YYYY-MM-DD 00:00:00'),
            }
        }
    },
    {
        title: __('Trong năm qua'),
        range: () => {
            const objMoment = moment();
            return {
                endDate: objMoment.subtract(1, 'days').format('YYYY-MM-DD 23:59:59'),
                startDate: objMoment.subtract(354, 'days').format('YYYY-MM-DD 00:00:00'),
            }
        }
    },
    {
        title: __('Tất cả'),
        range: () => {
            return {
                startDate: '-1',
                endDate: '-1',
            }
        }
    },
];
