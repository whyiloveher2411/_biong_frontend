import { Box, Chip, SxProps, Theme, Typography } from '@mui/material'
import { moneyFormat, precentFormat } from 'plugins/Vn4Ecommerce/helpers/Money'
import React from 'react'

function Price({
    price,
    compare_price,
    // percent_discount,
    variantPrice = 'h4',
    ...rest
}: {
    price: string | number
    compare_price?: string | number,
    // percent_discount?: string | number,
    variantPrice?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "caption" | "button" | "overline" | "inherit",
    sx?: SxProps<Theme>
}) {

    const precent_discount = Number(Number(100 - (Number(price) * 100 / (Number(compare_price) ?? 1))).toFixed(1));

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
                {moneyFormat(price, true, 'Miễn phí')}
            </Typography>
            {
                parseFloat(compare_price + '') > 0 &&
                <>
                    <Typography component='span' variant='h5' sx={{ textDecoration: 'line-through' }} color="error">
                        {moneyFormat(compare_price ?? 0)}
                    </Typography>
                </>
            }
            {
                parseFloat(precent_discount + '') > 0 &&
                <Chip component='span' color='error' size='small' label={'- ' + precentFormat(precent_discount ?? 0)} />
            }
        </Box>
    )
}

export default Price