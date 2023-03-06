import { Box, Grid } from "@mui/material";
import Card from "components/atoms/Card";
import CardContent from "components/atoms/CardContent";
import Typography from "components/atoms/Typography";
import useAjax from "hook/useApi";
import useQuery from "hook/useQuery";
import React from "react";
import useCourse from "../../useCourse";

function Overview({ setTitle }: { setTitle: (title: string) => void }) {

    const { courses } = useCourse();

    const useApi = useAjax();

    const dataOverview = React.useState<{ [key: string]: number }>({});

    const urlParam = useQuery({
        course: 0,
    });

    const listSelectCourse = courses ? courses.map((item) => ({
        title: item.title,
        selected: (urlParam.query.course + '') === (item.id + ''),
        action() {
            urlParam.changeQuery({
                course: item.id,
            })
        },
    })) : [];

    React.useEffect(() => {

        useApi.ajax({
            url: 'vn4-e-learning/instructor/performance/overview',
            success: (result: { data: { [key: string]: number } }) => {
                if (result.data) {
                    dataOverview[1](result.data);
                } else {
                    dataOverview[1]({});
                }
            }
        });
        setTitle('Performance Overview');
    }, []);


    let indexCourseSelected = -1;

    if (courses && courses?.length > 1) {
        indexCourseSelected = courses.findIndex(item => (item.id + '') === (urlParam.query.course + ''));
        listSelectCourse.unshift({
            title: 'tất cả khóa học',
            selected: indexCourseSelected === -1,
            action() {
                urlParam.changeQuery({
                    course: 0,
                });
            },
        });
        if (indexCourseSelected === -1) {
            indexCourseSelected = 0;
        } else {
            indexCourseSelected++;
        }
    } else {
        indexCourseSelected = 0;
    }


    return (<>
        <Typography variant='h2' sx={{
            mb: 4, display: 'flex',
            alignItems: 'center',
            '& .MoreButton-root': {
                display: 'flex',
            }
        }}>
            Tổng quan
        </Typography>
        <Grid
            container
            spacing={6}
        >
            {
                courses?.map(item => (
                    <Grid
                        key={item.id}
                        item
                        md={4}
                        xs={12}
                    >
                        <Card>
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="h3">{item.title}</Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Typography variant="overline">Đã đăng ký</Typography>
                                        <Typography variant="h4">{dataOverview[0]['register_' + item.id] ?? 0}</Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Typography variant="overline">Học thử</Typography>
                                        <Typography variant="h4">{dataOverview[0]['trial_' + item.id] ?? 0}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            }
        </Grid>

    </>)
}

export default Overview

export interface EmojiProp {
    emojiId: string,
    image: {
        thumbnails: Array<{
            url: string,
        }>
    },
    searchTerms: string[],
    shortcuts: string[],
}

// {decodeURIComponent('\ud83d\ude2c')}