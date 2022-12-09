import { createContext } from "react";

const WebBrowserContext = createContext<WebBrowserContextProps>({
    isFocusout: false,
});

export default WebBrowserContext;


export interface WebBrowserContextProps {
    isFocusout: boolean
}