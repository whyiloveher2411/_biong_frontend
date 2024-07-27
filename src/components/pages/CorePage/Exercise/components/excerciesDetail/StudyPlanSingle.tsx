import { Box, Card, CardContent, Typography } from '@mui/material';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { getImageUrl } from 'helpers/image';
import { Link } from 'react-router-dom';
import { StudyPlanProps } from 'services/codingChallengeService';
import { getLinkExcercise } from '../..';

function StudyPlanSingle({ study }: { study: StudyPlanProps }) {
    return <Card
        component={Link}
        to={getLinkExcercise(study.slug, 'studyPlan')}
        sx={{
            height: '100%',
            display: 'block',
        }}
    >
        <CardContent
            sx={{
                display: 'flex',
                gap: 2,
                p: 1,
                paddingBottom: '8px !important',
            }}
        >
            <ImageLazyLoading
                sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 2,
                    display: 'flex',
                    flexShrink: 0,
                }}
                src={getImageUrl(study.thumbnail)}
            />
            <Box
                sx={{
                    w: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Typography variant='h6' sx={{ fontWeight: 600 }}>{study.title}</Typography>
                <Typography variant='body2' sx={{ mt: 0.5 }}>{study.description}</Typography>
            </Box>
        </CardContent>
    </Card>
}

export default StudyPlanSingle