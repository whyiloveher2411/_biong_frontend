import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import React from 'react'
import { useSelector } from 'react-redux';
import { CourseProps } from 'services/courseService'
import { RootState } from 'store/configureStore';
import useShoppingCart from 'store/shoppingCart/useShoppingCart';
import { UserState } from 'store/user/user.reducers';
import useAjax from 'hook/useApi';
import { Link, useNavigate } from 'react-router-dom';
import { clearAllCacheWindow } from 'hook/cacheWindow';
import { SxProps, Theme } from '@mui/material';

function ButtonBuy({
    course,
    isPurchased,
    sx
}: {
    course: CourseProps | null,
    isPurchased: boolean,
    sx?: SxProps<Theme>,
}) {

    const user = useSelector((state: RootState) => state.user);

    const shoppingCart = useShoppingCart();

    const ajaxConfirmOrder = useAjax();

    const navigate = useNavigate();

    const handleConfirmOrder = () => {

        if (course) {
            if (Number(course.price) === 0) {
                ajaxConfirmOrder.ajax({
                    url: '/vn4-ecommerce/shoppingcart/create',
                    data: {
                        products: [{ id: course.id, order_quantity: 1 }],
                        paymentMethod: 'bank_transfer',
                        // promotions: shoppingCart.data.promotions,
                        is_gift: false,
                    },
                    success: (result: { error: number, order_id: ID }) => {
                        if (!result.error) {
                            clearAllCacheWindow();
                            navigate('/course/' + course.slug + '/learning');
                        }
                    }
                });
            }
        }
    }

    const handleAddToCart = () => {
        if (course) {
            shoppingCart.addToCart({ ...course, order_quantity: 1 });
        }
    }

    if (course) {
        const inTheCart = (shoppingCart.data.products.findIndex(item => (item.id.toString()) === (course.id.toString())) ?? -1) > -1;

        return (<Box
            sx={[{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                flexWrap: 'wrap',
            },
            (theme) => ({
                ...(typeof sx === 'function' ? sx(theme) : sx ?? {}),
            })
            ]}
        >
            {
                user._state === UserState.identify ?
                    <>
                        {
                            inTheCart ?
                                <Button size="large" sx={{ pl: 3, pr: 3, '--boxShadow': '#797979' }} color="inherit" component={Link} to='/cart' variant='contained'>Đến trang giỏ hàng</Button>
                                :
                                isPurchased ?
                                    Number(course.price) ?
                                        <Button size="large" sx={{ pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>Mua để tặng</Button>
                                        :
                                        <></>
                                    :
                                    course.course_detail?.is_comming_soon ?
                                        <Button size="large" sx={{ pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>Đăng ký giữ chỗ</Button>
                                        :
                                        Number(course.price) ?
                                            <Button size="large" sx={{ pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>Thêm vào giỏ hàng</Button>
                                            :
                                            <LoadingButton loading={ajaxConfirmOrder.open} size="large" sx={{ pl: 3, pr: 3 }} variant='contained' color="primary" onClick={handleConfirmOrder}>Vào học ngay</LoadingButton>
                        }
                        {
                            isPurchased ?
                                <Button disabled={Boolean(course.course_detail?.is_comming_soon)} size="large" disableRipple sx={{ pl: 3, pr: 3 }} component={Link} to={'/course/' + course.slug + '/learning'} variant='contained'>{
                                    course.course_detail?.is_comming_soon ? 'Sắp ra mắt' : 'Vào học ngay'}</Button>
                                :
                                course.course_detail?.is_allow_trial ?
                                    <Button disabled={Boolean(course.course_detail?.is_comming_soon)} size="large" disableRipple sx={{ pl: 3, pr: 3 }} component={Link} to={'/course/' + course.slug + '/learning'} variant='contained'>Học thử miễn phí</Button>
                                    :
                                    <></>
                        }
                    </>
                    :
                    course.course_detail?.is_comming_soon ?
                        <Button size="large" sx={{ pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>Đăng ký giữ chỗ</Button>
                        :
                        <>
                            {
                                Number(course.price) ?
                                    <Button size="large" sx={{ pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>Thêm vào giỏ hàng</Button>
                                    :
                                    <></>
                            }
                            {
                                Boolean(course.course_detail?.is_allow_trial || !Number(course.price)) &&
                                <Button size="large" sx={{ pl: 3, pr: 3 }} variant='contained' component={Link} to={'/course/' + course.slug + '/learning'}>{Number(course.price) ? 'Học thử miễn phí' : 'Vào học ngay'}</Button>
                            }
                        </>
            }

        </Box>)

    }

    return null;
}

export default ButtonBuy