try {
    if (!window.Spacedev) {
        window.Spacedev = {
            callback: [],
            init: function (data) {
                this.appId = data.appId;
                const eventListenerMessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.from_spacedev) {
                            switch (data.event) {
                                case 'get_user_info':
                                    this.callback['get_user_info'](data.data);
                                    break;
                                default:
                                    break;
                            }
                        }
                    } catch (error) {
                        //
                    }
                };

                window.parent.postMessage(JSON.stringify({
                    is_spacedev_app: true,
                    event: 'init',
                    data: {
                        app_id: data.appId
                    }
                }), "*");

                window.addEventListener("message", eventListenerMessage);

                if (data.callback) {
                    if (typeof data.callback === 'function') {
                        data.callback();
                    } else if (typeof data.callback === 'string') {
                        window[data.callback]();
                    }
                }
            },
            userLogin: function (callback) {
                if (!this.appId) return;
                this.callback['get_user_info'] = callback;
                window.parent.postMessage(JSON.stringify({
                    is_spacedev_app: true,
                    event: 'get_user_info'
                }), "*");
            },
            changeThemeMode: function(theme) {
                if ( theme !== 'light' && theme !== 'dark' && theme !== 'auto' ){
                    console.warn('Theme not found: '+ theme);
                    return;
                }

                window.parent.postMessage(JSON.stringify({
                    is_spacedev_app: true,
                    event: 'changeThemeMode',
                    data: {
                        theme: theme
                    }
                }), "*");
            },
            showAlert: function (message) {
                window.parent.postMessage(JSON.stringify({
                    is_spacedev_app: true,
                    event: 'show_alert',
                    data: {
                        message: message
                    }
                }), "*");
            },
        }

        window.spacedevAsyncInit();
    }
} catch (error) {
    console.error(error);
    console.log('Error during spavedev sdk initialization');
}