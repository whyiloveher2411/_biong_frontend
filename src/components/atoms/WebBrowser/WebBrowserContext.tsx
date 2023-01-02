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
    setTitle: () => {
        //
    }
});

export default WebBrowserContext;


export interface WebBrowserContextProps {
    isFocusout: boolean,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    indexedDB: {
        insertData: (key: string, value: ANY) => void,
        getDataByKey: (key: string, callback: ANY) => void,
    }
}