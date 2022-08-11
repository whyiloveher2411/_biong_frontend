import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';
import { CourseProps } from 'services/courseService';

function SectionFAQ({ course }: {
    course: CourseProps | null
}) {

    if (course) {

        return (
            <>
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
                            <Accordion key={index}>
                                <AccordionSummary
                                    expandIcon={<Icon icon="ExpandMore" />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>{item.question}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
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
                        <>
                            <Typography variant='h3'>{__('Không có câu hỏi nào được đăng')}</Typography>
                            <Typography>{__('Trong phần này, bạn sẽ được trả lời các câu hỏi xoay quanh các vấn đề về khóa học như chứng chỉ sau khi hoàn thành khóa học, cơ hội nghề nghiệp hiện tại và trương lai,...')}</Typography>
                        </>
                }
                {/* </CardContent>
                </Card> */}
            </>
        )
    }

    return null;

}

export default SectionFAQ