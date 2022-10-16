import { Box, Card, CardContent, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { getImageUrl } from 'helpers/image';
import { moneyFormat } from 'plugins/Vn4Ecommerce/helpers/Money';
import { Link } from 'react-router-dom';
import { OrderProps } from 'services/eCommerceService';

function OrderSingle({ order, status }: {
    order: OrderProps,
    status: {
        list_option: {
            [key: string]: {
                title: string,
                color: string
            }
        }
    }
}) {

    return (
        <Card>
            <CardContent
                sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'space-between'
                    }}
                >
                    <Typography>
                        <Box
                            component='span'
                            sx={{
                                display: 'inline-block',
                                width: 5,
                                height: 5,
                                borderRadius: '50%',
                                background: status.list_option[order.order_status]?.color,
                                mr: 1
                            }}
                        />
                        {convertTitleOrder(order.order_status)}
                    </Typography>
                    {/* <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        {__('Ngày đặt hàng')}: {dateTimeFormat(order.date_created)}
                    </Typography> */}
                    {/* {
                        order.order_status === 'pending' &&
                        <Alert variant='filled' severity="info" >Chuyển tiền theo cú pháp sau sẽ giúp đơn hàng nhanh chóng được xác nhận hơn:
                            &nbsp;<Label color={status.list_option[order.order_status]?.color}>{order.title}</Label>
                        </Alert>
                    } */}
                </Box>
                <Divider color="dark" />
                {
                    Boolean(order.products?.items) &&
                    <>
                        {
                            order.products?.items?.map((product) => (
                                <Link key={product.id} to={"/course/" + product.slug}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            width: '100%',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 2,
                                                width: '100%',
                                            }}
                                        >
                                            <ImageLazyLoading sx={{ borderRadius: 1, width: 80, height: 80 }} src={getImageUrl(product.featured_image)} />
                                            <Typography variant='h4' component='h2'>{product.title}</Typography>
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'nowrap' }} component='h3'>{moneyFormat(product.price)}</Typography>
                                    </Box>
                                </Link>
                            ))
                        }
                        {/* <Divider color="dark" /> */}
                    </>
                }
                {/* <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Button>
                        {__('Xem chi tiết')}
                    </Button>
                    <Typography sx={{ whiteSpace: 'nowrap' }} align='right' variant='h5'>{__('Tổng cộng: {{money}}', {
                        money: moneyFormat(order.products?.total ?? 0)
                    })}</Typography>
                </Box> */}

            </CardContent>

        </Card>
    )
}

export default OrderSingle


function convertTitleOrder(status: string) {
    switch (status) {
        case 'cancelled':
            return 'Hủy bỏ';
        case 'completed':
            return 'Đã hoàn thành';
        case 'failed':
            return 'Thất bại';
        case 'on-hold':
            return 'Tạm giữ';
        case 'pending':
            return 'Đang chờ xử lý';
        case 'processing':
            return 'Đang xử lý';
        case 'refunded':
            return 'Hoàn lại';
        default:
            break;
    }
}
