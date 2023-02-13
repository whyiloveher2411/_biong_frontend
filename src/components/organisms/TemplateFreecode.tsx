import { Badge, Box, Typography } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import Icon from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import MonacoEditor from 'components/atoms/MonacoEditor';
import MoreButton from 'components/atoms/MoreButton';
import SplitResize from 'components/atoms/SplitResize';
import Tabs from 'components/atoms/Tabs';
import Tooltip from 'components/atoms/Tooltip';
import { __ } from 'helpers/i18n';
import { delayUntil } from 'helpers/script';
import useDebounce from 'hook/useDebounce';
import useQuery from 'hook/useQuery';
import React from 'react';

function TemplateFreecode({ menuItemAddIn, onSubmit, content, idPassed }: {
    onSubmit?: (html: string, javascript: string, css: string) => void,
    menuItemAddIn?: React.ReactNode,
    content: IContentTemplateCode,
    idPassed: boolean,
}) {

    const times = React.useState(-1);

    const contentState = React.useState({
        ...content,
        files: content.challengeFiles.map(item => ({ ...item, code_default: item.contents }))
    });
    const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

    const editorRef = React.useRef<ANY>(null);
    const resetRef = React.useRef<ANY>(null);

    const autoWrapText = React.useState(Number(localStorage.getItem('editor_disawt')) ? false : true);
    const fontSizeEditor = React.useState(Number(localStorage.getItem('editor_fs')) ? Number(localStorage.getItem('editor_fs')) : 18);

    const urlQuery = useQuery({
        tab_tab_c_b: '',
        tab_files: '',
    });

    const contentLog = React.useState<{
        log: string,
        test: {
            [key: string]: {
                result: boolean | undefined,
                actualResults: string | undefined,
            }
        },
        test_pass: number,
        test_count: number,
        log_count: number,
    }>({
        log: '',
        test: {},
        test_pass: 0,
        test_count: 0,
        log_count: 0,
    });

    const heightOfIframe = React.useState(0);

    const contentIframe = React.useState('');

    const debounce = useDebounce(heightOfIframe[0], 300);

    const testScript = React.useState<Array<{
        testString: string;
        text: string;
    }> | null>(content.tests);

    React.useEffect(() => {

        times[1](prev => ++prev);

    }, [urlQuery.query.tab_files]);

    React.useEffect(() => {
        (iframeRef.current as HTMLIFrameElement).style.pointerEvents = 'all';
    }, [debounce]);

    React.useEffect(() => {
        const result = Number(fontSizeEditor[0]);
        if (result && fontSizeEditor[0] >= 6 && fontSizeEditor[0] <= 48) {
            localStorage.setItem('editor_fs', fontSizeEditor[0] + '');
        }
    }, [fontSizeEditor[0]]);

    const handleOnChange = (index: number) => async (html: string, script: string, css: string, primitiveValue: string) => {
        delayUntil(() => iframeRef.current ? true : false,
            () => {
                contentState[1](prev => {
                    let originalString = prev.files[index].contents;
                    let startString = "[question_here]";
                    let endString = "[submit_here]";

                    let startIndex = originalString.indexOf(startString) + startString.length;
                    let endIndex = originalString.indexOf(endString);

                    let hasNewLine = originalString[startIndex] === '\n';
                    let newString = originalString.substring(0, startIndex) + (hasNewLine ? '\n' : '') + primitiveValue + originalString.substring(endIndex);

                    prev.files[index].contents = newString;

                    // console.log(contentState[0].files[index].code);
                    // console.log(newString);

                    delayUntil(() => iframeRef.current?.contentWindow?.load, () => {
                        if (prev.files[index].ext === 'html' && (iframeRef.current as HTMLIFrameElement).contentWindow?.load) {
                            (iframeRef.current as HTMLIFrameElement).contentWindow?.load(script, html, '');
                        }
                    });
                    return { ...prev };
                });
            });
    }

    const handleOnTest = (index: number) => async (html: string, script: string, css: string, primitiveValue: string) => {
        delayUntil(() => iframeRef.current ? true : false,
            () => {
                contentState[1](prev => {
                    let originalString = prev.files[index].contents;
                    let startString = "[question_here]";
                    let endString = "[submit_here]";

                    let startIndex = originalString.indexOf(startString) + startString.length;
                    let endIndex = originalString.indexOf(endString);

                    let hasNewLine = originalString[startIndex] === '\n';
                    let newString = originalString.substring(0, startIndex) + (hasNewLine ? '\n' : '') + primitiveValue + originalString.substring(endIndex);

                    prev.files[index].contents = newString;

                    // console.log(contentState[0].files[index].code);
                    // console.log(newString);

                    delayUntil(() => iframeRef.current?.contentWindow?.load, () => {
                        if (prev.files[index].ext === 'html' && (iframeRef.current as HTMLIFrameElement).contentWindow?.load) {
                            (iframeRef.current as HTMLIFrameElement).contentWindow?.load(script, html, css, testScript[0]);
                        }
                    });
                    return { ...prev };
                });
            });
    }

    React.useEffect(() => {

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
                    const temp: typeof contentLog[0] = {
                        log: '',
                        test: {},
                        test_pass: 0,
                        test_count: 0,
                        log_count: 0,
                    };

                    let testStringResult = '';
                    let hasTest = false;
                    let testPassed = 0;

                    data.message.forEach(item => {
                        switch (item.type) {
                            case 'test':
                                testStringResult = item.content ?? '';
                                hasTest = true;
                                testPassed = item.testPassed ?? 0;

                                break;
                            case 'alert':
                                temp.log += '<pre style="color:green;font-weight:bold;">!Alert: ' + item.content + '</pre>';
                                break;
                            case 'error':
                                temp.log += '<pre style="color:red;">' + item.content + '</pre>';
                                temp.log_count++;
                                break;
                            case 'log':
                                temp.log += '<pre>' + item.content + '</pre>';
                                temp.log_count++;
                                break;
                        }
                    });

                    if (hasTest && editorRef.current) {
                        editorRef.current.reLoadTest(testStringResult, testPassed === testScript[0]?.length);
                    }

                    contentLog[1](temp);
                    // contentLog[1](data.message);
                }
            } catch (error) {
                //
            }

        };

        window.addEventListener("message", eventListenerMessage);

        return () => {
            window.removeEventListener("message", eventListenerMessage);
        };

    }, []);

    const testList = testScript[0];

    return (<><SplitResize
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
                // '& .monaco-editor .submit_test': {
                //     ...(contentLog[0].test_pass !== testList?.length ? {
                //         backgroundColor: '#ffffff',
                //         color: 'black',
                //         '&:hover': {
                //             opacity: 0.7,
                //         }
                //     } : {
                //         backgroundColor: 'primary.main',
                //         color: 'primary.contrastText',
                //         '&:hover': {
                //             backgroundColor: 'primary.dark',
                //         }
                //     })
                // }
            }}
        >

            <Tabs
                name='files'
                tabs={contentState[0].files.map((file, index) => ({
                    title: file.name,
                    content: () => (times[0] === -1 || times[0] % 2 === 0) ?
                        <MonacoEditor
                            sx={{
                                height: 'calc(100vh - 122px)',
                            }}
                            defaultContent={file.code_default}
                            content={file.contents}
                            language={file.ext}
                            idPassed={idPassed}
                            question={{
                                title: contentState[0].title,
                                content: contentState[0].description,
                            }}
                            onChange={handleOnChange(index)}
                            onTest={handleOnTest(index)}
                            editor={editorRef}
                            resetRef={resetRef}
                            autoWrapText={autoWrapText[0]}
                            onSubmit={onSubmit}
                            fontSize={fontSizeEditor[0]}
                        />
                        :
                        <Box>
                            <MonacoEditor
                                sx={{
                                    height: 'calc(100vh - 122px)',
                                }}
                                defaultContent={file.code_default}
                                content={file.contents}
                                language={file.ext}
                                idPassed={idPassed}
                                question={{
                                    title: contentState[0].title,
                                    content: contentState[0].description,
                                }}
                                onChange={handleOnChange(index)}
                                onTest={handleOnTest(index)}
                                editor={editorRef}
                                resetRef={resetRef}
                                autoWrapText={autoWrapText[0]}
                                onSubmit={(html, script, css) => {
                                    if (contentLog[0].test_pass === testList?.length) {
                                        if (onSubmit) {
                                            onSubmit(html, script, css);
                                        }
                                    } else {
                                        window.showMessage('Hãy hoàn thành tất cả bài kiểm tra và trước khi nộp bài.', 'error');
                                    }
                                }}
                                fontSize={fontSizeEditor[0]}
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
                    <Tooltip title="Auto Wrap Text">
                        <IconButton
                            color={autoWrapText[0] ? 'primary' : 'inherit'}
                            onClick={() => {
                                autoWrapText[1](prev => {
                                    if (prev) {
                                        localStorage.setItem('editor_disawt', '1');
                                        editorRef.current.updateOptions({ wordWrap: "off" });
                                    } else {
                                        localStorage.setItem('editor_disawt', '0');
                                        editorRef.current.updateOptions({ wordWrap: "on" });
                                    }
                                    return !prev;
                                });
                            }}
                        >
                            <Icon icon="WrapText" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Format code">
                        <IconButton
                            onClick={() => {
                                if (editorRef.current) {
                                    const formatCodeAction = editorRef.current.getAction("editor.action.formatDocument");
                                    formatCodeAction.run();
                                }
                            }}
                        >
                            <Icon icon="AutoFixHigh" />
                        </IconButton>
                    </Tooltip>
                    <MoreButton
                        actions={[
                            {
                                refresh: {
                                    title: 'Làm mới',
                                    icon: 'Refresh',
                                    action: () => {
                                        if (resetRef.current) {
                                            resetRef.current();
                                        }
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
                                            disabled={fontSizeEditor[0] < 6}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fontSizeEditor[1](prev => {
                                                    if (prev > 6) {
                                                        editorRef.current.updateOptions({ fontSize: prev - 1 });
                                                        return prev - 1;
                                                    }

                                                    return prev;
                                                })
                                            }}
                                        >
                                            <Icon sx={{ fontSize: 16 }} icon="RemoveRounded" />
                                        </IconButton>
                                        <Typography component="span" sx={{ width: 24 }} align='center' variant='h5'>{fontSizeEditor[0]}</Typography>
                                        <IconButton
                                            component="span"
                                            size="small"
                                            disabled={fontSizeEditor[0] > 48}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fontSizeEditor[1](prev => {
                                                    if (prev < 48) {
                                                        editorRef.current.updateOptions({ fontSize: prev + 1 });
                                                        return prev + 1;
                                                    }
                                                    return prev;
                                                })
                                            }}
                                        >
                                            <Icon sx={{ fontSize: 16 }} icon="AddRounded" />
                                        </IconButton>
                                    </Box>,
                                    icon: 'FormatSize',
                                    action: () => {
                                        editorRef.current.updateOptions({ fontSize: 16 });
                                        fontSizeEditor[1](16);
                                        return true;
                                    }
                                },
                            }
                        ]}
                    />
                </Box>}
            />
        </Box>}
        pane2={
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    margin: 0,
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
                <SplitResize
                    variant='horizontal'
                    height='calc(100vh - 64px)'
                    width='100%'
                    onChange={(value) => {
                        (iframeRef.current as HTMLIFrameElement).style.pointerEvents = 'none';
                        heightOfIframe[1](value);
                    }}
                    pane1={<>
                        <Tabs
                            name='tab_c_b'
                            tabs={[
                                {
                                    title: 'Browser',
                                    key: 'browser',
                                    content: () => <></>
                                },
                                {
                                    title: 'Nội dung',
                                    key: 'content',
                                    content: () => content.content ? <CodeBlock
                                        className="custom_scroll"
                                        sx={{
                                            overflowY: 'overlay',
                                            pl: 1,
                                            pr: 1,
                                            position: 'absolute',
                                            top: 0,
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            fontSize: 18,
                                            lineHeight: '24px',
                                            '&>*:first-of-type': {
                                                mt: 0,
                                            }
                                        }}
                                        html={content.content}
                                    />
                                        : <ContentEmpty message={__('Bài học không có nội dung.')} />
                                },
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
                    </>
                    }
                    sxPane1={{
                        display: 'flex',
                        backgroundColor: 'body.background',
                        position: 'relative',
                        width: '100%',
                        '& .tab-horizontal': {
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            height: '100%',
                        },
                        '& .tabContent': {
                            overflow: 'hidden',
                            width: '100%',
                            flexGrow: 1,
                            position: 'relative',
                        },
                        '& .tabWarper': {
                            pl: 1,
                            pr: 1,
                        }
                    }}
                    sxPane2={{
                        display: 'flex',
                        backgroundColor: 'body.background',
                        '& .tab-horizontal': {
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                        },
                        '& .tabContent': {
                            overflow: 'hidden',
                            width: '100%',
                            flexGrow: 1,
                            position: 'relative',
                        },
                        '& .tabWarper': {
                            pl: 1,
                            pr: 1,
                        }
                    }}
                    pane2={<Tabs
                        name='tab_b_c'
                        tabs={[
                            {
                                title: <Badge
                                    badgeContent={contentLog[0].log_count}
                                    color='secondary'
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            right: -12
                                        }
                                    }}
                                >
                                    <Typography sx={{ color: 'inherit', }} component='span'> {__('Console')}
                                    </Typography>
                                </Badge>,
                                content: () => contentLog[0].log ? <Box
                                    className="custom_scroll"
                                    sx={{
                                        overflowY: 'overlay',
                                        pl: 1,
                                        pr: 1,
                                        position: 'absolute',
                                        top: -16,
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        '& *': {
                                            fontFamily: 'monospace',
                                            fontSize: '16px',
                                            whiteSpace: 'break-spaces',
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            pb: 1,
                                        }}
                                        dangerouslySetInnerHTML={{ __html: contentLog[0].log }}
                                    />
                                </Box> : <ContentEmpty message={__('Không tìm thấy nội dung ở console.')} />
                            }
                        ]}
                        menuItemAddIn={<Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                ml: 'auto',
                                gap: 1,
                            }}
                        >
                            {menuItemAddIn}
                        </Box>}
                    />
                    }
                    storeId='h_live_code'
                />
            </Box >
        }
        sxPane1={{
            backgroundColor: 'body.background',
            position: 'relative',
        }}
        storeId='v_live_code'
    />
    </>
    )
}

export default TemplateFreecode

export interface IContentTemplateCode {
    id: ID,
    content: string,
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
    // editableRegionBoundaries?: [number, number],
    history: string[],
    fileKey: string,
}

function ContentEmpty({ message }: { message: string }) {

    return <Box
        sx={{
            display: 'flex',
            gap: 3,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            p: 2
        }}
    >
        <Typography align='center' sx={{ color: 'text.secondary' }} variant='h4'>{message}</Typography>
    </Box>
}