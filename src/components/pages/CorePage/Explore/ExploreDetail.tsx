import { LoadingButton } from '@mui/lab';
import { Box, Breadcrumbs, Button, Skeleton, Theme } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import MoreButton from 'components/atoms/MoreButton';
import Tooltip from 'components/atoms/Tooltip';
import Typography from 'components/atoms/Typography';
import makeCSS from 'components/atoms/makeCSS';
import AddinData from 'components/molecules/AddinData';
import NoticeContent from 'components/molecules/NoticeContent';
import TooltipVerifiedAccount from 'components/molecules/TooltipVerifiedAccount';
import Page from 'components/templates/Page';
import { convertHMS, dateFormat, dateTimefromNow } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import useReaction from 'hook/useReaction';
import useReportPostType from 'hook/useReportPostType';
import Comments from 'plugins/Vn4Comment/Comments';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import exploreService, { ExploreProps, REPORT_TYPE } from 'services/exploreService';
import { UserState, useUser } from 'store/user/user.reducers';
import ReferencePost from './ReferencePost';

const useStyles = makeCSS((theme: Theme) => ({
    content: {
        marginTop: theme.spacing(3),
        '& p': {
            margin: theme.spacing(1, 0)
        },
        '&>p>img': {
            display: 'block',
            margin: '24px auto',
        }
    }
}));

const ExploreDetail = () => {

    const classes = useStyles();

    const [explore, setExplore] = React.useState<ExploreProps | null>(null);

    const [referencePost, setReferencePost] = React.useState<Array<ExploreProps>>([]);

    const { tab } = useParams();

    const user = useUser();

    const navigate = useNavigate();

    const flatGetApi = React.useRef(false);

    const dialogReport = useReportPostType({
        dataProps: {
            post: explore?.id ?? 0,
            type: REPORT_TYPE,
        },
        reasonList: {
            'Inappropriate Course Content': {
                title: __('Nội dung khóa học không phù hợp')
            },
            'Inappropriate Behavior': {
                title: __('Hành vi không phù hợp')
            },
            'Policy Violation': {
                title: __('Vi phạm Chính sách')
            },
            'Spammy Content': {
                title: __('Nội dung spam')
            },
        },
    });

    const reactionHook = useReaction({
        post: {
            ...(explore ? explore : { id: 0 }),
            type: 'blog_post'
        },
        reactionPostType: 'blog_post_reaction',
        keyReactionCurrent: 'my_reaction_type',
        reactionTypes: ['like', 'love', 'care', 'haha', 'wow', 'sad', 'angry'],
        afterReaction: (result) => {
            setExplore(prev => (prev ? {
                ...prev,
                count_like: result.summary?.like?.count ?? 0,
                count_love: result.summary?.love?.count ?? 0,
                count_care: result.summary?.care?.count ?? 0,
                count_haha: result.summary?.haha?.count ?? 0,
                count_wow: result.summary?.wow?.count ?? 0,
                count_sad: result.summary?.sad?.count ?? 0,
                count_angry: result.summary?.angry?.count ?? 0,
                my_reaction_type: result.my_reaction,
            } : prev));
        },
        propsTootipButton: {
            variant: 'outlined',
            size: 'small',
        }
    });


    const reactionSave = useReaction({
        post: {
            ...(explore ? explore : { id: 0 }),
            type: 'blog_post'
        },
        reactionPostType: 'blog_post_save',
        keyReactionCurrent: 'my_save',
        reactionTypes: ['save'],
        afterReaction: (result) => {
            setExplore(prev => (prev ? {
                ...prev,
                count_save: result.summary?.save?.count ?? 0,
                my_save: result.my_reaction,
            } : prev));
        },
    });

    React.useEffect(() => {
        if (tab && !flatGetApi.current) {
            setExplore(null);
            flatGetApi.current = true;
            (async () => {
                if (tab) {
                    let exploreFormDB = await exploreService.find(tab);
                    if (exploreFormDB) {
                        setExplore(exploreFormDB.blog);
                        setReferencePost(exploreFormDB.reference_post);
                    } else {
                        navigate('/explore');
                    }
                    flatGetApi.current = false;
                }
            })()
        }
    }, [tab]);

    React.useEffect(() => {
        if (user._state !== UserState.unknown && !flatGetApi.current) {
            flatGetApi.current = true;
            (async () => {
                if (tab) {
                    let exploreFormDB = await exploreService.find(tab);
                    if (exploreFormDB) {
                        setExplore(exploreFormDB.blog);
                        setReferencePost(exploreFormDB.reference_post);
                    } else {
                        navigate('/explore');
                    }
                    flatGetApi.current = false;
                }
            })()
        }
    }, [user._state]);

    return (
        <Page
            title={explore ? explore.title : __("...")}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    maxWidth: '100%',
                    width: 960,
                    margin: '0 auto',
                    mt: 8
                }}
            >

                {
                    explore ?
                        <>
                            <Box>
                                <Breadcrumbs maxItems={3} aria-label="breadcrumb">
                                    <Link color="inherit" to="/">
                                        Trang chủ
                                    </Link>
                                    <Link color="inherit" to="/explore">
                                        Khám phá
                                    </Link>
                                </Breadcrumbs>
                                <Typography sx={{
                                    mt: 1,
                                    lineHeight: 1.2,
                                }} variant='h1'>{explore.title}</Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            mt: 2,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Link to={'/user/' + explore.account_author_detail?.slug}>
                                            <ImageLazyLoading
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: '50%',
                                                }}
                                                src={getImageUrl(explore.account_author_detail?.avatar, '/images/user-default.svg')}
                                                name={explore.account_author_detail?.title}
                                            />
                                        </Link>
                                        <Box>
                                            <Box
                                                sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}
                                            >
                                                <Typography variant='h5' component={Link} to={'/user/' + explore.account_author_detail?.slug}>{explore.account_author_detail?.title}</Typography>
                                                {
                                                    explore.account_author_detail?.is_verified ?
                                                        <TooltipVerifiedAccount iconSize={20} />
                                                        : null
                                                }
                                            </Box>
                                            <Typography sx={{ display: 'flex', gap: 1, alignItems: 'center', }} variant='body2'>
                                                <Typography sx={{ fontSize: 14 }} variant='body2' component='span'>{dateTimefromNow(explore.updated_at)}</Typography>
                                                {
                                                    explore.read_time ?
                                                        <>
                                                            ·  <Typography sx={{ fontSize: 14 }} variant='body2' component='span' >{convertHMS(explore.read_time * 60, true)} đọc</Typography>
                                                        </>
                                                        :
                                                        ''
                                                }
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            mt: 2,
                                        }}
                                    >

                                        {
                                            reactionHook.componentSummary
                                        }
                                        {
                                            reactionHook.toolTip
                                        }
                                        <MoreButton
                                            actions={[
                                                {
                                                    report: {
                                                        title: 'Báo cáo bài viết',
                                                        action: () => {
                                                            dialogReport.open();
                                                        },
                                                        icon: 'OutlinedFlagRounded'
                                                    },
                                                }
                                            ]}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            <Divider />
                            <ImageLazyLoading ratio="16/9" alt="gallery image" src={getImageUrl(explore.featured_image)} />
                            {
                                explore.content ?
                                    <>
                                        < Box
                                            className={classes.content}
                                            sx={{
                                                lineHeight: '32px',
                                                fontSize: 18,
                                                textAlign: 'justify',
                                            }}>
                                            {
                                                (() => {
                                                    let arrContent = explore.content.split('[option]');
                                                    return arrContent.map((item, index) => (
                                                        <React.Fragment
                                                            key={index}
                                                        >
                                                            <CodeBlock
                                                                html={item}
                                                            />
                                                            {
                                                                Boolean(index !== (arrContent.length - 1) && explore.addin_data?.[index]) &&
                                                                <Box sx={{ mt: 3, mb: 3, }}><AddinData {...explore.addin_data?.[index]} /></Box>
                                                            }
                                                        </React.Fragment>
                                                    ));
                                                })()
                                            }
                                            <Typography align='right' sx={{ ml: 'auto', fontStyle: 'italic' }}>
                                                {__('Cập nhật lần cuối: {{dataTime}}', {
                                                    dataTime: dateFormat(explore.updated_at)
                                                })}
                                            </Typography>
                                        </Box>
                                        {/* <Box
                                            className={classes.content}
                                            sx={{
                                                lineHeight: '32px',
                                                fontSize: 18,
                                                textAlign: 'justify',
                                            }}
                                            dangerouslySetInnerHTML={{ __html: explore.content }}
                                        /> */}

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Button
                                                color="inherit"
                                                variant='outlined'
                                                component={Link}
                                                to="/explore"
                                                startIcon={<Icon icon="ArrowBackRounded" />}
                                            >
                                                Quay lại
                                            </Button>
                                            <Tooltip
                                                title="Lưu bài viết để tìm kiếm dễ dàng hơn ở trang cá nhân"
                                            >
                                                <LoadingButton
                                                    variant='outlined'
                                                    loading={reactionSave.isLoading}
                                                    startIcon={explore.my_save === 'save' ? <Icon sx={{ color: 'warning.main' }} icon="Bookmark" /> : <Icon va icon="BookmarkBorder" />}
                                                    onClick={() => {
                                                        if (explore.my_save === 'save') {
                                                            reactionSave.handleReactionClick(explore.id, '');
                                                        } else {
                                                            reactionSave.handleReactionClick(explore.id, 'save');
                                                        }
                                                    }}
                                                >
                                                    Lưu
                                                </LoadingButton>
                                            </Tooltip>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 1,
                                                    alignItems: 'center',
                                                    ml: 'auto'
                                                }}
                                            >
                                                {
                                                    reactionHook.componentSummary
                                                }
                                                {
                                                    reactionHook.toolTip
                                                }
                                            </Box>
                                        </Box>

                                    </>
                                    :
                                    <NoticeContent
                                        title={__('Nội dung đang cập nhật')}
                                        description=''
                                        image='/images/undraw_no_data_qbuo.svg'
                                        disableButtonHome
                                    />
                            }


                            <Box sx={{ mt: 5 }}>
                                <Comments
                                    // followType='vn4_comment_object_follow'
                                    keyComment={"explore/" + explore.id}
                                />
                            </Box>
                        </>
                        :
                        <>
                            <Box>
                                <Skeleton sx={{ width: 150 }} />
                                <Skeleton>
                                    <Typography variant='h1'>Lorem ipsum dolor sit amet consectetur</Typography>
                                </Skeleton>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            alignItems: 'center',
                                            mt: 2,
                                        }}
                                    >
                                        <Skeleton variant='circular' height={48} width={48} />
                                        <Box>
                                            <Skeleton>
                                                <Typography variant='h5'>Đặng Thuyền Quân</Typography>
                                            </Skeleton>
                                            <Skeleton>
                                                <Typography variant='body2'>thứ hai, 9 tháng 1 năm 2023 21:40</Typography>
                                            </Skeleton>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Skeleton>
                                            <IconButton>
                                                <Icon icon="FavoriteBorderRounded" />
                                            </IconButton>
                                        </Skeleton>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider />
                            {
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
                                    <Skeleton key={item} variant="rectangular" sx={{ mt: 2 }}>
                                        <Typography variant="subtitle1">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea labore veritatis eum eius, dignissimos deleniti id! Natus officia sapiente quisquam maiores labore temporibus perspiciatis, aspernatur commodi beatae. Aliquid, consequatur consequuntur!
                                        </Typography>
                                    </Skeleton>
                                ))
                            }
                        </>
                }
            </Box>

            <ReferencePost posts={referencePost} />
        </Page >
    );
};

export default ExploreDetail;
