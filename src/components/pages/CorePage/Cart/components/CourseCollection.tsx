import { Box, Card, Typography } from '@mui/material'
import Avatar from 'components/atoms/Avatar'
import Divider from 'components/atoms/Divider'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import { moneyFormat } from 'plugins/Vn4Ecommerce/helpers/Money'
import React from 'react'
import { Link } from 'react-router-dom'
import { CourseProps } from 'services/courseService'


const CourseCollection = ({ title, courses, action }: {
    title: string,
    courses: Array<CourseProps>,
    action: (course: CourseProps) => React.ReactNode
}) => courses?.length > 0 ? <Card
    sx={{
        display: 'flex',
        flexDirection: 'column',
    }}
>
    <Typography sx={{ fontSize: 18, p: 2, pb: 0 }} color="text.secondary">
        {title}
    </Typography>
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        {
            courses.map((item, index) => (
                <React.Fragment key={index}>
                    <Box
                        sx={{
                            flex: '1 1',
                            display: 'grid',
                            p: 2,
                            gap: 1,
                            gridTemplateColumns: '1.2fr 4fr 2fr 1fr',
                        }}
                    >
                        <Link
                            to={'/course/' + item.slug}
                        >
                            <Avatar
                                variant="square"
                                sx={{ width: '100%', height: 'auto' }}
                                src={getImageUrl(item.featured_image)}
                            />
                        </Link>
                        <Link
                            to={'/course/' + item.slug}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.65,
                                }}
                            >
                                <Typography variant='h5' component='h2'>{item.title}</Typography>
                                {
                                    Boolean(item.course_detail?.owner_detail) &&
                                    <Typography variant='body2'>{__('By')} {item.course_detail?.owner_detail?.title}</Typography>
                                }
                            </Box>
                        </Link>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.65,
                                textAlign: 'right',
                                pr: 4,
                            }}
                        >
                            {action(item)}
                        </Box>
                        <Box>
                            <Typography color="primary.dark" variant='h5'>{moneyFormat(item.price)}</Typography>
                        </Box>
                    </Box>
                    {
                        index !== (courses.length - 1) &&
                        <Divider color="dark" />
                    }
                </React.Fragment>
            ))
        }
    </Box>
</Card> : null

export default CourseCollection