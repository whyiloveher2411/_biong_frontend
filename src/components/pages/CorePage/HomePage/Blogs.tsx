import { Box, Button } from '@mui/material';
import Grid from 'components/atoms/Grid';
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import MarketingNewsMiniPlayer from 'components/molecules/MarketingNewsMiniPlayer';
import MarketingPostCard, { MarketingPostCardSkeleton } from 'components/molecules/MarketingPostCard';
import { SPACEDEV_IOS_APP_STORE_URL } from 'constants/spacedevApp';
import { __, getLanguage } from 'helpers/i18n';
import { useIndexedDB } from 'hook/useApi';
import {
    MARKETING_NEWS_MINI_PLAYER_HEIGHT,
    MarketingNewsAudioProvider,
    useMarketingNewsAudio,
} from 'hook/useMarketingNewsAudio';
import React from 'react';
import marketingNewsService, { MarketingHomePost } from 'services/marketingNewsService';
import { UserState, useUser } from 'store/user/user.reducers';

function BlogsContent() {
    const { data: posts, setData: setPosts } = useIndexedDB<MarketingHomePost[] | null>({
        key: 'Homepage/MarketingPosts/v6-audio-token',
        defaultValue: null,
    });

    const user = useUser();
    const audio = useMarketingNewsAudio();
    const showMiniPlayer = audio.session !== null;
    const languageCode = getLanguage()?.code ?? 'vi';

    React.useEffect(() => {
        if (user._state === UserState.unknown) {
            return undefined;
        }

        let cancelled = false;

        (async () => {
            const nextPosts = await marketingNewsService.getHomepagePosts();
            if (!cancelled) {
                setPosts(nextPosts);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [user._state, languageCode]);

    if (posts !== null && posts.length === 0) {
        return null;
    }

    return (
        <>
            <Box
                component="section"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    mt: { xs: 6, md: 8 },
                    pb: showMiniPlayer ? `${MARKETING_NEWS_MINI_PLAYER_HEIGHT + 16}px` : 0,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 280 }, maxWidth: 720 }}>
                        <Typography sx={{ fontWeight: 400 }} variant="h3" component="h2">
                            {__('Bài viết mới nhất')}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 1,
                                lineHeight: 1.5,
                                fontSize: { xs: 14, md: 15 },
                            }}
                        >
                            {__(
                                'Xem nội dung đầy đủ, nghe audio và nhận tin mới mỗi ngày trên app Spacedev — tải miễn phí trên App Store.',
                            )}
                        </Typography>
                    </Box>

                    <Button
                        variant="text"
                        component="a"
                        href={SPACEDEV_IOS_APP_STORE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<Icon icon="ArrowForwardRounded" />}
                        sx={{ flexShrink: 0, alignSelf: { xs: 'flex-start', sm: 'center' } }}
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
                                  <MarketingPostCard
                                      post={item}
                                      appStoreUrl={SPACEDEV_IOS_APP_STORE_URL}
                                      audioState={
                                          item.hasAudio
                                              ? {
                                                    isSessionPost: audio.isSessionPost(item),
                                                    isPlaying:
                                                        audio.isSessionPost(item) && audio.isPlaying,
                                                    isLoading:
                                                        audio.isSessionPost(item) && audio.isLoading,
                                                }
                                              : undefined
                                      }
                                      onAudioCardClick={audio.playPost}
                                  />
                              </Grid>
                          ))
                        : [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                              <Grid key={item} item xs={12} sm={6} md={4}>
                                  <MarketingPostCardSkeleton />
                              </Grid>
                          ))}
                </Grid>
            </Box>
            <MarketingNewsMiniPlayer />
        </>
    );
}

function Blogs() {
    return (
        <MarketingNewsAudioProvider>
            <BlogsContent />
        </MarketingNewsAudioProvider>
    );
}

export default Blogs;
