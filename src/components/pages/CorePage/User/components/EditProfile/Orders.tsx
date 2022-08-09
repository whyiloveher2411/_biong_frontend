import { Box } from '@mui/material';
import OrderSingle from 'components/molecules/Ecommerce/OrderSingle';
import NoticeContent from 'components/molecules/NoticeContent';
import { __ } from 'helpers/i18n';
import React from 'react';
import eCommerceService, { OrderProps } from 'services/eCommerceService';

function Orders() {

    const [data, setData] = React.useState<{
        orders: OrderProps[],
        status: {
            list_option: {
                [key: string]: {
                    title: string,
                    color: string
                }
            }
        }
    } | false>(false);

    React.useEffect(() => {

        (async () => {

            const ordersApi = await eCommerceService.getOrderOfMe();

            setData(ordersApi);

        })()

    }, []);

    if (data) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                }}
            >
                {
                    data.orders.length ?
                        data.orders.map((order, index) => (
                            <OrderSingle order={order} key={index} status={data.status} />
                        ))
                        :
                        <NoticeContent
                            title={__('Order not found')}
                            description={__('You don\'t have any orders right now')}
                            image="/images/undraw_empty_xct9.svg"
                            disableButtonHome
                        />
                }
            </Box>
        )
    }

    return null;
}

export default Orders