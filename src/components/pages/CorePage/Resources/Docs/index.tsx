import { useParams } from 'react-router-dom';
// import FunctionDetail from './components/FunctionDetail';
import { Box, Button, Grid, IconButton, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import CodeBlock from 'components/atoms/CodeBlock';
import Page from 'components/templates/Page';
import React from 'react';
import { Link } from 'react-router-dom';
import docsService, { DocsFunction, DocsSubTopic, DocsTopic } from 'services/docsService';
import BreadcrumbsDocs from './components/BreadcrumbsDocs';
import CourseRelated from './components/CourseRelated';
// import CourseRelated from './components/CourseRelated';
import { Bookmark, Share } from '@mui/icons-material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import BookmarkBorder from '@mui/icons-material/BookmarkBorder';
import NoticeContent from 'components/molecules/NoticeContent';
import useBookmarks from 'hook/useBookmarks';
import { compiler } from 'markdown-to-jsx';
import { renderToString } from 'react-dom/server';
import NotFound from 'components/molecules/NotFound';

function Docs() {

    let { subtab1, subtab2, subtab3 } = useParams<{
        subtab1: string,
        subtab2: string,
        subtab3: string,
    }>();

    const { data: tabs } = useDocsTags(subtab1, subtab2, subtab3);
    const [content, setContent] = React.useState<DocsFunction | DocsSubTopic | DocsTopic | DocsTopic[] | null>(null);
    const [contentRelationship, setContentRelationship] = React.useState<Array<DocsFunction | DocsSubTopic> | null>(null);
    const elementRef = React.useRef<HTMLElement>(null);
    const [offsetTop, setOffsetTop] = React.useState('');

    const [loading, setLoading] = React.useState(true);

    const bookmark = useBookmarks('docs');

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
                setContent(tabs);
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

            const top = elementRef.current.getBoundingClientRect().top;
            if (top < 0) {
                setOffsetTop('100vh');
            } else {
                setOffsetTop(`calc(100vh - ${top}px)`);
            }
            // const rect = elementRef.current.getBoundingClientRect();
            // const visibleHeight = window.innerHeight - rect.top;
            // setOffsetTop(`${visibleHeight}px`);
            //get position top of element
            // console.log(top);
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

    React.useEffect(() => {
        const scrollToActiveMenu = () => {
            const activeElement = elementRef.current?.querySelector('.active');
            if (activeElement && elementRef.current) {
                const parentElement = activeElement.parentElement;
                if (parentElement) {
                    // Chỉ cuộn phần tử cha trực tiếp của activeElement
                    parentElement.scrollTo({
                        top: (activeElement as HTMLElement).offsetTop - parentElement.offsetHeight / 2 + (activeElement as HTMLElement).offsetHeight / 2,
                        behavior: 'smooth'
                    });
                }
            }
        };
        setTimeout(scrollToActiveMenu, 300);
    }, [subtab1, subtab2, subtab3]);


    const preButton = tabs[tabs.findIndex(tab => tab.slug === window.location.pathname) - 1];
    const nextButton = tabs[tabs.findIndex(tab => tab.slug === window.location.pathname) + 1];

    return <Page
        title={content && 'title' in content ? content.title : 'Tài liệu'}
        description={
            (content && 'description' in content
                ? content.description
                : content && 'introduce' in content
                    ? content.introduce
                    : 'Tài liệu là bộ sưu tập tài liệu mã hướng tới cộng đồng dành cho các ngôn ngữ và khung lập trình phổ biến. Quan tâm đến việc giúp xây dựng nó?') + ''
        }
        image='images/share-fb-540x282-2.jpg'
    >
        <Box
            sx={{
                display: 'flex',
            }}
        >
            <Grid
                container
                spacing={3}
                sx={{
                    mt: 8
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
                            position: 'sticky',
                            top: 64,
                        }}
                    >

                        {
                            content && 'subtopic' in content ?
                                <Typography component={Link} to={'/resources/docs/' + subtab1 + '/' + subtab2} sx={{ pb: 3 }}><IconButton ><ArrowBackRoundedIcon /></IconButton> {content.subtopic?.title} trong {content.topic?.title}</Typography>
                                : content && 'topic' in content ?
                                    <Typography component={Link} to={'/resources/docs/' + subtab1} sx={{ pb: 3 }}><IconButton ><ArrowBackRoundedIcon /></IconButton> Khái niệm trong {content.topic?.title}</Typography>
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
                                            className={tab.slug == window.location.pathname ? 'active' : ''}
                                            component={Link}
                                            to={tab.slug}
                                            sx={{
                                                textTransform: 'unset',
                                                fontSize: 16,
                                                height: 48,
                                                pl: 2,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
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
                                            {tab.title_vi || tab.title}

                                            {
                                                tab.type === 'topic' && bookmark.isBookmarked(tab.id) ? <Bookmark color='warning' /> : null
                                            }

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
                    {
                        Array.isArray(content) ?
                            <>
                                <BreadcrumbsDocs content={null} />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography variant='h1' fontWeight='bold' sx={{ mt: 2, mb: 1, }}>Docs</Typography>
                                    {bookmark.buttonFilter}
                                </Box>
                                <Typography sx={{ mt: 1, mb: 3 }}>Tài liệu là bộ sưu tập tài liệu mã hướng tới cộng đồng dành cho các ngôn ngữ và khung lập trình phổ biến. Quan tâm đến việc giúp xây dựng nó?</Typography>
                                {
                                    (() => {

                                        const filter = bookmark.filterByBookmark(content);

                                        if (filter.length === 0) {
                                            return <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    pt: 5
                                                }}
                                            >
                                                <NotFound
                                                    title='Không tìm thấy tài liệu'
                                                    subTitle='Vui lòng thay đổi bộ lọc để tìm kiếm tài liệu'
                                                />
                                            </Box>
                                        }

                                        return <Grid
                                            container
                                            spacing={3}
                                        >
                                            {
                                                filter.map((tab) => <Grid
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
                                                            flexDirection: 'column',
                                                            pt: 2,
                                                            pb: 2,
                                                            transition: 'all 0.3s ease-in-out',
                                                            backgroundColor: 'background.paper',
                                                            pl: 2,
                                                            pr: 2,
                                                            position: 'relative',
                                                            '&:hover': {
                                                                transform: 'translateY(-5px)',
                                                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                                                borderColor: 'primary.main',
                                                                '& .bookmark-button': {
                                                                    opacity: 1,
                                                                },
                                                            }
                                                        }}
                                                    >
                                                        <Typography fontWeight={'bold'} fontSize={18}>{tab.title}</Typography>
                                                        <Typography variant="body2" color="text.secondary" mt={1}>
                                                            {tab.description}
                                                        </Typography>
                                                        <IconButton
                                                            className="bookmark-button"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 8,
                                                                right: 8,
                                                                color: 'warning.main',
                                                                opacity: bookmark.isBookmarked(tab.id) ? 1 : 0,
                                                                transition: 'opacity 0.3s, color 0.3s',
                                                                '@media (hover: none)': {
                                                                    opacity: 1,
                                                                },
                                                            }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                bookmark.toggle(tab.id);
                                                            }}
                                                        >
                                                            {
                                                                bookmark.isBookmarked(tab.id) ?
                                                                    <Bookmark />
                                                                    :
                                                                    <BookmarkBorder />
                                                            }
                                                        </IconButton>
                                                    </Box>
                                                </Grid>)
                                            }
                                        </Grid>

                                    })()
                                }
                            </>
                            :
                            <>
                                <BreadcrumbsDocs content={content} />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography variant='h1' fontWeight='bold' sx={{ mt: 2, mb: 2, }}>
                                        {content?.title === content?.title_vi || !content?.title_vi ?
                                            content?.title :
                                            `${content?.title_vi} (${content?.title})`}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        backgroundColor: 'background.paper',
                                        p: 3,
                                        borderRadius: 2,
                                    }}
                                >
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
                                                        !subtab1 ?
                                                            <>
                                                                <Skeleton variant="text" height={28} width="40%" sx={{ mb: 2 }} />
                                                                <Skeleton variant="text" width="100%" sx={{ mb: 1 }} />
                                                                <Skeleton variant="text" width="100%" sx={{ mb: 1 }} />
                                                                <Grid
                                                                    container
                                                                    spacing={3}
                                                                >
                                                                    {[...Array(20)].map((_, index) => (
                                                                        <Grid
                                                                            key={index}
                                                                            item
                                                                            md={4}
                                                                        >
                                                                            <Box
                                                                                sx={{
                                                                                    borderRadius: 2,
                                                                                    border: '1px solid',
                                                                                    borderColor: 'dividerDark',
                                                                                    height: '100%',
                                                                                    color: 'primary.main',
                                                                                    display: 'flex',
                                                                                    flexDirection: 'column',
                                                                                    pt: 2,
                                                                                    pb: 2,
                                                                                    pl: 2,
                                                                                    pr: 2,
                                                                                    position: 'relative',
                                                                                    backgroundColor: 'background.paper',
                                                                                }}
                                                                            >
                                                                                <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
                                                                                <Skeleton variant="text" width="100%" sx={{ mb: 1 }} />
                                                                                <Skeleton variant="text" width="100%" />
                                                                            </Box>
                                                                        </Grid>
                                                                    ))}
                                                                </Grid>
                                                            </>
                                                            :
                                                            [...Array(20)].map((_, index) => (
                                                                <Skeleton key={index} />
                                                            ))
                                                        :
                                                        null

                                                }
                                                {
                                                    content && 'introduce' in content && content.introduce ?
                                                        <CodeBlock
                                                            html={renderToString(compiler(content.introduce))}
                                                            changeLinks={{ source: 'https://www.codecademy.com', to: 'https://spacedev.vn' }}
                                                        />
                                                        :
                                                        null
                                                }

                                                {
                                                    content && 'content' in content && content.content ?
                                                        typeof content.content === 'string' ?
                                                            <CodeBlock
                                                                html={renderToString(compiler(content.content))}
                                                                changeLinks={{ source: 'https://www.codecademy.com', to: 'https://spacedev.vn' }}
                                                            />
                                                            :
                                                            content.content
                                                        : null

                                                }
                                                {
                                                    (() => {
                                                        if (contentRelationship) {

                                                            if (subtab1 && subtab2 && subtab3) {
                                                                return <></>
                                                            } else if (subtab1 && subtab2) {
                                                                if (contentRelationship.length) {
                                                                    return <>
                                                                        <Typography variant='h2' sx={{ fontWeight: 'bold', mt: 6, mb: 3 }}>Tìm hiểu thêm</Typography>
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
                                                                                    <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1, color: 'primary.main' }}>{func.title_vi} {func.title && func.title !== func.title_vi ? <Typography component={'span'} sx={{ fontSize: 14, fontWeight: 'bold' }}>({func.title})</Typography> : null}</Typography>
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
                                                <Box sx={{
                                                    mt: 6,
                                                    mb: 4,
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    gap: 2
                                                }}>
                                                    {
                                                        preButton ?
                                                            <Button
                                                                component={Link}
                                                                to={preButton.slug}
                                                                startIcon={<ArrowBackRoundedIcon />}
                                                                variant='outlined'
                                                                size='large'
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    fontWeight: 'bold',
                                                                    color: 'primary.main',
                                                                    width: '50%',
                                                                    fontSize: 18,
                                                                    justifyContent: 'flex-start',
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        lineHeight: '18px',
                                                                        width: '100%',
                                                                    }}
                                                                >
                                                                    {preButton.title_vi || preButton.title}
                                                                    {
                                                                        (preButton.title_vi || preButton.title) !== preButton.title ?
                                                                            <Typography sx={{ fontSize: 14 }}>({preButton.title})</Typography>
                                                                            : null
                                                                    }
                                                                </Box>
                                                            </Button>
                                                            :
                                                            <Box sx={{ width: '50%' }} />
                                                    }
                                                    {
                                                        nextButton ?
                                                            <Button
                                                                component={Link}
                                                                to={nextButton.slug}
                                                                endIcon={<ArrowBackRoundedIcon sx={{ transform: 'rotate(180deg)' }} />}
                                                                variant='outlined'
                                                                size='large'
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    fontWeight: 'bold',
                                                                    color: 'primary.main',
                                                                    width: '50%',
                                                                    fontSize: 18,
                                                                    justifyContent: 'flex-end',
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        lineHeight: '18px',
                                                                        width: '100%',
                                                                    }}
                                                                >
                                                                    {nextButton.title_vi || nextButton.title}
                                                                    {
                                                                        (nextButton.title_vi || nextButton.title) !== nextButton.title ?
                                                                            <Typography sx={{ fontSize: 14 }}>({nextButton.title})</Typography>
                                                                            : null
                                                                    }
                                                                </Box>
                                                            </Button>
                                                            :
                                                            <Box sx={{ width: '50%' }} />
                                                    }
                                                </Box>
                                                {
                                                    subtab1 ?
                                                        <CourseRelated slugTopic={subtab1} />
                                                        : null
                                                }
                                            </>
                                    }
                                </Box>
                            </>
                    }
                </Grid>
            </Grid>
            <Box sx={{
                flexShrink: 0,
                mt: 11
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        position: 'sticky',
                        left: 0,
                        top: 88, // Điều chỉnh giá trị này để phù hợp với layout của bạn
                        zIndex: 1,
                        width: '64px',
                        alignItems: 'center',
                    }}
                >
                    <IconButton
                        onClick={async () => {
                            const shareData = {
                                title: document.title,
                                text: document.querySelector('meta[name="description"]')?.getAttribute('content') || "Tài liệu về lập trình",
                                url: window.location.href,
                            };

                            try {
                                await navigator.share(shareData);
                            } catch (err) {
                                // 
                            }
                        }}
                    >
                        <Share />
                    </IconButton>
                    {
                        !subtab2 ?
                            content && !Array.isArray(content) ?
                                bookmark.iconButton(content.id)
                                : null
                            : null
                    }
                </Box>
            </Box>
        </Box>
    </Page >
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
                id: item.id,
                type: 'function',
                title: item.title,
                title_vi: item.title_vi,
                slug: '/resources/docs/' + slugTopic + '/' + slugSubtopic + '/' + item.slug
            }));
        }

        if (slugTopic && slugSubtopic) {
            return (await docsService.getSubtopics(slugTopic)).map(item => ({
                id: item.id,
                type: 'subtopic',
                title: item.title,
                title_vi: item.title_vi,
                slug: '/resources/docs/' + slugTopic + '/' + item.slug
            }));
        }

        return (await docsService.getTopics()).map(item => ({
            id: item.id,
            type: 'topic',
            title: item.title,
            title_vi: item.title_vi,
            slug: '/resources/docs/' + item.slug
        }));

    },
    initialData: [],
    staleTime: (st) => {
        if (st.state.data?.length !== 0) return Infinity

        return 0;
    },
});