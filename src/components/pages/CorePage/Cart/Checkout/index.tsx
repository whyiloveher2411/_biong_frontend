import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import FieldForm from 'components/atoms/fields/FieldForm';
import AuthGuard from 'components/templates/AuthGuard';
import { __ } from 'helpers/i18n';
import useAjax from 'hook/useApi';
import { useFloatingMessages } from 'hook/useFloatingMessages';
import { moneyFormat } from 'plugins/Vn4Ecommerce/helpers/Money';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CourseProps } from 'services/courseService';
import { RootState } from 'store/configureStore';
import useShoppingCart from 'store/shoppingCart/useShoppingCart';

function Checkout() {

    const shoppingCart = useShoppingCart();

    const user = useSelector((state: RootState) => state.user);

    const [groupCourses, setGroupCourses] = React.useState<{ [key: string]: Array<CourseProps> } | null>(null);

    const { showMessage } = useFloatingMessages();

    const navigate = useNavigate();

    React.useEffect(() => {
        shoppingCart.loadCartSummary((coursesApi) => {
            setGroupCourses(coursesApi);
        });
    }, [shoppingCart.data.groups]);

    if (groupCourses && groupCourses.products?.length < 1) {
        navigate('/cart');
        showMessage(__('You need to put the course in the cart before checkout'), 'warning');
    }



    const [paymentMethod, setPaymentMethod] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setPaymentMethod(isExpanded ? panel : false);
        };

    const ajaxConfirmOrder = useAjax();

    const handleConfirmOrder = () => {
        if (paymentMethod) {

            ajaxConfirmOrder.ajax({
                url: '/vn4-ecommerce/shoppingcart/create',
                data: {
                    products: shoppingCart.data.groups.products,
                    paymentMethod: paymentMethod,
                    promotions: shoppingCart.data.promotions,
                },
                success: (result: { error: number }) => {
                    if (!result.error) {
                        shoppingCart.clearCacheAfterOrder();
                        navigate('/user/' + user.slug + '/edit-profile/orders');
                    }
                }
            });

        } else {
            showMessage(__('Please choose a payment method that suits you!'), 'warning');
        }

    }

    return (<AuthGuard
        title={__('Checkout')}
        isHeaderSticky
        header={<>
            <Typography
                component="h2"
                gutterBottom
                variant="overline"
            >
                {__('Cart')}
            </Typography>
            <Typography
                component="h1"
                gutterBottom
                variant="h3"
            >
                {__('Checkout')}
            </Typography>
        </>}
    >
        {
            groupCourses ?
                groupCourses.products?.length > 0 ?
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 4,
                        }}
                    >
                        <Box
                            sx={{
                                flex: '1 1',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}
                        >
                            <Typography variant='h4'>{__('Payment methods')}</Typography>
                            <Box>

                                <Accordion expanded={paymentMethod === 'bank_transfer'} onChange={handleChange('bank_transfer')}>
                                    <AccordionSummary
                                        sx={{
                                            position: 'relative',
                                            display: 'flex',
                                            width: 1,
                                            alignItems: 'center',
                                            margin: 0,
                                        }}
                                    >
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
                                                //
                                            }}
                                        />
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

                                <Accordion expanded={paymentMethod === 'momo'} onChange={handleChange('momo')}>
                                    <AccordionSummary
                                        sx={{
                                            position: 'relative',
                                            display: 'flex',
                                            width: 1,
                                            alignItems: 'center',
                                            margin: 0,
                                        }}
                                    >

                                        <FieldForm
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
                                                //
                                            }}
                                        />
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
                            {/*
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                }}
                            >
                                <Typography variant='h4'>{__('Bank transfer')}</Typography>
                            </Box> */}
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}
                        >
                            <Typography variant='h4'>{__('Payment methods')}</Typography>
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
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography>{item.title}</Typography>
                                                <Typography variant='h5'>{moneyFormat(item.price)}</Typography>
                                            </Box>
                                        ))
                                    }
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography>{__('Coupon discounts:')}</Typography>
                                        <Typography variant='h5'>-{moneyFormat(0)}</Typography>
                                    </Box>
                                    <Divider color="dark" />
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography variant='body2' sx={{ fontSize: 18 }}>{__('Total')}</Typography>
                                        <Typography variant='h2' sx={{ fontSize: 36 }}>{moneyFormat(groupCourses.products.reduce((total, item) => total + parseFloat(item.price), 0))}</Typography>
                                    </Box>
                                    <Button onClick={handleConfirmOrder} variant="contained">{__('Confirm Order')}</Button>
                                </CardContent>
                            </Card>
                        </Box>

                    </Box>
                    :
                    null
                :
                <></>

        }

    </AuthGuard >)
}

export default Checkout