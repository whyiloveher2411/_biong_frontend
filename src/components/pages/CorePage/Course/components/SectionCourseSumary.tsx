import { Box, Button, Chip, Rating, Typography, useTheme } from '@mui/material'
import Icon, { IconProps } from 'components/atoms/Icon'
import Banner, { BannerLoading } from 'components/molecules/Banner'
import Price from 'components/molecules/Ecommerce/Price'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import { numberWithSeparator } from 'helpers/number'
import React from 'react'
import { Link } from 'react-router-dom'
import { CourseProps } from 'services/courseService'
import { ShoppingCartItemProps } from 'store/shoppingCart/shoppingCart.reducers'
import useShoppingCart from 'store/shoppingCart/useShoppingCart'

function SectionCourseSumary({
    course,
    isPurchased,
    type
}: {
    course: CourseProps | null,
    isPurchased: boolean,
    type: {
        [key: string]: {
            title: string,
            icon: IconProps
        }
    }
}) {

    const shoppingCart = useShoppingCart();

    const handleAddToCart = () => {
        shoppingCart.addToCart(course as ShoppingCartItemProps);
    }
    const theme = useTheme();

    if (course) {
        return (
            <>
                <Banner
                    color={course.course_detail?.color ?? '#ffcAb9'}
                    image={getImageUrl(course.featured_image)}
                >

                    <Typography sx={{
                        mt: 3, fontWeight: 500, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.palette.text.disabled,
                        '&:after': {
                            backgroundColor: theme.palette.primary.main,
                            content: "''",
                            display: 'block',
                            height: '2px',
                            marginTop: '16px',
                            width: '80px',
                        }
                    }}>{__('Học viện spacedev.vn')}</Typography>
                    {/* <Typography sx={{ mb: 1 }}>{convertHMS(course.course_detail?.total_time ?? 0, true)}</Typography> */}
                    <Typography variant='h1' sx={{ fontWeight: 400, mb: 2, fontSize: 48, lineHeight: '56px' }}>{course.title}</Typography>
                    <Typography sx={{ mb: 2, fontSize: 16, lineHeight: '24px' }}>{course.description}</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1.5,
                            mb: 2,
                        }}
                    >
                        <Typography sx={{ fontSize: 16, lineHeight: '30px' }}>{__('Kỹ năng:')}</Typography>
                        {
                            course.course_detail?.skills?.map((item, index) => (
                                <Chip
                                    key={index}
                                    label={item.title}
                                />
                            ))
                        }
                    </Box>
                    {
                        Boolean(course.course_detail?.sumary?.rating
                            && course.course_detail?.sumary?.reviewNumber) &&
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 2,
                            }}
                        >
                            <Typography sx={{ fontSize: 16, lineHeight: '30px' }}>
                                {__('Điểm xếp hạng:')}
                            </Typography>
                            <Rating precision={0.1} emptyIcon={<Icon icon="Star" style={{ color: '#a3a3a3' }} />} name="read-only" value={parseFloat(course?.course_detail?.sumary?.rating + '') ?? 0} readOnly />
                            <Typography variant='h5' sx={{ color: '#faaf00', marginTop: '2px' }}>
                                {parseFloat(course?.course_detail?.sumary?.rating + '').toFixed(1)}
                            </Typography>
                            {/* <Typography sx={{ lineHeight: '30px', marginLeft: 0.5 }}>
                                {
                                    __('({{reviewNumber}} ratings)', {
                                        reviewNumber: nFormatter(course.course_detail?.sumary?.reviewNumber ?? 0)
                                    })
                                }
                            </Typography> */}
                            {
                                Boolean(course.course_detail?.sumary?.studentNumber) &&
                                <Typography sx={{ lineHeight: '30px', marginLeft: 0.5 }}>
                                    {
                                        __('({{studentNumber}} học viên)', {
                                            studentNumber: numberWithSeparator(course.course_detail?.sumary?.studentNumber ?? 0)
                                        })
                                    }
                                </Typography>
                            }
                        </Box>
                    }
                    <Box
                        sx={{
                            mb: 2,
                        }}
                    >
                        <Price
                            compare_price={course.compare_price}
                            percent_discount={course.percent_discount}
                            price={course.price}
                            variantPrice="h3"
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center'
                        }}
                    >
                        {
                            course.course_detail?.is_comming_soon ?
                                isPurchased ?
                                    <Button color='inherit' sx={{ pl: 3, pr: 3 }} variant='contained'>{__('Sắp ra mắt')}</Button>
                                    :
                                    shoppingCart.data.groups?.products?.findIndex(item => (item.id + '') === (course.id + '')) > -1
                                        ?
                                        <Button sx={{ pl: 3, pr: 3 }} disableRipple component={Link} to='/cart' variant='contained'>{__('Đi đến trang giỏ hàng')}</Button>
                                        :
                                        <Button sx={{ pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>{__('Đăng ký giữ chỗ')}</Button>
                                :
                                isPurchased ?
                                    <Button disableRipple sx={{ pl: 3, pr: 3 }} component={Link} to={'/course/' + course.slug + '/learning'} variant='contained'>{__('Tiếp tục học')}</Button>
                                    :
                                    shoppingCart.data.groups?.products?.findIndex(item => (item.id + '') === (course.id + '')) > -1
                                        ?
                                        <Button sx={{ pl: 3, pr: 3 }} disableRipple component={Link} to='/cart' variant='contained'>{__('Đi đến trang giỏ hàng')}</Button>
                                        :
                                        <Button sx={{ pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>{__('Thêm vào giỏ hàng')}</Button>
                        }
                    </Box>
                </Banner>
            </>
        )
    }

    return <BannerLoading />
}

export default SectionCourseSumary