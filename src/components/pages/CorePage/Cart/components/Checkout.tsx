import { Box, Typography, Alert } from '@mui/material';
import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { __ } from 'helpers/i18n';
import { Link, useNavigate } from 'react-router-dom';
import { CourseProps } from 'services/courseService';
import { ShoppingCartProps } from 'store/shoppingCart/shoppingCart.reducers';
import useShoppingCart from 'store/shoppingCart/useShoppingCart';


function Checkout({ courses }: {
    courses: Array<CourseProps> | null,
}) {

    const shoppingCart = useShoppingCart();

    const navigate = useNavigate();

    const handleChange = (payment_method: ShoppingCartProps['payment_method']) => () => {
        shoppingCart.updateCart({
            ...shoppingCart.data,
            payment_method: payment_method
        });
    }

    // React.useEffect(() => {
    //     shoppingCart.loadCartSummary((coursesApi) => {
    //         setGroupCourses(coursesApi);
    //     });
    // }, [shoppingCart.data.groups]);

    if (courses && courses.length < 1) {
        navigate('/cart');
        window.showMessage(__('Bạn cần đặt khóa học vào giỏ hàng trước khi thanh toán'), 'warning');
    }

    // const [paymentMethod, setPaymentMethod] = React.useState<string | false>(false);

    // const handleChange =
    //     (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    //         setPaymentMethod(isExpanded ? panel : false);
    //     };

    return <Box
        sx={{
            flex: '1 1',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
        }}
    >
        <Typography variant='h4'>{__('Phương thức thanh toán')}</Typography>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}
        >

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
                className={shoppingCart.data.payment_method === 'bank_transfer' ? 'active' : ''}
                onClick={handleChange('bank_transfer')}
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
                <Typography>Thanh toán bằng tài khoản ngân hàng qua internet banking bằng tính năng thanh toán trực tuyến của các ngân hàng, chuyển khoản liên ngân hàng đến tất cả các ngân hàng nội địa nhanh chống.</Typography>
                {
                    shoppingCart.data.payment_method === 'bank_transfer' &&
                    <Alert color='info' sx={{ mt: 1, fontSize: 14, }} icon={false}>
                        <Typography variant='h4' sx={{ mb: 1 }}>Thông tin chuyển khoản</Typography>
                        <Typography><strong>Ngân hàng:</strong> Ngân hàng thương mại cổ phần Phát triển Thành phố Hồ Chí Minh (HDBank)</Typography>
                        <Typography><strong>Chi nhánh:</strong> Nguyễn Trải</Typography>
                        <Typography><strong>Tài khoản thụ hưởng:</strong> 004704070012678 - DANG THUYEN QUAN</Typography>
                        <Typography><strong>Nội dung chuyển khoản:</strong> <Typography component={'span'} sx={{ textTransform: 'uppercase' }}>{shoppingCart.data.code}</Typography></Typography>
                    </Alert>
                }
                <Icon className="icon-check" icon="CheckCircleRounded" color="success" />
            </Box>

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
                className={shoppingCart.data.payment_method === 'momo' ? 'active' : ''}
                onClick={handleChange('momo')}
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
                    shoppingCart.data.payment_method === 'momo' &&
                    <Alert color='info' sx={{ mt: 1, fontSize: 14, }} icon={false}>
                        <Typography variant='h4' sx={{ mb: 1 }}>Thông tin chuyển khoản</Typography>
                        <Typography><strong>Số điện thoại:</strong> 0886871094</Typography>
                        <Typography><strong>Tên người nhận:</strong> ĐẶNG THUYỀN QUÂN</Typography>
                        <Typography><strong>Nội dung chuyển khoản:</strong> <Typography component={'span'} sx={{ textTransform: 'uppercase' }}>{shoppingCart.data.code}</Typography></Typography>
                    </Alert>
                }
                <Icon className="icon-check" icon="CheckCircleRounded" color="success" />
            </Box>

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
                className={shoppingCart.data.payment_method === 'zalopay' ? 'active' : ''}
                onClick={handleChange('zalopay')}
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
                    shoppingCart.data.payment_method === 'zalopay' &&
                    <Alert color='info' sx={{ mt: 1, fontSize: 14, }} icon={false}>
                        <Typography variant='h4' sx={{ mb: 1 }}>Thông tin chuyển khoản</Typography>
                        <Typography><strong>Số điện thoại:</strong> 0886871094</Typography>
                        <Typography><strong>Tên người nhận:</strong> ĐẶNG THUYỀN QUÂN</Typography>
                        <Typography><strong>Nội dung chuyển khoản:</strong> <Typography component={'span'} sx={{ textTransform: 'uppercase' }}>{shoppingCart.data.code}</Typography></Typography>
                    </Alert>
                }
                <Icon className="icon-check" icon="CheckCircleRounded" color="success" />
            </Box>

            <Box>
                <Button variant='outlined' color='inherit' component={Link} to="/cart">{__('Quay lại giỏ hàng')}</Button>
            </Box>
        </Box>
    </Box>
}

export default Checkout