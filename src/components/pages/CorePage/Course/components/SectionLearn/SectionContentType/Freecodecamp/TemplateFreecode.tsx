import { Box } from '@mui/material';
import SplitResize from 'components/atoms/SplitResize';
import Tabs from 'components/atoms/Tabs';
import * as CSSHelp from 'helpers/curriculum-helpers';
import { delayUntil } from 'helpers/script';
import useDebounce from 'hook/useDebounce';
import useQuery from 'hook/useQuery';
import React from 'react';
import FreecodecampEditor from './FreecodecampEditor';
import TemplateFreecodeContext from './TemplateFreecodeContext';

function TemplateFreecode({ menuItemAddIn, onSubmit, content, idPassed }: {
    onSubmit?: () => void,
    menuItemAddIn?: React.ReactNode,
    content: IContentTemplateCode,
    idPassed: boolean,
    lessonNumber: number,
}) {

    const times = React.useState(-1);

    const testInfo = React.useState<{
        success: boolean,
        enable: boolean,
        hint?: string,
    }>({
        success: false,
        enable: false,
        hint: '',
    });

    const formatEditor = React.useState<{
        formatCode: number,
        refresh: number,
        autoWrapText: boolean,
        fontSize: number,
    }>({
        formatCode: 0,
        refresh: 0,
        autoWrapText: false,
        fontSize: 18,
    });

    const contentState = React.useState({
        ...content,
        files: content.challengeFiles.map(item => {

            let editableRegionBoundaries: ANY = item.editableRegionBoundaries;
            if (editableRegionBoundaries && typeof editableRegionBoundaries === 'string') {
                editableRegionBoundaries = (editableRegionBoundaries as string).split(',');
            }

            let startLine = -1;
            let lineEnd = -1;
            let lines = item.contents?.split('\n') ?? [''];

            lines = lines.map((item2, index) => {
                if (item2.includes('[question_here]')) {
                    if (index === 0) {
                        startLine = 0;
                    } else {
                        startLine = index + 1;
                    }
                    item2 = item2.replace('[question_here]', '');
                }
                if (item2.includes('[submit_here]')) {
                    lineEnd = index + 2;
                    item2 = item2.replace('[submit_here]', '');
                }
                return item2;
            });

            if (startLine === -1) {
                if (editableRegionBoundaries?.length) {
                    startLine = editableRegionBoundaries[0] === 0 ? 0 : Number(editableRegionBoundaries[0]) ? Number(editableRegionBoundaries[0]) : 0;
                    lineEnd = editableRegionBoundaries[1] === 0 ? 0 : Number(editableRegionBoundaries[1]) ? Number(editableRegionBoundaries[1]) : 0;
                }

                if (editableRegionBoundaries[1]) {
                    if (lines.length < editableRegionBoundaries[1]) {
                        for (let i = lines.length; i < editableRegionBoundaries[1]; i++) {
                            lines.push('');
                        }
                    }
                }

            }



            const contentString = lines.join('\n');

            return {
                ...item,
                contents: contentString,
                code_default: contentString,
                startLine: startLine,
                coutLineReadOnlyBottomUp: lines.length === (lineEnd - 1) ? -1 : (lines.length - lineEnd) > 0 ? (lines.length - lineEnd) : 0
            };
        })
    });

    const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

    const urlQuery = useQuery({
        tab_tab_c_b: '',
        tab_files: '',
    });

    const debounceContent = useDebounce(contentState[0], 300);

    React.useEffect(() => {
        delayUntil(() => iframeRef.current?.contentWindow?.load, () => {
            let html = '', css = '', js = '';
            let indexOfFileTarget = -1;

            contentState[0].files.forEach((item, index) => {
                if (item.startLine !== -1) {
                    indexOfFileTarget = index;
                }
                if (item.ext === 'html') {
                    html += item.contents;
                } else if (item.ext === 'css') {
                    css += item.contents;
                } else {
                    js += item.contents + ';';
                }
            });

            let inputUserEdit = '';

            if (indexOfFileTarget !== -1) {
                inputUserEdit = contentState[0].files[indexOfFileTarget].contents;
            }

            if ((iframeRef.current as HTMLIFrameElement).contentWindow?.load) {
                (iframeRef.current as HTMLIFrameElement).contentWindow?.load(html, css, js, contentState[0].tests, inputUserEdit);
            }
        });
    }, [debounceContent]);

    const handleSendTestToIframe = () => {
        delayUntil(() => iframeRef.current?.contentWindow?.load, () => {
            let html = '', css = '', js = '';

            let indexOfFileTarget = -1;

            contentState[0].files.forEach((item, index) => {
                if (item.startLine !== -1) {
                    indexOfFileTarget = index;
                }
                if (item.ext === 'html') {
                    html += item.contents;
                } else if (item.ext === 'css') {
                    css += item.contents;
                } else {
                    js += item.contents + ';';
                }
            });


            let inputUserEdit = '';

            if (indexOfFileTarget !== -1) {
                inputUserEdit = contentState[0].files[indexOfFileTarget].contents;
            }

            if ((iframeRef.current as HTMLIFrameElement).contentWindow?.load) {
                (iframeRef.current as HTMLIFrameElement).contentWindow?.load(html, css, js, contentState[0].tests, inputUserEdit);
            }
        });
    }

    const heightOfIframe = React.useState(0);

    const contentIframe = React.useState('');

    const debounce = useDebounce(heightOfIframe[0], 300);

    React.useEffect(() => {

        times[1](prev => ++prev);

    }, [urlQuery.query.tab_files]);

    React.useEffect(() => {
        (iframeRef.current as HTMLIFrameElement).style.pointerEvents = 'all';
    }, [debounce]);

    React.useEffect(() => {

        formatEditor[1]({
            fontSize: Number(localStorage.getItem('editor_fs')) ? Number(localStorage.getItem('editor_fs')) : 18,
            autoWrapText: Number(localStorage.getItem('editor_disawt')) ? false : true,
            formatCode: 0,
            refresh: 0,
        });

        const eventListenerMessage = function (event: MessageEvent) {
            try {
                const data: {
                    live_code?: boolean,
                    message: Array<{
                        type: 'log' | 'alert' | 'error' | 'assert' | 'test',
                        content?: string,
                        testPassed?: number,
                        isTrue?: boolean,
                        actualResults: string | undefined
                    }>
                } = JSON.parse(event.data);

                if (data.live_code) {

                    let hintString = '';
                    let hasTest = false;
                    // let consoleString: string[] = ''

                    data.message.forEach(item => {
                        switch (item.type) {
                            case 'test':
                                hintString = item.content ?? '';
                                hasTest = true;
                                break;
                            case 'alert':
                                // consoleString.push += '<pre style="color:green;font-weight:bold;">!Alert: ' + item.content + '</pre>';
                                break;
                            case 'error':
                                // consoleString += '<pre style="color:red;">' + item.content + '</pre>';
                                // temp.log_count++;
                                break;
                            case 'log':
                                // consoleString += '<pre>' + item.content + '</pre>';
                                // temp.log_count++;
                                break;
                        }
                    });

                    if (hasTest) {
                        if (hintString) {
                            testInfo[1]({
                                enable: true,
                                success: false,
                                hint: hintString,
                            });
                        } else {
                            testInfo[1]({
                                enable: true,
                                success: true,
                            })
                        }
                    }

                    // contentLog[1](temp);
                    // contentLog[1](data.message);
                }
            } catch (error) {
                //
            }

        };

        window.addEventListener("message", eventListenerMessage);

        delayUntil(() => (iframeRef.current as HTMLIFrameElement)?.contentWindow?.addHelper ? true : false, () => {
            (iframeRef.current as HTMLIFrameElement).contentWindow?.addHelper(CSSHelp);
        });

        return () => {
            window.removeEventListener("message", eventListenerMessage);
        };

    }, []);

    // const testList = testScript[0];

    return (<TemplateFreecodeContext.Provider
        value={{
            formatEditor: formatEditor[0],
            files: contentState[0].files,
            testInfo: testInfo,
            setValueFile: (key: string, value: string) => {
                contentState[1](prev => {
                    const index = prev.files.findIndex(item => item.fileKey === key);
                    if (index > -1) {
                        prev.files[index].contents = value;
                    }

                    return { ...prev };
                });
            },
            onSubmit: () => {
                if (onSubmit) { onSubmit(); }
            },
            onTest: handleSendTestToIframe
        }}
    >
        <SplitResize
            variant='vertical'
            height='calc(100vh - 64px)'
            width='100%'
            onChange={(value) => {
                (iframeRef.current as HTMLIFrameElement).style.pointerEvents = 'none';
                heightOfIframe[1](value);
            }}
            pane1={<Box
                sx={{
                    position: 'relative',
                    zIndex: 99,
                    '& .tabContent': {
                        mt: 1,
                    },
                    '& .tabWarper': {
                        pl: 1,
                    },
                }}
            >

                <Tabs
                    name='files'
                    tabIndex={contentState[0].files.findIndex(item => item.startLine !== -1)}
                    tabs={contentState[0].files.map((file, index) => ({
                        title: file.name + '.' + file.ext,
                        content: () => (times[0] === -1 || times[0] % 2 === 0) ?
                            <FreecodecampEditor
                                sx={{
                                    height: 'calc(100vh - 122px)',
                                }}
                                file={file}
                                idPassed={idPassed}
                                question={{
                                    title: contentState[0].title,
                                    content: contentState[0].description,
                                }}
                            />
                            :
                            <Box>
                                <FreecodecampEditor
                                    sx={{
                                        height: 'calc(100vh - 122px)',
                                    }}
                                    file={file}
                                    idPassed={idPassed}
                                    question={{
                                        title: contentState[0].title,
                                        content: contentState[0].description,
                                    }}
                                />
                            </Box>
                    }))}
                    menuItemAddIn={<Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            ml: 'auto',
                            gap: 1,
                        }}
                    >
                        {menuItemAddIn}
                        {/* <Tooltip title="Auto Wrap Text">
                            <IconButton
                                color={formatEditor[0].autoWrapText ? 'primary' : 'inherit'}
                                onClick={() => {
                                    formatEditor[1](prev => ({ ...prev, autoWrapText: !prev.autoWrapText }));
                                }}
                            >
                                <Icon icon="WrapText" />
                            </IconButton>
                        </Tooltip> */}
                        {/* <Tooltip title="Format code">
                            <IconButton
                                onClick={() => {
                                    formatEditor[1](prev => ({ ...prev, formatCode: ++prev.formatCode }));
                                }}
                            >
                                <Icon icon="AutoFixHigh" />
                            </IconButton>
                        </Tooltip> */}
                        {/* <MoreButton
                            actions={[
                                {
                                    refresh: {
                                        title: 'Làm mới',
                                        icon: 'Refresh',
                                        action: () => {
                                            formatEditor[1](prev => ({ ...prev, refresh: ++prev.refresh }));
                                        }
                                    },
                                    upSize: {
                                        title: <Box
                                            component="span"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            Cỡ chữ
                                            <IconButton
                                                size="small"
                                                component="span"
                                                disabled={formatEditor[0].fontSize < 6}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    formatEditor[1](prev => ({ ...prev, fontSize: --prev.fontSize }))
                                                }}
                                            >
                                                <Icon sx={{ fontSize: 16 }} icon="RemoveRounded" />
                                            </IconButton>
                                            <Typography component="span" sx={{ width: 24 }} align='center' variant='h5'>{formatEditor[0].fontSize}</Typography>
                                            <IconButton
                                                component="span"
                                                size="small"
                                                disabled={formatEditor[0].fontSize > 48}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    formatEditor[1](prev => ({ ...prev, fontSize: ++prev.fontSize }))
                                                }}
                                            >
                                                <Icon sx={{ fontSize: 16 }} icon="AddRounded" />
                                            </IconButton>
                                        </Box>,
                                        icon: 'FormatSize',
                                        action: () => {
                                            formatEditor[1](prev => ({ ...prev, fontSize: 16 }))
                                            return true;
                                        }
                                    },
                                }
                            ]}
                        /> */}
                    </Box>}
                />
            </Box>}
            pane2={
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        margin: 0,
                        height: '100%',
                        '&>.tab-horizontal': {
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            '& .tabWarper': {
                                pl: 1,
                            },
                            '& .tabContent': {
                                flexGrow: 1,
                            }
                        },
                        '& .iframe_result': {
                            position: 'absolute',
                            background: 'white',
                            left: 0,
                            top: 48,
                            border: 'none',
                            width: '100%',
                            height: 'calc( 100% - 48px)',
                            ...(urlQuery.query.tab_tab_c_b !== 'content' ? {

                            } : {
                                opacity: 0,
                                pointerEvents: 'none !important',
                            })
                        }
                    }}
                >
                    <Tabs
                        name='tab_c_b'
                        tabs={[
                            {
                                title: 'Browser',
                                key: 'browser',
                                content: () => <></>
                            },
                            // {
                            //     title: 'Nội dung',
                            //     key: 'content',
                            //     content: () => content.content ? <CodeBlock
                            //         className="custom_scroll"
                            //         sx={{
                            //             overflowY: 'overlay',
                            //             pl: 1,
                            //             pr: 1,
                            //             position: 'absolute',
                            //             top: 0,
                            //             bottom: 0,
                            //             left: 0,
                            //             right: 0,
                            //             fontSize: 18,
                            //             lineHeight: '24px',
                            //             '&>*:first-of-type': {
                            //                 mt: 0,
                            //             }
                            //         }}
                            //         html={content.content}
                            //     />
                            //         : <ContentEmpty message={__('Bài học không có nội dung.')} />
                            // },
                        ]}
                    />
                    <iframe
                        onError={(e) => {
                            console.log(e);
                        }}
                        src="/live_code2.html"
                        className="iframe_result"
                        ref={iframeRef}
                    >
                        {contentIframe[0]}
                    </iframe>
                </Box >
            }
            sxPane1={{
                backgroundColor: 'body.background',
                position: 'relative',
            }}
            storeId='v_live_code'
        />
    </TemplateFreecodeContext.Provider>
    )
}

export default TemplateFreecode

export interface IContentTemplateCode {
    id: ID,
    content: string,
    instructions: string,
    description: string,
    challengeFiles: Array<ITemplateCodeFile>,
    tests: Array<{
        testString: string
        text: string,
    }>,
    title: string,
}

export interface ITemplateCodeFile {
    name: string,
    ext: 'html' | 'css' | 'javascript',
    contents: string,
    history: string[],
    editableRegionBoundaries?: [number, number],
    fileKey: string,
}

// function ContentEmpty({ message }: { message: string }) {

//     return <Box
//         sx={{
//             display: 'flex',
//             gap: 3,
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//             height: '100%',
//             p: 2
//         }}
//     >
//         <Typography align='center' sx={{ color: 'text.secondary' }} variant='h4'>{message}</Typography>
//     </Box>
// }