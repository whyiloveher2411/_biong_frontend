import { Box, Grid, Typography } from "@mui/material";
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
                gap: 3,
                fontSize: 16,
                lineHeight: '28px',
            }}
        >
            {
                Boolean(course?.course_detail?.what_you_will_learn && course?.course_detail?.what_you_will_learn.length) &&
                <Box>
                    <Typography component='h3' sx={{ mb: 2, }} variant='h3'>{__('Những gì bạn sẽ học')}</Typography>
                    <Grid
                        container
                        spacing={2}
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
                                        alignItems: 'center',
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
            }
            {
                Boolean(course?.course_detail?.requirements) &&
                <Box>
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
                <Box>
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
                <Box>
                    <Typography component='h3' sx={{ mb: 2, mt: 3 }} variant='h3'>{__('Mô tả')}</Typography>
                    <div dangerouslySetInnerHTML={{ __html: course.course_detail?.description ?? '' }} />
                </Box>
            }
        </Box>
    )
}