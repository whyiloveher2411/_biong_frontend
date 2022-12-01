import { Box, Skeleton, Typography, Link as LinkMui } from '@mui/material';
import Divider from 'components/atoms/Divider';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import React from 'react';
import { CourseProps } from 'services/courseService';

function SectionProjects({ course }: {
    course: CourseProps | null
}) {

    if (course) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                }}
            >
                {/* <Alert
                    severity='warning'
                    sx={{
                        fontSize: 14,
                        lineHeight: '24px',
                        letterSpacing: '0.3px',
                    }}
                >
                    <Typography>
                        {__('Học viên sẽ chọn thực hiện một hoặc nhiều dự án tùy thuộc vào khả năng của bản thân. Trong khóa học, giảng viên có thể chỉ hướng dẫn một hoặc một số dự án. Ngoài ra sẽ có các bài tập nhỏ xuyên suốt các buổi học tùy vào kiến thức được học.')}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                        {
                            __('Giảng viên sẽ chấm điểm dự án cuối khóa của học viên, điểm dự án sẽ được sử dụng để các nhà tuyển dụng đánh giá ứng viên tiềm năng, vì vậy hãy cân nhắc chọn lựa dự án phù hợp và làm nó thật tốt trước khi báo cáo với giảng viên')
                        }
                    </Typography>
                </Alert> */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    {
                        course?.course_detail?.projects?.length ?
                            course?.course_detail?.projects.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Box
                                        sx={(theme) => ({
                                            display: 'flex',
                                            gap: 4,
                                            pt: 1,
                                            pb: 1,
                                            [theme.breakpoints.down('md')]: {
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            },
                                        })}
                                    >
                                        <Box
                                            sx={(theme) => ({
                                                width: '55%',
                                                [theme.breakpoints.down('md')]: {
                                                    width: '100%',
                                                },
                                            })}
                                        >
                                            <ImageLazyLoading src={getImageUrl(item.featured_image)} sx={{ width: '100%', height: 'auto', borderRadius: 2 }} />
                                        </Box>
                                        <Box
                                            sx={{ flex: 1, display: 'flex', gap: 1, flexDirection: 'column', }}
                                        >
                                            <Typography variant='h3'>{item.title}</Typography>
                                            <Typography>{item.description}</Typography>
                                            {
                                                item.link ?
                                                    <Typography><LinkMui href={item.link} sx={{ color: "text.link" }} rel="nofollow" target={'_blank'} >Xem dự án</LinkMui></Typography>
                                                    :
                                                    <></>
                                            }
                                        </Box>
                                    </Box>
                                    {
                                        index !== (course?.course_detail?.projects?.length ?? 0) - 1 &&
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
                                <Typography>{__('Các dự án học viên có thể sẽ cần thực hiện trong quá trình học, nhằm giúp học viên nâng cao kiến thức và tiếp cận với các dự án thực tế khi đi làm')}</Typography>
                            </Box>
                    }
                </Box>
            </Box>

        )
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}
        >
            {/* <Alert
                severity='warning'
            >
                {__('Học viên sẽ chọn thực hiện một hoặc nhiều dự án tùy thuộc vào lựa chọn của bản thân. Trong khóa học, giảng viên có thể chỉ hướng dẫn một hoặc một số dự án.')}
            </Alert> */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                {
                    [1, 2, 3, 4, 5].map((item, index) => (
                        <React.Fragment key={index}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 4,
                                }}
                            >
                                <Skeleton
                                    sx={{ width: '55%', height: '260px', borderRadius: 2, transform: 'scale(1, 1)' }}
                                />
                                <Box
                                    sx={{ flex: 1, display: 'flex', gap: 1, flexDirection: 'column', }}
                                >
                                    <Skeleton sx={{ transform: 'scale(1, 1)' }}>
                                        <Typography variant='h3'>website giới thiệu công ty digital marketing</Typography>
                                    </Skeleton>
                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }} >
                                        <Skeleton>
                                            <Typography>Lorem ipsum dolor sit amet consectetur </Typography>
                                        </Skeleton>
                                        <Skeleton>
                                            <Typography>Lorem ipsum dolor sit amet consectetur </Typography>
                                        </Skeleton>
                                        <Skeleton>
                                            <Typography>Lorem ipsum dolor sit amet consectetur </Typography>
                                        </Skeleton>
                                        <Skeleton>
                                            <Typography>Lorem ipsum dolor sit amet consectetur </Typography>
                                        </Skeleton>
                                        <Skeleton>
                                            <Typography>Lorem ipsum dolor s</Typography>
                                        </Skeleton>
                                    </Box>
                                </Box>
                            </Box>
                            {
                                index !== 4 &&
                                <Divider color='dark' />
                            }
                        </React.Fragment>
                    ))
                }
            </Box>
        </Box>
    )
}

export default SectionProjects