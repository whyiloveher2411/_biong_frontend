import { SxProps } from '@mui/system';
import { addScript, addStyleLink, delayUntil } from 'helpers/script';
import useDebounce from 'hook/useDebounce';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';
import Box from '../Box';
import Loading from '../Loading';
import Prism from 'prismjs';

export type LangMonacoEditor = 'javascript' | 'html' | 'css';

function MonacoEditor({ sx, language, defaultContent, content, onChange, onSubmit, editor, resetRef, autoWrapText, fontSize = 16, question, idPassed }: {
    sx?: SxProps,
    language: LangMonacoEditor,
    defaultContent: string,
    content: string,
    onChange?: (html: string, javascript: string, css: string, primitiveValue: string) => void,
    // onSlected?: (content: string, position: { x: number, y: number }) => void,
    editor: React.MutableRefObject<ANY>,
    resetRef?: React.MutableRefObject<ANY>,
    autoWrapText: boolean,
    fontSize?: number,
    onSubmit?: (html: string, javascript: string, css: string) => void,
    question?: {
        title: string,
        content: string,
    },
    idPassed?: boolean,
}) {

    const divRef = React.useRef<HTMLDivElement | null>(null);

    const theme = useSelector((state: RootState) => state.theme);
    // const editor = React.useRef<ANY>(null);

    const contentRef = React.useRef('');
    const areaEditAble = React.useRef({
        startLine: -1,
        coutLineReadOnlyBottomUp: 0,
    });

    if (!contentRef.current) {

        let lines = content.split('\n');
        let startLine = -1;
        let lineEnd = -1;

        lines = lines.map((item, index) => {
            if (item.includes('[question_here]')) {
                if (index === 0) {
                    startLine = 0;
                } else {
                    startLine = index + 1;
                }
                item = item.replace('[question_here]', '');
            }
            if (item.includes('[submit_here]')) {
                lineEnd = index + 2;
                item = item.replace('[submit_here]', '');
            }

            return item;
        });

        areaEditAble.current = {
            startLine: startLine,
            coutLineReadOnlyBottomUp: lines.length - lineEnd,
        };

        contentRef.current = lines.join('\n');
    }


    const contentState = React.useState(contentRef.current);

    const openLoading = React.useState(true);

    const debounce = useDebounce(contentState[0], 300);

    React.useEffect(() => {
        handleInitMonaco();
    }, [theme.palette.mode]);

    const handleResetLesson = () => {
        if (editor.current) {

            let lines = defaultContent.split('\n');
            let startLine = -1;
            let lineEnd = -1;

            lines = lines.map((item, index) => {
                if (item.includes('[question_here]')) {
                    if (index === 0) {
                        startLine = 0;
                    } else {
                        startLine = index + 1;
                    }
                    item = item.replace('[question_here]', '');
                }
                if (item.includes('[submit_here]')) {
                    lineEnd = index + 2;
                    item = item.replace('[submit_here]', '');
                }

                return item;
            });

            areaEditAble.current = {
                startLine: startLine,
                coutLineReadOnlyBottomUp: lines.length - lineEnd,
            };

            contentRef.current = lines.join('\n');

            contentState[1](contentRef.current);

            editor.current.setValue(contentRef.current);
        }
    }

    React.useEffect(() => {
        if (resetRef) {
            resetRef.current = () => {
                handleResetLesson();
            }
        }
    }, []);

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
                                            value: contentState[0],
                                            language: language,
                                            fontSize: fontSize,
                                            fontFamily: 'main, Arial, sans-serif',
                                            theme: 'myCustomTheme',
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            tabSize: 8,
                                            detectIndentation: false,
                                            wordWrap: autoWrapText ? "on" : 'off',
                                            wordWrapColumn: 100,
                                            wrappingStrategy: 'advanced',
                                            contextmenu: false,
                                            readOnly: true,
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


                                        if (areaEditAble.current.startLine > -1) {
                                            const coutLineReadOnlyBottomUp = areaEditAble.current.coutLineReadOnlyBottomUp;
                                            const startLine = areaEditAble.current.startLine;


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
                                                    changeAccessor.addZone(zoneContent1);
                                                });
                                            }

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
                                                        this.domNode.innerHTML = `<div class="description-container action_test"><Button class="submit_test">Kiểm tra code và Nộp bài (Ctrl + Enter)</Button> <hr> <button class="reset_test">Làm lại</button></div>`;
                                                        this.domNode.style.width = editor.current.getLayoutInfo().width - 100 + 'px';
                                                        this.domNode.style.visibility = 'visible';
                                                        this.domNode.classList.add('editor-upper-jaw');
                                                        this.domNode.addEventListener('click', function (e: ANY) {
                                                            e.stopPropagation();

                                                            if ((e.target as HTMLButtonElement).classList.contains('submit_test')) {
                                                                if (onSubmit) {
                                                                    handleOnChangeToParent((html, script, css) => {
                                                                        onSubmit(html, script, css);
                                                                    });
                                                                }
                                                            } else if ((e.target as HTMLButtonElement).classList.contains('reset_test')) {
                                                                handleResetLesson();
                                                            }
                                                        });

                                                    }
                                                    return this.domNode;
                                                },
                                                suppressMouseDown: true,
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
                                                if (startLine < event.position.lineNumber && event.position.lineNumber < (lineCount - coutLineReadOnlyBottomUp)) {
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

                                            lineDecorationId = editor.current.deltaDecorations([], [{
                                                range: new window.monaco.Range(startLine + 1, 1, lineCount - coutLineReadOnlyBottomUp - 1, 1),
                                                options: {
                                                    isWholeLine: true,
                                                    className: 'highlight-line'
                                                }
                                            }]);


                                            editor.current.onKeyDown(function (e: ANY) {
                                                if (e.ctrlKey && e.keyCode === window.monaco.KeyCode.Enter) {
                                                    if (onSubmit) {
                                                        handleOnChangeToParent((html, script, css) => {
                                                            onSubmit(html, script, css);
                                                        });
                                                    }
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
                                        }

                                        openLoading[1](false);

                                        // if (onChange) {

                                        model.onDidChangeContent(function (e: ANY) {
                                            let value = model.getValue();
                                            contentState[1](value);
                                        });
                                        // }





                                        // setTimeout(() => {
                                        //     const formatCodeAction = editor.current.getAction("editor.action.formatDocument");

                                        //     // Trigger the format code event
                                        //     formatCodeAction.run();
                                        // }, 2000);



                                        editor.current.onMouseUp((e: ANY) => {
                                            if (e.target.type === window.monaco.editor.MouseTargetType.CONTENT_TEXT) {
                                                const word = model.getWordAtPosition(e.target.position);
                                                if (word && word.word === "html") {
                                                    console.log("Hello was clicked!");
                                                }
                                            }
                                        });

                                        // if (onSlected) {

                                        //     editor.current.onDidChangeCursorSelection((event: ANY) => {
                                        //         const selection = event.selection;
                                        //         const text = model.getValueInRange({
                                        //             startLineNumber: selection.startLineNumber,
                                        //             startColumn: selection.startColumn,
                                        //             endLineNumber: selection.endLineNumber,
                                        //             endColumn: selection.endColumn
                                        //         });

                                        //         // Get the current cursor position in terms of the editor's model
                                        //         const position = editor.current.getPosition();

                                        //         // Get the current cursor position relative to the browser
                                        //         const scrolledPosition = editor.current.getScrolledVisiblePosition(position);

                                        //         // Get the current cursor position relative to the browser as an object with top and left properties
                                        //         const { top, left } = scrolledPosition;

                                        //         onSlected(text, { x: left, y: top });
                                        //     });
                                        // }
                                        // const readonlyRange = new window.monaco.Range(5, 0, 8, 0)
                                        // editor.current.onKeyDown((e: ANY) => {
                                        //     const contains = editor.current.getSelections().findIndex((range: ANY) => readonlyRange.intersectRanges(range))
                                        //     if (contains !== -1) {
                                        //         e.stopPropagation()
                                        //         e.preventDefault() // for Ctrl+C, Ctrl+V
                                        //     }
                                        // })
                                        // setTimeout(() => {
                                        //     editor.getAction('editor.action.formatDocument').run();
                                        // }, 100)
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
            // addScript('/monaco/tern.js', 'monaco-tern', function () {
            //     //
            // });

        })();
    };

    const handleOnChangeToParent = (callback: (value: string, script: string, css: string, primitiveValue: string) => void) => {
        delayUntil(() => editor.current ? true : false, () => {
            if (editor.current) {
                let scriptCode = '';
                let content = contentState[0];
                const matches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
                if (matches) {
                    matches.forEach((match: string) => {
                        scriptCode += match.slice(8, -9).trim() + ';';
                        content = content.replace(match, "");
                    });

                }


                let contentPrimitive = contentState[0].split('\n');

                let start = areaEditAble.current.startLine;
                let end = contentPrimitive.length - areaEditAble.current.coutLineReadOnlyBottomUp - 1;

                let stringNew = contentPrimitive.filter((_, index) => index >= start && index < end).join('\n');

                callback(content, scriptCode, '', stringNew);

            }
        });
    }

    React.useEffect(() => {
        if (onChange) {
            handleOnChangeToParent((content, scriptCode, css, primitiveValue) => {
                onChange(content, scriptCode, css, primitiveValue);
            });
        }
    }, [debounce]);


    return (
        <Box ref={divRef} sx={{
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
            '& code': {
                backgroundColor: '#3b3b4f',
                color: '#dfdfe2',
                fontFamily: 'Hack-ZeroSlash,monospace',
                overflowWrap: 'anywhere',
                padding: '0 4px',
            },
            '& .highlight-line': {
                backgroundColor: theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.2)' : '#0a0a23',
                zIndex: -1,
            },
            '& .editor-upper-jaw': {
                maxWidth: 'unset !important',
                paddingBlock: '8px',
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
                maxWidth: '450px',
            },
            '& .submit_test': {
                fontSize: '20px',
                width: '100%',
                lineHeight: '38px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
            },
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
        </Box>
    )
}

export default MonacoEditor