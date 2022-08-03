import { Alert, Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import React from 'react';
import { CourseProps } from 'services/courseService';

// const projects = [
//     {
//         title: 'website giới thiệu công ty digital marketing',
//         description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt quasi veniam minima! Ipsam, repellat. At, soluta similique ipsa doloremque sapiente facere ex? Amet, consequatur deleniti? Eum eius odio vitae cumque.',
//         featured_image: 'https://www.nghiatran.info/projects/stylepnj/img1-stylepnj.jpg',
//     },
//     {
//         title: 'website tin tức abcnews.com',
//         description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt quasi veniam minima! Ipsam, repellat. At, soluta similique ipsa doloremque sapiente facere ex? Amet, consequatur deleniti? Eum eius odio vitae cumque.',
//         featured_image: 'https://www.nghiatran.info/projects/bohodecor/img2-bohodecor.jpg',

//     },
//     {
//         title: 'website thương mại điện tử',
//         description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt quasi veniam minima! Ipsam, repellat. At, soluta similique ipsa doloremque sapiente facere ex? Amet, consequatur deleniti? Eum eius odio vitae cumque.',
//         featured_image: 'https://www.nghiatran.info/projects/bluestone/img2-bluestone.jpg',
//     },
// ];

function SectionProjects({ course }: {
    course: CourseProps | null
}) {

    if (course) {
        return (
            <Card>
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Typography component='h3' variant='h3'>{__('Applied Learning Project')}</Typography>
                    <Alert
                        severity='warning'
                        sx={{ alignItems: 'center' }}
                    >
                        <Typography>
                            {__('Học viên sẽ chọn thực hiện một hoặc nhiều dự án tùy thuộc vào khả năng của bản thân. Trong khóa học, giảng viên có thể chỉ hướng dẫn một hoặc một số dự án. Ngoài ra sẽ có các bài tập nhỏ xuyên suốt các buổi học tùy vào kiến thức được học.')}
                        </Typography>
                        <Typography sx={{ mt: 1 }}>
                            {
                                __('Giảng viên sẽ chấm điểm dự án cuối khóa của học viên, điểm dự án sẽ được sử dụng để các nhà tuyển dụng đánh giá ứng viên tiềm năng, vì vậy hãy cân nhắc chọn lựa dự án phù hợp và làm nó thật tốt trước khi báo cáo với giảng viên')
                            }
                        </Typography>
                    </Alert>
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
                                            sx={{
                                                display: 'flex',
                                                gap: 4,
                                                pt: 1,
                                                pb: 1,
                                            }}
                                        >
                                            <ImageLazyLoading src={getImageUrl(item.featured_image)} sx={{ width: '55%', height: '100%', borderRadius: 2 }} />
                                            <Box
                                                sx={{ flex: 1, display: 'flex', gap: 1, flexDirection: 'column', }}
                                            >
                                                <Typography variant='h3'>{item.title}</Typography>
                                                <Typography>{item.description}</Typography>
                                            </Box>
                                        </Box>
                                        {
                                            index !== (course?.course_detail?.projects?.length ?? 0) - 1 &&
                                            <Divider color='dark' />
                                        }
                                    </React.Fragment>
                                ))
                                :
                                <>
                                    <Typography variant='h3'>{__('Không có dự án')}</Typography>
                                    <Typography>{__('Không dự án nào được xây dựng trong khóa học này, có thể khóa học này sẽ chỉ cung cấp cho bạn kiến thức và các dự án nhỏ liên quan đến buổi học, vì vậy nó sẽ không bao gồm trong phần này.')}</Typography>
                                </>
                        }
                    </Box>
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
                <Alert
                    severity='warning'
                >
                    {__('Học viên sẽ chọn thực hiện một hoặc nhiều dự án tùy thuộc vào lựa chọn của bản thân. Trong khóa học, giảng viên có thể chỉ hướng dẫn một hoặc một số dự án.')}
                </Alert>
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
            </CardContent>
        </Card >

    )
}

export default SectionProjects