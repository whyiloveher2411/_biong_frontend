import { Box, IconButton, Skeleton, Theme } from '@mui/material';
import Icon from 'components/atoms/Icon';
import makeCSS from 'components/atoms/makeCSS';
import Typography from 'components/atoms/Typography';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import exploreService, { ExploreProps } from 'services/exploreService';

const useStyles = makeCSS((theme: Theme) => ({
    content: {
        marginTop: theme.spacing(3),
        '& p': {
            margin: theme.spacing(1, 0)
        },
        '& img': {
            display: 'block',
            margin: '24px auto',
        }
    }
}));

const ExploreDetail = () => {

    const classes = useStyles();

    const [explore, setExplore] = React.useState<ExploreProps | null>(null);

    const { tab } = useParams();

    const navigate = useNavigate();

    React.useEffect(() => {

        (async () => {
            if (tab) {
                let exploreFormDB = await exploreService.find(tab);

                if (exploreFormDB) {
                    setExplore(exploreFormDB);
                } else {
                    navigate('/explore');
                }
            }
        })()

    }, []);

    return (
        <Page
            title={explore ? explore.title : __("Explore")}
            isHeaderSticky
            header={
                explore ?
                    <>
                        <Link
                            to="/explore"
                        >
                            <Typography
                                component="h2"
                                gutterBottom
                                variant="overline"
                            >
                                {__('Explore')}
                            </Typography>
                        </Link>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <IconButton
                                component={Link}
                                to={"/explore"}
                            >
                                <Icon icon="ArrowBack" />
                            </IconButton>
                            <Typography
                                component="h1"
                                gutterBottom
                                variant="h3"
                            >
                                {explore.title}
                            </Typography>
                        </Box>

                    </>
                    :
                    <>
                        <Skeleton>
                            <Typography
                                component="h2"
                                gutterBottom
                                variant="overline"
                            >
                                {__('Explore')}
                            </Typography>
                        </Skeleton>
                        <Skeleton>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <IconButton
                                    component={Link}
                                    to={"/explore"}
                                >
                                    <Icon icon="ArrowBack" />
                                </IconButton>
                                <Typography
                                    component="h1"
                                    gutterBottom
                                    variant="h3"
                                >
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                                </Typography>
                            </Box>
                        </Skeleton>
                    </>
            }
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mt: 8
                }}
            >
                {
                    explore ?
                        <>
                            <Typography variant="subtitle1">
                                {explore.description}
                            </Typography>
                            <Box className={classes.content} dangerouslySetInnerHTML={{ __html: explore.content }} />
                        </>
                        :
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
                            <Skeleton key={item} variant="rectangular" sx={{ mt: 2 }}>
                                <Typography variant="subtitle1">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea labore veritatis eum eius, dignissimos deleniti id! Natus officia sapiente quisquam maiores labore temporibus perspiciatis, aspernatur commodi beatae. Aliquid, consequatur consequuntur!
                                </Typography>
                            </Skeleton>
                        ))
                }
            </Box>
        </Page>
    );
};

export default ExploreDetail;
