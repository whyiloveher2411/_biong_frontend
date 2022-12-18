import { LoadingButton } from '@mui/lab';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Skeleton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from 'components/atoms/Chip';
import FieldForm from 'components/atoms/fields/FieldForm';
import { useFormWrapper } from 'components/atoms/fields/FormWrapper';
import Icon from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import Loading from 'components/atoms/Loading';
import MoreButton from 'components/atoms/MoreButton';
import { PaginationProps } from 'components/atoms/TablePagination';
import Tooltip from 'components/atoms/Tooltip';
import Dialog from 'components/molecules/Dialog';
import DrawerCustom from 'components/molecules/DrawerCustom';
import NoticeContent from 'components/molecules/NoticeContent';
import NotificationType from 'components/pages/CorePage/User/components/NotificationType';
import { dateTimeFormat, dateTimefromNow } from 'helpers/date';
import { __ } from 'helpers/i18n';
import usePaginate from 'hook/usePaginate';
import useQuery from 'hook/useQuery';
import moment from 'moment';
import React from 'react';
import { CourseProps } from 'services/courseService';
import elearningService from 'services/elearningService';
import { Announcement } from 'services/elearningService/instructor/communication/announcements/getAnnouncements';
import { GroupAccount } from 'services/elearningService/instructor/communication/groupAccount/getGroupAccount';
import { useUser } from 'store/user/user.reducers';
import DrawerGroupAccount from '../../components/DrawerGroupAccount';



function Reviews({ setTitle }: { setTitle: (title: string) => void }) {

    const urlParam = useQuery({
        course: 0,
        review: 0,
        unread: 1,
        noAnswer: 0,
        noMyAnser: 0,
        serach: '',
        time: 1,
        form_add_an: 0,
    });

    const [, setSearch] = React.useState('');

    const [openDialogChooseGroup, setOpenDialogChooseGroup] = React.useState(false);

    const user = useUser();

    const [buttonsLoading, setButtonsLoading] = React.useState<{ [key: ID]: boolean }>({});

    const [preview, setPreview] = React.useState<Announcement | null>(null);

    const [courses, setCourses] = React.useState<CourseProps[] | null>(null);

    const [reviews, setReviews] = React.useState<PaginationProps<Announcement> | null>(null);

    const [reviewCurrent, setReviewCurrent] = React.useState<Announcement | null>(null);

    const paginate = usePaginate({
        name: 'i_qa',
        data: { current_page: 0, per_page: 10 },
        enableLoadFirst: true,
        onChange: async (data) => {
            const reviewsData = await elearningService.instructor.communication.announcement.get(urlParam.query.course, data, {
                noAnswer: (urlParam.query.noAnswer + '') === '1',
                unread: (urlParam.query.unread + '') === '1',
                noMyAnser: (urlParam.query.noMyAnser + '') === '1',
                serach: urlParam.query.serach + '',
            }, timeRange[Number(urlParam.query.time)] ? {
                ...(timeRange[Number(urlParam.query.time)].range()),
            } : {
                ...(timeRange[1].range()),
            });
            setReviews(reviewsData);

            if (reviewsData?.data.length && !reviewCurrent) {

                let findIndex = 0;

                if (urlParam.query.review) {
                    findIndex = reviewsData?.data.findIndex(item => (item.id + '') === (urlParam.query.review + ''));
                }

                if (findIndex < 0) {
                    findIndex = 0;
                }

                urlParam.changeQuery({
                    review: reviewsData?.data[findIndex].id
                });
                setReviewCurrent(reviewsData?.data[findIndex]);
            }

        },
        isChangeUrl: true,
        pagination: reviews,
    });

    React.useEffect(() => {

        if (reviews && reviews.data.length) {
            if (Number(urlParam.query.form_add_an)) {
                const indexreview = reviews.data.findIndex(item => (item.id + '') === (urlParam.query.form_add_an + ''));

                if (indexreview > -1) {
                    setReviewCurrent(reviews.data[indexreview]);
                }
            }
        }

    }, [urlParam.query.form_add_an]);


    React.useEffect(() => {
        (async () => {
            const coursesData = await elearningService.instructor.course.getAll();
            setCourses(coursesData);
        })();

        // paginate.set({
        //     current_page: 0,
        //     per_page: 10,
        //     loadData: true,
        // });

        setTitle('Thông báo');
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

    const handleCreateNotification = (id: ID) => () => {

        setButtonsLoading(prev => ({
            ...prev,
            [id]: true,
        }));

        (async () => {
            await elearningService.instructor.communication.announcement.createNotification(id);
            setButtonsLoading(prev => ({
                ...prev,
                [id]: false,
            }));
            paginate.set(prev => ({
                ...prev,
                loadData: true,
            }));
        })();
    }

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

    const formAddNew = useFormWrapper({
        postDefault: {
            title: '',
            message: '',
            accounts: [],
            group_account: [],
        },
        onFinish: async (data) => {
            const result = await elearningService.instructor.communication.announcement.addNew(
                data.title,
                data.message,
                data.link_redirect,
                data.announcement_type,
                data.accounts,
                data.group_account,
                data.is_important,
                data.id
            );

            if (result) {
                paginate.set({
                    current_page: paginate.data.current_page,
                    per_page: paginate.data.per_page,
                    loadData: true,
                });

                formAddNew.setPost({
                    title: '',
                    message: '',
                    accounts: [],
                    group_account: [],
                });
                urlParam.changeQuery({ form_add_an: 0 });
            }
        }
    });

    React.useEffect(() => {

        if (reviews?.data.length && urlParam.query.form_add_an) {

            const index = reviews?.data.findIndex(item => (item.id + '') === (urlParam.query.form_add_an + ''));

            if (index > -1) {

                const item = reviews?.data[index];

                let accounts: string[] = [];
                let group_account: string[] = [];

                try {
                    if (item.send_student_course) {
                        let accountsDB = JSON.parse(item.send_student_course);

                        if (Array.isArray(accountsDB)) {
                            accountsDB.forEach(acc => {
                                if (item.id) {
                                    accounts.push(acc.id);
                                }
                            })
                        }
                    }
                } catch (error) {
                    accounts = [];
                }

                try {
                    if (item.group_account) {
                        let groupDB = JSON.parse(item.group_account);

                        if (Array.isArray(groupDB)) {
                            groupDB.forEach(acc => {
                                if (item.id) {
                                    group_account.push(acc);
                                }
                            })
                        }
                    }
                } catch (error) {
                    group_account = [];
                }

                formAddNew.setPost({
                    _type: 'edit',
                    id: item.id,
                    title: item.title,
                    message: item.message,
                    is_important: item.is_important,
                    link_redirect: item.link_redirect,
                    announcement_type: item.announcement_type,
                    accounts: accounts,
                    group_account: group_account,
                });
            } else {
                formAddNew.setPost({
                    _type: 'new',
                    title: '',
                    message: '',
                    accounts: [],
                    group_account: [],
                });
            }
        }

    }, [urlParam.query.form_add_an, reviews])

    return (<>
        <Typography variant='h2' sx={{
            mb: 4, display: 'flex',
            alignItems: 'center',
            '& .MoreButton-root': {
                display: 'flex',
            }
        }}>
            Thông báo
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
        {
            Boolean(reviews && reviews.total) &&
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                }}
            >
                <Box>

                    <Button variant='contained' onClick={() => urlParam.changeQuery({ form_add_an: 'add' })} startIcon={<Icon icon="AddRounded" />}>Tạo thông báo</Button>
                </Box>
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
        }
        {
            reviews ?
                reviews.total ?
                    <>
                        <Box sx={{ position: 'relative' }}>
                            {
                                paginate.isLoading &&
                                <Loading open={true} isCover />
                            }
                            <TableContainer component={Paper} >
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{__('Ngày tạo thông báo')}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{__('Tiêu đề')}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{__('Thông báo quan trọng')}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{__('Đối tượng nhận thông báo')}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                <Typography>Số lượng</Typography>
                                                <Typography variant='body2'>Thông báo đã tạo</Typography>
                                            </TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{__('Trạng thái')}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{__('Hành động')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            reviews?.data.map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                        <Tooltip title={dateTimeFormat(item.created_at)}>
                                                            <Typography>
                                                                {dateTimefromNow(item.created_at)}
                                                            </Typography>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: 300 }}>
                                                        <Tooltip title={item.title}>
                                                            <Typography noWrap>
                                                                {item.title}
                                                            </Typography>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                        {
                                                            // Boolean(item.sender) &&
                                                            // <Box
                                                            //     sx={{
                                                            //         display: 'flex',
                                                            //         alignItems: 'center',
                                                            //         gap: 1,
                                                            //     }}
                                                            // >
                                                            //     <ImageLazyLoading
                                                            //         src={getImageUrl(item.sender?.avatar ?? '', '/images/user-default.svg')}
                                                            //         sx={{
                                                            //             width: 54,
                                                            //             height: 54,
                                                            //             borderRadius: '50%',
                                                            //             flexShrink: 0,
                                                            //         }} />
                                                            //     <Typography>{item.sender?.full_name}</Typography>
                                                            // </Box>
                                                        }
                                                        {
                                                            Boolean(item.is_important) &&
                                                            <Icon icon="CheckCircleOutlineRounded" sx={{ color: 'success.main' }} />
                                                        }
                                                    </TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.account_count ?? 0} tài khoản
                                                        {
                                                            item.account_count ?
                                                                <IconButton onClick={() => {
                                                                    //
                                                                }}>
                                                                    <Icon icon="VisibilityOutlined" />
                                                                </IconButton>
                                                                :
                                                                <></>
                                                        }
                                                    </TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                        {item.notification_count ?? 0}
                                                    </TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{statusText[item.status_current] ?? item.status_current}</TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', minWidth: 200 }}>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                flexWrap: 'wrap',
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Box>
                                                                <Button onClick={() => {
                                                                    setPreview(item);
                                                                }} variant='outlined' color='inherit'>
                                                                    Preview
                                                                </Button>
                                                            </Box>
                                                            {
                                                                item.status_current === 'new' &&
                                                                <>
                                                                    <Button
                                                                        variant='outlined'
                                                                        color='inherit'
                                                                        onClick={() => {
                                                                            urlParam.changeQuery({ form_add_an: item.id });
                                                                        }}
                                                                    >
                                                                        Chỉnh sửa
                                                                    </Button>
                                                                    <LoadingButton loading={buttonsLoading[item.id] ?? false} onClick={handleCreateNotification(item.id)} variant='outlined' color="inherit">
                                                                        Gửi thông báo
                                                                    </LoadingButton>
                                                                </>
                                                            }
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            {paginate.component}
                        </Box>
                    </>
                    :
                    <NoticeContent
                        image='/images/undraw_no_data_qbuo.svg'
                        title='Không tìm thấy thông báo'
                        description='Bạn không có yêu cầu thông báo nào đến học viên của bạn'
                        disableButtonHome
                    >
                        <Box
                            sx={{
                                textAlign: 'center',
                                mt: 3,
                            }}
                        >
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => urlParam.changeQuery({ form_add_an: 'add' })}
                                startIcon={<Icon icon="AddRounded" />}
                            >
                                Tạo thông báo
                            </Button>
                        </Box>
                    </NoticeContent>
                :
                <>
                    <TableContainer component={Paper} >
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton /></TableCell>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton /></TableCell>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton /></TableCell>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton /></TableCell>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton /></TableCell>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton /></TableCell>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton /></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    [1, 2, 3, 4, 5, 6, 7].map(item => (
                                        <TableRow key={item}>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton ><Typography>2022-12-05 21:30:47</Typography></Skeleton></TableCell>
                                            <TableCell><Skeleton ><Typography>Gửi thông báo bài mới	</Typography></Skeleton></TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton ><Typography>dangthuyenquan</Typography></Skeleton></TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton ><Typography>Nhóm riêng 2 tài khoản</Typography></Skeleton></TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton ><Typography>2</Typography></Skeleton></TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton ><Typography>Đã tạo xong</Typography></Skeleton></TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                <Skeleton >
                                                    <Button variant='outlined' color="inherit">
                                                        Chi tiết
                                                    </Button>
                                                </Skeleton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>

        }

        <Dialog
            open={preview !== null}
            onClose={() => {
                setPreview(null);
            }}
            title="Xem trước"
        >
            <NotificationType
                handleClickNotification={async () => {
                    //
                }}
                notification={{
                    id: 0,
                    sender: user,
                    receiver: user,
                    notification_type: 'FromTeacher',
                    message: preview?.message ?? '',
                    addin_data: {
                        announcement_type: preview?.announcement_type ?? '',
                    },
                    created_at: preview?.created_at ?? '',
                    is_read: 0,
                    sender_detail: '',
                    courses: '',
                    courses_object: null,
                    sender_object: {
                        id: user.id,
                        avatar: user.avatar,
                        slug: user.slug,
                        title: user.full_name
                    },
                }}
            />
        </Dialog>

        <DrawerGroupAccount
            open={openDialogChooseGroup}
            onClose={() => setOpenDialogChooseGroup(false)}
            width='1200px'
            onChooseGroup={(groups) => {
                formAddNew.setPost(prev => {

                    groups.forEach(group => {

                        if (!Array.isArray(prev.group_account)) {
                            prev.group_account = [];
                        }

                        const index = (prev.group_account as Array<GroupAccount>).findIndex(item => (item.id + '') === (group.id + ''));

                        if (index === -1) {
                            (prev.group_account as Array<GroupAccount>).push(group);
                        }
                    });

                    return { ...prev }
                });
            }}
        />

        <DrawerCustom
            onCloseOutsite
            open={Boolean(Number(urlParam.query.form_add_an)) || urlParam.query.form_add_an === 'add'}
            onClose={() => urlParam.changeQuery({ form_add_an: 0 })}
            width='1300px'
            title="Thiết lập dữ liệu gửi thông báo"
            headerAction={<>
                <LoadingButton loading={formAddNew.isLoading} onClick={() => formAddNew.onSubmit()} variant='contained'>
                    {formAddNew.post._type === 'edit' ? 'Chỉnh sửa yêu cầu gửi thông báo' : 'Tạo yêu cầu gửi thông báo'}
                </LoadingButton>
            </>
            }
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 3,
                    mt: 3,
                }}
            >
                <Box
                    sx={{
                        width: '100%'
                    }}
                >
                    {
                        formAddNew.renderFormWrapper(<>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 3,
                                    flexDirection: 'column',
                                }}
                            >

                                <FieldForm
                                    component='text'
                                    config={{
                                        title: 'Tiêu đề',
                                        note: 'Mục địch thông báo này là gì?',
                                        rules: {
                                            require: true,
                                            minLength: 10,
                                            maxLength: 160,
                                        }
                                    }}
                                    name="title"
                                />
                                <FieldForm
                                    component='editor'
                                    config={{
                                        title: 'Nội dung',
                                        note: '',
                                        rules: {
                                            require: true,
                                            minLength: 10,
                                            maxLength: 500,
                                        },
                                        inputProps: {
                                            height: 300,
                                            placeholder: __('Viết một cái gì đó tuyệt vời ...'),
                                            menubar: false,
                                        },
                                    }}
                                    name="message"
                                />
                                <Box>
                                    <Button
                                        variant='contained'
                                        onClick={() => {
                                            setPreview({
                                                id: 0,
                                                account_count: 0,
                                                created_at: moment().format(),
                                                is_important: 1,
                                                message: formAddNew.post.message,
                                                title: '',
                                                sender: user,
                                                notification_count: 0,
                                                status_current: 'new',
                                                announcement_type: formAddNew.post.announcement_type,
                                                link_redirect: formAddNew.post.link_redirect,
                                            });
                                        }}
                                    >
                                        Preview
                                    </Button>
                                </Box>

                                <FieldForm
                                    component='text'
                                    config={{
                                        title: 'Link Chuyển hướng',
                                        placeholder: 'Link Chuyển hướng (Chấp nhận link nội bộ website VD: /course)',
                                        note: 'Chuyển hướng đến URL này khi nhấp vào thông báo',
                                        rules: {
                                            require: true,
                                        },
                                    }}
                                    name="link_redirect"
                                />

                                <FieldForm
                                    component='select'
                                    config={{
                                        title: 'Loại thông báo',
                                        list_option: {
                                            NotificationsNoneRounded: { title: 'Thông báo' },
                                            CommentOutlined: { title: 'Thảo luận' },
                                            AccessTimeRounded: { title: 'Nhắc nhở thời gian' },
                                            VisibilityOutlined: { title: 'Nhắc nhở xem trước' },
                                            QuizOutlined: { title: 'Nhắc nhở bài tập' },
                                            InfoOutlined: { title: 'Thông tin' },
                                            WarningAmberOutlined: { title: 'Cảnh báo' },
                                        },
                                        rules: {
                                            require: true,
                                        },
                                        note: 'Loại thông báo khác nhau sẽ cho icon cũng như mục đích thông báo khác nhau.'
                                    }}
                                    name="announcement_type"
                                />

                                <FieldForm
                                    component='true_false'
                                    config={{
                                        title: 'Đây là thông báo quan trọng',
                                        note: 'Các thông báo quan trọng sẽ được hiển thị thành dialog giữa màng hình khi đăng nhập',
                                    }}
                                    name="is_important"
                                />
                            </Box>
                        </>)
                    }
                </Box>
                <Box
                    sx={{
                        width: 500,
                        flexShrink: 0,
                    }}
                >
                    <Typography sx={{ mb: 3, }} variant='h4'>Chọn các tài khoản nhận thông báo</Typography>
                    {
                        courses?.map(course => (
                            <Box key={course.id}>
                                <FormControlLabel
                                    label={'Học viên khóa ' + course.title}
                                    control={
                                        <Checkbox
                                            checked={(formAddNew.post.accounts as string[])?.findIndex(item => (item + '') === (course.id + '')) > -1}
                                            onChange={() => {

                                                formAddNew.setPost(prev => {

                                                    const index = (prev.accounts as string[])?.findIndex(item => (item + '') === (course.id + ''));

                                                    if (index > - 1) {
                                                        return {
                                                            ...prev,
                                                            accounts: (prev.accounts as string[]).filter(item => (item + '') !== (course.id + ''))
                                                        };
                                                    } else {
                                                        if (!Array.isArray(prev.accounts)) {
                                                            prev.accounts = [];
                                                        }

                                                        (prev.accounts as string[]).push(course.id);
                                                        return {
                                                            ...prev,
                                                        };
                                                    }
                                                });
                                            }}
                                        />
                                    }
                                />
                            </Box>
                        ))
                    }

                    <Typography sx={{ mt: 3, }} variant='h4'>Chọn theo <Button onClick={() => setOpenDialogChooseGroup(true)} variant='outlined'>Nhóm tài khoản</Button></Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                            mt: 1,
                        }}
                    >
                        {
                            Array.isArray(formAddNew.post.group_account) &&
                            formAddNew.post.group_account.map((item: GroupAccount) => (
                                <Chip
                                    key={item.id}
                                    onDelete={() => {
                                        formAddNew.setPost(prev => ({
                                            ...prev,
                                            group_account: (prev.group_account as Array<GroupAccount>).filter(g => (g.id + '') !== (item.id + ''))
                                        }))
                                    }}
                                    label={item.title}
                                />
                            ))
                        }
                    </Box>
                </Box>
            </Box>
        </DrawerCustom>
    </>)
}

export default Reviews

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

const statusText = {
    new: 'Mới',
    progress: 'Trong tiến trình',
    done: 'Hoàn thành',
}