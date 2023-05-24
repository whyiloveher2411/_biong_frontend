import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Icon from "components/atoms/Icon";
import IconBit from "components/atoms/IconBit";
import InfoUseBit from "components/molecules/InfoUseBit";
import TestKnowledge from "plugins/Vn4Test/TestKnowledge";
import { CourseProps } from "services/courseService";
import ButtonBuy from "./CourseDetailComponent/ButtonBuy";

function SectionExitTest({ course, onSetPoint, id, isPurchased }: {
    course: CourseProps,
    id?: string,
    isPurchased: boolean,
    onSetPoint?: (point: {
        point: number,
        total_point: number,
        is_continue: boolean,
        is_create: boolean,
    }) => void
}) {
    return (
        <Box
            id={id}
            sx={(theme) => ({
                display: 'flex',
                position: 'relative',
                ml: -2,
                mr: -2,
                maxWidth: 1110,
                margin: '0 auto',
                [theme.breakpoints.down('md')]: {
                    flexDirection: 'column',
                }
            })}
        >
            <Box
                sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    pt: 7,
                    pb: 7,
                    pr: 5,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    flex: 1,
                    [theme.breakpoints.down('md')]: {
                        alignItems: 'flex-start',
                        pr: 0,
                        pb: 0,
                    }
                })}
            >
                <Box
                    sx={{
                        zIndex: 1,
                        '& .test-now': {
                            pl: 0,
                            pr: 0,
                        }
                    }}
                >
                    <Typography sx={{ color: 'text.secondary', }}>Kiểm tra đầu ra</Typography>
                    <Typography component='h2' sx={(theme) => ({
                        lineHeight: 1.3, fontSize: 48, fontWeight: 600,
                        '& .code-highlight': {
                            '--color': theme.palette.mode === 'light' ? '#ffd9fc' : '#a3299a',
                        }
                    })} variant='h3'>
                        <span className="code-highlight">Kiểm</span> <span className="code-highlight">tra</span> <span className="code-highlight">đầu</span> <span className="code-highlight">ra</span> <span className="code-highlight">hoàn</span> <span className="code-highlight">thành</span> <span className="code-highlight">khóa</span> <span className="code-highlight">học</span>
                    </Typography>
                    {
                        isPurchased ?
                            <TestKnowledge
                                keyTest={'course/exit/' + course.slug}
                                title="Kiểm tra đầu ra"
                                testRule={'course/exit/' + course.slug}
                                onSetPoint={onSetPoint}
                                content={() => <></>}
                                renderAfterSummary={(handleResetTest) => <Box>
                                    <InfoUseBit
                                        bit={100}
                                        title='Làm lại bài kiểm tra'
                                        description='Sử dụng Bit của bạn để làm lại bài kiểm tra đầu ra'
                                        reason={'make/test-again/' + (new Date()).getTime()}
                                        labelButton="Làm lại ngay với"
                                        callback={handleResetTest}
                                        button={(onOpen) => <Button
                                            size='large'
                                            color='primary'
                                            variant='outlined'
                                            sx={{
                                                pr: 5,
                                                pl: 5,
                                                mt: 3,
                                            }}
                                            onClick={() => {
                                                onOpen();
                                            }}
                                        >
                                            Kiểm tra lại với <Icon sx={{ ml: 1, mr: 1, opacity: 1 }} icon={IconBit} /> 100
                                        </Button>}
                                    />
                                </Box>}
                            /> : <Box
                                sx={{
                                    mt: 3,
                                }}
                            >
                                <ButtonBuy
                                    course={course}
                                    isPurchased={isPurchased}
                                    disableAccessCourse
                                />
                            </Box>
                    }
                </Box>
            </Box>
            <Box
                sx={(theme) => ({
                    margin: '0 auto',
                    pl: 10,
                    pt: 7,
                    pb: 7,
                    flex: 1,
                    [theme.breakpoints.down('md')]: {
                        pl: 0,
                        pt: 0,
                        pb: 4,
                    }
                })}
            >
                <Typography variant="h4" sx={{ mt: 4, mb: 3, lineHeight: 1.5 }}>Bạn đã trãi qua quá trình học tập kiên trì, bây giờ là lúc bạn có thể ôn tập lại kiến thức trước khi hoàn thành và đánh giá khóa học nhé!</Typography>
            </Box>

        </Box>
    )
}

export default SectionExitTest