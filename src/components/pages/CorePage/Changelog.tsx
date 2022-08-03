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
            isHeaderSticky
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
