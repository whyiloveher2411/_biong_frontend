import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
                    <Typography component='h2' sx={{
                        lineHeight: 1.3, fontSize: 48, fontWeight: 600,
                        position: 'relative',
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: '100%',
                            width: '100%',
                            left: '0',
                            height: '3px',
                            borderRadius: '2px',
                            background: 'linear-gradient(130deg,#ff7a18,#af002d 41.07%,#319197 76.05%)',
                        }
                    }} variant='h3'>Kiểm tra đầu vào nhận ngay ưu đãi</Typography>

                    <TestKnowledge
                        keyTest={'course/start/' + course.slug}
                        testRule={'course/start/' + course.slug}
                        onSetPoint={onSetPoint}
                        content={() => <></>}
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
                <Typography sx={{ mt: 2, }}>Điểm số &gt;= 95%: giảm {moneyFormat(300000)}</Typography>
                <Typography sx={{ mt: 1, }}>Điểm số &gt;= 85%: giảm {moneyFormat(200000)}</Typography>
                <Typography sx={{ mt: 1, }}>Điểm số &gt;= 75%: giảm {moneyFormat(100000)}</Typography>
                <Typography sx={{ mt: 2, fontWeight: 600, fontStyle: 'italic', fontSize: 18 }}>Lưu ý:</Typography>
                <ul>
                    <li>Bạn chỉ có một lần làm bài kiểm tra đầu vào</li>
                    <li>Chương trình không áp dụng khóa học mua để tặng</li>
                    <li>Số tiền được giảm sẽ hiển thị ở phần giò hàng</li>
                </ul>
            </Box>

        </Box>
    )
}

export default SectionEntryTest