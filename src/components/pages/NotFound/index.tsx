import NoticeContent from 'components/molecules/NoticeContent';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';

function NotFound() {
    return (
        <Page
            title={__("404: Page Not Found.")}
            description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
        >
            <NoticeContent
                title={__('404: The page you are looking for isn’t here')}
                description={__('You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation')}
                image="/images/undraw_page_not_found_su7k.svg"
            />
        </Page>
    );
}

export default NotFound
