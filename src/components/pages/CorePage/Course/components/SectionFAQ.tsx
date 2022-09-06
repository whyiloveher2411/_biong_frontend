import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';
import { CourseProps } from 'services/courseService';

function SectionFAQ({ course }: {
    course: CourseProps | null
}) {

    if (course) {

        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                {/* <Card>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    > */}
                {
                    course.course_detail?.faq?.length ?
                        course.course_detail?.faq?.map((item, index) => (
                            <Accordion
                                key={index}
                                disableGutters
                                sx={{
                                    boxShadow: 'none',
                                    border: '1px solid',
                                    borderColor: 'dividerDark',
                                    '&.Mui-expanded .icon-expanded': {
                                        transform: 'rotate(90deg)',
                                    }
                                }}
                            >
                                <AccordionSummary
                                    sx={{
                                        minHeight: 72,
                                    }}
                                >
                                    <Typography sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', fontSize: 16 }}>
                                        <Icon className="icon-expanded" sx={{ mr: 2, transition: 'all 300ms', fontSize: 18 }} icon="ArrowForwardIosRounded" /> {item.question}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{
                                        borderTop: '1px solid',
                                        borderColor: 'dividerDark',
                                    }}
                                >
                                    <Typography>
                                        {item.answers}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            // <Box
                            //     key={index}
                            // >
                            //     <Typography variant='h4' sx={{ mb: 1 }}>{item.question}</Typography>
                            //     <Typography sx={{ lineHeight: '26px', color: 'text.secondary' }}>{item.answers}</Typography>
                            // </Box>
                        ))
                        :
                        <Box
                            sx={{
                                p: 3
                            }}
                        >
                            <Typography variant='h3' sx={{ mb: 2 }}>{__('Nội dung đang được cập nhật')}</Typography>
                            <Typography>{__('Trong phần này, bạn sẽ được trả lời các câu hỏi xoay quanh các vấn đề về khóa học như chứng chỉ sau khi hoàn thành khóa học, cơ hội nghề nghiệp hiện tại và trương lai,...')}</Typography>
                        </Box>
                }
                {/* </CardContent>
                </Card> */}
            </Box>
        )
    }

    return null;

}

export default SectionFAQ