import { Box, Button, Card, CardContent, Link as LinkMui, Skeleton, Typography, useTheme } from '@mui/material';
import Avatar from 'components/atoms/Avatar';
import Divider from 'components/atoms/Divider';
import Icon, { IconFormat } from 'components/atoms/Icon';
import { default as Image, default as ImageLazyLoading } from 'components/atoms/ImageLazyLoading';
import { useTransferLinkDisableScroll } from 'components/atoms/ScrollToTop';
import { addClasses } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import useReportPostType from 'hook/useReportPostType';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { REPORT_TYPE } from 'services/accountService';
import { RootState } from 'store/configureStore';
import { UserProps } from 'store/user/user.reducers';

function ProfileTop({ user, isTemplateProfile = true, nameButtonActive = 'edit-profile' }: {
    user: UserProps | null,
    isTemplateProfile?: boolean,
    nameButtonActive: string
}) {

    const accountCurrent = useSelector((state: RootState) => state.user);

    const theme = useTheme();

    const disableScroll = useTransferLinkDisableScroll();

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

                <Image alt="gallery image" sx={{ borderRadius: '8px 8px 0 0', height: '300px' }} src={'https://minimal-assets-api.vercel.app/assets/images/covers/cover_2.jpg'} />
                <CardContent sx={{ pt: 0, pb: '0 !important' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                padding: 0.5,
                                borderRadius: '50%',
                                background: theme.palette.background.paper,
                                left: 0,
                                top: -70
                            }}
                        >
                            <ImageLazyLoading
                                src={getImageUrl(user.avatar, '/images/user-default.svg')}
                                name={user.full_name}
                                sx={{
                                    width: 168,
                                    height: 168,
                                    borderRadius: '50%',
                                }}
                                variant="circular"
                            />
                        </Box>
                        <Box sx={{ width: 194 }}></Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                pt: 2,
                                pb: 2
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'center',
                                }}
                            >
                                <Link onClick={() => disableScroll("/user/" + user.slug)} to={"/user/" + user.slug} ><Typography variant='h2' component='h1'>{user.full_name}</Typography></Link>
                                {/* <Tooltip
                                    placement='top'
                                    title={__('Huy hiệu xác minh xác nhận các thông tin người dùng cung cấp là đúng và phù hợp với quy định của nền tảng.')}
                                >
                                    <Icon icon="CheckCircle" sx={{ color: "primary.main" }} />
                                </Tooltip> */}
                            </Box>
                            <Typography variant='h5' component='h2' sx={{ fontWeight: 'normal', opacity: 0, }}>{user.job_title}</Typography>
                            <Typography>
                                {
                                    Boolean(user.website) &&
                                    <LinkMui href={user.website} sx={{ color: "text.link" }} target={'_blank'} >{user.website}</LinkMui>
                                }
                                &nbsp;
                            </Typography>
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
                                Boolean(accountCurrent.id && user.id && (accountCurrent.id + '') !== (user.id + '')) &&
                                <Button
                                    startIcon={<Icon icon="Chat" />}
                                    variant="contained"
                                    color={nameButtonActive === 'contact' ? 'primary' : 'inherit'}
                                >
                                    {__('Contact')}
                                </Button>
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
                                        startIcon={<Icon icon="AssignmentIndOutlined" />}
                                        color={nameButtonActive === 'edit-profile' ? 'primary' : 'inherit'}
                                    >
                                        {__('Edit Profile')}
                                    </Button>
                                </>
                            }
                        </Box>
                    </Box>
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
                                    {__('My learning')}
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
                            {/* <MoreButton
                                actions={[
                                    {
                                        blog: {
                                            title: __('Bài blog đã viết'),
                                            icon: 'RssFeedRounded',
                                            selected: nameButtonActive === 'blog',
                                            action: () => {
                                                disableScroll('/user/' + user.slug + '/blog');
                                            }
                                        },
                                    }
                                ]}
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
                            </MoreButton> */}
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

            <Skeleton variant='rectangular' sx={{ width: '100%', maxWidth: '100%' }}>
                <Image alt="gallery image" sx={{ borderRadius: '8px 8px 0 0', height: '300px' }} src={'/images/img_placeholder.svg'} />
            </Skeleton>
            <CardContent sx={{ pt: 0, pb: '0 !important' }}>
                <Box
                    sx={{
                        display: 'flex',
                        position: 'relative',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            padding: 0.5,
                            borderRadius: '50%',
                            left: 0,
                            top: -70
                        }}
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
                    <Box sx={{ width: 194 }}></Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            pt: 2,
                            pb: 2
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
                                            {__('My learning')}
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
                                        {__('Contact')}
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
        </Card>
    )
}

export default ProfileTop