import { Grid, Typography } from '@mui/material'
import Banner from 'components/molecules/Banner'
import Page from 'components/templates/Page'
import { __ } from 'helpers/i18n'
import React from 'react'
import elearningService, { Roadmap } from 'services/elearningService'
import RoadmapSingle from './RoadmapSingle'

function RoadmapList() {

    const [roadmaps, setRoadmaps] = React.useState<Array<Roadmap> | null | undefined>(null);

    React.useEffect(() => {
        (async () => {
            const roadmapApi = await elearningService.roadmap.get();
            setRoadmaps(roadmapApi?.roadmaps);
        })()
    }, []);

    return (
        <Page
            title={__('Roadmap')}
        >
            <Banner
                color='rgb(185 238 255)'
                image='/images/roadmap.jpg'
            >
                <Typography sx={theme => ({
                    mt: 3,
                    fontWeight: 500,
                    fontSize: 14,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: theme.palette.text.disabled,
                    '&:after': {
                        backgroundColor: theme.palette.primary.main,
                        content: "''",
                        display: 'block',
                        height: '2px',
                        marginTop: '16px',
                        width: '80px',
                    }
                })}>học viện Spacedev.vn</Typography>
                <Typography sx={{ mt: 3, lineHeight: '56px', letterSpacing: '-0.5px', fontSize: 48, fontWeight: 400 }} variant='h1' component='h2'>Điều quan trọng không phải là <Typography component='span' sx={{ color: 'error.main', fontSize: 'inherit', }}>vị trí đứng</Typography> mà là <Typography component='span' sx={{ color: 'primary.main', fontSize: 'inherit', }}>hướng đi</Typography></Typography>
                <Typography sx={{ mt: 2, mb: 3, lineHeight: '28px', fontSize: 18 }} variant='subtitle1'>Roadmap - con đường phát triển đúng đắn, học chuẩn kiến thức từ roadmap với các lộ trình, khóa học, bài báo, tài nguyên để giúp bạn định hướng và chọn ra con đường phát triển trong sự nghiệp của riêng mình. </Typography>
            </Banner>

            <Typography sx={{ fontWeight: 400, mt: 8, mb: 3, }} variant='h3' component='h2'>Danh sách roadmap dành cho lập trình viên</Typography>
            <Grid
                container
                spacing={2}
            >
                {
                    roadmaps?.map(item => (
                        <Grid
                            key={item.id}
                            item
                            md={3}
                            sm={6}
                            xs={12}
                        >
                            <RoadmapSingle roadmap={item} />
                        </Grid>
                    ))
                }
            </Grid>
        </Page >
    )
}

export default RoadmapList