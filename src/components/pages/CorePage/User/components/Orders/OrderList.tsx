import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Icon from 'components/atoms/Icon';
import Label from 'components/atoms/Label';
import Loading from 'components/atoms/Loading';
import { PaginationProps } from 'components/atoms/TablePagination';
import NoticeContent from 'components/molecules/NoticeContent';
import { dateFormat } from 'helpers/date';
import { __ } from 'helpers/i18n';
import usePaginate from 'hook/usePaginate';
import { moneyFormat } from 'plugins/Vn4Ecommerce/helpers/Money';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import eCommerceService, { OrderProps } from 'services/eCommerceService';
import { RootState } from 'store/configureStore';
import { UserProps } from 'store/user/user.reducers';

function OrdersList({ user }: {
    user: UserProps
}) {

    const myAccount = useSelector((state: RootState) => state.user);

    const [data, setData] = React.useState<{
        orders: PaginationProps<OrderProps> | null,
        status: {
            list_option: {
                [key: string]: {
                    title: string,
                    color: string
                }
            }
        }
    }>({
        orders: null,
        status: {
            list_option: {},
        }
    });

    const [showAllCourses, setShowAllCourses] = React.useState<{ [key: ID]: boolean }>({});

    const paginate = usePaginate<OrderProps>({
        name: 'order',
        template: 'page',
        isChangeUrl: true,
        enableLoadFirst: true,
        onChange: async (data) => {
            if (myAccount && user && (myAccount.id + '') === (user.id + '')) {
                const ordersApi = await eCommerceService.getOrderOfMe({
                    current_page: data.current_page,
                    per_page: data.per_page,
                });

                setData(ordersApi);
            }
        },
        pagination: data.orders,
        data: {
            current_page: 0,
            per_page: 10
        }
    });

    if (myAccount && user && (myAccount.id + '') === (user.id + '')) {

        if (data.orders?.data) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        position: 'relative',
                        flexDirection: 'column',
                        gap: 4,
                    }}
                >
                    <Loading open={paginate.isLoading} isCover />
                    {
                        data.orders.data.length ?
                            <>
                                <TableContainer>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell sx={{ width: 250 }}></TableCell>
                                                <TableCell>{__('Ngày')}</TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{__('Tổng giá')}</TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{__('Hình thức thanh toán')}</TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{__('Trạng thái')}</TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{__('Ghi chú')}</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.orders.data.filter(order => order.products?.items?.length).map((order, index) => (
                                                    <React.Fragment
                                                        key={index}
                                                    >
                                                        <TableRow key={order.id}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell><Icon icon="ShoppingCartOutlined" /></TableCell>
                                                            <TableCell sx={{ height: 81 }}>
                                                                {
                                                                    order.products?.items && order.products?.items?.length <= 1 ?
                                                                        order.products?.items?.map(product => (
                                                                            <Typography key={product.id}>{product.title} {product.order_quantity > 1 ? ' x ' + product.order_quantity : ''}</Typography>
                                                                        ))
                                                                        :
                                                                        <>
                                                                            <Typography sx={{ whiteSpace: 'nowrap' }}>
                                                                                {
                                                                                    order.order_type === 'gift' ?
                                                                                        __('{{count}} khóa học được tặng', {
                                                                                            count: order.products?.items?.length ?? 0
                                                                                        })
                                                                                        :
                                                                                        __('{{count}} khóa học đã mua', {
                                                                                            count: order.products?.items?.length ?? 0
                                                                                        })

                                                                                }
                                                                            </Typography>
                                                                            <Typography
                                                                                color='primary'
                                                                                variant='subtitle2'
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    cursor: 'pointer',
                                                                                    whiteSpace: 'nowrap',
                                                                                    '& .MuiSvgIcon-root': {
                                                                                        transition: 'all 200ms',
                                                                                    },
                                                                                    '&.active .MuiSvgIcon-root': {
                                                                                        transform: 'rotate(180deg)',
                                                                                    }
                                                                                }}
                                                                                className={showAllCourses[order.id] ? 'active' : ''}
                                                                                onClick={() => {
                                                                                    setShowAllCourses(prev => ({
                                                                                        ...prev,
                                                                                        [order.id]: prev[order.id] ? false : true,
                                                                                    }))
                                                                                }}
                                                                            >{__('Xem tất cả khóa học')}
                                                                                <Icon icon="KeyboardArrowDownRounded" size="small" />
                                                                            </Typography>
                                                                        </>
                                                                }
                                                            </TableCell>
                                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                                {dateFormat(order.date_created)}
                                                            </TableCell>
                                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                                {moneyFormat(order.total_money ?? 0)}
                                                            </TableCell>
                                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                                {convertPaymentMethod(order.payment_method ?? '')}
                                                            </TableCell>
                                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                                <Label color={data.status.list_option[order.order_status]?.color}>
                                                                    {convertTitleOrder(order.order_status)}
                                                                </Label>
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    order.order_type !== 'for_myself' &&
                                                                    <Typography noWrap>
                                                                        {
                                                                            order.order_type === 'gift_giving' ? 'Mua tặng' : 'Được tặng'
                                                                        }
                                                                    </Typography>
                                                                }
                                                            </TableCell>
                                                            <TableCell padding="checkbox">
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        gap: 1,
                                                                        alignItems: 'center',
                                                                    }}
                                                                >
                                                                    <Button component={Link} to={'/user/' + user.slug + '/orders/' + order.id} variant='outlined' color='inherit'>{__('Chi tiết')}</Button>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                        {
                                                            showAllCourses[order.id] &&
                                                            order.products?.items?.map(product => (
                                                                <TableRow key={product.id}
                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                >
                                                                    <TableCell />
                                                                    <TableCell colSpan={2}>
                                                                        <Typography color="primary" component={Link} to={'/course/' + product.slug}>
                                                                            {product.title}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell colSpan={5} sx={{ whiteSpace: 'nowrap' }}>
                                                                        {
                                                                            order.order_type === 'gift' ?
                                                                                moneyFormat(0)
                                                                                :
                                                                                <>{moneyFormat(product.price ?? 0)} x {product.order_quantity} = {moneyFormat(Number(product.price ?? 0) * product.order_quantity)}</>
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        }
                                                    </React.Fragment>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end'
                                    }}
                                >
                                    {paginate.component}
                                </Box>
                            </>
                            :
                            <NoticeContent
                                title={__('Không tìm thấy đơn hàng')}
                                description={__('Bạn không có đơn hàng nào ngay bây giờ')}
                                image="/images/undraw_empty_xct9.svg"
                                disableButtonHome
                            />
                    }
                </Box>
            )
        }

        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                }}
            >
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell sx={{ width: 250 }}></TableCell>
                                <TableCell>
                                    <Skeleton>
                                        <Typography>
                                            {__('Ngày')}
                                        </Typography>
                                    </Skeleton>
                                </TableCell>
                                <TableCell>
                                    <Skeleton>
                                        <Typography>
                                            {__('Tổng giá')}
                                        </Typography>
                                    </Skeleton>
                                </TableCell>
                                <TableCell>
                                    <Skeleton>
                                        <Typography>{__('Hình thức thanh toán')}</Typography>
                                    </Skeleton>
                                </TableCell>
                                <TableCell>
                                    <Skeleton>
                                        <Typography>{__('Trạng thái')}</Typography>
                                    </Skeleton>
                                </TableCell>
                                <TableCell padding="checkbox"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                [0, 1, 2, 3, 4, 5].map((item) => (
                                    <React.Fragment
                                        key={item}
                                    >
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>
                                                <Skeleton>
                                                    <Icon icon="ShoppingCartOutlined" />
                                                </Skeleton>
                                            </TableCell>
                                            <TableCell sx={{ height: 81 }}>
                                                <Skeleton>
                                                    <Typography>Lorem ipsum dolor sit amet</Typography>
                                                </Skeleton>
                                            </TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                <Skeleton>
                                                    <Typography>
                                                        29 tháng 9 năm 2022
                                                    </Typography>
                                                </Skeleton>
                                            </TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                <Skeleton>
                                                    <Typography>
                                                        7,000,000 ₫
                                                    </Typography>
                                                </Skeleton>
                                            </TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                <Skeleton>
                                                    <Typography>
                                                        bank_transfer
                                                    </Typography>
                                                </Skeleton>
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton>
                                                    <Typography>
                                                        Chưa giải quyết
                                                    </Typography>
                                                </Skeleton>
                                            </TableCell>
                                            <TableCell padding="checkbox">
                                                <Skeleton>
                                                    <Button variant='outlined' color='inherit'>{__('Chi tiết')}</Button>
                                                </Skeleton>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    }

    return <Navigate to={'/user/' + user.slug} />;
}

export default OrdersList


export function convertTitleOrder(status: string) {
    switch (status) {
        case 'cancelled':
            return 'Hủy bỏ';
        case 'completed':
            return 'Đã hoàn thành';
        case 'failed':
            return 'Thất bại';
        case 'on-hold':
            return 'Tạm giữ';
        case 'pending':
            return 'Đang chờ xử lý';
        case 'processing':
            return 'Đang xử lý';
        case 'refunded':
            return 'Hoàn lại';
        default:
            break;
    }
}

export function convertPaymentMethod(status: string) {
    switch (status) {
        case 'bank_transfer':
            return 'Chuyển khoản';
        default:
            return status;
    }
}
