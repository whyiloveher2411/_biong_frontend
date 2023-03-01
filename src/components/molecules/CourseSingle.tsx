import { LoadingButton } from '@mui/lab';
import { Button, Chip, IconButton, Rating, Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/system';
import Icon, { IconFormat } from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Typography from 'components/atoms/Typography';
import DiscountInfo from 'components/organisms/DiscountInfo';
import { convertHMS } from 'helpers/date';
import { cssMaxLine } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import { nFormatter, numberWithSeparator } from 'helpers/number';
import { clearAllCacheWindow } from 'hook/cacheWindow';
import useAjax from 'hook/useApi';
import useReportPostType from 'hook/useReportPostType';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CourseProps } from 'services/courseService';
import { REPORT_TYPE } from 'services/elearningService';
import { UserState, useUser } from 'store/user/user.reducers';
import Price from './Ecommerce/Price';
import LinearProgressWithLabel from './LinearProgressWithLabel';


function CourseSingle({
    course, isPurchased = false, completed = undefined, height = '100%', actionChild, disableRating, is_trial
}: {
    course?: CourseProps,
    completed?: number,
    isPurchased?: boolean,
    height?: string,
    actionChild?: React.ReactNode,
    disableRating?: boolean,
    is_trial?: 0 | 1,
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

    const user = useUser();

    const navigate = useNavigate();

    const ajaxConfirmOrder = useAjax();

    const handleConfirmOrder = () => {
        if (course) {
            if (user._state === UserState.identify) {
                if (Number(course.price) === 0) {
                    ajaxConfirmOrder.ajax({
                        url: '/vn4-ecommerce/shoppingcart/create',
                        data: {
                            products: [{ id: course.id, order_quantity: 1 }],
                            paymentMethod: 'bank_transfer',
                            // promotions: shoppingCart.data.promotions,
                            is_gift: false,
                        },
                        success: (result: { error: number, order_id: ID }) => {
                            if (!result.error) {
                                clearAllCacheWindow();
                                navigate('/course/' + course.slug + '/learning');
                            }
                        }
                    });
                }
            } else {
                window.showMessage('Vui lòng đăng nhập trước khi vào học!');
            }
        }
    }

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
                    // transition: 'all 150ms',
                    // boxShadow: 'none',
                    '&:hover, &:focus, &:active, &:visited': {
                        borderColor: 'primary.main',
                        // transform: 'scale(1.02)',
                        boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                    },
                    '&:focus, &:active, &:visited': {
                        borderColor: 'primary.main',
                        // transform: 'scale(1.02)',
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
                            <DiscountInfo course={course}
                                sx={{
                                    position: 'absolute',
                                    right: 10,
                                    top: 10,
                                    zIndex: 1,
                                }}
                            />
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
                            {/* <ImageLazyLoading ratio="16/9" alt="gallery image" src={getImageUrl(course.featured_image)} /> */}
                            <ImageThumbnail
                                logo={getImageUrl(course.featured_image)}
                                title={course.title}
                                color={course.course_detail?.thumbnail_color ?? '#644c28'}
                            />
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
                            component={Link}
                            to={'/course/' + course.slug}
                            sx={{
                                ...cssMaxLine(2),
                                fontSize: 20,
                                lineHeight: '28px',
                                fontWeight: 400,
                                maxHeight: 56,
                            }}
                        >
                            {course.title}
                        </Typography>
                        <Typography
                            color="text.secondary"
                            component={Link}
                            to={'/course/' + course.slug}
                            sx={{
                                ...cssMaxLine(3),
                                maxHeight: 72,
                                height: 72,
                                lineHeight: '24px',
                                fontSize: 16,
                            }}
                        >
                            {course.description}
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
                    !course.course_detail?.is_comming_soon &&
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            pl: 3,
                            pr: 3,
                            pb: 3,
                            flexWrap: 'wrap',
                        }}
                    >
                        {
                            Boolean(
                                !disableRating
                                && course.course_detail?.sumary?.rating
                                && course.course_detail?.sumary?.reviewNumber
                            ) &&
                            <>
                                <Rating name="read-only" size='small' precision={0.1} value={parseFloat(course.course_detail?.sumary?.rating + '')} readOnly />
                                <Typography variant='h5' sx={{ color: '#faaf00', lineHeight: '16px', fontSize: 16 }}>
                                    {parseFloat(course?.course_detail?.sumary?.rating + '').toFixed(1)}
                                </Typography>
                                <Typography variant='body2' sx={{ lineHeight: '16px', fontSize: 16 }}>
                                    {
                                        __('({{reviewNumber}} đánh giá)', {
                                            reviewNumber: nFormatter(course.course_detail?.sumary?.reviewNumber ?? 0)
                                        })
                                    }
                                </Typography>
                            </>
                        }
                        {
                            Boolean(course.course_detail?.sumary?.studentNumber) &&
                            <Typography variant='body2' sx={{ lineHeight: '16px', fontSize: 16 }}>
                                {
                                    __('{{studentNumber}} học viên', {
                                        studentNumber: numberWithSeparator((Number(course.course_detail?.sumary?.studentNumber) ? Number(course.course_detail?.sumary?.studentNumber) : 0) + (Number(course.course_detail?.count_student_fake) ? Number(course.course_detail?.count_student_fake) : 0))
                                    })
                                }
                            </Typography>
                        }
                    </Box>
                }
                <CardActions disableSpacing sx={{ pt: 0, justifyContent: 'space-between' }}>
                    {
                        isPurchased ?

                            <Button
                                disabled={Boolean(course.course_detail?.is_comming_soon)}
                                component={Link}
                                to={'/course/' + course.slug + '/learning'}
                                onClick={() => {
                                    window.__linkBackCourseLearning = window.location.pathname + window.location.search
                                }}
                                variant='contained'>
                                {
                                    completed && completed > 0 ?
                                        (
                                            completed >= 100 ?
                                                __('Ôn lại kiến thức')
                                                : __('Tiếp tục học')

                                        ) : __('Bắt đầu học')
                                }
                            </Button>
                            :
                            <>
                                {
                                    course.course_detail?.is_comming_soon ?
                                        <Price
                                            course={course}
                                        />
                                        :
                                        course.is_purchased && user._state === UserState.identify ?
                                            <Button
                                                disabled={Boolean(course.course_detail?.is_comming_soon)}
                                                disableRipple sx={{ pl: 3, pr: 3 }}
                                                component={Link}
                                                to={'/course/' + course.slug + '/learning'} variant='contained'
                                            >
                                                {__('Vào học ngay')}
                                            </Button>
                                            :
                                            course.course_detail?.is_allow_trial ?
                                                <Button
                                                    disabled={Boolean(course.course_detail?.is_comming_soon)}
                                                    disableRipple sx={{ pl: 3, pr: 3 }}
                                                    component={Link}
                                                    to={'/course/' + course.slug + '/learning'} variant='contained'
                                                >
                                                    {__('Học thử miễn phí')}
                                                </Button>
                                                :
                                                Number(course.price) ?
                                                    <Price
                                                        course={course}
                                                    />
                                                    :
                                                    <LoadingButton
                                                        loading={ajaxConfirmOrder.open}
                                                        size="large" sx={{ pl: 3, pr: 3 }}
                                                        variant='contained' color="primary"
                                                        onClick={handleConfirmOrder}>
                                                        {__('Vào học ngay')}
                                                    </LoadingButton>

                                }
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

function ImageThumbnail({ logo, title, color }: {
    logo: string,
    title: string,
    color: string,
}) {
    return <Box
        sx={{
            position: 'relative',
            pt: '56.25%',
            width: '100%',
            backgroundColor: color,
            overflow: 'hidden',
        }}
    >
        <img
            style={{
                position: 'absolute',
                top: '-100px',
                right: '-90px',
                opacity: '0.2',
                width: '50.3%',
                transform: 'rotate(' + Math.floor(Math.random() * 360) + 'deg)',
            }}
            src="/images/gif/wave-ball.gif"
        />
        <img
            style={{
                position: 'absolute',
                bottom: '-110px',
                opacity: '0.2',
                width: '51.3%',
                right: '-80px',
                transform: 'rotate(' + Math.floor(Math.random() * 360) + 'deg)',
            }}
            src="/images/gif/wave-ball.gif"
        />
        <img
            style={{
                position: 'absolute',
                width: '6%',
                top: (Math.floor(Math.random() * 7) + 5) + '%',
                right: (Math.floor(Math.random() * 10) + 10) + '%',
            }}
            src="/images/gif/star-1.gif"
        />
        <img
            style={{
                position: 'absolute',
                width: '6%',
                top: (Math.floor(Math.random() * 8) + 25) + '%',
                right: (Math.floor(Math.random() * 7) + 0) + '%',
            }}
            src="/images/gif/star-2.gif"
        />

        <img
            style={{
                position: 'absolute',
                width: '6%',
                right: (Math.floor(Math.random() * 15) + 20) + '%',
                bottom: (Math.floor(Math.random() * 8) + 2) + '%',
            }}
            src="/images/gif/star-1.gif"
        />

        <img
            style={{
                position: 'absolute',
                width: '8%',
                top: (Math.floor(Math.random() * 14) + 50) + '%',
                right: (Math.floor(Math.random() * 5) + 3) + '%',
            }}
            src="/images/gif/star-1.gif"
        />

        <Box
            sx={{
                position: 'absolute',
                top: '10px',
                left: '20px',
                display: 'flex',
                gap: 1,
                userSelect: 'none',
            }}
        >
            <ImageLazyLoading
                src='/images/LOGO-image-full.svg'
                sx={{
                    height: 24,
                    width: 24,
                }}
            />
            <Typography
                variant='h6'
                sx={{
                    color: 'white',
                    opacity: 0.7,
                    fontSize: '14px',
                    fontWeight: 400,
                }}
            >Học viện Spacedev.vn</Typography>
        </Box>

        <Box
            sx={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                textAlign: 'center',
                maxHeight: '58%',
                display: 'flex',
                flexDirection: 'column',
                '& .wrapper': {
                    height: 'auto !important',
                }
            }}
        >
            <ImageLazyLoading
                sx={{
                    maxHeight: '100px',
                    maxWidth: '200px',
                    objectFit: 'contain',
                    display: 'flex',
                }} alt="gallery image" src={logo} />
            <Typography
                variant='h2'
                sx={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 400,
                    letterSpacing: '0.6px',
                }}
            >{title}</Typography>
        </Box>
    </Box>
}