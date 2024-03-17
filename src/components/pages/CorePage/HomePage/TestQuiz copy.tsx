import { Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { getImageUrl } from 'helpers/image';
import { numberWithSeparator } from 'helpers/number';
import { useIndexedDB } from 'hook/useApi';
import TestCategory from 'plugins/Vn4Test/TestCategory';
import testService, { IHomePageTestItem } from 'plugins/Vn4Test/testService';
import React from 'react';

function TestQuiz() {

    const { data: tests, setData: setTests } = useIndexedDB<{
        posts: Array<IHomePageTestItem>,
        total: number,
    } | undefined | null>({ key: 'Homepage/testquiz', defaultValue: null });

    React.useEffect(() => {
        (async () => {
            const tests = await testService.getHomepageTestCategory();
            setTests(tests);
        })()
    }, []);

    if (tests) {
        if (tests.posts?.length) {
            return (<Box
                component='section'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    mt: 12,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1,
                    }}
                >
                    <Typography sx={{ fontWeight: 400 }} variant='h3' component='h2'>Hơn {numberWithSeparator(tests?.total ?? 0)} câu hỏi từ HTML, CSS, JS, và React</Typography>
                </Box>

                <Grid
                    container
                    spacing={2}
                >
                    {
                        tests.posts?.map((item, index) => (
                            <Grid
                                key={index}
                                item
                                lg={6}
                                md={12}
                                sm={12}
                                xs={12}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                        }}
                                    >
                                        <ImageLazyLoading
                                            src={getImageUrl(item.image)}
                                            sx={{
                                                width: 48,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                width: '100%',
                                            }}
                                        >
                                            <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                                            <Typography>{item.description}</Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                flexShrink: 0,
                                                whiteSpace: 'nowrap',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <Typography>
                                                +{numberWithSeparator(item.count)} câu hỏi
                                            </Typography>
                                            <TestCategory
                                                category={item.category}
                                                image={item.image}
                                                title={item.title}
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>)
        }

        return null;
    }

    return (<Box
        component='section'
        sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            mt: 12,
        }}
    >
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
            }}
        >
            <Skeleton>
                <Typography sx={{ fontWeight: 400 }} variant='h3' component='h2'>Hơn 123 bài tập từ HTML, CSS, JS, và React</Typography>
            </Skeleton>
        </Box>

        <Grid
            container
            spacing={2}
        >
            {
                [1, 2, 3, 4].map((item) => (
                    <Grid
                        key={item}
                        item
                        lg={6}
                        md={12}
                        sm={12}
                        xs={12}
                    >
                        <Card
                            sx={{
                                height: '100%',
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 2,
                                }}
                            >
                                <Skeleton
                                    variant='rectangular'
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        flexShrink: 0,
                                    }}
                                />
                                <Box>
                                    <Skeleton><Typography sx={{ fontWeight: 600 }}>HTML-CSS-JS</Typography></Skeleton>
                                    <Skeleton><Typography>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error in non consectetur eveniet et voluptas aut provident.</Typography></Skeleton>
                                </Box>
                                <Box
                                    sx={{
                                        flexShrink: 0,
                                        whiteSpace: 'nowrap',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Skeleton> <Typography>
                                        +123 câu hỏi
                                    </Typography></Skeleton>
                                    <Skeleton variant='rectangular' sx={{ height: 29, width: 95, borderRadius: 20, }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))

            }


        </Grid>
    </Box>)
}

export default TestQuiz