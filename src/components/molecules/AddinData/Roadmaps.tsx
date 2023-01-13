import { Grid } from '@mui/material'
import RoadmapSingle from 'components/pages/CorePage/Roadmap/components/RoadmapSingle'
import React from 'react'
import { Roadmap } from 'services/elearningService'

function Roadmaps({ roadmaps }: { roadmaps?: Roadmap[] }) {
    return (
        <Grid
            container
            spacing={2}
        >
            {
                roadmaps ?
                    roadmaps.map(item => (
                        <Grid
                            key={item.id}
                            item
                            sm={6}
                            xs={12}
                        >
                            <RoadmapSingle inPopup roadmap={item} />
                        </Grid>
                    ))
                    :
                    [1, 2, 3].map((item) => (
                        <Grid
                            key={item}
                            item
                            sm={6}
                            xs={12}
                        >
                            <RoadmapSingle />
                        </Grid>
                    ))
            }
        </Grid>
    )
}

export default Roadmaps