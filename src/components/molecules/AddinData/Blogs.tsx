import { Grid } from '@mui/material'
import React from 'react'
import { ExploreProps } from 'services/exploreService'
import ExploreSingle from '../ExploreSingleBak'

function Blogs({ blogs }: { blogs?: ExploreProps[] }) {
    return (
        <Grid
            container
            spacing={6}
            sx={{
                justifyContent: 'center',
            }}
        >
            {
                blogs ?
                    blogs.map((item, index) => (
                        <Grid
                            key={index}
                            item
                            xs={12}
                            md={6}
                        >
                            <ExploreSingle explore={item} />
                        </Grid>
                    ))
                    :
                    [1, 2].map((item) => (
                        <Grid
                            key={item}
                            item
                            xs={12}
                            md={6}
                        >
                            <ExploreSingle />
                        </Grid>
                    ))
            }
        </Grid>
    )
}

export default Blogs