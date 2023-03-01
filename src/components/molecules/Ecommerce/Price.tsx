import { Box, Chip, SxProps, Theme, Typography } from '@mui/material'
import DiscountInfo from 'components/organisms/DiscountInfo'
import { moneyFormat, precentFormat } from 'plugins/Vn4Ecommerce/helpers/Money'
import React from 'react'
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

    const precent_discount = Number(Number(100 - (Number(course.price) * 100 / (Number(course.compare_price) ?? 1))).toFixed(1));

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
            <Typography component='span' variant={variantPrice} {...rest}>
                {moneyFormat(course.price, true, 'Miễn phí')}
            </Typography>
            {
                parseFloat(course.compare_price + '') > 0 &&
                <>
                    <Typography component='span' variant='h5' sx={{ textDecoration: 'line-through' }} color="error">
                        {moneyFormat(course.compare_price ?? 0)}
                    </Typography>
                </>
            }
            {
                parseFloat(precent_discount + '') > 0 &&
                <DiscountInfo
                    course={course}
                    sx={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        zIndex: 1,
                    }}
                >
                    <Chip sx={{ cursor: 'pointer' }} component='span' color='error' size='small' label={(course.discount_info?.title ? course.discount_info?.title + ' ' : '') + '- ' + precentFormat(precent_discount ?? 0)} />
                </DiscountInfo>
            }
        </Box>
    )
}

export default Price