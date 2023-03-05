import { createContext } from "react";

const TemplateFreecodeContext = createContext<TemplateFreecodeContextProps>({
    formatEditor: {
        formatCode: 0,
        refresh: 0,
        autoWrapText: false,
        fontSize: 16,
    },
    testInfo: [{
        success: false,
        enable: false,
        index: -1,
    }, () => null],
    files: [],
    setValueFile: () => null,
    onSubmit: () => null,
    onTest: () => null,
    openTest: () => null,
});

export default TemplateFreecodeContext;


export interface TemplateFreecodeContextProps {
    formatEditor: {
        formatCode: number,
        refresh: number,
        autoWrapText: boolean,
        fontSize: number,
    },
    files: Array<{
        code_default: string;
        startLine: number;
        coutLineReadOnlyBottomUp: number;
        name: string;
        ext: "html" | "css" | "javascript";
        contents: string;
        history: string[];
        fileKey: string;
    }>,
    testInfo: [{
        success: boolean;
        enable: boolean;
        hint?: string | undefined;
        index?: number,
    }, React.Dispatch<React.SetStateAction<{
        success: boolean;
        enable: boolean;
        hint?: string | undefined;
    }>>],
    setValueFile: (key: string, value: string) => void,
    onSubmit: () => void,
    onTest: () => void,
    openTest: () => void,
}