import { Box, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';
import { useNavigate } from 'react-router-dom';
import { CourseProps } from 'services/courseService';


function Checkout({ groupCourses, paymentMethod, handleChange }: {
    groupCourses: { [key: string]: Array<CourseProps> } | null,
    paymentMethod: 'bank_transfer' | 'momo',
    handleChange: (payment: 'bank_transfer' | 'momo') => void,
}) {

    // const shoppingCart = useShoppingCart();

    const navigate = useNavigate();

    // React.useEffect(() => {
    //     shoppingCart.loadCartSummary((coursesApi) => {
    //         setGroupCourses(coursesApi);
    //     });
    // }, [shoppingCart.data.groups]);

    if (groupCourses && groupCourses.products?.length < 1) {
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
                    gap: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 2,
                    cursor: 'pointer',
                    '&:hover, &.active': {
                        borderColor: 'primary.main',
                    },
                    '& .icon-check': {
                        opacity: 0,
                    },
                    '&.active .icon-check': {
                        opacity: 1,
                    },
                }}
                className={paymentMethod === 'bank_transfer' ? 'active' : ''}
                onClick={() => handleChange('bank_transfer')}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    <Typography variant='h5'>Bank transfer</Typography>
                    <Typography>Thanh toán bằng tài khoản ngân hàng qua internet banking bằng tính năng thanh toán trực tuyến của các ngân hàng, chuyển khoản liên ngân hàng đến tất cả các ngân hàng nội địa nhanh chống.</Typography>
                </Box>
                <Icon className="icon-check" icon="CheckCircleRounded" color="success" />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 2,
                    cursor: 'pointer',
                    '&:hover, &.active': {
                        borderColor: 'primary.main',
                    },
                    '& .icon-check': {
                        opacity: 0,
                    },
                    '&.active .icon-check': {
                        opacity: 1,
                    },
                }}
                className={paymentMethod === 'momo' ? 'active' : ''}
                onClick={() => handleChange('momo')}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    <Typography variant='h5'>Thanh toán bằng ví điện tử MoMo</Typography>
                    <Typography>Chuyển tiền đến 45 ngân hàng nội địa tiện lợi, nhanh chóng, hoàn toàn bảo mật, nhận tiền tức thì.</Typography>
                </Box>
                <Icon className="icon-check" icon="CheckCircleRounded" color="success" />
            </Box>

        </Box>
    </Box>
}

export default Checkout