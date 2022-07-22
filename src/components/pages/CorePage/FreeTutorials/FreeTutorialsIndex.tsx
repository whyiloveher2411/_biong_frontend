import { Grid, Skeleton, Typography } from '@mui/material';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import React from 'react';
import { Link } from 'react-router-dom';
import elearningService from 'services/elearningService';
import { FreeTutorialCategoryProps } from 'services/elearningService/@type';

function FreeTutorialsIndex() {

    const [categories, setCategories] = React.useState<FreeTutorialCategoryProps[] | null>(null);

    React.useEffect(() => {

        (async () => {

            const categories = await elearningService.freeTutorial.getCategories();

            setCategories(categories);

        })()

    }, []);


    return (
        <Page
            title={__('Free tutorials')}
            isHeaderSticky
            header={
                <>
                    <Typography
                        component="h2"
                        gutterBottom
                        variant="overline"
                    >
                        {__('Course')}
                    </Typography>
                    <Typography
                        component="h1"
                        gutterBottom
                        variant="h3"
                    >
                        {__("Free tutorials")}
                    </Typography>
                </>
            }
        >
            <Grid
                container
                spacing={3}
            >
                {
                    categories ?
                        categories.map((item, index) => (
                            <Grid key={index}
                                item
                                md={4}
                                sx={{
                                    cursor: 'pointer',
                                }}
                                component={Link}
                                to={'/free-tutorials/' + item.slug}
                            >
                                <ImageLazyLoading sx={{ width: '100%', height: 210 }} src={getImageUrl(item.featured_image)} />
                                <Typography sx={{ mt: 1 }} align='center' variant='h4'>{item.title}</Typography>
                            </Grid>
                        ))
                        :
                        [1, 2, 3, 4, 5, 6].map(item => (
                            <Grid key={item}
                                item
                                md={4}
                            >
                                <Skeleton variant='rectangular' sx={{ transform: 'scale(1, 1)', width: '100%', height: 210 }} />
                                <Skeleton variant='text' sx={{ mt: 1 }} />
                            </Grid>
                        ))
                }
            </Grid>
        </Page>
    )
}

export default FreeTutorialsIndex