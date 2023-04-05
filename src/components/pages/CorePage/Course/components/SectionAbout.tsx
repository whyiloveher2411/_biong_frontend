import { Alert, Box, Grid, Typography } from "@mui/material";
import Icon from "components/atoms/Icon";
import { __ } from "helpers/i18n";
import useQuery from "hook/useQuery";
import React from "react";
import { CourseProps } from "services/courseService";
import RoadmapSingle from "../../Roadmap/components/RoadmapSingle";
import SectionFAQ from "./SectionFAQ";
import TestKnowledge from "plugins/Vn4Test/TestKnowledge";
import { moneyFormat } from "plugins/Vn4Ecommerce/helpers/Money";

export default function SectionAbout({
    course
}: {
    course: CourseProps | null
}) {
    if (!course) {
        return null;
    }

    const urlParam = useQuery({
        open_roadmap: -1,
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                fontSize: 16,
                lineHeight: '28px',
            }}
        >
            {
                course.course_detail?.active_entry_test ?
                    <Alert
                        color={'info'}
                        severity='info'
                        icon={false}
                        sx={{
                            fontSize: 16,
                            '& .MuiAlert-message': {
                                width: '100%'
                            }
                        }}
                    >

                        <TestKnowledge
                            keyTest={'course/start/' + course.slug}
                            testRule={'course/start/' + course.slug}
                            content={(status) => {
                                const precent = status?.total_point ? (status?.point ?? 0) * 100 / (status?.total_point ? status?.total_point : 1) : 0;
                                return <>
                                    <Typography variant='h2'>Kiểm tra đầu vào nhận ngay ưu đãi</Typography>
                                    <Typography sx={{ mt: 1, }}>Kiểm tra kiến thức cơ bản trước khi vào học, nhanh chóng và tiện lợi. Ngoài ra bạn có thể nhận được các khuyến mãi nếu bài kiểm tra của bạn đủ điều kiện sau:</Typography>
                                    <Typography sx={{ mt: 1, }}><strong>Điểm số &gt;= 95%:</strong> giảm {moneyFormat(300000)} {precent >= 95 ? <strong>(Điểm số của bạn)</strong> : ''}</Typography>
                                    <Typography sx={{ mt: 1, }}><strong>Điểm số &gt;= 85%:</strong> giảm {moneyFormat(200000)} {precent >= 85 && precent < 95 ? <strong>(Điểm số của bạn)</strong> : ''}</Typography>
                                    <Typography sx={{ mt: 1, }}><strong>Điểm số &gt;= 75%:</strong> giảm {moneyFormat(100000)} {precent >= 75 && precent < 85 ? <strong>(Điểm số của bạn)</strong> : ''}</Typography>
                                    <Typography sx={{ mt: 1, color: 'secondary.main' }}><i><u style={{ textDecoration: 'underline' }}>Lưu ý:</u></i><br /> - Bạn chỉ có một lần làm bài kiểm tra đầu vào<br /> - Chương trình không áp dụng khóa học mua để tặng<br /> - Số tiền được giảm sẽ hiển thị ở phần giò hàng</Typography>
                                </>;
                            }}
                        />
                    </Alert>
                    :
                    null
            }
            {
                Boolean(course.course_detail?.roadmaps?.[0]) &&
                <Box>
                    <Typography component='h3' sx={{ mb: 1 }} variant='h3'>{__('Roadmap')}</Typography>
                    <Typography sx={{ mb: 2, }}>{__('Khóa học được xây dựng dựa trên roadmap giúp học viên có cái nhìn tổng quan về các kiến thức sẽ học, hãy lưu lại và dánh dấu khi hoàn thành.')}</Typography>
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            mb: 2
                        }}
                    >
                        {
                            course.course_detail?.roadmaps?.map((item, index) => (
                                <Grid
                                    key={item.id}
                                    item
                                    sm={6}
                                    xs={12}
                                >

                                    <RoadmapSingle roadmap={item} onClick={() => {
                                        urlParam.changeQuery({
                                            open_roadmap: index,
                                        });
                                    }} />
                                </Grid>
                            ))
                        }
                    </Grid>
                </Box>
            }
            <Box
                sx={{ mb: 3 }}
            >
                <Typography component='h3' sx={{ mb: 2, }} variant='h3'>{__('Những gì bạn nhận được')}</Typography>
                <Grid
                    container
                    sx={{
                        fontSize: '18px',
                        lineHeight: '32px',
                    }}
                >
                    {
                        [
                            'Học tập mọi lúc, mọi nơi từ bất cứ đâu có kết nối internet',
                            'Truy cập trọn đời, không giới hạn',
                            'Support 24/7 qua forum, chat, facebook, email.',
                            'Tham gia nhóm học tập spacedev.vn trên facebook',
                            'Tự điều chỉnh tốc độ học tập theo sở thích của mình',
                            'Được đánh giá, góp ý dự án cuối khóa',
                            'Một buổi phỏng vấn thử miễn phí',
                        ].map((item, index) => (
                            <Grid
                                item
                                key={index}
                                md={12}
                                sx={{
                                    display: 'flex',
                                    gap: 1.5,
                                    alignItems: 'center',
                                    pt: 1.5,
                                }}
                            >
                                <Icon icon="DoneRounded" color="success" />
                                {item}
                            </Grid>
                        ))
                    }
                    {
                        course?.course_detail?.what_you_will_receive?.filter(item => !item.delete).map((item, index) => (
                            <Grid
                                item
                                key={index}
                                md={12}
                                sx={{
                                    display: 'flex',
                                    gap: 1.5,
                                    alignItems: 'center',
                                    pt: 1.5,
                                }}
                            >
                                <Icon icon="DoneRounded" color="success" />
                                {item.content}
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
            {
                Boolean(course?.course_detail?.what_you_will_learn && course?.course_detail?.what_you_will_learn.length) &&
                <Box>
                    <Typography component='h3' sx={{ mb: 2, }} variant='h3'>{__('Những gì bạn sẽ học')}</Typography>
                    <Grid
                        container
                        sx={{
                            fontSize: '18px',
                            lineHeight: '32px',
                        }}
                    >
                        {
                            course?.course_detail?.what_you_will_learn?.filter(item => !item.delete).map((item, index) => (
                                <Grid
                                    item
                                    key={index}
                                    md={6}
                                    sx={{
                                        display: 'flex',
                                        gap: 1.5,
                                        alignItems: 'center',
                                        pt: 1.5,
                                    }}
                                >
                                    <Icon icon="DoneRounded" color="success" />
                                    {item.content}
                                </Grid>
                            ))
                        }
                    </Grid>
                </Box>
            }
            {
                Boolean(course?.course_detail?.requirements) &&
                <Box
                    sx={{
                        '&>ul': {
                            paddingInlineStart: '18px',
                        },
                        fontSize: '18px',
                        lineHeight: '32px',
                    }}
                >
                    <Typography component='h3' sx={{ mb: 2, mt: 3 }} variant='h3'>{__('Yêu cầu bắt buộc')}</Typography>
                    <ul>
                        {
                            course?.course_detail?.requirements?.map((item, index) => (
                                <li key={index}>{item.content}</li>
                            ))
                        }
                    </ul>
                </Box>
            }
            {
                Boolean(course?.course_detail?.who) &&
                <Box
                    sx={{
                        '&>ul': {
                            paddingInlineStart: '18px',
                        },
                        fontSize: '18px',
                        lineHeight: '32px',
                    }}
                >
                    <Typography component='h3' sx={{ mb: 2, mt: 3 }} variant='h3'>{__('Khóa học này dành cho ai')}</Typography>
                    <ul>
                        {
                            course?.course_detail?.who?.map((item, index) => (
                                <li key={index}>{item.content}</li>
                            ))
                        }
                    </ul>
                </Box>
            }
            {
                Boolean(course?.course_detail?.description) &&
                <Box
                    sx={{
                        fontSize: '18px',
                        lineHeight: '32px',
                    }}
                >
                    <Typography component='h3' sx={{ mb: 2, mt: 3 }} variant='h3'>{__('Mô tả')}</Typography>
                    <Box dangerouslySetInnerHTML={{ __html: course.course_detail?.description ?? '' }} />
                </Box>
            }

            {
                course.course_detail?.faq?.length ?
                    <Box
                        sx={{
                            fontSize: '18px',
                            lineHeight: '32px',
                        }}
                    >
                        <Typography component='h3' sx={{ mb: 2, mt: 3 }} variant='h3'>{__('Câu hỏi thường gặp')}</Typography>
                        <SectionFAQ course={course} />
                    </Box>
                    :
                    null
            }
        </Box>
    )
}