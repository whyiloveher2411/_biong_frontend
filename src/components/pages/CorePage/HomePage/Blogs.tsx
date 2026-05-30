import { Box, Button } from '@mui/material';
import Grid from 'components/atoms/Grid';
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import MarketingPostCard, { MarketingPostCardSkeleton } from 'components/molecules/MarketingPostCard';
import { SPACEDEV_IOS_APP_STORE_URL } from 'constants/spacedevApp';
import { __ } from 'helpers/i18n';
import { useIndexedDB } from 'hook/useApi';
import React from 'react';
import marketingNewsService, { MarketingHomePost } from 'services/marketingNewsService';
import { UserState, useUser } from 'store/user/user.reducers';

function Blogs() {
    const { data: posts, setData: setPosts } = useIndexedDB<MarketingHomePost[] | null>({
        key: 'Homepage/MarketingPosts',
        defaultValue: null,
    });

    const user = useUser();

    React.useEffect(() => {
        if (user._state !== UserState.unknown) {
            (async () => {
                setPosts(await marketingNewsService.getHomepagePosts());
            })();
        }
    }, [user, setPosts]);

    if (posts !== null && posts.length === 0) {
        return null;
    }

    return (
        <Box
            component="section"
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
                <Typography sx={{ fontWeight: 400 }} variant="h3" component="h2">
                    {__('Bài viết mới nhất')}
                </Typography>

                <Button
                    variant="text"
                    component="a"
                    href={SPACEDEV_IOS_APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<Icon icon="ArrowForwardRounded" />}
                >
                    {__('Xem trên ứng dụng')}
                </Button>
            </Box>
            <Grid
                container
                spacing={4}
                sx={{
                    justifyContent: 'center',
                }}
            >
                {posts !== null
                    ? posts.map((item) => (
                          <Grid key={item.id} item xs={12} sm={6} md={4}>
                              <MarketingPostCard post={item} appStoreUrl={SPACEDEV_IOS_APP_STORE_URL} />
                          </Grid>
                      ))
                    : [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                          <Grid key={item} item xs={12} sm={6} md={4}>
                              <MarketingPostCardSkeleton />
                          </Grid>
                      ))}
            </Grid>
        </Box>
    );
}

export default Blogs;
