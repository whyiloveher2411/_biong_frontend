import { Box, Button, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import MoreButton from 'components/atoms/MoreButton';
import { dateFormat } from 'helpers/date';
import { cssMaxLine } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import { nFormatter } from 'helpers/number';
import useReportPostType from 'hook/useReportPostType';
import { Link } from 'react-router-dom';
import { ExploreProps, REPORT_TYPE } from 'services/exploreService';

export default function ExploreSingle({
    explore
}: {
    explore?: ExploreProps
}) {

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

    if (!explore) {
        return (
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Box>
                    <CardHeader
                        titleTypographyProps={{
                            variant: 'h5',
                        }}
                        avatar={
                            <Skeleton variant='circular' sx={{ width: 48, height: 48 }} />
                        }
                        title={<Skeleton />}
                        subheader={<Skeleton />}
                    />
                    <Skeleton
                        sx={{
                            height: 194,
                            width: 1
                        }}
                        variant="rectangular"
                    />
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <Skeleton variant='rectangular'>
                            <Typography
                                variant='h4'
                                component='h2'
                                sx={{
                                    ...cssMaxLine(2)
                                }}
                            >
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                            </Typography>
                        </Skeleton>
                        <Skeleton variant='rectangular' >
                            <Typography
                                color="text.secondary"
                                sx={{
                                    ...cssMaxLine(3),
                                    maxHeight: 64,
                                    lineHeight: '24px',
                                }}
                            >
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores, corrupti voluptates? Incidunt similique dignissimos sapiente ipsum praesentium, omnis libero harum illo ipsa eius voluptatem deserunt, voluptate architecto enim assumenda numquam?
                            </Typography>
                        </Skeleton>
                    </CardContent>
                </Box>
                <CardActions disableSpacing>
                    <Skeleton sx={{ marginLeft: 'auto' }} variant='rectangular'>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                            }}
                        >
                        </Box>
                    </Skeleton>
                    <Skeleton sx={{ marginLeft: 'auto' }} variant='rectangular'>
                        <Button color="inherit" variant="text" startIcon={<Icon icon="ThumbUpOutlined" />}>
                            12,34
                        </Button>
                    </Skeleton>
                </CardActions>
            </Card>
        )
    }

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Box>
                    <CardHeader
                        titleTypographyProps={{
                            variant: 'h5',
                        }}
                        avatar={
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
                        }
                        action={
                            <MoreButton
                                actions={[
                                    {
                                        report: {
                                            title: 'Report',
                                            action: () => {
                                                dialogReport.open();
                                            },
                                            icon: 'OutlinedFlagRounded'
                                        },
                                    }
                                ]}
                            />
                        }
                        title={<Link to={'/user/' + explore.account_author_detail?.slug}>{explore.account_author_detail?.title}</Link>}
                        subheader={dateFormat(explore.updated_at)}
                    />
                    <Link to={'/explore/' + explore.slug} >
                        <ImageLazyLoading ratio="16/9" alt="gallery image" src={getImageUrl(explore.featured_image)} />
                    </Link>
                    <Link to={'/explore/' + explore.slug} >
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                        >
                            <Typography
                                variant='h4'
                                component='h2'
                                sx={{
                                    ...cssMaxLine(2)
                                }}
                            >
                                {explore.title}
                            </Typography>
                            <Typography
                                color="text.secondary"
                                sx={{
                                    ...cssMaxLine(3),
                                    maxHeight: 64,
                                    lineHeight: '24px',
                                }}
                            >
                                {explore.description}
                            </Typography>
                        </CardContent>
                    </Link>
                </Box>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <Icon icon="FavoriteBorderOutlined" />
                    </IconButton>
                    <IconButton aria-label="share">
                        <Icon icon="Share" />
                    </IconButton>
                    <Button sx={{ marginLeft: 'auto' }} color="inherit" variant="text" startIcon={<Icon icon="RemoveRedEyeOutlined" />}>
                        {nFormatter(explore.view_number)}
                    </Button>
                </CardActions>
            </Card >
            {dialogReport.component}
        </>
    );
}