import NoticeContent from 'components/molecules/NoticeContent'
import Page from 'components/templates/Page'
import { __ } from 'helpers/i18n'
import React from 'react'

function index() {
    return (
        <Page
            title={__('Advertise')}
            description='Từ việc học kiến thức mới đến tìm kiếm công việc, khởi nghiệp hoặc phát triển kinh doanh, hãy chọn lộ trình học tập phù hợp với ước mơ của bạn và bắt đầu chuyến hành trình thành công của bạn.'
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

export default index