import { useParams } from 'react-router-dom';
import { UserProps } from 'store/user/user.reducers';
import Detail from './Roadmap/Detail';
import Listing from './Roadmap/Listing';

function Orders({ user }: {
    user: UserProps
}) {

    let { subtab2 } = useParams<{
        subtab2: string,
    }>();


    if (subtab2) {
        return <Detail user={user} slug={subtab2} />
    }

    return <Listing user={user} />
}

export default Orders