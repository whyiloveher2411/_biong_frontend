import { Box, Typography } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import Tabs from 'components/atoms/Tabs';
import Page from 'components/templates/Page';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import docsService, { DocsFunction, DocsSubTopic } from 'services/docsService';
import CourseRelated from './CourseRelated';
import { useDocsFunctions, useDocsSubTopics } from './TopicDetail';

function SubtopicDetail({ slug, slugTopic }: { slugTopic: string, slug: string }) {

    const [subtopic, setSubtopic] = React.useState<DocsSubTopic | null>(null);

    const { data: subTopics } = useDocsSubTopics(slugTopic);
    const { data: functions } = useDocsFunctions(slugTopic, slug);


    React.useEffect(() => {

        (async () => {
            const subtopicData = await docsService.getSubtopic(slugTopic, slug);
            setSubtopic(subtopicData);
        })();

    }, [slug]);

    const tabs = subTopics ? subTopics.map((item) => ({
        title: item.title,
        key: item.slug,
        content: () => <ContentSubtopicDetail slugTopic={slugTopic} functions={functions} subtopic={subtopic} />
    })) : [];

    const tabIndex = tabs.findIndex(item => item.key === slug) ?? 0;
    const navigate = useNavigate();

    const handleOnChangeTab = (index: number,) => {
        navigate('/resources/docs/' + slugTopic + '/' + tabs[index].key);
    };

    return (
        <Page
            title={subtopic?.title ? subtopic.title + ' - Docs' : 'Docs'}
            description={subtopic?.description || ''}
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
        >
            <Box
                sx={{
                    mt: 12
                }}
            >
                <Tabs
                    name='topics'
                    orientation='vertical'
                    tabIndex={tabIndex}
                    activeIndicator={false}
                    onChangeTab={handleOnChangeTab}
                    tabs={tabs}
                    sx={{
                        '.tabItems .MuiButton-root': {
                            textTransform: 'none',
                        }
                    }}
                />
            </Box>
        </Page>
    )
}

export default SubtopicDetail



function ContentSubtopicDetail({ slugTopic, subtopic, functions }: { slugTopic: string, subtopic?: DocsSubTopic | null, functions: Array<DocsFunction> }) {

    return <Box>
        {/* <BreadcrumbsDocs subtopic={subtopic} /> */}
        <Typography variant='h1' fontWeight='bold' sx={{ mt: 2 }}>{subtopic?.title}</Typography>
        <CodeBlock
            html={subtopic?.introduce ?? ''}
        />

        <Typography variant='h2' sx={{ fontWeight: 'bold', mt: 6, mb: 3 }}>{subtopic?.title}</Typography>
        {
            functions.length ?
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',

                    }}
                >
                    {
                        functions.map(func => <Box
                            key={func.id}
                            component={Link}
                            to={'/resources/docs/' + slugTopic + '/' + subtopic?.slug + '/' + func.slug}
                            sx={{
                                fontWeight: 'bold',
                                minHeight: 28,
                                p: 0.5,
                                color: 'primary.dark',
                                borderBottom: '1px solid',
                                borderColor: 'text.third',
                                pt: 2,
                                pb: 2,
                            }}
                        >
                            <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1, color: 'primary.main' }}>{func.title}</Typography>
                            <Typography>{func.description}</Typography>

                        </Box>)
                    }
                </Box>
                :
                null
        }
        {
            subtopic?.topic?.slug ?
                <CourseRelated slugTopic={subtopic.topic.slug} />
                : null
        }
    </Box>
}