import AuthGuard from 'components/templates/AuthGuard';
import { __ } from 'helpers/i18n';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'store/configureStore';
import { UserState } from 'store/user/user.reducers';

function index() {

    const user = useSelector((state: RootState) => state.user);

    const navigate = useNavigate();

    React.useEffect(() => {

        if (user._state === UserState.identify) {
            navigate('/');
        }

    }, [user]);

    return <AuthGuard
        title={__('Đăng nhập')}
        description='Đăng nhập để tiếp tục'
        image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
    >
        &nbsp;
    </AuthGuard>

}

export default index