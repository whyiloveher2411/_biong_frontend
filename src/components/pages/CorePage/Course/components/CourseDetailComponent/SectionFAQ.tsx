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
                {
                    course.course_detail?.faq?.length ?
                        course.course_detail?.faq?.map((item, index) => (
                            <Accordion
                                key={index}
                                disableGutters
                                sx={{
                                    boxShadow: 'none',
                                    background: 'transparent',
                                    border: '1px solid',
                                    borderColor: 'dividerDark',
                                    '&.Mui-expanded .icon-expanded': {
                                        transform: 'rotate(90deg)',
                                    },
                                    '&:before': {
                                        content: 'none',
                                    }
                                }}
                            >
                                <AccordionSummary
                                    sx={{
                                        '& .MuiAccordionSummary-content': {
                                            display: 'block',
                                        }
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 600, flexShrink: 0, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between', fontSize: 18 }}>
                                        {item.question} <Icon className="icon-expanded" sx={{ transition: 'all 300ms', fontSize: 18 }} icon="ArrowForwardIosRounded" />
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography sx={{ fontSize: 16 }}>
                                        {item.answers}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
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
                            <Typography>{__('Trong phần này, bạn sẽ được trả lời các câu hỏi xoay quanh các vấn đề về khóa học như chứng chỉ sau khi hoàn thành khóa học, cơ hội nghề nghiệp hiện tại và trương lai,...')}</Typography>
                        </Box>
                }
            </Box>
        )
    }

    return null;

}

export default SectionFAQ