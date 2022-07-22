import { Box } from '@mui/material';
import React from 'react';
import eCommerceService, { OrderProps } from 'services/eCommerceService';
import OrderSingle from 'components/molecules/Ecommerce/OrderSingle';

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
                    data.orders.map((order, index) => (
                        <OrderSingle order={order} key={index} status={data.status} />
                    ))
                }
            </Box>
        )
    }

    return null;
}

export default Orders