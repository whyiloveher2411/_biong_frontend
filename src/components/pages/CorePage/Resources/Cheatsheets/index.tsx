import React from 'react'
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Grid, Button, Skeleton } from '@mui/material';
import Page from 'components/templates/Page';

// Mock data
const mockCategories = [
  { slug: '/resources/cheatsheets/javascript', title: 'JavaScript' },
  { slug: '/resources/cheatsheets/react', title: 'React' },
  { slug: '/resources/cheatsheets/python', title: 'Python' },
];

const mockContent = {
  javascript: {
    title: 'JavaScript Cheatsheet',
    content: <Typography>Đây là nội dung JavaScript cheatsheet.</Typography>,
  },
  react: {
    title: 'React Cheatsheet',
    content: <Typography>Đây là nội dung React cheatsheet.</Typography>,
  },
  python: {
    title: 'Python Cheatsheet',
    content: <Typography>Đây là nội dung Python cheatsheet.</Typography>,
  },
};

function Cheatsheets() {
    let { subtab1 } = useParams<{ subtab1: string }>();

    const [content, setContent] = React.useState<{ title: string, content: ANY } | null>(null);
    const elementRef = React.useRef<HTMLDivElement>(null);
    const [offsetTop, setOffsetTop] = React.useState<string | undefined>('100%');
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);

        if (subtab1 && mockContent[subtab1 as keyof typeof mockContent]) {
            setContent(mockContent[subtab1 as keyof typeof mockContent]);
        } else {
            setContent({
                title: 'Cheatsheets',
                content: <>
                    <Typography sx={{ mt: 1, mb: 3 }}>Cheatsheets là bộ sưu tập tài liệu tham khảo nhanh cho các ngôn ngữ và công nghệ lập trình phổ biến.</Typography>
                    <Grid container spacing={3}>
                        {mockCategories.map((tab) => (
                            <Grid item key={tab.slug} md={4}>
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
                            </Grid>
                        ))}
                    </Grid>
                </>,
            });
        }
        setLoading(false);
    }, [subtab1]);

    const updateMaxHeight = () => {
        if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            const visibleHeight = window.innerHeight - rect.top;
            setOffsetTop(`${visibleHeight}px`);
        }
    };

    React.useEffect(() => {
        window.addEventListener('scroll', updateMaxHeight);
        window.addEventListener('resize', updateMaxHeight);
        updateMaxHeight();
        return () => {
            window.removeEventListener('scroll', updateMaxHeight);
            window.removeEventListener('resize', updateMaxHeight);
        };
    }, []);

    return (
        <Page
            title="Cheatsheets"
            description="Cheatsheets"
            image='images/share-fb-540x282-2.jpg'
        >
            <Grid container spacing={3} sx={{ mt: 12 }}>
                <Grid item xs={0} md={3}>
                    <Box sx={{ borderRight: '1px solid', borderColor: 'dividerDark' }}>
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
                            {mockCategories.map(tab => (
                                <Button
                                    component={Link}
                                    to={tab.slug}
                                    sx={{
                                        textTransform: 'unset',
                                        fontSize: 16,
                                        justifyContent: 'flex-start',
                                        height: 48,
                                        pl: 2,
                                        color: tab.slug === window.location.pathname ? 'primary.main' : 'unset',
                                        ...(tab.slug === window.location.pathname ? {
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
                            ))}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={9}>
                    {loading ? (
                        <Skeleton variant="rectangular" width="100%" height={118} />
                    ) : (
                        <>
                            {content && (
                                <>
                                    <Typography variant="h4" gutterBottom>{content.title}</Typography>
                                    <Box>{content.content}</Box>
                                </>
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
        </Page>
    )
}

export default Cheatsheets
