export default async function <P>(name: string, callbackData: () => Promise<P>): Promise<P> {
    if (!window.__cacheWindow) {
        window.__cacheWindow = {};
    }

    if (!window.__cacheWindow[name]) {
        window.__cacheWindow[name] = await callbackData();
    }

    return window.__cacheWindow[name] as P;
}