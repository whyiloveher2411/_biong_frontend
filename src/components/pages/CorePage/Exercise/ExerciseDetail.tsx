import { ArrowBackIosRounded } from '@mui/icons-material';
import AlarmRoundedIcon from '@mui/icons-material/AlarmRounded';
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { AppBar, Box, Button, IconButton, Theme, Tooltip, Typography } from '@mui/material';
import SplitResize from 'components/atoms/SplitResize';
import makeCSS from 'components/atoms/makeCSS';
import AuthGuard from 'components/templates/AuthGuard';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import codingChallengeService, { CodingChallengeProps, convertValue } from 'services/codingChallengeService';
import { UserState, useUser } from 'store/user/user.reducers';
import { hidenSectionMainLayout, showSectionMainLayout } from '../Course/CourseLearning';
import Coding from './components/excerciesDetail/Coding';
import TestContent from './components/excerciesDetail/TestContent';
import ContentColumnLeft from './components/excerciesDetail/ContentColumnLeft';
import Account from 'components/molecules/Header/Account';
import CodingChallengeContext from './components/excerciesDetail/context/CodingChallengeContext';
import useDebounce from 'hook/useDebounce';
import { delayUntil } from 'helpers/script';
import * as CSSHelp from 'helpers/curriculum-helpers';
import useConfirmDialog from 'hook/useConfirmDialog';
import useQuery from 'hook/useQuery';
import { useWebBrowser } from 'components/atoms/WebBrowser';
import { Author } from 'services/courseService';
import { PaginationProps } from 'components/atoms/TablePagination';
import usePaginate from 'hook/usePaginate';
import { LoadingButton } from '@mui/lab';

const useStyle = makeCSS((theme: Theme) => ({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px 0 16px',
        backgroundColor: theme.palette.mode === 'light' ? '#f1f3f4' : theme.palette.header.background,
        minHeight: 64,
        borderBottom: '1px solid ' + theme.palette.dividerDark,
    },
    transationShow: {
        animation: `animateShow 500ms ${theme.transitions.easing.easeInOut}`
    },
}));

function ExerciseDetail({ slug }: { slug: string }) {

    const classes = useStyle();

    const user = useUser();

    const navigate = useNavigate();

    const [detail, setDetail] = React.useState<null | CodingChallengeProps>(null);

    const tested = React.useRef(false);
    const openLoadingSubmitButton = React.useRef(false);

    const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

    const [contentIframe, setContentIframe] = React.useState({
        html: '',
        css: '',
        js: '',
    });

    const [isRunningTest, setIsRunningTest] = React.useState(false);

    const useParamUrl = useQuery({
        tab_content: '',
        tab_test: '',
        p_su_current_page: 1,
        p_so_current_page: 1,
    });

    const debounceContent = useDebounce(contentIframe, 300);

    function onChangeCode(html: string, css: string, js: string) {
        setContentIframe({
            html, css, js
        })
    }

    const dialogConfirm = useConfirmDialog();

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

    const [submissionsPost, setSubmissionsPost] = React.useState<ISubmissionsPostProps | 'listing' | 'submitting'>('listing');

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

    const testPassed = React.useState<{
        [key: number]: ITestCaseResult
    }>({});

    const [disableSendSubmission, setDisableSendSubmission] = React.useState(true);

    const [submissions, setSubmissions] = React.useState<null | PaginationProps<ISubmissionsPostProps>>(null);
    const [solutions, setSolutions] = React.useState<PaginationProps<ICodeChallengeSolutionProps> | null>(null);

    const testInfo = React.useState<{
        success: boolean,
        enable: boolean,
        hint?: string,
    }>({
        success: false,
        enable: false,
        hint: '',
    });

    function onChangeTab(tabName: 'description' | 'editorial' | 'solutions' | 'submissions' | 'discussion' | 'testcase') {
        if (tabName === 'testcase') {
            useParamUrl.changeQuery({ tab_test: tabName });
        } else {
            useParamUrl.changeQuery({ tab_content: tabName });
        }
    }

    function submitChallenge() {
        if (!detail) return;
        openLoadingSubmitButton.current = true;
        tested.current = false;
        setSubmissionsPost('submitting');
        onChangeTab('submissions');
        runTest();
        delayUntil(() => (tested.current), () => {
            testPassed[1](testPassed => {
                setTimeout(() => {
                    const test_not_passed = Object.keys(testPassed).filter(key => !testPassed[key as unknown as number].success);
                    const check_status = check_status_submissions(testPassed);
                    const total_test = Object.keys(testPassed).length;
                    let data: ISubmissionsPostProps;

                    if (check_status.index !== -1) {

                        const inputs: ISubmissionsPostProps['input'] = [];

                        detail.testcase.variable_names.forEach((variable, index) => {
                            inputs.push({
                                name: variable.name,
                                value: detail.testcase.cases[testPassed[check_status.index]?.index]?.inputs[index]
                            });
                        });

                        data = {
                            code: contentIframe,
                            testcase: testPassed,
                            testcase_total: Object.keys(testPassed).length,
                            testcase_passed: total_test - test_not_passed.length,
                            input: inputs,
                            expected: test_not_passed.length > 0 ? detail.testcase.cases[testPassed[check_status.index]?.index].output : 'undefined',
                            output: test_not_passed.length > 0 ? convertValue(testPassed[check_status.index].actual) : 'undefined',
                            test_status: check_status.status,
                        };

                    } else {
                        data = {
                            code: contentIframe,
                            testcase: testPassed,
                            testcase_total: Object.keys(testPassed).length,
                            testcase_passed: total_test - test_not_passed.length,
                            input: [],
                            expected: '',
                            output: '',
                            test_status: check_status.status,
                        };
                    }

                    setSubmissionsPost(data);

                    (async () => {
                        const result = await codingChallengeService.postSubmission(slug, data);

                        if (result) {
                            updateListingSubmissions(1);
                        }
                    })();
                    openLoadingSubmitButton.current = false;
                }, 1000);
                return testPassed;
            });

        });

    }

    async function updateListingSubmissions(page?: number) {
        submissionPaginate.set({
            current_page: page ?? (parseInt(useParamUrl.query.p_su_current_page as string) ?? 1),
            per_page: 20,
            loadData: true,
        });
    }

    async function updateListingSolutions(page?: number) {
        solutionPaginate.set({
            current_page: page ?? (parseInt(useParamUrl.query.p_so_current_page as string) ?? 1),
            per_page: 1,
            loadData: true,
        });
    }

    const submissionPaginate = usePaginate<ISubmissionsPostProps>({
        name: 'p_su',
        template: 'page',
        onChange: async (data) => {
            if (detail) {
                const result = await codingChallengeService.listingSubmissions(detail.id, data.current_page);
                setSubmissions(result);
            }
        },
        isChangeUrl: true,
        pagination: submissions,
        rowsPerPageOptions: [20],
        data: {
            current_page: 1,
            per_page: 20
        }
    });

    const solutionPaginate = usePaginate<ICodeChallengeSolutionProps>({
        name: 'p_so',
        template: 'page',
        onChange: async (data) => {
            if (detail) {
                const result = await codingChallengeService.getSolutions(detail.id, data.current_page);
                setSolutions(result);
            }
        },
        pagination: solutions,
        rowsPerPageOptions: [20],
        data: {
            current_page: 1,
            per_page: 20
        }
    });

    React.useEffect(() => {
        // setDisableSendSubmission(false);
        // delayUntil(() => iframeRef.current?.contentWindow?.load, () => {
        //     if (!detail) return;
        //     let testScript: Array<{
        //         testCondition: string,
        //         testString: string;
        //         text: string;
        //     }> = [];

        //     if (detail.testcase) {
        //         let namesStr = detail.testcase.variable_names.map(variable => variable.name).join(', ');

        //         detail.testcase.cases.forEach(testcase => {
        //             let valuesStr = testcase.inputs.join(', ');
        //             let inputs = 'let [' + namesStr + '] = [' + valuesStr + '];';
        //             testScript.push({
        //                 testCondition: inputs + ' let actualInput = ' + detail.testcase.function_name + '(' + namesStr + ') ?? undefined; let expectedInput = ' + testcase.output + ';',
        //                 testString: 'assert(JSON.stringify(actualInput) === JSON.stringify(expectedInput))',
        //                 text: '',
        //             });
        //         });
        //     }
        //     if ((iframeRef.current as HTMLIFrameElement).contentWindow?.load) {
        //         (iframeRef.current as HTMLIFrameElement).contentWindow?.load(contentIframe.html, contentIframe.css, contentIframe.js, testScript);
        //     }
        // });`
    }, [debounceContent]);

    const runTest = () => {
        onChangeTab('testcase');
        setIsRunningTest(true);
        delayUntil(() => iframeRef.current?.contentWindow?.load, () => {
            if (!detail) return;
            let testScript: Array<{
                testCondition: string,
                testString: string;
                text: string;
            }> = [];

            if (detail.testcase) {
                let namesStr = detail.testcase.variable_names.map(variable => variable.name).join(', ');

                detail.testcase.cases.forEach(testcase => {
                    let valuesStr = testcase.inputs.join(', ');
                    let inputs = 'let [' + namesStr + '] = [' + valuesStr + '];';
                    testScript.push({
                        testCondition: inputs + ' let actualInput = ' + detail.testcase.function_name + '(' + namesStr + ') ?? undefined; let expectedInput = ' + testcase.output + ';',
                        testString: 'assert(JSON.stringify(actualInput) === JSON.stringify(expectedInput))',
                        text: '',
                    });
                });
            }
            if ((iframeRef.current as HTMLIFrameElement).contentWindow?.load) {
                (iframeRef.current as HTMLIFrameElement).contentWindow?.load(contentIframe.html, contentIframe.css, contentIframe.js, testScript);
            }
        });
    }

    React.useEffect(() => {

        formatEditor[1]({
            fontSize: Number(localStorage.getItem('editor_fs')) ? Number(localStorage.getItem('editor_fs')) : 18,
            autoWrapText: Number(localStorage.getItem('editor_disawt')) ? false : true,
            formatCode: 0,
            refresh: 0,
        });

        const eventListenerMessage = function (event: MessageEvent) {
            setDetail(detail => {
                try {
                    const data: {
                        live_code?: boolean,
                        message: Array<{
                            type: 'log' | 'alert' | 'error' | 'assert' | 'test',
                            content?: string,
                            index: number,
                            isTrue?: boolean,
                            actualResults: string | undefined,
                            actual: ANY,
                            expected: ANY,
                            runtime_error: boolean,
                            time: number,
                        }>
                    } = JSON.parse(event.data);

                    if (data.live_code) {
                        const testPassedTemp: typeof testPassed[0] = {};
                        let hintString = '';
                        let hasTest = false;
                        console.log(data.message);
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
                                    testPassedTemp[item.index] = {
                                        success: item.isTrue ? true : false,
                                        actual: item.actual,
                                        expected: item.expected,
                                        is_public: !!detail?.testcase.cases[item.index * 1].is_public,
                                        index: item.index,
                                        runtime_error: !!item.runtime_error,
                                        time: item.time,
                                    };
                                    break;
                                case 'alert':
                                    temp.log += '<pre style="color:green;font-weight:bold;">!Alert: ' + item.content + '</pre>';
                                    break;
                                case 'error':
                                    if (!item.content?.includes('[BABEL]')) {
                                        temp.log += '<pre style="color:red;">' + item.content + '</pre>';
                                        temp.log_count++;
                                    }
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
                        tested.current = true;
                        contentLog[1](temp);
                        // contentLog[1](data.message);
                    }
                } catch (error) {
                    //
                }

                return detail;
            });

            setIsRunningTest(false);
        };

        window.addEventListener("message", eventListenerMessage);

        delayUntil(() => (iframeRef.current as HTMLIFrameElement)?.contentWindow?.addHelper ? true : false, () => {
            (iframeRef.current as HTMLIFrameElement).contentWindow?.addHelper(CSSHelp);
        });

        return () => {
            window.removeEventListener("message", eventListenerMessage);
        };

    }, []);

    React.useEffect(() => {

        if (user._state === UserState.nobody) {
            setSubmissions(null);
            setSubmissionsPost('listing');
        }

    }, [user])

    const webBrowser = useWebBrowser();

    React.useEffect(() => {
        (async () => {
            const post = await codingChallengeService.detail(slug);
            if (post) {
                setDetail(post);

                webBrowser.setSeo(prev => ({
                    ...prev,
                    title: post.title
                }));

            } else {
                navigate('/exercise');
            }
        })();

    }, [slug]);

    React.useEffect(() => {

        hidenSectionMainLayout();
        return () => {
            showSectionMainLayout();
        };

    }, []);

    if (user._state === UserState.nobody) {
        return <AuthGuard
            title='Đăng nhập để tiếp tục học tập'
        >
            <></>
        </AuthGuard>
    }

    if (!detail) {
        return <>Loading...</>
    }

    return (
        <CodingChallengeContext.Provider
            value={{
                challenge: detail,
                contentLog: contentLog,
                onChangeCode: onChangeCode,
                testPassed: testPassed[0],
                submissionsPost: submissionsPost,
                setSubmissionsPost: setSubmissionsPost,
                dialogConfirm: dialogConfirm,
                submissions,
                setSubmissions,
                submissionPaginate,
                updateListingSubmissions,
                solutions,
                setSolutions,
                updateListingSolutions,
                solutionPaginate,
                onChangeTab: onChangeTab,
                isRunningTest,
                afterOnLoadMonaco: () => setDisableSendSubmission(false),
            }}
        >
            <AppBar elevation={0} color='inherit' className={classes.header}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        maxWidth: '50%',
                        gap: 1,
                    }}
                >
                    <IconButton
                        component={Link}
                        to="/exercise"
                    >
                        <ArrowBackIosRounded />
                    </IconButton>
                    <Typography
                        onClick={() => {
                            //
                        }}
                        variant="h5"
                        noWrap
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 400,
                            fontSize: 18,
                            letterSpacing: '0.3px',
                        }}
                    >
                        {detail.title}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                >
                    <Button
                        variant='contained'
                        sx={{ borderRadius: 2 }}
                        color='inherit'
                        disabled={disableSendSubmission}
                        startIcon={<PlayArrowRoundedIcon />}
                        onClick={runTest}
                    >
                        Chạy Thử
                    </Button>
                    <LoadingButton
                        loading={openLoadingSubmitButton.current || disableSendSubmission}
                        variant='contained'
                        loadingPosition='start'
                        sx={{ borderRadius: 2 }}
                        startIcon={<BackupOutlinedIcon />}
                        onClick={submitChallenge}
                        disabled={disableSendSubmission}
                    >
                        Gửi bài
                    </LoadingButton>
                    <Tooltip
                        title="Bắt đầu tính giờ"
                    >
                        <Button variant='outlined' sx={{ borderRadius: 2, pl: 1, pr: 1, minWidth: 'unset' }} color='inherit'><AlarmRoundedIcon /></Button>
                    </Tooltip>
                    <Tooltip
                        title="Ghi chú"
                    >
                        <Button variant='outlined' sx={{ borderRadius: 2, pl: 1, pr: 1, minWidth: 'unset' }} color='inherit'><NoteAltOutlinedIcon /></Button>
                    </Tooltip>
                </Box>
                <Box>
                    <Account />
                </Box>
            </AppBar>
            <Box className={classes.transationShow}
                sx={{
                    width: '100%',
                    p: 0,
                    zIndex: 1030,
                    position: 'relative',
                    '& .iframe_result': {
                        position: 'absolute',
                        background: 'white',
                        left: 0,
                        top: 48,
                        border: 'none',
                        width: '100%',
                        height: 'calc( 100% - 48px)',
                        opacity: 0,
                        pointerEvents: 'none !important',
                    },
                }}
            >
                <Box
                    component="div"
                    style={{ height: '100%', margin: 0 }}
                >
                    <div style={{ maxWidth: '100%', height: '100%', width: '100%', margin: '0 auto' }}>
                        <Box
                            sx={{
                                flex: '1',
                                width: 'calc(100vw)',
                                minHeight: 'calc( 100vh - 65px)',
                                transition: 'all 0.3s',
                                '& .Pane': {
                                    overflow: 'hidden',
                                }
                            }}
                        >
                            <SplitResize
                                variant='vertical'
                                height='calc(100vh - 64px)'
                                width='100%'
                                minSize={500}
                                onChange={(value) => {
                                    //
                                }}
                                pane1={<ContentColumnLeft />}
                                pane2={<SplitResize
                                    storeId='fcc_2_2'
                                    variant='horizontal'
                                    onChange={(value) => {
                                        //
                                    }}
                                    pane1={<Coding />}
                                    pane2={<TestContent />}
                                />
                                }
                                sxPane1={{
                                    backgroundColor: 'body.background',
                                    position: 'relative',
                                }}
                                storeId='v_live_code'
                            />
                        </Box>

                    </div>
                </Box>
                <iframe
                    src="/live_code_challenge.html"
                    className="iframe_result"
                    ref={iframeRef}
                >
                </iframe>
                {dialogConfirm.component}
            </Box>
        </CodingChallengeContext.Provider>
    )
}

export default ExerciseDetail
export interface ICodeChallengeSolutionProps {
    id: string,
    title: string,
    content: string,
    created_at: string,
    author?: Author,
    comment_count: number,
    view: number,
    my_reaction_type: string,
    count_vote: number,
    count_down_vote: number,
}
export interface ISubmissionsPostProps {
    id?: ID,
    code: {
        html: string,
        css: string,
        js: string
    },
    input: Array<{
        name: string,
        value: string,
    }>,
    output: string,
    expected: string,
    testcase: {
        [key: number]: ITestCaseResult
    },
    testcase_total: number,
    testcase_passed: number,
    test_status: 'accepted' | 'wrong_answer' | 'memory_limit' | 'runtime_error' | 'compile_error' | 'timeout',
    created_at?: string,
    notes?: string,
    color?: string,
    author?: Author,
}

export interface ITestCaseResult {
    success: boolean,
    actual: ANY,
    expected: ANY,
    is_public: boolean,
    index: number,
    runtime_error: boolean,
    time: number,
}

function check_status_submissions(testcaseResults: {
    [key: number]: ITestCaseResult
}): { status: ISubmissionsPostProps['test_status'], index: number } {

    let status: ISubmissionsPostProps['test_status'] = 'accepted';

    const keys = Object.keys(testcaseResults);

    const index_first_wrong = keys.findIndex(key => !testcaseResults[key as unknown as number].success);

    if (index_first_wrong > -1) {
        if (testcaseResults[index_first_wrong].runtime_error) {
            status = 'runtime_error';
        } else {
            status = 'wrong_answer';
        }
    }

    return {
        status: status,
        index: index_first_wrong,
    };
}