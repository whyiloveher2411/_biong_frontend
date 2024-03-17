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

function MonacoEditor({ sx, language, defaultContent, content, onChange, onTest, onSubmit, editor, resetRef, autoWrapText, fontSize = 16, question, idPassed, editableRegionBoundaries, afterOnloadMonaco }: {
    sx?: SxProps,
    language: LangMonacoEditor,
    defaultContent: string,
    content: string,
    onChange?: (html: string, javascript: string, css: string, primitiveValue: string) => void,
    onTest?: (html: string, javascript: string, css: string, primitiveValue: string) => void,
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
    editableRegionBoundaries?: [number, number],
    afterOnloadMonaco?: () => void
}) {

    const divRef = React.useRef<HTMLDivElement | null>(null);

    const submitAndGo = React.useState(false);

    const theme = useSelector((state: RootState) => state.theme);
    // const editor = React.useRef<ANY>(null);

    const contentRef = React.useRef('');
    const areaEditAble = React.useRef({
        startLine: -1,
        coutLineReadOnlyBottomUp: 0,
    });



    if (!contentRef.current) {

        if (editableRegionBoundaries) {
            contentRef.current = content;

            areaEditAble.current = {
                startLine: editableRegionBoundaries[0],
                coutLineReadOnlyBottomUp: content.split('\n').length - editableRegionBoundaries[1],
            };

        } else {
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

            editor.current.setValue(contentRef.current ?? '');
            editor.current.reLoadTest('', false, true);
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

                addScript('/js/videojs-contrib-quality-levels.min.js', 'ideojs-contrib-quality-levels', () => {

                    addScript('/js/videojs-hls-quality-selector.min.js', 'videojs-hls-quality', () => {

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
                                                    readOnly: areaEditAble.current.startLine < 2 ? false : true,
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
                                                                this.domNode.innerHTML = `<div class="description-container action_test"><Button class="on_test">Kiểm tra code của bạn (Ctrl + Enter)</Button><Button class="submit_and_go">Gửi và đến bài tiếp theo</Button> <div id="test-feedback"></div> <hr> <button class="reset_test">Làm lại</button></div>`;
                                                                this.domNode.style.width = editor.current.getLayoutInfo().width - 100 + 'px';
                                                                this.domNode.style.visibility = 'visible';
                                                                this.domNode.classList.add('editor-upper-jaw');
                                                                this.domNode.addEventListener('click', function (e: ANY) {
                                                                    e.stopPropagation();
                                                                    if ((e.target as HTMLButtonElement).classList.contains('on_test')) {
                                                                        if (onTest) {
                                                                            handleOnChangeToParent((content, scriptCode, css, primitiveValue) => {
                                                                                onTest(content, scriptCode, css, primitiveValue);
                                                                            });
                                                                        }
                                                                        // if (onSubmit) {
                                                                        //     handleOnChangeToParent((html, script, css) => {
                                                                        //         onSubmit(html, script, css);
                                                                        //     });
                                                                        // }
                                                                    } else if ((e.target as HTMLButtonElement).classList.contains('reset_test')) {
                                                                        handleResetLesson();
                                                                    } else if ((e.target as HTMLButtonElement).classList.contains('submit_and_go')) {
                                                                        if (onSubmit && submitAndGo[1]) {
                                                                            handleOnChangeToParent((html, script, css) => {
                                                                                onSubmit(html, script, css);
                                                                            });
                                                                        }
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
                                                            if (onTest) {
                                                                handleOnChangeToParent((content, scriptCode, css, primitiveValue) => {
                                                                    onTest(content, scriptCode, css, primitiveValue);
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
                                                openLoading[1](false);

                                                // if (onChange) {

                                                model.onDidChangeContent(function (e: ANY) {
                                                    let value = model.getValue();
                                                    contentRef.current = value;
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

                                            if (afterOnloadMonaco) {
                                                afterOnloadMonaco();
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
                let content = editor.current.getModel().getValue();
                if (language === 'html') {
                    const matches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
                    if (matches) {
                        matches.forEach((match: string) => {
                            scriptCode += match.slice(8, -9).trim() + ';';
                            content = content.replace(match, "");
                        });

                    }
                }
                let stringNew = '';
                if (areaEditAble.current.startLine === 0 || areaEditAble.current.coutLineReadOnlyBottomUp === -1) {
                    stringNew = content;
                } else {
                    let contentPrimitive = contentState[0].split('\n');

                    let start = areaEditAble.current.startLine;
                    let end = contentPrimitive.length - areaEditAble.current.coutLineReadOnlyBottomUp - 1;

                    stringNew = contentPrimitive.filter((_, index) => index >= start && index < end).join('\n');
                }

                if (language === 'css') {
                    callback('', '', content, stringNew);
                } else if (language === 'javascript') {
                    callback('', content, '', stringNew);
                } else {
                    callback(content, scriptCode, '', stringNew);
                }
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

export default MonacoEditor