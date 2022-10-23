import Button from '@mui/material/Button/Button'
import Box from 'components/atoms/Box'
import Grid from 'components/atoms/Grid'
import Loading from 'components/atoms/Loading'
import Table from 'components/atoms/Table'
import TableBody from 'components/atoms/TableBody'
import TableCell from 'components/atoms/TableCell'
import TableContainer from 'components/atoms/TableContainer'
import TableHead from 'components/atoms/TableHead'
import TableRow from 'components/atoms/TableRow'
import Typography from 'components/atoms/Typography'
import { dateFormat } from 'helpers/date'
import { __ } from 'helpers/i18n'
import { moneyFormat } from 'plugins/Vn4Ecommerce/helpers/Money'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import eCommerceService, { OrderProps } from 'services/eCommerceService'
import { RootState } from 'store/configureStore'
import { UserProps } from 'store/user/user.reducers'

function OrderDetail({ user, id }: {
    user: UserProps,
    id: ID
}) {

    const myAccount = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    const [data, setData] = React.useState<{
        order: OrderProps,
        status: {
            list_option: {
                [key: string]: {
                    title: string,
                    color: string
                }
            }
        }
    } | null>(null);

    React.useEffect(() => {
        if (myAccount && user && (myAccount.id + '') === (user.id + '')) {
            (async () => {

                const ordersApi = await eCommerceService.getOrderDetail(id);

                if (ordersApi && ordersApi.order.products?.items?.length) {
                    setData(ordersApi);
                } else {
                    navigate('/user/' + myAccount.slug + '/orders');
                }
            })()
        }
    }, []);



    if (myAccount && user && (myAccount.id + '') === (user.id + '')) {

        if (data) {
            return (
                <Box>
                    <Button component={Link} to={'/user/' + user.slug + '/orders'} sx={{ mb: 4 }} variant='outlined' color='inherit'>{__('Quay lại trang danh sách')}</Button>
                    <Box sx={{ mt: 4 }}>
                        <Typography><strong>Ngày:</strong> {dateFormat(data.order.date_created)}</Typography>
                        <Typography><strong>Mã đơn hàng:</strong> {data.order.title}</Typography>
                        {
                            data.order.order_type !== 'for_myself' &&
                            <Typography><strong>Loại đơn hàng:</strong> {
                                data.order.order_type === 'gift_giving' ? 'Mua tặng' : 'Được tặng'
                            }</Typography>
                        }
                    </Box>
                    <Grid
                        container
                        spacing={4}
                        sx={{ mt: 4, mb: 6 }}
                    >
                        <Grid
                            item
                            md={6}
                            sx={{ display: 'flex', gap: 1, flexDirection: 'column', }}
                        >
                            <Typography variant='h3'>Spacedev.vn</Typography>
                            <Typography>
                                WeWork Lim Tower 3,
                            </Typography>
                            <Typography>29A Nguyễn Đình Chiểu, Đa Kao, Quận 1, Thành phố Hồ Chí Minh</Typography>
                            <Typography color='primary'>spacedev.vn</Typography>
                        </Grid>
                        <Grid
                            item
                            md={6}
                            sx={{ display: 'flex', gap: 1, flexDirection: 'column', }}
                        >

                            <Typography><strong>{data.order.order_type === 'gift' ? 'Tặng cho' : 'Bán cho'}: </strong>{user.full_name}</Typography>
                        </Grid>
                    </Grid>
                    <TableContainer>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item</TableCell>
                                    <TableCell>{__('Ngày')}</TableCell>
                                    <TableCell>{__('Mã khuyến mãi')}</TableCell>
                                    <TableCell>{__('Số lượng')}</TableCell>
                                    <TableCell>{__('Giá')}</TableCell>
                                    <TableCell>{__('Số tiền')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.order.products?.items?.map(product => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.title}</TableCell>
                                            <TableCell>{dateFormat(data.order.date_created)}</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>{product.order_quantity}</TableCell>
                                            <TableCell>{moneyFormat(product.price ?? 0)}</TableCell>
                                            <TableCell>{moneyFormat(Number(product.price) * product.order_quantity ?? 0)}</TableCell>
                                        </TableRow>
                                    ))
                                }
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{__('Tổng số tiền')}</TableCell>
                                    <TableCell>{moneyFormat(data.order.total_money ?? 0)}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography
                        sx={{ mt: 6, mb: 6 }}
                    >
                        Nếu bạn có bất kỳ câu hỏi nào về biên lai này, vui lòng liên hệ với nhóm <Typography component={Link} color="primary" to="/contact-us">hỗ trợ của chúng tôi</Typography>.
                    </Typography>
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

export default OrderDetail