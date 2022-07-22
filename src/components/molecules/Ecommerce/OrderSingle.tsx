import { Alert, Box, Card, CardContent, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Label from 'components/atoms/Label';
import { dateFormat } from 'helpers/date';
import { __ } from 'helpers/i18n';
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
                <Label sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16
                }} color={status.list_option[order.order_status]?.color}>{status.list_option[order.order_status]?.title}</Label>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {__('Created At')}: {dateFormat(order.date_created)}
                </Typography>
                {
                    order.order_status === 'pending' &&
                    <Alert variant='filled' severity="info" >Chuyển tiền theo cú pháp sau sẽ giúp đơn hàng nhanh chóng được xác nhận hơn:
                        &nbsp;<Label color={status.list_option[order.order_status]?.color}>{order.title}</Label>
                    </Alert>
                }
                <Divider color="dark" />
                <Typography variant='h3'>
                    {__('Products')}
                </Typography>
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
                                        }}
                                    >
                                        <ImageLazyLoading sx={{ width: '300px', height: '200px' }} src={getImageUrl(product.featured_image)} />
                                        <Box>
                                            <Typography variant='h4' component='h2'>{product.title}</Typography>
                                            <Typography component='h3'>{moneyFormat(product.price)}</Typography>
                                        </Box>
                                    </Box>
                                </Link>
                            ))
                        }
                        <Divider color="dark" />
                    </>
                }
                <Typography align='right' variant='h2'>{__('Total: {{money}}', {
                    money: moneyFormat(order.products?.total ?? 0)
                })}</Typography>
            </CardContent>

        </Card>
    )
}

export default OrderSingle