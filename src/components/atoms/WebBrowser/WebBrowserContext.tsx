import { createContext } from "react";

const WebBrowserContext = createContext<WebBrowserContextProps>({
    isFocusout: false,
    indexedDB: {
        insertData: () => {
            //
        },
        getDataByKey: () => {
            //
        },
    },
});

export default WebBrowserContext;


export interface WebBrowserContextProps {
    isFocusout: boolean,
    indexedDB: {
        insertData: (key: string, value: ANY) => void,
        getDataByKey: (key: string, callback: ANY) => void,
    }
}