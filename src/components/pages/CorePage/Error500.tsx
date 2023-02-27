import NoticeContent from 'components/molecules/NoticeContent';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import React from 'react';

const Error500 = () => {

    return (
        <Page
            title={__('Error 500')}
            description='Từ việc học kiến thức mới đến tìm kiếm công việc, khởi nghiệp hoặc phát triển kinh doanh, hãy chọn lộ trình học tập phù hợp với ước mơ của bạn và bắt đầu chuyến hành trình thành công của bạn.'
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
        >
            <NoticeContent
                title={__('500: Internal Server Error')}
                description={__('Sorry, something went wrong. <br /> A team of highly trained monkeys has been dispatched to deal with this situation <br />If you see them, show them this infomation.')}
                image="/images/500.svg"
            />
        </Page>
    );
};

export default Error500;
