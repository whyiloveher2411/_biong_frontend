import { LoadingButton, Skeleton } from '@mui/lab'
import { Alert, Box, Button, IconButton, Link as LinkMui } from '@mui/material'
import Divider from 'components/atoms/Divider'
import Grid from 'components/atoms/Grid'
import Icon from 'components/atoms/Icon'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import Typography from 'components/atoms/Typography'
import DrawerCustom from 'components/molecules/DrawerCustom'
import NoticeContent from 'components/molecules/NoticeContent'
import Video from 'components/pages/CorePage/Course/components/preview/Video'
import { cssMaxLine } from 'helpers/dom'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import { validURL } from 'helpers/url'
import useQuery from 'hook/useQuery'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import elearningService, { Roadmap, RoadmapItem, RoadmapItemContentType } from 'services/elearningService'
import reactionService, { ReactionSummaryProps } from 'services/reactionService'
import { RootState } from 'store/configureStore'
import { UserProps, UserState } from 'store/user/user.reducers'
import './../../../Roadmap/components/index.css'

function Detail({ slug, user }: { user: UserProps, slug: string }) {

    const myAccount = useSelector((state: RootState) => state.user);

    const navigate = useNavigate();

    const useParamUrl = useQuery({
        course: 0,
        active: 0,
    });

    const [roadmap, setRoadmap] = React.useState<Roadmap | null>(null);

    const [activeRoadmapItem, setActiveRoadmapItem] = React.useState<{
        id: ID,
        idList: string | null
    } | null>(null);

    const [courses, setCourses] = React.useState<Array<{
        featured_image: string,
        id: ID,
        roadmap_item_related: string,
        slug: string,
        title: string,
    }> | null>(null);

    const [loadingInputDone, setLoadingInputDone] = React.useState(false);

    const [process, setProcess] = React.useState<{
        [key: string]: '[none]' | 'done'
    }>({});

    const [roadmapDetailItem, setRoadmapDetailItem] = React.useState<RoadmapItem | null>(null);

    const [roadmapItemSlug, setRoadmapDetailSlug] = React.useState<string | null>(null);

    const handleDoneRoadmapItem = () => {

        if (myAccount.id === user.id) {
            setLoadingInputDone(true);
            (async () => {

                if (roadmapDetailItem && roadmapItemSlug) {

                    const result: {
                        summary: { [key: string]: ReactionSummaryProps } | null,
                        my_reaction: string,
                    } = await reactionService.post({
                        post: roadmapDetailItem.id,
                        reaction: process[roadmapDetailItem.id] === 'done' ? '' : 'done',
                        type: 'e_learning_roadmap_item_done',
                        user_id: myAccount.id,
                    });

                    setProcess(prev => ({
                        ...prev,
                        [roadmapDetailItem.id as string]: result.my_reaction === 'done' ? result.my_reaction : '[none]',
                    }));

                }
                setLoadingInputDone(false);

            })()
        }
    }

    React.useEffect(() => {
        (async () => {
            if (roadmapItemSlug) {

                const getRoadmapItem = await elearningService.roadmap.getDetailItem(roadmapItemSlug);

                if (getRoadmapItem?.roadmapItem) {
                    setRoadmapDetailItem(getRoadmapItem.roadmapItem);
                }
            }
        })()
    }, [roadmapItemSlug]);

    React.useEffect(() => {

        if (user._state !== UserState.unknown) {
            (async () => {
                const api = await elearningService.roadmap.getDetailOfUser(user.slug, slug);

                if (api?.roadmap) {
                    setRoadmap(api?.roadmap);
                    setProcess(api.process ? api.process : {});
                    setCourses(api.courses ?? []);
                } else {
                    navigate('/user/' + user.slug + '/roadmap');
                }
            })()
        }
    }, [user]);

    React.useEffect(() => {
        if (roadmap) {
            document.querySelectorAll('#roadmap-detail .clickable-group[data-id]')?.forEach(item => {
                item.addEventListener('click', function () {
                    useParamUrl.changeQuery({
                        active: window.btoa(item.getAttribute('data-id') + ''),
                    })
                    // setRoadmapDetailSlug(item.getAttribute('data-id'))
                })
            });
        }
    }, [roadmap]);

    React.useEffect(() => {
        if (roadmap && process) {

            document.querySelectorAll('#roadmap-detail .clickable-group')?.forEach(item => {

                const dataId = item.getAttribute('data-id');

                if (dataId) {

                    if (process[dataId] && process[dataId] === 'done') {
                        item.classList.add('done');
                    } else {
                        item.classList.remove('done');
                    }

                    item.addEventListener('click', function () {
                        useParamUrl.changeQuery({
                            active: window.btoa(item.getAttribute('data-id') + ''),
                        })

                        // setRoadmapDetailSlug(item.getAttribute('data-id'))
                    })
                } else {
                    const dataRedirect = item.getAttribute('data-redirect');
                    if (dataRedirect) {
                        item.addEventListener('click', function () {
                            const urlItem = item.getAttribute('data-redirect') + '';

                            if (validURL(urlItem)) {
                                window.open(urlItem);
                            } else {
                                navigate(urlItem);
                            }
                        })
                    }
                }


            });
        }
    }, [roadmap, process]);

    React.useEffect(() => {

        if (activeRoadmapItem?.idList) {

            try {
                let listIDs = JSON.parse(activeRoadmapItem.idList);

                if (Array.isArray(listIDs)) {

                    let keyById: { [key: string]: boolean } = {};

                    listIDs.forEach((item: string) => {
                        keyById[item] = true;
                    });

                    document.querySelectorAll('#roadmap-detail .clickable-group')?.forEach(item => {
                        let idOfElement = item.getAttribute('data-id');
                        if (idOfElement && keyById[idOfElement]) {
                            item.classList.add('active-by-course');
                        } else {
                            item.classList.remove('active-by-course');
                        }
                    });
                }

            } catch (error) {
                //
            }
        }

    }, [activeRoadmapItem]);

    React.useEffect(() => {
        if (courses) {
            const indexOfCourse = useParamUrl.query.course ? courses.findIndex(item => item.slug === useParamUrl.query.course) : -1;

            if (indexOfCourse > -1) {
                setActiveRoadmapItem({
                    id: courses[indexOfCourse].id,
                    idList: courses[indexOfCourse].roadmap_item_related
                });
            } else {
                setActiveRoadmapItem(null);
            }
        }
    }, [useParamUrl.query.course, courses]);

    React.useEffect(() => {

        if (useParamUrl.query.active) {
            const id = atobCustom(useParamUrl.query.active + '');
            if (id && document.querySelectorAll('#roadmap-detail .clickable-group[data-id="' + id + '"')) {
                setRoadmapDetailSlug(id);
                return;
            }
        }

        setRoadmapDetailSlug(null);
    }, [useParamUrl.query.active]);

    return (
        <Box>
            {
                roadmap ?
                    <Box
                        id="roadmap-detail"
                        sx={{
                            maxWidth: 992,
                            margin: '0 auto',
                        }}
                    >
                        <Box
                            sx={{
                                mb: 3,
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button startIcon={<Icon icon="ArrowBackRounded" />} component={Link} to={'/user/' + user.slug + '/roadmap'} color='inherit' variant='outlined'>{__('Quay lại')}</Button>
                        </Box>
                        {
                            roadmap.image_code ?
                                <>
                                    <Alert severity='info' sx={{ mb: 3, }} icon={false}>
                                        <Typography variant='h4' sx={{ mb: 1, }}>{__('Gợi ý')}</Typography>
                                        <Typography>Lưu roadmap sẽ giúp các nội dung tự động gởi ý sẽ chính xác hơn.</Typography>
                                        <Typography>{__('Lọc nội dung theo khóa học liên quan để dễ dàng biết chi tiết nội dung của khóa học')}</Typography>
                                        <Typography>{__('Nhấp vào từng phần kiến thức để xem nội dung chi tiết và đánh dấu khi bạn đã hoàn thành nội dung đó.')}</Typography>
                                        <Typography>{__('Kiểm tra kiến thức bằng các bài kiểm tra từ ngân hàng câu hỏi của chúng tôi sẽ giúp bạn nhớ kiến thức lâu hơn.')}</Typography>
                                        <Typography>{__('Khi đăng nhập hệ thống, roadmap sẽ được cá nhân hóa theo từng user và bạn có thể chia sẽ nó cho mọi người mà bạn muốn.')}</Typography>
                                    </Alert>

                                    <Box
                                        sx={{
                                            mb: 3,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                mb: 1,
                                            }}>
                                            {__('Các khóa học liên quan')}
                                        </Typography>
                                        <Grid
                                            container
                                            spacing={3}

                                        >
                                            {
                                                courses ?
                                                    courses.map(item => (
                                                        <Grid
                                                            key={item.id}
                                                            item
                                                            md={4}
                                                            sm={6}
                                                            xs={12}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    cursor: 'pointer',
                                                                    position: 'relative',
                                                                    gap: 1.5,
                                                                    p: 1,
                                                                    border: '2px solid',
                                                                    borderColor: activeRoadmapItem?.id === item.id ? 'primary.main' : 'dividerDark',
                                                                    borderRadius: 2,
                                                                }}
                                                                onClick={() => {
                                                                    if (!activeRoadmapItem || activeRoadmapItem.id !== item.id) {
                                                                        useParamUrl.changeQuery({
                                                                            course: item.slug
                                                                        });
                                                                    } else {
                                                                        useParamUrl.changeQuery({
                                                                            course: '0'
                                                                        });
                                                                    }
                                                                }}
                                                            >
                                                                <ImageLazyLoading
                                                                    src={getImageUrl(item.featured_image)}
                                                                    sx={{
                                                                        width: 50,
                                                                        height: 50,
                                                                        borderRadius: 2,
                                                                        flexShrink: 0,
                                                                    }}
                                                                />
                                                                <Box
                                                                    sx={{
                                                                        width: '100%',
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        sx={{
                                                                            ...cssMaxLine(1),
                                                                        }}
                                                                    >
                                                                        {item.title}
                                                                    </Typography>
                                                                    <Button
                                                                        variant='text'
                                                                        sx={{
                                                                            mr: 1,
                                                                            textTransform: 'unset',
                                                                            padding: 0,
                                                                        }}
                                                                    >{__('Nội dung khóa học')}</Button>

                                                                </Box>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                    }}
                                                                >
                                                                    <IconButton
                                                                        target='_blank'
                                                                        component={Link}
                                                                        color='primary'
                                                                        to={'/course/' + item.slug}
                                                                        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                                                            event.stopPropagation();
                                                                        }}
                                                                    >
                                                                        <Icon icon="ArrowForwardRounded" />
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    ))
                                                    :
                                                    <></>
                                            }
                                        </Grid>
                                    </Box>
                                    <Box
                                        sx={{
                                            '& *': {
                                                fontFamily: 'balsamiq',
                                            },
                                            '& svg .clickable-group': {
                                                cursor: activeRoadmapItem?.id ? 'not-allowed' : 'pointer',
                                                // opacity: activeRoadmapItem?.id ? 0.2 : 1,
                                                pointerEvents: activeRoadmapItem?.id ? 'none' : 'all',
                                            },
                                            '& svg .clickable-group.active-by-course': {
                                                cursor: 'pointer',
                                                opacity: 1,
                                                pointerEvents: 'all',
                                            },
                                            // '& svg path':{
                                            //     opacity: activeRoadmapItem?.id ? 0.2 : 1,
                                            // },
                                            // '& svg .clickable-group:not([data-id])': {
                                            //     pointerEvents: 'none',
                                            // },
                                            // '& svg .clickable-group>rect': {
                                            //     fill: '#fca5a5',
                                            // },
                                            '& svg .clickable-group:not(.active-by-course)>rect': {
                                                ...(activeRoadmapItem?.id ? { fill: '#bcbcbc !important' } : {})
                                            },
                                            '& svg .clickable-group:hover>[fill="rgb(255,229,153)"]': {
                                                fill: '#f3c950',
                                            },
                                            '& svg .clickable-group:hover>[fill="rgb(255,255,0)"]': {
                                                fill: '#d6d700',
                                            },
                                            '& svg .clickable-group:hover>[fill="rgb(255,255,255)"]': {
                                                fill: '#d7d7d7',
                                            },
                                            '& svg .clickable-group:hover>[fill="rgb(153,153,153)"]': {
                                                fill: '#646464',
                                            },
                                            '& svg .done rect': {
                                                // fill: '#cbcbcb!important',
                                                fill: '#43a047 !important',
                                            },
                                            '& svg .done text': {
                                                textDecoration: 'line-through',
                                            }
                                        }}
                                        dangerouslySetInnerHTML={{ __html: roadmap.image_code ?? '' }}
                                    />
                                </>
                                :
                                <NoticeContent
                                    title={__('Nội dung đang cập nhật')}
                                    description=''
                                    image='/images/undraw_no_data_qbuo.svg'
                                    disableButtonHome
                                />
                        }

                    </Box>
                    :
                    <Box
                        id="roadmap-detail"
                        sx={{
                            maxWidth: 992,
                            margin: '0 auto',
                        }}
                    >
                        <Box
                            sx={{
                                mb: 3,
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Skeleton>
                                <Button startIcon={<Icon icon="ArrowBackRounded" />}>{__('Quay lại')}</Button>
                            </Skeleton>
                        </Box>
                        {
                            [...Array(20)].map((i, index) => (
                                <Skeleton sx={{ mt: 1, height: 32 }} key={index} />
                            ))
                        }
                    </Box>
            }

            <DrawerCustom
                title={<></>}
                open={Boolean(roadmapItemSlug)}
                width={992}
                activeOnClose
                onClose={() => {
                    // setRoadmapDetailSlug(null);
                    useParamUrl.changeQuery({
                        active: 0,
                    })
                    setRoadmapDetailItem(null);
                }}
                headerAction={myAccount.id === user.id && myAccount._state === UserState.identify && roadmapDetailItem && !roadmapDetailItem.is_updating ? <>
                    {
                        process[roadmapDetailItem.id] === 'done' ?
                            <LoadingButton
                                loading={loadingInputDone}
                                loadingPosition="start"
                                onClick={handleDoneRoadmapItem}
                                startIcon={<Icon icon="Cached" />} sx={{ textTransform: 'unset', }}
                                variant='contained'
                                color='error'
                            >
                                {__('Đánh dấu chưa hoàn thành')}
                            </LoadingButton>
                            :
                            <LoadingButton
                                loading={loadingInputDone}
                                loadingPosition="start"
                                onClick={handleDoneRoadmapItem}
                                startIcon={<Icon icon="CheckRounded" />} sx={{ textTransform: 'unset', }}
                                variant='contained'
                                color='success'
                            >
                                {__('Đánh dấu đã hoàn thành')}
                            </LoadingButton>
                    }

                </> : <></>
                }
            >
                {
                    roadmapDetailItem ?
                        <>
                            {
                                roadmapDetailItem.roadmap_related ?
                                    <Box
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            gap: 2,
                                            mt: 3,
                                            backgroundColor: 'primary.main',
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'primary.dark',
                                            }
                                        }}
                                        component={LinkMui}
                                        href={'/roadmap/' + roadmapDetailItem.roadmap_related.slug}
                                        target='_blank'
                                    >
                                        <Icon icon="AccountTreeOutlined" sx={{ color: 'primary.contrastText', width: 50, height: 55 }} />
                                        <Box>
                                            <Typography variant='h4' sx={{ mb: 0.5, color: 'primary.contrastText', }}>{roadmapDetailItem.roadmap_related.title}</Typography>
                                            <Typography sx={{ opacity: 0.7, color: 'primary.contrastText', }}>{__('Nhấp để kiểm tra Lộ trình {{title}} chi tiết.', {
                                                title: roadmapDetailItem.roadmap_related.title
                                            })}</Typography>
                                        </Box>
                                    </Box>
                                    :
                                    <></>
                            }
                            < Typography sx={{ mt: 3, }} variant='h2' > {roadmapDetailItem.title}</Typography >
                            <div dangerouslySetInnerHTML={{ __html: roadmapDetailItem.content ?? '' }} />

                            {
                                roadmapDetailItem.free_content.length ?
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1,
                                            mt: 6
                                        }}
                                    >
                                        <Typography variant='h4'>{__('Nội dung')}</Typography>
                                        <Divider color="dark" />
                                        {
                                            roadmapDetailItem.free_content.map((item, index) => (
                                                <Box
                                                    key={index + '_' + roadmapDetailItem.id}
                                                >
                                                    <LinkMui
                                                        target='_blank'
                                                        rel={item.is_link_internal ? 'follow' : "nofollow"}
                                                        href={item.link}
                                                        sx={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        <Typography sx={{ textTransform: 'uppercase', p: '0px 4px', fontSize: 12, fontWeight: 500, backgroundColor: colorContentType[item.content_type] }}>{item.custom_label ?? item.content_type}</Typography>
                                                        <Typography>{item.title}</Typography>
                                                    </LinkMui>
                                                </Box>
                                            ))
                                        }
                                        {
                                            roadmapDetailItem?.video_lesson !== null &&
                                            <>
                                                {
                                                    roadmapDetailItem.process ?
                                                        <Video
                                                            lesson={roadmapDetailItem.video_lesson}
                                                            process={roadmapDetailItem.process}
                                                        />
                                                        :
                                                        <Box
                                                            component={Link}
                                                            to={'/course/' + roadmapDetailItem.course?.slug}
                                                            target='_blank'
                                                        >
                                                            <Video
                                                                lesson={roadmapDetailItem.video_lesson}
                                                                process={roadmapDetailItem.process}
                                                            />
                                                        </Box>
                                                }
                                            </>
                                        }
                                    </Box>
                                    :
                                    <NoticeContent
                                        title={__('Nội dung đang cập nhật')}
                                        description=''
                                        image='/images/undraw_no_data_qbuo.svg'
                                        disableButtonHome
                                    />
                            }
                        </>
                        :
                        [...Array(20)].map((_item, index) => (
                            <Skeleton sx={{ mt: 1, height: 32 }} key={index} />
                        ))

                }

            </DrawerCustom >

        </Box>
    )
}

export default Detail


const colorContentType: {
    [key in RoadmapItemContentType]: string
} = {
    'official-website': '#bee3f8',
    'official-documentation': '#bee3f8',
    'library': '#bee3f8',
    'read': '#fefcbf',
    'sanbox': '#fefcbf',
    'watch': '#e9d8fd',
    'course': '#c6f6d5',
    'challenge': '#c6f6d5',
};

function atobCustom(str: string) {
    try {
        return window.atob(str);
    } catch (error) {
        return '';
    }
}