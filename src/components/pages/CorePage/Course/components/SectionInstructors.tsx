import { Box, Chip, IconButton, Link as LinkMui, Skeleton, Typography } from '@mui/material'
import Divider from 'components/atoms/Divider'
import Icon from 'components/atoms/Icon'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import { numberWithSeparator } from 'helpers/number'
import React from 'react'
import { Link } from 'react-router-dom'
import { CourseProps } from 'services/courseService'
import elearningService, { InstructorProps } from 'services/elearningService'
import SocialLink from '../../User/components/SocialLink'

function SectionInstructors({ course }: {
    course: CourseProps | null
}) {

    const [instructors, setInstructors] = React.useState<Array<InstructorProps> | null>(null);

    React.useEffect(() => {

        if (course) {
            (async () => {
                const instructors = await elearningService.getInstructors(course.id);
                setInstructors(instructors);
            })()
        }

    }, [course]);

    if (course && instructors) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                }}
            >
                {
                    instructors.length > 0 ?
                        instructors.map((item, index) => (
                            <React.Fragment
                                key={index}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 3,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                minWidth: 202
                                            }}
                                        >
                                            {/* <Link to={'/user/' + item.linkProfile}> */}
                                            <ImageLazyLoading src={getImageUrl(item.avatar, '/images/user-default.svg')} sx={{ width: 190, height: 190, borderRadius: '50%', margin: '0 auto', }} />
                                            {/* </Link> */}
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1.5,
                                            }}
                                        >

                                            {
                                                (() => {


                                                    const positionData = convertPosition(item.position);

                                                    return <Link to={'/user/' + item.linkProfile}>
                                                        <Typography variant='h2'>{item.name} <Chip sx={{
                                                            color: 'white',
                                                            backgroundColor: positionData.color,
                                                        }} label={positionData.title} /></Typography>
                                                    </Link>;
                                                })()
                                            }


                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Icon icon="WorkOutlineOutlined" />
                                                <Typography variant='subtitle1'>{item.job}</Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Icon icon="StarBorderRounded" />
                                                {
                                                    __('{{rating}} đánh giá ({{reviews}} nhận xét)', {
                                                        rating: parseFloat(item.rating + '').toFixed(1),
                                                        reviews: numberWithSeparator(item.reviews),
                                                    })
                                                }
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Icon icon="PeopleAltOutlined" />
                                                {
                                                    __('{{courses}} khóa học ({{students}} học viên)', {
                                                        courses: numberWithSeparator(item.courses),
                                                        students: numberWithSeparator(item.students),
                                                    })
                                                }
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    marginLeft: '-5px',
                                                }}
                                            >
                                                {
                                                    Boolean(item.social_facebook) &&
                                                    <SocialLink icon="Facebook" color='#4267B2' href={item.social_facebook ?? '#'} />
                                                }


                                                {
                                                    Boolean(item.social_twitter) &&
                                                    <SocialLink icon="Twitter" color='#1DA1F2' href={item.social_twitter ?? '#'} />
                                                }

                                                {
                                                    Boolean(item.social_youtube) &&
                                                    <SocialLink icon="YouTube" color='#FF0000' href={item.social_youtube ?? '#'} />
                                                }
                                                {
                                                    Boolean(item.social_linkedin) &&
                                                    <SocialLink icon="LinkedIn" color='#2867B2' href={item.social_linkedin ?? '#'} />
                                                }
                                                {
                                                    Boolean(item.social_github) &&
                                                    <SocialLink icon="GitHub" color='#6cc644' href={item.social_github ?? '#'} />
                                                }
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Typography sx={{
                                        letterSpacing: '0.05px', fontSize: '18px',
                                        lineHeight: '32px',
                                    }}>{item.description}</Typography>
                                    {
                                        item.website ?
                                            <Typography><LinkMui href={item.website} sx={{ color: "text.link" }} target={'_blank'} >{item.website}</LinkMui></Typography>
                                            :
                                            <></>
                                    }

                                </Box>
                                {
                                    index !== instructors.length - 1 &&
                                    <Divider color='dark' />
                                }
                            </React.Fragment>
                        ))
                        :
                        <Box
                            sx={{
                                border: '1px solid',
                                borderColor: 'dividerDark',
                                p: 3,
                            }}
                        >
                            <Typography variant='h3' sx={{ mb: 2 }}>{__('Nội dung đang được cập nhật')}</Typography>
                            <Typography>{__('Người hướng dẫn là người trực tiếp hướng dẫn hoặc giúp đỡ bạn trong các vấn đề liên quan đến khóa học, bao gồm phỏng vấn, trả lời các câu hỏi bạn đăng trong phần thảo luận...')}</Typography>
                        </Box>
                }
            </Box>
        )
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
            }}
        >
            <InstructorsLoading />
        </Box>
    )
}

function InstructorsLoading() {

    return <>
        {
            [1, 2, 3].map((item, index) => (
                <React.Fragment
                    key={index}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 3,
                            }}
                        >
                            <Skeleton variant='circular' sx={{ width: 190, height: 190 }} />
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.5,
                                    flex: 0,
                                }}
                            >
                                <Skeleton />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        width: 400,
                                    }}
                                >
                                    <Skeleton variant='circular'>
                                        <IconButton size='small'>
                                            <Icon icon="WorkOutlineOutlined" />
                                        </IconButton>
                                    </Skeleton>
                                    <Skeleton sx={{ width: 200 }} />
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        width: 400,
                                    }}
                                >
                                    <Skeleton variant='circular'>
                                        <IconButton size='small'>
                                            <Icon icon="StarBorderRounded" />
                                        </IconButton>
                                    </Skeleton>
                                    <Skeleton sx={{ width: 200 }} />
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        width: 400,
                                    }}
                                >
                                    <Skeleton variant='circular'>
                                        <IconButton size='small'>
                                            <Icon icon="MilitaryTechOutlined" />
                                        </IconButton>
                                    </Skeleton>
                                    <Skeleton sx={{ width: 200 }} />
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        width: 400,
                                    }}
                                >
                                    <Skeleton variant='circular'>
                                        <IconButton size='small'>
                                            <Icon icon="PeopleAltOutlined" />
                                        </IconButton>
                                    </Skeleton>
                                    <Skeleton sx={{ width: 200 }} />
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        width: 400,
                                    }}
                                >
                                    <Skeleton variant='circular'>
                                        <IconButton size='small'>
                                            <Icon icon="BookmarksOutlined" />
                                        </IconButton>
                                    </Skeleton>
                                    <Skeleton sx={{ width: 200 }} />
                                </Box>

                            </Box>
                        </Box>
                        <Skeleton variant='rectangular'>
                            <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis distinctio libero at, consequuntur, officia numquam illo in aliquam obcaecati ipsam reprehenderit nulla ullam sunt reiciendis voluptatum facere ipsum similique rem.</Typography>
                        </Skeleton>
                        <Skeleton>
                            <Typography>https://dangthuyenquan.com</Typography>
                        </Skeleton>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                            }}
                        >
                            <Skeleton variant='circular'>
                                <SocialLink icon="FacebookRounded" color='#4267B2' href="#" />
                            </Skeleton>
                            <Skeleton variant='circular'>
                                <SocialLink icon="Twitter" color='#1DA1F2' href="#" />
                            </Skeleton>
                            <Skeleton variant='circular'>
                                <SocialLink icon="YouTube" color='#FF0000' href="#" />
                            </Skeleton>
                            <Skeleton variant='circular'>
                                <SocialLink icon="LinkedIn" color='#2867B2' href="#" />
                            </Skeleton>
                            <Skeleton variant='circular'>
                                <SocialLink icon="GitHub" color='#4078c0' href="#" />
                            </Skeleton>
                        </Box>
                    </Box>
                    {
                        index !== 2 &&
                        <Divider color='dark' />
                    }
                </React.Fragment>
            ))
        }
    </>
}

export default SectionInstructors

function convertPosition(position: string) {

    let result = {
        title: __('Trợ giảng'),
        color: '#3f51b5',
    };

    if (position === 'Teacher') {
        result = {
            title: __('Giảng viên'),
            color: '#ed6c02',
        };
    }

    return result;
}