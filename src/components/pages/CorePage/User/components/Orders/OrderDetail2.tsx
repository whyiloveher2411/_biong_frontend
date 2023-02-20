import { Alert, LoadingButton } from '@mui/lab'
import { Card, CardContent, IconButton } from '@mui/material'
import Avatar from 'components/atoms/Avatar'
import Box from 'components/atoms/Box'
import Button from 'components/atoms/Button'
import Divider from 'components/atoms/Divider'
import Icon from 'components/atoms/Icon'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import Label from 'components/atoms/Label'
import Loading from 'components/atoms/Loading'
import Typography from 'components/atoms/Typography'
import Dialog from 'components/molecules/Dialog'
import { dateFormat } from 'helpers/date'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import useAjax from 'hook/useApi'
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

    const [openDialogPaymentMethod, setOpenDialogPaymentMethod] = React.useState(false);

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

    const handleOnloadOrder = (order: OrderProps) => {
        setData(prev => (prev ? {
            ...prev,
            order: order,
        } : null));
    }

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
                                                                <Typography noWrap variant='h5'>{moneyFormat(item.price)}</Typography>
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
                                                                <Typography noWrap variant='h5'>{moneyFormat(item.price)}</Typography>
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
                            {
                                Boolean(data.order.order_status === 'pending' || data.order.order_status === 'on-hold') &&
                                <><Alert color='warning' icon={false} sx={{ fontSize: 16, lineHeight: '26px', alignItems: 'center', }}>
                                    {__('Bạn cần thanh toán đơn hàng trong vòng 24 giờ. Sau đó đơn hàng sẽ được xác mình trong 2 đến 24 giờ tiếp theo.')}
                                    <br />
                                    {
                                        __('Nếu xác mình thất bại, đơn hàng của bạn sẽ tự động chuyển sang trạng thái "Tạm giữ". Các đơn hàng tạm giữ quá 7 ngày sẽ tự động "Hủy bỏ".')
                                    }
                                    <br />
                                    Bạn có thể liên hệ số điện thoại 0886871094 (Quân) để được xác nhận đơn hàng nhanh chóng<br />
                                    Nếu bạn muốn thay đổi phương thức thanh toán, vui lòng thay đổi <Button variant='text' onClick={() => setOpenDialogPaymentMethod(true)}>Tại đây</Button>
                                </Alert>
                                    <Alert color='info' sx={{ mt: 1, fontSize: 14, }} icon={false}>
                                        <Typography>Nếu bạn không thể tìm thấy phương thức thanh toán phù hợp, bạn có thể liên hệ với chúng tôi qua fanpage <a style={{ color: 'blue' }} href="https://www.facebook.com/spacedev.vn" target='_blank'>https://www.facebook.com/spacedev.vn</a> hoặc số điện thoại 0886871094 (Quân) để được hướng đẫn các phương thức khác</Typography>
                                    </Alert>
                                </>


                            }
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
                                sx={{ mt: 3, mb: 6 }}
                            >
                                Nếu bạn có bất kỳ câu hỏi nào về đơn hàng này, vui lòng thảo luận trực tiếp với hỗ trợ viên <Button onClick={() => useParamUrl.changeQuery({ show_comment: useParamUrl.query.show_comment === '1' ? 0 : 1 })}
                                    variant='outlined'>
                                    Nhờ hỗ trợ
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
                                    {
                                        data.order.payment_method ?
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography>{__('Hình thức thanh toán')}</Typography>
                                                <Box>
                                                    {
                                                        convertPaymentMethod(data.order.payment_method ?? '')
                                                    }
                                                    <IconButton onClick={() => setOpenDialogPaymentMethod(true)} size='small'>
                                                        <Icon icon="RemoveRedEyeOutlined" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            :
                                            <></>
                                    }

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
                    <DialogPayment order={data.order} open={openDialogPaymentMethod} onClose={() => setOpenDialogPaymentMethod(false)} handleOnloadOrder={handleOnloadOrder} />
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


function DialogPayment({ order, open, onClose, handleOnloadOrder }: { order: OrderProps; open: boolean, onClose: () => void, handleOnloadOrder: (order: OrderProps) => void }) {

    const [orderState, setOrderState] = React.useState(order);

    const handleOnChangePaymentMethod = (name: string) => {
        setOrderState(prev => ({
            ...prev,
            payment_method: name
        }))
    }

    React.useEffect(() => {
        setOrderState(order);
    }, [order]);

    const ajaxConfirmOrder = useAjax();

    const handleChangePaymentMethod = () => {

        if (orderState.order_status === 'pending' && orderState.payment_method !== order.payment_method) {
            ajaxConfirmOrder.ajax({
                url: '/vn4-ecommerce/shoppingcart/change-payment-method',
                data: {
                    order: order.id,
                    paymentMethod: orderState.payment_method,
                },
                success: (result: { order: OrderProps, result: number, error: number, order_id: ID }) => {
                    if (result.result && !result.error && result.order) {
                        handleOnloadOrder(result.order);
                        onClose();
                    }
                }
            });
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title="Phương thực thanh toán"
            action={order.order_status === 'pending' ? <>
                <Button color='inherit' onClick={onClose} >Hủy</Button>
                <LoadingButton loading={ajaxConfirmOrder.open} disabled={orderState.payment_method === order.payment_method} variant='contained' onClick={handleChangePaymentMethod} >Lưu thay đổi</LoadingButton>
            </> : undefined}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                {
                    Boolean(orderState.order_status === 'pending' || orderState.payment_method === 'bank_transfer') &&
                    <BankTransfer
                        order={orderState}
                        handleOnClick={handleOnChangePaymentMethod}
                    />
                }
                {
                    Boolean(orderState.order_status === 'pending' || order.payment_method === 'momo') &&
                    <Momo
                        order={orderState}
                        handleOnClick={handleOnChangePaymentMethod}
                    />
                }
                {
                    Boolean(orderState.order_status === 'pending' || orderState.payment_method === 'zalopay') &&
                    <ZaloPay
                        order={orderState}
                        handleOnClick={handleOnChangePaymentMethod}
                    />
                }
            </Box>
        </Dialog>
    )
}

function BankTransfer({ order, handleOnClick }: { order: OrderProps, handleOnClick: (name: string) => void }) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                gap: 1,
                border: '1px solid',
                borderColor: 'dividerDark',
                borderRadius: 2,
                p: 2,
                cursor: 'pointer',
                position: 'relative',
                fontSize: 16,
                '&:hover, &.active': {
                    borderColor: 'primary.main',
                },
                '& .icon-check': {
                    opacity: 0,
                    position: 'absolute',
                    right: 10,
                    top: 10,
                },
                '&.active .icon-check': {
                    opacity: 1,
                },
            }}
            className={order.payment_method === 'bank_transfer' ? 'active' : ''}
            onClick={() => {
                handleOnClick('bank_transfer');
                // handleChange('bank_transfer')
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <Typography variant='h3'>Bank transfer</Typography>
                <Icon icon="AccountBalanceRounded" sx={{ fontSize: 35 }} />
            </Box>
            <Typography>Thanh toán bằng tài khoản ngân hàng qua internet banking bằng tính năng thanh toán trực tuyến của các ngân hàng, chuyển khoản liên ngân hàng đến tất cả các ngân hàng nội địa nhanh chóng.</Typography>
            {
                order.payment_method === 'bank_transfer' &&
                <Alert color='info' sx={{ mt: 1, fontSize: 14, }} icon={false}>
                    <Typography variant='h4' sx={{ mb: 1 }}>Thông tin chuyển khoản</Typography>
                    <Typography><strong>Ngân hàng:</strong> Ngân hàng thương mại cổ phần Phát triển Thành phố Hồ Chí Minh (HDBank)</Typography>
                    <Typography><strong>Chi nhánh:</strong> Nguyễn Trải</Typography>
                    <Typography><strong>Tài khoản thụ hưởng:</strong> 004704070012678 - DANG THUYEN QUAN</Typography>
                    <Typography><strong>Nội dung chuyển khoản:</strong> <Typography component={'span'} sx={{ textTransform: 'uppercase' }}>{order.title}</Typography></Typography>
                </Alert>
            }
            <Icon className="icon-check" icon="CheckCircleRounded" color="success" />
        </Box>
    );
}

function Momo({ order, handleOnClick }: { order: OrderProps, handleOnClick: (name: string) => void }) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                gap: 1,
                border: '1px solid',
                borderColor: 'dividerDark',
                borderRadius: 2,
                p: 2,
                cursor: 'pointer',
                position: 'relative',
                fontSize: 16,
                '&:hover, &.active': {
                    borderColor: 'primary.main',
                },
                '& .icon-check': {
                    opacity: 0,
                    position: 'absolute',
                    right: 10,
                    top: 10,
                },
                '&.active .icon-check': {
                    opacity: 1,
                },
            }}
            className={order.payment_method === 'momo' ? 'active' : ''}
            onClick={() => {
                handleOnClick('momo');
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <Typography variant='h3'>Thanh toán bằng ví điện tử MoMo</Typography>
                <ImageLazyLoading
                    src='/images/momo-logo.png'
                    sx={{ height: 35, }}
                />
            </Box>
            <Typography>Chuyển tiền đến 45 ngân hàng nội địa tiện lợi, nhanh chóng, hoàn toàn bảo mật, nhận tiền tức thì.</Typography>
            {
                order.payment_method === 'momo' &&
                <Alert color='info' sx={{ mt: 1, fontSize: 14, }} icon={false}>
                    <Typography variant='h4' sx={{ mb: 1 }}>Thông tin chuyển khoản</Typography>
                    <Typography><strong>Số điện thoại:</strong> 0886871094</Typography>
                    <Typography><strong>Tên người nhận:</strong> ĐẶNG THUYỀN QUÂN</Typography>
                    <Typography><strong>Nội dung chuyển khoản:</strong> <Typography component={'span'} sx={{ textTransform: 'uppercase' }}>{order.title}</Typography></Typography>
                </Alert>
            }
            <Icon className="icon-check" icon="CheckCircleRounded" color="success" />
        </Box>
    )
}

function ZaloPay({ order, handleOnClick }: { order: OrderProps, handleOnClick: (name: string) => void }) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                gap: 1,
                border: '1px solid',
                borderColor: 'dividerDark',
                borderRadius: 2,
                p: 2,
                cursor: 'pointer',
                position: 'relative',
                fontSize: 16,
                '&:hover, &.active': {
                    borderColor: 'primary.main',
                },
                '& .icon-check': {
                    opacity: 0,
                    position: 'absolute',
                    right: 10,
                    top: 10,
                },
                '&.active .icon-check': {
                    opacity: 1,
                },
            }}
            className={order.payment_method === 'zalopay' ? 'active' : ''}
            onClick={() => {
                handleOnClick('zalopay');
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <Typography variant='h3'>Thanh toán bằng ví điện tử ZaloPay</Typography>
                <ImageLazyLoading
                    src='/images/zalo-pay-logo.svg'
                    sx={{ height: 35 }}
                />
            </Box>
            <Typography>Chuyển tiền đến 45 ngân hàng nội địa tiện lợi, nhanh chóng, hoàn toàn bảo mật, nhận tiền tức thì.</Typography>
            {
                order.payment_method === 'zalopay' &&
                <Alert color='info' sx={{ mt: 1, fontSize: 14, }} icon={false}>
                    <Typography variant='h4' sx={{ mb: 1 }}>Thông tin chuyển khoản</Typography>
                    <Typography><strong>Số điện thoại:</strong> 0886871094</Typography>
                    <Typography><strong>Tên người nhận:</strong> ĐẶNG THUYỀN QUÂN</Typography>
                    <Typography><strong>Nội dung chuyển khoản:</strong> <Typography component={'span'} sx={{ textTransform: 'uppercase' }}>{order.title}</Typography></Typography>
                </Alert>
            }
            <Icon className="icon-check" icon="CheckCircleRounded" color="success" />
        </Box>
    )
}