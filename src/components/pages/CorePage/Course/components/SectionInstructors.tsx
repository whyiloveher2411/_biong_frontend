import { Box, Chip, IconButton, Typography, Link as LinkMui, Card, CardContent, Skeleton } from '@mui/material'
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
            <Card>
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
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
                                            <Link to={'/user/' + item.linkProfile}>
                                                <ImageLazyLoading src={getImageUrl(item.avatar, '/images/user-default.svg')} sx={{ width: 168, height: 168, borderRadius: '50%' }} />
                                            </Link>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 0.5,
                                                }}
                                            >
                                                <Link to={'/user/' + item.linkProfile}>
                                                    <Typography variant='h2'>{item.name} <Chip label={item.position} /></Typography>
                                                </Link>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <IconButton size='small'>
                                                        <Icon icon="WorkOutlineOutlined" />
                                                    </IconButton>
                                                    <Typography variant='subtitle1'>{item.job}</Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <IconButton size='small'>
                                                        <Icon icon="StarBorderRounded" />
                                                    </IconButton>
                                                    {parseFloat(item.rating + '').toFixed(1)} Rating
                                                </Box>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <IconButton size='small'>
                                                        <Icon icon="MilitaryTechOutlined" />
                                                    </IconButton>
                                                    {numberWithSeparator(item.reviews)} Reviews
                                                </Box>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <IconButton size='small'>
                                                        <Icon icon="PeopleAltOutlined" />
                                                    </IconButton>
                                                    {numberWithSeparator(item.students)} Students
                                                </Box>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <IconButton size='small'>
                                                        <Icon icon="BookmarksOutlined" />
                                                    </IconButton>
                                                    {numberWithSeparator(item.courses)} Courses
                                                </Box>

                                            </Box>
                                        </Box>
                                        <Typography>{item.description}</Typography>
                                        {
                                            item.website ?
                                                <Typography><LinkMui href={item.website} sx={{ color: "text.link" }} target={'_blank'} >{item.website}</LinkMui></Typography>
                                                :
                                                <></>
                                        }
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                            }}
                                        >
                                            <SocialLink icon="FacebookRounded" color='#4267B2' href="#" />
                                            <SocialLink icon="Twitter" color='#1DA1F2' href="#" />
                                            <SocialLink icon="YouTube" color='#FF0000' href="#" />
                                            <SocialLink icon="LinkedIn" color='#2867B2' href="#" />
                                            <SocialLink icon="GitHub" color='#4078c0' href="#" />
                                        </Box>
                                    </Box>
                                    {
                                        index !== instructors.length - 1 &&
                                        <Divider color='dark' />
                                    }
                                </React.Fragment>
                            ))
                            :
                            <>
                                <Typography variant='h3'>{__('Không có người hướng dẫn')}</Typography>
                                <Typography>{__('Người hướng dẫn là người trực tiếp hướng dẫn hoặc giúp đỡ bạn trong các vấn đề liên quan đến khóa học, bao gồm phỏng vấn, trả lời các câu hỏi bạn đăng trong phần thảo luận...')}</Typography>
                            </>
                    }
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <InstructorsLoading />
            </CardContent>
        </Card>
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
                            <Skeleton variant='circular' sx={{ width: 168, height: 168 }} />
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