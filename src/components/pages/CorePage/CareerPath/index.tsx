import { Box, Typography } from '@mui/material';
import Grid from 'components/atoms/Grid';
import Banner2, { Banner2Loading } from 'components/molecules/Banner2';
import CourseSingle from 'components/molecules/CourseSingle';
import Page from 'components/templates/Page';
import { getImageUrl } from 'helpers/image';
import { useIndexedDB } from 'hook/useApi';
import useReaction from 'hook/useReaction';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import careerPathsService, { ICareerPaths } from 'services/careerPathsService';
import RoadmapSingle from '../Roadmap/components/RoadmapSingle';
import { LoadingButton } from '@mui/lab';
import { nFormatter } from 'helpers/number';
import Icon from 'components/atoms/Icon';
import { UserState, useUser } from 'store/user/user.reducers';

const CareerPath = () => {

    let { tab } = useParams<{
        tab: string,
    }>();

    const user = useUser();

    const { data: careerPath, setData: setCareerPath } = useIndexedDB<ICareerPaths | undefined>({
        key: 'CareerPath/' + tab,
        defaultValue: undefined,
    });

    const reactionHook = useReaction({
        post: {
            ...(careerPath ? careerPath : { id: 0 }),
            type: 'e_career_path'
        },
        reactionPostType: 'e_career_path_save',
        keyReactionCurrent: 'my_reaction_type',
        reactionTypes: ['save'],
        afterReaction: (result) => {
            setCareerPath(prev => (prev ? {
                ...prev,
                count_save: result.summary?.save?.count ?? 0,
                my_reaction_type: result.my_reaction,
            } : prev));
        },
    });


    React.useEffect(() => {
        if (tab && user._state !== UserState.unknown) {
            (async () => {
                setCareerPath(await careerPathsService.getDetail(tab));
            })();
        }
    }, [tab, user._state]);

    if (tab) {
        return (<Page
            title={'...'}
        >
            {
                careerPath ?
                    <Banner2
                        color={careerPath.color ? careerPath.color : 'rgb(210, 239, 249)'}
                        image={getImageUrl(careerPath.featured_image ?? '')}
                    >
                        <Typography sx={(theme) => ({
                            mt: 3,
                            fontWeight: 500,
                            fontSize: 14,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: theme.palette.text.disabled,
                            '&:after': {
                                backgroundColor: theme.palette.primary.main,
                                content: "''",
                                display: 'block',
                                height: '2px',
                                marginTop: '16px',
                                width: '80px',
                            }
                        })}>Career Path</Typography>
                        <Typography
                            sx={{ mt: 3, lineHeight: '56px', letterSpacing: '-0.5px', fontSize: 48, fontWeight: 400 }}
                            variant='h1' component='h2'>
                            {careerPath.title ?? ''}
                        </Typography>
                        <Typography
                            sx={{ mt: 2, lineHeight: '28px', fontSize: 18 }}
                            variant='subtitle1'>
                            {careerPath.short_description ?? ''}
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mt: 2,
                            }}
                        >

                            <LoadingButton
                                variant='outlined'
                                loading={reactionHook.isLoading}
                                onClick={() => {
                                    if (careerPath.my_reaction_type === 'save') {
                                        reactionHook.handleReactionClick(careerPath.id, '');
                                    } else {
                                        reactionHook.handleReactionClick(careerPath.id, 'save');
                                    }
                                }}
                                color={careerPath.my_reaction_type === 'save' ? "primary" : 'inherit'}
                                startIcon={careerPath.my_reaction_type === 'save' ? <Icon icon="Bookmark" /> : <Icon icon="BookmarkBorder" />}>
                                Lưu
                            </LoadingButton>
                            {
                                reactionHook.totalReaction ?
                                    <Typography>{nFormatter(reactionHook.totalReaction + (Number(careerPath.count_save_fake) ? Number(careerPath.count_save_fake) : 0))} người đã lưu</Typography>
                                    :
                                    <></>
                            }
                        </Box>
                    </Banner2>
                    :
                    <Banner2Loading />
            }
            <Box
                sx={{
                    mt: 12
                }}
            >
                {
                    careerPath && Array.isArray(careerPath.roadmaps) ?
                        <Box
                            sx={{
                                mt: 9
                            }}
                        >
                            <Typography variant='h2'>1. Roadmaps</Typography>
                            <Typography sx={{ maxWidth: 600, mt: 1, fontSize: 16, mb: 3 }}>Một kế hoạch học tập chi tiết và cập nhật liên tục để phát triển kỹ năng và kinh nghiệm cần thiết để thăng tiến trong nghề. Cung cấp cho mọi người thông tin về các công nghệ mới và các kỹ năng được yêu cầu trong thị trường, giúp mọi người định hướng và quản lý quá trình học tập của mình. </Typography>
                            {
                                careerPath.roadmaps.length ?
                                    <Grid
                                        container
                                        spacing={2}
                                    >
                                        {
                                            careerPath.roadmaps.map((item) => (
                                                <Grid
                                                    key={item.id}
                                                    item
                                                    md={3}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <RoadmapSingle inPopup roadmap={item} />
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                    :
                                    null
                            }
                        </Box>
                        :
                        <></>
                }
                {
                    careerPath && Array.isArray(careerPath.content) ?
                        careerPath.content.map((item, index) => (
                            <Box
                                key={careerPath.id + ' - ' + index}
                                sx={{
                                    mt: 9
                                }}
                            >
                                <Typography variant='h2'>{index + 2}. {item.title}</Typography>
                                <Typography sx={{ maxWidth: 600, mt: 1, fontSize: 16, mb: 3 }}>{item.description}</Typography>
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
                                                        <CourseSingle
                                                            course={item}
                                                            completed={careerPath.completion?.[item.id] !== undefined ? careerPath.completion[item.id] : undefined}
                                                            isPurchased={item.is_purchased ? true : false}
                                                            is_trial={item.course_detail?.is_allow_trial ? 1 : 0}
                                                        />
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
