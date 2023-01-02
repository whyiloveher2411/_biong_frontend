import { Button } from "@mui/material";
import Icon from "components/atoms/Icon";
import MoreButton from "components/atoms/MoreButton";
import Typography from "components/atoms/Typography";
import useQuery from "hook/useQuery";
import useCourse from "../../useCourse";
import CardContent from "components/atoms/CardContent";
import Card from "components/atoms/Card";

function Overview() {

    const { courses } = useCourse();


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
            <MoreButton
                actions={[listSelectCourse]}
            >
                <Button
                    endIcon={<Icon icon="ExpandMoreOutlined" />}
                    sx={{
                        fontSize: 'inherit',
                        padding: 0,
                        marginLeft: 3,
                        textTransform: 'initial',
                        color: 'inherit',
                        lineHeight: 'unset',
                    }}
                >
                    {
                        listSelectCourse[indexCourseSelected]?.title ?? '...'
                    }
                </Button>
            </MoreButton>
        </Typography>
        <Card>
            <CardContent>
                <Typography variant="h3">Tiến độ học tập</Typography>
            </CardContent>
        </Card>
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