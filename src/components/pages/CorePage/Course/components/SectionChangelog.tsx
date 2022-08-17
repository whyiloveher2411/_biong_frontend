import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Box, Theme, Typography } from '@mui/material';
import makeCSS from 'components/atoms/makeCSS';
import { dateFormat } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { CourseProps } from 'services/courseService';

const useStyle = makeCSS((theme: Theme) => ({
    rootContent: {
        lineHeight: '26px',
        color: theme.palette.text.primary,
        marginTop: 14,
        '&>p:first-child': {
            marginTop: 0,
        },
        '& *': {
            maxWidth: '100%',
        },
        '& img': {
            height: 'auto',
        },
    },
    logTime: {
        flex: '0.5',
    },
}));

function SectionChangelog({ course }: {
    course: CourseProps | null
}) {

    const classes = useStyle();

    if (course) {
        return (
            <Box>
                {
                    course.course_detail?.changelog?.length ?
                        <Timeline position="right">
                            {
                                course.course_detail?.changelog?.map((item, index) => (
                                    <TimelineItem
                                        key={index}
                                    >
                                        <TimelineOppositeContent className={classes.logTime} color="text.secondary">
                                            {dateFormat(item.time)}
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot />
                                            {
                                                index !== 0 &&
                                                <TimelineConnector />
                                            }
                                        </TimelineSeparator>

                                        <TimelineContent
                                            sx={{
                                                mb: 2,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                mt: 0.5,
                                            }}
                                        >
                                            <Typography variant='h5'>{item.title}</Typography>
                                            <div className={classes.rootContent} dangerouslySetInnerHTML={{ __html: item.content }} />
                                        </TimelineContent>
                                    </TimelineItem>
                                )).reverse()
                            }
                        </Timeline>
                        :
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                p: 3,
                                border: '1px solid',
                                borderColor: 'dividerDark',
                            }}
                        >
                            <Typography variant='h3'>{__('Nội dung đang được cập nhật')}</Typography>
                            <Typography>{__('Các khóa học sẽ được sữa đổi nội dung cũ hoặc thêm nội dung mới tùy thuộc vào tình hình hiện tại, việc cập nhật mới sẽ giúp bạn tiếp cận với các nội dung mới phù hợp với hiện tại.')}</Typography>
                        </Box>
                }
            </Box>
        )
    }

    return null;

}

export default SectionChangelog