import { AccordionSummary, Box, Button, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import Icon, { IconProps } from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import Dialog from 'components/molecules/Dialog';
import NoticeContent from 'components/molecules/NoticeContent';
import { convertHMS } from 'helpers/date';
import { __ } from 'helpers/i18n';
import React from 'react';
import courseService, { CourseChapterProps, CourseContent, CourseLessonProps, CourseProps, ProcessLearning } from 'services/courseService';
import Preview from './preview/Preview';


function SectionContent({
    course,
    type
}: {
    course: CourseProps | null,
    type: {
        [key: string]: {
            title: string,
            icon: IconProps
        }
    }
}) {

    if (course?.course_detail?.content?.length) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography sx={{ fontSize: 16, fontWeight: 400 }}>
                        {__('{{chapterCount}} chương, {{lessonCount}} bài học', {
                            chapterCount: course.course_detail?.content.length ?? 0,
                            lessonCount: course.course_detail?.content.reduce((prevValue, chapter) => prevValue + chapter.lessons.length, 0),
                        })}
                    </Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 400 }}>
                        {
                            convertHMS(course.course_detail.total_time, true, true, false, ' ')
                        }
                    </Typography>
                </Box>
                <AccordionsChapter courseContent={course.course_detail?.content} type={type} />
            </Box>
        )
    }

    return <Box
        sx={{
            border: '1px solid',
            borderColor: 'dividerDark',
            p: 3
        }}
    >
        <Typography variant='h3' sx={{ mb: 2 }}>{__('Nội dung đang được cập nhật')}</Typography>
        <Typography>{__('Tất cả khóa học bắt buộc phải được cập nhật nội dung mới trong vòng 2 năm, nếu không sẽ bắt buộc đóng khóa học. Quy định này nhằm đảm bảo nội dung khóa học sẽ luôn được cập nhật nội dung mới nhất. Hãy tham khảo thêm "Nhật ký thay đổi" để biết những thay đổi của khóa học.')}</Typography>
    </Box>
}

export default SectionContent

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: 0,
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

function AccordionsChapter({ courseContent, type }: {
    courseContent: CourseContent,
    type: JsonFormat
}) {
    const [expanded, setExpanded] = React.useState<string | false>('panel-1');
    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
            }}
        >
            {
                courseContent.map((item, index) => (
                    <Accordion
                        key={index}
                        expanded={expanded === ('panel' + index)}
                        onChange={handleChange('panel' + index)}
                        disableGutters
                        sx={{
                            boxShadow: 'none',
                            border: '1px solid',
                            borderColor: 'dividerDark',
                            '&.Mui-expanded .icon-expanded': {
                                transform: 'rotate(90deg)',
                            }
                        }}
                    >
                        <AccordionSummary
                            sx={{
                                minHeight: 72,
                            }}
                        >
                            <Typography sx={{ width: '65%', flexShrink: 0, display: 'flex', alignItems: 'center', fontSize: 16 }}>
                                <Icon className="icon-expanded" sx={{ mr: 2, transition: 'all 300ms', fontSize: 18 }} icon="ArrowForwardIosRounded" /> {item.title}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    width: '35%',
                                    flexShrink: 0,
                                }}
                            >
                                <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500, }}>{__('{{lectures}} bài học', {
                                    lectures: item.lessons.length
                                })}</Typography>
                                <Typography variant='subtitle2' noWrap sx={{ color: 'text.secondary', fontSize: 14, }}>{convertHMS(item.lessons.reduce((preValue, lesson) => preValue + (parseInt(lesson.time ?? 0) ?? 0), 0), true, true, false, ' ')}</Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <AccordionsLesson type={type} lessions={item.lessons} />
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </Box>
    );
}



function AccordionsLesson({ lessions, type }: {
    lessions: CourseChapterProps['lessons'],
    type: JsonFormat,
}) {

    const [openDialog, setOpenDialog] = React.useState<CourseLessonProps | null>(null);

    const [process, setProcess] = React.useState<ProcessLearning | null>(null);

    React.useEffect(() => {

        if (openDialog !== null) {
            (async () => {

                let process = await courseService.getLessonPreview(openDialog);

                setProcess(process);
            })();
        }

    }, [openDialog]);

    return (
        <>
            <List>
                {
                    lessions.length > 0 ?
                        lessions.map((item, index) => (
                            <ListItem
                                key={index}
                            >
                                <ListItemIcon>
                                    <Icon icon={type[item.type]?.icon} />
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.title}
                                />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '35%',
                                        flexShrink: 0,
                                    }}
                                >
                                    <div>
                                        {
                                            Boolean(item.is_public) &&
                                            <Button
                                                color='success'
                                                sx={{ mr: 2 }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setOpenDialog(item);
                                                    setProcess(null);
                                                }}
                                            >
                                                {__('Xem trước')}
                                            </Button>
                                        }
                                    </div>
                                    <Typography noWrap sx={{ color: 'text.secondary' }}>
                                        {convertHMS(item.time, true, true, true, ' ')}
                                    </Typography>
                                </Box>
                            </ListItem>
                        ))
                        :
                        <NoticeContent
                            title={__('Nội dung đang cập nhật')}
                            description=''
                            image='/images/undraw_no_data_qbuo.svg'
                            disableButtonHome
                        />
                }
            </List >
            <Dialog
                title={__('Xem trước')}
                open={openDialog !== null}
                onClose={() => setOpenDialog(null)}
                style={{ padding: 0, borderTop: 0, borderBottom: 0 }}
                maxWidth='md'
            >
                {
                    openDialog !== null && process ?
                        <Preview
                            lesson={openDialog}
                            process={process}
                            style={{
                                ['--maxHeight' as string]: '500px'
                            }}
                        />
                        :
                        <Box
                            sx={{
                                textAlign: 'center',
                                width: '100%',
                                height: '364px',
                                // background: 'rgb(0 0 0/1)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Loading open={true} isWarpper={true} />
                        </Box>
                }
            </Dialog>
        </>
    );
}