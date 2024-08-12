import { Box, Button, Typography } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import SplitResize from 'components/atoms/SplitResize';
import Tabs from 'components/atoms/Tabs';
import * as CSSHelp from 'helpers/curriculum-helpers';
import { delayUntil } from 'helpers/script';
import useConfirmDialog from 'hook/useConfirmDialog';
import useDebounce from 'hook/useDebounce';
import useQuery from 'hook/useQuery';
import React from 'react';
import TemplateFreecodeContext from './TemplateFreecodeContext';
import FreecodecampEditorOld from './components/FreecodecampEditorOld';
import CourseLearningContext from 'components/pages/CorePage/Course/context/CourseLearningContext';
import InfoUseBit from 'components/molecules/InfoUseBit';
import DrawerCustom from 'components/molecules/DrawerCustom';
import IconBit from 'components/atoms/IconBit';
import CompareCodeNormal from './components/CompareCodeNormal';
import { gaEvent } from 'helpers/ga';
import { replaceEscape } from 'helpers/string';

function TemplateFreecodeOldHtmlCss({ menuItemAddIn, onSubmit, content, idPassed, lessonNumber }: {
    onSubmit?: () => void,
    menuItemAddIn?: React.ReactNode,
    content: IContentTemplateCode,
    idPassed: boolean,
    lessonNumber: number,
    finalyResult: string,
}) {

    const times = React.useState(-1);

    const courseLearningContext = React.useContext(CourseLearningContext);

    const accessGetHint = React.useState(idPassed);
    const openCompareResult = React.useState(false);

    const timesIframe = React.useState(-1);

    const configResetLesson = useConfirmDialog({
        title: 'Đặt lại bài học này?',
        message: 'Bạn có chắc chắn muốn thiết lập lại bài học này? Các trình chỉnh sửa và kiểm tra sẽ được thiết lập lại.',
        renderButtons: (onConfirm, onClose) => <>
            <Button color="inherit" onClick={onClose}>Hủy bỏ</Button>
            <Button variant='contained' onClick={onConfirm}>Xác nhận</Button>
        </>
    });

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

    const contentState = React.useState({
        ...content,
        tests: content.tests.filter(item => !item.delete),
        files: content.challengeFiles.map(item => ({
            ...item,
            code_default: item.contents,
            startLine: -1,
            coutLineReadOnlyBottomUp: 0
        }))
    });

    const testPassed = React.useState<{ [key: number]: boolean }>({});

    const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

    const resetLesson = React.useState(0);

    const urlQuery = useQuery({
        tab_tab_c_b: '',
        tab_files: '',
    });

    const debounceContent = useDebounce(contentState[0], 300);

    React.useEffect(() => {
        timesIframe[1](prev => ++prev);

        setTimeout(() => {
            delayUntil(() => iframeRef.current?.contentWindow?.load, () => {
                let html = '', css = '', js = '';

                let inputUserEdit = '';

                contentState[0].files.forEach((item) => {
                    inputUserEdit = inputUserEdit + item.contents;
                    if (item.ext === 'html') {
                        html += item.contents;
                    } else if (item.ext === 'css') {
                        css += item.contents;
                    } else {
                        js += item.contents + ' ';
                    }
                });

                if ((iframeRef.current as HTMLIFrameElement).contentWindow?.load) {
                    (iframeRef.current as HTMLIFrameElement).contentWindow?.load(html, css, js, contentState[0].tests, inputUserEdit);
                }
            });
        }, 10);
    }, [debounceContent]);

    const handleSendTestToIframe = () => {
        delayUntil(() => iframeRef.current?.contentWindow?.load, () => {
            let html = '', css = '', js = '';
            let inputUserEdit = '';

            contentState[0].files.forEach((item) => {
                inputUserEdit = inputUserEdit + item.contents;
                if (item.ext === 'html') {
                    html += item.contents;
                } else if (item.ext === 'css') {
                    css += item.contents;
                } else {
                    js += item.contents + ' ';
                }
            });

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
            autoWrapText: false,
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
                        index: number,
                        isTrue?: boolean,
                        actualResults: string | undefined
                    }>
                } = JSON.parse(event.data);


                if (data.live_code) {
                    const testPassedTemp: { [key: number]: boolean } = {};
                    let hintString = '';
                    let hasTest = false;
                    // let consoleString: string[] = ''

                    const temp: typeof contentLog[0] = {
                        log: '',
                        test: {},
                        test_pass: 0,
                        test_count: 0,
                        log_count: 0,
                    };

                    data.message.forEach(item => {
                        switch (item.type) {
                            case 'test':
                                hintString = item.content ?? '';
                                hasTest = true;
                                testPassedTemp[item.index] = item.isTrue ? true : false;
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

                    testPassed[1](testPassedTemp);

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

                    contentLog[1](temp);
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

    const handleOnSubmitAndNextLesson = () => {
        testPassed[1](prev => {
            //@ts-ignore
            const keyPassed = Object.keys(prev).filter(key => prev[key]);
            if (keyPassed.length && keyPassed.length === contentState[0].tests.length) {
                if (onSubmit) { onSubmit(); }
            } else {
                window.showMessage('Mã của bạn không vượt qua. Hãy tiếp tục cố gắng.', 'error');
            }


            return prev;
        })

    }

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
            onTest: handleSendTestToIframe,
            openTest: () => {
                //
            },
        }}
    >
        <SplitResize
            variant='vertical'
            height='calc(100vh - 64px)'
            width='100%'
            minSize={600}
            pane1={<Box
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
                }}
            >

                <Box
                    className="custom_scroll"
                    sx={{
                        pl: 1,
                        pr: 3,
                        pt: 3,
                        fontSize: 18,
                        lineHeight: 1.4,
                        position: 'absolute',
                        top: 48,
                        left: 16,
                        right: 0,
                        bottom: 0,
                        overflowY: 'overlay',
                        zIndex: 99,
                        '& *': {
                            userSelect: 'text',
                        }
                    }}>
                    <Typography variant='h3' sx={{ mb: 2 }}>Bài {lessonNumber}: {content.title}</Typography>
                    <CodeBlock
                        html={content.description}
                        sx={{
                            '& p>code': {
                                ['--color']: 'inherit',
                            }
                        }}
                    />
                    <Divider />
                    {
                        content.instructions ? <>
                            <Typography sx={{ mt: 2, fontWeight: 'bold', fontSize: 26, color: 'error.main' }}>Bài tập:</Typography>
                            <CodeBlock
                                html={content.instructions}
                                sx={{
                                    '& p>code': {
                                        ['--color']: 'inherit',
                                    }
                                }}
                            />
                            <Divider />
                        </>
                            : null
                    }

                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >

                        <Button
                            size='large'
                            variant='contained'
                            sx={{
                                fontSize: 18,
                                textTransform: 'unset',
                                fontWeight: 400,
                            }}
                            onClick={handleOnSubmitAndNextLesson}
                        >
                            Nộp bài và đi đến bài tiếp theo (Ctr + Enter)
                        </Button>

                        <Button
                            size='large'
                            variant='contained'
                            color="secondary"
                            sx={{
                                fontSize: 18,
                                textTransform: 'unset',
                                fontWeight: 400,
                            }}
                            onClick={() => {
                                configResetLesson.onConfirm(() => {
                                    resetLesson[1](prev => ++prev);
                                });
                            }}
                        >
                            Reset bài học
                        </Button>
                        {configResetLesson.component}

                        {
                            contentState[0].files[0].final_result ?
                                <>
                                    <InfoUseBit
                                        title='Gợi ý đáp án'
                                        description='Sử dụng bit của bạn để có được câu trả lời'
                                        bit={8}
                                        reason='hint/question/freecode'
                                        callback={() => {
                                            accessGetHint[1](true);
                                            openCompareResult[1](true);
                                        }}
                                        button={(onOpen) => <Button
                                            size='large'
                                            color='success'
                                            variant='contained'
                                            sx={{
                                                fontSize: 18,
                                                textTransform: 'unset',
                                                fontWeight: 400,
                                            }}
                                            onClick={() => {
                                                gaEvent('click_hint',
                                                    (courseLearningContext.course?.course_detail?.content?.[courseLearningContext.chapterAndLessonCurrent?.chapterIndex ?? 0].lessons[courseLearningContext.chapterAndLessonCurrent?.lessonIndex ?? 0].title ?? ''),
                                                    content.title
                                                );
                                                if (accessGetHint[0]) {
                                                    openCompareResult[1](true);
                                                } else {
                                                    onOpen();
                                                }
                                            }}
                                        >
                                            {
                                                accessGetHint[0] ?
                                                    'Xem đáp án'
                                                    :
                                                    <>
                                                        Gợi ý đáp án với <Icon sx={{ ml: 1, mr: 1, opacity: 1 }} icon={IconBit} /> 8
                                                    </>
                                            }
                                        </Button>}
                                    />
                                    <DrawerCustom
                                        title="So sánh đáp án với code của bạn"
                                        open={openCompareResult[0]}
                                        onClose={() => {
                                            openCompareResult[1](false);
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
                                        <CompareCodeNormal
                                            code1={contentState[0].files[0].final_result ?? ''}
                                            code2={contentState[0].files[0].contents}
                                            type={contentState[0].files[0].ext}
                                        />
                                    </DrawerCustom>
                                </>
                                : null
                        }
                    </Box>
                    <Box
                        sx={{
                            fontSize: 18,
                            lineHeight: 1.42857143,
                            pb: 3,
                            mt: 3,
                        }}
                    >
                        {
                            contentState[0].tests.map((test, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                    }}
                                >
                                    {
                                        testPassed[0][index] ?
                                            <>
                                                <Icon renderVersion={testPassed[0][index]} sx={{ fontSize: 48, color: 'success.main' }} icon="CheckCircleRounded" /> <CodeBlock html={test.text} />
                                            </>
                                            :
                                            <>
                                                <Icon renderVersion={testPassed[0][index]} sx={{ fontSize: 48, color: 'error.main' }} icon="InfoRounded" /> <CodeBlock html={test.text} />
                                            </>
                                    }
                                </Box>
                            ))
                        }
                    </Box>
                </Box>

                <Tabs
                    name='tab_c_b'
                    tabs={[
                        {
                            title: 'Nội dung',
                            key: 'browser',
                            content: () => <></>
                        },
                    ]}
                    menuItemAddIn={menuItemAddIn}
                />

            </Box >}
            pane2={
                <SplitResize
                    storeId='fcc_old_2_2'
                    variant='vertical'
                    minSize={300}
                    onChange={(value) => {
                        (iframeRef.current as HTMLIFrameElement).style.pointerEvents = 'none';
                        heightOfIframe[1](value);
                    }}
                    pane1={<SplitResize
                        storeId='fcc_2_2'
                        variant='horizontal'
                        pane1={<Box
                            sx={{
                                position: 'relative',
                                zIndex: 99,
                                height: '100%',
                                '& .tabContent': {
                                    mt: 1,
                                },
                                '& .tabWarper': {
                                    pl: 1,
                                },
                                '.tab-horizontal': {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    '& .tabContent': {
                                        position: 'relative',
                                        flexGrow: 1,
                                        height: 'calc(100% - 48px)',
                                    }
                                }
                            }}
                        >

                            <Tabs
                                name='files'
                                tabIndex={contentState[0].files.findIndex(item => item.startLine !== -1)}
                                tabs={contentState[0].files.map((file) => ({
                                    title: file.name + '.' + file.ext,
                                    content: () => (times[0] === -1 || times[0] % 2 === 0) ?
                                        <FreecodecampEditorOld
                                            sx={{
                                                height: '100%',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                            }}
                                            onCtrEnter={handleOnSubmitAndNextLesson}
                                            file={file}
                                            resetLesson={resetLesson[0]}
                                        />
                                        :
                                        <Box>
                                            <FreecodecampEditorOld
                                                sx={{
                                                    height: '100%',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                }}
                                                file={file}
                                                onCtrEnter={handleOnSubmitAndNextLesson}
                                                resetLesson={resetLesson[0]}
                                            />
                                        </Box>
                                }))}
                                menuItemAddIn={courseLearningContext.menuReport}
                            />
                        </Box>}
                        pane2={<Box
                            className="custom_scroll"
                            sx={{
                                overflowY: 'overlay',
                                pl: 1,
                                pr: 1,
                                height: '100%',
                                '& *': {
                                    fontFamily: 'monospace',
                                    fontSize: '16px',
                                    whiteSpace: 'break-spaces',
                                }
                            }}
                        >
                            <Typography sx={{ mt: 1, }}>Console</Typography>
                            <Box
                                sx={{
                                    pb: 1,
                                }}
                                dangerouslySetInnerHTML={{ __html: replaceEscape(contentLog[0].log) }}
                            />
                        </Box>}
                    />}
                    pane2={timesIframe[0] % 2 === 0 ? <iframe
                        src={'/browser/old2.html'}
                        className="iframe_result"
                        ref={iframeRef}
                    >
                        {contentIframe[0]}
                    </iframe> : <Box
                        className="iframe_result"
                    >
                        <iframe
                            src={'/browser/old2.html'}
                            className="iframe_result"
                            ref={iframeRef}
                        >
                            {contentIframe[0]}
                        </iframe>
                    </Box>}
                    sxPane2={{
                        position: 'relative',
                        '& .iframe_result': {
                            position: 'absolute',
                            background: 'white',
                            left: 0,
                            top: 0,
                            border: 'none',
                            width: '100%',
                            height: 'calc( 100% )',
                        },
                    }}
                />


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

export default TemplateFreecodeOldHtmlCss

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