import { Box, Grid, Typography } from '@mui/material'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'

function StudyPlan() {
    return (<Box sx={{
        display: 'flex',
        gap: 2,
        flexDirection: 'column',
    }}>
        <Typography variant='h2' sx={{ mt: 5, mb: 1 }}>Kế hoạch học tập</Typography>
        <Grid
            container
            spacing={2}
        >
            {
                [1, 2, 3, 4, 5, 6].map(item => <Grid
                    key={item}
                    item
                    md={4}
                    sx={{
                        display: 'flex',
                        gap: 2,
                    }}
                >
                    <ImageLazyLoading
                        src="https://assets.leetcode.com/study_plan_v2/top-interview-150/cover"
                        sx={{
                            borderRadius: 2,
                            width: 72,
                            height: 72,
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant='h3' sx={{ fontSize: 16, fontWeight: 600 }}>Top Interview 150</Typography>
                        <Typography variant="body2" >Must-do List for Interview Prep</Typography>
                    </Box>
                </Grid>)

            }
        </Grid>
    </Box>
    )
}

export default StudyPlan