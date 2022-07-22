import NoticeContent from 'components/molecules/NoticeContent'
import { __ } from 'helpers/i18n'
import React from 'react'

function PurchaseHistory() {
    return (
        <div>
            <NoticeContent
                title={__('Purchase history')}
                description={__('You don\'t have any course purchases.')}
                image="/images/empty_cart.svg"
                disableButtonHome
            />
        </div>
    )
}

export default PurchaseHistory