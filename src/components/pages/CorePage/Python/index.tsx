import { Box, CircularProgress, Typography } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import { addStyleLink } from 'helpers/script';
import { useEffect, useRef, useState } from 'react';
import { getPythonWorker, terminateWorkers } from 'workers/python-worker-handler';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import FreecodecampEditor from '../Course/components/SectionLearn/SectionContentType/Freecodecamp/components/FreecodecampEditor';
import TemplateFreecodeContext from '../Course/components/SectionLearn/SectionContentType/Freecodecamp/TemplateFreecodeContext';

import useDebounce from 'hook/useDebounce';

declare global {
    interface Window {
        __pythonCode?: string;
        FlutterBridge?: {
            postMessage: (message: string) => void;
        };
        loadCode?: (code: string) => void;
    }
}

function Python() {
    const workerRef = useRef<Worker | null>(null);
    const isFirstRun = useRef(true);
    const shouldSendToBridge = useRef(false);
    const isLoadCodeRequest = useRef(false);
    const pendingCodeRef = useRef<string | null>(null);
    const lastRunCodeRef = useRef<string | null>(null);

    const initialCode = typeof window !== 'undefined' && window.__pythonCode
        ? window.__pythonCode
        : '';

    const [files, setFiles] = useState<Array<{
        code_default: string;
        startLine: number;
        coutLineReadOnlyBottomUp: number;
        name: string;
        ext: "html" | "css" | "javascript" | string;
        contents: string;
        history: string[];
        fileKey: string;
    }>>([
        {
            name: 'main',
            ext: 'py',
            contents: initialCode,
            code_default: initialCode,
            history: [],
            fileKey: 'main.py',
            startLine: 0,
            coutLineReadOnlyBottomUp: 0,
        }
    ]);

    const [logs, setLogs] = useState<Array<{ content: string; time: number; type: 'log' | 'error' }>>([]);
    const [isReady, setIsReady] = useState(false);
    const [executionTrigger, setExecutionTrigger] = useState(0);

    const debouncedCode = useDebounce(files[0].contents, 600);

    useEffect(() => {
        addStyleLink('/monaco/editor/editor.main.css', 'monaco-editor');

        workerRef.current = getPythonWorker();

        const handleWorkerMessage = (event: MessageEvent) => {
            const { type, text } = event.data;
            switch (type) {
                case 'print':
                    setLogs(prev => [...prev, { content: text, time: Date.now(), type: 'log' }]);
                    if (shouldSendToBridge.current && window.FlutterBridge) {
                        window.FlutterBridge.postMessage(text);
                        console.log("Đã gửi tín hiệu đóng về App");
                    } else if (shouldSendToBridge.current) {
                        console.warn("Không tìm thấy FlutterBridge. Có thể bạn đang chạy trên Browser thường.");
                    }
                    break;
                case 'error':
                    // Log raw error object or formatted text
                    if (typeof text === 'object') {
                        console.error(text.message || text.toString());
                    } else {
                        console.error(text);
                    }
                    // setLogs(prev => [...prev, { content: typeof text === 'object' ? text.message || text.toString() : text, time: Date.now(), type: 'error' }]);
                    if (shouldSendToBridge.current && window.FlutterBridge) {
                        window.FlutterBridge.postMessage(text);
                        console.log("Đã gửi tín hiệu đóng về App");
                    } else if (shouldSendToBridge.current) {
                        console.warn("Không tìm thấy FlutterBridge. Có thể bạn đang chạy trên Browser thường.");
                    }
                    break;
                case 'stopped':
                    setIsReady(true);
                    break;
            }
        };

        if (workerRef.current) {
            workerRef.current.onmessage = handleWorkerMessage;
        }

        // Expose loadCode to window
        window.loadCode = (code: string) => {
            isLoadCodeRequest.current = true;
            pendingCodeRef.current = code;
            setFiles(prev => {
                const newFiles = [...prev];
                const index = newFiles.findIndex(f => f.fileKey === 'main.py');
                if (index !== -1) {
                    newFiles[index] = { ...newFiles[index], contents: code };
                }
                return newFiles;
            });
            setExecutionTrigger(prev => prev + 1);
        };

        return () => {
            terminateWorkers();
            window.loadCode = undefined;
        };
    }, []);

    // Notify Bridge when Ready
    useEffect(() => {
        if (isReady && window.FlutterBridge) {
            window.FlutterBridge.postMessage("playground-ready");
        }
    }, [isReady]);

    // Auto-run when debounced code or trigger changes
    useEffect(() => {
        if (!workerRef.current || !isReady) return;

        // Skip the first run (initial load)
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        let codeToRun = debouncedCode;
        if (pendingCodeRef.current !== null) {
            codeToRun = pendingCodeRef.current;
            pendingCodeRef.current = null;
        }

        // De-duplicate: only execute if code changed OR it's a forced loadCode request
        if (codeToRun === lastRunCodeRef.current && !isLoadCodeRequest.current) {
            return;
        }

        lastRunCodeRef.current = codeToRun;

        // Determine if we should send to bridge
        shouldSendToBridge.current = isLoadCodeRequest.current;
        // Reset the request flag
        isLoadCodeRequest.current = false;

        setLogs([]);

        // Ensure worker is listening
        workerRef.current.postMessage({ type: 'listen' });
        workerRef.current.postMessage({
            type: 'run',
            code: {
                contents: codeToRun,
                editableContents: codeToRun,
                original: {}
            },
        });
    }, [debouncedCode, isReady, executionTrigger]);



    // Dummy context values for FreecodecampEditor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contextValue: any = {
        formatEditor: {
            formatCode: 0,
            refresh: 0,
            autoWrapText: false,
            fontSize: 14,
        },
        files: files,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        testInfo: [{
            success: false,
            enable: false,
        }, () => {
            // empty
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }] as any,
        setValueFile: (key: string, value: string) => {
            setFiles(prev => {
                const newFiles = [...prev];
                const index = newFiles.findIndex(f => f.fileKey === key);
                if (index !== -1) {
                    newFiles[index] = { ...newFiles[index], contents: value };
                }
                return newFiles;
            });
        },
        onSubmit: () => {
            // empty
        },
        onTest: () => {
            // empty
        },
        openTest: () => {
            // empty
        },
    };

    return (
        <TemplateFreecodeContext.Provider value={contextValue}>
            <Box sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#1b1b1b',
                color: '#fff',
                position: 'relative'
            }}>
                {/* Loading Overlay */}
                {!isReady && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#1b1b1b', // Match background
                        zIndex: 9999,
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <CircularProgress sx={{ color: '#00A2FF' }} />
                        <Typography sx={{ color: '#888' }}>Initializing Python Environment...</Typography>
                    </Box>
                )}
                {/* Console Output Overrides Editor */}
                <Box className="custom_scroll" sx={{ flexGrow: 1, overflow: 'auto', backgroundColor: '#1e1e1e' }}>
                    <CodeBlock
                        disableCopyButton
                        sx={{
                            minHeight: '100%',
                            '& > div': {
                                minHeight: '100%',
                                margin: 0,
                                padding: 1, // Add slight padding for readability
                            },
                            '.line-numbers': {
                                padding: '0 !important'
                            },
                            '& pre, & code': {
                                margin: 0,
                                padding: 0,
                                fontFamily: 'monospace',
                                fontSize: '14px',
                                backgroundColor: 'transparent !important',
                                // color: '#f8f8f2', // Let Prism handle color
                                whiteSpace: 'pre-wrap !important', // Force wrap
                                wordBreak: 'break-word !important',
                                overflowWrap: 'anywhere !important',
                            },
                            '& .token.error': { // Style for error messages
                                color: '#ff6b6b',
                            },
                            '& .line-numbers-rows': {
                                display: 'none'
                            }
                        }}
                        html={'<pre class="language-javascript"><code>' + logs.map(item => item.content).join('\n') + '</code></pre>'}
                    />
                </Box>

                {/* Footer */}

            </Box>
        </TemplateFreecodeContext.Provider>
    );
}

export default Python