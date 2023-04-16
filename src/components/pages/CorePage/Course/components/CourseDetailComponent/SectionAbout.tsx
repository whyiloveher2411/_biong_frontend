import { Button, IconButton, Link } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinkMui from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Icon from "components/atoms/Icon";
import ImageLazyLoading from "components/atoms/ImageLazyLoading";
import { cssMaxLine } from "helpers/dom";
import { __ } from "helpers/i18n";
import { getImageUrl } from "helpers/image";
import useQuery from "hook/useQuery";
import React from "react";
import { CourseProps } from "services/courseService";
import RoadmapSingle from "../../../Roadmap/components/RoadmapSingle";
import ReviewCourse from "../ReviewCourse";
import ButtonBuy from "./ButtonBuy";
import SectionEntryTest from "./SectionEntryTest";
import SectionFAQ from "./SectionFAQ";
import SectionInstructors2 from "./SectionInstructors2";

export default function SectionAbout({
    course, isPurchased
}: {
    course: CourseProps | null,
    isPurchased: boolean,
}) {
    if (!course) {
        return null;
    }

    const [openDialogReview, setOpenDialogReview] = React.useState(false);


    const urlParam = useQuery({
        open_roadmap: -1,
    });


    const progressBuyCourse: Array<[string, string, (() => JSX.Element | undefined)?]> = [
        [
            'Mua và thanh toán khóa học',
            'Hoàn thành đơn hàng với các phương thức thanh toán phù hợp, đơn hàng sẽ nhanh chóng được xác nhận sau đó',
            () => (course ? <ButtonBuy
                course={course}
                isPurchased={isPurchased}
                disableAccessCourse
            /> : undefined)
        ],
        [
            'Tham gia nhóm học tập facebook',
            'Đặt câu hỏi và nhanh chóng được giải đáp từ cộng đồng học tập spacedev trên các nền tảng mạng xã hội',
            () => <Button variant="contained" component={Link} href="https://www.facebook.com/groups/fullstacknodejsreactjs" target="_blank">Tham gia nhóm</Button>
        ],
        [
            'Bắt đầu học tập',
            'Học tập theo danh sách bài học đã được sắp xếp phù hợp từ cơ bản đến nâng cao',
            () => (course ? <ButtonBuy
                course={course}
                isPurchased={isPurchased}
                disableBuy
            /> : undefined)
        ],
        [
            'Hỏi đáp trong quá trình học',
            'Tìm hiểu và đặt câu hỏi khi có thắc mắc để được giải đáp kịp thời ở nền tảng hoặc cộng đồng trên group facebook, group chat',
        ],
        [
            'Hoàn thành dự án cuối khóa',
            'Bạn sẽ được hướng dẫn hoàn thành dự án cuối khóa với đầy đủ chức năng trước khi kết thúc khóa học',
        ],
        [
            'Kiểm tra đầu ra',
            'Kiểm tra để ghi nhớ lại các kiến thức đạt được từ ngân hàng câu hỏi sau khi hoàn thánh khóa học',
        ],
        [
            'Review dự án',
            'Chúng tôi sẽ đánh giá dự án cuối khóa của bạn và cho bạn các lời khuyên để cải thiện dự án',
        ],
        [
            'Review CV, phỏng vấn thử',
            'Chúng tôi hướng dẫn bạn viết CV tốt hơn, ngoài ra bạn sẽ có một buổi phỏng vấn thử với các kiến thức đã học',
        ],
        [
            'Đánh giá khóa học',
            'Để lại nhận xét của bạn về khóa học giúp chúng tôi có động lực cũng như cải thiện khóa học hơn trong tương lai',
            () => isPurchased ? <Button onClick={() => setOpenDialogReview(true)} variant="contained" >Đánh giá khóa học</Button> : undefined
        ],
    ];

    if (course && course.course_detail?.active_entry_test) {
        progressBuyCourse.unshift([
            'Kiểm tra đầu vào',
            'Kiểm tra kiến thức cơ bản từ ngân hàng câu hỏi của chúng tôi để nhận được các ưu đãi dựa trên kết quả',
            () => (course && course.course_detail?.active_entry_test ? <Button onClick={() => {
                document.getElementById('entry_test')?.scrollIntoView();
            }} variant="contained">Kiểm tra đầu vào</Button> : undefined)
        ]);
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 16,
                lineHeight: '28px',
            }}
        >

            {
                course.course_detail?.active_entry_test ?
                    <SectionEntryTest id="entry_test" course={course} />
                    :
                    null
            }


            <Box
                sx={{
                    width: 1920,
                    maxWidth: '100%',
                    margin: '0 auto',
                    mt: 15,
                    position: 'relative',
                }}
            >
                <Box
                    sx={(theme) => ({
                        position: 'absolute',
                        top: '8px',
                        left: -16,
                        zIndex: 0,
                        opacity: theme.palette.mode === 'light' ? 1 : 0.1,
                    })}
                >
                    <svg width="106" height="499"><circle cx="345.5" cy="345.5" r="345.5" transform="translate(-585 -96)" fill="#F5FFE3" fillRule="evenodd"></circle></svg>
                </Box>
                <Typography component='h2' sx={{ position: 'relative', zIndex: 1, lineHeight: 1.3, fontSize: 48, fontWeight: 600, }} align="center" variant='h3'>Dự án trong khóa học</Typography>
                <Typography variant="h5" sx={{ position: 'relative', zIndex: 1, mb: 9, color: 'text.secondary' }} align="center">Hoàn thành {course?.course_detail?.projects?.length}+ dự án với đầy đủ các chức năng, bấm vào để xem trước dự án</Typography>
                <Grid
                    container
                    justifyContent='center'
                    spacing={4}
                    sx={{
                        fontSize: '18px',
                        lineHeight: '32px',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    {
                        course?.course_detail?.projects?.map((item, index) => (
                            <Grid
                                item
                                key={index}
                                sm={6}
                                md={4}
                                lg={3}
                            >
                                <Box
                                    onClick={() => {
                                        if (item.link) {
                                            window.open(item.link);
                                        }
                                    }}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'dividerDark',
                                        cursor: 'pointer',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        height: '100%',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        flexDirection: 'column',
                                        '&:hover, &:focus, &:active, &:visited': {
                                            borderColor: 'primary.main',
                                            // transform: 'scale(1.02)',
                                            boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                                        },
                                        '&:focus, &:active, &:visited': {
                                            borderColor: 'primary.main',
                                            // transform: 'scale(1.02)',
                                        }
                                    }}
                                >
                                    <ImageLazyLoading src={getImageUrl(item.featured_image)} sx={{ width: '100%', height: 240 }} />
                                    <Typography sx={{ p: 2, pb: 0, fontSize: 16, fontWeight: 600, ...cssMaxLine(2) }} variant='h4'>{item.title}</Typography>
                                    <Typography sx={{ marginTop: 'auto', p: 2, pt: 1, fontSize: 14, ...cssMaxLine(3), height: 82, }}>{item.description}</Typography>
                                    <Box
                                        sx={{
                                            p: 2,
                                            pt: 1,
                                            pb: 1,
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        {
                                            item.link ?
                                                <IconButton
                                                    component={LinkMui}
                                                    href={item.link}
                                                    target="_blank"
                                                    color='primary'
                                                >
                                                    <Icon icon="ArrowForwardRounded" />
                                                </IconButton>
                                                // <Typography sx={{ pl: 2, pr: 2, pt: 1, fontSize: 14 }}><LinkMui href={item.link} sx={{ color: "text.link" }} rel="nofollow" target={'_blank'} >Xem dự án</LinkMui></Typography>
                                                :
                                                <></>
                                        }
                                    </Box>
                                </Box>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>

            {
                Boolean(course?.course_detail?.description) &&
                <Box
                    sx={(theme) => ({
                        pt: 15,
                        pb: 20,
                        position: 'relative',
                        [theme.breakpoints.down('md')]: {
                            pt: 0,
                            pb: 0,
                        }
                    })}
                >
                    <Box
                        sx={{
                            fontSize: '18px',
                            lineHeight: '32px',
                            maxWidth: 910,
                            margin: '0 auto',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        <Box dangerouslySetInnerHTML={{ __html: course.course_detail?.description ?? '' }} />
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            bottom: '24px',
                            height: '740px',
                            overflow: 'hidden',
                            position: 'absolute',
                            zIndex: 0,
                            opacity: 0.2,
                        }}
                    >
                        <svg width="100%" height="742" viewBox="0 0 1571 732" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1566.91 83.6144C1505.8 34.0963 1364.65 -43.7375 1369.71 47.7192C1376.04 162.04 1441.75 417.506 1342.83 392.645C1243.91 367.784 1243.96 236.278 1288.57 247.489C1350.64 263.089 1429.65 658.733 1090.77 642.748C772.835 627.751 440.792 551.965 512.498 660.512C598.499 790.7 245.329 706.1 3.48537 495.013" stroke="#00FF84" strokeWidth="10"></path></svg>
                    </Box>
                </Box>
            }

            <Box
                sx={{
                    position: 'relative',
                }}
            >
                <Box
                    sx={(theme) => ({
                        width: 910,
                        maxWidth: '100%',
                        margin: '0 auto',
                        mt: 9,
                        position: 'relative',
                        zIndex: 1,
                        [theme.breakpoints.down('md')]: {
                            mt: 0,
                        }
                    })}
                >
                    <Typography component='h2' sx={{ lineHeight: 1.3, fontSize: 48, fontWeight: 600, }} align="center" variant='h3'>Quy trình tham gia khóa học</Typography>
                    <Typography variant="h5" sx={{ color: 'text.secondary', mb: 6, mt: 1, lineHeight: '24px', }} align="center">Tham gia đầy đủ quy trình để bạn có được những lời khuyên hữu ích từ chúng tôi <br /> (Một vài bước chỉ áp dụng cho khóa trả phí)</Typography>
                    <Box
                        sx={(theme) => ({
                            border: '1px solid',
                            borderLeftWidth: 6,
                            borderColor: 'dividerDark',
                            borderLeftColor: 'primary.main',
                            '& .MuiButton-root': {
                                fontSize: 16,
                                p: 4,
                                pt: 1,
                                pb: 1,
                                boxShadow: '-4px 4px 0 0 ' + theme.palette.text.primary,
                                '&:hover': {
                                    boxShadow: '-8px 8px 0 0 ' + theme.palette.text.primary,
                                }
                            }
                        })}
                    >
                        {
                            progressBuyCourse.map((item, index) => <Box key={index}
                                sx={{
                                    display: 'flex',
                                    borderBottom: '1px solid',
                                    borderColor: 'dividerDark',
                                    position: 'relative',
                                    pl: 7,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >

                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: -30,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: 54,
                                        height: 54,
                                        border: '6px solid',
                                        borderColor: 'body.background',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '50%',
                                        fontSize: 22,
                                        fontWeight: 600,
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                    }}
                                >
                                    {index + 1}
                                </Box>
                                <Box
                                    sx={{
                                        pr: 2,
                                    }}
                                >
                                    <Typography sx={{ pt: 3, pb: 1.2, fontSize: 24, fontWeight: 600 }} variant="h3">{item[0]}</Typography>
                                    <Typography sx={{ pb: 2, fontSize: 14 }}>{item[1]}</Typography>
                                </Box>
                                <Box
                                    sx={{ width: 'auto', p: 2 }}
                                >
                                    {item[2] ? item[2]() : null}
                                </Box>
                            </Box>
                            )
                        }
                    </Box>
                </Box>
            </Box >

            <Box
                sx={{
                    mt: 15,
                    pt: 15,
                    pb: 15,
                    ml: -2,
                    mr: -2,
                    position: 'relative',
                    backgroundColor: '#247d6a',
                    // '&:before': {
                    //     content: '""',
                    //     backgroundColor: '#b73bff',
                    //     opacity: 0.2,
                    //     position: 'absolute',
                    //     left: 0,
                    //     top: 0,
                    //     bottom: 0,
                    //     right: 0,
                    //     zIndex: 0,
                    // }
                }}
            >
                <Box
                    sx={(theme) => ({
                        fontSize: '18px',
                        lineHeight: '32px',
                        maxWidth: '100%',
                        width: 1200,
                        margin: '0 auto',
                        display: 'flex',
                        position: 'relative',
                        [theme.breakpoints.down('md')]: {
                            flexDirection: 'column',
                        }
                    })}
                >
                    <Box
                        sx={{
                            pl: 6,
                            pr: 6,
                            flexShrink: 0,
                            flex: 1,
                        }}
                    >
                        <Typography sx={{ color: '#e4e4e4' }}>Những gì bạn nhận được</Typography>
                        <Typography component='h2' sx={{ color: '#e4e6eb', lineHeight: 1.3, fontSize: 48, fontWeight: 600, }} variant='h2'>Tại sao bạn nên học tại Spavedev</Typography>
                    </Box>
                    <Box
                        sx={(theme) => ({
                            flex: 1,
                            [theme.breakpoints.down('md')]: {
                                p: 4,
                            }
                        })}
                    >
                        {
                            [
                                'Bài học thực hành và lý thuyết song song',
                                'Kiến thức thực tiễn phù hợp với thực tế đi làm',
                                'Học thử miễn phí hoàn toàn, chỉ mua khi ưng ý',
                                'Học tập mọi lúc, mọi nơi từ bất cứ đâu có kết nối internet',
                                'Truy cập trọn đời, không giới hạn',
                                'Support 24/7 qua forum, chat, facebook, email.',
                                'Tham gia nhóm học tập spacedev.vn trên facebook',
                                'Tự điều chỉnh tốc độ học tập theo sở thích của mình',
                                'Được đánh giá, góp ý dự án cuối khóa',
                                'Một buổi phỏng vấn thử miễn phí',
                            ].map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        gap: 1.5,
                                        alignItems: 'center',
                                        pt: 1.5,
                                        color: '#e4e6eb',
                                    }}
                                >
                                    <Icon icon="CheckCircleRounded" sx={{ color: '#e4e6eb' }} />
                                    {item}
                                </Box>
                            ))
                        }
                        {
                            course?.course_detail?.what_you_will_receive?.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        gap: 1.5,
                                        alignItems: 'center',
                                        pt: 1.5,
                                        color: '#e4e6eb',
                                    }}
                                >
                                    <Icon icon="CheckCircleRounded" sx={{ color: '#e4e6eb' }} />
                                    {item.content}
                                </Box>
                            ))
                        }
                    </Box>
                </Box>
            </Box>

            {
                Boolean(course.course_detail?.roadmaps?.[0]) &&
                <Box
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
                            flex: 0.8,
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            '&:before': {
                                backgroundColor: '#242424',
                                bottom: 0,
                                content: "''",
                                position: 'absolute',
                                right: '-23px',
                                top: 0,
                                transform: 'skew(-12deg)',
                                width: '300%',
                                zIndex: 0,
                                borderRadius: '0 0 40px 0',

                            },
                            [theme.breakpoints.down('md')]: {
                                alignItems: 'flex-start',
                                pr: 0,
                                pb: 0,
                                '&:before': {
                                    display: 'none',
                                }
                            }

                        })}
                    >
                        <Box
                            sx={{
                                zIndex: 1,
                            }}
                        >
                            <Typography sx={{ color: '#b0b3b8', }} >Career Path</Typography>
                            <Typography component='h2' sx={{ color: '#e4e6eb', lineHeight: 1.3, fontSize: 48, fontWeight: 600, }} variant='h3'>Roadmap</Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={(theme) => ({
                            margin: '0 auto',
                            pl: 10,
                            pt: 7,
                            pb: 7,
                            [theme.breakpoints.down('md')]: {
                                pl: 0,
                                pt: 4,
                                pb: 4,
                            }
                        })}
                    >
                        <Typography sx={{ mb: 2, }}>{__('Khóa học được xây dựng dựa trên roadmap giúp học viên có cái nhìn tổng quan về các kiến thức sẽ học, hãy lưu lại và dánh dấu khi hoàn thành.')}</Typography>
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                mb: 2
                            }}
                        >
                            {
                                course.course_detail?.roadmaps?.map((item, index) => (
                                    <Grid
                                        key={item.id}
                                        item
                                        sm={6}
                                        xs={12}
                                    >

                                        <RoadmapSingle roadmap={item} onClick={() => {
                                            urlParam.changeQuery({
                                                open_roadmap: index,
                                            });
                                        }} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box>

                </Box>
            }

            {
                course.course_detail?.what_you_will_learn?.length ?
                    <Box
                        sx={{
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={(theme) => ({
                                position: 'absolute',
                                top: '8px',
                                right: -16,
                                zIndex: 0,
                                opacity: theme.palette.mode === 'light' ? 1 : 0.1,
                            })}
                        >
                            <svg width="146" height="212"><path d="M182.722.75l60.75 105.222-60.75 105.222h-121.5L.472 105.972 61.222.75z" fill="#F5FFE3" fillRule="evenodd"></path></svg>
                        </Box>
                        <Box
                            sx={(theme) => ({
                                width: 910,
                                maxWidth: '100%',
                                margin: '0 auto',
                                mt: 9,
                                position: 'relative',
                                zIndex: 1,
                                [theme.breakpoints.down('md')]: {
                                    mt: 0,
                                }
                            })}
                        >
                            <Typography component='h2' sx={{ lineHeight: 1.3, mb: 6, mt: 6, fontSize: 48, fontWeight: 600, }} align="center" variant='h3'>Những gì bạn sẽ học</Typography>
                            {
                                Array.isArray(course.course_detail?.keywords) ?
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            justifyContent: 'center',
                                            gap: 2,
                                            mb: 9,
                                        }}
                                    >
                                        {
                                            course.course_detail?.keywords?.map((item) => (
                                                <Box
                                                    key={item.id}
                                                    sx={(theme) => ({
                                                        '--color': 'primary.contrastText',
                                                        color: 'primary.contrastText',
                                                        display: 'inline-block',
                                                        p: 4,
                                                        pt: 1,
                                                        pb: 1,
                                                        backgroundColor: 'primary.main',
                                                        fontFamily: 'monospace',
                                                        borderRadius: 1,
                                                        boxShadow: '-4px 4px 0 0 ' + theme.palette.text.primary,
                                                        userSelect: 'text',
                                                        transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            boxShadow: '-8px 8px 0 0 ' + theme.palette.text.primary,
                                                        }
                                                    })}
                                                >
                                                    {item.title}
                                                </Box>
                                            ))
                                        }
                                    </Box>
                                    :
                                    null
                            }
                            <Box
                                sx={{
                                    border: '1px solid',
                                    borderLeftWidth: 6,
                                    borderColor: 'dividerDark',
                                    borderLeftColor: 'text.primary',
                                }}
                            >
                                {
                                    course.course_detail?.what_you_will_learn.map((item, index) => <Box key={index}
                                        sx={{
                                            display: 'flex',
                                            borderBottom: '1px solid',
                                            borderColor: 'dividerDark',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 160,
                                                flexShrink: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Box
                                                sx={(theme) => ({
                                                    width: 42,
                                                    height: 42,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: '50%',
                                                    fontSize: 22,
                                                    fontWeight: 600,
                                                    ...(theme.palette.mode === 'light' ? {
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                    } : {
                                                        backgroundColor: 'white',
                                                        color: 'black',
                                                    })
                                                })}
                                            >
                                                {index + 1}
                                            </Box>
                                        </Box>
                                        <Box
                                            sx={{
                                                pr: 2,
                                            }}
                                        >
                                            <Typography sx={{ pt: 3, pb: 1.2, fontSize: 24, fontWeight: 600 }} variant="h3">{item.content}</Typography>
                                            <Typography sx={{ pb: 2, fontSize: 14 }}>{item.description}</Typography>
                                        </Box>
                                    </Box>
                                    )
                                }
                            </Box>
                        </Box>
                    </Box >
                    : null
            }
            <ButtonBuy
                course={course}
                isPurchased={isPurchased}
                sx={(theme) => ({
                    mt: 15,
                    justifyContent: 'center',
                    gap: 3,
                    '& .MuiButton-root': {
                        fontSize: 16,
                        p: 4,
                        pt: 1,
                        pb: 1,
                        boxShadow: '-4px 4px 0 0 ' + theme.palette.text.primary,
                        '&:hover': {
                            boxShadow: '-8px 8px 0 0 ' + theme.palette.text.primary,
                        }
                    }
                })}
            />


            <Grid
                container
                sx={{
                    maxWidth: '100%',
                    width: 1248,
                    margin: '0 auto',
                    display: 'flex',
                    mt: 15,
                }}
            >
                {
                    Boolean(course?.course_detail?.requirements) &&
                    <Grid
                        item
                        md={6}
                        sx={(theme) => ({
                            fontSize: '18px',
                            lineHeight: '32px',
                            flex: 1,
                            borderRadius: 2,
                            p: 10,
                            background: '#141c3a',
                            [theme.breakpoints.down('md')]: {
                                p: 4,
                            }
                        })}
                    >
                        <Typography component='h3' sx={{ lineHeight: 1.1, color: '#efd9ca', mb: 5, fontSize: 38 }} variant='h3'>Mẹo nhỏ <Box component='span' sx={{ color: 'primary.main' }}>cho bạn</Box></Typography>
                        {
                            course?.course_detail?.requirements?.map((item, index) => (
                                <Typography sx={{ mt: 3, color: '#efd9ca', fontSize: 20, lineHeight: '32px' }} key={index}>{item.content}</Typography>
                            ))
                        }
                    </Grid>
                }
                {
                    Boolean(course?.course_detail?.who) &&
                    <Grid
                        item
                        md={6}
                        sx={(theme) => ({
                            fontSize: '18px',
                            lineHeight: '32px',
                            p: 10,
                            textAlign: 'center',
                            [theme.breakpoints.down('md')]: {
                                p: 4,
                            }
                        })}
                    >
                        <Typography component='h3' sx={{ lineHeight: 1.1, mb: 5, fontSize: 38 }} variant='h3'>Khóa học <Box component='span' sx={{ color: 'secondary.main' }}>dành cho ai</Box></Typography>
                        {
                            course?.course_detail?.who?.map((item, index) => (
                                <Box key={index} sx={{ mt: 3 }}>
                                    <Typography sx={{ fontSize: 20, fontWeight: 600 }}>{item.title}</Typography>
                                    <Typography sx={{ color: 'text.secondary', fontSize: 16, lineHeight: '32px' }} >{item.content}</Typography>
                                </Box>
                            ))
                        }
                    </Grid>
                }
            </Grid>


            <SectionInstructors2 course={course} />

            {
                course.course_detail?.faq?.length ?
                    <Box
                        sx={{
                            mt: 12,
                            pt: 15,
                            pb: 15,
                            ml: -2,
                            mr: -2,
                            position: 'relative',
                            // '&:before': {
                            //     content: '""',
                            //     backgroundColor: '#3baeff',
                            //     opacity: 0.2,
                            //     position: 'absolute',
                            //     left: 0,
                            //     top: 0,
                            //     bottom: 0,
                            //     right: 0,
                            //     zIndex: 0,
                            // }
                        }}
                    >
                        <Grid
                            container
                            sx={{
                                fontSize: '18px',
                                lineHeight: '32px',
                                maxWidth: '100%',
                                width: 1200,
                                margin: '0 auto',
                                display: 'flex',
                                position: 'relative',
                            }}
                        >
                            <Grid
                                item
                                md={6}
                                sx={{
                                    pl: 6,
                                    pr: 6,
                                    mb: 4,
                                }}
                            >
                                <Typography sx={{ color: 'text.secondary', }}>Câu hỏi thường gặp</Typography>
                                <Typography component='h2' sx={{ lineHeight: 1.3, fontSize: 48, fontWeight: 600, }} variant='h2'>Những câu hỏi có thể bạn quan tâm</Typography>
                            </Grid>
                            <Grid
                                item
                                md={6}>
                                <SectionFAQ course={course} />
                            </Grid>
                        </Grid>
                    </Box>
                    :
                    null
            }


            <Box
                sx={{
                    pt: 15,
                    pb: 15,
                    pl: 2,
                    pr: 2,
                    ml: -2,
                    mr: -2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: course.course_detail?.thumbnail_color ?? '#644c28',
                }}
            >
                <Typography component='h2' sx={{ lineHeight: 1.3, color: 'white', fontSize: 48, fontWeight: 600, }} align="center" variant='h3'>Bạn đã Sẵn sàng chưa?</Typography>
                <Typography variant="h5" sx={{ color: '#b0b3b8', mb: 4, mt: 1 }} align="center">Bắt đầu hành trình khám phá tri thức mới tại Spacedev</Typography>
                <ButtonBuy
                    course={course}
                    isPurchased={isPurchased}
                    sx={(theme) => ({
                        justifyContent: 'center',
                        gap: 3,
                        '& .MuiButton-root': {
                            fontSize: 16,
                            p: 4,
                            pt: 1,
                            pb: 1,
                            boxShadow: '-4px 4px 0 0 var(--boxShadow,' + theme.palette.text.primary + ')',
                            '&:hover': {
                                boxShadow: '-8px 8px 0 0  var(--boxShadow,' + theme.palette.text.primary + ')',
                            }
                        }
                    })}
                />
            </Box>

            <ReviewCourse
                open={openDialogReview}
                onClose={() => setOpenDialogReview(false)}
                course={course}
                handleAfterConfimReview={() => setOpenDialogReview(false)}
            />

        </Box >
    )
}
