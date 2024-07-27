import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded';
import HttpsRoundedIcon from '@mui/icons-material/HttpsRounded';
import LoopRoundedIcon from '@mui/icons-material/LoopRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import Page from 'components/templates/Page';
import React from 'react';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';

const contentPremium: Array<{
    title: string,
    content: string,
    icon: React.ReactNode,
}> = [
        {
            title: 'Hỗ trợ từ mentor AI',
            content: 'Khi đăng ký gói cao cấp trên website học lập trình của chúng tôi, bạn sẽ nhận được sự hỗ trợ đặc biệt từ "Mentor AI". Đây là một trong những tính năng nổi bật nhất mà chúng tôi cung cấp, giúp bạn nâng cao kỹ năng và kiến thức lập trình một cách hiệu quả và tiện lợi.',
            icon: <MemoryOutlinedIcon sx={{ fontSize: 22 }} />
        },
        {
            title: 'Truy cập vào nội dung cao cấp',
            content: 'Có được quyền truy cập độc quyền vào bộ sưu tập nội dung cao cấp mới nhất và ngày càng phát triển của chúng tôi, chẳng hạn như câu hỏi, thẻ Khám phá và giải pháp cao cấp. Giải thích chi tiết được viết bởi đội ngũ chuyên gia về thuật toán và cấu trúc dữ liệu của chúng tôi.',
            icon: <HttpsRoundedIcon sx={{ fontSize: 22 }} />
        },
        {
            title: 'Khóa học trả phí chuyên sâu',
            content: 'Bạn sẽ nhận được rất nhiều lợi ích đặc biệt và một trong số đó là quyền truy cập vào toàn bộ "Khóa học trả phí chuyên sâu". Đây là những khóa học được thiết kế dành riêng cho những ai muốn nâng cao kỹ năng lập trình của mình lên một tầm cao mới.',
            icon: <MenuBookOutlinedIcon sx={{ fontSize: 22 }} />
        },
        {
            title: 'Chọn câu hỏi theo công ty',
            content: 'Nhắm mục tiêu học tập của bạn chính xác hơn để đạt được công việc mơ ước của bạn. Tìm hiểu những công ty đặt câu hỏi cụ thể. Chúng tôi có gần 200 câu hỏi chỉ từ Google.',
            icon: <AccountBalanceRoundedIcon sx={{ fontSize: 22 }} />
        },
        {
            title: 'Sắp xếp câu hỏi theo mức độ phổ biến',
            content: 'Tìm hiểu những câu hỏi nào xuất hiện thường xuyên nhất trong các cuộc phỏng vấn để bạn biết nên tập trung vào việc học cá nhân của mình ở đâu. Dữ liệu vô giá được thu thập từ hàng ngàn mẫu.',
            icon: <SortRoundedIcon sx={{ fontSize: 22 }} />
        },
        {
            title: 'Tăng tốc độ thực thi tiết kiệm thời gian',
            content: 'Tận hưởng tốc độ thực thi code nhanh hơn đáng kể so với tài khoản thông thường, giúp bạn debug nhanh chóng, thử nghiệm nhiều giải pháp, và giải quyết nhiều bài toán hơn trong cùng thời gian. Tiết kiệm thời gian quý báu, tối ưu hóa quá trình học tập, và chuẩn bị tốt hơn cho các thử thách lập trình phía trước.',
            icon: <FastForwardRoundedIcon sx={{ fontSize: 22 }} />
        },
        {
            title: 'không giới hạn số lượng phiên học tập',
            content: 'Tối ưu hóa quá trình học và luyện tập coding của bạn với LeetCode Premium. Tính năng phiên làm bài không giới hạn cho phép bạn: Bắt đầu vòng luyện tập mới bất cứ lúc nào, không bị giới hạn số lượng.',
            icon: <LoopRoundedIcon sx={{ fontSize: 22 }} />
        },
        {
            title: 'Hỗ trợ nhanh chống từ mentor',
            content: 'Nhận được phản hồi chi tiết và hướng dẫn cá nhân hóa để vượt qua các thử thách coding khó khăn. Tiếp cận nhanh chóng với các chuyên gia trong ngành',
            icon: <QuizRoundedIcon sx={{ fontSize: 22 }} />
        }
    ];


const contentFaqs: Array<{
    title: string,
    content: string
}> = [
        {
            title: 'Tôi nhận được gì khi đăng ký trả phí?',
            content: 'Ngoài các câu hỏi/bài viết miễn phí, bạn sẽ có quyền truy cập vào các câu hỏi/bài viết cao cấp độc quyền. Bạn cũng sẽ có thể nhóm các câu hỏi theo công ty và thực hành đánh giá dựa trên một công ty cụ thể. Bạn cũng sẽ có quyền truy cập vào các tính năng như tự động hoàn thành, trình gỡ lỗi và đánh giá nhanh để giúp bạn thực hành hiệu quả hơn.'
        },
        {
            title: 'Giải pháp cao cấp là gì? Tôi có thể xem mẫu được không?',
            content: 'LeetCode cung cấp các giải pháp chính thức chất lượng cao cho nhiều vấn đề của chúng tôi. Một số giải pháp này chỉ dành cho những người đăng ký trả phí. Bạn có thể xem một bài viết mẫu ở đây miễn phí. Chúng tôi liên tục bổ sung các giải pháp mới.'
        },
        {
            title: 'Làm thế nào để bạn nhóm các câu hỏi theo công ty?',
            content: 'Chúng tôi tổng hợp danh sách các câu hỏi do các công ty cụ thể đặt ra dựa trên dữ liệu từ khảo sát người dùng: ví dụ: "Bạn đã thấy câu hỏi này trong một cuộc phỏng vấn thực tế chưa?" Những danh sách này được cập nhật thường xuyên với dữ liệu khảo sát ngày càng tăng của chúng tôi. Bạn có thể tìm thấy danh sách các công ty trên trang Danh sách vấn đề.'
        },
        {
            title: 'Tôi đã nhấp vào nút đăng ký, điền thông tin thẻ tín dụng của mình và nhấp vào "Thêm phương thức thanh toán". Tôi vẫn không có quyền truy cập vào bất kỳ tính năng cao cấp nào.',
            content: 'Bạn có thể truy cập trang đăng ký của mình để xác nhận đăng ký. Vui lòng kiểm tra lịch sử thanh toán của bạn để đảm bảo giao dịch được thực hiện. Nếu bạn không thấy giao dịch mới, thẻ của bạn có thể đã bị từ chối. Vui lòng thử đăng ký lại bằng thẻ ghi nợ/thẻ tín dụng khác hoặc liên hệ với ngân hàng của bạn để biết thêm thông tin. Hãy liên hệ với chúng tôi nếu bạn'
        },
        {
            title: 'Nếu tôi đăng ký và muốn hủy thì sao?',
            content: 'Bạn có thể hủy đăng ký tại đây bất cứ lúc nào. Sau khi hủy, đăng ký của bạn sẽ vẫn hoạt động cho đến hết giai đoạn hiện tại.',
        },
        
    ];
function index() {
    return (
        <Page
            title={'Đăng ký'}
            description='Nâng cao kỹ năng viết mã của bạn và nhanh chóng tìm được việc làm. Đây là nơi tốt nhất để mở rộng kiến ​​thức và chuẩn bị cho cuộc phỏng vấn tiếp theo của bạn.'
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
        >
            <Box
                sx={{
                    textAlign: 'center',
                    pt: 8
                }}
            >
                <Typography variant='h1' sx={{ fontWeight: 'bold', fontSize: 60 }}>Gói cao cấp</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: 16, opacity: 0.7, mt: 3 }}>Khởi đầu hành trình học tập của bạn với gói đăng ký phù hợp tại Spacedev.vn</Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    pt: 6,
                }}
            >
                <Box
                    sx={{
                        pt: 4,
                        pb: 4,
                        flex: 1,
                    }}
                >
                    <Card
                        sx={{
                            backgroundColor: 'divider',
                        }}
                    >
                        <CardContent
                            sx={{
                                p: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                            }}
                        >
                            <Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'flex-end',
                                        pb: 2,
                                    }}
                                >
                                    <Typography variant='h2'>Hàng tháng</Typography>
                                    <Typography>thanh toán hàng tháng</Typography>
                                </Box>
                                <Typography sx={{ fontWeight: 'bold', opacity: 0.7 }}>Giảm từ 975.000 VNĐ/tháng.</Typography>
                                <Typography sx={{ fontSize: 14, opacity: 0.7 }}>Gói hàng tháng của chúng tôi cấp quyền truy cập vào tất cả các tính năng cao cấp, gói tốt nhất dành cho người đăng ký ngắn hạn.</Typography>
                            </Box>
                            <Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'flex-end',
                                        pt: 5,
                                    }}
                                >
                                    <Typography variant='h2' sx={{ fontSize: 26, fontWeight: 'bold' }}>799.000 VNĐ</Typography>
                                    <Typography>/tháng</Typography>
                                </Box>
                                <Button
                                    sx={{
                                        mt: 3,
                                        width: '100%',
                                    }}
                                    size='large'
                                    variant='contained'
                                >Đăng ký</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
                <Card
                    sx={{
                        flex: 1,
                        background: 'linear-gradient(294.57deg, rgba(88, 255, 132, 0.4) 0%, rgba(172, 252, 189, 0.4) 100%)',
                        boxShadow: 'rgba(22, 255, 116, 0.24) 0px 12px 56px',
                        borderColor: 'rgba(22, 255, 116, 0.3)',
                    }}
                >
                    <CardContent
                        sx={{
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                        }}
                    >
                        <Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'flex-end',
                                    pb: 2,
                                }}
                            >
                                <Typography variant='h2'>Hàng năm</Typography>
                                <Typography>thanh toán hàng năm ( 3.588.000 VNĐ )</Typography>
                            </Box>
                            <Typography sx={{ fontSize: 14, opacity: 0.7 }}>Gói <strong>phổ biến nhất</strong> của chúng tôi trước đây được bán với giá 7.475.000 VNĐ và hiện chỉ còn <strong>299.000 VND/tháng</strong>.</Typography>
                            <Typography sx={{ fontSize: 14, opacity: 0.7 }}>Gói này giúp bạn <strong>tiết kiệm hơn 60%</strong> so với gói hàng tháng.</Typography>
                        </Box>
                        <Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'flex-end',
                                    pt: 8,
                                }}
                            >
                                <Typography variant='h2' sx={{ fontSize: 26, fontWeight: 'bold' }}>299.000 VND</Typography>
                                <Typography>/tháng</Typography>
                            </Box>
                            <Button
                                sx={{
                                    mt: 3,
                                    width: '100%',
                                }}
                                size='large'
                                variant='contained'
                            >Đăng ký</Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    pt: 7,
                }}
            >
                {
                    contentPremium.map((item, index) => <Box
                        key={index}
                        sx={{
                            flexBasis: 'calc(50% - 8px)',
                            maxWidth: 'calc(50% - 8px)',
                            pb: 3
                        }}
                    >
                        <Typography variant='h2' sx={{ fontSize: 18, mb: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}> {item.icon} {item.title}</Typography>
                        <Typography sx={{ pl: '30px' }}>{item.content}</Typography>
                    </Box>)
                }

            </Box>

            <Grid
                container
                sx={{
                    pt: 7
                }}
            >
                <Grid
                    item
                    md={8}
                >
                    {
                        contentFaqs.map((item, index) => <Accordion
                            key={index}
                            sx={{
                                boxShadow: 'none',
                                '&.Mui-expanded': {
                                    margin: 0,
                                },
                                ':before': {
                                    display: 'none',
                                }
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<AddRoundedIcon />}
                                id={"panel-header-" + index}
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: 22,
                                    lineHeight: '32px',
                                    '.MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                                        transform: 'rotate(-45deg)',
                                        transformOrigin: 'center',
                                    },
                                    '.MuiAccordionSummary-content': {
                                        mt: 3,
                                        '&.Mui-expanded': {
                                            mt: 3,
                                            mb: '12px',
                                        }
                                    }
                                }}
                            >
                                {item.title}
                            </AccordionSummary>
                            <AccordionDetails>
                                {item.content}
                            </AccordionDetails>
                        </Accordion>)
                    }

                </Grid>
                <Grid
                    item
                    md={4}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant='h2' sx={{ fontSize: 36, fontWeight: 'bold', pl: 4 }}>Câu hỏi thường gặp</Typography>
                </Grid>
            </Grid>
        </Page >
    )
}

export default index