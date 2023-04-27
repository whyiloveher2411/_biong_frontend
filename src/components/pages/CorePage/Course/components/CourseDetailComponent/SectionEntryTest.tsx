import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Icon from "components/atoms/Icon";
import IconBit from "components/atoms/IconBit";
import InfoUseBit from "components/molecules/InfoUseBit";
import { moneyFormat } from "plugins/Vn4Ecommerce/helpers/Money";
import TestKnowledge from "plugins/Vn4Test/TestKnowledge";
import { CourseProps } from "services/courseService";

function SectionEntryTest({ course, onSetPoint, id }: {
    course: CourseProps,
    id?: string,
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
                    <Typography sx={{ color: 'text.secondary', }}>Kiểm tra đầu vào</Typography>
                    <Typography component='h2' sx={(theme) => ({
                        lineHeight: 1.3, fontSize: 48, fontWeight: 600,
                        '& .code-highlight': {
                            '--color': theme.palette.mode === 'light' ? '#ffd9fc' : '#a3299a',
                        }
                    })} variant='h3'>
                        <span className="code-highlight">Kiểm</span> <span className="code-highlight">tra</span> <span className="code-highlight">đầu</span> <span className="code-highlight">vào</span> <span className="code-highlight">nhận</span> <span className="code-highlight">ngay</span> <span className="code-highlight">ưu</span> <span className="code-highlight">đãi</span>
                    </Typography>

                    <TestKnowledge
                        keyTest={'course/start/' + course.slug}
                        title="Kiểm tra đầu vào"
                        testRule={'course/start/' + course.slug}
                        onSetPoint={onSetPoint}
                        content={() => <></>}
                        renderAfterSummary={(handleResetTest) => <Box>
                            <InfoUseBit
                                bit={100}
                                title='Làm lại bài kiểm tra'
                                description='Sử dụng bit của bạn để làm lại bài kiểm tra đầu vào'
                                reason={'make/test-again/' + (new Date()).getTime()}
                                callback={handleResetTest}
                                labelButton="Làm lại ngay với"
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
                                    Kiểm tra lại với <Icon sx={{ ml: 1, mr: 1, opacity: 1 }} icon={IconBit} /> 40
                                </Button>}
                            />
                        </Box>}
                    />

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
                <Typography sx={{ mt: 1, fontSize: 16 }}>Kiểm tra kiến thức cơ bản trước khi vào học, nhanh chóng và tiện lợi. Ngoài ra bạn có thể nhận được các khuyến mãi nếu bài kiểm tra của bạn đủ điều kiện sau:</Typography>
                <Typography sx={{ mt: 2, }}>Điểm số &gt;= 95%: giảm <Box component='span' sx={{ fontWeight: 600, color: 'error.main' }}>{moneyFormat(300000)}</Box></Typography>
                <Typography sx={{ mt: 1, }}>Điểm số &gt;= 85%: giảm <Box component='span' sx={{ fontWeight: 600, color: 'error.main' }}>{moneyFormat(200000)}</Box></Typography>
                <Typography sx={{ mt: 1, }}>Điểm số &gt;= 75%: giảm <Box component='span' sx={{ fontWeight: 600, color: 'error.main' }}>{moneyFormat(100000)}</Box></Typography>
                <Typography sx={{ mt: 2, fontWeight: 600, fontStyle: 'italic', fontSize: 18 }}>Lưu ý:</Typography>
                <ul style={{ paddingLeft: 16 }}>
                    <li>Bạn chỉ có một lần miễn phí làm bài kiểm tra đầu vào</li>
                    <li>Chương trình không áp dụng khóa học mua để tặng</li>
                    <li>Số tiền được giảm sẽ hiển thị ở phần giò hàng</li>
                </ul>
            </Box>

        </Box>
    )
}

export default SectionEntryTest