import { toCamelCase } from 'helpers/string';
import React from 'react'
import { NotificationProps } from 'services/courseService'

function NotificationType(props: {
    notification: NotificationProps,
    handleClickNotification: (notification: NotificationProps) => Promise<void>,
}) {

    try {
        let compoment = toCamelCase(props.notification.notification_type);
        //eslint-disable-next-line
        let resolved = require(`./${compoment}`).default;
        return React.createElement(resolved, props);
    } catch (error) {
        //
    }

    return <></>;

}

export default NotificationType