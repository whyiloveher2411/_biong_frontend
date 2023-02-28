import { useParams } from 'react-router-dom';
import { UserProps } from 'store/user/user.reducers';
import OrderDetail from './Orders/OrderDetail';
import OrdersList from './Orders/OrderList';

function Orders({ user }: {
    user: UserProps
}) {

    let { subtab2 } = useParams<{
        subtab2: string,
    }>();


    if (subtab2) {
        return <OrderDetail user={user} id={subtab2} />
    }

    return <OrdersList user={user} />
}

export default Orders