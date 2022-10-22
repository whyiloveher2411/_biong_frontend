import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "components/atoms/Avatar";
import Badge from "components/atoms/Badge";
import Box from "components/atoms/Box";
import Icon from "components/atoms/Icon";
import ListItemIcon from "components/atoms/ListItemIcon";
import ListItemText from "components/atoms/ListItemText";
import Typography from "components/atoms/Typography";
import { dateTimefromNow } from "helpers/date";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NotificationProps } from 'services/courseService';
import { RootState } from "store/configureStore";
// import { Link } from "react-router-dom";


function CourseGift({ notification, handleClickNotification }: {
    notification: NotificationProps,
    handleClickNotification: (notification: NotificationProps) => Promise<void>,
}) {

    const [notificationState, setNotificationState] = React.useState<NotificationProps | null>(notification);

    const user = useSelector((state: RootState) => state.user);

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

                    navigate('/user/' + user.slug + '/my-learning');
                }}
            >
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <Icon sx={{ color: 'white' }} icon="LocalLibraryOutlined" />
                    }
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
                        <Avatar
                            image={notificationState.sender_object?.avatar}
                            src="/images/user-default.svg"
                            name={'Avatar'}
                            variant="circular"
                            sx={{
                                width: 56,
                                height: 56,
                            }}
                        />
                    </ListItemIcon>
                </Badge>
                <ListItemText
                    primary={<>
                        <Typography sx={{
                            marginTop: 0.5,
                            width: '100%',
                        }} variant="body1" ><strong>{notificationState.sender_object?.title}</strong> đã tặng bạn khóa học {
                                notificationState.courses_object?.map((item, index) => (
                                    <Typography
                                        key={index}
                                        component="span"
                                        sx={{
                                            fontWeight: 500,
                                            color: 'primary.main',
                                        }}
                                    >
                                        {item.title}{index === ((notificationState.courses_object?.length ?? 0) - 1) ? '' : ', '}
                                    </Typography>
                                ))
                            } Hãy khám phá ngay
                        </Typography>
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
                <Box
                    sx={{
                        flexShrink: 0,
                        width: 12,
                        height: 12,
                        opacity: Number(notificationState.is_read) === 1 ? 0 : 1,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main'
                    }}
                />
            </ListItemButton>
        )
    }

    return <></>;
}

export default CourseGift