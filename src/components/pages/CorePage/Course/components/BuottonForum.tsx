import { Box, Button } from '@mui/material';
import Icon from 'components/atoms/Icon';
import DrawerCustom from 'components/molecules/DrawerCustom';
import React from 'react';
import CourseLearningContext from '../context/CourseLearningContext';
import SectionQA from './SectionQA';

function BuottonForum() {

    const courseLearningContext = React.useContext(CourseLearningContext);

    const [open, setOpen] = React.useState(false);

    return (<>
        <Button
            onClick={() => setOpen(true)}
            color='inherit'
            startIcon={<Icon icon="ForumOutlined" />}
            sx={{ textTransform: 'none', fontWeight: 400 }}
        >
            Hỏi đáp {courseLearningContext.course?.title}
        </Button>
        <DrawerCustom
            title={<>
                Hỏi đáp {courseLearningContext.course?.title}
            </>}
            open={open}
            onClose={() => setOpen(false)}
            onCloseOutsite
            width={900}
            restDialogContent={{
                sx: {
                    mt: 3
                }
            }}
        >
            <Box
                sx={{
                    width: '100%',
                }}
            >
                {
                    courseLearningContext.chapterAndLessonCurrent && courseLearningContext.course && open ?
                        <SectionQA chapterAndLessonCurrent={courseLearningContext.chapterAndLessonCurrent} course={courseLearningContext.course} />
                        : null
                }
            </Box>
        </DrawerCustom>
    </>
    )
}

export default BuottonForum