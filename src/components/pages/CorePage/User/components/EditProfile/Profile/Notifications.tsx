import { Box, Card, Typography } from '@mui/material'
import Divider from 'components/atoms/Divider'
import FieldForm from 'components/atoms/fields/FieldForm'
import React from 'react'
import elearningService, { ProfileNotificationsProps } from 'services/elearningService';

function Notifications() {

    const [notificationItems, setNotificationItems] = React.useState<{
        [key: string]: ProfileNotificationsProps
    }>({});

    const [post, setPost] = React.useState<{ [key: string]: boolean }>({});

    React.useEffect(() => {
        (async () => {
            let data = await elearningService.getProfileNotifications();
            setNotificationItems(data.fields);
            setPost(data.values);
        })()
    }, []);

    React.useEffect(() => {
        if (post.__submitData) {
            elearningService.postProfileNotifications(post.__submitData + '', Boolean(post[post.__submitData + ''] ?? 0));
        }
    }, [post]);

    const keyFields = Object.keys(notificationItems);

    return (
        <Card>
            {
                keyFields.map((key, index) => (
                    <React.Fragment key={index}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                p: 3,
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography variant='h6'>{notificationItems[key].title}</Typography>
                                <Typography>{notificationItems[key].note}</Typography>
                            </Box>
                            <Box>
                                <FieldForm
                                    component='true_false'
                                    config={{
                                        title: false,
                                    }}
                                    post={post}
                                    name={key}
                                    onReview={(value) => {
                                        setPost(prev => ({
                                            ...prev,
                                            [key]: value,
                                            __submitData: key,
                                        }));
                                    }}
                                />
                            </Box>
                        </Box>
                        {
                            (keyFields.length - 1) !== index &&
                            <Divider color="dark" />
                        }
                    </React.Fragment>
                ))
            }
        </Card>
    )
}

export default Notifications