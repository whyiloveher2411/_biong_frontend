import { Box, Button, Link, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import React from 'react'
import { ChapterAndLessonCurrentState, CourseProps } from 'services/courseService';

function SectionResources({ course, chapterAndLessonCurrent }: { course: CourseProps, chapterAndLessonCurrent: ChapterAndLessonCurrentState }) {

    const resources = course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].lessons[chapterAndLessonCurrent.lessonIndex].resources;

    if (Array.isArray(resources) && resources.length) {
        return <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                maxWidth: 800,
                margin: '0 auto',
            }}
        >
            {
                resources.map((item, index) => (
                    <React.Fragment key={index}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            <Typography variant='subtitle1'>
                                {item.title}
                            </Typography>
                            <Typography
                                dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                            {
                                item.type === 'link' &&
                                <Box>
                                    <Link href="#" target='_blank'>
                                        {item.title}
                                    </Link>
                                </Box>
                            }

                            {
                                item.type === 'download' &&
                                <Box>
                                    <Button
                                        variant='outlined'
                                        color='inherit'
                                        onClick={() => {
                                            let elem = document.createElement('iframe');
                                            elem.style.cssText = 'width:0;height:0,top:0;position:fixed;opacity:0;pointer-events:none;visibility:hidden;';
                                            elem.setAttribute('src', getImageUrl(item.file_download));
                                            document.body.appendChild(elem);
                                            setTimeout(() => {
                                                elem.remove();
                                            }, 10000);

                                        }}
                                    >
                                        {item.title}
                                    </Button>
                                </Box>
                            }

                        </Box>
                        {
                            index !== resources.length - 1 &&
                            <Divider color='dark' />
                        }
                    </React.Fragment>
                ))
            }
        </Box>
    }

    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: '0 auto',
            }}
        >
            <Typography align='center' variant='h3' sx={{ mb: 2, mt: 4 }}>{__('Bài học hiện tại không có tài nguyên nào.')}</Typography>
            <Typography align='center'>{__('Các tài nguyên có thể bao gôm source code, tài liệu chính thức, các bài viết hoặc các file cần thiết cho quá trình thực hành')}</Typography>
        </Box>
    )
}

export default SectionResources