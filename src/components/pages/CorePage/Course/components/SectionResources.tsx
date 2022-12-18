import { Box, Button, Link, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import React from 'react';
import { ChapterAndLessonCurrentState, CourseProps } from 'services/courseService';

function SectionResources({ course, chapterAndLessonCurrent }: { course: CourseProps, chapterAndLessonCurrent: ChapterAndLessonCurrentState }) {

    const lesson = course.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].lessons[chapterAndLessonCurrent.lessonIndex];

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
                    <Box
                        key={lesson?.id + ' ' + index}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >

                        {(() => {

                            if (item.type === 'link') {
                                return <ResourceLink link={item.link ?? '#'} title={item.title} description={item.description} />
                            }

                            if (item.type === 'download') {
                                return <ResourceDownload file_download={item.file_download ?? ''} title={item.title} description={item.description} />
                            }

                            return <Notification title={item.title} description={item.description} />

                        })()}
                    </Box>
                ))
            }
        </Box>
    }

    return (
        <Box
            sx={{
                maxWidth: 800,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 3,
                border: '1px solid',
                borderColor: 'dividerDark',
            }}
        >
            <Typography variant='h3'>{__('Bài học hiện tại không có tài nguyên nào.')}</Typography>
            <Typography >{__('Các tài nguyên có thể bao gôm source code, tài liệu chính thức, các bài viết hoặc các file cần thiết cho quá trình thực hành')}</Typography>
        </Box>
    )
}

export default SectionResources

function Notification({ title, description }: { title: string, description: string }) {
    return <>
        <Typography variant='h5'>
            {title}
        </Typography>
        <Box
            dangerouslySetInnerHTML={{ __html: description }}
        />
    </>
}

function ResourceLink({ title, description, link }: { title: string, description?: string, link: string }) {
    return (
        description ?
            <>
                <Typography variant='h5'>
                    {title}
                </Typography>
                <Box
                    dangerouslySetInnerHTML={{ __html: description }}
                />
                <Box>
                    <Link href="#" target='_blank'>
                        {title}
                    </Link>
                </Box>
            </>
            :
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <Typography variant='h5'>
                    {title}
                </Typography>
                -
                <Box>
                    <Link href={link} rel="nofollow" target='_blank'>
                        Visit
                    </Link>
                </Box>
            </Box>
    );
}

function ResourceDownload({ title, description, file_download }: { title: string, description?: string, file_download: string }) {
    return (

        description ?
            <>
                <Typography variant='h5'>
                    {title}
                </Typography>
                <Box
                    dangerouslySetInnerHTML={{ __html: description }}
                />
                <Box>
                    <Button
                        variant='outlined'
                        color='inherit'
                        onClick={() => {

                            const href = getImageUrl(file_download);
                            let link = document.createElement("a");
                            let names = (href?.split("/") || []);
                            let name = names[names?.length - 1];
                            link.setAttribute('download', name);
                            link.href = href;
                            document.body.appendChild(link);
                            link.click();
                            link.remove();

                            // let elem = document.createElement('iframe');
                            // elem.style.cssText = 'width:0;height:0,top:0;position:fixed;opacity:0;pointer-events:none;visibility:hidden;';
                            // elem.setAttribute('src', getImageUrl(file_download));
                            // document.body.appendChild(elem);
                            // setTimeout(() => {
                            //     elem.remove();
                            // }, 10000);

                        }}
                    >
                        Download
                    </Button>
                </Box>
            </>
            :
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <Typography variant='h5'>
                    {title}
                </Typography>
                -
                <Box>
                    <Button
                        variant='outlined'
                        color='inherit'
                        startIcon={<Icon icon="CloudDownloadOutlined" />}
                        onClick={() => {

                            const href = getImageUrl(file_download);
                            let link = document.createElement("a");
                            let names = (href?.split("/") || []);
                            let name = names[names?.length - 1];
                            link.setAttribute('download', name);
                            link.href = href;
                            document.body.appendChild(link);
                            link.click();
                            link.remove();


                            // let elem = document.createElement('iframe');
                            // elem.style.cssText = 'width:0;height:0,top:0;position:fixed;opacity:0;pointer-events:none;visibility:hidden;';
                            // elem.setAttribute('src', getImageUrl(file_download));
                            // document.body.appendChild(elem);
                            // setTimeout(() => {
                            //     elem.remove();
                            // }, 10000);

                        }}
                    >
                        Download
                    </Button>
                </Box>
            </Box>
    );
}
