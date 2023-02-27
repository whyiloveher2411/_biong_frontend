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
    setSeo: () => {
        //
    }
});

export default WebBrowserContext;


export interface WebBrowserContextProps {
    isFocusout: boolean,
    setSeo: React.Dispatch<React.SetStateAction<{
        title: string;
        description: string;
        image: string;
        type: 'website' | 'article'
    }>>,
    indexedDB: {
        insertData: (key: string, value: ANY) => void,
        getDataByKey: (key: string, callback: ANY) => void,
    }
}