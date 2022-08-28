import { Accordion, AccordionDetails, AccordionSummary, Box, Radio, Typography } from '@mui/material';
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
        window.showMessage(__('You need to put the course in the cart before checkout'), 'warning');
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
        <Box>

            <Accordion expanded={paymentMethod === 'bank_transfer'} onChange={() => handleChange('bank_transfer')}>
                <AccordionSummary
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        width: 1,
                        alignItems: 'center',
                        margin: 0,
                    }}
                >
                    <Radio
                        onChange={() => {
                            handleChange('bank_transfer')
                        }}
                        checked={paymentMethod === 'bank_transfer'}
                    />
                    {/*
                    <FieldForm
                        component='radio'
                        config={{
                            title: false,
                            list_option: {
                                bank_transfer: { title: '' }
                            }
                        }}
                        post={{ payment_methods: paymentMethod }}
                        name="payment_methods"
                        onReview={() => {
                            handleChange('bank_transfer')
                        }}
                    /> */}

                    <Typography sx={{ width: '33%', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        Bank transfer
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                        Thẻ ATM nội địa, Thẻ Visa, Master, JCB...
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography sx={{ mb: 1 }}>
                        Thanh toán bằng tài khoản ngân hàng qua internet banking bằng tính năng thanh toán trực tuyến của các ngân hàng, chuyển khoản liên ngân hàng đến tất cả các ngân hàng nội địa nhanh chống.

                    </Typography>
                    <Typography>
                        <strong>Ghi chú: </strong>
                        <i>Chúng tôi sẽ thông tin cho bạn chi tiết chuyển khoản ngay khi xác nhận đơn hàng.</i>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={paymentMethod === 'momo'} onChange={() => handleChange('momo')}>
                <AccordionSummary
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        width: 1,
                        alignItems: 'center',
                        margin: 0,
                    }}
                >
                    <Radio
                        onChange={() => {
                            handleChange('momo')
                        }}
                        checked={paymentMethod === 'momo'}
                    />

                    {/* <FieldForm
                        component='radio'
                        config={{
                            title: false,
                            list_option: {
                                momo: { title: '' }
                            }
                        }}
                        post={{ payment_methods: paymentMethod }}
                        name="payment_methods"
                        onReview={() => {
                            handleChange('momo')
                        }}
                    /> */}
                    <Typography sx={{ width: '33%', flexShrink: 0, display: 'flex', alignItems: 'center' }}>Thanh toán bằng ví điện tử MoMo</Typography>
                    <Typography sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                        Thẻ ATM nội địa, Thẻ Visa, Master, JCB...
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography sx={{ mb: 1 }}>
                        Chuyển tiền đến 45 ngân hàng nội địa tiện lợi, nhanh chóng, hoàn toàn bảo mật, nhận tiền tức thì.
                    </Typography>
                    <Typography>
                        <strong>Ghi chú: </strong>
                        <i>Chúng tôi sẽ thông tin cho bạn chi tiết chuyển khoản ngay khi xác nhận đơn hàng.</i>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    </Box>
}

export default Checkout