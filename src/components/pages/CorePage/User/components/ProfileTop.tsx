import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardContent, IconButton, Link as LinkMui, Skeleton, Slider, Stack, Typography, useTheme } from '@mui/material';
import Avatar from 'components/atoms/Avatar';
import Divider from 'components/atoms/Divider';
import Icon, { IconFormat } from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import MoreButton from 'components/atoms/MoreButton';
import { useTransferLinkDisableScroll } from 'components/atoms/ScrollToTop';
import Dialog from 'components/molecules/Dialog';
import TooltipVerifiedAccount from 'components/molecules/TooltipVerifiedAccount';
import { addClasses } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import useReportPostType from 'hook/useReportPostType';
import useResponsive from 'hook/useResponsive';
import React from 'react';
import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import accountService, { REPORT_TYPE } from 'services/accountService';
import { RootState } from 'store/configureStore';
import { forceUpdateInfo, UserProps } from 'store/user/user.reducers';

function ProfileTop({ user, isTemplateProfile = true, nameButtonActive = 'edit-profile', handleLoadProfile }: {
    user: UserProps | null,
    isTemplateProfile?: boolean,
    nameButtonActive: string,
    handleLoadProfile?: () => Promise<void>,
}) {

    const accountCurrent = useSelector((state: RootState) => state.user);

    const theme = useTheme();

    const disableScroll = useTransferLinkDisableScroll();

    const dispatch = useDispatch();

    const isMobile = useResponsive('down', 'sm');

    const [image, setImage] = React.useState<File | null>(null);
    const [loadingUploadAvatar, setLoadingUploadAvatar] = React.useState(false);

    const [imageBanner, setImageBanner] = React.useState<File | null>(null);
    const [isLoadingButtonBanner, setIsLoadingButtonBanner] = React.useState(false);

    const avatarElementBannerRef = React.useRef<AvatarEditor>(null);

    const [openEditAvatar, setOpenEditAvatar] = React.useState(false);

    const avatarElementRef = React.useRef<AvatarEditor>(null);


    const [valueScale, setValueScale] = React.useState<number>(1);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValueScale(newValue as number);
    };

    const dialogReport = useReportPostType({
        dataProps: {
            post: user?.id,
            type: REPORT_TYPE,
        },
        reasonList: {
            'Giả mạo người khác': {
                title: __('Giả mạo người khác')
            },
            'Tài khoản giả mạo': {
                title: __('Tài khoản giả mạo')
            },
            'Đăng nội dung không phù hợp hoặc đúng sự thật': {
                title: __('Đăng nội dung không phù hợp hoặc đúng sự thật')
            },
            'Vấn đề khác': {
                title: __('Vấn đề khác')
            },
        },
    })

    const actionAccount: Array<{
        [key: string]: {
            title: string,
            action: () => void,
            icon: IconFormat,
            selected?: boolean,
        }
    }> = [];


    if (user) {

        if (accountCurrent.id && user.id) {

            if ((accountCurrent.id + '') !== (user.id + '')) {
                actionAccount.push({
                    report: {
                        title: __('Report'),
                        action: () => {
                            dialogReport.open();
                        },
                        icon: 'OutlinedFlagRounded'
                    }
                });
            } else {
                actionAccount.push({
                    history: {
                        title: __('Nhật ký hoạt động'),
                        icon: 'HistoryOutlined',
                        selected: nameButtonActive === 'activity-log',
                        action: () => {
                            disableScroll('/user/' + accountCurrent.slug + '/activity-log');
                        },
                    }
                })
            }
        }

        return (
            <Card
                sx={{
                    position: 'relative',
                }}
            >
                {
                    imageBanner === null &&
                    (
                        user.banner ?
                            <Box
                                sx={{
                                    paddingTop: '35%',
                                    position: 'relative',
                                    width: '100%',
                                    borderRadius: '8px 8px 0 0',
                                    overflow: 'hidden',
                                }}
                            >
                                <ImageLazyLoading
                                    alt="gallery image"
                                    sx={{
                                        backgroundColor: 'divider',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        height: '100%',
                                        width: '100%',
                                    }}
                                    src={getImageUrl(user.banner, '/images/img_placeholder.svg')}
                                />
                            </Box>
                            :
                            <Box
                                sx={{
                                    height: '450px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'divider'
                                }}
                            >
                                <Box
                                    component={Link}
                                    to="/"
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        userSelect: 'none',
                                    }}
                                >
                                    <ImageLazyLoading
                                        src='/images/LOGO-image-full.svg'
                                        sx={{
                                            height: 100,
                                            width: 100,
                                        }}
                                    />
                                    <Typography variant="h2" component="h1" sx={{
                                        lineHeight: '100px',
                                        fontSize: '88px',
                                    }} noWrap>
                                        {'Spacedev.vn'}
                                    </Typography>
                                </Box>
                            </Box>
                    )
                }
                {
                    Boolean(accountCurrent.id && user.id && (accountCurrent.id + '') === (user.id + '')) &&
                    <Dropzone
                        onDrop={(dropped) => setImageBanner(dropped[0])}
                        noClick
                        noKeyboard
                    >
                        {({ getRootProps, getInputProps }) => (
                            !imageBanner ?
                                <section>
                                    <Box
                                        {...getRootProps()}
                                    >
                                        <Button
                                            variant='contained'
                                            color='inherit'
                                            sx={{
                                                position: 'absolute',
                                                right: 10,
                                                top: 10,
                                                borderRadius: '50%',
                                                padding: '6px',
                                                minWidth: 'unset',
                                                minHeight: 'unset',
                                                display: 'flex',
                                                paddingBottom: '5px',
                                                paddingTop: '7px',
                                            }}
                                        >
                                            <Icon icon="PhotoCameraOutlined" />
                                            <input
                                                {...getInputProps()}
                                                accept=".jpg,.png"
                                                style={{
                                                    position: 'absolute',
                                                    top: '0',
                                                    left: '0',
                                                    right: '0',
                                                    bottom: '0',
                                                    opacity: '0',
                                                    cursor: 'pointer',
                                                }} />
                                        </Button>
                                        {/* <Typography align='center' variant='h4' sx={{ fontWeight: 400, lineHeight: '32px' }}>{__('Kéo và thả một tệp hình tại đây hoặc nhấp để chọn hình')}</Typography> */}
                                    </Box>
                                </section>
                                :
                                <div {...getRootProps()}>
                                    <AvatarEditor
                                        ref={avatarElementBannerRef}
                                        width={1294}
                                        height={450}
                                        border={0}
                                        image={imageBanner ?? ''}
                                    />
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            justifyContent: 'flex-end',
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            padding: '16px',
                                            left: 0,
                                            background: 'rgb(0, 0, 0, 0.2)',
                                        }}
                                    >
                                        <Button color='inherit' onClick={() => setImageBanner(null)} sx={{ color: 'white' }}>{__('Hủy')}</Button>
                                        <LoadingButton
                                            loading={isLoadingButtonBanner}
                                            sx={{
                                                backgroundColor: '#3f51b5 !important',
                                                '& .MuiLoadingButton-loadingIndicator': {
                                                    color: 'rgb(255 255 255) !important',
                                                }
                                            }}
                                            variant='contained'
                                            onClick={async () => {
                                                if (avatarElementBannerRef.current) {
                                                    setIsLoadingButtonBanner(true);
                                                    const img = avatarElementBannerRef.current?.getImageScaledToCanvas().toDataURL()
                                                    // const rect = avatarElementRef.current?.getCroppingRect()

                                                    const result = await accountService.me.update.banner(img);

                                                    if (result) {
                                                        if (handleLoadProfile) {
                                                            await handleLoadProfile();
                                                        }
                                                        setImageBanner(null);
                                                    }

                                                    setIsLoadingButtonBanner(false);

                                                }
                                            }}
                                        >{__('Lưu thay đổi')}</LoadingButton>
                                    </Box>
                                </div>
                        )}
                    </Dropzone>
                    // <Button
                    //     variant='contained'
                    //     color='inherit'
                    //     sx={{
                    //         position: 'absolute',
                    //         right: 10,
                    //         top: 10,
                    //         borderRadius: '50%',
                    //         padding: '6px',
                    //         minWidth: 'unset',
                    //         minHeight: 'unset',
                    //         display: 'flex',
                    //         paddingBottom: '5px',
                    //         paddingTop: '7px',
                    //     }}
                    //     onClick={() => { setOpenEditAvatar(true); setImage(null); }}
                    // >
                    //     <Icon icon="PhotoCameraOutlined" />
                    // </Button>
                }

                <CardContent sx={{ pt: 0, pb: '0 !important' }}>
                    <Box
                        sx={(theme) => ({
                            display: 'flex',
                            position: 'relative',
                            [theme.breakpoints.down('md')]: {
                                flexDirection: 'column',
                                alignItems: 'center',
                                pb: 2,
                                marginTop: '-90px',
                            },
                        })}
                    >
                        <Box
                            sx={(theme) => ({
                                position: 'absolute',
                                padding: 0.5,
                                borderRadius: '50%',
                                background: theme.palette.background.paper,
                                left: 0,
                                top: -70,
                                [theme.breakpoints.down('md')]: {
                                    position: 'relative',
                                    top: 0,
                                }
                            })}
                        >
                            <ImageLazyLoading
                                src={getImageUrl(user.avatar, '/images/user-default.svg')}
                                placeholderSrc='/images/user-default.svg'
                                name={user.full_name}
                                sx={{
                                    width: 168,
                                    height: 168,
                                    borderRadius: '50%',
                                }}
                                variant="circular"
                            />
                            {
                                Boolean(accountCurrent.id && user.id && (accountCurrent.id + '') === (user.id + '')) &&
                                <>
                                    <Button
                                        variant='contained'
                                        color='inherit'
                                        sx={{
                                            position: 'absolute',
                                            right: 0,
                                            bottom: '20px',
                                            borderRadius: '50%',
                                            padding: '6px',
                                            minWidth: 'unset',
                                            minHeight: 'unset',
                                            display: 'flex',
                                            paddingBottom: '5px',
                                            paddingTop: '7px',
                                        }}
                                        onClick={() => { setOpenEditAvatar(true); setImage(null); }}
                                    >
                                        <Icon icon="PhotoCameraOutlined" />
                                    </Button>

                                    <Dialog
                                        title={__('Cập nhật ảnh đại diện')}
                                        open={openEditAvatar}
                                        onClose={() => setOpenEditAvatar(false)}
                                        action={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 1,
                                                }}
                                            >
                                                <Button onClick={() => setOpenEditAvatar(false)} color='inherit'>{__('Hủy')}</Button>
                                                <LoadingButton
                                                    disabled={!image}
                                                    loadingPosition='center'
                                                    loading={loadingUploadAvatar}
                                                    onClick={async () => {
                                                        if (avatarElementRef.current) {
                                                            setLoadingUploadAvatar(true);
                                                            const img = avatarElementRef.current?.getImageScaledToCanvas().toDataURL()
                                                            // const rect = avatarElementRef.current?.getCroppingRect()

                                                            const result = await accountService.me.update.avatar(img);

                                                            if (result) {
                                                                dispatch(forceUpdateInfo());
                                                                if (handleLoadProfile) {
                                                                    await handleLoadProfile();
                                                                }
                                                                setLoadingUploadAvatar(false);
                                                                setOpenEditAvatar(false);
                                                            }
                                                        }
                                                    }}>{__('Lưu thay đổi')}</LoadingButton>
                                            </Box>
                                        }
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Dropzone
                                                onDrop={(dropped) => setImage(dropped[0])}
                                                noClick
                                                noKeyboard
                                            >
                                                {({ getRootProps, getInputProps }) => (
                                                    !image ?
                                                        <section>
                                                            <Box
                                                                {...getRootProps()}
                                                                sx={{
                                                                    width: '350px',
                                                                    height: '350px',
                                                                    position: 'relative',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <input
                                                                    {...getInputProps()}
                                                                    accept=".jpg,.png"
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '0',
                                                                        left: '0',
                                                                        right: '0',
                                                                        bottom: '0',
                                                                        opacity: '0',
                                                                        cursor: 'pointer',
                                                                    }} />
                                                                <Typography align='center' variant='h4' sx={{ fontWeight: 400, lineHeight: '32px' }}>{__('Kéo và thả một tệp hình tại đây hoặc nhấp để chọn hình')}</Typography>
                                                            </Box>
                                                        </section>
                                                        :
                                                        <>
                                                            <div {...getRootProps()}>
                                                                <AvatarEditor
                                                                    ref={avatarElementRef}
                                                                    width={300}
                                                                    height={300}
                                                                    borderRadius={300}
                                                                    border={50}
                                                                    scale={valueScale}
                                                                    image={image ?? ''}
                                                                />
                                                            </div>
                                                            <Stack spacing={2} direction="row" sx={{ mb: 1, width: '100%' }} alignItems="center">
                                                                <IconButton
                                                                    onClick={() => setValueScale(prev => (prev - 0.16) < 1 ? 1 : prev - 0.16)}
                                                                >
                                                                    <Icon icon="RemoveRounded" />
                                                                </IconButton>
                                                                <Slider aria-label="Volume" min={1} max={3} step={0.01} value={valueScale} onChange={handleChange} />
                                                                <IconButton
                                                                    onClick={() => setValueScale(prev => (prev + 0.16) > 3 ? 3 : prev + 0.16)}
                                                                >
                                                                    <Icon icon="AddRounded" />
                                                                </IconButton>
                                                            </Stack>
                                                        </>
                                                )}
                                            </Dropzone>
                                        </Box>
                                    </Dialog>
                                </>
                            }
                        </Box>
                        <Box
                            sx={{
                                width: 194,
                                [theme.breakpoints.down('md')]: {
                                    display: 'none',
                                }
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                pt: 2,
                                pb: 2,
                                minHeight: 124,
                                [theme.breakpoints.down('md')]: {
                                    alignItems: 'center',
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'center',
                                }}
                            >
                                <Link onClick={() => disableScroll("/user/" + user.slug)} to={"/user/" + user.slug} ><Typography variant='h2' component='h1' sx={{
                                    [theme.breakpoints.down('sm')]: {
                                        fontSize: 22,
                                    }
                                }}>{user.full_name}</Typography></Link>
                                {
                                    Boolean(user.is_verified) &&
                                    <TooltipVerifiedAccount />
                                }
                            </Box>
                            {
                                Boolean(user.job_title) &&
                                <Typography variant='h5' component='h2' sx={{ fontWeight: 'normal', }}>{user.job_title}</Typography>
                            }
                            {
                                Boolean(user.website) &&
                                <Typography>
                                    <LinkMui href={user.website} sx={{ color: "text.link" }} target={'_blank'} rel="nofollow">{user.website}</LinkMui>
                                </Typography>
                            }
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                flex: '1 1',
                                gap: 1,
                            }}
                        >
                            {
                                // Boolean(accountCurrent.id && user.id && (accountCurrent.id + '') !== (user.id + '')) &&
                                // <Button
                                //     startIcon={<Icon icon="Chat" />}
                                //     variant="contained"
                                //     color={nameButtonActive === 'contact' ? 'primary' : 'inherit'}
                                // >
                                //     {__('Contact')}
                                // </Button>
                            }
                            {
                                Boolean(accountCurrent.id && user.id && (accountCurrent.id + '') === (user.id + '')) &&
                                <>
                                    <Button
                                        variant='outlined'
                                        disableRipple
                                        onClick={() => {
                                            disableScroll('/user/' + accountCurrent.slug + '/edit-profile/overview');
                                        }}
                                        startIcon={<Icon icon="CreateRounded" />}
                                        color={nameButtonActive === 'edit-profile' ? 'primary' : 'inherit'}
                                    >
                                        {__('Chỉnh sửa hồ sơ')}
                                    </Button>
                                </>
                            }
                        </Box>
                    </Box>
                    {
                        user.account_status !== 'blocked' &&
                        <>
                            <Divider color='dark' />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        '& .btnLink': {
                                            borderBottom: '2px solid',
                                            borderColor: 'transparent',
                                            height: 60,
                                            borderRadius: 0,
                                            pr: 2,
                                            pl: 2,
                                            '&.active': {
                                                borderColor: 'primary.main',
                                            }
                                        }
                                    }}
                                >
                                    {
                                        Boolean(accountCurrent.id && user.id && (accountCurrent.id + '') === (user.id + '')) &&
                                        <Button
                                            size='large'
                                            disableRipple
                                            sx={{ textTransform: 'none', fontWeight: 400 }}
                                            color={nameButtonActive === 'my-learning' ? 'primary' : 'inherit'}
                                            onClick={() => {
                                                disableScroll('/user/' + user.slug + '/my-learning');
                                            }}
                                            className={addClasses({
                                                btnLink: true,
                                                active: nameButtonActive === 'my-learning'
                                            })}
                                        >
                                            {__('Khóa học đã đăng ký')}
                                        </Button>
                                    }
                                    {/* <Button
                                size='large'
                                sx={{ textTransform: 'none', fontWeight: 400 }}
                                color={nameButtonActive === 'posts' ? 'primary' : 'inherit'}
                                onClick={() => {
                                    disableScroll('/user/' + user.slug);
                                }}
                                className={addClasses({
                                    btnLink: true,
                                    active: nameButtonActive === 'posts'
                                })}
                            >
                                {__('Posts')}
                            </Button> */}
                                    {
                                        Boolean(!accountCurrent.id || (user.id && (accountCurrent.id + '') !== (user.id + ''))) &&
                                        <Button
                                            size='large'
                                            disableRipple
                                            sx={{ textTransform: 'none', fontWeight: 400 }}
                                            color={nameButtonActive === 'course-enrolled' ? 'primary' : 'inherit'}
                                            onClick={() => {
                                                disableScroll('/user/' + user.slug + '/course-enrolled');
                                            }}
                                            className={addClasses({
                                                btnLink: true,
                                                active: nameButtonActive === 'course-enrolled'
                                            })}
                                        >
                                            {__('Khóa học đã đăng ký')}
                                        </Button>
                                    }
                                    {
                                        !isMobile &&
                                        <Button
                                            size='large'
                                            disableRipple
                                            sx={{ textTransform: 'none', fontWeight: 400 }}
                                            color={nameButtonActive === 'my-course' ? 'primary' : 'inherit'}
                                            onClick={() => {
                                                disableScroll('/user/' + user.slug + '/my-course');
                                            }}
                                            className={addClasses({
                                                btnLink: true,
                                                active: nameButtonActive === 'my-course'
                                            })}
                                        >
                                            {__('Khóa học đang dạy')}
                                        </Button>
                                    }


                                    <Button
                                        size='large'
                                        disableRipple
                                        sx={{ textTransform: 'none', fontWeight: 400 }}
                                        color={nameButtonActive === 'roadmap' ? 'primary' : 'inherit'}
                                        onClick={() => {
                                            disableScroll('/user/' + user.slug + '/roadmap');
                                        }}
                                        className={addClasses({
                                            btnLink: true,
                                            active: nameButtonActive === 'roadmap'
                                        })}
                                    >
                                        {__('Roadmap')}
                                    </Button>

                                    {
                                        Boolean(!isMobile && accountCurrent.id && user.id && (accountCurrent.id + '') === (user.id + '')) &&
                                        <>
                                            <Button
                                                size='large'
                                                disableRipple
                                                sx={{ textTransform: 'none', fontWeight: 400 }}
                                                color={nameButtonActive === 'orders' ? 'primary' : 'inherit'}
                                                onClick={() => {
                                                    disableScroll('/user/' + user.slug + '/orders');
                                                }}
                                                className={addClasses({
                                                    btnLink: true,
                                                    active: nameButtonActive === 'orders'
                                                })}
                                            >
                                                {__('Lịch sử mua hàng')}
                                            </Button>
                                            <Button
                                                size='large'
                                                disableRipple
                                                sx={{ textTransform: 'none', fontWeight: 400 }}
                                                color={nameButtonActive === 'course-giveaway' ? 'primary' : 'inherit'}
                                                onClick={() => {
                                                    disableScroll('/user/' + user.slug + '/course-giveaway');
                                                }}
                                                className={addClasses({
                                                    btnLink: true,
                                                    active: nameButtonActive === 'course-giveaway'
                                                })}
                                            >
                                                {__('Tặng khóa học')}
                                            </Button>
                                        </>
                                    }

                                    {/* <Button
                                size='large'
                                sx={{ textTransform: 'none', fontWeight: 400 }}
                                color={nameButtonActive === 'blog' ? 'primary' : 'inherit'}
                                onClick={() => {
                                    disableScroll('/user/' + user.slug + '/blog');
                                }}
                                className={addClasses({
                                    btnLink: true,
                                    active: nameButtonActive === 'blog'
                                })}
                            >
                                {__('Bài blog đã viết')}
                            </Button> */}

                                    {/* <Button
                                size='large'
                                sx={{ textTransform: 'none', fontWeight: 400 }}
                                color={nameButtonActive === 'cv' ? 'primary' : 'inherit'}
                                onClick={() => {
                                    disableScroll('/user/' + user.slug + '/cv');
                                }}
                                className={addClasses({
                                    btnLink: true,
                                    active: nameButtonActive === 'cv'
                                })}
                            >
                                {__('Curriculum Vitae')}
                            </Button> */}

                                    {
                                        (() => {

                                            if (isMobile) {
                                                let actions: Array<{
                                                    [key: string]: {
                                                        title: string,
                                                        action: () => void,
                                                        icon?: IconFormat,
                                                        selected?: boolean,
                                                    }
                                                } | Array<{
                                                    title: string,
                                                    action: () => void,
                                                    icon?: IconFormat,
                                                    selected?: boolean,
                                                }>> = [{}];

                                                actions[0] = {
                                                    myCourse: {
                                                        title: __('Khóa học đang dạy'),
                                                        icon: 'BookmarksOutlined',
                                                        selected: nameButtonActive === 'my-course',
                                                        action: () => {
                                                            disableScroll('/user/' + user.slug + '/my-course');
                                                        }
                                                    },
                                                };

                                                if (accountCurrent.id && user.id && (accountCurrent.id + '') === (user.id + '')) {
                                                    actions[0] = {
                                                        ...actions[0],
                                                        orders: {
                                                            title: __('Lịch sử mua hàng'),
                                                            icon: 'HistoryRounded',
                                                            selected: nameButtonActive === 'orders',
                                                            action: () => {
                                                                disableScroll('/user/' + user.slug + '/orders');
                                                            }
                                                        },
                                                        courseGiveaway: {
                                                            title: __('Tặng khóa học'),
                                                            icon: 'CardGiftcardRounded',
                                                            selected: nameButtonActive === 'course-giveaway',
                                                            action: () => {
                                                                disableScroll('/user/' + user.slug + '/course-giveaway');
                                                            }
                                                        }
                                                    };
                                                }

                                                return <MoreButton
                                                    actions={actions}
                                                >
                                                    <Button
                                                        size='large'
                                                        sx={{ textTransform: 'none', fontWeight: 400 }}
                                                        color={'inherit'}
                                                        endIcon={<Icon icon="ArrowDropDown" />}
                                                        className={addClasses({
                                                            btnLink: true,
                                                        })}
                                                    >
                                                        {__('Xem thêm')}
                                                    </Button>
                                                </MoreButton>

                                            }

                                            return null;
                                        })()
                                    }
                                </Box>
                                {/* <Box>
                            {
                                actionAccount.length > 0 &&
                                <MoreButton
                                    icon="MoreHorizRounded"
                                    actions={actionAccount}
                                />
                            }
                            {
                                Boolean(accountCurrent.id && user.id && (accountCurrent.id + '') !== (user.id + '')) &&
                                dialogReport.component
                            }
                        </Box> */}
                            </Box>
                        </>
                    }
                </CardContent>
            </Card >
        )
    }

    return (
        <Card
            sx={{
                position: 'relative',
            }}
        >

            <Skeleton variant='rectangular' sx={{
                maxWidth: '100%',
                paddingTop: '35%',
                position: 'relative',
                width: '100%',
                borderRadius: '8px 8px 0 0',
                overflow: 'hidden',
            }}>
                <ImageLazyLoading alt="gallery image" sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                }} src={'/images/img_placeholder.svg'} />
            </Skeleton>
            <CardContent sx={{ pt: 0, pb: '0 !important' }}>
                <Box
                    sx={(theme) => ({
                        display: 'flex',
                        position: 'relative',
                        [theme.breakpoints.down('md')]: {
                            flexDirection: 'column',
                            alignItems: 'center',
                            pb: 2,
                            marginTop: '-90px',
                        },
                    })}
                >
                    <Box
                        sx={(theme) => ({
                            position: 'absolute',
                            padding: 0.5,
                            borderRadius: '50%',
                            background: theme.palette.background.paper,
                            left: 0,
                            top: -70,
                            [theme.breakpoints.down('md')]: {
                                position: 'relative',
                                top: 0,
                            }
                        })}
                    >
                        <Skeleton variant='circular'>
                            <Avatar
                                image={'/images/img_placeholder.svg'}
                                name={'Image Placeholder'}
                                sx={{
                                    width: 168,
                                    height: 168
                                }}
                                variant="circular"
                                src="/images/img_placeholder.svg"
                            />
                        </Skeleton>
                    </Box>
                    <Box
                        sx={{
                            width: 194,
                            [theme.breakpoints.down('md')]: {
                                display: 'none',
                            }
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            pt: 2,
                            pb: 2,
                            minHeight: 124,
                            alignItems: 'center',
                        }}
                    >
                        <Skeleton variant='text'>
                            <Typography variant='h2' component='h1'>Loremipsumdolorsi</Typography>
                        </Skeleton>
                        <Skeleton variant='text'>
                            <Typography variant='h5' component='h2'>Lorem ipsum dolor sit</Typography>
                        </Skeleton>
                        <Skeleton variant='text'>
                            <Typography>https://dangthuyenquan.com</Typography>
                        </Skeleton>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            flex: '1 1',
                            gap: 1,
                        }}
                    >
                        {
                            isTemplateProfile ?
                                <>
                                    <Skeleton variant='rectangular'>
                                        <Button
                                            variant='contained'
                                            startIcon={<Icon icon="BookmarksOutlined" />}
                                            color={nameButtonActive === 'my-learning' ? 'primary' : 'inherit'}
                                        >
                                            {__('Quá trình học tập')}
                                        </Button>
                                    </Skeleton>
                                    <Skeleton variant='rectangular'>
                                        <Button
                                            variant='contained'
                                            startIcon={<Icon icon="AssignmentIndOutlined" />}
                                            color={nameButtonActive === 'edit-profile' ? 'primary' : 'inherit'}
                                        >
                                            {__('Edit Profile')}
                                        </Button>
                                    </Skeleton>
                                </>
                                :
                                <Skeleton variant='rectangular'>
                                    <Button
                                        startIcon={<Icon icon="Chat" />}
                                        variant="contained"
                                        color={nameButtonActive === 'contact' ? 'primary' : 'inherit'}
                                    >
                                        {__('Liên hệ')}
                                    </Button>
                                </Skeleton>
                        }
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        '& .btnLink': {
                            borderBottom: '2px solid',
                            borderColor: 'transparent',
                            height: 60,
                            borderRadius: 0,
                            '&.active': {
                                borderColor: 'primary.main',
                            }
                        }
                    }}
                >
                    <Skeleton variant='rectangular'>
                        <Button
                            size='large'
                            sx={{ textTransform: 'none', fontWeight: 400 }}
                            className={addClasses({
                                btnLink: true,
                            })}
                        >
                            {__('Curriculum Vitae')}
                        </Button>
                    </Skeleton>
                    <Skeleton variant='rectangular'>
                        <Button
                            size='large'
                            sx={{ textTransform: 'none', fontWeight: 400 }}
                            className={addClasses({
                                btnLink: true,
                            })}
                        >
                            {__('Khóa học đã đăng ký')}
                        </Button>
                    </Skeleton>
                    <Skeleton variant='rectangular'>
                        <Button
                            size='large'
                            sx={{ textTransform: 'none', fontWeight: 400 }}
                            className={addClasses({
                                btnLink: true,
                            })}
                        >
                            {__('Khóa học đang dạy')}
                        </Button>
                    </Skeleton>
                    <Skeleton variant='rectangular'>
                        <Button
                            size='large'
                            sx={{ textTransform: 'none', fontWeight: 400 }}
                            className={addClasses({
                                btnLink: true,
                            })}
                        >
                            {__('Edit Profile')}
                        </Button>
                    </Skeleton>
                </Box>
            </CardContent>
        </Card >
    )
}

export default ProfileTop