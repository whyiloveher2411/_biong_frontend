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
    }, () => null],
    files: [],
    setValueFile: () => null,
    onSubmit: () => null,
    onTest: () => null,
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
    }, React.Dispatch<React.SetStateAction<{
        success: boolean;
        enable: boolean;
        hint?: string | undefined;
    }>>],
    setValueFile: (key: string, value: string) => void,
    onSubmit: () => void,
    onTest: () => void,
}