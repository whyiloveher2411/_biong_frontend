import { Box, Typography } from '@mui/material';
import Grid from 'components/atoms/Grid';
import Banner from 'components/molecules/Banner';
import CourseSingle from 'components/molecules/CourseSingle';
import Page from 'components/templates/Page';
import { getImageUrl } from 'helpers/image';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import careerPathsService, { ICareerPaths } from 'services/careerPathsService';

const CareerPath = () => {

    let { tab } = useParams<{
        tab: string,
    }>();

    const [careerPath, setCareerPath] = React.useState<ICareerPaths | undefined>(undefined);

    React.useEffect(() => {
        if (tab) {

            (async () => {
                setCareerPath(await careerPathsService.getDetail(tab));
            })();

        }
    }, [tab]);

    if (tab) {
        return (<Page
            title={'...'}
        >
            <Banner
                subTitle='Career Path'
                title={careerPath ? careerPath.title : ''}
                description={careerPath ? careerPath.short_description : ''}
                color='rgb(194, 228, 190)'
                image={getImageUrl(careerPath?.featured_image ?? '')}
            />
            <Box
                sx={{
                    mt: 12
                }}
            >
                {
                    careerPath && Array.isArray(careerPath.content) ?
                        careerPath.content.map((item, index) => (
                            <Box
                                key={careerPath.id + ' - ' + index}
                                sx={{
                                    mt: 6
                                }}
                            >
                                <Typography variant='h3'>{item.title}</Typography>
                                <Typography sx={{ maxWidth: 600, mt: 1, fontSize: 16, mb: 2 }}>{item.description}</Typography>
                                {
                                    item.courses.length ?
                                        <Grid
                                            container
                                            spacing={6}
                                            sx={{
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {
                                                item.courses.map((item, index) => (
                                                    <Grid
                                                        key={index}
                                                        item
                                                        xs={12}
                                                        md={6}
                                                        lg={4}
                                                    >
                                                        <CourseSingle course={item} />
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
                                        :
                                        null
                                }
                            </Box>
                        ))
                        :
                        <></>
                }
            </Box>
        </Page>)
    }

    return <Navigate to="/" />
};

export default CareerPath;
