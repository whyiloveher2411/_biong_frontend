export default async function <P>(name: string, callbackData: () => Promise<P>): Promise<P> {
    if (!window.__cacheWindow) {
        window.__cacheWindow = {};
    }

    if (!window.__cacheWindow[name]) {
        window.__cacheWindow[name] = await callbackData();
    }

    return window.__cacheWindow[name] as P;
}

export function removeCacheWindow(names: string[]) {
    names.forEach((name) => {
        if (window.__cacheWindow[name]) {
            delete window.__cacheWindow[name];
        }
    })
}

export function clearAllCacheWindow(){
    if (window.__cacheWindow) {
        delete window.__cacheWindow;
    }
}