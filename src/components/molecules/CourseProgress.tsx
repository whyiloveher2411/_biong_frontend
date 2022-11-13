import { LinearProgress, LinearProgressProps } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/system';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Typography from 'components/atoms/Typography';
import { cssMaxLine } from 'helpers/dom';
import { getImageUrl } from 'helpers/image';
import { Link } from 'react-router-dom';
import { CourseProps } from 'services/courseService';


function CourseProgress({
    course, height = '100%',
}: {
    course?: CourseProps,
    height?: string,
}) {

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
                    transition: 'all 150ms',
                    '&:hover, &:focus, &:active': {
                        // borderColor: 'primary.main',
                        transform: 'scale(1.02)',
                        boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                    },
                    '&:focus, &:active': {
                        transform: 'scale(1.02)',
                        borderColor: 'primary.main',
                    }
                }}
                component={Link}
                to={'/course/' + course.slug + '/learning'}
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
                        // justifyContent: 'space-between',
                        gap: 1,
                        flex: 1,
                        pt: 3,
                        pl: 2,
                        pr: 2,
                        pb: 3,
                        // minHeight: 120,
                    }}
                >
                    <Box>
                        <Typography
                            variant='h5'
                            component='h2'
                            sx={{
                                ...cssMaxLine(2),
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