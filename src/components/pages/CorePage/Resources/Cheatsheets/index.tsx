/* eslint-disable no-constant-condition */
// import FunctionDetail from './components/FunctionDetail';
import { Box, Button, Card, CardContent, Grid, IconButton, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Page from 'components/templates/Page';
import React from 'react';
import docsService from 'services/docsService';
// import BreadcrumbsDocs from './components/BreadcrumbsDocs';
import { Bookmark } from '@mui/icons-material';
import BookmarkBorder from '@mui/icons-material/BookmarkBorder';
import NotFound from 'components/molecules/NotFound';
import useBookmarks from 'hook/useBookmarks';
import { Link, useNavigate, useParams } from 'react-router-dom';
import cheatsheetsService from 'services/cheatsheetsService';

function Cheatsheets() {

    let { subtab1, subtab2, subtab3 } = useParams<{
        subtab1: string,
        subtab2: string,
        subtab3: string,
    }>();

    // const { data: cheatsheet } = useCheatsheet(subtab3, () => {
    //     navigate('/resources/cheatsheets/' + subtab1 + '/' + subtab2);
    // });

    const bookmark = useBookmarks('cheatsheet');

    const { data: languages, isLoading: loadingLanguages } = useCheatsheetLanguages(subtab3);

    const { data: subjects, isLoading: loadingSubjects } = useCheatsheetSubjects(subtab3);

    const { data: cheatsheets } = useCheatsheets(
        subtab1 === 'languages' ? subtab2 : undefined,
        subtab1 === 'subjects' ? subtab2 : undefined,
        subtab3,
        () => {
            navigate('/resources/cheatsheets');
        }
    );

    const navigate = useNavigate();

    const elementRef = React.useRef<HTMLElement>(null);

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

        if (subtab1 && !['languages', 'subjects', 'all'].includes(subtab1)) {
            navigate('/resources/cheatsheets/all');
        }
    }, [subtab1, subtab2, subtab3]);

    return (<Page
        title={cheatsheets?.title || 'Cheatsheet'}
        description={''}
        image='images/share-fb-540x282-2.jpg'
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
                    className="custom_scroll custom"
                    sx={{
                        borderRight: '1px solid',
                        borderColor: 'dividerDark',
                        position: 'sticky',
                        top: 64,
                        maxHeight: 'calc(100vh - 64px)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Languages</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {
                            languages?.length === 0 ? (
                                [...Array(25)].map((_, index) => (
                                    <Skeleton key={index} height={24} sx={{ mb: 0.5 }} />
                                ))
                            ) : (
                                languages?.map(tab => (
                                    <Button
                                        className={tab.slug == window.location.pathname ? 'active' : ''}
                                        component={Link}
                                        to={'/resources/cheatsheets/languages/' + tab.slug}
                                        sx={{
                                            textTransform: 'unset',
                                            fontSize: 16,
                                            justifyContent: 'flex-start',
                                            height: 48,
                                            pl: 2,
                                            ...(subtab1 === 'languages' && subtab2 === tab.slug ? {
                                                ':before': {
                                                    left: '0',
                                                    width: 4,
                                                    height: '40px',
                                                    content: "''",
                                                    position: 'absolute',
                                                    backgroundColor: 'primary.main',
                                                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                                },
                                                color: 'primary.main',
                                            } : {
                                                color: 'unset',
                                            })
                                        }}
                                        key={tab.slug}>
                                        {tab.title}
                                    </Button>
                                ))
                            )
                        }
                    </Box>

                    <Typography sx={{ mb: 1, mt: 3, fontWeight: 'bold' }}>Subjects</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {
                            subjects?.length === 0 ? (
                                [...Array(25)].map((_, index) => (
                                    <Skeleton key={index} height={24} sx={{ mb: 0.5 }} />
                                ))
                            ) : (
                                subjects?.map(tab => (
                                    <Button
                                        className={tab.slug == window.location.pathname ? 'active' : ''}
                                        component={Link}
                                        to={'/resources/cheatsheets/subjects/' + tab.slug}
                                        sx={{
                                            textTransform: 'unset',
                                            fontSize: 16,
                                            justifyContent: 'flex-start',
                                            height: 48,
                                            pl: 2,
                                            ...(subtab1 == 'subjects' && subtab2 == tab.slug ? {
                                                ':before': {
                                                    left: '0',
                                                    width: 4,
                                                    height: '40px',
                                                    content: "''",
                                                    position: 'absolute',
                                                    backgroundColor: 'primary.main',
                                                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                                },
                                                color: 'primary.main',
                                            } : {
                                                color: 'unset',
                                            })
                                        }}
                                        key={tab.slug}>
                                        {tab.title}
                                    </Button>
                                ))
                            )
                        }
                    </Box>

                    <Button
                        className={subtab1 === 'all' ? 'active' : ''}
                        component={Link}
                        to={'/resources/cheatsheets/all'}
                        sx={{
                            textTransform: 'unset',
                            fontSize: 16,
                            justifyContent: 'flex-start',
                            height: 48,
                            mt: 3,
                            pl: 2,
                            ...(subtab1 === 'all' ? {
                                ':before': {
                                    left: '0',
                                    width: 4,
                                    height: '40px',
                                    content: "''",
                                    position: 'absolute',
                                    backgroundColor: 'primary.main',
                                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                },
                                color: 'primary.main',
                            } : {})
                        }}
                    >
                        Tất cả cheatsheet
                    </Button>

                </Box>
            </Grid>
            <Grid
                item
                xs={12}
                md={9}
            >
                <Box>
                    <Typography variant='h1' fontWeight='bold' sx={{ mt: 2, mb: 3, }}>{cheatsheets?.title} Cheatsheets</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">Danh sách Cheatsheets</Typography>
                        {bookmark.buttonFilter}
                    </Box>
                </Box>
                {
                    loadingLanguages || loadingSubjects ? (
                        <Grid
                            container
                            spacing={3}
                        >
                            {[...Array(12)].map((_, index) => (
                                <Grid md={4} item key={index}>
                                    <Card sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}>
                                        <CardContent>
                                            <Skeleton variant="text" width="40%" height={20} />
                                            <Skeleton variant="text" width="80%" height={24} sx={{ mt: 1 }} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Grid
                            container
                            spacing={3}
                        >
                            {
                                cheatsheets ?
                                    (() => {

                                        const result = bookmark.filterByBookmark(cheatsheets.posts);

                                        if (result.length === 0) {
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
                                                    title='Không tìm thấy cheatsheet'
                                                    subTitle='Vui lòng thay đổi bộ lọc để tìm kiếm cheatsheet'
                                                />
                                            </Box>
                                        }

                                        return result.map(item => (
                                            <Grid md={4} item key={item.id}>
                                                <Link to={'/resources/learn/' + item.slug}>
                                                    <Card sx={{
                                                        transition: 'all 0.3s ease-in-out',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        boxShadow: 'none',
                                                        cursor: 'pointer',
                                                        height: '100%',
                                                        backgroundColor: 'divider',
                                                        position: 'relative',
                                                        '&:hover': {
                                                            transform: 'translateY(-5px)',
                                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                                            borderColor: 'primary.main',
                                                            '& .bookmark-button': {
                                                                opacity: 1,
                                                            },
                                                        }
                                                    }}>
                                                        <CardContent>
                                                            <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>Cheatsheet</Typography>
                                                            <Typography variant='h2' sx={{ fontSize: 16, fontWeight: 'bold', lineHeight: '26px', }}>{item.title}</Typography>
                                                        </CardContent>
                                                        <IconButton
                                                            className="bookmark-button"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 8,
                                                                right: 8,
                                                                color: bookmark.isBookmarked(item.id) ? 'warning.main' : 'inherit',
                                                                opacity: bookmark.isBookmarked(item.id) ? 1 : 0,
                                                                transition: 'opacity 0.3s, color 0.3s',
                                                                '@media (hover: none)': {
                                                                    opacity: 1,
                                                                },
                                                                '&:hover': {
                                                                    color: 'warning.main',
                                                                },
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                bookmark.toggle(item.id);
                                                            }}
                                                        >
                                                            {bookmark.isBookmarked(item.id) ? <Bookmark /> : <BookmarkBorder />}
                                                        </IconButton>
                                                    </Card>
                                                </Link>
                                            </Grid>
                                        ))

                                    })()
                                    :
                                    [...Array(24)].map((_, index) => (
                                        <Grid md={4} item key={index}>
                                            <Card sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                backgroundColor: 'divider',
                                            }}>
                                                <CardContent>
                                                    <Skeleton variant="text" width="40%" height={14} />
                                                    <Skeleton variant="text" width="60%" height={16} sx={{ mt: 1 }} />
                                                    <Skeleton variant="text" width="80%" height={16} sx={{ mt: 1 }} />
                                                    <Skeleton variant="text" width="100%" height={16} sx={{ mt: 1 }} />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                            }
                        </Grid>
                    )
                }
            </Grid>
        </Grid>
    </Page>
    )
}

export default Cheatsheets

export const useDocsCourseRelated = (slugTopic: string) => useQuery({
    queryKey: ['useDocsCourseRelated_' + slugTopic], queryFn: () => docsService.getCourseRelated(slugTopic),
    initialData: null,
    staleTime: (st) => {
        if (st.state.data === null) return 0;
        if (st.state.data?.length !== 0) return Infinity;

        return 0;
    },
});

export const useCheatsheetLanguages = (subtab3?: string) => useQuery({
    queryKey: ['useCheatsheetLanguages_' + (subtab3 ?? 'none')], queryFn: async () => {
        if (subtab3) {
            return [
                {
                    title: 'None',
                    slug: 'none'
                }
            ];
        }
        return (await cheatsheetsService.getLanguages()).map(item => ({
            title: item.title,
            slug: item.slug
        }));
    },
    initialData: [],
});


export const useCheatsheetSubjects = (subtab3?: string) => useQuery({
    queryKey: ['useCheatsheetSubjects_' + (subtab3 ?? 'none')], queryFn: async () => {
        if (subtab3) {
            return [
                {
                    title: 'None',
                    slug: 'none'
                }
            ];
        }

        return (await cheatsheetsService.getSubjects()).map(item => ({
            title: item.title,
            slug: item.slug
        }));
    },
    initialData: [],
});


export const useCheatsheets = (slugLanguage?: string, slugSubject?: string, subtab3?: string, callbackNotFound?: () => void) => useQuery({
    queryKey: [[slugLanguage, slugSubject, subtab3].filter(item => item !== undefined).join('/')],
    queryFn: async () => {
        if (subtab3) {
            return {
                title: 'None',
                posts: []
            };
        }

        const result = await cheatsheetsService.getCheatsheets(slugLanguage, slugSubject);

        if (result) {
            return result;
        }

        if (callbackNotFound) {
            callbackNotFound();
        }

        return null;
    },
    initialData: null,
});
