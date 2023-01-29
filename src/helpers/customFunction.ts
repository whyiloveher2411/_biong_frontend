import { getLanguage } from "./i18n";
import { addScript } from "./script";

const language = getLanguage();

const fetchOld = fetch;

window.fetch = (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> => {

    if (!init) {
        init = {};
    }

    init.headers = {
        ...init?.headers,
        __l: window.btoa(language.code + '#' + Date.now()),
        'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
    };

    return fetchOld(input as RequestInfo, init);
};


export function detectDevTool(allow?: ANY) {
    // if (isNaN(+allow)) allow = 100;
    // let start = +new Date(); // Validation of built-in Object tamper prevention.
    // // eslint-disable-next-line no-debugger
    // debugger;
    // let end = +new Date(); // Validates too.
    // if (isNaN(start) || isNaN(end) || end - start > allow) {
    //     window.location.reload();
    //     // input your code here when devtools detected.
    // }
}


//@ts-ignore
// !function () {
//     function detectDevTool(allow?: ANY) {
//         if (isNaN(+allow)) allow = 100;
//         let start = +new Date(); // Validation of built-in Object tamper prevention.
//         console.log(1);
//         // eslint-disable-next-line no-debugger
//         debugger;
//         let end = +new Date(); // Validates too.
//         if (isNaN(start) || isNaN(end) || end - start > allow) {
//             // input your code here when devtools detected.
//         }
//     }
//     if (window.attachEvent) {
//         if (document.readyState === "complete" || document.readyState === "interactive") {
//             detectDevTool();
//             window.attachEvent('onresize', detectDevTool);
//             window.attachEvent('onmousemove', detectDevTool);
//             window.attachEvent('onfocus', detectDevTool);
//             window.attachEvent('onblur', detectDevTool);
//         } else {
//             //@ts-ignore
//             setTimeout(argument.callee, 0);
//         }
//     } else {
//         window.addEventListener('load', detectDevTool);
//         window.addEventListener('resize', detectDevTool);
//         window.addEventListener('mousemove', detectDevTool);
//         window.addEventListener('focus', detectDevTool);
//         window.addEventListener('blur', detectDevTool);
//     }
// }();


window.__indexDB = null;
window.__indexDBSuccess = false;
window.__indexDBStore = {};

if (window.indexedDB) {

    window.indexedDB.deleteDatabase('Spacedev');

    const request = window.indexedDB.open('Spacedev2', 1);

    request.onerror = () => {
        // setIndexedDB(null);
    };

    request.onsuccess = (event: ANY) => {
        const db = event.target.result;
        // alert('Success 1');

        window.__indexDB = db;


        if (db) {
            const transaction = db.transaction(["store-dev"]);
            const object_store = transaction.objectStore("store-dev");

            const myIndex = object_store.index('key');
            const getAllRequest = myIndex.getAll();
            getAllRequest.onsuccess = () => {
                if (Array.isArray(getAllRequest.result)) {
                    getAllRequest.result.forEach((item: { key: string, value: ANY }) => {
                        window.__indexDBStore[item.key] = item.value;
                    });
                }
                window.__indexDBSuccess = true;
            }
        }


        // setIndexedDB(request);
        // setDbIndexedDB(db);
        // getAll(db, 'store-dev');
        // getDataByKey('Homepage/Roadmaps');
    };

    request.onupgradeneeded = (event) => {
        //@ts-ignore
        let db = event.target.result;

        // create the Contacts object store
        // with auto-increment id
        let store = db.createObjectStore('store-dev', {
            autoIncrement: true
        });

        // create an index on the email property
        store.createIndex('key', 'key', {
            unique: true
        });
    };

}

addScript('https://www.googletagmanager.com/gtag/js?id=G-596FKX9D06', 'ga4', () => {
    window.dataLayer = window.dataLayer || [];
    // eslint-disable-next-line
    window.gtag = function () { window.dataLayer.push(arguments); }
    //@ts-ignore
    gtag('js', new Date());
    //@ts-ignore
    gtag('config', 'G-596FKX9D06');
}, 10, 10);

window.addEventListener('click', () => {
    detectDevTool()
});

// window.addEventListener("auxclick", () => {
//     setTimeout(detectDevTool, 1000);
//     setTimeout(detectDevTool, 2000);
//     setTimeout(detectDevTool, 3000);
//     setTimeout(detectDevTool, 4000);
//     setTimeout(detectDevTool, 5000);
//     setTimeout(detectDevTool, 6000);
//     setTimeout(detectDevTool, 7000);
// });