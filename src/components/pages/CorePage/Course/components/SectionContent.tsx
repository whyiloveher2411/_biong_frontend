import { AccordionSummary, Box, Button, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import Icon, { IconProps } from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import Dialog from 'components/molecules/Dialog';
import { convertHMS } from 'helpers/date';
import { __ } from 'helpers/i18n';
import React from 'react';
import courseService, { CourseChapterProps, CourseContent, CourseLessonProps, CourseProps, ProcessLearning } from 'services/courseService';
import Video from './SectionLearn/SectionContentType/Video';


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

    if (course?.course_detail?.content) {
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
                    <Typography component='h3' variant='h3'>{__('Nội dung khóa học')}</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 3,
                        }}
                    >
                        <Button color="inherit">
                            {__('{{lectures}} bài học', {
                                lectures: course.course_detail?.content.reduce((prevValue, chapter) => prevValue + chapter.lessons.length, 0)
                            })}</Button>
                        <Button color="inherit">
                            {
                                convertHMS(course.course_detail.total_time)
                            }
                        </Button>
                    </Box>
                </Box>
                <AccordionsChapter courseContent={course.course_detail?.content} type={type} />
            </Box>
        )
    }

    return <></>
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
                border: '1px solid',
                borderColor: 'dividerDark',
            }}
        >
            {
                courseContent.map((item, index) => (
                    <Accordion
                        key={index}
                        expanded={expanded === ('panel' + index)}
                        onChange={handleChange('panel' + index)}
                        disableGutters
                    >
                        <AccordionSummary
                            sx={{
                                backgroundColor: 'divider'
                            }}
                        >
                            <Typography sx={{ width: '75%', flexShrink: 0 }}>
                                {index + 1}. {item.title}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '25%',
                                    flexShrink: 0,
                                }}
                            >
                                <Typography sx={{ color: 'text.secondary' }}>{__('{{lectures}} bài học', {
                                    lectures: item.lessons.length
                                })}</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{convertHMS(item.lessons.reduce((preValue, lesson) => preValue + (parseInt(lesson.time ?? 0) ?? 0), 0))}</Typography>
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
                                    width: '25%',
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
                                <Typography sx={{ color: 'text.secondary' }}>
                                    {convertHMS(item.time)}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))
                }
            </List >
            <Dialog
                title={__('Preview')}
                open={openDialog !== null}
                onClose={() => setOpenDialog(null)}
                style={{ padding: 0, borderTop: 0, borderBottom: 0 }}
                maxWidth='md'
            >
                {
                    openDialog !== null && process ?
                        <Video
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
                                height: '500px',
                                background: 'rgb(0 0 0/1)',
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