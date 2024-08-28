import * as helpers from '@freecodecamp/curriculum-helpers';
import { Badge, Box, Button } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import Icon from 'components/atoms/Icon';
import SplitResize from 'components/atoms/SplitResize';
import Tabs from 'components/atoms/Tabs';
import Dialog from 'components/molecules/Dialog';
import DrawerCustom from 'components/molecules/DrawerCustom';
import CourseLearningContext from 'components/pages/CorePage/Course/context/CourseLearningContext';
import { delayUntil } from 'helpers/script';
import { replaceEscape, trimBr } from 'helpers/string';
import useDebounce from 'hook/useDebounce';
import useQuery from 'hook/useQuery';
import React from 'react';
import CompareCode from './components/CompareCode';
import FreecodecampEditor from './components/FreecodecampEditor';
import TemplateFreecodeContext from './TemplateFreecodeContext';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import BrowserFrame from 'components/atoms/BrowserFrame';

function NewJs({ menuItemAddIn, onSubmit, content, idPassed, finalyResult, contentNextStep }: {
    onSubmit?: () => void,
    menuItemAddIn?: React.ReactNode,
    content: IContentTemplateCode,
    contentNextStep?: IContentTemplateCode,
    idPassed: boolean,
    lessonNumber: number,
    finalyResult: string,
}) {
    const courseLearningContext = React.useContext(CourseLearningContext);

    const [activePreview] = React.useState(content.challengeFiles.findIndex(item => ['html', 'css'].includes(item.ext)) !== -1);

    const times = React.useState(-1);

    const testInfo = React.useState<{
        success: boolean,
        enable: boolean,
        hint?: string,
        index?: number,
    }>({
        success: false,
        enable: false,
        hint: '',
        index: -1,
    });

    const formatEditor = React.useState<{
        formatCode: number,
        refresh: number,
        autoWrapText: boolean,
        fontSize: number,
    }>({
        formatCode: 0,
        refresh: 0,
        autoWrapText: true,
        fontSize: 18,
    });

    const contentLog = React.useState<{
        log: Array<{
            content: string,
            time: number,
        }>,
        test: Array<{
            content: string,
            result: boolean,
            index: number,
        }>,

        // {
        //     [key: string]: {
        //         result: boolean | undefined,
        //         actualResults: string | undefined,
        //     }
        // },
        test_pass: number[],
        test_count: number,
        log_count: number,
    }>({
        log: [],
        test: [],
        test_pass: [],
        test_count: 0,
        log_count: 0,
    });

    const contentState = React.useState({
        ...content,
        tests: content.tests.filter(item => !item.delete).map(item => ({ ...item, text: trimBr(item.text) })),
        files: content.challengeFiles.map(item => {

            let editableRegionBoundaries: ANY = item.editableRegionBoundaries;
            if (editableRegionBoundaries && typeof editableRegionBoundaries === 'string') {
                editableRegionBoundaries = (editableRegionBoundaries as string).split(',');
            }

            if (!Array.isArray(editableRegionBoundaries) || editableRegionBoundaries.length < 2) {
                editableRegionBoundaries = [];
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
    const iframeFinalyResultRef = React.useRef<HTMLIFrameElement | null>(null);

    const openCompareResult = React.useState(false);
    const openTest = React.useState(false);

    const urlQuery = useQuery({
        tab_tab_c_b: '',
        tab_files: '',
    });

    const debounceContent = useDebounce(contentState[0], 300);

    const clearOldDataTest = () => {
        contentLog[1]({
            log: [],
            test: [],
            test_pass: [],
            test_count: 0,
            log_count: 0,
        });
    }

    React.useEffect(() => {

        if (urlQuery.query.tab_tab_c_b === 'finaly-result') {
            delayUntil(() => iframeFinalyResultRef.current?.contentWindow?.load ? true : false, () => {
                if ((iframeFinalyResultRef.current as HTMLIFrameElement).contentWindow?.load) {
                    clearOldDataTest();
                    (iframeFinalyResultRef.current as HTMLIFrameElement).contentWindow?.load(finalyResult);
                }
            });
        }

    }, [urlQuery.query.tab_tab_c_b]);

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
                clearOldDataTest();
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
                clearOldDataTest();
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

        if (iframeFinalyResultRef.current) {
            (iframeFinalyResultRef.current as HTMLIFrameElement).style.pointerEvents = 'all';
        }
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
                        actualResults: string | undefined,
                        index: number,
                        color?: string,
                        tag?: string,
                        height?: string,
                        correct?: boolean,
                    }>
                } = JSON.parse(event.data);

                if (data.live_code) {

                    contentLog[1](prev => {

                        let hintString = '';
                        let hasTest = false, index = -1;

                        // let consoleString: string[] = ''

                        const temp: typeof contentLog[0] = { ...prev };

                        data.message.forEach(item => {
                            switch (item.type) {
                                case 'test':
                                    if (!hintString) {
                                        hintString = item.content ?? '';
                                        hasTest = true;
                                        index = item.index;
                                    }

                                    temp.test.push({
                                        content: item.content + '',
                                        result: item.isTrue ?? false,
                                        index: item.index,
                                    });

                                    if (item.isTrue) {
                                        temp.test_pass.push(item.index);
                                    }

                                    break;
                                case 'alert':
                                    {
                                        let content = '<pre style="color:green;font-weight:bold;">!Alert: ' + item.content + '</pre>';
                                        if (temp.log.findIndex(item => item.content === content && (item.time + 0.5) >= Date.now() / 1000) === -1) {
                                            temp.log.push({
                                                content: content,
                                                time: Date.now() / 1000,
                                            });
                                        }
                                    }
                                    break;
                                case 'error':
                                    {
                                        let content = '<pre style="normal;color:red;">' + item.content + '</pre>';
                                        if (temp.log.findIndex(item => item.content === content && (item.time + 0.5) >= Date.now() / 1000) === -1) {
                                            temp.log.push({
                                                content: content,
                                                time: Date.now() / 1000,
                                            });
                                            temp.log_count++;
                                        }
                                    }
                                    break;
                                case 'log':
                                    {
                                        let content = '<pre style="' + (item.color ? "color:" + item.color : '') + '">' + (item.tag ? '<' + item.tag + '>' : '') + removeTagP(item.content + '') + (item.tag ? '</' + item.tag + '>' : '') + '</pre>';
                                        if (temp.log.findIndex(item => item.content === content && (item.time + 0.5) >= Date.now() / 1000) === -1) {
                                            temp.log.push({
                                                content: content,
                                                time: Date.now() / 1000,
                                            });
                                            temp.log_count++;
                                        }
                                    }
                                    break;
                            }
                        });

                        temp.test_pass = [...(new Set(temp.test_pass))];

                        if (hasTest) {
                            if (hintString) {
                                testInfo[1]({
                                    enable: true,
                                    success: false,
                                    hint: hintString,
                                    index: index,
                                });
                            } else {
                                testInfo[1]({
                                    enable: true,
                                    success: true,
                                    index: -1,
                                })
                            }
                        }

                        return temp;
                        // contentLog[1](data.message);
                    });
                }

            } catch (error) {
                //
            }

        };

        window.addEventListener("message", eventListenerMessage);

        delayUntil(() => (iframeRef.current as HTMLIFrameElement)?.contentWindow?.addHelper ? true : false, () => {
            (iframeRef.current as HTMLIFrameElement).contentWindow?.addHelper(helpers);
        });

        return () => {
            window.removeEventListener("message", eventListenerMessage);
        };

    }, []);

    // const testList = testScript[0];

    const contentConsoleTab = <Box
        sx={{
            backgroundColor: 'background.paper',
            height: '100%',
            '&>.tab-horizontal': {
                height: 'calc( 100% - 48px )',
                display: 'flex',
                flexDirection: 'column',
                '& .tabWarper': {
                    pl: 1,
                    pr: 3,
                },
                '& .tabContent': {
                    flexGrow: 1,
                    mt: 0,
                    height: '100%',
                }
            },
        }}
    >
        <Tabs
            name='tab_c_t'
            tabs={[
                {
                    title: <>
                        <Badge badgeContent={contentLog[0].log_count} max={100} color={"secondary"} sx={{ '.MuiBadge-badge': { right: '-14px' } }}>
                            Console
                        </Badge>
                    </>,
                    key: 'console',
                    content: () => <Box
                        className="custom_scroll custom"
                        sx={{
                            p: 2,
                            pt: 0,
                            height: '100%',
                        }}
                    >
                        <CodeBlock
                            disableCopyButton
                            sx={{
                                '& *': {
                                    fontFamily: 'monospace',
                                    fontSize: '16px',
                                }
                            }}
                            html={replaceEscape(contentLog[0].log.map(item => item.content).join(''))}
                        />
                    </Box>
                },
                {
                    title: <>
                        <Badge badgeContent={(contentLog[0].test_pass.length ?? 0) + '/' + contentState[0].tests.length} max={100} color={contentLog[0].test_pass.length === contentState[0].tests.length ? 'success' : "secondary"} sx={{ '.MuiBadge-badge': { right: '-14px' } }}>
                            Kịch bản kiểm thử
                        </Badge>
                    </>,
                    key: 'testcase',
                    content: () => <Box
                        className="custom_scroll custom"
                        sx={{
                            p: 2,
                            pt: 0,
                            height: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                flexDirection: 'column',
                                pt: 3,
                            }}
                        >
                            {
                                contentState[0].tests.map((item, index) => <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'center',
                                    }}
                                >
                                    {
                                        contentLog[0].test.findIndex(item2 => item2.index === index && item2.result) > -1 ?
                                            <CheckCircleRounded color='success' />
                                            :
                                            <RadioButtonUncheckedRounded />
                                    }
                                    <CodeBlock
                                        disableCopyButton
                                        html={replaceEscape(trimBr(removeTagP(item.text))).trim()}
                                        sx={{
                                            '& *': {
                                                fontFamily: 'monospace',
                                                fontSize: '16px',
                                                whiteSpace: 'break-spaces',
                                            }
                                        }}
                                    />
                                </Box>
                                )
                            }
                            {/* <CodeBlock
                            disableCopyButton
                            sx={{
                                '& *': {
                                    fontFamily: 'monospace',
                                    fontSize: '16px',
                                    whiteSpace: 'break-spaces',
                                }
                            }}
                            html={replaceEscape(contentLog[0].testLog)}
                        /> */}
                        </Box>
                    </Box>
                }
            ]}
        />
    </Box>

    return (<TemplateFreecodeContext.Provider
        value={{
            formatEditor: formatEditor[0],
            files: contentState[0].files,
            testInfo: testInfo,
            openTest: () => {
                contentState[1](prev => ({ ...prev }));
                openTest[1](true);
            },
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
            storeId='new_js'
            height='calc(100vh - 64px)'
            width='100%'
            minSize={500}
            onChange={(value) => {
                (iframeRef.current as HTMLIFrameElement).style.pointerEvents = 'none';
                if (iframeFinalyResultRef.current) {
                    iframeFinalyResultRef.current.style.pointerEvents = 'none';
                }
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
                    '& .iframe_result': {
                        opacity: 0,
                        position: 'absolute',
                        pointerEvents: 'none !important',
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
                    },
                }}
            >
                {
                    !activePreview &&
                    <iframe
                        onError={(e) => {
                            console.log(e);
                        }}
                        src="/browser/new_js.html"
                        className="iframe_result"
                        ref={iframeRef}
                    >
                        {contentIframe[0]}
                    </iframe>
                }
                <Tabs
                    name='files'
                    tabIndex={contentState[0].files.findIndex(item => item.startLine !== -1)}
                    tabs={contentState[0].files.map((file) => ({
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
                activePreview ?
                    <SplitResize
                        variant='horizontal'
                        storeId='browser_console'
                        onChange={(value) => {
                            (iframeRef.current as HTMLIFrameElement).style.pointerEvents = 'none';
                            if (iframeFinalyResultRef.current) {
                                iframeFinalyResultRef.current.style.pointerEvents = 'none';
                            }
                            heightOfIframe[1](value);
                        }}
                        minSize={300}
                        pane1={<Box
                            sx={{
                                position: 'relative',
                                zIndex: 2,
                                margin: 0,
                                height: '100%',
                                '.tabContent': {
                                    mt: 0,
                                },
                                '&>.tab-horizontal': {
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '& .tabWarper': {
                                        pl: 1,
                                        pr: 3,
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
                                    ...(urlQuery.query.tab_tab_c_b !== 'console' ? {

                                    } : {
                                        opacity: 0,
                                        pointerEvents: 'none !important',
                                    })
                                }
                            }}
                        >
                            {/* <Tabs
                                name='tab_c_b'
                                tabs={[
                                    {
                                        title: 'Xem trước',
                                        key: 'browser',
                                        content: () => 
                                    },
                                ]}
                                menuItemAddIn={courseLearningContext.menuReport}
                            /> */}
                            <BrowserFrame
                                rightButton={courseLearningContext.menuReport}
                            >
                                <iframe
                                    onError={(e) => {
                                        console.log(e);
                                    }}
                                    src="/browser/new_js.html"
                                    className="iframe_result"
                                    ref={iframeRef}
                                >
                                    {contentIframe[0]}
                                </iframe>
                            </BrowserFrame>
                        </Box >}
                        pane2={contentConsoleTab}
                    />
                    : contentConsoleTab
            }
        />
        < Dialog
            title={'Bài kiểm tra bạn cần vượt qua (' + contentState[0].tests.length + ')'}
            open={openTest[0]}
            onClose={() => {
                openTest[1](false)
            }}
            action={< Button
                variant='contained'
                onClick={() => openCompareResult[1](true)}
            >
                So sánh với đáp án
            </Button >}
        >
            {
                contentState[0].tests.map((item, index) => (
                    <Box key={index}
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        {
                            testInfo[0].index !== undefined && testInfo[0].index >= index ?
                                <Icon sx={{ color: 'success.main' }} icon="CheckRounded" />
                                :
                                <Icon sx={{ color: 'error.main' }} icon="ClearRounded" />
                        }
                        <CodeBlock html={item.text} />
                    </Box>
                ))
            }
        </Dialog >

        <DrawerCustom
            title="So sánh đáp án với code của bạn"
            open={openCompareResult[0]}
            onClose={() => {
                openCompareResult[1](false);
            }}
            sx={{
                zIndex: 2147483647
            }}
            onCloseOutsite
            width={1920}
            height={'100%'}
            restDialogContent={{
                sx: {
                    overflowX: 'hidden',
                }
            }}
        >
            <CompareCode indexFileCurrent={contentState[0].files.findIndex(item => item.startLine > -1)} files={contentState[0].files} files2={contentNextStep?.challengeFiles} />
        </DrawerCustom>
    </TemplateFreecodeContext.Provider >
    )
}

export default NewJs

export interface IContentTemplateCode {
    id: ID,
    content: string,
    instructions: string,
    description: string,
    challengeFiles: Array<ITemplateCodeFile>,
    tests: Array<{
        testString: string
        text: string,
        delete: number,
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
    final_result?: string,
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

function removeTagP(htmlContent: string) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    return htmlContent.replaceAll('<p>', '').replaceAll('</p>', "\n");
}