import { Box, CircularProgress, Typography } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import { addStyleLink, delayUntil } from 'helpers/script';
import { replaceEscape } from 'helpers/string';
import useDebounce from 'hook/useDebounce';
import { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        __javascriptCode?: string;
        FlutterBridge?: {
            postMessage: (message: string) => void;
        };
        loadCode?: (code: string) => void;
    }
}

// Helper from NewJs.tsx
function removeTagP(htmlContent: string) {
    return htmlContent.replaceAll('<p>', '').replaceAll('</p>', "\n");
}

function Javascript() {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const isFirstRun = useRef(true);
    const shouldSendToBridge = useRef(false);
    const isLoadCodeRequest = useRef(false);
    const pendingCodeRef = useRef<string | null>(null);
    const lastRunCodeRef = useRef<string | null>(null);

    const initialCode = typeof window !== 'undefined' && window.__javascriptCode
        ? window.__javascriptCode
        : '';

    const [code, setCode] = useState(initialCode);
    const [logs, setLogs] = useState<Array<{ content: string; time: number; type: 'log' | 'error' | 'alert' }>>([]);
    const [isReady, setIsReady] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [executionTrigger, setExecutionTrigger] = useState(0);

    const debouncedCode = useDebounce(code, 600);

    useEffect(() => {
        addStyleLink('/monaco/editor/editor.main.css', 'monaco-editor');

        // Expose loadCode to window
        window.loadCode = (newCode: string) => {
            isLoadCodeRequest.current = true;
            pendingCodeRef.current = newCode;
            setCode(newCode);
            setExecutionTrigger(prev => prev + 1);
        };

        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.live_code && data.message) {
                    setIsReady(true);

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data.message.forEach((item: any) => {
                        let content = '';
                        let type: 'log' | 'error' | 'alert' = 'log';

                        switch (item.type) {
                            case 'alert':
                                content = '<pre style="color:green;font-weight:bold;">!Alert: ' + item.content + '</pre>';
                                type = 'alert';
                                break;
                            case 'error':
                                content = '<pre style="normal;color:red;">' + item.content + '</pre>';
                                type = 'error';
                                break;
                            case 'log':
                                content = '<pre style="' + (item.color ? "color:" + item.color : '') + '">'
                                    + (item.tag ? '<' + item.tag + '>' : '')
                                    + removeTagP(item.content + '')
                                    + (item.tag ? '</' + item.tag + '>' : '')
                                    + '</pre>';
                                type = 'log';
                                break;
                            default:
                                return; // Skip other types like 'test'
                        }

                        setLogs(prev => {
                            // De-duplicate: NewJs checks strict content and time proximity
                            const isDuplicate = prev.findIndex(
                                p => p.content === content && (p.time + 0.5) >= Date.now() / 1000
                            ) !== -1;

                            if (isDuplicate) return prev;

                            return [...prev, {
                                content: content,
                                time: Date.now() / 1000,
                                type: type
                            }];
                        });

                        if (shouldSendToBridge.current && window.FlutterBridge) {
                            window.FlutterBridge.postMessage(item.content);
                            console.log("Đã gửi tín hiệu đóng về App");
                        } else if (shouldSendToBridge.current) {
                            console.warn("Không tìm thấy FlutterBridge. Có thể bạn đang chạy trên Browser thường.");
                        }
                    });

                    // Reset bridge flag after processing messages for a run
                    if (shouldSendToBridge.current) {
                        shouldSendToBridge.current = false;
                    }
                }
            } catch (error) {
                // Ignore non-JSON messages
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.loadCode = undefined;
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    // Helper to load code into iframe
    const runCodeInIframe = (codeToRun: string) => {
        delayUntil(() => iframeRef.current?.contentWindow?.load ? true : false, () => {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                setLogs([]);

                const html = '';
                const css = '';
                const js = codeToRun;
                const tests: unknown[] = [];
                const inputUserEdit = codeToRun;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (iframeRef.current.contentWindow as any).load(html, css, js, tests, inputUserEdit);
            }
        });
    };

    // Auto-run when debounced code or trigger changes
    useEffect(() => {
        if (!iframeRef.current) return;

        if (isFirstRun.current) {
            isFirstRun.current = false;
            runCodeInIframe(debouncedCode);
            return;
        }

        let codeToRun = debouncedCode;
        if (pendingCodeRef.current !== null) {
            codeToRun = pendingCodeRef.current;
            pendingCodeRef.current = null;
        }

        if (codeToRun === lastRunCodeRef.current && !isLoadCodeRequest.current) {
            return;
        }

        lastRunCodeRef.current = codeToRun;
        shouldSendToBridge.current = isLoadCodeRequest.current;
        isLoadCodeRequest.current = false;

        runCodeInIframe(codeToRun);

    }, [debouncedCode, executionTrigger]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
            if (window.FlutterBridge) {
                window.FlutterBridge.postMessage("playground-ready");
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1b1b1b',
            color: '#fff',
            position: 'relative'
        }}>
            <iframe
                ref={iframeRef}
                src="/browser/new_js.html"
                style={{ display: 'none' }}
                title="execution-iframe"
            />

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
                    backgroundColor: '#1b1b1b',
                    zIndex: 9999,
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <CircularProgress sx={{ color: '#F0DB4F' }} />
                    <Typography sx={{ color: '#888' }}>Initializing Javascript Environment...</Typography>
                </Box>
            )}

            <Box className="custom_scroll" sx={{ flexGrow: 1, overflow: 'auto', backgroundColor: '#1e1e1e' }}>
                <CodeBlock
                    disableCopyButton
                    sx={{
                        minHeight: '100%',
                        '& > div': {
                            minHeight: '100%',
                            margin: 0,
                            padding: 1,
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
                            whiteSpace: 'pre-wrap !important',
                            wordBreak: 'break-word !important',
                            overflowWrap: 'anywhere !important',
                        },
                        '& .token.error': {
                            color: '#ff6b6b',
                        },
                        '& .line-numbers-rows': {
                            display: 'none'
                        }
                    }}
                    html={replaceEscape(logs.map(item => item.content).join(''))}
                />
            </Box>
        </Box>
    );
}

export default Javascript;