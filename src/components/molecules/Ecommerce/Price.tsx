import { Box, SxProps, Theme, Typography } from '@mui/material'
import DiscountInfo from 'components/organisms/DiscountInfo'
import { moneyFormat } from 'plugins/Vn4Ecommerce/helpers/Money'
import { CourseProps } from 'services/courseService'

function Price({
    variantPrice = 'h4',
    course,
    ...rest
}: {
    course: CourseProps,
    // percent_discount?: string | number,
    variantPrice?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption" | "button" | "overline" | "inherit",
    sx?: SxProps<Theme>
}) {

    return (
        <Box
            component='span'
            sx={{
                display: 'flex',
                gap: 1,
                // alignItems: 'flex-end',
                alignItems: 'center',
            }}
        >
            <Typography component='span' noWrap variant={variantPrice} {...rest}>
                {moneyFormat(course.price, true, 'Miễn phí')}
            </Typography>
            {
                parseFloat(course.compare_price + '') > 0 &&
                <>
                    <Typography component='span' noWrap variant='h5' sx={{ textDecoration: 'line-through' }} color="error">
                        {moneyFormat(course.compare_price ?? 0)}
                    </Typography>
                </>
            }
            <DiscountInfo
                course={course}
            />
        </Box>
    )
}

export default Price