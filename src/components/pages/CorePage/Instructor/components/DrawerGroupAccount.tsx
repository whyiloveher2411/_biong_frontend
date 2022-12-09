import { LoadingButton, Skeleton } from '@mui/lab';
import { Box, Button, Typography } from '@mui/material';
import Checkbox from 'components/atoms/Checkbox';
import FieldForm from 'components/atoms/fields/FieldForm';
import { useFormWrapper } from 'components/atoms/fields/FormWrapper';
import Icon from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Loading from 'components/atoms/Loading';
import Paper from 'components/atoms/Paper';
import Table from 'components/atoms/Table';
import TableBody from 'components/atoms/TableBody';
import TableCell from 'components/atoms/TableCell';
import TableContainer from 'components/atoms/TableContainer';
import TableHead from 'components/atoms/TableHead';
import { PaginationProps } from 'components/atoms/TablePagination';
import TableRow from 'components/atoms/TableRow';
import DrawerCustom from 'components/molecules/DrawerCustom';
import NoticeContent from 'components/molecules/NoticeContent';
import TableSimplte from 'components/organisms/TableSimplte';
import { dateTimeFormat } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import elearningService from 'services/elearningService';
import { GroupAccount } from 'services/elearningService/instructor/communication/groupAccount/getGroupAccount';
import { StudentProps } from 'services/elearningService/instructor/performance/students/getStudents';

export default function DrawerGroupAccount({ open, onClose, width = '1280px', onChooseGroup, groupIDs }: {
    open: boolean,
    onClose: () => void,
    width?: string,
    onChooseGroup: (groups: Array<GroupAccount>) => void,
    groupIDs?: Array<{ id: ID }>,
}
) {

    const [listGroupSelected, setListGroupSelected] = React.useState<Array<GroupAccount>>(groupIDs ? (groupIDs as Array<GroupAccount>) : []);

    const handleChoseGroupAccount = (group: GroupAccount, checked: boolean) => {
        setListGroupSelected(prev => {
            if (checked) {
                prev.push(group);
                return [...prev];
            } else {
                return prev.filter(item => (item.id + '') !== (group.id + ''));
            }
        });
    }

    React.useEffect(() => {
        setListGroupSelected(groupIDs ? (groupIDs as Array<GroupAccount>) : []);
    }, [groupIDs]);

    React.useEffect(() => {
        if (!open) {
            setListGroupSelected([]);
        }
    }, [open]);

    return (
        <DrawerCustom
            onCloseOutsite
            open={open}
            onClose={onClose}
            width={width}
            restDialogContent={{
                sx: (theme: ANY) => ({
                    backgroundColor: theme.palette.mode === 'light' ? '#f0f2f5' : 'body.background',
                    borderTop: theme.palette.mode === 'light' ? '1px solid #dedede' : 'unset',
                })
            }}
            title={
                listGroupSelected.length ? __('Đã chọn {{count}} nhóm', { count: listGroupSelected.length }) : 'Danh sách nhóm học viên'
            }
            headerAction={listGroupSelected.length ?
                <Button onClick={() => {
                    onChooseGroup(listGroupSelected);
                    onClose();
                }} variant='contained'>
                    Lưu đã chọn
                </Button>
                :
                <></>
            }
        >
            <Box sx={{ mt: 3 }}>
                {
                    open && <TableGroupAccount
                        listGroupSelected={listGroupSelected}
                        handleOnSelect={handleChoseGroupAccount}
                    />
                }
            </Box>
        </DrawerCustom>
    )
}

function TableGroupAccount({ listGroupSelected, handleOnSelect }: { listGroupSelected: Array<GroupAccount>, handleOnSelect: (group: GroupAccount, checked: boolean) => void }) {

    const [groupsAccount, setGroupsAccount] = React.useState<PaginationProps<GroupAccount> | null>(null);
    const [isLoadingButtonAddNew, setIsLoadingButtonAddNew] = React.useState(false);
    const [openDialogReviewStudent, setOpenDialogReviewStudent] = React.useState<false | ID>(false);


    const [openFormEditOrAddNew, setOpenFormEditOrAddNew] = React.useState<false | 'new' | 'edit'>(false);
    // const urlParam = useQuery({
    //     add_new_group: 0,
    //     edit_group: 0,
    // });

    const paginate = usePaginate({
        name: 'p_g_s',
        data: { current_page: 0, per_page: 10 },
        onChange: async (data) => {
            const groupsData = await elearningService.instructor.communication.groupAccount.get(data);
            setGroupsAccount(groupsData);
        },
        enableLoadFirst: true,
        isChangeUrl: false,
        pagination: groupsAccount,
    });

    const formAddNew = useFormWrapper({
        onFinish: async (data) => {
            setIsLoadingButtonAddNew(true);
            (async () => {
                const result = await elearningService.instructor.communication.groupAccount.editOrAddNew(
                    data.id ?? null,
                    data.title,
                    data.description
                );

                if (result) {
                    paginate.set({ current_page: 0, per_page: 10, loadData: true });
                }
                setIsLoadingButtonAddNew(false);

                setOpenFormEditOrAddNew(false);

                formAddNew.setPost({});
            })();
        }
    });


    return (
        <>
            {
                groupsAccount === null ?
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}></TableCell>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton><Typography> Tên nhóm</Typography></Skeleton></TableCell>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton><Typography>Mô tả</Typography></Skeleton></TableCell>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton><Typography>Thành viên</Typography></Skeleton></TableCell>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}><Skeleton><Typography>Ngày tạo</Typography></Skeleton></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    [1, 2, 3, 4, 5, 6, 7].map(item => (
                                        <TableRow key={item}>
                                            <TableCell>
                                                <Skeleton>
                                                    <Checkbox checked={false}
                                                        onChange={() => {
                                                            //
                                                        }}
                                                    />
                                                </Skeleton>
                                            </TableCell>
                                            <TableCell><Skeleton><Typography>Nhóm react 1</Typography></Skeleton></TableCell>
                                            <TableCell><Skeleton><Typography>Nhóm react khóa 12 ngày bắt đầu 21/12/2022</Typography></Skeleton></TableCell>
                                            <TableCell><Skeleton><Typography>21 thành viên</Typography></Skeleton></TableCell>
                                            <TableCell><Skeleton><Typography>25-12-2022 12:21:11</Typography></Skeleton></TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    :
                    groupsAccount.total === 0 ?
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
                                    onClick={() => {
                                        //
                                    }}
                                    startIcon={<Icon icon="AddRounded" />}
                                >
                                    Tạo thông báo
                                </Button>
                            </Box>
                        </NoticeContent>
                        :
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    mb: 2,
                                }}
                            >
                                <Button startIcon={<Icon icon="AddRounded" />} onClick={() => setOpenFormEditOrAddNew('new')} variant='contained'>Thêm nhóm mới</Button>
                            </Box>
                            <Box sx={{ position: 'relative' }}>
                                {
                                    paginate.isLoading &&
                                    <Loading open={true} isCover />
                                }
                                <TableContainer component={Paper} >
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding='checkbox' sx={{ whiteSpace: 'nowrap' }}></TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Tên nhóm</TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Mô tả</TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Thành viên</TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>Ngày tạo</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                groupsAccount.data.map(item => (
                                                    <TableRow key={item.id}>
                                                        <TableCell padding='checkbox'>
                                                            <Checkbox checked={listGroupSelected.findIndex(itemSelected => (itemSelected.id + '') === (item.id + '')) > -1}
                                                                onChange={(_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                                                    handleOnSelect(item, checked);
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{item.title}</TableCell>
                                                        <TableCell>{item.description}</TableCell>
                                                        <TableCell>{item.count} thành viên {
                                                            item.count ?
                                                                <IconButton onClick={() => setOpenDialogReviewStudent(item.id)}>
                                                                    <Icon icon="VisibilityOutlined" />
                                                                </IconButton>
                                                                :
                                                                <></>
                                                        }</TableCell>
                                                        <TableCell>{dateTimeFormat(item.created_at)}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                onClick={() => {
                                                                    setOpenFormEditOrAddNew('edit');
                                                                    formAddNew.setPost(prev => ({
                                                                        ...prev,
                                                                        id: item.id,
                                                                        title: item.title,
                                                                        description: item.description,
                                                                    }))
                                                                }}
                                                                variant='outlined' color='inherit'>Chỉnh sửa</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </>
            }
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                {paginate.component}
            </Box>
            <DrawerCustom
                onCloseOutsite
                open={openFormEditOrAddNew !== false}
                onClose={() => setOpenFormEditOrAddNew(false)}
                width='700px'
                title={openFormEditOrAddNew === 'new' ? "Thêm nhóm mới" : 'Chỉnh sửa nhóm'}
                headerAction={<>
                    <LoadingButton loading={isLoadingButtonAddNew} onClick={() => {
                        formAddNew.onSubmit();
                    }} variant='contained'>
                        {
                            openFormEditOrAddNew === 'new' ? 'Thêm mới' : 'Chỉnh sửa'
                        }
                    </LoadingButton>
                </>
                }
            >
                <Box
                    sx={{
                        mt: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    {
                        formAddNew.renderFormWrapper(<><FieldForm
                            component='text'
                            config={{
                                title: 'Tiêu đề',
                                rules: {
                                    require: true,
                                    minLength: 10,
                                    maxLength: 60,
                                }
                            }}
                            name="title"
                        />
                            <FieldForm
                                component='textarea'
                                config={{
                                    title: 'Mô tả',
                                    rules: {
                                        require: true,
                                        minLength: 10,
                                        maxLength: 255,
                                    }
                                }}
                                name="description"
                            />
                        </>
                        )
                    }
                </Box>
            </DrawerCustom>

            <DrawerCustom
                onCloseOutsite
                open={openDialogReviewStudent !== false}
                onClose={() => setOpenDialogReviewStudent(false)}
                width='700px'
                restDialogContent={{
                    sx: (theme: ANY) => ({
                        backgroundColor: theme.palette.mode === 'light' ? '#f0f2f5' : 'body.background',
                        borderTop: theme.palette.mode === 'light' ? '1px solid #dedede' : 'unset',
                    })
                }}
                title={'Thành viên nhóm ' + groupsAccount?.data.find(item => (item.id + '') === (openDialogReviewStudent + ''))?.title}
            >
                <Box
                    sx={{
                        mt: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    {
                        openDialogReviewStudent !== false &&
                        <TableUserOfGroup groupID={openDialogReviewStudent ?? 0} />
                    }
                </Box>
            </DrawerCustom>
        </>
    )

}

function TableUserOfGroup({ groupID }: { groupID: ID }) {

    const [students, setStudents] = React.useState<PaginationProps<StudentProps> | null>(null);

    const paginate = usePaginate({
        name: 'i_qa',
        data: { current_page: 0, per_page: 10 },
        enableLoadFirst: true,
        onChange: async (data) => {
            const studentsData = await elearningService.instructor.communication.groupAccount.getStudent(groupID, data);
            setStudents(studentsData);
        },
        isChangeUrl: false,
        pagination: students,
    });

    if (!students) {
        return <TableSimplte
            columns={[<Skeleton><Typography>Họ và tên</Typography></Skeleton>, <Skeleton><Typography>Email</Typography></Skeleton>]}
            items={[1, 2, 3, 4, 5, 6]}
            render={(item) => <TableRow key={item}>
                <TableCell>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <Skeleton variant='circular' sx={{
                            width: 54,
                            height: 54,
                        }} />
                        <Skeleton><Typography>Đặng Thuyền Quân</Typography></Skeleton>
                    </Box>
                </TableCell>
                <TableCell>
                    <Skeleton><Typography>Đặng Thuyền Quân</Typography></Skeleton>
                </TableCell>
            </TableRow>}
        />
    }

    return (<>
        <TableSimplte
            columns={['Họ và tên', 'Email']}
            items={students.data}
            render={(item) => <TableRow key={item.id}>
                <TableCell>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <ImageLazyLoading
                            src={getImageUrl(item.avatar, '/images/user-default.svg')}
                            sx={{
                                width: 54,
                                height: 54,
                                borderRadius: '50%',
                                flexShrink: 0,
                            }} />
                        <Typography>{item.full_name}</Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    {item.email}
                </TableCell>
            </TableRow>}
        />
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
            }}
        >
            {paginate.component}
        </Box>
    </>
    );
}