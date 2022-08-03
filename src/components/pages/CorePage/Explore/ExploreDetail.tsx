import { Box, Skeleton, Theme } from '@mui/material';
import makeCSS from 'components/atoms/makeCSS';
import Typography from 'components/atoms/Typography';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
