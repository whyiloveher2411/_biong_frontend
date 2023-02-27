import React from 'react'
import WebBrowserContext, { WebBrowserContextProps } from './WebBrowserContext';
import { gaEventPageView } from 'helpers/ga';
import { Helmet } from 'react-helmet';


function WebBrowser({ children }: ANY) {

    const [isFocusout, setIsFocusout] = React.useState(false);

    const isBotFb = React.useRef(/facebook/.test(navigator.userAgent));

    const [seo, setSeo] = React.useState<{
        title: string,
        description: string,
        image: string,
        type: 'website' | 'article'
    }>({
        title: '...',
        description: '',
        image: '',
        type: 'website',
    });

    React.useEffect(() => {
        if (seo.title && seo.title !== '...') {
            gaEventPageView();
        }
    }, [seo.title]);

    function getDataByKey(key: string, callback: (value: ANY) => void) {
        if (window.__indexDB) {
            const txn = window.__indexDB.transaction('store-dev', 'readonly');
            const store = txn.objectStore('store-dev');

            // get the index from the Object Store
            const index = store.index('key');
            // query by indexes
            let query = index.get(key);

            // return the result object on success
            //@ts-ignore
            query.onsuccess = () => {
                callback(query.result?.value);
            };
            //@ts-ignore
            query.onerror = (event) => {
                // console.log(event.target.errorCode);
            }

            // close the database connection
            txn.oncomplete = function () {
                // dbIndexedDB.close();
            };
        }
    }

    function insertData(key: string, value: ANY) {

        if (window.__indexDB) {
            // create a new transaction
            //@ts-ignore
            const txn = window.__indexDB.transaction('store-dev', 'readwrite');

            // get the Contacts object store
            const store = txn.objectStore('store-dev');
            //
            let query = store.put({
                key: key,
                value: value,
            }, key);

            window.__indexDBStore[key] = value;

            // handle success case
            query.onsuccess = function (event: ANY) {
                // console.log(event);
            };

            // handle the error case
            query.onerror = function (event: ANY) {
                // console.log(event);
            }

            // close the database once the
            // transaction completes
            txn.oncomplete = function () {
                //@ts-ignore
                // dbIndexedDB.close();
            };
        }
    }

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
            setSeo: setSeo,
            isFocusout: isFocusout,
            indexedDB: {
                insertData: insertData,
                getDataByKey: getDataByKey,
            }
        }}
    >
        <Helmet>
            <title>{seo.title} - {'Học viện Spacedev'}</title>
            <meta property="og:url" content={window.location.origin + window.location.pathname} />
            <meta property="og:type" content={seo.type} />
            <meta property="og:title" content={seo.title + ' - Học viện Spacedev'} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:image" content={seo.image} />
            {
                isBotFb.current ?
                    <meta http-equiv="Refresh" content={'0; url=https://share-project-mu.vercel.app' + window.location.pathname} />
                    : null
            }
        </Helmet>
        {children}
    </WebBrowserContext.Provider>
}

export default WebBrowser

export const useWindowFocusout = () => React.useContext<WebBrowserContextProps>(WebBrowserContext).isFocusout;

export const useWebBrowser = () => React.useContext<WebBrowserContextProps>(WebBrowserContext);