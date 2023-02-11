import { Badge, Box, Typography } from '@mui/material';
import Button from 'components/atoms/Button';
import CodeBlock from 'components/atoms/CodeBlock';
import Icon from 'components/atoms/Icon';
import IconButton from 'components/atoms/IconButton';
import MonacoEditor from 'components/atoms/MonacoEditor';
import MoreButton from 'components/atoms/MoreButton';
import SplitResize from 'components/atoms/SplitResize';
import Tabs from 'components/atoms/Tabs';
import Tooltip from 'components/atoms/Tooltip';
import DrawerCustom from 'components/molecules/DrawerCustom';
import { __ } from 'helpers/i18n';
import { delayUntil } from 'helpers/script';
import useDebounce from 'hook/useDebounce';
import useQuery from 'hook/useQuery';
import React from 'react';

function TemplateCode({ menuItemAddIn, onSubmit, content, idPassed }: {
    onSubmit?: (html: string, javascript: string, css: string) => void,
    menuItemAddIn?: React.ReactNode,
    content: IContentTemplateCode,
    idPassed: boolean,
}) {

    const times = React.useState(-1);

    const contentState = React.useState({
        ...content,
        files: content.files.map(item => ({ ...item, code_default: item.code }))
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
        type: 'test' | 'script',
        title: string,
        condition: string,
        get_result: string,
        hint?: string,
    }> | null>(content.testcase);

    React.useEffect(() => {

        times[1](prev => ++prev);

    }, [urlQuery.query.tab_files]);

    // const testScript = React.useState<Array<{
    //     type: 'test' | 'script',
    //     title: string,
    //     condition: string,
    //     getResult: string,
    // }>>([
    //     {
    //         condition: `typeof sum === 'function'`, title: 'Tạo một function với tên là "sum"', getResult: '', type: 'test'
    //     },
    //     {
    //         condition: ``, title: `if( typeof sum !== 'function' ) {function sum(){}}`, getResult: '', type: 'script'
    //     },
    //     {
    //         condition: `sum.length === 2`, title: `function sum có 2 tham số`, getResult: '', type: 'test'
    //     },
    //     {
    //         condition: `sum(1, 2) === 3`, title: `sum(1,2) => 3`, getResult: '', type: 'test'
    //     },
    //     {
    //         condition: `sum(15, 15) === 30`, title: `sum(15, 15) => 30`, getResult: '', type: 'test'
    //     },
    //     {
    //         condition: `sum(155, 15) === 170`, title: `sum(155, 15) => 170`, getResult: '', type: 'test'
    //     },
    //     {
    //         condition: `sum('1', '2') === 3`, title: `mong đợi sum("1", "2") => 3`, getResult: `sum('1', '2')`, type: 'test'
    //     },
    //     {
    //         condition: `sum('15', '15') === 30`, title: `mong đợi (sum("15", "15") =>  30`, getResult: `sum('15', '15')`, type: 'test'
    //     },
    //     {
    //         condition: `sum("1", "text") === 1`, title: `mong đợi sum("1", "text") => 1`, getResult: `sum("1", "text")`, type: 'test'
    //     },
    //     {
    //         condition: `sum( "text", "5") === 5`, title: `mong đợi sum( "text", "5") => 5`, getResult: `sum( "text", "5")`, type: 'test'
    //     },
    // ]);

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
                    let originalString = prev.files[index].code;
                    let startString = "[question_here]";
                    let endString = "[submit_here]";

                    let startIndex = originalString.indexOf(startString) + startString.length;
                    let endIndex = originalString.indexOf(endString);

                    let hasNewLine = originalString[startIndex] === '\n';
                    let newString = originalString.substring(0, startIndex) + (hasNewLine ? '\n' : '') + primitiveValue + originalString.substring(endIndex);

                    prev.files[index].code = newString;

                    // console.log(contentState[0].files[index].code);
                    // console.log(newString);

                    delayUntil(() => iframeRef.current?.contentWindow?.load, () => {
                        if (prev.files[index].type === 'html' && (iframeRef.current as HTMLIFrameElement).contentWindow?.load) {
                            (iframeRef.current as HTMLIFrameElement).contentWindow?.load(script, html, '', testScript[0]);
                        }
                    });
                    return { ...prev };
                });
            });
    }

    React.useEffect(() => {
        // handleOnChange(content, '', '');
    }, []);

    const [openHint, setOpenHint] = React.useState<false | string>(false);

    React.useEffect(() => {

        const eventListenerMessage = function (event: MessageEvent) {
            try {
                const data: {
                    live_code?: boolean,
                    message: Array<{
                        type: 'log' | 'alert' | 'error' | 'assert',
                        content: string,
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

                    data.message.forEach(item => {
                        switch (item.type) {
                            case 'assert':
                                temp.test[item.content] = {
                                    result: item.isTrue,
                                    actualResults: item.actualResults
                                };
                                if (item.isTrue) {
                                    temp.test_pass++;
                                }
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

    const testList = testScript[0]?.filter(item => item.type === 'test');

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
                '& .monaco-editor .submit_test': {
                    ...(contentLog[0].test_pass !== testList?.length ? {
                        backgroundColor: '#ffffff',
                        color: 'black',
                        '&:hover': {
                            opacity: 0.7,
                        }
                    } : {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        }
                    })
                }
            }}
        >

            <Tabs
                name='files'
                tabs={contentState[0].files.map((file, index) => ({
                    title: file.title,
                    content: () => (times[0] === -1 || times[0] % 2 === 0) ?
                        <MonacoEditor
                            sx={{
                                height: 'calc(100vh - 122px)',
                            }}
                            defaultContent={file.code_default}
                            content={file.code}
                            language={file.type}
                            idPassed={idPassed}
                            question={{
                                title: contentState[0].title,
                                content: file.question,
                            }}
                            onChange={handleOnChange(index)}
                            editor={editorRef}
                            resetRef={resetRef}
                            autoWrapText={autoWrapText[0]}
                            onSubmit={(html, script, css) => {
                                contentLog[1](prev => {
                                    if (prev.test_pass === testList?.length) {
                                        if (onSubmit) {
                                            onSubmit(html, script, css);
                                        }
                                    } else {
                                        window.showMessage('Hãy hoàn thành tất cả bài kiểm tra và trước khi nộp bài.', 'error');
                                    }

                                    return prev;
                                })

                            }}
                            fontSize={fontSizeEditor[0]}
                        />
                        :
                        <Box>
                            <MonacoEditor
                                sx={{
                                    height: 'calc(100vh - 122px)',
                                }}
                                defaultContent={file.code_default}
                                content={file.code}
                                language={file.type}
                                idPassed={idPassed}
                                question={{
                                    title: contentState[0].title,
                                    content: file.question,
                                }}
                                onChange={handleOnChange(index)}
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
                            src="/live_code.html"
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
                                    badgeContent={testList?.length ? contentLog[0].test_pass + '/' + testList?.length : 0}
                                    color={(contentLog[0].test_pass === testList?.length) ?
                                        'success' : 'secondary'}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            right: -12
                                        }
                                    }}
                                >
                                    <Typography sx={{ color: 'inherit', }} component='span'> {__('Bài kiểm tra')}
                                    </Typography>
                                </Badge>,
                                content: () => <Box
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
                                        '& .hintTestCase': {
                                            ml: 1,
                                            textDecoration: 'underline',
                                            color: 'text.primary',
                                            cursor: 'pointer',
                                        }
                                    }}
                                >
                                    {
                                        content.description_testcase || testScript[0]?.length ?
                                            <>

                                                <CodeBlock
                                                    sx={{ mt: 1 }}
                                                    html={content.description_testcase}
                                                />
                                                {
                                                    testScript[0]?.length ? <>
                                                        <Typography sx={{ mt: 2 }} variant='h4'>
                                                            Testcase:
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                gap: 1,
                                                                flexDirection: 'column',
                                                                mt: 1,
                                                                pb: 2,
                                                            }}
                                                        >
                                                            {
                                                                testScript[0]?.map((item, index) => (
                                                                    item.type === 'test' ?
                                                                        <Box
                                                                            key={index}
                                                                            sx={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: 1,
                                                                            }}
                                                                        >
                                                                            {
                                                                                contentLog[0].test[index]?.result ? <Icon sx={{ color: 'success.main' }} icon="CheckRounded" />
                                                                                    : <Icon sx={{ color: 'error.main' }} icon="ClearRounded" />
                                                                            }
                                                                            <Box>
                                                                                {
                                                                                    contentLog[0].test[index]?.result ?
                                                                                        <Typography sx={{ color: 'success.main', userSelect: 'text', display: 'inline', }}>{item.title}</Typography>
                                                                                        : <Typography sx={{ color: 'error.main', userSelect: 'text', display: 'inline', }}>{item.title}</Typography>
                                                                                }
                                                                                {
                                                                                    item.get_result ? <Typography sx={{ display: 'inline', }}>&nbsp;Kết quả thực tế: {contentLog[0].test[index]?.actualResults}</Typography> : <></>
                                                                                }
                                                                            </Box>
                                                                            {
                                                                                item.hint ?
                                                                                    <Button size='small' sx={{ padding: 0, fontSize: 16, minWidth: 'unset', textTransform: 'unset' }} onClick={() => setOpenHint(item.hint ? item.hint : false)}>Gợi ý</Button>
                                                                                    : null
                                                                            }
                                                                        </Box>
                                                                        :
                                                                        <React.Fragment key={index} />
                                                                ))
                                                            }
                                                        </Box>
                                                    </> : null
                                                }
                                            </> : <ContentEmpty
                                                message={__('Bài học không có testcase')}
                                            />
                                    }

                                </Box>
                            },
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
                            {/* <Tooltip
                                title="Hoàn thành hết testcase để có thể nộp bài"
                            >
                                <Button
                                    variant='contained'
                                    sx={{ mr: 2, opacity: contentLog[0].test_pass !== testList.length ? 0.6 : 1 }}
                                    onClick={(e) => {
                                        if (contentLog[0].test_pass === testList.length) {
                                            // if (contentLog[0].test_count && contentLog[0].test_count === contentLog[0].test_pass) {
                                            //     alert('Đang nộp bài')
                                            // } else {
                                            //     //
                                            // }
                                        }
                                    }}
                                >
                                    Nộp bài
                                </Button>
                            </Tooltip> */}
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
        <DrawerCustom
            title="Gợi ý"
            open={openHint !== false}
            onCloseOutsite
            onClose={() => setOpenHint(false)}
        >
            <CodeBlock
                sx={{
                    mt: 4,
                    '&>*:first-of-type': {
                        mt: 0,
                    }
                }}
                html={openHint ? openHint : ''}
            />
        </DrawerCustom>
    </>
    )
}

export default TemplateCode

export interface IContentTemplateCode {
    id: ID,
    content: string,
    description_testcase: string,
    files: Array<ITemplateCodeFile>,
    testcase: Array<{
        type: 'test' | 'script',
        title: string,
        condition: string,
        get_result: string,
    }>,
    title: string,
}

export interface ITemplateCodeFile {
    title: string,
    type: 'html' | 'css' | 'javascript',
    question: string,
    code: string,
    code_default: string,
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