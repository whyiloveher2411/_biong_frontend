import { Box, Button, Chip, Grid, Rating, Skeleton as MuiSkeleton, SkeletonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import Icon, { IconProps } from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Typography from 'components/atoms/Typography';
import Price from 'components/molecules/Ecommerce/Price';
import { convertHMS, dateFormat } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import { nFormatter, numberWithSeparator } from 'helpers/number';
import React from 'react';
import { Link } from 'react-router-dom';
import { CourseProps } from 'services/courseService';
import { ShoppingCartItemProps } from "store/shoppingCart/shoppingCart.reducers";
import useShoppingCart from "store/shoppingCart/useShoppingCart";
import SectionLearn from './SectionLearn';

const Skeleton = styled((props: SkeletonProps) => (
    <MuiSkeleton {...props} />
))(() => ({
    backgroundColor: 'rgba(255, 255, 255, 0.11)'
}));

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

    const [activePopupLearn, setActivePopupLearn] = React.useState(false);

    const handleAddToCart = () => {
        shoppingCart.addToCart(course as ShoppingCartItemProps);
    }

    if (course) {
        return (

            <>
                <Box
                    sx={{
                        background: '#333',
                        pb: 3,
                        color: 'white',
                        ml: -4,
                        mr: -4,
                        mt: -4,
                        pl: 4,
                        pr: 4,
                    }}
                >
                    <Grid
                        container
                        spacing={3}
                        sx={{
                            maxWidth: 1440,
                            margin: '0 auto',
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            md={4}

                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: 'auto',
                                    p: 1,
                                    borderRadius: 1,
                                    background: 'white',
                                }}
                            >

                                <ImageLazyLoading
                                    src={getImageUrl(course.featured_image)}
                                    name="thumbnail course"
                                    variant='square'
                                    sx={{
                                        height: 350,
                                    }}
                                />
                                {
                                    Boolean(course.course_detail?.total_time) &&
                                    <Chip
                                        sx={{
                                            background: 'rgba(51,51,51,0.8)',
                                            color: 'white',
                                            position: 'absolute',
                                            right: 20,
                                            bottom: 20,
                                            zIndex: 1,
                                        }} label={convertHMS(course.course_detail?.total_time ?? 0, true)} />
                                }
                            </Box>

                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={8}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                <Typography variant="h1" component="h1" sx={{ color: 'white' }}>{course.title}</Typography>
                                <Typography variant='body1' sx={{ color: 'white' }}>{course.description}</Typography>
                                {/* {
                                    Boolean(course.rating_count) &&
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Button size="small" variant='contained' startIcon={<Icon icon="StarRateRounded" />}>{course.rating_avg ?? 0}</Button>
                                        ({numberWithSeparator(course.rating_count ?? 0)} ratings)
                                    </Box>
                                } */}
                                {
                                    Boolean(course.student_count) &&
                                    <Typography variant='body1' sx={{ color: 'white' }}>{numberWithSeparator(course.student_count ?? 0)} students enrolled</Typography>
                                }
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 0.5,
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    {
                                        Boolean(course.course_detail?.sumary?.rating
                                            && course.course_detail?.sumary?.reviewNumber) &&
                                        <>
                                            <Rating precision={0.1} emptyIcon={<Icon icon="Star" style={{ color: '#a3a3a3' }} />} name="read-only" value={parseFloat(course?.course_detail?.sumary?.rating + '') ?? 0} readOnly />
                                            <Typography variant='h5' sx={{ color: '#faaf00' }}>
                                                {parseFloat(course?.course_detail?.sumary?.rating + '').toFixed(1)}
                                            </Typography>
                                            <Typography sx={{ color: 'white', lineHeight: '20px', marginLeft: 0.5 }}>
                                                {
                                                    __('({{reviewNumber}} ratings)', {
                                                        reviewNumber: nFormatter(course.course_detail?.sumary?.reviewNumber ?? 0)
                                                    })
                                                }
                                            </Typography>

                                        </>
                                    }
                                </Box>
                                {
                                    Boolean(course.course_detail?.sumary?.studentNumber) &&
                                    <Typography
                                        sx={{ color: 'white' }}
                                        dangerouslySetInnerHTML={{
                                            __html: __('<strong>{{studentNumber}}</strong> already enrolled', {
                                                studentNumber: numberWithSeparator(course.course_detail?.sumary?.studentNumber ?? 0)
                                            })
                                        }}
                                    />
                                }
                                <Price
                                    compare_price={course.compare_price}
                                    percent_discount={course.percent_discount}
                                    price={course.price}
                                    variantPrice="h3"
                                    sx={{ color: 'white' }}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'center'
                                    }}
                                >
                                    {
                                        isPurchased ?
                                            <Button variant='contained' onClick={() => setActivePopupLearn(true)} >{__('Tiếp tục học')}</Button>
                                            :
                                            shoppingCart.data.groups?.products?.findIndex(item => (item.id + '') === (course.id + '')) > -1
                                                ?
                                                <Button component={Link} to='/cart' variant='contained'>{__('Go To Cart')}</Button>
                                                :
                                                <Button variant='contained' color="secondary" onClick={handleAddToCart}>{__('Add to Cart')}</Button>
                                    }
                                </Box>
                                <Typography variant='body1' sx={{ color: 'white' }}>{__('30-Day Money-Back Guarantee')}</Typography>
                                <Typography variant='body1' sx={{ color: 'white' }}>{__('Last updated {{dateTime}}', {
                                    dateTime: dateFormat(course.updated_at)
                                })}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                {
                    isPurchased &&
                    <SectionLearn open={activePopupLearn} onClose={() => setActivePopupLearn(false)} slug={course.slug} />
                }
            </>
        )
    }

    return (
        <Box
            sx={{
                background: '#333',
                pb: 3,
                color: 'white',
                ml: -4,
                mr: -4,
                mt: -4,
                pl: 4,
                pr: 4,
            }}
        >
            <Grid
                container
                spacing={3}
                sx={{
                    maxWidth: 1440,
                    margin: '0 auto',
                }}
            >
                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <Skeleton
                        variant='rectangular'
                        sx={{
                            width: '100%',
                            height: 336,
                        }}
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={8}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Skeleton>
                            <Typography variant="h3" component="h1" sx={{ color: 'white' }}>
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit
                            </Typography>
                        </Skeleton>
                        <Skeleton>
                            <Typography variant='body1' sx={{ color: 'white' }}>
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum suscipit architecto veniam ipsam deleniti necessitatibus dicta magni explicabo. Omnis exercitationem illum rem culpa!
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum suscipit architecto veniam ipsam deleniti necessitatibus dicta magni explicabo. Omnis exercitationem illum rem culpa!
                            </Typography>
                        </Skeleton>

                        <Skeleton>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'center'
                                }}
                            >
                                <Button size="small" variant='contained' startIcon={<Icon icon="StarRateRounded" />}>5</Button>
                                ({numberWithSeparator(1234)} ratings)
                            </Box>
                        </Skeleton>

                        <Skeleton>
                            <Typography variant='body1' sx={{ color: 'white' }}>{numberWithSeparator(1234)} students enrolled</Typography>
                        </Skeleton>
                        <Skeleton variant='rectangular'>
                            <Box>
                                Ngôn ngữ: English
                            </Box>
                        </Skeleton>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center'
                            }}
                        >
                            <Skeleton variant='rectangular'>
                                <Button variant='contained' color="secondary">Add To Card</Button>
                            </Skeleton>
                            <Skeleton variant='rectangular'>
                                <Button color="inherit" variant='outlined'>Buy Now</Button>
                            </Skeleton>
                        </Box>
                        <Skeleton>
                            <Typography variant='body2' sx={{ color: 'white' }}>30-Day Money-Back Guarantee</Typography>
                        </Skeleton>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default SectionCourseSumary