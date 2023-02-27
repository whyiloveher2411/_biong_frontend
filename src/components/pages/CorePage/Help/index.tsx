import NoticeContent from 'components/molecules/NoticeContent'
import Page from 'components/templates/Page'
import { __ } from 'helpers/i18n'
import React from 'react'

function Help() {
    return (
        <Page
            title={__('Help')}
            description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
        >
            <NoticeContent
                title={__('Something awesome is coming!')}
                description={__('We are working very hard on the new version of our site. It will bring a lot of new features. Stay tuned!')}
                image="/images/undraw_work_chat_erdt.svg"
            />
        </Page>
    )
}

export default Help