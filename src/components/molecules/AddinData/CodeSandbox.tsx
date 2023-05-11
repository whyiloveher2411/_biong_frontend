import { Sandpack, SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";
import { Box, useTheme } from '@mui/material';
import React from "react";

function CodeSandbox({ theme: themeProps, template, layout, show_console, files }: {
    theme: 'auto' | 'light' | 'dark',
    template: SandpackPredefinedTemplate,
    layout: "preview" | "tests" | "console",
    show_console: boolean,
    files: Array<{
        file_name: string,
        code: string,
    }>
}) {

    const theme = useTheme();

    const [filesState, setFilesState] = React.useState<{
        [key: string]: IFileCode
    } | null>(null);

    React.useEffect(() => {
        if (files) {
            let filesTemp: {
                [key: string]: IFileCode
            } = {};
            files.forEach(file => {
                filesTemp[file.file_name] = {
                    code: file.code
                };
            });
            setFilesState(filesTemp);
        }
    }, []);

    if (filesState) {
        return (<Box
            className="iframe_result"
            sx={{
                '& .sp-wrapper': {
                    height: '100%',
                },
                '& .sp-preview-actions .sp-button[title="Open in CodeSandbox"]': {
                    display: 'none',
                },
                '& .sp-button strong': {
                    '--sp-colors-clickable': '#d32f2f',
                    '--sp-colors-surface1': 'white',
                },
            }}
        >
            <Sandpack
                template={template}
                theme={themeProps === 'auto' ? theme.palette.mode : themeProps}
                options={{
                    showConsole: show_console ? true : false,
                    showConsoleButton: true,
                    editorHeight: '500px',
                    layout: layout,
                }}
                files={filesState}
            />
        </Box>)
    }

    return null;
}

export default CodeSandbox

interface IFileCode {
    code: string
}