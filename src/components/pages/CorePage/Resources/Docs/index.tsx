import { useParams } from 'react-router-dom';
// import FunctionDetail from './components/FunctionDetail';
import { Box, Button, Grid, IconButton, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Page from 'components/templates/Page';
import React from 'react';
import docsService, { DocsFunction, DocsSubTopic, DocsTopic } from 'services/docsService';
// import BreadcrumbsDocs from './components/BreadcrumbsDocs';
import CodeBlock from 'components/atoms/CodeBlock';
import { Link } from 'react-router-dom';
import BreadcrumbsDocs from './components/BreadcrumbsDocs';
import CourseRelated from './components/CourseRelated';
// import CourseRelated from './components/CourseRelated';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import NoticeContent from 'components/molecules/NoticeContent';

function Docs() {

    let { subtab1, subtab2, subtab3 } = useParams<{
        subtab1: string,
        subtab2: string,
        subtab3: string,
    }>();

    const { data: tabs } = useDocsTags(subtab1, subtab2, subtab3);
    const [content, setContent] = React.useState<DocsFunction | DocsSubTopic | DocsTopic | null>(null);
    const [contentRelationship, setContentRelationship] = React.useState<Array<DocsFunction | DocsSubTopic> | null>(null);
    const elementRef = React.useRef<HTMLElement>(null);
    const [offsetTop, setOffsetTop] = React.useState('');

    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        setLoading(true);

        (async () => {
            if (subtab1 && subtab2 && subtab3) {
                const content = await docsService.getFunction(subtab1, subtab2, subtab3);
                setContent(content);
            } else if (subtab1 && subtab2) {
                const content = await docsService.getSubtopic(subtab1, subtab2);
                setContent(content);
            } else if (subtab1) {
                const content = await docsService.getTopic(subtab1);
                setContent(content);
            } else {
                const tabs = await docsService.getTopics();
                setContent({
                    id: 0,
                    title: 'Tài liệu',
                    content: <>
                        <Typography sx={{ mt: 1, mb: 3 }}>Tài liệu là bộ sưu tập tài liệu mã hướng tới cộng đồng dành cho các ngôn ngữ và khung lập trình phổ biến. Quan tâm đến việc giúp xây dựng nó?</Typography>
                        <Grid
                            container
                            spacing={3}
                        >
                            {
                                tabs.map((tab) => <Grid
                                    item
                                    key={tab.slug}
                                    md={4}
                                >
                                    <Box
                                        component={Link}
                                        to={tab.slug}
                                        sx={{
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: 'dividerDark',
                                            height: '100%',
                                            color: 'primary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            pt: 2,
                                            pb: 2,
                                            '&:hover p': {
                                                color: 'primary.main'
                                            }
                                        }}
                                    >
                                        <Typography fontWeight={'bold'} fontSize={18}>{tab.title}</Typography>
                                    </Box>
                                </Grid>)
                            }
                        </Grid>
                    </>,
                    description: '',
                    introduce: '',
                    slug: '',
                });
            }
            setLoading(false);
        })();

        (async () => {
            if (subtab1 && subtab2 && subtab3) {
                // 
            } else if (subtab1 && subtab2) {
                const funcs = await docsService.getFunctions(subtab1, subtab2);
                setContentRelationship(funcs);
            } else if (subtab1) {
                const subtopics = await docsService.getSubtopics(subtab1);
                setContentRelationship(subtopics);
            }
        })();

    }, [subtab1, subtab2, subtab3]);
    // if (subtab3 && subtab2 && subtab1) {
    //     return <FunctionDetail slugTopic={subtab1} slugSubtopic={subtab2} slug={subtab3} />
    // }


    const updateMaxHeight = () => {
        if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            const visibleHeight = window.innerHeight - rect.top;
            setOffsetTop(`${visibleHeight}px`);
        }
    };

    React.useEffect(() => {
        window.addEventListener('scroll', updateMaxHeight);
        window.addEventListener('resize', updateMaxHeight); // To handle window resizing
        // Initial call to set the max-height
        updateMaxHeight();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', updateMaxHeight);
            window.removeEventListener('resize', updateMaxHeight);
        };
    }, []);

    return <Page
        title={'Docs'}
        description={''}
        image='images/share-fb-540x282-2.jpg'
    >
        <Grid
            container
            spacing={3}
            sx={{
                mt: 12
            }}
        >
            <Grid
                item
                xs={0}
                md={3}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',

                }}
            >
                <Box
                    sx={{
                        borderRight: '1px solid',
                        borderColor: 'dividerDark',
                    }}
                >

                    {
                        content && 'subtopic' in content ?
                            <Typography component={Link} to={'/resources/docs/' + subtab1 + '/' + subtab2} sx={{ mb: 1 }}><IconButton ><ArrowBackRoundedIcon /></IconButton> {content.subtopic?.title} trong {content.topic?.title}</Typography>
                            : content && 'topic' in content ?
                                <Typography component={Link} to={'/resources/docs/' + subtab1} sx={{ mb: 1 }}><IconButton ><ArrowBackRoundedIcon /></IconButton> Khái niệm trong {content.topic?.title}</Typography>
                                : null

                    }
                    <Box
                        ref={elementRef}
                        className="custom_scroll custom"
                        sx={{
                            height: offsetTop,
                            maxHeight: 'calc(100vh - 64px)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {
                            tabs.length === 0 ? (
                                [...Array(25)].map((_, index) => (
                                    <Skeleton key={index} height={24} sx={{ mb: 0.5 }} />
                                ))
                            ) : (
                                tabs.map(tab => (
                                    <Button
                                        component={Link}
                                        to={tab.slug}
                                        sx={{
                                            textTransform: 'unset',
                                            fontSize: 16,
                                            justifyContent: 'flex-start',
                                            height: 48,
                                            pl: 2,
                                            color: tab.slug == window.location.pathname ? 'primary.main' : 'unset',
                                            ...(tab.slug == window.location.pathname ? {
                                                ':before': {
                                                    left: '0',
                                                    width: 4,
                                                    height: '40px',
                                                    content: "''",
                                                    position: 'absolute',
                                                    backgroundColor: 'primary.main',
                                                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                                }
                                            } : {})
                                        }}
                                        key={tab.slug}>
                                        {tab.title}
                                    </Button>
                                ))
                            )
                        }
                    </Box>
                </Box>
            </Grid>
            <Grid
                item
                xs={12}
                md={9}
            >
                <BreadcrumbsDocs content={content} />
                <Typography variant='h1' fontWeight='bold' sx={{ mt: 2, mb: 1, }}>{content?.title}</Typography>
                {
                    content?.is_comming ?
                        <NoticeContent
                            title={'Một điều tuyệt vời sắp xảy ra!'}
                            description={'Chúng tôi đang làm việc rất chăm chỉ cho phiên bản mới của trang web. Nó sẽ mang lại nhiều tính năng mới. Hãy theo dõi!'}
                            image="/images/undraw_work_chat_erdt.svg"
                            disableButtonHome
                        />
                        :
                        <>
                            {
                                loading ?
                                    [...Array(20)].map((_, index) => (
                                        <Skeleton key={index} />
                                    ))
                                    :
                                    null

                            }
                            {
                                content && 'introduce' in content && content.introduce ?
                                    <CodeBlock
                                        html={content.introduce}
                                    />
                                    :
                                    null
                            }

                            {
                                content && 'content' in content && content.content ?
                                    typeof content.content === 'string' ?
                                        <CodeBlock
                                            html={content.content}
                                        />
                                        :
                                        content.content
                                    :
                                    null
                            }
                            {
                                (() => {
                                    if (contentRelationship) {

                                        if (subtab1 && subtab2 && subtab3) {
                                            return <></>
                                        } else if (subtab1 && subtab2) {
                                            if (contentRelationship.length) {
                                                return <>
                                                    <Typography variant='h2' sx={{ fontWeight: 'bold', mt: 6, mb: 3 }}>{content?.title}</Typography>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',

                                                        }}
                                                    >
                                                        {
                                                            contentRelationship.map(func => <Box
                                                                key={func.id}
                                                                component={Link}
                                                                to={'/resources/docs/' + subtab1 + '/' + subtab2 + '/' + func.slug}
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
                                                </>
                                            }
                                        } else if (subtab1) {
                                            if (contentRelationship.length) {
                                                return <>
                                                    <Typography variant='h2' sx={{ fontWeight: 'bold', mt: 6, mb: 3 }}>Khái niệm trong {content?.title}</Typography>
                                                    <Grid
                                                        container
                                                        spacing={2}
                                                    >
                                                        {
                                                            contentRelationship.map(subtopic => <Grid
                                                                item
                                                                key={subtopic.id}
                                                                component={Link}
                                                                to={'/resources/docs/' + subtab1 + '/' + subtopic.slug}
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
                                                </>
                                            }
                                        }
                                    }

                                    return <></>
                                })()
                            }
                            {
                                subtab1 ?
                                    <CourseRelated slugTopic={subtab1} />
                                    : null
                            }
                        </>
                }
            </Grid>
        </Grid>
    </Page>
    // if (subtab3 && subtab2 && subtab1) {
    //     return <FunctionDetail slugTopic={subtab1} slugSubtopic={subtab2} slug={subtab3} />
    // }

    // if (subtab2 && subtab1) {
    //     return <SubtopicDetail slugTopic={subtab1} slug={subtab2} />
    // }

    // if (subtab1) {
    //     return <TopicDetail slug={subtab1} />
    // }

    // return <DocsListing />
}

export default Docs



export const useDocsTopics = () => useQuery({
    queryKey: ['useDocsTopics'], queryFn: () => docsService.getTopics(),
    initialData: [],
    staleTime: (st) => {
        if (st.state.data?.length !== 0) return Infinity

        return 0;
    },
});

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

export const useDocsTags = (slugTopic?: string, slugSubtopic?: string, slugFunc?: string) => useQuery({
    queryKey: [
        slugFunc ? 'useDocsTags_' + (slugTopic ?? '') + '/' + (slugSubtopic ?? '')
            :
            slugSubtopic ? 'useDocsTags_' + (slugTopic ?? '')
                : 'useDocsTags_'
    ], queryFn: async () => {

        if (slugTopic && slugSubtopic && slugFunc) {
            return (await docsService.getFunctions(slugTopic, slugSubtopic)).map(item => ({
                title: item.title,
                slug: '/resources/docs/' + slugTopic + '/' + slugSubtopic + '/' + item.slug
            }));
        }

        if (slugTopic && slugSubtopic) {
            return (await docsService.getSubtopics(slugTopic)).map(item => ({
                title: item.title,
                slug: '/resources/docs/' + slugTopic + '/' + item.slug
            }));
        }

        return (await docsService.getTopics()).map(item => ({
            title: item.title,
            slug: '/resources/docs/' + item.slug
        }));

    },
    initialData: [],
    staleTime: (st) => {
        if (st.state.data?.length !== 0) return Infinity

        return 0;
    },
});