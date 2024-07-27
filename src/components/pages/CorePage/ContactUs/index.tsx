import Banner from 'components/molecules/Banner'
import Page from 'components/templates/Page'
import { __ } from 'helpers/i18n'
import SectionContact from './SectionContact'

function ContactUs() {

    return (<Page
        title={__('Liên hệ')}
        description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
        image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
    >
        <Banner
            subTitle='học viện Spacedev.vn'
            title='Bạn có câu hỏi? Chúng tôi sẵn lòng giải đáp.'
            description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
            color='rgb(194, 228, 190)'
            image='/images/data/contact.jpg'
        />

        <SectionContact />

    </Page>)
}

export default ContactUs