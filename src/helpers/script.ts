export function addScript(src: string, id: string, callback: () => void, callbackTimeOut = 0, timeout = 10, checkCallBack?: () => boolean) {

    if (document.readyState === "complete") {
        setTimeout(() => {
            if (!document.getElementById(id)) {
                const script = document.createElement("script");
                script.id = id;
                script.src = src;
                script.async = true;

                script.onload = () => {
                    setTimeout(() => {

                        (async () => {
                            if (checkCallBack) {
                                while (!checkCallBack()) {
                                    await new Promise((resolve) => {
                                        setTimeout(() => {
                                            resolve(10);
                                        }, timeout);
                                    });
                                }
                            }

                            callback();
                        })();

                    }, callbackTimeOut);
                };

                document.body.appendChild(script);
            } else {
                // (async () => {
                    // if (checkCallBack) {
                    //     while (!checkCallBack()) {
                    //         await new Promise((resolve) => {
                    //             setTimeout(() => {
                    //                 resolve(10);
                    //             }, timeout);
                    //         });
                    //         console.log('1111111111');
                    //     }
                    // }
                    callback();
                // })();
            }
        }, timeout);
    } else {
        setTimeout(() => {
            addScript(src, id, callback, callbackTimeOut, timeout, checkCallBack);
        }, 100);
    }
}

export function addStyleLink(src: string, id: string, callback: (() => void) | null, callbackTimeOut = 0) {

    if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.href = src;
        link.rel = 'stylesheet';

        if (callback) {
            link.onload = () => {
                setTimeout(() => {
                    callback();
                }, callbackTimeOut);
            };
        }
        document.body.appendChild(link);
    } else {
        if (callback) {
            setTimeout(() => {
                callback();
            }, callbackTimeOut);
        }
    }
}
