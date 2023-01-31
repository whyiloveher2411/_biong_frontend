import { Box, Typography } from '@mui/material'
import { __ } from 'helpers/i18n'
import React from 'react'
import CourseLearningContext from '../context/CourseLearningContext';
import Grid from 'components/atoms/Grid';
import RoadmapSingle from '../../Roadmap/components/RoadmapSingle';
import useQuery from 'hook/useQuery';

function SectionContentOutlineLesson() {

    const courseLearningContext = React.useContext(CourseLearningContext);

    const urlQuery = useQuery({
        course: '',
    });

    React.useEffect(() => {
        urlQuery.changeQuery({
            course: courseLearningContext.course?.slug
        });
    }, []);

    return (
        <Box
            sx={{
                maxWidth: 800,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 3,
                border: '1px solid',
                borderColor: 'dividerDark',
                backgroundColor: 'background.paper',
            }}
        >

            {
                Boolean(courseLearningContext.course?.course_detail?.roadmaps?.[0]) &&
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
                            courseLearningContext.course?.course_detail?.roadmaps?.map((item, index) => (
                                <Grid
                                    key={item.id}
                                    item
                                    sm={6}
                                    xs={12}
                                >

                                    <RoadmapSingle roadmap={item} inPopup />
                                </Grid>
                            ))
                        }
                    </Grid>
                </Box>
            }

            <Typography variant='h3'>{__('Nội dung đang được cập nhật')}</Typography>
            <Typography>{__('Nơi đây chứa nội dung toàn bộ của buổi học, giúp học viên biết được những ý chính trong bài học này.')}</Typography>
        </Box>
    )
}

export default SectionContentOutlineLesson