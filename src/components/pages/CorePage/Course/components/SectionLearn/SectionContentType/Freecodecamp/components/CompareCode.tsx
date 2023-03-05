import { Box, Typography } from '@mui/material';
import { addScript, addStyleLink } from 'helpers/script';
import React from 'react'
import { IContentTemplateCode } from '../TemplateFreecode';

function CompareCode({ files, files2, indexFileCurrent }: {
    files: Array<{
        contents: string;
        code_default: string;
        startLine: number;
        coutLineReadOnlyBottomUp: number;
        name: string;
        ext: "html" | "css" | "javascript";
        history: string[];
        fileKey: string;
        final_result?: string,
    }>,
    files2?: IContentTemplateCode['challengeFiles'],
    indexFileCurrent: number,
}) {

    const divRef = React.useRef<HTMLDivElement | null>(null);

    const handleInitMonaco = () => {
        (async () => {
            addStyleLink('/monaco/editor/editor.main.css', 'monaco-editor');
            addScript('/js/video.min.js', 'video.js', () => {
                addScript('/js/videojs-youtube.min.js', 'videojs-youtube', function () {
                    addScript('/monaco/loader.js', 'monaco-loader', function () {
                        addScript('/monaco/editor/editor.main.nls.js', 'monaco-main.nls', function () {
                            addScript('/monaco/editor/editor.main.js', 'monaco-main', function () {

                                if (files[indexFileCurrent]) {
                                    let originalModel;

                                    if (files[indexFileCurrent].final_result) {
                                        originalModel = window.monaco.editor.createModel(files[indexFileCurrent].final_result, files[indexFileCurrent].ext);
                                    } else {
                                        const findFileResult = files2?.find(item => item.fileKey === files[indexFileCurrent].fileKey);
                                        if (findFileResult) {
                                            originalModel = window.monaco.editor.createModel(findFileResult.contents.replaceAll('[question_here]', '').replaceAll('[submit_here]', ''), findFileResult.ext);
                                        } else {
                                            originalModel = window.monaco.editor.createModel('', files[indexFileCurrent].ext);
                                        }
                                    }

                                    let modifiedModel = window.monaco.editor.createModel(files[indexFileCurrent].code_default, files[indexFileCurrent].ext);

                                    let diffEditor = window.monaco.editor.createDiffEditor(divRef.current, {
                                        fontSize: 18,
                                        scrollBeyondLastLine: false,
                                        enableSplitViewResizing: false,
                                    });
                                    diffEditor.setModel({
                                        original: originalModel,
                                        modified: modifiedModel,
                                    });

                                    diffEditor.getOriginalEditor().setTitle("Original File");
                                    diffEditor.getModifiedEditor().setTitle("Modified File");

                                }
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

    React.useEffect(() => {
        handleInitMonaco();
    }, []);

    return (<>
        <Box
            sx={{
                display: 'flex',
                gap: '30px',
                pb: 1,
                pt: 1,
            }}
        >
            <Typography variant='h4' sx={{ flex: 1, textAlign: 'center', }}>Đáp án</Typography>
            <Typography variant='h4' sx={{ flex: 1, textAlign: 'center', }}>Code của bạn</Typography>
        </Box>
        <Box
            ref={divRef}
            sx={{
                width: '100%',
                height: 'calc(100% - 40px)',
                position: 'relative',
                fontSize: 18,
                lineHeight: 1.42857143,
                '& .monaco-diff-editor.side-by-side .editor.modified': {
                    marginLeft: '30px',
                },
                '& .monaco-editor, .monaco-editor-background': {
                    background: 'transparent',
                },
                '& .monaco-editor-background': {
                    background: '#f5000000',
                },
                '& .editor-scrollable': {
                    backgroundColor: 'body.background',
                }
            }} >
        </Box >
    </>
    )
}

export default CompareCode