import { Box, Theme, Typography } from '@mui/material';
import makeCSS from 'components/atoms/makeCSS';
import { dateFormat } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { CourseProps } from 'services/courseService';

const useStyle = makeCSS((theme: Theme) => ({
    rootContent: {
        lineHeight: '28px',
        color: theme.palette.text.primary,
        paddingLeft: 16,
        fontSize: 16,
        letterSpacing: '0.5px',
        '&>p': {
            marginTop: 8,
            marginBottom: 8,
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
    const length = course?.course_detail?.changelog?.length ?? 0;

    if (course) {
        return (
            course.course_detail?.changelog?.length ?
                <Box
                    sx={{
                        maxWidth: 800,
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        p: 3,
                        border: '1px solid',
                        borderColor: 'dividerDark',
                        borderRadius: 1,
                        backgroundColor: 'background.paper',
                    }}
                >
                    {
                        course.course_detail?.changelog?.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    pb: 3,
                                    borderBottom: '1px solid',
                                    borderColor: length && (index + 1) != length ? 'dividerDark' : 'transparent',
                                }}
                            >
                                <Typography variant='subtitle1'>{dateFormat(item.time)}</Typography>
                                <Box className={classes.rootContent} dangerouslySetInnerHTML={{ __html: item.content }} />
                            </Box>
                        ))
                    }
                </Box>
                :
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
                        backgroundColor: 'background.paper',
                    }}
                >
                    <Typography variant='h3'>{__('Nội dung đang được cập nhật')}</Typography>
                    <Typography>{__('Các khóa học sẽ được sữa đổi nội dung cũ hoặc thêm nội dung mới tùy thuộc vào giảng viên, việc cập nhật mới sẽ giúp bạn tiếp cận với các nội dung mới hơn.')}</Typography>
                </Box>
        )
    }

    return null;

}

export default SectionChangelog