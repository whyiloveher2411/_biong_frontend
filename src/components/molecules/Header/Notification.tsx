import { LoadingButton } from "@mui/lab";
import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Badge from "components/atoms/Badge";
import Box from "components/atoms/Box";
import Button from "components/atoms/Button";
import CodeBlock from "components/atoms/CodeBlock";
import Divider from "components/atoms/Divider";
import Icon from "components/atoms/Icon";
import IconButton from "components/atoms/IconButton";
import List from "components/atoms/List";
import ListItem from "components/atoms/ListItem";
import Loading from "components/atoms/Loading";
import MenuPopper from "components/atoms/MenuPopper";
import Skeleton from "components/atoms/Skeleton";
import Tooltip from "components/atoms/Tooltip";
import Typography from "components/atoms/Typography";
import FieldForm from "components/atoms/fields/FieldForm";
import FormWrapper from "components/atoms/fields/FormWrapper";
import NotificationType from "components/pages/CorePage/User/components/NotificationType";
import { getCookie, setCookie } from "helpers/cookie";
import { __ } from "helpers/i18n";
import useAjax from "hook/useApi";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import userService from 'services/accountService';
import courseService, { NotificationProps } from "services/courseService";
import { useSetting } from "store/setting/settings.reducers";
import { UserProps, UserState, forceUpdateInfo, updateInfo } from "store/user/user.reducers";
import Dialog from "../Dialog";
import CourseSingle from "../CourseSingle";

const useStyles = makeStyles(({ zIndex, palette }: Theme) => ({
    searchPopper: {
        zIndex: zIndex.appBar + 100,
    },
    searchPopperContent: {
        maxHeight: '80vh',
        overflow: 'auto',
        minWidth: 300,
        maxWidth: '100%',
    },
    notification: {
        // borderBottom: '1px solid ' + palette.dividerDark,
        gap: 12,
    },
    notificationIcon: {
        backgroundColor: palette.primary.main,
        marginTop: 4
    },
    notificationTitle: {
        overflow: 'hidden', width: '100%', display: '-webkit-box', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical'
    },
    notificationContent: {
        marginTop: 4, width: '100%',
    },
}));

export default function Notification({ user }: { user: UserProps }) {

    const classes = useStyles();

    const notificationRef = useRef(null);

    const formUpdateProfileRef = useRef<{
        submit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
    }>(null);

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const setting = useSetting();

    const [openNotifications, setOpenNotifications] = useState(false);
    const [openDialogNotifications, setOpenDialogNotifications] = useState(true);

    const useAjax1 = useAjax({ loadingType: 'custom' });

    const dispatch = useDispatch();

    const [notificationContent, setNotificationContent] = React.useState<NotificationProps[] | null>(null);

    const onClickShowNotification = () => {
        if (!openNotifications) {
            setOpenNotifications(true);

            (async () => {
                const notifications = await courseService.me.notification.loadFirst();

                setNotificationContent(notifications);
            })()
        }
    };

    const handleClickNotification = async (notification: NotificationProps) => {

        if (Number(notification.is_read) !== 1) {
            const result = await courseService.me.notification.postNotification(notification.id);

            dispatch(updateInfo({
                notification_unread: result
            }))
        }

        onCloseNotification();
    }

    const onCloseNotification = () => {
        setOpenNotifications(false);
    }

    return (
        <>
            <Tooltip title={__("Notification")}>
                <IconButton
                    color="inherit"
                    onClick={onClickShowNotification}
                    ref={notificationRef}
                    size="large"
                >
                    <Badge badgeContent={user.notification_unread} max={10} color="secondary">
                        <Icon icon="NotificationsNoneOutlined" />
                    </Badge>
                </IconButton>
            </Tooltip>

            {
                openDialogNotifications ?
                    user.notification_important && user.notification_important?.length > 0 ?
                        <Dialog
                            title={__('Thông báo')}
                            open={Boolean(user.notification_important?.length && openDialogNotifications)}
                            onClose={() => {
                                setOpenDialogNotifications(false);
                            }}
                        >
                            <List>
                                {
                                    user.notification_important?.map((item) => <NotificationType
                                        key={item.id}
                                        handleClickNotification={async () => setOpenDialogNotifications(false)}
                                        notification={item}
                                    />)
                                }
                            </List>
                        </Dialog>
                        : !getCookie(setting.global?.notification_name ? setting.global?.notification_name : 'watched_notification') && setting.global?.notification?.filter(item => !item.delete).length ?
                            <Dialog
                                title={__('Thông báo')}
                                open={Boolean(setting.global?.notification?.length && openDialogNotifications)}
                                onClose={() => {
                                    setOpenDialogNotifications(false);
                                    setCookie(setting.global?.notification_name ? setting.global?.notification_name : 'watched_notification', '1', 1 / 24);
                                }}
                            >
                                {
                                    setting.global?.notification?.filter(item => !item.delete).map((item, index) => (
                                        <Box key={index}>
                                            <Typography variant="h4">{item.title}</Typography>
                                            <CodeBlock html={item.content} />
                                            {
                                                item.course ?
                                                    <CourseSingle
                                                        course={item.course}
                                                        onClick={() => {
                                                            setOpenDialogNotifications(false);
                                                            setCookie(setting.global?.notification_name ? setting.global?.notification_name : 'watched_notification', '1', 1 / 24);
                                                        }}
                                                    />
                                                    : null
                                            }
                                        </Box>
                                    ))
                                }
                            </Dialog>
                            : user._state === UserState.identify && user.full_name === '[Chưa cập nhật]' ?
                                <Dialog
                                    title={__('Cập nhật thông tin')}
                                    open={openDialogNotifications}
                                    onClose={() => {
                                        setOpenDialogNotifications(false);
                                    }}
                                    action={<LoadingButton
                                        loading={isLoadingButton}
                                        variant="contained"
                                        onClick={() => formUpdateProfileRef.current?.submit()}
                                    >
                                        Cập nhật
                                    </LoadingButton>}
                                >
                                    <Typography sx={{ mb: 2 }} variant="h4">Vui lòng cập nhật họ và tên</Typography>
                                    <FormWrapper
                                        ref={formUpdateProfileRef}
                                        onFinish={(post) => {
                                            setIsLoadingButton(true);
                                            (async () => {
                                                let result = await userService.updateInfo(post);
                                                setIsLoadingButton(false);
                                                if (result) {
                                                    dispatch(forceUpdateInfo());
                                                }
                                            })();
                                        }}
                                    >
                                        <FieldForm
                                            component="text"
                                            config={{
                                                title: 'Họ và Tên',
                                                rules: {
                                                    require: true,
                                                    minLength: 6,
                                                    maxLength: 60,
                                                }
                                            }}
                                            name="full_name"
                                        />
                                    </FormWrapper>
                                </Dialog>
                                : null
                    : null
            }
            <MenuPopper
                anchorEl={notificationRef.current}
                className={classes.searchPopper}
                open={openNotifications}
                onClose={() => setOpenNotifications(false)}
                paperProps={{
                    style: { width: 400, maxWidth: '100%' },
                    className: classes.searchPopperContent + ' custom_scroll',
                    sx: {
                        border: '1px solid',
                        borderColor: 'dividerDark',
                    }
                }}
            >
                <List>
                    {
                        useAjax1.open ?
                            [1, 2, 3, 4].map(item => (
                                <ListItem
                                    className={classes.notification}
                                    key={item}
                                >
                                    <div style={{ width: '100%' }}>
                                        <Skeleton variant="text" height={20} width="100%" />
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: "flex-start",
                                                width: '100%',
                                                gridGap: 16
                                            }}
                                        >
                                            <div style={{ height: '100%' }}>
                                                <Skeleton variant="circular" width={40} style={{ marginTop: 8 }} height={40} />
                                            </div>
                                            <div style={{ width: '100%' }}>
                                                <Skeleton variant="text" height={22} width="100%" />
                                                <Skeleton variant="text" style={{ transform: 'scale(1)' }} height={40} width="100%" />
                                            </div>
                                        </Box>
                                    </div>
                                </ListItem>
                            ))
                            :
                            notificationContent ?
                                notificationContent.length > 0 ?
                                    <>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                padding: 2,
                                            }}
                                        >
                                            <Box sx={{ flexGrow: 1, width: '100%' }}>
                                                <Typography variant="subtitle1">Thông báo</Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {__('bạn có {{totalUnRead}} thông báo chưa đọc', {
                                                        totalUnRead: user.notification_unread
                                                    })}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Button sx={{
                                                    width: 'auto', textTransform: 'none',
                                                    fontSize: '16px',
                                                    fontWeight: 400,
                                                }} onClick={onCloseNotification} color="primary" component={Link} to={'/user/' + user.slug + '/notification'} fullWidth disableRipple>
                                                    {__('Xem tất cả')}
                                                </Button>
                                            </Box>
                                        </Box>

                                        {/* <Typography style={{ padding: '8px 16px 16px' }} variant="h5">{__("Notifications")}</Typography> */}
                                        <Divider color="dark" sx={{ borderStyle: 'dashed' }} />
                                        {
                                            notificationContent.map((item) => <NotificationType
                                                key={item.id}
                                                handleClickNotification={handleClickNotification}
                                                notification={item}
                                            />)
                                        }
                                    </>
                                    :
                                    <ListItem
                                        onClick={() => setOpenNotifications(false)}
                                        className={classes.notification}
                                    >
                                        <Typography style={{ width: '100%', padding: '46px 0', fontSize: 20 }} align="center" variant="body1">{__("Không tìm thấy thông báo nào")}</Typography>
                                    </ListItem>
                                :
                                <ListItem
                                    onClick={() => setOpenNotifications(false)}
                                    className={classes.notification}
                                    sx={{
                                        minHeight: 240,
                                        position: 'relative',
                                    }}
                                >
                                    <Loading open isCover />
                                </ListItem>
                    }
                </List>
            </MenuPopper>
        </>
    );
}
