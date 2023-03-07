import { Alert, Box, Link as MuiLink, Typography } from '@mui/material';
import Button from 'components/atoms/Button';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { __ } from 'helpers/i18n';
import { Link, useNavigate } from 'react-router-dom';
import { CourseProps } from 'services/courseService';
import useShoppingCart from 'store/shoppingCart/useShoppingCart';


function Checkout({ courses, total }: {
    courses: Array<CourseProps> | null,
    total: number | undefined,
}) {

    const shoppingCart = useShoppingCart();

    const navigate = useNavigate();

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
        <Typography variant='h4'>{__('Cách 1: Chuyển khoản bằng QR')}</Typography>
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
                    gap: 2,
                    border: '1px solid',
                    borderColor: 'dividerDark',
                    borderRadius: 2,
                    p: 2,
                    cursor: 'pointer',
                    position: 'relative',
                    fontSize: 16,
                }}
            >
                <Box
                    sx={{
                        background: 'white',
                        borderRadius: 1,
                        p: 1,
                    }}
                >
                    <ImageLazyLoading
                        src={"https://img.vietqr.io/image/970437-004704070012678-hhOqccq.jpg?accountName=Dang%20Thuyen%20Quan&amount=" + total + "&addInfo=" + shoppingCart.data.code.toLocaleUpperCase()}
                        sx={{
                            width: 150,
                            height: 150,
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}
                >
                    <Typography sx={{ fontSize: 18 }}>Bước 1: Mở app ngân hàng hoặc ví điện tử Momo, ZaloPay,... và quét mã QR.</Typography>
                    <Typography sx={{ fontSize: 18 }}>Bước 2: Đảm bảo nội dung chuyển khoản là <Typography component="span" sx={{ color: 'success.main', fontWeight: 'bold', userSelect: 'text', }}>{shoppingCart.data.code.toLocaleUpperCase()}</Typography></Typography>
                    <Typography sx={{ fontSize: 18 }}>Bước 3: Thực hiện thanh toán.</Typography>
                </Box>
            </Box>

            <Typography variant='h4'>{__('Cách 2: Chuyển khoản thủ công')}</Typography>
            <Alert color='info' sx={{ mt: -2, fontSize: 16, }} icon={false}>
                <Typography><strong>Ngân hàng:</strong> Ngân hàng thương mại cổ phần Phát triển Thành phố Hồ Chí Minh (HDBank)</Typography>
                <Typography><strong>Chi nhánh:</strong> Nguyễn Trải</Typography>
                <Typography><strong>Tài khoản thụ hưởng:</strong> 004704070012678 - DANG THUYEN QUAN</Typography>
                <Typography><strong>Nội dung chuyển khoản:</strong> <Typography component={'span'} sx={{ textTransform: 'uppercase' }}>{shoppingCart.data.code}</Typography></Typography>
            </Alert>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                <Alert color='warning' sx={{ mt: 1, fontSize: 14, }} icon={false}>
                    <Typography>Sau khi thanh toán, hãy bấm nút "Xác nhận thanh toán", đơn hàng của bạn sẽ được xử lý trong vòng 2h đến 24h. </Typography>
                    <Typography>Nếu bạn không thể tìm thấy phương thức thanh toán phù hợp, bạn có thể liên hệ với chúng tôi qua fanpage <Typography sx={{ color: 'primary.main' }} component={MuiLink} href="https://www.facebook.com/spacedev.vn" target='_blank'>https://www.facebook.com/spacedev.vn</Typography> hoặc số điện thoại 0886871094 (Quân) để được hướng đẫn các phương thức khác</Typography>
                </Alert>
            </Box>
            <Box>
                <Button variant='outlined' color='inherit' component={Link} to="/cart">{__('Quay lại giỏ hàng')}</Button>
            </Box>
        </Box>
    </Box>
}

export default Checkout