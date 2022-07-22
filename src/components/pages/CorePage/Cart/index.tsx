import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import NoticeContent from 'components/molecules/NoticeContent';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import { useFloatingMessages } from 'hook/useFloatingMessages';
import { moneyFormat } from 'plugins/Vn4Ecommerce/helpers/Money';
import React from 'react';
import { Link } from 'react-router-dom';
import { CourseProps } from 'services/courseService';
import useShoppingCart from 'store/shoppingCart/useShoppingCart';
import CourseCollection from './components/CourseCollection';

function index() {

    const shoppingCart = useShoppingCart();

    const [groupCourses, setGroupCourses] = React.useState<{ [key: string]: Array<CourseProps> } | null>(null);

    const handleRemoveItemToCart = (item: CourseProps, groupName = 'products') => () => {
        shoppingCart.removeToCart(item, groupName);
    }

    const { showMessage } = useFloatingMessages();

    React.useEffect(() => {
        shoppingCart.loadCartSummary((coursesApi) => {
            setGroupCourses(coursesApi);
        });
    }, [shoppingCart.data.groups]);

    const sectionCart = groupCourses ? <CourseCollection
        title={__('{{count}} Course in Cart', {
            count: groupCourses.products?.length
        })}
        courses={groupCourses.products}
        action={(course) => <>
            <Typography
                component={'span'}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={handleRemoveItemToCart(course)}
            >
                {__('Remove')}
            </Typography>
            <Typography
                component={'span'}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={() => shoppingCart.moveProductToGroupOther(course, 'products', 'save_for_letter')}
            >
                {__('Save for Later')}
            </Typography>
            <Typography
                component={'span'}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={() => shoppingCart.moveProductToGroupOther(course, 'products', 'wishlis')}
            >
                {__('Move to Wishlis')}
            </Typography>
        </>}
    /> : null;

    const sectionSaveForLetter = groupCourses ? <CourseCollection
        title={__('Saved for later', {
            count: groupCourses.save_for_letter?.length
        })}
        courses={groupCourses.save_for_letter}
        action={(course) => <>
            <Typography
                component={'span'}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={handleRemoveItemToCart(course, 'save_for_letter')}
            >
                {__('Remove')}
            </Typography>
            <Typography
                component={'span'}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={() => shoppingCart.moveProductToGroupOther(course, 'save_for_letter', 'products')}
            >{__('Move to Cart')}</Typography>
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
                {__('Remove')}
            </Typography>
            <Typography
                component={'span'}
                sx={{ cursor: 'pointer', color: 'primary.main' }}
                onClick={() => shoppingCart.moveProductToGroupOther(course, 'wishlis', 'products')}
            >{__('Move to Cart')}</Typography>
        </>}
    /> : null


    return (<Page
        title={__('Shopping Cart')}
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
                {__('Shopping Cart')}
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
                                alignItems: 'flex-start',
                                flexDirection: 'column',
                                gap: 4,
                            }}
                        >
                            {sectionCart}
                            {sectionSaveForLetter}
                            {selctionwishliste}
                        </Box>

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
                                <Typography variant='body2' sx={{ fontSize: 18 }}>{__('Total')}</Typography>
                                <Typography variant='h2' sx={{ fontSize: 36 }}>{moneyFormat(groupCourses.products.reduce((total, item) => total + parseFloat(item.price), 0))}</Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        mt: 1,
                                        gap: 1,
                                    }}
                                >
                                    <FieldForm
                                        component='text'
                                        config={{
                                            title: 'Promotions',
                                            size: 'small',
                                        }}
                                        post={{ promotions: '' }}
                                        name="promotions"
                                        onReview={() => {
                                            //
                                        }}
                                    />
                                    <Button variant='contained' onClick={() => showMessage(__('The coupon code entered is not valid for this course.'), 'warning')}>{__('Apply')}</Button>
                                </Box>
                                <Button component={Link} to={'/cart/checkout'} variant="contained">{__('Checkout')}</Button>

                            </CardContent>
                        </Card>

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
                                title='Cart is empty'
                                description={__('Look like you have no items in your shopping cart.')}
                                image="/images/empty_cart.svg"
                                buttonLabel={__('Keep shopping')}
                                buttonLink="/course"
                            />
                        </div>
                        {sectionSaveForLetter}
                        {selctionwishliste}
                    </Box>
                :
                <></>

        }
    </Page>)
}

export default index