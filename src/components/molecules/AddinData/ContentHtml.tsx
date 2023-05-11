import CodeBlock from 'components/atoms/CodeBlock'
import React from 'react'

function ContentHtml({ content }: { content: string }) {
    return <CodeBlock html={content} />
}

export default ContentHtml