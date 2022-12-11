import { Box } from '@mui/system'
import Button from 'components/atoms/Button'
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
                title='Bạn có thể xem khi đã mua khóa học này'
                image='/images/undraw_authentication_fsn5.svg'
                description='Bài học này được bảo vệ, bạn cần mua khóa học trước khi xem nội dung của bài học.'
                disableButtonHome
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 3,
                        mb: 6
                    }}>
                    {
                        inTheCart ?
                            <Button size="large" sx={{ pl: 3, pr: 3 }} component={Link} to='/cart' variant='contained'>{__('Xem giỏ hàng và thanh toán')}</Button>
                            :
                            <Button size="large" sx={{ pl: 3, pr: 3 }} variant='contained' color="secondary" onClick={handleAddToCart}>{__('Thêm vào giỏ hàng và thanh toán')}</Button>
                    }
                </Box>
            </NoticeContent>
        </Box>
    )
}

export default ContentOnlyPurchased