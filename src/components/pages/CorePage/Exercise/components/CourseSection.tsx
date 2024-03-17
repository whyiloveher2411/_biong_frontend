import { Grid } from '@mui/material'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'

function CourseSection() {
    return (
        <Grid
            container
            spacing={3}
        >
            <Grid
                item
                md={4}
            >
                <ImageLazyLoading
                    sx={{
                        borderRadius: 2,
                        display: 'flex',
                    }}
                    src='https://assets.leetcode.com/users/images/49479bba-73b3-45d2-9272-99e773d784b2_1687290663.3168745.jpeg'
                />
            </Grid>
            <Grid
                item
                md={4}
            >
                <ImageLazyLoading
                    sx={{
                        borderRadius: 2,
                        display: 'flex',
                    }}
                    src='https://assets.leetcode.com/users/images/49479bba-73b3-45d2-9272-99e773d784b2_1687290663.3168745.jpeg'
                />
            </Grid>
            <Grid
                item
                md={4}
            >
                <ImageLazyLoading
                    sx={{
                        borderRadius: 2,
                        display: 'flex',
                    }}
                    src='https://assets.leetcode.com/users/images/49479bba-73b3-45d2-9272-99e773d784b2_1687290663.3168745.jpeg'
                />
            </Grid>
        </Grid>


    )
}

export default CourseSection