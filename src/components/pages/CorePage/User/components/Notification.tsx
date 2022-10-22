import { Box, Typography } from '@mui/material';
import Loading from 'components/atoms/Loading';
import { PaginationProps } from 'components/atoms/TablePagination';
import NoticeContent from 'components/molecules/NoticeContent';
import { __ } from 'helpers/i18n';
import usePaginate from 'hook/usePaginate';
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

    const paginate = usePaginate({
        name: 'noti',
        template: 'page',
        data: {
            current_page: 0,
            per_page: 20,
        },
        onChange: async (data) => {
            if (myAccount._state === UserState.identify && ((myAccount.id + '') === (user.id + ''))) {
                const notifications = await courseService.me.notification.get({
                    per_page: data.per_page,
                    current_page: data.current_page,
                });

                setNotificationContent(notifications);
            }
        },
        pagination: notificationContent,
        isChangeUrl: true,
        enableLoadFirst: true,
    });

    const handleClickNotification = async (notification: NotificationProps) => {

        if (Number(notification.is_read) !== 1) {
            const result = await courseService.me.notification.postNotification(notification.id);

            dispath(updateInfo({
                notification_unread: result
            }))
        }
    }

    if (myAccount._state === UserState.identify && ((myAccount.id + '') === (user.id + ''))) {
        return (
            notificationContent && notificationContent?.data.length > 0 ?
                <Box
                    sx={{
                        maxWidth: 680,
                        margin: '0 auto',
                        p: 1,
                        border: '1px solid',
                        borderColor: 'dividerDark',
                        borderRadius: 2,
                        position: 'relative',
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
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        {paginate.component}
                    </Box>
                    <Loading open={paginate.isLoading} isCover />
                </Box>
                :
                <NoticeContent
                    title={__('Bạn không có thông báo nào')}
                    description=''
                    image='/images/undraw_no_data_qbuo.svg'
                    disableButtonHome
                />
        )
    }

    return <Navigate to={'/user/' + user.slug} />
}

export default Notification