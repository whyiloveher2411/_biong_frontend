import Markdown from 'components/atoms/Markdown'
import Page from 'components/templates/Page'
import { __ } from 'helpers/i18n'
import useAjax from 'hook/useApi'
import { useEffect, useState } from 'react'

const GettingStarted = () => {

    const [source, setSource] = useState('')

    const useAjax1 = useAjax();

    useEffect(() => {

        useAjax1.ajax({
            url: 'docs/change-log',
            success: (result: { text?: string }) => {
                if (result.text) {
                    setSource(result.text)
                }
            }
        });

    }, []);

    return (
        <Page
            title={__('Changelog')}
            description='Từ việc học kiến thức mới đến tìm kiếm công việc, khởi nghiệp hoặc phát triển kinh doanh, hãy chọn lộ trình học tập phù hợp với ước mơ của bạn và bắt đầu chuyến hành trình thành công của bạn.'
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
        >
            {source && (
                <Markdown components={{ a: LinkRenderer }} skipHtml={true} escapeHtml={false}>
                    {source}
                </Markdown>
            )}
            {useAjax1.Loading}
        </Page>
    )
}

function LinkRenderer(props: ANY) {
    return (
        <a href={props.href} target="_blank" rel="noreferrer">
            {props.children}
        </a>
    );
}

export default GettingStarted
