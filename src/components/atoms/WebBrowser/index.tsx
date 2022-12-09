import React from 'react'
import WebBrowserContext, { WebBrowserContextProps } from './WebBrowserContext';


function WebBrowser({ children }: ANY) {

    const [isFocusout, setIsFocusout] = React.useState(false);

    React.useEffect(() => {

        (function () {
            let hidden = "hidden";

            // Standards:
            if (hidden in document)
                document.addEventListener("visibilitychange", onchange);
            else if ((hidden = "mozHidden") in document)
                document.addEventListener("mozvisibilitychange", onchange);
            else if ((hidden = "webkitHidden") in document)
                document.addEventListener("webkitvisibilitychange", onchange);
            else if ((hidden = "msHidden") in document)
                document.addEventListener("msvisibilitychange", onchange);
            // IE 9 and lower:
            else if ("onfocusin" in document)
                //@ts-ignore
                document.onfocusin = document.onfocusout = onchange;
            // All others:
            else
                window.onpageshow = window.onpagehide
                    = window.onfocus = window.onblur = onchange;

            //@ts-ignore
            function onchange(evt) {
                let v = "visible", h = "hidden",
                    evtMap = {
                        focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
                    };

                evt = evt || window.event;
                if (evt.type in evtMap) {
                    //@ts-ignore
                    // document.title = evtMap[evt.type];
                    // document.body.className = evtMap[evt.type];
                } else {
                    //@ts-ignore
                    setIsFocusout(this[hidden] ? true : false);
                    // document.body.className = this[hidden] ? "hidden" : "visible";
                    // document.title = this[hidden] ? "hidden" : "visible";
                }
            }

            // set the initial state (but only if browser supports the Page Visibility API)
            //@ts-ignore
            if (document[hidden] !== undefined)
                //@ts-ignore
                onchange({ type: document[hidden] ? "blur" : "focus" });
        })();

        window.addEventListener('blur', function () {
            // do something when it loose focus like that:
            // document.title = 'Good Bye.';
            setIsFocusout(true);
        });

        window.addEventListener('focus', function () {
            // do something when it gains focus
            // document.title = 'Welcome back.';
            setIsFocusout(false);
        });

    }, []);

    return <WebBrowserContext.Provider
        value={{
            isFocusout: isFocusout
        }}
    >
        {children}
    </WebBrowserContext.Provider>
}

export default WebBrowser

export const useWindowFocusout = () => React.useContext<WebBrowserContextProps>(WebBrowserContext).isFocusout;