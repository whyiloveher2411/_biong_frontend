import { LinearProgress, LinearProgressProps } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/system';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Typography from 'components/atoms/Typography';
import SectionLearn from 'components/pages/CorePage/Course/components/SectionLearn';
import { cssMaxLine } from 'helpers/dom';
import { getImageUrl } from 'helpers/image';
import React from 'react';
import { CourseProps } from 'services/courseService';


function CourseProgress({
    course, height = '100%',
}: {
    course?: CourseProps,
    height?: string,
}) {

    const [activePopupLearn, setActivePopupLearn] = React.useState(false);

    if (!course) {
        return null;
    }

    return (
        <>
            <Card
                sx={{
                    height: height,
                    display: 'flex',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                }}
                onClick={() => setActivePopupLearn(true)}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: 120,
                    }}
                >
                    <ImageLazyLoading sx={{ width: '100%', height: '100%' }} alt="gallery image" src={getImageUrl(course.featured_image)} />
                </Box>
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 1,
                        pb: '8px !important',
                        flex: 1,
                        p: 2,
                        minHeight: 120,
                    }}
                >
                    <Box>
                        <Typography
                            variant='h5'
                            component='h2'
                            sx={{
                                ...cssMaxLine(2),
                                mb: 1,
                            }}
                        >
                            {course.title}
                        </Typography>
                        {/* {
                            course.completion_data?.label_current ?
                                <>
                                    <Typography
                                        variant='h5'
                                        sx={{
                                            ...cssMaxLine(2),
                                        }}
                                    >
                                        {
                                            (course.completion_data?.label_current?.chapter.stt ?? 0) + 1 + '. '
                                        }
                                        {
                                            course.completion_data?.label_current?.chapter.title
                                        }
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            ...cssMaxLine(2),
                                        }}
                                    >
                                        {
                                            (course.completion_data?.label_current?.lesson.stt ?? 0) + 1 + '. '
                                        }
                                        {
                                            course.completion_data?.label_current?.lesson.title
                                        }
                                    </Typography>
                                </>
                                :
                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        ...cssMaxLine(3),
                                        maxHeight: 72,
                                        lineHeight: '24px',
                                    }}
                                >
                                    {course.description}
                                </Typography>
                        } */}
                    </Box>
                    <LinearProgressWithLabel value={course.completion_data?.rate ?? 0} />
                </CardContent>
            </Card>
            <SectionLearn open={activePopupLearn} onClose={() => setActivePopupLearn(false)} slug={course.slug} />
        </>
    )
}

export default CourseProgress

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}