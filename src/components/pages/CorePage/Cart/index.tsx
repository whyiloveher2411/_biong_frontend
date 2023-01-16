import { Box, Breadcrumbs, Button, Card, CardContent, IconButton, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from 'components/atoms/Alert';
import Divider from 'components/atoms/Divider';
import FieldForm from 'components/atoms/fields/FieldForm';
// import FieldForm from 'components/atoms/fields/FieldForm';
import { LoadingButton } from '@mui/lab';
import Chip from 'components/atoms/Chip';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Loading from 'components/atoms/Loading';
import Tooltip from 'components/atoms/Tooltip';
import NoticeContent from 'components/molecules/NoticeContent';
import AuthGuard from 'components/templates/AuthGuard';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import useAjax from 'hook/useApi';
import useResponsive from 'hook/useResponsive';
import { moneyFormat } from 'plugins/Vn4Ecommerce/helpers/Money';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CourseProps } from 'services/courseService';
import { OrderProductItem } from 'services/eCommerceService';
import { RootState } from 'store/configureStore';
import { loadCartFormServer } from 'store/shoppingCart/shoppingCart.reducers';
import useShoppingCart from 'store/shoppingCart/useShoppingCart';
import Checkout from './components/Checkout';

function index() {

    const shoppingCart = useShoppingCart();

    const [courses, setCourses] = React.useState<Array<CourseProps> | null>(null);

    let { tab } = useParams<{
        tab: 'cart' | 'payment' | string,
    }>();


    const isMobile = useResponsive('down', 'sm');

    const [showInputPromotion, setShowInputPromotion] = React.useState(false);

    const user = useSelector((state: RootState) => state.user);

    const dispatch = useDispatch();

    const handleRemoveItemToCart = (item: OrderProductItem) => () => {
        shoppingCart.removeToCart(item);
    }

    const [amount, setAmount] = React.useState<{
        [key: string]: {
            order_quantity: number,
            index: number,
        }
    }>({});

    // const { showMessage } = useFloatingMessages();

    const navigate = useNavigate();

    React.useEffect(() => {
        const amountTemp: {
            [key: string]: {
                order_quantity: number,
                index: number,
            }
        } = {};

        shoppingCart.data.products.forEach((item, index) => {
            amountTemp[item.id] = {
                index: index,
                order_quantity: item.order_quantity,
            };
        });

        setAmount(amountTemp);

    }, [shoppingCart.data.products]);

    React.useEffect(() => {
        dispatch(loadCartFormServer());
    }, []);

    React.useEffect(() => {
        shoppingCart.loadCartSummary((coursesApi) => {
            if (coursesApi) {
                setCourses(coursesApi);
            }
        });
    }, [shoppingCart.data.products.length]);

    const ajaxConfirmOrder = useAjax();

    // const [isGifCourse, setIsGifCourse] = React.useState(false);

    const handleConfirmOrder = () => {

        const price = courses?.reduce((total, item) => {
            if (item.is_purchased && !shoppingCart.data.is_gift) {
                return total;
            }
            return total + (amount[item.id] && shoppingCart.data.is_gift ? amount[item.id].order_quantity : 1) * parseFloat(item.price)
        }, 0);

        if (shoppingCart.data.payment_method || !price) {
            ajaxConfirmOrder.ajax({
                url: '/vn4-ecommerce/shoppingcart/create',
                data: {
                    products: shoppingCart.data.products,
                    paymentMethod: shoppingCart.data.payment_method,
                    // promotions: shoppingCart.data.promotions,
                    is_gift: shoppingCart.data.is_gift,
                    order_code: shoppingCart.data.code,
                },
                success: (result: { error: number, order_id: ID }) => {
                    if (!result.error && result.order_id) {
                        shoppingCart.clearCacheAfterOrder();
                        navigate('/user/' + user.slug + '/orders/' + result.order_id);
                    }
                }
            });

        } else {
            window.showMessage(__('Please choose a payment method that suits you!'), 'warning');
        }
    }

    const productIsPurchased = courses?.filter(item => item.is_purchased).length ?? 0;
    const hasProductInCart = courses === null || courses?.length > productIsPurchased || shoppingCart.data.is_gift;

    if (tab && !hasProductInCart) {
        navigate('/cart');
        return null;
    }

    const price = courses?.reduce((total, item) => {
        if (item.is_purchased && !shoppingCart.data.is_gift) {
            return total;
        }
        return total + (amount[item.id] && shoppingCart.data.is_gift ? amount[item.id].order_quantity : 1) * parseFloat(item.price)
    }, 0);


    return (<AuthGuard
        title={__('Giỏ hàng')}
        isHeaderSticky
        header={<Breadcrumbs
            separator={<Icon icon="NavigateNext" fontSize="small" />}
        >
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 400,
                    cursor: 'pointer',
                }}
                onClick={() => navigate('/cart')}
            >
                {__('Giỏ hàng')}
            </Typography>
            {
                tab === 'payment' && hasProductInCart ?
                    <Typography
                        component="h1"
                        variant="h3"
                        sx={{
                            fontWeight: 400,
                        }}
                    >
                        {__('Thanh toán')}
                    </Typography>
                    :
                    <Typography
                        component="h1"
                        variant="h3"
                        sx={{
                            opacity: 0.6,
                            pointerEvents: 'none',
                            fontWeight: 400,
                        }}
                    >
                        {__('Thanh toán')}
                    </Typography>
            }
        </Breadcrumbs>}
    >
        {
            courses ?
                courses.length > 0 ?
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

                        {
                            tab === 'payment' && hasProductInCart ?
                                <Checkout courses={courses} />
                                :
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 3,
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
                                            {__('{{count}} Khóa học trong giỏ hàng', {
                                                count: courses.length
                                            })}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            {
                                                courses.map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        <Box
                                                            sx={(theme) => ({
                                                                flex: '1 1',
                                                                display: 'grid',
                                                                p: 2,
                                                                gap: 1,
                                                                gridTemplateColumns: '1.6fr 3fr 1fr 1.7fr 2fr 0.5fr',
                                                                alignItems: 'center',
                                                                [theme.breakpoints.down('sm')]: {
                                                                    gridTemplateColumns: '1.4fr 2fr',
                                                                }
                                                            })}
                                                        >
                                                            <Box
                                                                sx={{ height: '100%', textAlign: 'center' }}
                                                                component={Link}
                                                                to={'/course/' + item.slug}
                                                            >
                                                                <ImageLazyLoading
                                                                    variant="square"
                                                                    sx={{ width: 'auto', maxHeight: '80px', borderRadius: 1, }}
                                                                    src={getImageUrl(item.featured_image)}
                                                                />
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
                                                                            {
                                                                                shoppingCart.data.is_gift ?
                                                                                    <FieldForm
                                                                                        component='number'
                                                                                        config={{
                                                                                            title: false,
                                                                                            activeSubtraction: true,
                                                                                            activeAddition: true,
                                                                                            size: 'small',
                                                                                            min: 1,
                                                                                        }}
                                                                                        name="amount"
                                                                                        post={{ amount: amount[item.id] ? amount[item.id].order_quantity : 1 }}
                                                                                        onReview={(value) => {
                                                                                            shoppingCart.changeQuantity(amount[item.id].index, Number(value) > 1 ? value : 1);
                                                                                        }}
                                                                                    />
                                                                                    :
                                                                                    item.is_purchased ?
                                                                                        <Chip color='secondary' label="Đã mua" />
                                                                                        :
                                                                                        <></>

                                                                            }
                                                                            <Tooltip title={__('Xóa sản phẩm khỏi giỏ hàng')}>
                                                                                <IconButton sx={{ ml: 'auto' }} onClick={handleRemoveItemToCart({ ...item, order_quantity: 1 })}>
                                                                                    <Icon icon="DeleteForeverOutlined" />
                                                                                </IconButton>
                                                                            </Tooltip>
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
                                                                    {
                                                                        shoppingCart.data.is_gift ?
                                                                            <FieldForm
                                                                                component='number'
                                                                                config={{
                                                                                    title: false,
                                                                                    activeSubtraction: true,
                                                                                    activeAddition: true,
                                                                                    size: 'small',
                                                                                    min: 1,
                                                                                }}
                                                                                name="amount"
                                                                                post={{ amount: amount[item.id] ? amount[item.id].order_quantity : 1 }}
                                                                                onReview={(value) => {
                                                                                    shoppingCart.changeQuantity(amount[item.id].index, Number(value) > 1 ? value : 1);
                                                                                }}
                                                                            />
                                                                            :
                                                                            item.is_purchased ?
                                                                                <Box
                                                                                    sx={{
                                                                                        display: 'flex',
                                                                                        justifyContent: 'center',
                                                                                    }}
                                                                                >
                                                                                    <Chip color='secondary' label="Đã mua" />
                                                                                </Box>
                                                                                :
                                                                                <Typography align='center' color="secondary"> 1</Typography>
                                                                    }
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
                                                                    Boolean(!isMobile || shoppingCart.data.is_gift) &&
                                                                    <Typography noWrap color="secondary" variant='h5'>
                                                                        {
                                                                            item.is_purchased && !shoppingCart.data.is_gift ? moneyFormat(0) :
                                                                                moneyFormat((amount[item.id] && shoppingCart.data.is_gift ? amount[item.id].order_quantity : 1) * Number(item.price))}
                                                                    </Typography>
                                                                }
                                                            </Box>
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'flex-end',
                                                                    gap: 0.65,
                                                                    textAlign: 'right',
                                                                }}
                                                            >
                                                                {
                                                                    !isMobile &&
                                                                    <Tooltip title={__('Xóa sản phẩm khỏi giỏ hàng')}>
                                                                        <IconButton onClick={handleRemoveItemToCart({ ...item, order_quantity: 1 })}>
                                                                            <Icon icon="DeleteForeverOutlined" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                }
                                                            </Box>
                                                        </Box>
                                                        {
                                                            index !== (courses.length - 1) &&
                                                            <Divider color="dark" />
                                                        }
                                                    </React.Fragment>
                                                ))
                                            }
                                        </Box>
                                    </Card>

                                    <FormControl>
                                        <Box>
                                            <FormControlLabel control={<Checkbox checked={shoppingCart.data.is_gift ? true : false} onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                                shoppingCart.changeGiftStatus(checked);
                                            }} />} label={__('Tôi muốn tặng khóa học cho người khác')} />
                                        </Box>
                                        <Alert color='info' sx={{ fontSize: 16, lineHeight: '26px', alignItems: 'center', }}>
                                            {__('Khi chọn mua để tặng, bạn sẽ cần thiết lập các tài khoản được nhận khóa học ở trang cá nhân sau khi thanh toán và hoàn thành đơn hàng.')}
                                        </Alert>
                                    </FormControl>
                                    {/* <Alert color='info' sx={{ fontSize: 16, lineHeight: '26px', mt: -2, alignItems: 'center', }}>
                                        {__('Mua theo nhóm sẽ được giá ưu đãi tùy thuộc vào số lượng.')}&nbsp;
                                        <Button variant="contained" color='success' size='small'>Tôi muốn mua theo nhóm</Button>
                                    </Alert> */}
                                    <Alert color='error' sx={{ fontSize: 16, mt: -2, alignItems: 'center', }}>
                                        {__('Nếu mua các khóa học bạn đã có, hệ thống sẽ tự động được loại bỏ, bạn có thể chuyển sang mua để tặng và tiếp tục')}
                                    </Alert>
                                </Box>
                        }

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
                            <Typography variant='h4'>{__('Tóm tắt đơn hàng')}</Typography>
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
                                    {
                                        courses.map(item => (
                                            <Box
                                                key={item.id}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Typography>{item.title} {amount[item.id] && shoppingCart.data.is_gift ? <Typography color="secondary" component={'span'}>x{amount[item.id].order_quantity}</Typography> : ''}</Typography>
                                                <Typography sx={{ whiteSpace: 'nowrap' }} variant='h5'>{
                                                    item.is_purchased && !shoppingCart.data.is_gift ? moneyFormat(0) :
                                                        moneyFormat((amount[item.id] && shoppingCart.data.is_gift ? amount[item.id].order_quantity : 1) * Number(item.price))}</Typography>
                                            </Box>
                                        ))
                                    }
                                    {
                                        showInputPromotion ?
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 1
                                                }}
                                            >
                                                <FieldForm
                                                    component='text'
                                                    config={{
                                                        title: __('Mã khuyến mãi'),
                                                        size: 'small',
                                                    }}
                                                    post={{ promotions: '' }}
                                                    name="promotions"
                                                    onReview={() => {
                                                        //
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Button size='small' variant='outlined' color="inherit" onClick={() => setShowInputPromotion(false)} >
                                                        {__('Hủy')}
                                                    </Button>
                                                    <Button size='small' variant='contained' onClick={() => window.showMessage(__('Mã phiếu giảm giá đã nhập không hợp lệ cho khóa học này.'), 'warning')}>{__('Áp dụng')}</Button>

                                                </Box>
                                            </Box>
                                            :
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography>{__('Khuyến mãi:')}
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={
                                                            () => {
                                                                setShowInputPromotion(true);
                                                            }
                                                        }
                                                    >
                                                        <Icon icon="AddCircleOutlineRounded" />
                                                    </IconButton></Typography>
                                                <Typography variant='h5'>-{moneyFormat(0)}</Typography>
                                            </Box>
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
                                        <Typography variant='h2' sx={{ fontSize: 26, whiteSpace: 'nowrap', }}>{
                                            moneyFormat(price ?? 0)
                                        }
                                        </Typography>
                                    </Box>
                                    <Divider color="dark" />
                                    {
                                        !tab &&
                                        <LoadingButton
                                            loading={ajaxConfirmOrder.open}
                                            disabled={!hasProductInCart}
                                            onClick={() => {
                                                if (hasProductInCart) {
                                                    if (price) {
                                                        navigate('/cart/payment');
                                                    } else {
                                                        handleConfirmOrder();
                                                    }
                                                }
                                            }}
                                            variant="contained"
                                        >
                                            {__('Xác nhận đơn hàng')}
                                        </LoadingButton>
                                    }
                                    {
                                        tab === 'payment' &&
                                        <LoadingButton
                                            loading={ajaxConfirmOrder.open}
                                            onClick={handleConfirmOrder}
                                            variant="contained">
                                            {__('Xác nhận thanh toán')}
                                        </LoadingButton>
                                    }
                                </CardContent>
                            </Card>
                        </Box>
                    </Box >
                    :
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                        }}
                    >
                        <div>
                            <NoticeContent
                                title={__('Giỏ hàng trống')}
                                description={__('Có vẻ như bạn không có mặt hàng nào trong giỏ hàng của mình.')}
                                image="/images/empty_cart.svg"
                                buttonLabel={__('Tìm kiếm khóa học')}
                                buttonLink="/"
                            />
                        </div>
                    </Box>
                :
                <Box
                    sx={{
                        minHeight: 450,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Loading isWarpper open={true} />
                </Box>
        }
    </AuthGuard >)
}

export default index