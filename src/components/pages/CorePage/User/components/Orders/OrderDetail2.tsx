import { Card, CardContent } from '@mui/material'
import Avatar from 'components/atoms/Avatar'
import Box from 'components/atoms/Box'
import Button from 'components/atoms/Button'
import Divider from 'components/atoms/Divider'
import Icon from 'components/atoms/Icon'
import Label from 'components/atoms/Label'
import Loading from 'components/atoms/Loading'
import Typography from 'components/atoms/Typography'
import { dateFormat } from 'helpers/date'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import useQuery from 'hook/useQuery'
import useResponsive from 'hook/useResponsive'
import Comments from 'plugins/Vn4Comment/Comments'
import { moneyFormat } from 'plugins/Vn4Ecommerce/helpers/Money'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import eCommerceService, { OrderProps } from 'services/eCommerceService'
import { RootState } from 'store/configureStore'
import { UserProps } from 'store/user/user.reducers'
import { convertPaymentMethod, convertTitleOrder } from './OrderList'

function OrderDetail2({ user, id }: {
    user: UserProps,
    id: ID
}) {

    const myAccount = useSelector((state: RootState) => state.user);

    const useParamUrl = useQuery({
        show_comment: 0,
    });

    const isMobile = useResponsive('down', 'sm');

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
                    <Button startIcon={<Icon icon="ArrowBackRounded" />} component={Link} to={'/user/' + user.slug + '/orders'} sx={{ mb: 4 }} variant='outlined' color='inherit'>{__('Danh sách đơn hàng')}</Button>
                    <Box
                        sx={(theme) => ({
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 4,
                            pt: 3,
                            [theme.breakpoints.down('md')]: {
                                flexDirection: 'column',
                            }
                        })}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                width: '100%',
                            }}
                        >
                            <Typography variant='h4'>{__('Khóa học')}</Typography>

                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography sx={{ fontSize: 18, p: 2, pb: 0 }} color="text.secondary">
                                    {__('{{count}} Khóa học trong đơn hàng', {
                                        count: data.order.products?.items?.length ?? ''
                                    })}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    {
                                        data.order.products?.items?.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <Box
                                                    sx={(theme) => ({
                                                        flex: '1 1',
                                                        display: 'grid',
                                                        p: 2,
                                                        gap: 1,
                                                        gridTemplateColumns: '1.6fr 3fr 1fr 1.7fr 3fr',
                                                        alignItems: 'center',
                                                        [theme.breakpoints.down('sm')]: {
                                                            gridTemplateColumns: '1.4fr 2fr',
                                                        }
                                                    })}
                                                >
                                                    <Box
                                                        sx={{ height: '100%' }}
                                                    >
                                                        <Link
                                                            to={'/course/' + item.slug}
                                                        >
                                                            <Avatar
                                                                variant="square"
                                                                sx={{ width: '100%', height: 'auto', borderRadius: 1, }}
                                                                src={getImageUrl(item.featured_image)}
                                                            />
                                                        </Link>
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 0.65,
                                                        }}
                                                    >

                                                        <Typography variant='h5' component='h2'>
                                                            <Link
                                                                to={'/course/' + item.slug}
                                                            >
                                                                {item.title}
                                                            </Link>
                                                        </Typography>

                                                        {
                                                            Boolean(item.course_detail?.owner_detail) &&
                                                            <Typography variant='body2'>{__('Bởi')} {item.course_detail?.owner_detail?.title}</Typography>
                                                        }

                                                        {
                                                            isMobile &&
                                                            <>
                                                                <Typography noWrap color="primary.dark" variant='h5'>{moneyFormat(item.price)}</Typography>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                    }}
                                                                >
                                                                    {item.order_quantity}
                                                                </Box>
                                                            </>
                                                        }
                                                    </Box>
                                                    {
                                                        !isMobile &&
                                                        <>
                                                            <Box
                                                                sx={{
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <Typography noWrap color="primary.dark" variant='h5'>{moneyFormat(item.price)}</Typography>
                                                            </Box>
                                                            <Typography align='center' color="secondary"> {item.order_quantity}</Typography>
                                                        </>
                                                    }
                                                    <Box
                                                        sx={(theme) => ({
                                                            alignItems: 'center',
                                                            display: 'flex',
                                                            [theme.breakpoints.down('sm')]: {
                                                                gridColumnStart: 1,
                                                                gridColumnEnd: 3,
                                                                justifyContent: 'flex-end',
                                                            }
                                                        })}
                                                    >
                                                        {
                                                            Boolean(!isMobile) &&
                                                            <Typography noWrap color="secondary" variant='h5'>
                                                                {moneyFormat(item.order_quantity * Number(item.price))}
                                                            </Typography>
                                                        }
                                                    </Box>
                                                </Box>
                                                <Divider color="dark" />
                                            </React.Fragment>
                                        ))
                                    }

                                    <Box
                                        sx={(theme) => ({
                                            flex: '1 1',
                                            display: 'grid',
                                            p: 2,
                                            gap: 1,
                                            gridTemplateColumns: '1.6fr 3fr 1fr 1.7fr 3fr',
                                            alignItems: 'center',
                                            [theme.breakpoints.down('sm')]: {
                                                gridTemplateColumns: '1.4fr 2fr',
                                            }
                                        })}
                                    >
                                        <div />
                                        <div />
                                        <div />
                                        <Typography variant='h4' sx={{ fontSize: 18 }}>{__('Khuyến mãi')}:</Typography>
                                        <Typography noWrap variant='h5'>
                                            -{moneyFormat(0)}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={(theme) => ({
                                            flex: '1 1',
                                            display: 'grid',
                                            p: 2,
                                            gap: 1,
                                            gridTemplateColumns: '1.6fr 3fr 1fr 1.7fr 3fr',
                                            alignItems: 'center',
                                            [theme.breakpoints.down('sm')]: {
                                                gridTemplateColumns: '1.4fr 2fr',
                                            }
                                        })}
                                    >
                                        <div />
                                        <div />
                                        <div />
                                        <Typography variant='h4' sx={{ fontSize: 18 }}>{__('Tổng cộng')}:</Typography>
                                        <Typography noWrap color="secondary" sx={{ fontSize: 26, }} variant='h5'>
                                            {moneyFormat(data.order.total_money)}
                                        </Typography>
                                    </Box>

                                </Box>
                            </Card>

                            {/* <FormControl>
                            <Box>
                                <FormControlLabel control={<Checkbox checked={shoppingCart.data.is_gift ? true : false} onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                    shoppingCart.changeGiftStatus(checked);
                                }} />} label={__('Tôi muốn tặng khóa học cho người khác')} />
                            </Box>
                            <Alert color='info' sx={{ fontSize: 16, lineHeight: '26px', alignItems: 'center', }}>
                                {__('Khi chọn mua để tặng, bạn sẽ cần thiết lập các tài khoản được nhận khóa học ở trang cá nhân sau khi thanh toán và hoàn thành đơn hàng.')}
                            </Alert>
                        </FormControl> */}

                            <Typography
                                sx={{ mt: 6, mb: 6 }}
                            >
                                Nếu bạn có bất kỳ câu hỏi nào về đơn hàng này, vui lòng thảo luận trực tiếp với hỗ trợ viên <Button onClick={() => useParamUrl.changeQuery({ show_comment: useParamUrl.query.show_comment === '1' ? 0 : 1 })}
                                    variant='outlined'>
                                    Tại đây
                                </Button>
                            </Typography>
                            {
                                useParamUrl.query.show_comment === '1' &&
                                <Box
                                    sx={{
                                        maxWidth: 900,
                                    }}
                                >
                                    <Comments
                                        keyComment={data.order.id}
                                        type="vn4_comment_order"
                                        disableAnonymously
                                    />
                                </Box>
                            }

                        </Box>

                        <Box
                            sx={(theme) => ({
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                [theme.breakpoints.down('md')]: {
                                    width: '100%',
                                }
                            })}
                        >
                            <Typography variant='h4'>&nbsp;</Typography>
                            <Card
                                sx={(theme) => ({
                                    width: 370,
                                    [theme.breakpoints.down('md')]: {
                                        width: 'auto',
                                    }
                                })}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography>{__('Mã đơn hàng:')}</Typography>
                                        <Typography sx={{ textTransform: 'uppercase', }}>
                                            {data.order.title}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography>{__('Trạng thái:')}</Typography>
                                        <Label color={data.status.list_option[data.order.order_status]?.color}>
                                            {convertTitleOrder(data.order.order_status)}
                                        </Label>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography>{__('Ngày tạo:')}</Typography>
                                        {
                                            dateFormat(data.order.date_created)
                                        }
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography>{__('Loại đơn hàng:')}</Typography>
                                        {
                                            data.order.order_type === 'for_myself' ?
                                                __('Thông thường')
                                                :
                                                data.order.order_type === 'gift_giving' ?
                                                    __('Mua tặng')
                                                    :
                                                    data.order.order_type === 'gift' ?
                                                        __('Được tặng')
                                                        :
                                                        ''
                                        }
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography>{__('Hình thức thanh toán')}</Typography>
                                        {
                                            convertPaymentMethod(data.order.payment_method ?? '')
                                        }
                                    </Box>
                                    <Divider color="dark" />
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography variant='h4' sx={{ fontSize: 18 }}>{__('Tổng cộng')}</Typography>
                                        <Typography variant='h2' sx={{ fontSize: 26, whiteSpace: 'nowrap', }}>
                                            {
                                                moneyFormat(data.order.total_money)
                                            }
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
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

export default OrderDetail2