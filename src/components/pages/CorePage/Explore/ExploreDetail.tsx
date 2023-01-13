import { Box, Breadcrumbs, Skeleton, Theme, Tooltip } from '@mui/material';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import MoreButton from 'components/atoms/MoreButton';
import Typography from 'components/atoms/Typography';
import makeCSS from 'components/atoms/makeCSS';
import NoticeContent from 'components/molecules/NoticeContent';
import Page from 'components/templates/Page';
import { dateTimeFormat } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import useReportPostType from 'hook/useReportPostType';
import Comments from 'plugins/Vn4Comment/Comments';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import exploreService, { ExploreProps, REPORT_TYPE } from 'services/exploreService';
import reactionService from 'services/reactionService';
import { useUser } from 'store/user/user.reducers';
import Blogs from '../HomePage/Blogs';
import AddinData from 'components/molecules/AddinData';

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

    const [loveState, setLoveState] = React.useState(false);

    const user = useUser();

    const { tab } = useParams();

    const navigate = useNavigate();

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
    })

    React.useEffect(() => {

        setExplore(null);

        (async () => {
            if (tab) {
                let exploreFormDB = await exploreService.find(tab);

                if (exploreFormDB) {
                    setExplore(exploreFormDB);
                    setLoveState(exploreFormDB.my_reaction_type === 'love' ? true : false);
                } else {
                    navigate('/explore');
                }
            }
        })()

    }, [tab]);

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

                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        mt: 1,
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant='h1'>{explore.title}</Typography>
                                    <Box>
                                        <Tooltip
                                            title={__('Yêu thích')}
                                        >
                                            <IconButton
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    reactionService.post({
                                                        post: explore.id,
                                                        reaction: loveState ? '' : 'love',
                                                        type: 'blog_post_reaction',
                                                        user_id: user.id,
                                                    });
                                                    setLoveState((prev) => !prev);
                                                }}
                                            >
                                                {
                                                    loveState ?
                                                        <Icon sx={{ color: '#ff2f26' }} icon="FavoriteRounded" />
                                                        :
                                                        <Icon icon="FavoriteBorderRounded" />
                                                }
                                            </IconButton>
                                        </Tooltip>
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
                                        <Typography variant='h5' component={Link} to={'/user/' + explore.account_author_detail?.slug}>{explore.account_author_detail?.title}</Typography>
                                        <Typography variant='body2'>{dateTimeFormat(explore.updated_at)}</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider />

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

                                                            <Box
                                                                dangerouslySetInnerHTML={{ __html: item }}
                                                            />
                                                            {
                                                                Boolean(index !== (arrContent.length - 1) && explore.addin_data?.[index]) &&
                                                                <Box sx={{ mt: 3, mb: 3, }}><AddinData {...explore.addin_data?.[index]} /></Box>
                                                            }
                                                        </React.Fragment>
                                                    ));
                                                })()
                                            }
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
                                        <Typography align='right' sx={{ fontStyle: 'italic' }}>
                                            {__('Cập nhật lần cuối: {{dataTime}}', {
                                                dataTime: dateTimeFormat(explore.updated_at)
                                            })}
                                        </Typography>
                                    </>
                                    :
                                    <NoticeContent
                                        title={__('Nội dung đang cập nhật')}
                                        description=''
                                        image='/images/undraw_no_data_qbuo.svg'
                                        disableButtonHome
                                    />
                            }



                            <Comments
                                // followType='vn4_comment_object_follow'
                                keyComment={"explore/" + explore.id}
                            />

                        </>
                        :
                        <>
                            <Box>
                                <Skeleton sx={{ width: 150 }} />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        mt: 1,
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Skeleton>
                                        <Typography variant='h1'>Lorem ipsum dolor sit amet consectetur</Typography>
                                    </Skeleton>
                                    <Box>
                                        <Skeleton>
                                            <IconButton>
                                                <Icon icon="FavoriteBorderRounded" />
                                            </IconButton>
                                        </Skeleton>
                                    </Box>

                                </Box>
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

            <Blogs />
        </Page >
    );
};

export default ExploreDetail;
