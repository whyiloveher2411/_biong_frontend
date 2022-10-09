import { Box, Typography } from '@mui/material';
import { PaginationProps } from 'components/atoms/TablePagination';
import { __ } from 'helpers/i18n';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import courseService, { NotificationProps } from 'services/courseService';
import { RootState } from 'store/configureStore';
import { updateInfo, UserProps, UserState } from 'store/user/user.reducers';
import NotificationType from './NotificationType';

function Notification({ user }: {
    user: UserProps
}) {

    const myAccount = useSelector((state: RootState) => state.user);

    const [notificationContent, setNotificationContent] = React.useState<PaginationProps<NotificationProps> | null>(null);

    const dispath = useDispatch();

    const handleOnloadNotification = () => {
        (async () => {
            const notifications = await courseService.me.notification.get({
                per_page: 10,
                current_page: 0,
            });

            setNotificationContent(notifications);
        })()
    };

    const handleClickNotification = async (notification: NotificationProps) => {

        if (Number(notification.is_read) !== 1) {
            const result = await courseService.me.notification.postNotification(notification.id);

            dispath(updateInfo({
                notification_unread: result
            }))
        }
    }

    React.useEffect(() => {
        if (myAccount._state === UserState.identify && ((myAccount.id + '') === (user.id + ''))) {
            handleOnloadNotification();
        }
    }, []);

    if (myAccount._state === UserState.identify && ((myAccount.id + '') === (user.id + ''))) {
        return (
            <Box
                sx={{
                    maxWidth: 680,
                    margin: '0 auto',
                    p: 1,
                    border: '1px solid',
                    borderColor: 'dividerDark',
                    borderRadius: 2,
                }}
            >
                <Typography variant='h3' sx={{ pl: 2, mt: 1, mb: 1 }}>{__('Thông báo')}</Typography>
                {
                    notificationContent?.data.map((item) => <NotificationType
                        key={item.id}
                        handleClickNotification={handleClickNotification}
                        notification={item}
                    />)
                }
            </Box>
        )
    }

    return <Navigate to={'/user/' + user.slug} />
}

export default Notification