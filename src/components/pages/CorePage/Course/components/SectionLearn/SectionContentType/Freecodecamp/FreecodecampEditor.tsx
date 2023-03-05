import { Box } from '@mui/material';
import { SxProps } from '@mui/system';
import Loading from 'components/atoms/Loading';
import { addScript, addStyleLink } from 'helpers/script';
import Prism from 'prismjs';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';
import TemplateFreecodeContext from './TemplateFreecodeContext';

export type LangMonacoEditor = 'javascript' | 'html' | 'css';

function FreecodecampEditor({
    sx,
    question,
    idPassed,
    file
}: {
    sx?: SxProps,
    question?: {
        title: string,
        content: string,
    },
    idPassed?: boolean,
    file: {
        code_default: string;
        startLine: number;
        coutLineReadOnlyBottomUp: number;
        name: string;
        ext: "html" | "css" | "javascript";
        contents: string;
        history: string[];
        fileKey: string;
    }
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
            editor.current.reLoadTest('', false, true);
        }
    }

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
                                            language: file.ext,
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
                                            readOnly: file.startLine === -1,
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


                                        if (file.startLine > -1) {
                                            const coutLineReadOnlyBottomUp = file.coutLineReadOnlyBottomUp;
                                            const startLine = file.startLine;

                                            let idZoneContent1: ANY = '';

                                            if (question) {
                                                // Add a content widget (scrolls inline with text)
                                                let contentWidget1 = {
                                                    domNode: null as ANY,
                                                    getId: function () {
                                                        return 'my.content.widget1';
                                                    },
                                                    allowEditorOverflow: false,
                                                    getDomNode: function () {
                                                        if (!this.domNode) {
                                                            this.domNode = document.createElement('div');
                                                            this.domNode.innerHTML = `<div class="description-container"><div class="challenge-description-header"><h1>${question.title} ${idPassed ? '<span class="isPassed">Đã hoàn thành</span>' : ''}</h1> </div><div><section>${question.content}</section></div></div>`;
                                                            this.domNode.style.width = editor.current.getLayoutInfo().width - 100 + 'px';
                                                            this.domNode.style.visibility = 'visible';
                                                            this.domNode.classList.add('editor-upper-jaw');
                                                            this.domNode.addEventListener('click', function (e: ANY) {
                                                                e.stopPropagation();
                                                            });
                                                            setTimeout(() => Prism.highlightAll(), 100);

                                                        }
                                                        return this.domNode;
                                                    },
                                                    afterRender: function () {
                                                        if (zoneContent1.domNode.style.display === 'block') {
                                                            this.domNode.style.width = editor.current.getLayoutInfo().width - 100 + 'px';
                                                            this.domNode.style.visibility = 'visible';
                                                            this.domNode.style.top = zoneContent1.domNode.offsetTop + 'px';
                                                            this.domNode.style.display = 'block';

                                                            zoneContent1.heightInPx = this.domNode.offsetHeight;
                                                        } else {
                                                            this.domNode.style.display = 'none';
                                                        }
                                                    },
                                                    updateTop: function (top: number) {
                                                        this.domNode.style.top = top + 'px';
                                                    },
                                                    getPosition: function () {
                                                        return {
                                                            position: {
                                                                lineNumber: 1,
                                                                column: 1,
                                                            },
                                                            preference: [
                                                                window.monaco.editor.ContentWidgetPositionPreference.ABOVE,
                                                                window.monaco.editor.ContentWidgetPositionPreference.BELOW
                                                            ],
                                                        };
                                                    },
                                                };
                                                editor.current.addContentWidget(contentWidget1);

                                                const zoneContent1 = {
                                                    domNode: document.createElement('div'),
                                                    afterLineNumber: startLine,
                                                    heightInPx: contentWidget1.getDomNode().offsetHeight,
                                                    onDomNodeTop: function () {
                                                        contentWidget1.updateTop(this.domNode.offsetTop);
                                                    },
                                                };

                                                editor.current.changeViewZones(function (changeAccessor: ANY) {
                                                    idZoneContent1 = changeAccessor.addZone(zoneContent1);
                                                });

                                                // Add a content widget (scrolls inline with text)
                                                let contentWidget2 = {
                                                    domNode: null as ANY,
                                                    getId: function () {
                                                        return 'my.content.widget2';
                                                    },
                                                    allowEditorOverflow: false,
                                                    getDomNode: function () {
                                                        if (!this.domNode) {
                                                            this.domNode = document.createElement('div');
                                                            this.domNode.innerHTML = `<div class="description-container action_test"><Button class="on_test">Kiểm tra code của bạn (Ctrl + Enter)</Button><Button class="submit_and_go">Gửi và đến bài tiếp theo</Button> <div id="test-feedback"></div> <hr> <div style="display:flex;align-items: center;gap: 16px;"><button class="reset_test"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-zjt8k" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RestartAltRoundedIcon" tabindex="-1" title="RestartAltRounded"><path d="M12 5V3.21c0-.45-.54-.67-.85-.35l-2.8 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.32.31.86.09.86-.36V7c3.31 0 6 2.69 6 6 0 2.72-1.83 5.02-4.31 5.75-.42.12-.69.52-.69.95 0 .65.62 1.16 1.25.97C17.57 19.7 20 16.64 20 13c0-4.42-3.58-8-8-8zm-6 8c0-1.34.44-2.58 1.19-3.59.3-.4.26-.95-.09-1.31-.42-.42-1.14-.38-1.5.1-1 1.34-1.6 3-1.6 4.8 0 3.64 2.43 6.7 5.75 7.67.63.19 1.25-.32 1.25-.97 0-.43-.27-.83-.69-.95C7.83 18.02 6 15.72 6 13z"></path></svg>Làm lại</button><button class="get_hint"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="WbSunnyIcon"><path d="m6.76 4.84-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7 1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91 1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"></path></svg>Gợi ý</button></div></div>`;
                                                            this.domNode.style.width = editor.current.getLayoutInfo().width - 100 + 'px';
                                                            this.domNode.style.visibility = 'visible';
                                                            this.domNode.classList.add('editor-upper-jaw');
                                                            this.domNode.addEventListener('click', function (e: ANY) {
                                                                e.stopPropagation();
                                                                if ((e.target as HTMLButtonElement).classList.contains('on_test')) {
                                                                    templateFreecodeContext.onTest();
                                                                } else if ((e.target as HTMLButtonElement).classList.contains('reset_test')) {
                                                                    handleResetLesson();
                                                                } else if ((e.target as HTMLButtonElement).classList.contains('submit_and_go')) {
                                                                    templateFreecodeContext.onSubmit();
                                                                } else if ((e.target as HTMLButtonElement).classList.contains('get_hint')) {
                                                                    templateFreecodeContext.openTest();
                                                                }
                                                            });

                                                        }
                                                        return this.domNode;
                                                    },
                                                    afterRender: function () {
                                                        if (zoneContent2.domNode.style.display === 'block') {
                                                            this.domNode.style.width = editor.current.getLayoutInfo().width - 100 + 'px';
                                                            this.domNode.style.visibility = 'visible';
                                                            this.domNode.style.top = zoneContent2.domNode.offsetTop + 'px';
                                                            this.domNode.style.display = 'block';

                                                            zoneContent2.heightInPx = this.domNode.offsetHeight;
                                                        } else {
                                                            this.domNode.style.display = 'none';
                                                        }
                                                    },
                                                    updateTop: function (top: number) {
                                                        this.domNode.style.top = top + 'px';
                                                    },
                                                    getPosition: function () {
                                                        return {
                                                            position: {
                                                                lineNumber: 1,
                                                                column: 1,
                                                            },
                                                            preference: [
                                                                window.monaco.editor.ContentWidgetPositionPreference.ABOVE,
                                                                window.monaco.editor.ContentWidgetPositionPreference.BELOW
                                                            ],
                                                        };
                                                    },
                                                };
                                                editor.current.addContentWidget(contentWidget2);

                                                const lineCount = model.getLineCount();
                                                const zoneContent2 = {
                                                    domNode: document.createElement('div'),
                                                    afterLineNumber: lineCount - coutLineReadOnlyBottomUp - 1,
                                                    heightInPx: contentWidget2.getDomNode().offsetHeight,
                                                    onDomNodeTop: function () {
                                                        contentWidget2.updateTop(this.domNode.offsetTop);
                                                    },
                                                };

                                                let idZoneContent2: ANY = '';
                                                editor.current.changeViewZones(function (changeAccessor: ANY) {
                                                    idZoneContent2 = changeAccessor.addZone(zoneContent2);
                                                });

                                                let lineDecorationId: ANY = null;
                                                editor.current.onDidChangeCursorPosition((event: ANY) => {
                                                    const lineCount = model.getLineCount();
                                                    if (((startLine + 1) === event.position.lineNumber || ((lineCount - coutLineReadOnlyBottomUp - 1) === event.position.lineNumber)) || (startLine < event.position.lineNumber && event.position.lineNumber < (lineCount - coutLineReadOnlyBottomUp))) {
                                                        editor.current.updateOptions({
                                                            readOnly: false
                                                        });
                                                    } else {
                                                        editor.current.updateOptions({
                                                            readOnly: true
                                                        });
                                                    }
                                                    if (lineDecorationId !== null) {
                                                        editor.current.removeDecorations(lineDecorationId);
                                                    }
                                                    lineDecorationId = editor.current.deltaDecorations([], [{
                                                        range: new window.monaco.Range(startLine + 1, 1, lineCount - coutLineReadOnlyBottomUp - 1, 1),
                                                        options: {
                                                            isWholeLine: true,
                                                            className: 'highlight-line'
                                                        }
                                                    }]);
                                                    zoneContent2.afterLineNumber = lineCount - coutLineReadOnlyBottomUp - 1;
                                                    editor.current.changeViewZones((changeAccessor: ANY) => {
                                                        changeAccessor.layoutZone(idZoneContent2);
                                                    });
                                                    zoneContent2.afterLineNumber = lineCount - coutLineReadOnlyBottomUp - 1;
                                                });

                                                editor.current.onDidLayoutChange(function () {
                                                    editor.current.changeViewZones((changeAccessor: ANY) => {
                                                        zoneContent1.heightInPx = contentWidget1.getDomNode().offsetHeight;
                                                        zoneContent2.heightInPx = contentWidget2.getDomNode().offsetHeight;
                                                        changeAccessor.layoutZone(idZoneContent1);
                                                        changeAccessor.layoutZone(idZoneContent2);
                                                    });
                                                });

                                                lineDecorationId = editor.current.deltaDecorations([], [{
                                                    range: new window.monaco.Range(startLine + 1, 1, lineCount - coutLineReadOnlyBottomUp - 1, 1),
                                                    options: {
                                                        isWholeLine: true,
                                                        className: 'highlight-line'
                                                    }
                                                }]);


                                                editor.current.onKeyDown(function (e: ANY) {
                                                    if (e.ctrlKey && e.keyCode === window.monaco.KeyCode.Enter) {
                                                        templateFreecodeContext.testInfo[1]((testInfo) => {
                                                            if (testInfo.enable && testInfo.success) {
                                                                templateFreecodeContext.onSubmit();
                                                            } else {
                                                                templateFreecodeContext.onTest();
                                                            }
                                                            return testInfo;
                                                        });

                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        return;
                                                    }

                                                    const lineCount = model.getLineCount();
                                                    const positionCursor = editor.current.getPosition();
                                                    const line = model.getLineContent(positionCursor.lineNumber);
                                                    const isCursorAtEnd = (positionCursor.column - 1) === line.length;

                                                    if (e.ctrlKey && e.keyCode === window.monaco.KeyCode.KeyX) {
                                                        if ((startLine + 1) === (lineCount - coutLineReadOnlyBottomUp - 1)) {
                                                            let selection = editor.current.getSelection();
                                                            if (selection) {
                                                                let selectedText = editor.current.getModel().getValueInRange(selection);
                                                                if (selectedText !== '') {
                                                                    return
                                                                }
                                                            }
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            return;
                                                        }
                                                    }

                                                    if (
                                                        (e.keyCode === window.monaco.KeyCode.Delete && isCursorAtEnd && positionCursor.lineNumber === (lineCount - coutLineReadOnlyBottomUp - 1))
                                                        || (e.keyCode === window.monaco.KeyCode.Backspace && (positionCursor.column === 1 && (startLine + 1) === positionCursor.lineNumber))
                                                    ) {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        return;
                                                    }
                                                });


                                                editor.current.reLoadTest = (textString: string, passed: boolean, isReset = false) => {
                                                    const testFeedback = document.getElementById('test-feedback');

                                                    if (testFeedback) {
                                                        if (isReset) {
                                                            submitAndGo[1](false);
                                                            testFeedback.innerHTML = '';
                                                        } else {
                                                            if (passed) {
                                                                submitAndGo[1](true);
                                                                testFeedback.innerHTML = '<div class="test-fb-item passed"><svg class="MuiSvgIcon-root success MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CheckCircleRoundedIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29 5.7 12.7a.9959.9959 0 0 1 0-1.41c.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z"></path></svg><div class="">Test:</div> <div>Xin chúc mừng, mã của bạn vượt qua. Gửi mã của bạn để tiếp tục.</div></div>';
                                                            } else {
                                                                if (testFeedback) {
                                                                    testFeedback.innerHTML = '<div class="test-fb-item failure"><svg class="MuiSvgIcon-root error MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="HighlightOffIcon"><path d="M14.59 8 12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg><div class="">Test:</div> <div>Xin lỗi, mã code của bạn không vượt qua. Hãy tiếp tục cố gắng.</div></div><div class="test-fb-item failure"><svg class="MuiSvgIcon-root info MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ErrorRoundedIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z"></path></svg><div class="hint">Gợi ý</div><div>' + textString + '</div></div>';
                                                                }
                                                                submitAndGo[1](false);
                                                            }
                                                        }


                                                        zoneContent2.heightInPx = contentWidget2.getDomNode().offsetHeight;
                                                        editor.current.changeViewZones((changeAccessor: ANY) => {
                                                            changeAccessor.layoutZone(idZoneContent2);
                                                        });
                                                    }
                                                }

                                                // Scroll to line number
                                                editor.current.revealLineInCenter(lineCount - coutLineReadOnlyBottomUp - 1);

                                            }
                                        }
                                        openLoading[1](false);

                                        model.onDidChangeContent(function () {
                                            let value = model.getValue();
                                            templateFreecodeContext.setValueFile(file.fileKey, value);
                                        });

                                        // editor.current.onMouseUp((e: ANY) => {
                                        //     if (e.target.type === window.monaco.editor.MouseTargetType.CONTENT_TEXT) {
                                        //         const word = model.getWordAtPosition(e.target.position);
                                        //         if (word && word.word === "html") {
                                        //             console.log("Hello was clicked!");
                                        //         }
                                        //     }
                                        // });
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
                '& .reset_test, & .get_hint': {
                    fontSize: '20px',
                    backgroundColor: '#e0e0e0',
                    pl: 2,
                    pr: 2,
                    color: 'rgb(0, 0, 0)',
                    lineHeight: '38px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    gap: 1,
                    '&:hover': {
                        backgroundColor: '#f5f5f5',
                    },
                    '& .MuiSvgIcon-root': {
                        width: 24,
                    }
                },
                '& .get_hint': {
                    color: 'primary.dark',
                    '& .MuiSvgIcon-root': {
                        fill: theme.palette.primary.dark,
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

export default FreecodecampEditor