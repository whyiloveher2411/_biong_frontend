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
} as WebBrowserContextProps);

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
        insertData: (props: InsertIndexDBProps) => void,
        getDataByKey: (key: string, callback: ANY) => void,
    }
}

export interface InsertIndexDBProps {
    key: string,
    value: ANY,
    cacheToAt?: number,
}