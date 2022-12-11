import { Box, Chip, Skeleton, Typography } from '@mui/material';
import MoreButton from 'components/atoms/MoreButton';
import { PaginationProps } from 'components/atoms/TablePagination';
import NoticeContent from 'components/molecules/NoticeContent';
import { __ } from 'helpers/i18n';
import usePaginate from 'hook/usePaginate';
import useQuery from 'hook/useQuery';
import React from 'react';
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

    const urlParam = useQuery({
        show_unread: 0,
    });

    const paginate = usePaginate({
        name: 'noti',
        template: 'page',
        data: {
            current_page: 0,
            per_page: 20,
            show_unread: urlParam.query.show_unread
        },
        onChange: async (data) => {
            if (myAccount._state === UserState.identify && ((myAccount.id + '') === (user.id + ''))) {
                const notifications = await courseService.me.notification.get(Boolean(Number(data.show_unread)), {
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

    const handleClickNotification = async (notification: NotificationProps | 'all') => {

        if (notification === 'all') {
            const result = await courseService.me.notification.postNotification('all');

            dispath(updateInfo({
                notification_unread: result
            }));

            paginate.set(prev => ({
                ...prev
            }));

        } else {

            if (Number(notification.is_read) !== 1) {
                const result = await courseService.me.notification.postNotification(notification.id);

                dispath(updateInfo({
                    notification_unread: result
                }))
            }
        }
    }

    if (myAccount._state === UserState.identify && ((myAccount.id + '') === (user.id + ''))) {
        return (
            <Box
                sx={{
                    maxWidth: '100%',
                    width: 680,
                    margin: '0 auto',
                    p: 1,
                    border: '1px solid',
                    borderColor: 'dividerDark',
                    borderRadius: 2,
                    position: 'relative',
                }}
            >
                <Typography variant='h3' sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pl: 2,
                    mt: 1,
                    mb: 1
                }}>
                    {__('Thông báo')}

                    <MoreButton
                        icon='MoreHorizRounded'
                        actions={[
                            {
                                checkAll: {
                                    title: "Đánh dấu tất cả là đã đọc",
                                    action: () => {
                                        handleClickNotification('all');
                                    },
                                    icon: 'CheckRounded'
                                }
                            }
                        ]}
                    />
                </Typography>
                <Box
                    sx={{
                        pl: 2,
                        display: 'flex',
                        gap: 1,
                        pb: 2,
                    }}
                >
                    <Chip
                        color={!Number(urlParam.query.show_unread) ? 'primary' : 'default'}
                        onClick={() => {
                            urlParam.changeQuery({ show_unread: 0 });
                            paginate.set({
                                current_page: 0,
                                per_page: 20,
                                show_unread: 0,
                                loadData: true,
                            });
                        }}
                        label="Tất cả"
                    />
                    <Chip
                        label="Chưa đọc"
                        color={Number(urlParam.query.show_unread) ? 'primary' : 'default'}
                        onClick={() => {
                            urlParam.changeQuery({ show_unread: 1 });
                            paginate.set({
                                current_page: 0,
                                per_page: 20,
                                show_unread: 1,
                                loadData: true,
                            });
                        }}
                    />
                </Box>
                {
                    paginate.isLoading ?
                        [1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (
                            <Box
                                key={item}
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    mt: 2,
                                    pl: 2,
                                    pr: 2,
                                    alignItems: 'center',
                                }}
                            >
                                <Skeleton variant='circular' sx={{ width: 56, height: 56, flexShrink: 0, }} />
                                <Skeleton key={item} sx={{ width: '100%', }} />
                            </Box>
                        ))
                        :
                        <>
                            {
                                notificationContent?.total ?
                                    notificationContent?.data.map((item) => <NotificationType
                                        key={item.id}
                                        handleClickNotification={handleClickNotification}
                                        notification={item}
                                    />)
                                    :
                                    <NoticeContent
                                        title={__('Bạn không có thông báo nào')}
                                        description=''
                                        image='/images/undraw_no_data_qbuo.svg'
                                        disableButtonHome
                                    />
                            }
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                {paginate.component}
                            </Box>
                        </>
                }
            </Box>
        )
    }

    return <Navigate to={'/user/' + user.slug} />
}

export default Notification