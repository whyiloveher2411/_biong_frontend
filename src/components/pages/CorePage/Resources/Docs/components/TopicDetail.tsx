import { Box, Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import CodeBlock from 'components/atoms/CodeBlock';
import Tabs from 'components/atoms/Tabs';
import Page from 'components/templates/Page';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import docsService, { DocsSubTopic, DocsTopic } from 'services/docsService';
import CourseRelated from './CourseRelated';

function TopicDetail({ slug, topics }: { slug: string, topics: DocsTopic[] }) {

    const [topic, setTopic] = React.useState<DocsTopic | null>(null);
    const { data: subtopics } = useDocsSubTopics(slug);

    React.useEffect(() => {

        (async () => {
            const topicData = await docsService.getTopic(slug);
            setTopic(topicData);
        })();

    }, [slug]);

    const tabs = topics ? topics.map((item) => ({
        title: item.title,
        key: item.slug,
        content: () => <ContentTopicDetail topic={topic} subtopics={subtopics} />
    })) : [];

    const tabIndex = tabs.findIndex(item => item.key === slug) ?? 0;
    const navigate = useNavigate();

    const handleOnChangeTab = (index: number,) => {
        navigate('/resources/docs/' + tabs[index].key);
    };

    return (
        <Page
            title={topic?.title ? topic.title + ' - Docs' : 'Docs'}
            description={topic?.description || ''}
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

export const useDocsSubTopics = (slug: string) => useQuery({
    queryKey: ['useDocsTopics_' + slug], queryFn: () => docsService.getSubtopics(slug),
    initialData: [],
    staleTime: (st) => {
        if (st.state.data?.length !== 0) return Infinity

        return 0;
    },
});


export const useDocsFunctions = (slugTopic: string, slugSubtopic: string) => useQuery({
    queryKey: ['useDocsTopics_' + slugTopic + '/' + slugSubtopic], queryFn: () => docsService.getFunctions(slugTopic, slugSubtopic),
    initialData: [],
    staleTime: (st) => {
        if (st.state.data?.length !== 0) return Infinity

        return 0;
    },
});

export const useDocsCourseRelated = (slugTopic: string) => useQuery({
    queryKey: ['useDocsCourseRelated_' + slugTopic], queryFn: () => docsService.getCourseRelated(slugTopic),
    initialData: null,
    staleTime: (st) => {
        if (st.state.data === null) return 0;
        if (st.state.data?.length !== 0) return Infinity;

        return 0;
    },
});



export default TopicDetail


function ContentTopicDetail({ topic, subtopics }: { topic?: DocsTopic | null, subtopics: Array<DocsSubTopic> }) {

    return <Box>
        {/* <BreadcrumbsDocs topic={topic} /> */}
        <Typography variant='h1' fontWeight='bold' sx={{ mt: 2 }}>{topic?.title}</Typography>
        <CodeBlock
            html={topic?.introduce ?? ''}
        />
        <Typography variant='h2' sx={{ fontWeight: 'bold', mt: 6, mb: 3 }}>Khái niệm trong {topic?.title}</Typography>
        <Grid
            container
            spacing={2}
        >
            {
                subtopics.map(subtopic => <Grid
                    item
                    key={subtopic.id}
                    component={Link}
                    to={'/resources/docs/' + topic?.slug + '/' + subtopic.slug}
                    md={3}
                    sx={{
                        fontWeight: 'bold',
                        minHeight: 28,
                        p: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'primary.dark',
                        '&:hover': {
                            textDecoration: 'underline',
                        }
                    }}
                >
                    {subtopic.title}
                </Grid>)
            }
        </Grid>
        {
            topic?.slug ?
                <CourseRelated slugTopic={topic.slug} />
                : null
        }
    </Box>

}