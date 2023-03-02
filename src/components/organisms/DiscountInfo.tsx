import { Box, Chip, SxProps, Typography } from '@mui/material'
import TooltipWhite from 'components/atoms/TooltipWhite'
import { dateFormat } from 'helpers/date'
import { moneyFormat, precentFormat } from 'plugins/Vn4Ecommerce/helpers/Money'
import React from 'react'
import { CourseProps } from 'services/courseService'

function DiscountInfo({
    course,
    sx,
    children
}: {
    course: CourseProps,
    sx?: SxProps,
    children?: React.ReactElement,
}) {

    const [discountInfo, setDiscountInfo] = React.useState<CourseProps['discount_info'] | null>(null)

    const precent_discount = Number(Number(100 - (Number(course.price) * 100 / (Number(course.compare_price) ?? 1))).toFixed(1));

    React.useEffect(() => {
        let discount_info = course.discount_info;

        if (typeof discount_info === 'string') {
            try {
                discount_info = JSON.parse(discount_info);
            } catch (error) {
                discount_info = null;
            }
        }

        setDiscountInfo(discount_info);

    }, [course]);

    if (precent_discount > 0 && discountInfo) {
        return (<TooltipWhite
            title={<>
                <Typography variant='h5'>{discountInfo.title}&nbsp;&nbsp;<Chip component='span' color='error' size='small' label={'- ' + precentFormat(precent_discount ?? 0)} />
                </Typography>
                <Typography variant='body2' sx={{ mt: 1, fontSize: 14, lineHeight: '24px' }}>Chương trình khuyến mãi áp dụng từ ngày {dateFormat(discountInfo.start_time, 'DD-MM-YYYY')} đến hết ngày {dateFormat(discountInfo.end_time, 'DD-MM-YYYY')}, khóa học {course.title} giá gốc <Typography component='span' sx={{ color: 'error.main', display: 'inline-block', }}>{moneyFormat(course.compare_price)}</Typography> còn <Typography component='span' sx={{ color: 'success.main', display: 'inline-block', }}>{moneyFormat(course.price)}</Typography>
                    {
                        discountInfo.note ?
                            <Box
                                component="span"
                                sx={{
                                    '& p': {
                                        margin: 0,
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: discountInfo.note }}
                            />
                            : null
                    }
                </Typography>
            </>}
        >
            {
                children ?
                    children :
                    <Chip
                        size="small"
                        sx={{
                            backgroundColor: 'secondary.main',
                            color: 'white',
                            cursor: 'pointer',
                            ...sx,
                        }}
                        // label="Đang khuyến mãi"
                        label={discountInfo.title + ' - ' + precentFormat(precent_discount)}
                    />
            }
        </TooltipWhite>)

    }

    return null;
}

export default DiscountInfo