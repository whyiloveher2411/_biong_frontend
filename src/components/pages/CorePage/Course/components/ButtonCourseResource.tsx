import { Badge, Box, Button, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import MenuPopper from 'components/atoms/MenuPopper';
import React from 'react';
import CourseLearningContext from '../context/CourseLearningContext';
import { Link } from 'react-router-dom';
import { downloadFileInServer } from 'helpers/file';

function ButtonCourseResource() {

    const courseLearningContext = React.useContext(CourseLearningContext);

    const [anchorEl, setAnchorEl] = React.useState<undefined | HTMLElement>(undefined);

    return (<>
        <Badge
            badgeContent={courseLearningContext.isPurchased ?
                courseLearningContext.course?.course_detail?.resources?.length :
                courseLearningContext.course?.course_detail?.resources?.filter(item => !item.is_private).length
            }
            color="secondary"
        >
            <Button
                color='inherit'
                startIcon={<Icon icon="DownloadRounded" />}
                sx={{ textTransform: 'none', fontWeight: 400 }}
                onClick={(event) => setAnchorEl(event.currentTarget)}
            >
                Tài nguyên
            </Button>
        </Badge>
        <MenuPopper
            style={{ zIndex: 1032 }}
            open={anchorEl !== undefined}
            onClose={() => setAnchorEl(undefined)}
            anchorEl={anchorEl}
            paperProps={{
                className: 'custom_scroll',
                sx: {
                    border: '1px solid',
                    borderColor: 'dividerDark',
                    mt: 1,
                }
            }}
        >
            <Box sx={{
                maxWidth: '100%',
                width: 350,
                p: 2,
                pt: 3,
                pb: 3,
                display: 'flex',
                gap: 1.5,
                flexDirection: 'column',
            }}>
                {
                    courseLearningContext.course?.course_detail?.resources?.length ? <>
                        <Typography sx={{ mb: 1 }} variant='h3'>Tài nguyên khóa học</Typography>
                        {
                            courseLearningContext.course?.course_detail?.resources.map((item, index) => (
                                !item.is_private || courseLearningContext.isPurchased ?
                                    item.type === 'download' ?
                                        <Typography
                                            key={index}
                                            onClick={() => {
                                                downloadFileInServer(
                                                    courseLearningContext.course?.id ?? 0,
                                                    courseLearningContext.chapterAndLessonCurrent?.chapterID ?? 0,
                                                    courseLearningContext.chapterAndLessonCurrent?.chapterIndex ?? 0,
                                                    courseLearningContext.chapterAndLessonCurrent?.lessonID ?? 0,
                                                    courseLearningContext.chapterAndLessonCurrent?.lessonIndex ?? 0,
                                                    index,
                                                    'resource_course'
                                                );
                                            }}
                                            sx={(theme) => ({
                                                color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    opacity: 0.7,
                                                    textDecoration: 'underline',
                                                }
                                            })}>{item.title}</Typography>
                                        :
                                        item.type === 'link' ?
                                            <Typography
                                                key={index}
                                                target='_blank'
                                                component={Link}
                                                to={item.link ?? '#'}
                                                sx={(theme) => ({
                                                    cursor: 'pointer',
                                                    color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
                                                    textDecoration: 'underline', '&:hover': {
                                                        opacity: 0.7,
                                                        textDecoration: 'underline',
                                                    }
                                                })}>{item.title}</Typography>
                                            :
                                            null
                                    :
                                    <React.Fragment key={index} />

                            ))
                            //     courseLearningContext.course.course_detail.resources.map((item, index) => (
                            // <Typography key={index} target='_blank' component={Link} to={item.link} sx={{
                            //     color: 'primary.light', textDecoration: 'underline', '&:hover': {
                            //         opacity: 0.7,
                            //         textDecoration: 'underline',
                            //     }
                            // }}>{item.title}</Typography>
                            // ))
                        }
                    </>
                        :
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 3,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                p: 2
                            }}
                        >
                            <ImageLazyLoading
                                src='/images/undraw_no_data_qbuo.svg'
                                sx={{
                                    maxWidth: '100%',
                                    width: 'auto',
                                    height: '120px'
                                }}
                            />
                            <Typography align='center' sx={{ color: 'text.secondary' }} variant='h4'>Không tìm tài nguyên</Typography>
                        </Box>
                }
            </Box>
        </MenuPopper>
    </>
    )
}

export default ButtonCourseResource



// function Notification({ title, description }: { index: number, title: string, description: string, activeOnclick: boolean }) {
//     return <>
//         <Typography variant='h6'>
//             {title}
//         </Typography>
//         <Box
//             dangerouslySetInnerHTML={{ __html: description }}
//         />
//     </>
// }

// function ResourceLink({ title, description, link, activeOnclick }: { index: number, title: string, description?: string, link: string, activeOnclick: boolean }) {
//     return (
//         description ?
//             <>
//                 <Typography variant='h6'>
//                     {title}
//                 </Typography>
//                 <Box
//                     dangerouslySetInnerHTML={{ __html: description }}
//                 />
//                 <Box>
//                     <Link href={activeOnclick ? link : '#'} target='_blank'>
//                         {title}
//                     </Link>
//                 </Box>
//             </>
//             :
//             <Box
//                 sx={{
//                     display: 'flex',
//                     gap: 1,
//                     alignItems: 'center',
//                 }}
//             >
//                 <Typography variant='h6'>
//                     {title}
//                 </Typography>
//                 -
//                 <Box>
//                     <Link href={activeOnclick ? link : '#'} rel="nofollow" target='_blank'>
//                         Visit
//                     </Link>
//                 </Box>
//             </Box>
//     );
// }

// function ResourceDownload({ index, course, title, description, file_download, chapterAndLessonCurrent, activeOnclick }: { index: number, course: CourseProps, title: string, description?: string, file_download: string, chapterAndLessonCurrent: ChapterAndLessonCurrentState, activeOnclick: boolean }) {
//     return (

//         description ?
//             <>
//                 <Typography variant='h6'>
//                     {title}
//                 </Typography>
//                 <Box
//                     dangerouslySetInnerHTML={{ __html: description }}
//                 />
//                 <Box>
//                     <Button
//                         variant='outlined'
//                         color='inherit'
//                         startIcon={activeOnclick ? <Icon icon="CloudDownloadOutlined" /> : <Icon icon="LockOutlined" />}
//                         sx={{
//                             cursor: activeOnclick ? 'pointer' : 'not-allowed',
//                         }}
//                         onClick={() => {
//                             if (activeOnclick) {
//                                 downloadFileInServer(
//                                     course.id,
//                                     chapterAndLessonCurrent.chapterID,
//                                     chapterAndLessonCurrent.chapterIndex,
//                                     chapterAndLessonCurrent.lessonID,
//                                     chapterAndLessonCurrent.lessonIndex,
//                                     index
//                                 );
//                             }
//                         }}
//                     >
//                         Download
//                     </Button>
//                 </Box>
//             </>
//             :
//             <Box
//                 sx={{
//                     display: 'flex',
//                     gap: 1,
//                     alignItems: 'center',
//                 }}
//             >
//                 <Typography variant='h6'>
//                     {title}
//                 </Typography>
//                 -
//                 <Box>
//                     <Button
//                         variant='outlined'
//                         color='inherit'
//                         startIcon={activeOnclick ? <Icon icon="CloudDownloadOutlined" /> : <Icon icon="LockOutlined" />}
//                         sx={{
//                             cursor: activeOnclick ? 'pointer' : 'not-allowed',
//                         }}
//                         onClick={() => {
//                             if (activeOnclick) {
//                                 downloadFileInServer(
//                                     course.id,
//                                     chapterAndLessonCurrent.chapterID,
//                                     chapterAndLessonCurrent.chapterIndex,
//                                     chapterAndLessonCurrent.lessonID,
//                                     chapterAndLessonCurrent.lessonIndex,
//                                     index
//                                 );
//                             }
//                         }}
//                     >
//                         Download
//                     </Button>
//                 </Box>
//             </Box>
//     );
// }
