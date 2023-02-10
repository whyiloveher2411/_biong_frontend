export function addScript(src: string, id: string, callback: () => void, callbackTimeOut = 0, timeout = 10, checkCallBack?: () => boolean, error?: () => void) {

    if (document.readyState === "complete") {

        setTimeout(() => {
            if (!document.getElementById(id) && !window.__jsList?.[src]) {
                const script = document.createElement("script");
                script.id = id;
                script.src = src;
                script.async = true;

                if (!window.__jsList) {
                    window.__jsList = {};
                }

                window.__jsList[src] = 1;

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

                script.onerror = () => {
                    if (error) {
                        error();
                    }
                }

                document.body.appendChild(script);
            } else {
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
                    setTimeout(() => {
                        callback();
                    }, timeout);
                })();
            }
        }, timeout);
    } else {
        setTimeout(() => {
            addScript(src, id, callback, callbackTimeOut, timeout, checkCallBack);
        }, 100);
    }
}

export function addStyleLink(src: string, id: string, callback?: (() => void) | null, callbackTimeOut = 0) {

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


export async function delayUntil(check: () => boolean, callback: () => void, time = 10) {

    while (!check()) {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(10);
            }, time);
        });
    }

    callback();

}
