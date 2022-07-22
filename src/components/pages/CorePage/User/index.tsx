import React from 'react'
import { Navigate, useParams } from 'react-router-dom';
import UserProfile from './components/UserProfile';

function index() {

    let { tab } = useParams<{
        tab: string,
    }>();

    if (tab) {
        return (
            <UserProfile slug={tab} />
        )
    }

    return (
        <Navigate to={'/'} />
    )
}

export default index