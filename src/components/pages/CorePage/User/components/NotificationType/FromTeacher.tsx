import ListItemButton from "@mui/material/ListItemButton";
import Badge from "components/atoms/Badge";
import Box from "components/atoms/Box";
import Icon from "components/atoms/Icon";
import ImageLazyLoading from "components/atoms/ImageLazyLoading";
import ListItemIcon from "components/atoms/ListItemIcon";
import ListItemText from "components/atoms/ListItemText";
import Typography from "components/atoms/Typography";
import { dateTimefromNow } from "helpers/date";
import { __param } from "helpers/i18n";
import { getImageUrl } from "helpers/image";
import React from "react";
import { useNavigate } from "react-router-dom";
import { NotificationProps } from 'services/courseService';
import { useUser } from "store/user/user.reducers";


function FromTeacher({ notification, handleClickNotification }: {
    notification: NotificationProps,
    handleClickNotification: (notification: NotificationProps) => Promise<void>,
}) {

    const [notificationState, setNotificationState] = React.useState<NotificationProps | null>(notification);
    const user = useUser();

    const navigate = useNavigate();

    React.useEffect(() => {
        setNotificationState(notification);
    }, [notification]);

    if (notificationState) {
        return (
            <ListItemButton
                sx={{
                    gap: 2,
                }}
                onClick={() => {
                    handleClickNotification(notificationState);

                    setNotificationState(prev => (prev ? {
                        ...prev,
                        is_read: 1,
                    } : null))

                    if (notification.addin_data.link_redirect) {
                        navigate(notification.addin_data.link_redirect);
                    }
                }}
            >
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={<Icon sx={{ color: 'white' }} icon={notificationState.addin_data.announcement_type} iconBackup="NotificationsOutlined" />}
                    sx={{
                        '& .MuiBadge-badge': {
                            background: 'linear-gradient(to right bottom, #36EAEF, #6B0AC9)',
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            padding: '5px',
                        },
                        '& .MuiSvgIcon-root': {
                            width: 18,
                        }
                    }}
                >
                    <ListItemIcon>
                        <ImageLazyLoading
                            src={getImageUrl(notificationState.sender_object?.avatar, '/images/user-default.svg')}
                            title={'Avatar'}
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                            }}
                        />
                    </ListItemIcon>
                </Badge>
                <ListItemText
                    primary={<>
                        <Box sx={{
                            marginTop: 0.5,
                            width: '100%',
                            '& p': {
                                margin: 0,
                            }
                        }} dangerouslySetInnerHTML={{
                            __html: __param(notification.message, {
                                user: '<strong>' + user.full_name + '</strong>',
                            })
                        }} />
                        <Typography
                            variant="subtitle2"
                            color='primary'
                            sx={{
                                mt: 0.5,
                                display: 'flex',
                                alignItems: 'center',

                            }}
                        >
                            {dateTimefromNow(notificationState.created_at)}
                        </Typography>
                    </>}
                />
                < Box
                    sx={{
                        flexShrink: 0,
                        width: 12,
                        height: 12,
                        opacity: Number(notificationState.is_read) === 1 ? 0 : 1,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main'
                    }
                    }
                />
            </ListItemButton >
        )
    }

    return <></>;
}

export default FromTeacher