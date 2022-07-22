import NoticeContent from 'components/molecules/NoticeContent'
import { __ } from 'helpers/i18n'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from 'store/configureStore'
import { UserProps } from 'store/user/user.reducers'

function ActivityLog({ user }: {
    user: UserProps
}) {

    const myAccount = useSelector((state: RootState) => state.user);

    if (myAccount && user && (myAccount.id + '') === (user.id + '')) {

        return (
            <NoticeContent
                title={__('Something awesome is coming!')}
                description={__('We are working very hard on the new version of our site. It will bring a lot of new features. Stay tuned!')}
                image="/images/undraw_work_chat_erdt.svg"
            />
        )
    }

    return <Navigate to={'/user/' + user.slug} />;

}

export default ActivityLog