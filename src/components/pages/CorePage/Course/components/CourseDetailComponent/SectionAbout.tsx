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
import { moneyFormat } from "plugins/Vn4Ecommerce/helpers/Money";
import TestKnowledge from "plugins/Vn4Test/TestKnowledge";
import React from "react";
import { CourseProps } from "services/courseService";
import RoadmapSingle from "../../../Roadmap/components/RoadmapSingle";
import ButtonBuy from "./ButtonBuy";
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

    const urlParam = useQuery({
        open_roadmap: -1,
    });

    const showMoreWhatWillLearn = React.useState(false);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 16,
                lineHeight: '28px',
            }}
        >
            <Box
                sx={{
                    pt: 15,
                    pb: 15,
                    ml: -2,
                    mr: -2,
                    position: 'relative',
                    '&:before': {
                        content: '""',
                        backgroundColor: '#b73bff',
                        opacity: 0.2,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        right: 0,
                        zIndex: 0,
                    }
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
                        <Typography>Những gì bạn nhận được</Typography>
                        <Typography component='h2' sx={{ lineHeight: 1.3, fontSize: 48, fontWeight: 600, }} variant='h2'>Tại sao bạn nên học tại Spavedev</Typography>
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
                                    }}
                                >
                                    <Icon icon="CheckCircleRounded" color="success" />
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
                                    }}
                                >
                                    <Icon icon="CheckCircleRounded" color="success" />
                                    {item.content}
                                </Box>
                            ))
                        }
                    </Box>
                </Box>
            </Box>

            {
                course.course_detail?.active_entry_test ?
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
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                flex: 1,
                                '&:before': {
                                    backgroundColor: 'dividerDark',
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
                                <Typography >Test</Typography>
                                <Typography component='h2' sx={{ lineHeight: 1.3, fontSize: 48, fontWeight: 600, }} variant='h3'>Kiểm tra đầu vào nhận ngay ưu đãi</Typography>
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
                            <TestKnowledge
                                keyTest={'course/start/' + course.slug}
                                testRule={'course/start/' + course.slug}
                                content={(status) => {
                                    const precent = status?.total_point ? (status?.point ?? 0) * 100 / (status?.total_point ? status?.total_point : 1) : 0;
                                    return <>
                                        <Typography variant='h2'></Typography>
                                        <Typography sx={{ mt: 1, }}>Kiểm tra kiến thức cơ bản trước khi vào học, nhanh chóng và tiện lợi. Ngoài ra bạn có thể nhận được các khuyến mãi nếu bài kiểm tra của bạn đủ điều kiện sau:</Typography>
                                        <Typography sx={{ mt: 1, }}><strong>Điểm số &gt;= 95%:</strong> giảm {moneyFormat(300000)} {precent >= 95 ? <strong>(Điểm số của bạn)</strong> : ''}</Typography>
                                        <Typography sx={{ mt: 1, }}><strong>Điểm số &gt;= 85%:</strong> giảm {moneyFormat(200000)} {precent >= 85 && precent < 95 ? <strong>(Điểm số của bạn)</strong> : ''}</Typography>
                                        <Typography sx={{ mt: 1, }}><strong>Điểm số &gt;= 75%:</strong> giảm {moneyFormat(100000)} {precent >= 75 && precent < 85 ? <strong>(Điểm số của bạn)</strong> : ''}</Typography>
                                        <Typography sx={{ mt: 1, color: 'secondary.main' }}><i><u style={{ textDecoration: 'underline' }}>Lưu ý:</u></i><br /> - Bạn chỉ có một lần làm bài kiểm tra đầu vào<br /> - Chương trình không áp dụng khóa học mua để tặng<br /> - Số tiền được giảm sẽ hiển thị ở phần giò hàng</Typography>
                                    </>;
                                }}
                            />
                        </Box>

                    </Box>
                    :
                    null
            }

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
                                backgroundColor: 'dividerDark',
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
                            <Typography >Career Path</Typography>
                            <Typography component='h2' sx={{ lineHeight: 1.3, fontSize: 48, fontWeight: 600, }} variant='h3'>Roadmap</Typography>
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

            {
                course.course_detail?.what_you_will_learn?.length ?
                    <Box
                        sx={(theme) => ({
                            width: 910,
                            maxWidth: '100%',
                            margin: '0 auto',
                            mt: 9,
                            [theme.breakpoints.down('md')]: {
                                mt: 0,
                            }
                        })}
                    >
                        <Typography component='h2' sx={{ lineHeight: 1.3, mb: 6, mt: 6, fontSize: 48, fontWeight: 600, }} align="center" variant='h3'>{__('Những gì bạn sẽ học')}</Typography>
                        {
                            Array.isArray(course.course_detail?.keywords) ?
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        gap: 2,
                                        mb: 8,
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
                                                        boxShadow: '-6px 6px 0 0 ' + theme.palette.text.primary,
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
                                borderLeftColor: 'primary.main',
                            }}
                        >
                            {
                                course.course_detail?.what_you_will_learn.map((item, index) => (showMoreWhatWillLearn[0] || index < 3 ? <Box key={index}
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
                                            fontSize: 38,
                                            fontWeight: 600,
                                        }}
                                    >{index + 1}</Box>
                                    <Box
                                        sx={{
                                            pr: 2,
                                        }}
                                    >
                                        <Typography sx={{ pt: 3, pb: 1.2, fontSize: 24, fontWeight: 600 }} variant="h3">{item.content}</Typography>
                                        <Typography sx={{ pb: 2, fontSize: 14 }}>{item.description}</Typography>
                                    </Box>
                                </Box>
                                    :
                                    <React.Fragment key={index} />
                                ))
                            }

                            <Box
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontWeight: 600,
                                    height: 110,
                                }}
                                onClick={() => showMoreWhatWillLearn[1](prev => !prev)}
                            >
                                {
                                    showMoreWhatWillLearn[0] ? 'Thu gọn' : '+ ' + (course.course_detail?.what_you_will_learn.length - 3) + ' điều bạn sẽ được học'
                                }

                            </Box>
                        </Box>
                    </Box>
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
                            boxShadow: '-6px 6px 0 0 ' + theme.palette.text.primary,
                        }
                    }
                })}
            />
            <Box
                sx={{
                    width: 1920,
                    maxWidth: '100%',
                    margin: '0 auto',
                    mt: 15,
                }}
            >
                <Typography component='h2' sx={{ lineHeight: 1.3, mb: 2, fontSize: 48, fontWeight: 600, }} align="center" variant='h3'>Bạn sẽ làm những gì?</Typography>
                <Typography variant="h5" sx={{ mb: 6 }} align="center">Các dự án bạn sẽ thực hiện trong quá trình học tập.</Typography>
                <Grid
                    container
                    justifyContent='center'
                    spacing={4}
                    sx={{
                        fontSize: '18px',
                        lineHeight: '32px',
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
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'dividerDark',
                                        pb: 2,
                                    }}
                                >
                                    <ImageLazyLoading src={getImageUrl(item.featured_image)} sx={{ width: '100%', height: 240 }} />
                                    <Typography sx={{ p: 2, pb: 0, fontSize: 16, fontWeight: 600, ...cssMaxLine(1) }} variant='h4'>{item.title}</Typography>
                                    <Typography sx={{ p: 2, pt: 1, fontSize: 14, ...cssMaxLine(3), height: 72, }}>{item.description}</Typography>
                                    {
                                        item.link ?
                                            <Typography sx={{ pl: 2, pr: 2, pt: 1, fontSize: 14 }}><LinkMui href={item.link} sx={{ color: "text.link" }} rel="nofollow" target={'_blank'} >Xem dự án</LinkMui></Typography>
                                            :
                                            <></>
                                    }
                                </Box>
                            </Grid>
                        ))
                    }
                </Grid>

            </Box>

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
                        md={5}
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
                        md={7}
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
                                <Typography sx={{ mt: 3, fontSize: 20, lineHeight: '32px' }} key={index}>{item.content}</Typography>
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
                            '&:before': {
                                content: '""',
                                backgroundColor: '#3baeff',
                                opacity: 0.2,
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                right: 0,
                                zIndex: 0,
                            }
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
                                <Typography>Câu hỏi thường gặp</Typography>
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
                <Typography component='h2' sx={{ lineHeight: 1.3, color: 'white', fontSize: 48, fontWeight: 600, }} align="center" variant='h3'>Sẵn sàng khám phá khóa học?</Typography>
                <Typography variant="h5" sx={{ color: 'white', mb: 4, mt: 2 }} align="center">Bạn đã sẵn sàng khám phá những kiến thức mới và trau dồi kỹ năng với khóa học của chúng tôi chưa?</Typography>
                <ButtonBuy
                    course={course}
                    isPurchased={isPurchased}
                    sx={{
                        justifyContent: 'center',
                        gap: 3,
                        '& .MuiButton-root': {
                            fontSize: 16,
                            p: 4,
                            pt: 1,
                            pb: 1,
                            boxShadow: '-4px 4px 0 0 #adadad',
                            '&:hover': {
                                boxShadow: '-6px 6px 0 0 #adadad',
                            }
                        }
                    }}
                />
            </Box>
        </Box >
    )
}