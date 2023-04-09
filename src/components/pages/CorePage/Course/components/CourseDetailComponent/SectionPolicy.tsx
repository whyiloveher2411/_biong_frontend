import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import { useIndexedDB } from 'hook/useApi';
import React from 'react';
import elearningService, { CoursePolicyProps } from 'services/elearningService';

function SectionPolicy() {


    const { data: coursePolicy, setData: setCoursePolicy } = useIndexedDB<CoursePolicyProps[] | null>({ key: 'CoursePolicy', defaultValue: null });

    React.useEffect(() => {

        (async () => {

            const policy = await elearningService.getCoursePolicy();

            setCoursePolicy(policy);

        })()
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                maxWidth: '100%',
                width: 910,
                margin: '0 auto',
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
                Boolean(coursePolicy) &&
                coursePolicy?.map((policy, index) => (
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
                                '& .MuiAccordionSummary-content': {
                                    display: 'block',
                                }
                            }}
                        >
                            <Typography sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', fontSize: 16 }}>
                                <Icon className="icon-expanded" sx={{ mr: 2, transition: 'all 300ms', fontSize: 18 }} icon="ArrowForwardIosRounded" />{index + 1}. {policy.title}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                borderTop: '1px solid',
                                borderColor: 'dividerDark',
                            }}
                        >
                            <Box dangerouslySetInnerHTML={{ __html: policy.content }} />
                        </AccordionDetails>
                    </Accordion>
                ))
            }

        </Box >
    )

}

export default SectionPolicy

// import Box from '@mui/material/Box/Box'
// import Typography from '@mui/material/Typography'
// import { __ } from 'helpers/i18n'
// import React from 'react'

// function SectionPolicy() {
//     return (
//         <Box
//             sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 4,
//             }}
//         >
//             <Box>
//                 <Typography component='h3' sx={{ mb: 2, }} variant='h3'>{__('Điều khoản hoàn tiền')}</Typography>
//             </Box>
//             <Box>
//                 <Typography component='h3' sx={{ mb: 2, }} variant='h3'>{__('Cập nhật nội dung')}</Typography>
//             </Box>
//             <Box>
//                 <Typography component='h3' sx={{ mb: 2, }} variant='h3'>{__('Chính sách học lại')}</Typography>
//             </Box>
//             <Box>
//                 <Typography component='h3' sx={{ mb: 2, }} variant='h3'>{__('Hướng dẫn mua hàng')}</Typography>
//             </Box>
//             <Box>
//                 <Typography component='h3' sx={{ mb: 2, }} variant='h3'>{__('Chính sách giãm giá')}</Typography>
//             </Box>
//             <Box>
//                 <Typography component='h3' sx={{ mb: 2, }} variant='h3'>{__('Khóa học liên quan')}</Typography>
//             </Box>
//             <Box>
//                 <Typography component='h3' sx={{ mb: 2, }} variant='h3'>{__('Tặng khóa học')}</Typography>
//             </Box>

//         </Box>
//     )
// }

// export default SectionPolicy