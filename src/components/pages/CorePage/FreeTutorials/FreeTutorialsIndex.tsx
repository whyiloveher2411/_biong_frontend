import { Box, Grid, Skeleton, Typography } from '@mui/material';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import React from 'react';
import { Link } from 'react-router-dom';
import elearningService from 'services/elearningService';
import { FreeTutorialCategoryProps } from 'services/elearningService/@type';

function FreeTutorialsIndex() {

    const [groups, setGroups] = React.useState<Array<{
        id: ID,
        title: string,
        categories?: FreeTutorialCategoryProps[]
    }> | null>(null);

    React.useEffect(() => {

        (async () => {

            const categories = await elearningService.freeTutorial.getCategories();

            setGroups(categories);

        })()

    }, []);


    return (
        <Page
            title={__('Free tutorials')}
            description='Bạn có thắc mắc hay cần báo cáo vấn đề xảy ra với sản phẩm hoặc dịch vụ của Spacedev.vn? Chúng tôi luôn sẵn sàng hỗ trợ bạn.'
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
        >
            <Box
                sx={{
                    mt: 12
                }}
            >
                {
                    groups ?
                        groups.map(group => (
                            <>
                                <Typography variant='h3' sx={{ mt: 6, p: 1, backgroundColor: 'divider', }}>{group.title}</Typography>
                                <Grid
                                    key={group.id}
                                    container
                                    spacing={3}
                                >
                                    {
                                        group.categories?.map((item, index) => (
                                            <Grid
                                                key={index}
                                                item
                                                md={4}
                                                sx={{
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    flexDirection: 'column',
                                                    mt: 4,
                                                }}
                                                component={Link}
                                                to={'/free-tutorials/' + item.slug}
                                            >
                                                <ImageLazyLoading sx={{ width: 'auto', textAlign: 'center', height: 200, borderRadius: 1, }} src={getImageUrl(item.featured_image)} />
                                                <Typography sx={{ mt: 2 }} align='center' variant='h4'>{item.title}</Typography>
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </>
                        ))
                        :
                        <>
                            <Skeleton variant='text' sx={{ mt: 6, p: 1, }} >
                                <Typography variant='h3'>Lorem ipsum dolor</Typography>
                            </Skeleton>
                            <Grid
                                container
                                spacing={3}
                            >
                                {
                                    [1, 2, 3, 4, 5, 6].map(item => (
                                        <Grid key={item}
                                            item
                                            md={4}
                                            sx={{
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                                mt: 4,
                                            }}
                                        >
                                            <Skeleton variant='rectangular' sx={{ transform: 'scale(1, 1)', width: '100%', height: 200, borderRadius: 1, }} />
                                            <Skeleton variant='text' sx={{ mt: 2 }} />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </>
                }
            </Box>
        </Page>
    )
}

export default FreeTutorialsIndex