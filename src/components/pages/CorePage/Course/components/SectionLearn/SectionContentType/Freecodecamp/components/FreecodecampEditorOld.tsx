import { Box } from '@mui/material';
import { SxProps } from '@mui/system';
import Loading from 'components/atoms/Loading';
import { addScript, addStyleLink } from 'helpers/script';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';
import TemplateFreecodeContext from './../TemplateFreecodeContext';

export type LangMonacoEditor = 'javscript' | 'js' | 'html' | 'css';

function FreecodecampEditorOld({
    sx,
    file,
    onCtrEnter,
    resetLesson,
}: {
    sx?: SxProps,
    resetLesson?: number,
    file: {
        code_default: string;
        startLine: number;
        coutLineReadOnlyBottomUp: number;
        name: string;
        ext: "html" | "css" | "js" | "javascript";
        contents: string;
        history: string[];
        fileKey: string;
    },
    onCtrEnter: () => void,
}) {

    const templateFreecodeContext = React.useContext(TemplateFreecodeContext);

    const editor = React.useRef<ANY>(null);
    const divRef = React.useRef<HTMLDivElement | null>(null);

    const submitAndGo = React.useState(false);

    const theme = useSelector((state: RootState) => state.theme);

    const openLoading = React.useState(true);

    // const debounce = useDebounce(contentState[0], 300);

    React.useEffect(() => {
        handleInitMonaco();
    }, [theme.palette.mode]);

    const handleResetLesson = () => {
        if (editor.current) {
            templateFreecodeContext.testInfo[1](prev => ({
                success: false,
                enable: false,
            }));
            editor.current.setValue(file.code_default);
        }
    }

    React.useEffect(() => {
        if (resetLesson) {
            handleResetLesson();
        }
    }, [resetLesson]);

    React.useEffect(() => {

        if (templateFreecodeContext.formatEditor.formatCode > 0) {
            if (editor.current) {
                const formatCodeAction = editor.current.getAction("editor.action.formatDocument");
                formatCodeAction.run();
            }
        }

    }, [templateFreecodeContext.formatEditor.formatCode]);

    React.useEffect(() => {
        if (templateFreecodeContext.testInfo[0].enable && editor.current?.reLoadTest) {

            if (templateFreecodeContext.testInfo[0].success) {
                editor.current.reLoadTest('', true);
            } else {
                editor.current.reLoadTest(templateFreecodeContext.testInfo[0].hint ?? '', false);
            }
        }
    }, [templateFreecodeContext.testInfo[0]]);

    const handleInitMonaco = () => {
        (async () => {
            addStyleLink('/monaco/editor/editor.main.css', 'monaco-editor');
            addScript('/js/video.min.js', 'video.js', () => {
                addScript('/js/videojs-youtube.min.js', 'videojs-youtube', function () {
                    addScript('/monaco/loader.js', 'monaco-loader', function () {
                        addScript('/monaco/editor/editor.main.nls.js', 'monaco-main.nls', function () {
                            addScript('/monaco/editor/editor.main.js', 'monaco-main', function () {
                                addScript('/monaco/emmet-monaco.min.js', 'emmet-monaco', function () {

                                    if (editor.current) {
                                        editor.current.dispose();
                                    }
                                    //@ts-ignore
                                    window.require?.config({ paths: { 'vs': '/monaco' } });

                                    if (window.monaco) {

                                        window.monaco.languages.registerCompletionItemProvider('html', {
                                            triggerCharacters: ['>'],
                                            provideCompletionItems: (model: ANY, position: ANY) => {
                                                const codePre: string = model.getValueInRange({
                                                    startLineNumber: position.lineNumber,
                                                    startColumn: 1,
                                                    endLineNumber: position.lineNumber,
                                                    endColumn: position.column,
                                                });

                                                const tag = codePre.match(/.*<(\w+)>$/)?.[1];

                                                if (!tag) {
                                                    return {
                                                        suggestions: []
                                                    };
                                                }

                                                const word = model.getWordUntilPosition(position);

                                                return {
                                                    suggestions: [
                                                        {
                                                            label: `</${tag}>`,
                                                            kind: window.monaco?.languages.CompletionItemKind.EnumMember,
                                                            insertText: `</${tag}>`,
                                                            range: {
                                                                startLineNumber: position.lineNumber,
                                                                endLineNumber: position.lineNumber,
                                                                startColumn: word.startColumn,
                                                                endColumn: word.endColumn,
                                                            },
                                                        },
                                                    ],
                                                };
                                            },
                                        });

                                        window.monaco.editor.defineTheme('myCustomTheme', {
                                            base: theme.palette.mode === 'light' ? 'vs' : 'vs-dark',
                                            inherit: true,
                                            rules: [
                                                // { token: '', foreground: 'ffffff', background: '000000' }
                                            ],
                                            colors: {
                                                // 'editor.background': '#1e1e1e'
                                            }
                                        });
                                        editor.current = window.monaco.editor.create(divRef.current, {
                                            value: file.contents,
                                            language: convertLanguages[file.ext] ? convertLanguages[file.ext] : file.ext,
                                            fontSize: templateFreecodeContext.formatEditor.fontSize,
                                            fontFamily: 'main, Arial, sans-serif',
                                            theme: 'myCustomTheme',
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            formatOnType: false,
                                            formatOnPaste: false,
                                            tabSize: 8,
                                            detectIndentation: false,
                                            wordWrap: templateFreecodeContext.formatEditor.autoWrapText ? "on" : 'off',
                                            wordWrapColumn: 100,
                                            wrappingStrategy: 'advanced',
                                            contextmenu: false,
                                            readOnly: false,
                                            minimap: {
                                                enabled: false
                                            }
                                        });



                                        const model = editor.current.getModel();

                                        const messageContribution = editor.current.getContribution(
                                            "editor.contrib.messageController"
                                        );

                                        editor.current.onDidAttemptReadOnlyEdit(() => {
                                            messageContribution.showMessage('Trong bài học này không cần chỉnh sửa code ở đây.', editor.current.getPosition());
                                        });


                                        editor.current.onKeyDown(function (e: ANY) {
                                            if (e.ctrlKey && e.keyCode === window.monaco.KeyCode.Enter) {
                                                onCtrEnter();
                                                e.stopPropagation();
                                                e.preventDefault();
                                                return;
                                            }
                                        });

                                        openLoading[1](false);

                                        model.onDidChangeContent(function () {
                                            let value = model.getValue();
                                            templateFreecodeContext.setValueFile(file.fileKey, value);
                                        });
                                    }

                                    if (window.monaco) {
                                        window.emmetMonaco?.emmetHTML(window.monaco);
                                    }

                                }, 10, 10, () => {
                                    if (window.emmetMonaco && window.monaco && divRef.current) return true;
                                    return false;
                                });

                            }, 10, 10, () => {
                                if (window.monaco?.editor) return true;
                                return false;
                            });
                        });
                    });
                });
            }, 10, 10, () => {
                if (window.videojs) return true;
                return false;
            });
        })();
    };

    return (
        <Box
            ref={divRef}
            sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                fontSize: 18,
                lineHeight: 1.42857143,
                '& *': {
                    userSelect: 'text',
                },
                '& .challenge-description-header h1': {
                    mt: 0,
                    mb: 1,
                    fontSize: 28,
                },
                '& code[class*=language-],& pre[class*=language-]': {
                    whiteSpace: 'inherit',
                },
                '& code': {
                    backgroundColor: '#3b3b4f',
                    color: '#dfdfe2',
                    '--color': '#dfdfe2',
                    fontFamily: 'Hack-ZeroSlash,monospace',
                    overflowWrap: 'anywhere',
                    padding: '0 4px',
                    whiteSpace: 'inherit',
                },
                '& .highlight-line': {
                    backgroundColor: theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.2)' : '#0a0a23',
                    zIndex: -1,
                },
                '& .editor-upper-jaw': {
                    maxWidth: 'unset !important',
                    paddingBlock: '8px',
                    '& pre': {
                        padding: '1em',
                    }
                },
                '& .action-row-container,& .description-container': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    border: '2px solid ',
                    borderColor: 'primary.main',
                    padding: '1rem',
                    '& .isPassed': {
                        ml: 1,
                        fontSize: 18,
                        display: 'inline',
                        color: 'success.main',
                    }
                },
                '& .action_test': {
                    maxWidth: '620px',
                },
                '& .on_test, & .submit_and_go': {
                    fontSize: '20px',
                    width: '100%',
                    lineHeight: '38px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                },
                '& .test-fb-item': {
                    display: 'flex',
                    mt: 2,
                    gap: 1.5,
                    alignItems: 'flex-start',
                    '& .MuiSvgIcon-root': {
                        width: 38,
                        flexShrink: 0,
                        marginTop: '-6px',
                        '&.success': {
                            fill: theme.palette.success.main,
                        },
                        '&.error': {
                            fill: theme.palette.error.main,
                        },
                        '&.info': {
                            fill: theme.palette.primary.main,
                        },
                    },
                    '& *': {
                        margin: 0,
                        userSelect: 'text',
                    },
                    '& .hint': {
                        whiteSpace: 'nowrap',
                    }
                },
                ...(submitAndGo[0] ? {
                    '& .on_test': {
                        display: 'none'
                    },
                    '& .submit_and_go': {
                        display: 'block',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        }
                    },
                } : {
                    '& .on_test': {
                        display: 'block',
                    },
                    '& .submit_and_go': {
                        display: 'none',
                    },
                }),
                '& .reset_test': {
                    fontSize: '20px',
                    backgroundColor: '#e0e0e0',
                    pl: 2,
                    pr: 2,
                    color: 'rgb(0, 0, 0)',
                    lineHeight: '38px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: '#f5f5f5',
                    }
                },
                '& .action_test hr': {
                    opacity: 0.2,
                    mt: 2,
                    mb: 2,
                },
                ...sx
            }} >
            <Loading open={openLoading[0]} isCover />
        </Box >
    )
}

export default FreecodecampEditorOld



const convertLanguages: { [key: string]: string } = {
    js: 'javascript'
}