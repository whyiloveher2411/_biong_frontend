import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import { Box, Button, Card, CardContent, Grid, IconButton, Slider, SliderThumb, Typography } from '@mui/material';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import AuthGuard from 'components/templates/AuthGuard';
import { getImageUrl } from 'helpers/image';
import { numberWithSeparator } from 'helpers/number';
import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { UserState, useUser } from 'store/user/user.reducers';
function index() {

    const { tab } = useParams();

    if (!tab) {
        return <Navigate to='/' />
    }

    return (
        <AuthGuard
            title='Kiểm tra kiến thức'
            description='Kiểm tra kiến thức từ ngân hàng các câu hỏi, bài tập của chúng tôi.'
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    pt: 5,
                }}
            >
                <ImageLazyLoading
                    src='https://dg8krxphbh767.cloudfront.net/tracks/javascript.svg'
                    sx={{
                        width: 54
                    }}
                />
                <Typography variant='h1'>Javascript</Typography>
            </Box>
            <Grid
                container
                spacing={4}
                sx={{ mt: 6 }}
            >
                <Grid
                    item
                    lg={8}
                    md={12}
                    sm={12}
                    xs={12}
                >
                    <Card>
                        <CardContent>
                            <Typography sx={{ fontSize: 18 }}>Bạn đã hoàn thành <Typography component='span' sx={{ fontSize: '1.2rem', fontWeight: 600, color: 'primary.main' }}>0,7%</Typography> trắc nghiệm JavaScript. Tiếp tục cố lên! 🚀</Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Slider
                                    size="medium"
                                    value={2}
                                    max={144}
                                    sx={{
                                        '& .MuiBox-root': {
                                            overflow: 'unset',
                                        }
                                    }}
                                    components={{
                                        Thumb: AvatarUser
                                    }}
                                />
                                <ImageLazyLoading
                                    src='https://dg8krxphbh767.cloudfront.net/tracks/javascript.svg'
                                    sx={{
                                        width: 48,
                                        flexShrink: 0,
                                    }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {
                                    [...Array(148)].map(item => (
                                        <IconButton sx={{ opacity: 0.5 }} size="small">
                                            <BlockRoundedIcon />
                                        </IconButton>
                                    ))
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid
                    item
                    lg={4}
                    md={12}
                    sm={12}
                    xs={12}
                >
                    {
                        [
                            {
                                "image": {
                                    "link": "https://cdn.worldvectorlogo.com/logos/html-1.svg",
                                    "type_link": "external",
                                    "ext": "svg",
                                    "width": 2183,
                                    "height": 2500
                                },
                                "category": 1,
                                "title": "HTML",
                                "description": "Các câu hỏi cơ bản và nâng cao kiến thức liên quan đến HTML dành cho người mới bắt đầu",
                                "count": 147,
                                "slug": "html"
                            },
                            {
                                "image": {
                                    "link": "https://camo.githubusercontent.com/edc736634dd35b0f4008e2f7db456136b9fc0e1e7a4078bb72c7352b1bdf8a7e/68747470733a2f2f776f726c64766563746f726c6f676f2e636f6d2f6c6f676f732f6373732d332e737667",
                                    "type_link": "external",
                                    "ext": "com/edc736634dd35b0f4008e2f7db456136b9fc0e1e7a4078bb72c7352b1bdf8a7e/68747470733a2f2f776f726c64766563746f726c6f676f2e636f6d2f6c6f676f732f6373732d332e737667",
                                    "width": 2183,
                                    "height": 2500
                                },
                                "category": 2,
                                "title": "CSS",
                                "description": "Kiểm tra kiến thức của bạn về cú pháp và cách dùng CSS trong các trường hợp khác nhau",
                                "count": 141,
                                "slug": "css"
                            },
                            {
                                "image": {
                                    "link": "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
                                    "type_link": "external",
                                    "ext": "png",
                                    "width": 512,
                                    "height": 512
                                },
                                "category": 3,
                                "title": "Javascript",
                                "description": "Các câu hỏi về Javascript cung cấp cho bạn kiến thức về cấu trúc dữ liệu, thuật toán và hơn thế nữa",
                                "count": 151,
                                "slug": "javascript"
                            },
                            {
                                "image": {
                                    "link": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png",
                                    "type_link": "external",
                                    "ext": "png",
                                    "width": 2300,
                                    "height": 2000
                                },
                                "category": 4,
                                "title": "React",
                                "description": "Cùng ôn lại kiến thức React qua các câu hỏi dễ dàng tìm hiểu thêm và ghi nhớ hơn",
                                "count": 103,
                                "slug": "react"
                            }
                        ].map((item, index) => (
                            <Card
                                key={index}
                                sx={{ mb: 3 }}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 2,
                                    }}
                                >
                                    <ImageLazyLoading
                                        src={getImageUrl(item.image)}
                                        sx={{
                                            width: 48,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Box>
                                        <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                                        <Typography>{item.description}</Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            flexShrink: 0,
                                            whiteSpace: 'nowrap',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <Typography>
                                            +{numberWithSeparator(item.count)} câu hỏi
                                        </Typography>
                                        <Button component={Link} to={'/test/' + item.slug} variant='contained' size="small" sx={{ fontSize: 12 }}>Khám phá</Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    }

                </Grid>
            </Grid>
        </AuthGuard>
    )
}

export default index


type AvatarUserThumbComponentProps = React.HTMLAttributes<unknown>

function AvatarUser(props: AvatarUserThumbComponentProps) {
    const { children, ...other } = props;
    const user = useUser();
    return (
        <SliderThumb {...other}>
            {children}
            <ImageLazyLoading
                src={user._state === UserState.identify ? getImageUrl(user.avatar, '/images/user-default.svg') : '/images/user-default.svg'}
                placeholderSrc='/images/user-default.svg'
                name={user.full_name}
                sx={{
                    '& .blur': {
                        filter: 'unset !important',
                    },
                    width: "24px",
                    height: "24px",
                    borderRadius: '50%',
                }}
            />
        </SliderThumb>
    );
}