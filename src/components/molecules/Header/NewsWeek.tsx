import { Badge, Box, Button, Typography } from '@mui/material';
import React from 'react';
import DrawerCustom from '../DrawerCustom';
import CodeBlock from 'components/atoms/CodeBlock';
import Divider from 'components/atoms/Divider';
import { useSetting } from 'store/setting/settings.reducers';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { getImageUrl } from 'helpers/image';
import { dateFormat } from 'helpers/date';
import { Link } from 'react-router-dom';
import { getCookie, setCookie } from 'helpers/cookie';

function NewsWeek() {

    const notificationRef = React.useRef(null);

    const settings = useSetting();

    const [openNotifications, setOpenNotifications] = React.useState(false);
    const [countNotSee, setCountNotSee] = React.useState(0);

    React.useEffect(() => {
        if (!openNotifications) {
            //
        }
    }, [openNotifications]);

    React.useEffect(() => {
        if (settings && settings.global?.whats_news?.length) {
            const whatUserSee = getCookie('see_whats_news', true);
            if (whatUserSee && typeof whatUserSee === 'object') {
                let count = 0;

                settings.global.whats_news.forEach(item => {
                    if (!whatUserSee[item.key]) {
                        count++;
                    }
                });
                setCountNotSee(count);
            } else {
                setOpenNotifications(true);
                setCountNotSee(settings.global.whats_news.length);
            }

        }
    }, [settings]);

    return (<>
        <Badge sx={{
            '& .MuiBadge-badge': {
                top: 6,
                right: 8
            }
        }}
            badgeContent={countNotSee} max={10} color="secondary"
        >
            <Button
                sx={{
                    mr: 1,
                    fontSize: 16,
                    textTransform: 'unset',
                    fontWeight: 400,
                }}
                ref={notificationRef}
                onClick={() => setOpenNotifications(true)}
                color='inherit'>Có gì mới?</Button>
        </Badge>
        <DrawerCustom
            open={openNotifications}
            onClose={() => {
                setOpenNotifications(false);
                let arrayKeys: { [key: string]: 1 } = {};

                settings.global?.whats_news?.forEach(item => {
                    arrayKeys[item.key] = 1;
                });
                setCookie('see_whats_news', arrayKeys, 1);
                setCountNotSee(0);
            }}
            title="Có gì mới?"
            width={700}
            height="100%"
            onCloseOutsite
            sx={{
                zIndex: 10002,
            }}
        >
            <Box
                sx={{
                    pt: 3,
                    pb: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    height: '100%',
                }}
            >
                {
                    settings.global?.whats_news?.length ?
                        settings.global?.whats_news?.map((item, index) => (
                            <React.Fragment key={index}>
                                <Box>
                                    <Typography variant='body2'>{dateFormat(item.date_time)}</Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <Typography color={'primary'} variant='h4'>{item.title}</Typography>
                                        {
                                            item.link ?
                                                <Link to={item.link}>Tìm hiểu thêm</Link>
                                                : null
                                        }
                                    </Box>
                                    {
                                        item.image ?
                                            <ImageLazyLoading
                                                src={getImageUrl(item.image)}
                                            />
                                            : null
                                    }
                                    <CodeBlock
                                        sx={{ mt: 1 }}
                                        html={item.description}
                                    />
                                </Box>
                                {
                                    //@ts-ignore
                                    (index + 1) !== settings.global.whats_news.length &&
                                    <Divider sx={{ borderBottomWidth: '2px', mb: 1, }} />}
                            </React.Fragment>
                        ))
                        :
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 3,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                p: 2
                            }}
                        >
                            <ImageLazyLoading
                                src='/images/undraw_no_data_qbuo.svg'
                                sx={{
                                    maxWidth: '100%',
                                    width: 'auto',
                                    height: '240px'
                                }}
                            />
                            <Typography align='center' sx={{ color: 'text.secondary' }} variant='h4'>Khám phá những điều mới mẻ từ Spacedev.vn</Typography>
                        </Box>
                }
            </Box>
        </DrawerCustom>
    </>)
}

export default NewsWeek