import { AvatarGroup, Box, Chip, Rating, Typography, useTheme } from '@mui/material'
import AvatarWithLineWraper from 'components/atoms/AvatarWithLineWraper'
import Divider from 'components/atoms/Divider'
import Icon from 'components/atoms/Icon'
import Banner, { BannerLoading } from 'components/molecules/Banner'
import { BannerCourseImageThumbnail } from 'components/molecules/BannerCourseImageThumbnail'
import DrawerCustom from 'components/molecules/DrawerCustom'
import Price from 'components/molecules/Ecommerce/Price'
import { dateFormat } from 'helpers/date'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import { nFormatter, numberWithSeparator } from 'helpers/number'
import useQuery from 'hook/useQuery'
import React from 'react'
import { Link } from 'react-router-dom'
import { CourseProps } from 'services/courseService'
import RoadmapDetail from '../../Roadmap/components/RoadmapDetail'
import ButtonBuy from './CourseDetailComponent/ButtonBuy'
// import MoreButton from 'components/atoms/MoreButton'
// import Tooltip from 'components/atoms/Tooltip'

function SectionCourseSumary({
    course,
    isPurchased,
}: {
    course: CourseProps | null,
    isPurchased: boolean,
}) {

    // const [learnMethod] = React.useState<TLearnMethod>('online');

    const urlParam = useQuery({
        open_roadmap: -1,
        tab_course_detail: '',
    });

    const theme = useTheme();

    const studentNumber = ((Number(course?.course_detail?.sumary?.studentNumber) ? Number(course?.course_detail?.sumary?.studentNumber) : 0) + (Number(course?.course_detail?.count_student_fake) ? Number(course?.course_detail?.count_student_fake) : 0)) - 10

    if (course) {

        return (
            <>
                <Banner
                    color={course.course_detail?.color ?? '#ffcAb9'}
                    image={getImageUrl(course.course_detail?.banner ?? course.featured_image)}
                    imageCustom={<BannerCourseImageThumbnail
                        color={course.course_detail?.thumbnail_color ?? '#644c28'}
                        logo={getImageUrl(course.course_detail?.banner ?? course.featured_image)}
                    />}
                >

                    <Typography sx={{
                        mt: 3, fontWeight: 500, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px', color: theme.palette.text.disabled,
                        '&:after': {
                            backgroundColor: theme.palette.primary.main,
                            content: "''",
                            display: 'block',
                            height: '2px',
                            marginTop: '16px',
                            width: '80px',
                        }
                    }}>{__('Học viện spacedev.vn')}</Typography>
                    {/* <Typography sx={{ mb: 1 }}>{convertHMS(course.course_detail?.total_time ?? 0, true)}</Typography> */}
                    <Typography variant='h1' sx={{ fontWeight: 400, mb: 2, fontSize: 48, lineHeight: '56px' }}>{course.title}</Typography>
                    <Typography sx={{ mb: 2, fontSize: 16, lineHeight: '24px' }}>{course.course_detail?.introduce ?? course.description}</Typography>
                    {
                        Boolean(course.course_detail?.skills) &&
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1.5,
                                mb: 2,
                            }}
                        >
                            <Typography sx={{ fontSize: 16, lineHeight: '30px' }}>{__('Kỹ năng:')}</Typography>
                            {
                                course.course_detail?.skills?.map((item, index) => (
                                    <Chip
                                        key={index}
                                        label={item.title}
                                    />
                                ))
                            }
                        </Box>
                    }
                    {
                        course.course_detail?.level ?
                            <Typography sx={{ fontSize: 16, lineHeight: '30px', mb: 2, }}>{course.course_detail?.level}</Typography>
                            : null
                    }
                    {
                        Boolean(course.course_detail?.roadmaps && course.course_detail?.roadmaps.length > 0) &&
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1.5,
                                mb: 2,
                            }}
                        >
                            <Typography sx={{ fontSize: 16, lineHeight: '30px' }}>{__('Roadmap:')}</Typography>
                            {
                                course.course_detail?.roadmaps?.map((item, index) => (
                                    <React.Fragment
                                        key={item.id}
                                    >
                                        <Typography
                                            // label={item.title}
                                            onClick={() => {
                                                urlParam.changeQuery({
                                                    open_roadmap: index,
                                                });
                                            }}
                                            sx={{
                                                // cursor: 'pointer',
                                                // background: item.background,
                                                // color: 'white',
                                                cursor: 'pointer',
                                                color: 'primary.main',
                                                lineHeight: '30px',
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                        {
                                            index < ((course?.course_detail?.roadmaps?.length ?? 0) - 1) &&
                                            <Divider color='dark' flexItem orientation="vertical" />
                                        }
                                    </React.Fragment>
                                ))
                            }
                        </Box>
                    }

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2,
                            cursor: 'pointer',
                            flexWrap: 'wrap',
                        }}
                        onClick={() => {
                            urlParam.changeQuery({
                                tab_course_detail: 'reviews'
                            });
                        }}
                    >
                        <Typography sx={{ fontSize: 16, lineHeight: '30px' }}>
                            {__('Điểm đánh giá:')}
                        </Typography>
                        <Rating precision={0.1} emptyIcon={<Icon icon="Star" style={{ color: '#a3a3a3' }} />} name="read-only" value={parseFloat(course?.course_detail?.review_avg ? course?.course_detail?.review_avg + '' : '5') ?? 5} readOnly />
                        <Typography variant='h5' sx={{ color: '#faaf00', marginTop: '2px' }}>
                            {parseFloat((course?.course_detail?.review_avg ?? 5) + '').toFixed(1)}
                        </Typography>
                        {
                            Boolean(course.course_detail?.sumary?.reviewNumber) &&
                            <Typography sx={{ lineHeight: '30px', marginLeft: 0.5 }}>
                                {
                                    __('({{reviewNumber}} đánh giá)', {
                                        reviewNumber: nFormatter(course.course_detail?.sumary?.reviewNumber ?? 0)
                                    })
                                }
                            </Typography>
                        }
                    </Box>
                    {
                        course.course_detail?.enrolled_student?.length && !course.course_detail?.is_comming_soon ?
                            <AvatarGroup max={2121}
                                sx={{
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    right: 10,
                                    bottom: 10,
                                    zIndex: 1,
                                    pb: 3,
                                    pl: 1,
                                    '.avatar-item': {
                                        width: 44,
                                        height: 44,
                                        ml: -1,
                                    }
                                }}
                            >
                                {course.course_detail.enrolled_student.map((student, index) => (
                                    index < 10 ?
                                        <AvatarWithLineWraper
                                            key={student.id}
                                            title={student.title}
                                            link={'/user/' + student.slug}
                                            avatar={getImageUrl(student.avatar, '/images/user-default.svg')}
                                            index={index}
                                        />
                                        :
                                        <React.Fragment key={student.id} />
                                ))}
                                {
                                    Boolean(course.course_detail?.sumary?.studentNumber) &&
                                    <Typography variant='body2' sx={{ lineHeight: '16px', fontSize: 16, pl: 1, }}>
                                        {
                                            studentNumber > 0 ?
                                                __(' + {{studentNumber}} học viên', {
                                                    studentNumber: numberWithSeparator(studentNumber)
                                                })
                                                :
                                                ''
                                        }
                                    </Typography>
                                }
                            </AvatarGroup>
                            : null
                    }
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            mb: 1,
                            alignItems: 'center',
                        }}
                    >

                        <Price
                            course={course}
                            variantPrice="h3"
                        />


                        {/* <MoreButton
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            actions={[
                                Object.keys(learnMethodList).map((key) => (
                                    {
                                        title: <React.Fragment>{learnMethodList[key as TLearnMethod].title}
                                            <Price
                                                price={course[learnMethodList[key as TLearnMethod].priceName]}
                                                compare_price={course[learnMethodList[key as TLearnMethod].comparePriceName]}
                                                variantPrice="h3"
                                            /></React.Fragment>,
                                        selected: learnMethod === key,
                                        action: () => {
                                            setLearnMethod(key as TLearnMethod);
                                        }
                                    }
                                ))
                            ]}
                        >
                            <Box
                                sx={{
                                    mb: 1,
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Typography variant='h4'>
                                    {learnMethodList[learnMethod].title}
                                </Typography>
                                <Price
                                    price={course[learnMethodList[learnMethod].priceName]}
                                    compare_price={course[learnMethodList[learnMethod].comparePriceName]}
                                    variantPrice="h3"
                                />
                                <Tooltip title="Thay đổi hình thức học tập">
                                    <IconButton
                                        color="primary"
                                    >
                                        <Icon icon="PriorityHighRounded" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </MoreButton> */}
                    </Box>
                    <Typography
                        variant='subtitle2'
                        sx={{ display: 'inline-block', mb: 3, fontStyle: 'italic', textDecoration: 'underline', }}
                        component={Link}
                        to="/terms/chinh-sach-khoa-hoc"
                        target='_blank'
                    >
                        Chính sách khóa học
                    </Typography>
                    <ButtonBuy
                        course={course}
                        isPurchased={isPurchased}
                    />
                    {
                        course.course_detail?.date_opening && !isNaN((new Date(course.course_detail.date_opening)).getTime()) ?
                            <Typography sx={{ mt: 1 }}>Ngày dự kiến ra mắt: {dateFormat(course.course_detail.date_opening)}</Typography>
                            :
                            null
                    }
                </Banner>

                <DrawerCustom
                    open={Boolean(course.course_detail?.roadmaps?.[Number(urlParam.query.open_roadmap)])}
                    width="1090px"
                    onCloseOutsite
                    onClose={() => {
                        urlParam.changeQuery({
                            open_roadmap: -1
                        });
                    }}
                    title={'Roadmap ' + course.course_detail?.roadmaps?.[Number(urlParam.query.open_roadmap)]?.title}
                >
                    <RoadmapDetail
                        disableActionBack
                        activeCourseSlug={course.slug}
                        slug={course.course_detail?.roadmaps?.[Number(urlParam.query.open_roadmap)]?.slug ?? ''}
                    />
                </DrawerCustom>

            </>
        )
    }

    return <BannerLoading />
}

export default SectionCourseSumary


// type TLearnMethod = 'online' | 'offline' | 'offline_zoom';

// const learnMethodList: {
//     [key in TLearnMethod]: {
//         title: string,
//         priceName: 'price' | 'price_offline' | 'price_online',
//         comparePriceName: 'compare_price' | 'compare_price_offline' | 'compare_price_online',
//     }
// } = {
//     online: { title: 'Học trên nền tảng', priceName: 'price', comparePriceName: 'compare_price' },
//     offline: { title: 'Học offline tại học viện', priceName: 'price_offline', comparePriceName: 'compare_price_offline' },
//     offline_zoom: { title: 'Học online qua Zoom', priceName: 'price_online', comparePriceName: 'compare_price_online' },
// }