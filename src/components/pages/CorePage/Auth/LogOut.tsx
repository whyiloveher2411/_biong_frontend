import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from 'store/user/user.reducers';

function LogOut() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(logout());
        navigate(-1);
    }, []);

    return (
        <div></div>
    )
}

export default LogOut