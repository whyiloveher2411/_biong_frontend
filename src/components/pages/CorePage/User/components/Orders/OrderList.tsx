import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Icon from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import NoticeContent from 'components/molecules/NoticeContent';
import { dateFormat } from 'helpers/date';
import { __ } from 'helpers/i18n';
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
        orders: OrderProps[],
        status: {
            list_option: {
                [key: string]: {
                    title: string,
                    color: string
                }
            }
        }
    } | false>(false);

    const [showAllCourses, setShowAllCourses] = React.useState<{ [key: ID]: boolean }>({});

    React.useEffect(() => {

        if (myAccount && user && (myAccount.id + '') === (user.id + '')) {
            (async () => {

                const ordersApi = await eCommerceService.getOrderOfMe();

                setData(ordersApi);

            })()
        }

    }, []);

    if (myAccount && user && (myAccount.id + '') === (user.id + '')) {

        if (data) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                    }}
                >
                    {
                        data.orders.length ?
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>{__('Ngày')}</TableCell>
                                            <TableCell>{__('Tổng giá')}</TableCell>
                                            <TableCell>{__('Hình thức thanh toán')}</TableCell>
                                            <TableCell>{__('Trạng thái')}</TableCell>
                                            <TableCell padding="checkbox"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            data.orders.map((order, index) => (
                                                <React.Fragment
                                                    key={order.id}
                                                >
                                                    <TableRow key={order.id}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell><Icon icon="ShoppingCartOutlined" /></TableCell>
                                                        <TableCell sx={{ height: 81 }}>
                                                            {
                                                                order.products?.items?.length === 1 ?
                                                                    order.products?.items?.map(product => (
                                                                        <Typography key={product.id}>{product.title}</Typography>
                                                                    ))
                                                                    :
                                                                    <>
                                                                        <Typography sx={{ whiteSpace: 'nowrap' }}>{__('{{count}} khóa học đã mua', {
                                                                            count: order.products?.items?.length ?? 0
                                                                        })}</Typography>
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
                                                            {moneyFormat(order.products?.total ?? 0)}
                                                        </TableCell>
                                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                            {order.payment_method}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography>
                                                                <Box
                                                                    component='span'
                                                                    sx={{
                                                                        display: 'inline-block',
                                                                        width: 5,
                                                                        height: 5,
                                                                        borderRadius: '50%',
                                                                        background: data.status.list_option[order.order_status]?.color,
                                                                        mr: 1
                                                                    }}
                                                                />
                                                                {convertTitleOrder(order.order_status)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell padding="checkbox">
                                                            <Button component={Link} to={'/user/' + user.slug + '/orders/' + order.id} variant='outlined' color='inherit'>{__('Chi tiết')}</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                    {
                                                        showAllCourses[order.id] &&
                                                        order.products?.items?.map(product => (
                                                            <TableRow key={product.id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell />
                                                                <TableCell>
                                                                    <Typography>{product.title}</Typography>
                                                                </TableCell>
                                                                <TableCell />
                                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                                    {moneyFormat(product.price ?? 0)}
                                                                </TableCell>
                                                                <TableCell />
                                                                <TableCell />
                                                                <TableCell />
                                                                <TableCell />
                                                            </TableRow>
                                                        ))
                                                    }
                                                </React.Fragment>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            // data.orders.map((order, index) => (
                            //     <OrderSingle order={order} key={index} status={data.status} />
                            // ))
                            :
                            <NoticeContent
                                title={__('Order not found')}
                                description={__('You don\'t have any orders right now')}
                                image="/images/undraw_empty_xct9.svg"
                                disableButtonHome
                            />
                    }
                </Box>
            )
        }

        return <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
            }}
        >
            <Box
                component="div"
                style={{ height: '100%', margin: 0 }}
            >
                <div style={{ maxWidth: '100%', height: '100%', width: '100%', margin: '0 auto' }}>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Loading open={true} isWarpper />
                    </Box>
                </div>
            </Box>

        </Box>;
    }

    return <Navigate to={'/user/' + user.slug} />;
}

export default OrdersList


function convertTitleOrder(status: string) {
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
            return 'Chưa giải quyết';
        case 'processing':
            return 'Đang xử lý';
        case 'refunded':
            return 'Hoàn lại';
        default:
            break;
    }
}
