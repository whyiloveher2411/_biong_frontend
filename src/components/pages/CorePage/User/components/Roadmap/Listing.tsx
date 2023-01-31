import Box from 'components/atoms/Box';
import Button from 'components/atoms/Button';
import Grid from 'components/atoms/Grid';
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import NoticeContent from 'components/molecules/NoticeContent';
import RoadmapSingle from 'components/pages/CorePage/Roadmap/components/RoadmapSingle';
import { __ } from 'helpers/i18n';
import { useIndexedDB } from 'hook/useApi';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import elearningService, { Roadmap } from 'services/elearningService';
import { RootState } from 'store/configureStore';
import { UserProps } from 'store/user/user.reducers';

function Listing({ user }: {
    user: UserProps
}) {
    const { data: roadmaps, setData: setRoadmaps } = useIndexedDB<Array<Roadmap> | null | undefined>({ key: 'UserProfile/' + user.slug + '/Roadmaps', defaultValue: null });

    const myAccount = useSelector((state: RootState) => state.user);

    React.useEffect(() => {
        if (!user.is_private_account || (myAccount && user && (myAccount.id + '') === (user.id + ''))) {
            (async () => {
                const roadmapApi = await elearningService.roadmap.getOfUser(user.slug);
                setRoadmaps(roadmapApi?.roadmaps);
            })()
        }
    }, []);

    if (!user.is_private_account || (myAccount && user && (myAccount.id + '') === (user.id + ''))) {
        if (roadmaps && roadmaps.length < 1) {
            return (<>
                <NoticeContent
                    title={__('Không tìm thấy roadmap')}
                    description={__('{{username}} không lưu roadmap nào.', {
                        username: user.full_name
                    })}
                    image="/images/undraw_work_chat_erdt.svg"
                    buttonLink="/roadmap"
                    buttonLabel={__("Danh sách roadmap")}
                />
            </>)
        }
        return (
            <>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                    }}
                >
                    <Typography sx={{ fontWeight: 400 }} variant='h3' component='h2'>{__('Roadmap {{name}} đã lưu', { name: user.full_name })}</Typography>
                    <Button
                        variant='text'
                        component={Link}
                        to={'/roadmap'}
                        startIcon={<Icon icon="ArrowForwardRounded" />}
                    >
                        {__('Tất cả roadmap')}
                    </Button>
                </Box>
                <Grid
                    container
                    spacing={2}
                >
                    {
                        roadmaps ?
                            roadmaps.map(item => (
                                <Grid
                                    key={item.id}
                                    item
                                    md={3}
                                    sm={6}
                                    xs={12}
                                    onClick={() => {
                                        window.__disable_scroll = true;
                                    }}
                                >
                                    <RoadmapSingle linkTo={'/user/' + user.slug + '/roadmap/' + item.slug} roadmap={item} />
                                </Grid>
                            ))
                            :
                            [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                <Grid
                                    key={item}
                                    item
                                    md={3}
                                    sm={6}
                                    xs={12}
                                >
                                    <RoadmapSingle />
                                </Grid>
                            ))
                    }
                </Grid>
            </>
        )
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: 800,
                margin: '24px auto 0',
            }}
        >
            <Typography variant="h4">{__('Tài khoản riêng tư')}</Typography>
            <Typography>{__('The account is currently private, so only followers can see their roadmap')}</Typography>
        </Box>
    );

}

export default Listing