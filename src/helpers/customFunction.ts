import { getLanguage } from "./i18n";
const productMode = process.env.REACT_APP_ENV;

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
    if (isNaN(+allow)) allow = 100;
    let start = +new Date(); // Validation of built-in Object tamper prevention.
    // eslint-disable-next-line no-debugger
    debugger;
    let end = +new Date(); // Validates too.
    if (isNaN(start) || isNaN(end) || end - start > allow) {
        window.location.reload();
        // input your code here when devtools detected.
    }
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

if (productMode === 'production') {
    window.addEventListener('click', () => {
        detectDevTool()
    });

    window.addEventListener("auxclick", () => {
        setTimeout(detectDevTool, 1000);
        setTimeout(detectDevTool, 2000);
        setTimeout(detectDevTool, 3000);
        setTimeout(detectDevTool, 4000);
        setTimeout(detectDevTool, 5000);
        setTimeout(detectDevTool, 6000);
        setTimeout(detectDevTool, 7000);
    });
}