import { getLanguage } from "./i18n";

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
