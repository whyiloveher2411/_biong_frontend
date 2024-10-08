import { Box } from '@mui/system'
import Button from 'components/atoms/Button'
import Price from 'components/molecules/Ecommerce/Price'
import NoticeContent from 'components/molecules/NoticeContent'
import { __ } from 'helpers/i18n'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CourseLessonProps, CourseProps, ProcessLearning } from 'services/courseService'
import useShoppingCart from 'store/shoppingCart/useShoppingCart'

function ContentOnlyPurchased({ course, lesson, process, style }: {
    lesson: CourseLessonProps,
    process: ProcessLearning | null,
    course: CourseProps,
    style?: React.CSSProperties
}) {

    const shoppingCart = useShoppingCart();

    const naviagate = useNavigate();

    const inTheCart = (shoppingCart.data.products.findIndex(item => (item.id.toString()) === (course.id.toString())) ?? -1) > -1;

    const handleAddToCart = () => {
        if (course) {
            shoppingCart.addToCart({ ...course, order_quantity: 1 });
            naviagate('/cart');
        }
    }

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)'
            }}
        >
            <NoticeContent
                title='Mở khóa toàn bộ khóa học ngay hôm nay'
                image='/images/undraw_authentication_fsn5.svg'
                description='Đăng ký ngay hoặc mua khóa học này để truy cập tất cả các video, tệp bài tập và nhiều thứ khác nữa.'
                disableButtonHome
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: 2,
                        mt: 3,
                        mb: 6
                    }}>
                    <Price
                        course={course}
                    />
                    {
                        inTheCart ?
                            <Button size="large" sx={{ mt: 2, pl: 3, pr: 3 }} component={Link} to='/cart' variant='contained'>{__('Mua khóa học này')}</Button>
                            :
                            <Button size="large" sx={{ mt: 2, pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>{__('Mua khóa học này')}</Button>
                    }
                </Box>
            </NoticeContent>
        </Box>
    )
}

export default ContentOnlyPurchased