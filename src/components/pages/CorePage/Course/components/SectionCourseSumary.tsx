import { Box, Button, Chip, Rating, Typography, useTheme } from '@mui/material'
import Divider from 'components/atoms/Divider'
import Icon from 'components/atoms/Icon'
import Banner, { BannerLoading } from 'components/molecules/Banner'
import DrawerCustom from 'components/molecules/DrawerCustom'
import Price from 'components/molecules/Ecommerce/Price'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import { nFormatter, numberWithSeparator } from 'helpers/number'
import useQuery from 'hook/useQuery'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { CourseProps } from 'services/courseService'
import { RootState } from 'store/configureStore'
import useShoppingCart from 'store/shoppingCart/useShoppingCart'
import { UserState } from 'store/user/user.reducers'
import RoadmapDetail from '../../Roadmap/components/RoadmapDetail'

function SectionCourseSumary({
    course,
    isPurchased,
}: {
    course: CourseProps | null,
    isPurchased: boolean,
}) {

    const user = useSelector((state: RootState) => state.user);

    const urlParam = useQuery({
        open_roadmap: -1,
    });

    const shoppingCart = useShoppingCart();

    const handleAddToCart = () => {
        if (course) {
            shoppingCart.addToCart({ ...course, order_quantity: 1 });
        }
    }
    const theme = useTheme();

    if (course) {

        const inTheCart = (shoppingCart.data.products.findIndex(item => (item.id.toString()) === (course.id.toString())) ?? -1) > -1;

        return (
            <>
                <Banner
                    color={course.course_detail?.color ?? '#ffcAb9'}
                    image={getImageUrl(course.course_detail?.banner ?? course.featured_image)}
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
                    {
                        Boolean(course.course_detail?.skills) &&
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
                    }
                    {
                        Boolean(course.course_detail?.roadmaps && course.course_detail?.roadmaps.length > 0) &&
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1.5,
                                mb: 2,
                            }}
                        >
                            <Typography sx={{ fontSize: 16, lineHeight: '30px' }}>{__('Roadmap:')}</Typography>
                            {
                                course.course_detail?.roadmaps?.map((item, index) => (
                                    <React.Fragment
                                        key={item.id}
                                    >
                                        <Typography
                                            // label={item.title}
                                            onClick={() => {
                                                urlParam.changeQuery({
                                                    open_roadmap: index,
                                                });
                                            }}
                                            sx={{
                                                // cursor: 'pointer',
                                                // background: item.background,
                                                // color: 'white',
                                                cursor: 'pointer',
                                                color: 'primary.main',
                                                lineHeight: '30px',
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                        {
                                            index < ((course?.course_detail?.roadmaps?.length ?? 0) - 1) &&
                                            <Divider color='dark' flexItem orientation="vertical" />
                                        }
                                    </React.Fragment>
                                ))
                            }
                        </Box>
                    }

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
                        <Rating precision={0.1} emptyIcon={<Icon icon="Star" style={{ color: '#a3a3a3' }} />} name="read-only" value={parseFloat(course?.course_detail?.review_avg + '') ?? 0} readOnly />
                        <Typography variant='h5' sx={{ color: '#faaf00', marginTop: '2px' }}>
                            {parseFloat((course?.course_detail?.review_avg ?? 0) + '').toFixed(1)}
                        </Typography>
                        {
                            Boolean(course.course_detail?.sumary?.reviewNumber) &&
                            <Typography sx={{ lineHeight: '30px', marginLeft: 0.5 }}>
                                {
                                    __('({{reviewNumber}} đánh giá)', {
                                        reviewNumber: nFormatter(course.course_detail?.sumary?.reviewNumber ?? 0)
                                    })
                                }
                            </Typography>
                        }
                        {
                            Boolean(course.course_detail?.sumary?.studentNumber) &&
                            <Typography sx={{ lineHeight: '30px', marginLeft: 0.5 }}>
                                {
                                    __('{{studentNumber}} học viên', {
                                        studentNumber: numberWithSeparator(course.course_detail?.sumary?.studentNumber ?? 0)
                                    })
                                }
                            </Typography>
                        }
                    </Box>

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
                            alignItems: 'center',
                        }}
                    >
                        {
                            user._state === UserState.identify ?
                                <>
                                    {
                                        inTheCart ?
                                            <Button size="large" sx={{ pl: 3, pr: 3 }} color="inherit" component={Link} to='/cart' variant='contained'>{__('Đi đến trang giỏ hàng')}</Button>
                                            :
                                            isPurchased ?
                                                <Button size="large" sx={{ pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>{__('Mua để tặng')}</Button>
                                                :
                                                course.course_detail?.is_comming_soon ?
                                                    <Button size="large" sx={{ pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>{__('Đăng ký giữ chỗ')}</Button>
                                                    :
                                                    <Button size="large" sx={{ pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>{__('Thêm vào giỏ hàng')}</Button>
                                    }
                                    {
                                        isPurchased ?
                                            <Button disabled={Boolean(course.course_detail?.is_comming_soon)} size="large" disableRipple sx={{ pl: 3, pr: 3 }} component={Link} to={'/course/' + course.slug + '/learning'} variant='contained'>{
                                                course.course_detail?.is_comming_soon ? __('Sắp ra mắt') : __('Vào học ngay')}</Button>
                                            :
                                            course.course_detail?.is_allow_trial ?
                                                <Button disabled={Boolean(course.course_detail?.is_comming_soon)} size="large" disableRipple sx={{ pl: 3, pr: 3 }} component={Link} to={'/course/' + course.slug + '/learning'} variant='contained'>{__('Học thử miễn phí')}</Button>
                                                :
                                                <></>
                                    }
                                </>
                                :
                                course.course_detail?.is_comming_soon ?
                                    <Button size="large" sx={{ pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>{__('Đăng ký giữ chỗ')}</Button>
                                    :
                                    <>
                                        <Button size="large" sx={{ pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>{__('Thêm vào giỏ hàng')}</Button>
                                        {
                                            Boolean(course.course_detail?.is_allow_trial) &&
                                            <Button size="large" sx={{ pl: 3, pr: 3 }} variant='contained' component={Link} to={'/auth'}>{__('Học thử miễn phí')}</Button>
                                        }
                                    </>
                        }

                    </Box>
                </Banner>

                <DrawerCustom
                    open={Boolean(course.course_detail?.roadmaps?.[Number(urlParam.query.open_roadmap)])}
                    width="1290px"
                    onCloseOutsite
                    onClose={() => {
                        urlParam.changeQuery({
                            open_roadmap: -1
                        });
                    }}
                    title={'Roadmap ' + course.course_detail?.roadmaps?.[Number(urlParam.query.open_roadmap)]?.title}
                >
                    <RoadmapDetail
                        disableActionBack
                        activeCourseSlug={course.slug}
                        slug={course.course_detail?.roadmaps?.[Number(urlParam.query.open_roadmap)]?.slug ?? ''}
                    />
                </DrawerCustom>

            </>
        )
    }

    return <BannerLoading />
}

export default SectionCourseSumary