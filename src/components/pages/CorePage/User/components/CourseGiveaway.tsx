import { LoadingButton } from '@mui/lab';
import Alert from 'components/atoms/Alert';
import Box from '@mui/material/Box/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table/Table';
import { default as LinkMui } from '@mui/material/Link';
import TableBody from '@mui/material/TableBody/TableBody';
import TableCell from '@mui/material/TableCell/TableCell';
import TableContainer from '@mui/material/TableContainer/TableContainer';
import TableHead from '@mui/material/TableHead/TableHead';
import TableRow from '@mui/material/TableRow/TableRow';
import Checkbox from 'components/atoms/Checkbox';
import FieldForm from 'components/atoms/fields/FieldForm';
import { useFormWrapper } from 'components/atoms/fields/FormWrapper';
import FormControlLabel from 'components/atoms/FormControlLabel';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { PaginationProps } from 'components/atoms/TablePagination';
import Typography from 'components/atoms/Typography';
import Dialog from 'components/molecules/Dialog';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import courseService, { CourseGiveawayProps, GiveawayItem } from 'services/courseService';
import { RootState } from 'store/configureStore';
import { UserProps } from 'store/user/user.reducers';
import { dateTimeFormat } from 'helpers/date';
import Loading from 'components/atoms/Loading';

function CourseGiveaway({ user }: {
    user: UserProps
}) {

    const myAccount = useSelector((state: RootState) => state.user);

    const [openDialogGiveaway, setOpenDialogGiveaway] = React.useState(false);

    const [courseMaybeGiveaway, setCourseMaybeGiveaway] = React.useState<CourseGiveawayProps[] | null>(null);

    const [giveawayItems, setGiveawayItems] = React.useState<PaginationProps<GiveawayItem> | null>(null)

    const paginate = usePaginate<GiveawayItem>({
        template: 'page',
        name: 'ex',
        enableLoadFirst: true,
        onChange: async (data) => {
            const course = await courseService.me.giveaway.getCourseMaybeGiveaway({
                current_page: data.current_page,
                per_page: data.per_page,
            });

            setCourseMaybeGiveaway(course?.courses ?? null);
            setGiveawayItems(course?.giveaway ?? null);
        },
        pagination: giveawayItems,
        rowsPerPageOptions: [10, 20, 50, 100],
        data: {
            current_page: 1,
            per_page: 10
        }
    });

    const formGiveaway = useFormWrapper({
        onFinish: async (postData) => {

            if (!postData.courseID || !Object.keys(postData.courseID).filter(id => postData.courseID[id]).length) {
                window.showMessage(__('Vui lòng chọn khóa học bạn muốn tặng'));
                return;
            }

            const result = await courseService.me.giveaway.postGiveaway(
                postData.email,
                Object.keys(postData.courseID).filter(id => postData.courseID[id]),
            );

            if (result) {
                window.showMessage(__('Gửi tặng khóa học thành công'), 'success')
                handleOnloadCourses()
                setOpenDialogGiveaway(false);
            }
        }
    })

    const handleOnloadCourses = async () => {
        const course = await courseService.me.giveaway.getCourseMaybeGiveaway({
            current_page: paginate.data.current_page,
            per_page: paginate.data.per_page,
        });

        setCourseMaybeGiveaway(course?.courses ?? null);
        setGiveawayItems(course?.giveaway ?? null);
    }

    if (myAccount && user && (myAccount.id + '') === (user.id + '')) {
        return (
            <Box>
                <Button onClick={() => {
                    formGiveaway.setPost(prev => ({
                        email: prev.email ?? '',
                    }));
                    setOpenDialogGiveaway(true)
                }} sx={{ mb: 4 }} variant='outlined' color='inherit'>{__('Gửi tặng khóa học')}</Button>
                {
                    giveawayItems === null ?
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{__('Địa chỉ email')}</TableCell>
                                        <TableCell>{__('Khóa học')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        [...Array(10)].map((_i, index) => <TableRow key={index}>
                                            <TableCell sx={{ width: 400 }}>
                                                <Skeleton variant='rectangular' sx={{ width: '100%', height: 32, maxWidth: 'unset' }}>
                                                    <Typography>
                                                        Lorem ipsum dolor
                                                    </Typography>
                                                </Skeleton>
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Skeleton variant='rectangular' sx={{ width: '33%', height: 32 }} />
                                                    <Skeleton variant='rectangular' sx={{ width: '33%', height: 32 }} />
                                                    <Skeleton variant='rectangular' sx={{ width: '33%', height: 32 }} />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        :
                        <Box
                            sx={{ position: 'relative' }}
                        >
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{__('Địa chỉ email')}</TableCell>
                                            <TableCell>{__('Khóa học')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            (() => {
                                                if (giveawayItems.total) {
                                                    return giveawayItems.data.map(((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell sx={{
                                                                verticalAlign: 'top',
                                                                height: 91.94,
                                                            }}

                                                            >
                                                                <Typography
                                                                    color='primary'
                                                                    sx={{
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={() => {
                                                                        formGiveaway.setPost({
                                                                            email: item.title
                                                                        });
                                                                        setOpenDialogGiveaway(true);
                                                                    }}
                                                                >
                                                                    {item.title}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    Boolean(item.course) &&
                                                                    item.course.map(course => (
                                                                        <Box
                                                                            key={course.id}
                                                                            sx={{
                                                                                display: 'flex',
                                                                                gap: 1,
                                                                                justifyContent: 'space-between',
                                                                            }}
                                                                        >
                                                                            <Box
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    gap: 1,
                                                                                }}
                                                                                component={LinkMui}
                                                                                href={'/course/' + course.slug}
                                                                                target="_blank"
                                                                            >
                                                                                <Box
                                                                                    sx={{
                                                                                        border: '1px solid',
                                                                                        borderColor: 'dividerDark',
                                                                                        borderRadius: 1,
                                                                                    }}
                                                                                >
                                                                                    <ImageLazyLoading
                                                                                        src={getImageUrl(course.featured_image)}
                                                                                        sx={{
                                                                                            width: 100,
                                                                                            height: 'auto',
                                                                                        }}
                                                                                    />
                                                                                </Box>
                                                                                <Typography>{course.title}</Typography>
                                                                            </Box>
                                                                            {
                                                                                Boolean(item.date_gift_json) &&
                                                                                <Typography>{dateTimeFormat(item.date_gift_json?.[course.id as ID] ?? '')}</Typography>
                                                                            }
                                                                        </Box>
                                                                    ))
                                                                }
                                                            </TableCell>
                                                        </TableRow>

                                                    )))
                                                }

                                                return <TableRow>
                                                    <TableCell colSpan={2}>
                                                        <Typography sx={{ pt: 6, pb: 6 }} align='center' variant='h3'>{__('Bạn vẫn chưa tặng khóa học cho người khác.')}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            })()
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Loading open={paginate.isLoading} isCover />
                        </Box>
                }
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 1,
                    }}
                >
                    {
                        paginate.component
                    }
                </Box>
                <Dialog
                    title={__('Gửi tặng khóa học')}
                    open={openDialogGiveaway}
                    onClose={() => {
                        setOpenDialogGiveaway(false);
                        formGiveaway.setPost(prev => ({
                            email: prev.email ?? '',
                        }))
                    }}
                    action={<>
                        <Button
                            onClick={() => {
                                setOpenDialogGiveaway(false);
                                formGiveaway.setPost(prev => ({
                                    email: prev.email ?? '',
                                }))
                            }
                            } color='inherit'>{__('Hủy bỏ')}</Button>
                        {
                            Boolean(courseMaybeGiveaway?.length) &&
                            <LoadingButton
                                loadingPosition='center'
                                loading={formGiveaway.isLoading}
                                variant='contained'
                                onClick={() => {
                                    formGiveaway.onSubmit();
                                }}
                            >{__('Gửi tặng')}</LoadingButton>
                        }
                    </>}
                >
                    <Box>
                        {
                            Boolean(courseMaybeGiveaway?.length) &&
                            formGiveaway.renderFormWrapper(
                                <FieldForm
                                    component='email'
                                    config={{
                                        title: __('Email'),
                                        rules: {
                                            require: true,
                                            isEmail: true,
                                        },
                                        note: __('Bạn cần nhập chính xác địa chỉ email người nhận.')
                                    }}
                                    name="email"
                                />
                            )
                        }

                        <Box
                            sx={{
                                mt: courseMaybeGiveaway?.length ? 2 : 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                        >
                            {
                                courseMaybeGiveaway?.length ?
                                    <>
                                        <Box
                                            sx={{ textAlign: 'right' }}
                                        >
                                            Số lượng còn lại
                                        </Box>
                                        {
                                            courseMaybeGiveaway.map((course) => (
                                                <FormControlLabel key={course.id} sx={{
                                                    '& .MuiFormControlLabel-label': {
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        gap: 1,
                                                        width: '100%',
                                                    }
                                                }}
                                                    control={<Checkbox value={formGiveaway.post.courseID?.[course.id] ? true : false} onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                                        formGiveaway.setPost(prev => ({
                                                            ...prev,
                                                            courseID: {
                                                                ...prev.courseID,
                                                                [course.id]: checked,
                                                            }
                                                        }))
                                                    }} />}
                                                    label={<>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                gap: 1,
                                                                alignItems: 'center',
                                                            }}
                                                        >

                                                            <Box
                                                                sx={{
                                                                    border: '1px solid',
                                                                    borderColor: 'dividerDark',
                                                                    borderRadius: 1,
                                                                }}
                                                            >
                                                                <ImageLazyLoading
                                                                    src={getImageUrl(course.featured_image, '/images/user-default.svg')}
                                                                    sx={{
                                                                        width: 100,
                                                                        height: 'auto',
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Typography sx={{
                                                                userSelect: 'none',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }} component='span' >{course.title}</Typography>
                                                        </Box>
                                                        <Typography
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            {course.number_giveaway}
                                                        </Typography>
                                                    </>} />
                                            ))
                                        }
                                        <Alert color='warning' sx={{ fontSize: 16 }}>
                                            <Typography>{__('Các khóa học người dùng đã đăng ký sẽ được tự động loại bỏ.')}</Typography>
                                            <Typography>{__('Bạn không thể lấy lại khi đã tặng khóa học cho người khác.')}</Typography>
                                        </Alert>
                                    </>
                                    :
                                    <Typography component='span' >{__('Bạn cần mua khóa học trước khi có thể tặng khóa học cho người khác.')} <Box component={Link} to="/" sx={{ color: 'primary.main' }}>{__('Mua khóa học ngay')}</Box></Typography>
                            }
                        </Box>

                    </Box>
                </Dialog >
            </Box >
        )
    }

    return <Navigate to={'/user/' + user.slug} />;

}

export default CourseGiveaway