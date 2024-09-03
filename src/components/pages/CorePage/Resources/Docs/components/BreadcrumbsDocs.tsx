import { Breadcrumbs, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { DocsFunction, DocsSubTopic, DocsTopic } from 'services/docsService'

function BreadcrumbsDocs({ content }: { content?: DocsFunction | DocsSubTopic | DocsTopic | null }) {
    return (
        <Breadcrumbs aria-label="breadcrumb">
            <Link to="/resources/docs">
                Tài liệu
            </Link>
            {
                (() => {

                    const result: Array<React.ReactNode> = [];

                    if (content && content.slug) {
                        if ('topic' in content && 'subtopic' in content) {
                            result.push(<Link key={'topic_' + content.topic?.slug} to={'/resources/docs/' + content.topic?.slug}>
                                {content.topic?.title}
                            </Link>)
                            result.push(<Link key={'topic_' + content.topic?.slug + '/' + content.subtopic?.slug} to={'/resources/docs/' + content.topic?.slug + '/' + content.subtopic?.slug}>
                                {content.subtopic?.title}
                            </Link>)
                            result.push(<Typography key={'topic_' + content.topic?.slug + '/' + content.subtopic?.slug + '/' + content.slug}>
                                {content.title}
                            </Typography>)
                        } else if ('topic' in content) {
                            result.push(<Link key={'topic_' + content.topic?.slug} to={'/resources/docs/' + content.topic?.slug}>
                                {content.topic?.title}
                            </Link>)
                            result.push(<Typography key={'topic_' + content.topic?.slug + '/' + content.slug}>
                                {content.title}
                            </Typography>)
                        } else if (content) {
                            result.push(<Typography key={'topic_' + content.slug}>
                                {content.title}
                            </Typography>)
                        }
                    }
                    return result
                })()
            }
        </Breadcrumbs>
    )
}

export default BreadcrumbsDocs
