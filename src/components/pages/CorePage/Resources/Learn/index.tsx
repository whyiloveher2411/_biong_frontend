import BookmarkBorder from '@mui/icons-material/BookmarkBorder';
import { Box, Button, Grid, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import CodeBlock from 'components/atoms/CodeBlock';
import Page from 'components/templates/Page';
import { compiler } from 'markdown-to-jsx';
import { renderToString } from 'react-dom/server';
import { Link, useNavigate, useParams } from 'react-router-dom';
import cheatsheetsService from 'services/cheatsheetsService';
import BreadcrumbsLearn from './components/BreadcrumbsLearn';
import { Bookmark, Share } from '@mui/icons-material';
import useBookmarks from 'hook/useBookmarks';

function Learn() {

    let { subtab1, subtab2, subtab3 } = useParams<{
        subtab1: string,
        subtab2: string,
        subtab3: string,
    }>();

    const bookmark = useBookmarks('cheatsheet');
    const navigate = useNavigate();
    const { data: modules } = useCheatsheetModules(subtab1);
    const { data: cheatsheetModule } = useCheatsheetModuleDetail(subtab1, subtab2, subtab3);
    const { data: cheatsheet } = useCheatsheet(subtab1, () => {
        navigate('/resources/cheatsheets/all');
    });

    return (<Page
        title={cheatsheet?.title || 'Cheatsheet'}
        description={''}
        image='images/share-fb-540x282-2.jpg'
        maxWidth='100%'
    >
        <Box>
            <Box
                sx={(theme) => ({
                    ml: -2,
                    mr: -2,
                    position: 'relative',
                    opacity: 0.8,
                    pt: 16,
                    mb: 3,
                    zIndex: 10,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'radial-gradient(' + theme.palette.text.primary + ' 0.5px, transparent 0.5px), radial-gradient(' + theme.palette.text.primary + ' 0.5px, ' + theme.palette.body.background + ' 0.5px)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 10px 10px',
                        zIndex: 0,
                        opacity: 0.4
                    }
                })}
            >
                <Box
                    sx={{
                        maxWidth: '1328px',
                        margin: '0 auto',
                        padding: '0 24px',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <Grid container spacing={6}>
                        <Grid item sm={3} />
                        <Grid
                            item sm={9}
                            sx={{ position: 'relative', pb: 16, }}
                        >
                            <BreadcrumbsLearn content={cheatsheet} />
                            {
                                cheatsheetModule ?
                                    <Typography variant='h1' sx={{ fontWeight: 'bold', fontSize: '64px', lineHeight: '72px' }}>{cheatsheetModule?.title}</Typography>
                                    :
                                    <Skeleton variant="text" sx={{ fontSize: '64px', width: '60%', height: 72 }} />
                            }
                            <Box sx={{ position: 'absolute', bottom: 16, right: 0, display: 'flex', gap: 2 }}>
                                <Button
                                    startIcon={<Share />}
                                    variant='outlined'
                                    sx={{
                                        textTransform: 'unset',
                                        height: 36.5,
                                    }}
                                    onClick={() => {
                                        // 
                                    }}
                                >
                                    Chia sẻ
                                </Button>
                                {
                                    cheatsheet ?
                                        bookmark.isBookmarked(cheatsheet.id) ?
                                            <Button
                                                startIcon={<Bookmark />}
                                                variant='contained'
                                                color='warning'
                                                sx={{
                                                    textTransform: 'unset',
                                                    height: 36.5,
                                                    width: 120,
                                                }}
                                                onClick={() => {
                                                    bookmark.toggle(cheatsheet.id);
                                                }}
                                            >
                                                Bookmark
                                            </Button>
                                            :
                                            <Button
                                                startIcon={<BookmarkBorder />}
                                                variant='outlined'
                                                color='warning'
                                                sx={{
                                                    textTransform: 'unset',
                                                    height: 36.5,
                                                    width: 120,
                                                }}
                                                onClick={() => {
                                                    bookmark.toggle(cheatsheet.id);
                                                }}
                                            >
                                                Bookmark
                                            </Button>
                                        : null
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        maxWidth: '1328px',
                        margin: '0 auto',
                        padding: '0 24px',
                        position: 'relative',
                        zIndex: 1,
                    }}

                >
                    <Grid container spacing={6}>
                        <Grid item md={3}>
                            <Box
                                sx={{
                                    mt: -8,
                                    backgroundColor: 'divider',
                                    borderRadius: '10px',
                                    padding: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'sticky',
                                    top: '74px',
                                }}
                            >
                                <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '18px', p: 3, pb: 1 }}>Chủ đề</Typography>
                                {
                                    modules ?
                                        modules.map((item, index) => (
                                            <Button
                                                component={Link}
                                                to={`/resources/learn/${subtab1}/${item.slug}`} key={index}
                                                sx={{
                                                    textTransform: 'capitalize',
                                                    justifyContent: 'flex-start',
                                                    color: 'text.primary',
                                                    position: 'relative',
                                                    pl: 3,
                                                    whiteSpace: 'normal',
                                                    ...((!subtab2 && index === 0) || (subtab2 === item.slug) ? {
                                                        ':before': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: -8,
                                                            width: '5px',
                                                            height: '100%',
                                                            backgroundColor: 'primary.main'
                                                        }
                                                    } : {}),
                                                }}
                                            >
                                                {item.title}
                                            </Button>
                                        ))
                                        :
                                        [...Array(6)].map((_, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    mt: 1, pl: 3, pr: 3,
                                                    pt: 1,
                                                }}
                                            >
                                                <Skeleton variant="text" width="100%" height={20} />
                                            </Box>
                                        ))
                                }
                            </Box>
                        </Grid>
                        <Grid item md={9}>
                            {
                                !cheatsheetModule ?
                                    [...Array(3)].map((_, index) => (
                                        <Box key={index}>
                                            <Skeleton variant="text" sx={{ fontSize: '24px', width: '70%', mb: 3, mt: 3, pt: 4 }} />
                                            <Grid container spacing={2}>
                                                <Grid item md={5}>
                                                    <Skeleton variant="rectangular" height={180} />
                                                </Grid>
                                                <Grid item md={1} />
                                                <Grid item md={6}>
                                                    <Skeleton variant="rectangular" height={180} />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))
                                    :
                                    cheatsheetModule?.contents.map((item, index) => (
                                        <Box key={index}>
                                            <CodeBlock
                                                html={renderToString(compiler(item.title))} sx={{
                                                    '.markdown': {
                                                        '&>p': {
                                                            mt: 3, mb: 3, pt: 4,
                                                            fontWeight: 'bold', fontSize: '24px'
                                                        }
                                                    },
                                                }}
                                                changeLinks={{ source: 'https://www.codecademy.com', to: 'https://spacedev.vn' }}
                                                disableCopyButton />
                                            <Grid container spacing={2}>
                                                <Grid item md={5} sx={{ fontSize: '18px' }}>
                                                    <CodeBlock
                                                        html={renderToString(compiler(item.body))}
                                                        disableCopyButton sx={{ lineHeight: '32px', }}
                                                        changeLinks={{ source: 'https://www.codecademy.com', to: 'https://spacedev.vn' }}
                                                    />
                                                </Grid>
                                                <Grid item md={1} />
                                                <Grid item md={6} >
                                                    {
                                                        item.code_snippets.map((code, index) => (
                                                            <CodeBlock key={index} sx={{ mt: 0 }} html={'<pre class="language-' + code.language + '"><code class="language-' + code.language + '">' + code.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;') + '</code></pre>'} />
                                                        ))
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))
                            }
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    </Page >
    )
}

export default Learn



export const useCheatsheet = (slugCheatsheet: string | undefined, callbackNotFound?: () => void) => useQuery({
    queryKey: ['useCheatsheet_' + (slugCheatsheet ?? 'none')], queryFn: async () => {

        if (!slugCheatsheet) return null;

        const result = await cheatsheetsService.getCheatsheet(slugCheatsheet);

        if (result) {
            return result;
        }

        if (callbackNotFound) {
            callbackNotFound();
        }
    },
});


export const useCheatsheetModuleDetail = (slugCheatsheet?: string, slugModule?: string, slug?: string) => useQuery({
    queryKey: ['useCheatsheetModuleDetail_' + slugCheatsheet + '/' + slugModule + '/' + slug], queryFn: () => {

        if (!slugCheatsheet) return null;

        return cheatsheetsService.getModuleDetail(slugCheatsheet, slugModule, slug);
    },
    initialData: null,
});

export const useCheatsheetModules = (slugCheatsheet?: string) => useQuery({
    queryKey: ['useCheatsheetModules_' + slugCheatsheet], queryFn: () => {

        if (!slugCheatsheet) return null;

        return cheatsheetsService.getModules(slugCheatsheet);
    },
    initialData: null,
});



