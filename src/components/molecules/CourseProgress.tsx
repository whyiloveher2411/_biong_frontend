import { Skeleton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/system';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Typography from 'components/atoms/Typography';
import { cssMaxLine } from 'helpers/dom';
import { getImageUrl } from 'helpers/image';
import { Link } from 'react-router-dom';
import { CourseProps } from 'services/courseService';
import LinearProgressWithLabel from './LinearProgressWithLabel';


function CourseProgress({
    course, height = '100%',
}: {
    course?: CourseProps,
    height?: string,
}) {

    if (!course) {
        return (
            <Card
                sx={{
                    height: height,
                    display: 'flex',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    '&:hover, &:focus, &:active': {
                        borderColor: 'primary.main',
                        boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                    },
                    '&:focus, &:active': {
                        borderColor: 'primary.main',
                    }
                }}
            >
                <Skeleton variant='rectangular'>
                    <Box
                        sx={{
                            position: 'relative',
                            width: 120,
                            height: 126,
                        }}
                    />
                </Skeleton>
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        flex: 1,
                        pt: 3,
                        pl: 2,
                        pr: 2,
                        pb: 3,
                    }}
                >
                    <Skeleton variant='rectangular'>
                        <Typography
                            variant='h5'
                            component='h2'
                        >
                            Lorem ipsum dolor sit amet
                        </Typography>
                    </Skeleton>
                    <Skeleton variant='rectangular' sx={{ height: 18 }} />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            sx={{
                height: height,
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
                '&:hover, &:focus, &:active': {
                    borderColor: 'primary.main',
                    boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                },
                '&:focus, &:active': {
                    borderColor: 'primary.main',
                }
            }}
            component={Link}
            to={'/course/' + course.slug + '/learning'}
        >
            <CardContent
                sx={{
                    display: 'flex',
                    gap: 1,
                    flex: 1,
                    pt: 3,
                    pl: 2,
                    pr: 2,
                    pb: 3,
                }}
            >
                <Box
                    sx={{ width: '100%' }}
                >
                    <Typography
                        component='h2'
                        sx={{
                            ...cssMaxLine(1),
                            fontWeight: 600,
                            fontSize: 18,
                        }}
                    >
                        {course.title}
                    </Typography>
                    <Typography sx={{ ...cssMaxLine(1), fontSize: 14, fontWeight: 600, mt: 1 }}>{course.completion_data?.label_current?.chapter.title}</Typography>
                    <Typography variant="body2" sx={{ ...cssMaxLine(1), mb: 2 }}>{course.completion_data?.label_current?.lesson.title}</Typography>
                    <LinearProgressWithLabel position='left' value={course.completion_data?.rate ?? 0} />
                </Box>
                <Box
                    sx={{
                        position: 'relative',
                        width: 60,
                        flexShrink: 0,
                    }}
                >
                    <ImageLazyLoading sx={{ width: '100%', height: '100%', objectFit: 'contain', }} alt="gallery image" src={getImageUrl(course.featured_image)} />
                </Box>
            </CardContent>
        </Card>
    )
}

export default CourseProgress