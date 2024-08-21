import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import { Badge, Box, Button } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import Icon from 'components/atoms/Icon';
import SplitResize from 'components/atoms/SplitResize';
import Tabs from 'components/atoms/Tabs';
import Dialog from 'components/molecules/Dialog';
import DrawerCustom from 'components/molecules/DrawerCustom';
import CourseLearningContext from 'components/pages/CorePage/Course/context/CourseLearningContext';
import { replaceEscape, trimBr } from 'helpers/string';
import useDebounce from 'hook/useDebounce';
import useQuery from 'hook/useQuery';
import React from 'react';
import CompareCode from '../components/CompareCode';
import FreecodecampEditor from '../components/FreecodecampEditor';
import TemplateFreecodeContext from '../TemplateFreecodeContext';
import { getPythonTestWorker, getPythonWorker, terminateWorkers } from 'workers/python-worker-handler';

function Python({ menuItemAddIn, onSubmit, content, idPassed, finalyResult, contentNextStep }: {
    onSubmit?: () => void,
    menuItemAddIn?: React.ReactNode,
    content: IContentTemplateCode,
    contentNextStep?: IContentTemplateCode,
    idPassed: boolean,
    lessonNumber: number,
    finalyResult: string,
}) {
    const courseLearningContext = React.useContext(CourseLearningContext);

    const workerRef = React.useRef<Worker | null>(null);
    const workerTestRef = React.useRef<Worker | null>(null);

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
        error: boolean,
        log: Array<{
            content: string,
            time: number,
        }>,
        test: Array<{
            content: string,
            result: boolean,
            index: number,
        }>,
        test_pass: number[],
    }>({
        error: false,
        log: [],
        test: [],
        test_pass: [],
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

    const openCompareResult = React.useState(false);
    const openTest = React.useState(false);

    const urlQuery = useQuery({
        tab_tab_c_b: '',
        tab_files: '',
    });

    const debounceContent = useDebounce(contentState[0], 1);

    const handleRunCodePythod = () => {

        contentLog[1](prev => ({
            ...prev,
            error: false,
            log: [],
        }));

        workerRef.current?.postMessage({
            type: 'listen',
        });

        let indexOfFileTarget = -1;

        contentState[0].files.forEach((item, index) => {
            if (item.startLine !== -1) {
                indexOfFileTarget = index;
            }
        });

        const pythonCode = contentState[0].files[indexOfFileTarget].contents;

        workerRef.current?.postMessage({
            type: 'run',
            code: {
                contents: pythonCode,
                editableContents: pythonCode,
                original: {}
            },
        });
    }

    const runTest = () => {

        contentLog[1](prev => ({
            ...prev,
            test_pass: [],
            test: contentState[0].tests.map((item, index) => ({ content: item.text, index: index, result: false })),
        }));

        let indexOfFileTarget = -1;

        contentState[0].files.forEach((item, index) => {
            if (item.startLine !== -1) {
                indexOfFileTarget = index;
            }
        });

        const pythonCode = contentState[0].files[indexOfFileTarget].contents;

        for (let index = 0; index < contentState[0].tests.length; index++) {
            const item = contentState[0].tests[index];

            workerTestRef.current?.postMessage({
                code: {
                    contents: pythonCode,
                    editableContents: '',
                    original: '',
                },
                index: index,
                firstTest: '',
                testString: item.testString,
                build: '',
                sources: {
                },
            });
        }
    }

    React.useEffect(() => {
        handleRunCodePythod();
        runTest();
    }, [debounceContent]);

    React.useEffect(() => {

        times[1](prev => ++prev);

    }, [urlQuery.query.tab_files]);

    // const renderDataTest = async () => {
    // let indexOfFileTarget = -1;

    // contentState[0].files.forEach((item, index) => {
    //     if (item.startLine !== -1) {
    //         indexOfFileTarget = index;
    //     }
    // });

    // const pythonCode = contentState[0].files[indexOfFileTarget].contents;

    // const passIndex: number[] = [];
    // const testPassContent: Array<{
    //     content: string,
    //     result: boolean,
    //     index: number
    // }> = [];

    // for (let index = 0; index < contentState[0].tests.length; index++) {
    //     const item = contentState[0].tests[index];

    //     const test = await runTests(pythonCode, item.testString);
    //     if (test.pass) {
    //         passIndex.push(index);
    //     }

    //     testPassContent.push({
    //         content: item.text,
    //         result: test.pass ? true : false,
    //         index: index,
    //     });
    // }

    // contentLog[1](prev => {
    //     prev.test_pass = passIndex;
    //     prev.test = testPassContent;
    //     return { ...prev };
    // });

    // let hintString = '';
    // let index = testPassContent.findIndex(item => !item.result);

    // if (index > -1) {
    //     hintString = testPassContent[index].content;
    // }

    // if (hintString) {
    //     testInfo[1]({
    //         enable: true,
    //         success: false,
    //         hint: hintString,
    //         index: index,
    //     });
    // } else {
    //     testInfo[1]({
    //         enable: true,
    //         success: true,
    //         index: -1,
    //     })
    // }
    // }

    React.useEffect(() => {

        formatEditor[1]({
            fontSize: Number(localStorage.getItem('editor_fs')) ? Number(localStorage.getItem('editor_fs')) : 18,
            autoWrapText: Number(localStorage.getItem('editor_disawt')) ? false : true,
            formatCode: 0,
            refresh: 0,
        });

        workerRef.current = getPythonWorker();
        workerTestRef.current = getPythonTestWorker();

        (workerRef.current as Worker).onmessage = (event) => {

            const { type, text, index, pass }: { type: string, text: string, index: number, pass?: boolean } = event.data;

            switch (type) {
                case 'print':
                    contentLog[1](prev => {
                        prev.log.push({
                            content: text,
                            time: Date.now() / 1000
                        });
                        return { ...prev };
                    })
                    break;
                case 'error':
                    contentLog[1](prev => ({ ...prev, error: true }));
                    break;
                case 'test':
                    contentLog[1](prev => {
                        prev.test[index] = {
                            content: '',
                            index: index,
                            result: pass ? true : false,
                        }
                        return { ...prev };
                    });
                    break;
                case 'stopped':
                    handleRunCodePythod();
                    break;
            }
        };


        (workerTestRef.current as Worker).onmessage = (event) => {

            const { type, index, pass }: { type: string, text: string, index: number, pass?: boolean } = event.data;

            switch (type) {
                case 'contentLoaded':
                    runTest();
                    break;
                default:
                    if (index !== undefined) {
                        contentLog[1](prev => {

                            if (pass) {
                                prev.test_pass.push(index);
                            }

                            prev.test[index].result = pass ? true : false;

                            let hintString = '';
                            let indexTestFirst = prev.test.findIndex(item => !item.result);

                            if (indexTestFirst > -1) {
                                hintString = prev.test[indexTestFirst].content;
                            }

                            if (hintString) {
                                testInfo[1]({
                                    enable: true,
                                    success: false,
                                    hint: hintString,
                                    index: indexTestFirst,
                                });
                            } else {
                                testInfo[1]({
                                    enable: true,
                                    success: true,
                                    index: -1,
                                })
                            }

                            return { ...prev };
                        })
                    }
                    break;
            }
        };

        return () => {
            terminateWorkers();
            // workerRef.current?.terminate();
            // workerTestRef.current?.terminate();
        };

    }, [courseLearningContext.chapterAndLessonCurrent?.lesson]);

    // const testList = testScript[0];

    const contentConsoleTab = <Box
        sx={{
            backgroundColor: 'background.paper',
            height: '100%',
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
                        <Badge badgeContent={contentLog[0].log.length} max={100} color={"secondary"} sx={{ '.MuiBadge-badge': { right: '-14px' } }}>
                            Console
                        </Badge>
                    </>,
                    key: 'console',
                    content: () => <Box
                        className="custom_scroll custom"
                        sx={{
                            height: '100%',
                        }}
                    >
                        <CodeBlock
                            disableCopyButton
                            sx={{
                                height: '100%',
                                '>div, >div>pre': {
                                    height: '100%'
                                },
                                '.line-numbers-rows': {
                                    display: 'none'
                                },
                                'pre.language-javascript': {
                                    pl: '16px !important',
                                    marginTop: 0,
                                    borderRadius: 0,
                                },
                                'code.language-javascript': {
                                    pl: '0 !important',
                                }
                            }}
                            html={'<pre id="code" class="language-javascript"><code>' + contentLog[0].log.map(item => item.content).join('\n') + '</code></pre>'}
                        />
                    </Box>
                },
                {
                    title: <>
                        <Badge badgeContent={((contentLog[0].test_pass.length ?? 0) + (contentLog[0].error ? 0 : 1)) + '/' + (contentState[0].tests.length + 1)} max={100} color={(contentLog[0].test_pass.length + (contentLog[0].error ? 0 : 1)) === (contentState[0].tests.length + 1) ? 'success' : "secondary"} sx={{ '.MuiBadge-badge': { right: '-14px' } }}>
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
                        }
                        }
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
                                            width: '100%',
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
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'center',
                                }}
                            >
                                {
                                    contentLog[0].error ?
                                        <RadioButtonUncheckedRounded />
                                        :
                                        <CheckCircleRounded color='success' />
                                }
                                <CodeBlock
                                    disableCopyButton
                                    html={'Đảm bảo không gây ra lỗi trong quá trình thực thi'}
                                    sx={{
                                        '& *': {
                                            fontFamily: 'monospace',
                                            fontSize: '16px',
                                            whiteSpace: 'break-spaces',
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box >
                }
            ]}
            menuItemAddIn={courseLearningContext.menuReport}
        />
    </Box >

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
            onTest: () => {
                // 
            }
        }}
    >
        <SplitResize
            variant='vertical'
            storeId='new_js'
            height='calc(100vh - 64px)'
            width='100%'
            minSize={500}
            onChange={(value) => {
                // 
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
                    </Box>}
                />
            </Box>}
            pane2={contentConsoleTab}
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

export default Python

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

// async function runTests(code: string, testString: string) {

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const assert = chai.assert;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const __helpers = helpers;

//     // uncomment the following line to inspect
//     // the frame-runner as it runs tests
//     // make sure the dev tools console is open
//     // debugger;
//     try {
//         // eval test string to actual JavaScript
//         // This return can be a function
//         // i.e. function() { assert(true, 'happy coding'); }
//         const testPromise = new Promise((resolve, reject) => {
//             try {
//                 const test: unknown = eval(testString);
//                 return resolve(test);
//             } catch (err) {
//                 return reject(err);
//             }
//         });

//         const test = await testPromise;
//         if (typeof test === 'function') {
//             await test(testString);
//         }
//         return { pass: true };
//     } catch (err) {
//         if (!(err instanceof chai.AssertionError)) {
//             console.error(err);
//         }
//         // to provide useful debugging information when debugging the tests, we
//         // have to extract the message, stack and, if they exist, expected and
//         // actual before returning
//         return {
//             err: {
//                 message: (err as Error).message,
//                 stack: (err as Error).stack,
//                 expected: (err as { expected?: string }).expected,
//                 actual: (err as { actual?: string }).actual
//             }
//         };
//     }
// }