import { Alert } from '@mui/lab';
import { Box, Breadcrumbs, Button, Card, CardContent, IconButton, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from 'components/atoms/Divider';
import FieldForm from 'components/atoms/fields/FieldForm';
// import FieldForm from 'components/atoms/fields/FieldForm';
import Icon from 'components/atoms/Icon';
import Tooltip from 'components/atoms/Tooltip';
import NoticeContent from 'components/molecules/NoticeContent';
import AuthGuard from 'components/templates/AuthGuard';
import { __ } from 'helpers/i18n';
import useAjax from 'hook/useApi';
import { moneyFormat } from 'plugins/Vn4Ecommerce/helpers/Money';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseProps } from 'services/courseService';
import { RootState } from 'store/configureStore';
import useShoppingCart from 'store/shoppingCart/useShoppingCart';
import Checkout from './components/Checkout';
import CourseCollection from './components/CourseCollection';

function index() {

    const shoppingCart = useShoppingCart();

    const [groupCourses, setGroupCourses] = React.useState<{ [key: string]: Array<CourseProps> } | null>(null);

    let { tab } = useParams<{
        tab: 'cart' | 'payment' | string,
    }>();

    const [showInputPromotion, setShowInputPromotion] = React.useState(false);

    const user = useSelector((state: RootState) => state.user);

    const handleRemoveItemToCart = (item: CourseProps, groupName = 'products') => () => {
        shoppingCart.removeToCart(item, groupName);
    }

    const [amount, setAmount] = React.useState<{ [key: string]: number }>({});

    // const { showMessage } = useFloatingMessages();

    const navigate = useNavigate();

    React.useEffect(() => {
        shoppingCart.loadCartSummary((coursesApi) => {
            setGroupCourses(coursesApi);
        });
    }, [shoppingCart.data.groups]);

    const ajaxConfirmOrder = useAjax();

    const [isGifCourse, setIsGifCourse] = React.useState(false);

    const handleConfirmOrder = () => {
        if (paymentMethod) {
            ajaxConfirmOrder.ajax({
                url: '/vn4-ecommerce/shoppingcart/create',
                data: {
                    products: shoppingCart.data.groups.products,
                    paymentMethod: paymentMethod,
                    promotions: shoppingCart.data.promotions,
                    is_gift: isGifCourse,
                    quantity: isGifCourse ? amount : false,
                },
                success: (result: { error: number }) => {
                    if (!result.error) {
                        shoppingCart.clearCacheAfterOrder();
                        navigate('/user/' + user.slug + '/edit-profile/orders');
                    }
                }
            });

        } else {
            window.showMessage(__('Please choose a payment method that suits you!'), 'warning');
        }
    }

    const [paymentMethod, setPaymentMethod] = React.useState<'bank_transfer' | 'momo'>('bank_transfer');

    const handleChange = (panel: 'bank_transfer' | 'momo') => {
        setPaymentMethod(panel);
    };


    if (tab && !shoppingCart.data.groups?.products?.length) {
        navigate('/cart');
        return null;
    }

    const sectionCart = groupCourses ? <CourseCollection
        title={__('{{count}} Khóa học trong giỏ hàng', {
            count: groupCourses.products?.length
        })}
        courses={groupCourses.products}
        action={(course) => <>
            <Box
                sx={{
                    alignItems: 'center',
                }}
            >
                {
                    isGifCourse &&

                    <Typography noWrap color="primary.dark" variant='h5'>{moneyFormat(course.price)}</Typography>
                }
            </Box>
            <Box>
                {
                    isGifCourse &&
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
                        post={{ amount: amount[course.id] ? amount[course.id] : 1 }}
                        onReview={(value) => {
                            setAmount(prev => ({
                                ...prev,
                                [course.id]: Number(value) > 1 ? value : 1,
                            }))
                        }}
                    />
                }
            </Box>
            <Box
                sx={{
                    alignItems: 'center',
                    pr: 4,
                }}
            >
                <Typography noWrap color="secondary" variant='h5'>{moneyFormat((amount[course.id] && isGifCourse ? amount[course.id] : 1) * Number(course.price))}</Typography>
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
                <Tooltip title={__('Xóa sản phẩm khỏi giỏ hàng')}>
                    <IconButton onClick={handleRemoveItemToCart(course)}>
                        <Icon icon="DeleteForeverOutlined" />
                    </IconButton>
                </Tooltip>
                {/* <Typography
                component={'span'}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={handleRemoveItemToCart(course)}
            >
                {__('Xóa')}
            </Typography> */}
                {/* <Typography
                component={'span'}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={() => shoppingCart.moveProductToGroupOther(course, 'products', 'save_for_letter')}
            >
                {__('Lưu vào mua sau')}
            </Typography> */}
                {/* <Typography
                component={'span'}
                noWrap
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={() => shoppingCart.moveProductToGroupOther(course, 'products', 'wishlis')}
            >
                {__('Di chuyển vào danh sách yêu thích')}
            </Typography> */}
            </Box>
        </>
        }
    /> : null;

    const sectionSaveForLetter = groupCourses ? <CourseCollection
        title={__('Danh sách mua sau', {
            count: groupCourses.save_for_letter?.length
        })}
        courses={groupCourses.save_for_letter}
        action={(course) => <>
            <Typography
                component={'span'}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={handleRemoveItemToCart(course, 'save_for_letter')}
            >
                {__('Xóa')}
            </Typography>
            <Typography
                component={'span'}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={() => shoppingCart.moveProductToGroupOther(course, 'save_for_letter', 'products')}
            >{__('Chuyển đến Giỏ hàng')}</Typography>
        </>}
    /> : null;

    const selctionwishliste = groupCourses ? <CourseCollection
        title={__('Recently wishlisted', {
            count: groupCourses.wishlis?.length
        })}
        courses={groupCourses.wishlis}
        action={(course) => <>
            <Typography
                component={'span'}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={handleRemoveItemToCart(course, 'wishlis')}
            >
                {__('Xóa')}
            </Typography>
            <Typography
                component={'span'}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={() => shoppingCart.moveProductToGroupOther(course, 'wishlis', 'products')}
            >{__('Move to Cart')}</Typography>
        </>}
    /> : null


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
                tab === 'payment' && shoppingCart.data.groups?.products?.length ?
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
            groupCourses ?
                groupCourses.products?.length > 0 ?
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 4,
                            pt: 3,
                        }}
                    >

                        {
                            tab === 'payment' && shoppingCart.data.groups?.products?.length ?
                                <Checkout groupCourses={groupCourses} handleChange={handleChange} paymentMethod={paymentMethod} />
                                :
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 3,
                                    }}
                                >
                                    <Typography variant='h4'>{__('Khóa học')}</Typography>
                                    {sectionCart}
                                    {sectionSaveForLetter}
                                    {selctionwishliste}

                                    <FormControl>
                                        <Box>
                                            <FormControlLabel control={<Checkbox value={isGifCourse} onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                                setIsGifCourse(checked);
                                            }} />} label={__('Tôi muốn tặng khóa học cho người khác')} />
                                        </Box>
                                        <Alert color='info' sx={{ fontSize: 16 }}>
                                            {__('Bạn sẽ cần thiết lập các tài khoản được nhận khóa học sau khi thanh toán và hoàn thành đơn hàng.')}
                                        </Alert>
                                    </FormControl>
                                </Box>
                        }

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}
                        >
                            <Typography variant='h4'>{__('Tóm tắt đơn hàng')}</Typography>
                            <Card
                                sx={{
                                    width: 370,
                                }}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2
                                    }}
                                >
                                    {
                                        groupCourses.products.map(item => (
                                            <Box
                                                key={item.id}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Typography>{item.title}</Typography>
                                                <Typography sx={{ whiteSpace: 'nowrap' }} variant='h5'>{moneyFormat((amount[item.id] && isGifCourse ? amount[item.id] : 1) * Number(item.price))}</Typography>
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
                                        <Typography variant='body2' sx={{ fontSize: 18 }}>{__('Tổng cộng')}</Typography>
                                        <Typography variant='h2' sx={{ fontSize: 26, whiteSpace: 'nowrap', }}>{moneyFormat(groupCourses.products.reduce((total, item) => total + (amount[item.id] && isGifCourse ? amount[item.id] : 1) * parseFloat(item.price), 0))}</Typography>
                                    </Box>
                                    <Divider color="dark" />
                                    {
                                        !tab &&
                                        <Button
                                            disabled={!shoppingCart.data.groups?.products?.length}
                                            onClick={() => {
                                                if (shoppingCart.data.groups?.products?.length) {
                                                    navigate('/cart/payment');
                                                }
                                            }}
                                            variant="contained"
                                        >
                                            {__('Tiếp tục thanh toán')}
                                        </Button>
                                    }
                                    {
                                        tab === 'payment' &&
                                        <Button onClick={handleConfirmOrder} variant="contained">{__('Xác nhận đơn hàng')}</Button>
                                    }
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
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
                        {sectionSaveForLetter}
                        {selctionwishliste}
                    </Box>
                :
                <></>

        }
    </AuthGuard >)
}

export default index