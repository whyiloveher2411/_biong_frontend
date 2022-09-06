import { Button, Chip, IconButton, LinearProgress, LinearProgressProps, Rating, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/system';
import Icon, { IconFormat } from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Typography from 'components/atoms/Typography';
import { convertHMS } from 'helpers/date';
import { cssMaxLine } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import { nFormatter } from 'helpers/number';
import useReportPostType from 'hook/useReportPostType';
import React from 'react';
import { Link } from 'react-router-dom';
import { CourseProps } from 'services/courseService';
import { REPORT_TYPE } from 'services/elearningService';
import Price from './Ecommerce/Price';


function CourseSingle({
    course, isPurchased = false, completed = undefined, height = '100%', actionChild, disableRating
}: {
    course?: CourseProps,
    completed?: number,
    isPurchased?: boolean,
    height?: string,
    actionChild?: React.ReactNode,
    disableRating?: boolean,
}) {

    const dialogReport = useReportPostType({
        dataProps: {
            post: course?.id,
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

    if (!course) {
        return (
            <Card
                sx={{
                    height: height,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Box>
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
                        <Skeleton variant='text' />
                        <Skeleton variant='text' />

                        <Skeleton variant='text' />
                        <Skeleton variant='text' />
                        <Skeleton variant='text' />

                        {completed !== undefined &&
                            <Skeleton variant='text' />
                        }

                    </CardContent>
                </Box>
                <CardActions disableSpacing>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <Rating name="read-only" emptyIcon={<Icon icon="Star" style={{ opacity: 0.3 }} fontSize="inherit" />} value={0} readOnly />
                    </Box>
                    <Skeleton sx={{ marginLeft: 'auto' }} variant='rectangular'>
                        <Button color="inherit" variant="text" startIcon={<Icon icon="ThumbUpOutlined" />}>
                            12,34
                        </Button>
                    </Skeleton>
                </CardActions>
            </Card>
        )
    }

    const actions: Array<{
        [key: string]: {
            title: string,
            action: () => void,
            icon: IconFormat,
        }
    }> = [
            {
                save_to_favorites: {
                    title: 'Save To Favorites',
                    action: () => {
                        //
                    },
                    icon: 'FavoriteBorderOutlined'
                },
                share: {
                    title: 'Share',
                    action: () => {
                        //
                    },
                    icon: 'Share'
                }
            },
            {
                report: {
                    title: 'Report',
                    action: () => {
                        dialogReport.open();
                    },
                    icon: 'OutlinedFlagRounded'
                },
            }
        ];

    if (completed && completed >= 100) {
        actions[0].review = {
            title: 'Review',
            action: () => {
                //
            },
            icon: 'StarOutlineRounded'
        };
    }


    return (
        <>
            <Card
                sx={{
                    height: height,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    // boxShadow: 'none',
                    '&:hover, &:focus, &:active, &:visited': {
                        // borderColor: 'primary.main',
                        boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                    },
                    '&:focus, &:active, &:visited': {
                        borderColor: 'primary.main',
                    }
                }}
            >
                <Box>
                    {/* <CardHeader
                        titleTypographyProps={{
                            variant: 'h5',
                        }}
                        avatar={
                            <Link to={course.course_detail?.owner_detail?.slug ? '/user/' + course.course_detail.owner_detail.slug : ''}>
                                <ImageLazyLoading
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                    }}
                                    src={getImageUrl(course.course_detail?.owner_detail?.avatar, '/images/user-default.svg')}
                                    name={course.course_detail?.owner_detail?.title}
                                />
                            </Link>
                        }
                        action={
                            <MoreButton
                                actions={actions}
                            />
                        }
                        title={<Link to={'/user/' + course.course_detail?.owner_detail?.slug} >
                            {course.course_detail?.owner_detail?.title}
                        </Link>}
                        subheader={dateFormat(course.updated_at)}
                    /> */}
                    <Link to={'/course/' + course.slug}  >
                        <Box
                            sx={{
                                position: 'relative'
                            }}
                        >
                            {
                                course.course_detail?.is_comming_soon ?
                                    <Chip sx={{
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        position: 'absolute',
                                        right: 10,
                                        bottom: 10,
                                        zIndex: 1,
                                    }} label={__('Sắp ra mắt')} />
                                    :
                                    <>
                                        {
                                            Boolean(course.course_detail?.total_time) &&
                                            <Chip sx={{
                                                background: 'rgba(51,51,51,0.8)',
                                                color: 'white',
                                                position: 'absolute',
                                                right: 10,
                                                bottom: 10,
                                                zIndex: 1,
                                            }} label={convertHMS(course.course_detail?.total_time ?? 0, true)} />
                                        }
                                    </>
                            }
                            <ImageLazyLoading ratio="16/9" alt="gallery image" src={getImageUrl(course.featured_image)} />
                        </Box>
                    </Link>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            pb: '8px !important',
                        }}
                    >
                        <Typography variant='overline'>
                            {__('{{chapterCount}} chương, {{lessonCount}} bài học', {
                                chapterCount: course.course_detail?.total_chapter ?? 0,
                                lessonCount: course.course_detail?.total_lesson ?? 0,
                            })}
                        </Typography>
                        <Typography
                            variant='h2'
                            component='h2'
                            sx={{
                                ...cssMaxLine(2),
                                fontSize: 20,
                                lineHeight: '28px',
                                fontWeight: 400,
                                maxHeight: 56,
                            }}
                        >
                            <Link to={'/course/' + course.slug} >
                                {course.title}
                            </Link>
                        </Typography>
                        <Typography
                            color="text.secondary"
                            sx={{
                                ...cssMaxLine(3),
                                maxHeight: 72,
                                lineHeight: '24px',
                                fontSize: 16,
                            }}
                        >
                            <Link to={'/course/' + course.slug} >
                                {course.description}
                            </Link>
                        </Typography>
                        {/* <Breadcrumbs separator="-" aria-label="breadcrumb">
                            {
                                course.tags?.map((item, index) => (
                                    <Typography key={index} sx={{ textTransform: 'capitalize' }}>
                                        <Link to={"/tag/" + item.slug}>
                                            {item.title}
                                        </Link>
                                    </Typography>
                                ))
                            }
                        </Breadcrumbs> */}

                        {completed !== undefined &&
                            <LinearProgressWithLabel value={completed} />
                        }

                    </CardContent>
                </Box>
                {
                    Boolean(
                        !disableRating
                        && course.course_detail?.sumary?.rating
                        && course.course_detail?.sumary?.reviewNumber
                    ) &&
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'flex-end',
                            pl: '18px',
                            pr: '18px',
                            pb: 3,
                        }}
                    >

                        <Rating name="read-only" size='small' precision={0.1} value={parseFloat(course.course_detail?.sumary?.rating + '')} readOnly />
                        <Typography variant='h5' sx={{ color: '#faaf00', lineHeight: '16px', fontSize: 12 }}>
                            {parseFloat(course?.course_detail?.sumary?.rating + '').toFixed(1)}
                        </Typography>
                        <Typography sx={{ lineHeight: '16px', fontSize: 12 }}>
                            {
                                __('({{reviewNumber}} đánh giá)', {
                                    reviewNumber: nFormatter(course.course_detail?.sumary?.reviewNumber ?? 0)
                                })
                            }
                        </Typography>
                    </Box>
                }
                <CardActions disableSpacing sx={{ pt: 0, justifyContent: 'space-between' }}>
                    {
                        isPurchased ?

                            <Button
                                disabled={course.course_detail?.is_comming_soon}
                                component={Link}
                                to={'/course/' + course.slug + '/learning'}
                                onClick={() => {
                                    window.__linkBackCourseLearning = window.location.pathname + window.location.search
                                }}
                                variant='contained'>
                                {completed && completed > 0 ?
                                    (
                                        completed >= 100 ?
                                            __('Ôn lại kiến thức')
                                            : __('Tiếp tục học')

                                    ) : __('Bắt đầu học')}
                            </Button>
                            :
                            <>
                                <Price
                                    compare_price={course.compare_price}
                                    percent_discount={course.percent_discount}
                                    price={course.price}
                                />
                                <IconButton
                                    component={Link}
                                    to={'/course/' + course.slug}
                                    color='primary'
                                >
                                    <Icon icon="ArrowForwardRounded" />
                                </IconButton>
                            </>
                    }
                    {actionChild}
                </CardActions>
                {/* <Box>
                    {
                        Boolean(course.user_role) &&
                        (() => {

                            const label = getLabelProp(course.user_role?.role ?? '');

                            return <Chip size="small" avatar={<Icon icon={label.icon} sx={{ color: 'white !important' }} />} sx={{ background: label.color, color: 'white' }} label={label.title} />


                        })()
                    }
                </Box> */}
            </Card>
            {dialogReport.component}
        </>
    )
}

export default CourseSingle

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}


// const getLabelProp = (type: string): {
//     title?: string,
//     icon?: IconFormat,
//     color: string,
// } => {
//     switch (type) {
//         case 'teacher':
//             return {
//                 title: __('Teacher'),
//                 icon: 'BookmarksOutlined',
//                 color: '#ed6c02',
//             };
//         case 'mentor':
//             return {
//                 title: __('Mentor'),
//                 icon: 'PriorityHighRounded',
//                 color: '#3f51b5',
//             };
//         case 'product_owner':
//             return {
//                 title: __('Product Owner'),
//                 icon: 'Star',
//                 color: '#8204d9',
//             };
//         default:
//             return {
//                 color: 'transparent',
//             };
//     }
// }