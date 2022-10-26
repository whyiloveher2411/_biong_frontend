export function addScript(src: string, id: string, callback: () => void, callbackTimeOut = 0, timeout = 10) {

    setTimeout(() => {
        if (!document.getElementById(id)) {
            const script = document.createElement("script");
            script.id = id;
            script.src = src;
            script.async = true;

            script.onload = () => {
                setTimeout(() => {
                    callback();
                }, callbackTimeOut);
            };

            document.body.appendChild(script);
        } else {
            setTimeout(() => {
                callback();
            }, callbackTimeOut);
        }
    }, timeout);
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
