import { Alert, Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import Icon from "components/atoms/Icon";
import { __ } from "helpers/i18n";
import React from "react";
import { CourseProps } from "services/courseService";

export default function SectionAbout({
    course
}: {
    course: CourseProps | null
}) {
    if (!course) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                fontSize: 16,
                lineHeight: '28px',
            }}
        >
            <Alert
                severity='info'
            >
                {__('Tất cả khóa học bắt buộc phải được cập nhật nội dung mới trong vòng 2 năm, nếu không sẽ bắt buộc đóng khóa học. Quy định này nhằm đảm bảo nội dung khóa học sẽ luôn được cập nhật nội dung mới nhất. Hãy tham khảo thêm "Nhật ký thay đổi" để biết những thay đổi của khóa học.')}
            </Alert>
            <Card>
                <CardContent>
                    {
                        Boolean(course?.course_detail?.requirements) &&
                        <Box>
                            <Typography component='h3' variant='h3'>{__('Requirements')}</Typography>
                            <ul>
                                {
                                    course?.course_detail?.requirements?.map((item, index) => (
                                        <li key={index}>{item.content}</li>
                                    ))
                                }
                            </ul>
                        </Box>
                    }
                </CardContent>
            </Card>

            {
                Boolean(course?.course_detail?.what_you_will_learn) &&
                <Card>
                    <CardContent>

                        <Box>
                            <Typography component='h3' variant='h3'>What you'll learn</Typography>
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    mt: 3,
                                }}
                            >
                                {
                                    course?.course_detail?.what_you_will_learn?.map((item, index) => (
                                        !item.delete ? <Grid
                                            item
                                            key={index}
                                            md={6}
                                            sx={{
                                                display: 'flex',
                                                gap: 2,
                                            }}
                                        >
                                            <Icon icon="DoneRounded" color="success" />
                                            {item.content}
                                        </Grid>
                                            :
                                            <React.Fragment key={index} />
                                    ))
                                }
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            }

            {
                Boolean(course?.course_detail?.what_you_will_learn) &&
                <Card>
                    <CardContent>

                        <Typography component='h3' variant='h3'>Skills you will gain</Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                mt: 3,
                            }}
                        >
                            {
                                course?.course_detail?.what_you_will_learn?.map((item, index) => (
                                    !item.delete ? <Chip
                                        key={index}
                                        label={"Item " + index}
                                    />
                                        :
                                        <React.Fragment key={index} />
                                ))
                            }
                        </Box>
                    </CardContent>
                </Card>
            }

            {
                Boolean(course?.course_detail?.description) &&
                <Card>
                    <CardContent>
                        <Box>
                            <Typography component='h3' sx={{ mb: 2 }} variant='h3'>{__('Description')}</Typography>
                            <div dangerouslySetInnerHTML={{ __html: course.course_detail?.description ?? '' }} />
                        </Box>
                    </CardContent>
                </Card>
            }

            {
                Boolean(course?.course_detail?.who) &&
                <Card>
                    <CardContent>
                        <Box>
                            <Typography component='h3' variant='h3'>{__('Who this course is for:')}</Typography>
                            <ul>
                                {
                                    course?.course_detail?.who?.map((item, index) => (
                                        <li key={index}>{item.content}</li>
                                    ))
                                }
                            </ul>
                        </Box>
                    </CardContent>
                </Card>
            }
        </Box>
    )
}