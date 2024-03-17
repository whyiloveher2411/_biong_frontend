import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Box, Button, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import CodeBlock from "components/atoms/CodeBlock";
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import FieldForm from 'components/atoms/fields/FieldForm';
import FormWrapper from 'components/atoms/fields/FormWrapper';
import Dialog from 'components/molecules/Dialog';
import NotFound from 'components/molecules/NotFound';
import { dateTimeFormat, dateTimefromNow } from 'helpers/date';
import { cssMaxLine } from 'helpers/dom';
import { getImageUrl } from 'helpers/image';
import cloneDeep from 'lodash/cloneDeep';
import React from "react";
import codingChallengeService, { convertValue } from "services/codingChallengeService";
import { useUser } from 'store/user/user.reducers';
import { ISubmissionsPostProps } from "../../ExerciseDetail";
import { useCodingChallengeContext } from "./context/CodingChallengeContext";
import { useStatedApi } from 'hook/useApi';
import { LoadingButton } from '@mui/lab';
import useQuery from 'hook/useQuery';
import { delayUntil } from 'helpers/script';

const colorList = [
    '#b0acac',
    '#ffb800',
    '#007aff',
    '#01b328',
    '#f74397',
    '#af52de',
] as const;

function Submissions() {

    const codingChallengeContext = useCodingChallengeContext();

    const [colorState, setColorState] = React.useState<typeof colorList[number]>('#b0acac');
    const [openDialogNotes, setOpenDialogNotes] = React.useState(0);

    const [activeSendSolution, setActiveSendSolution] = React.useState<ISubmissionsPostProps | false>(false);

    const user = useUser();

    const [post, setPost] = React.useState({
        notes: '',
    })

    const formUpdateProfileRef = React.useRef<{
        submit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
    }>(null);

    function onCloseDialogNotes() {
        setOpenDialogNotes(0);
    }

    const useParamUrl = useQuery({
        submission_detail: '',
    });

    const api = useStatedApi();

    const handleSaveNotes = (postForm: JsonFormat) => {

        api.call('save_note',
            () => {
                return codingChallengeService.saveNotes((typeof codingChallengeContext.submissionsPost === 'object' && codingChallengeContext.submissionsPost.id) ? codingChallengeContext.submissionsPost.id as unknown as number : openDialogNotes, postForm.notes, colorState);
            }, (success: boolean) => {
                if (success) {
                    window.showMessage('Đã lưu ghi chú vào bài viết', 'success');
                    codingChallengeContext.updateListingSubmissions(1);
                    onCloseDialogNotes();
                } else {
                    window.showMessage('Lưu ghi chú thất bại', 'error');
                }
            },
            3000
        );
    };

    React.useEffect(() => {
        if (codingChallengeContext.submissionsPost === 'listing') {
            if (codingChallengeContext.submissions === null) {
                codingChallengeContext.updateListingSubmissions();
            }
        }

    }, [codingChallengeContext.submissionsPost, user]);

    React.useEffect(() => {
        delayUntil(() => codingChallengeContext.submissions !== null ? true : false, () => {
            if (useParamUrl.query.submission_detail && codingChallengeContext.submissions) {
                const index = codingChallengeContext.submissions.data.findIndex(item => item.id?.toString() === useParamUrl.query.submission_detail);
                if (index > -1) {
                    // handleOpenSolution(codingChallengeContext.submissions.data[index].id);
                } else {
                    useParamUrl.changeQuery({ submission_detail: '' });
                }
            }
        });
    }, [codingChallengeContext.submissions]);

    if (activeSendSolution) {
        return <FormSubmitSolution submission={activeSendSolution} onBack={() => setActiveSendSolution(false)} />;
    }

    if (codingChallengeContext.submissionsPost === 'listing') {
        return <>
            <TableContainer className='custom_scroll' sx={{ maxHeight: '100%' }}>
                <Table stickyHeader aria-label="sticky table" size="small" >
                    {
                        codingChallengeContext.submissions ?
                            <>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{ width: 170, whiteSpace: 'nowrap' }}
                                        >
                                            Trạng thái
                                        </TableCell>
                                        <TableCell
                                            sx={{ width: 100, whiteSpace: 'nowrap' }}
                                        >
                                            Thời gian chạy
                                        </TableCell>
                                        <TableCell
                                            sx={{ width: 100, whiteSpace: 'nowrap' }}
                                        >
                                            Bài kiểm tra
                                        </TableCell>
                                        <TableCell>
                                            Ghi chú
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        codingChallengeContext.submissions.data.length > 0 ?
                                            <>
                                                {
                                                    codingChallengeContext.submissionPaginate.isLoading ?
                                                        <SubmissionsSkeleton count={codingChallengeContext.submissions.data.length} />
                                                        :
                                                        codingChallengeContext.submissions.data.map((submission) => (<TableRow
                                                            sx={{
                                                                cursor: 'pointer',
                                                                '& .btn-add-notes': {
                                                                    display: 'none',
                                                                },
                                                                '&:hover .btn-add-notes': {
                                                                    display: 'flex',
                                                                }
                                                            }}
                                                            key={submission.id}
                                                            hover
                                                            role="checkbox"
                                                            tabIndex={-1}
                                                            onClick={() => {

                                                                const submissionClone = cloneDeep(submission);

                                                                try {
                                                                    if (typeof submissionClone.input === 'string') {
                                                                        submissionClone.input = JSON.parse(submissionClone.input);
                                                                    }
                                                                } catch (error) {
                                                                    submissionClone.input = []
                                                                }

                                                                try {
                                                                    if (typeof submissionClone.code === 'string') {
                                                                        submissionClone.code = JSON.parse(submissionClone.code);
                                                                    }
                                                                } catch (error) {
                                                                    submissionClone.code = { html: '', css: '', js: '' };
                                                                }

                                                                try {
                                                                    if (typeof submissionClone.testcase === 'string') {
                                                                        submissionClone.testcase = JSON.parse(submissionClone.testcase);
                                                                    }
                                                                } catch (error) {
                                                                    submissionClone.testcase = {}
                                                                }

                                                                setPost({
                                                                    notes: submissionClone.notes ?? ''
                                                                })

                                                                codingChallengeContext.setSubmissionsPost(submissionClone);
                                                            }}
                                                        >
                                                            <TableCell sx={{ width: 170, whiteSpace: 'nowrap' }}>
                                                                <Typography sx={{ fontSize: 14, whiteSpace: 'nowrap', fontWeight: 500, color: submission.test_status === 'accepted' ? 'success.main' : 'error.main' }}>{convertStatusToTitle(submission.test_status)}</Typography>
                                                                <Typography variant='body2'>{dateTimefromNow(submission.created_at as string)}</Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ width: 100, whiteSpace: 'nowrap' }}>
                                                            </TableCell>
                                                            <TableCell sx={{ width: 100, whiteSpace: 'nowrap' }} >
                                                                {submission.testcase_passed}/{submission.testcase_total}
                                                            </TableCell>
                                                            <TableCell
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    setOpenDialogNotes(submission.id as unknown as number);
                                                                    setPost({
                                                                        notes: submission.notes ? submission.notes : ''
                                                                    });
                                                                    setColorState(submission.color ? submission.color as typeof colorState : '#b0acac')
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        gap: 1,
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                    }}
                                                                >
                                                                    {
                                                                        submission.notes ?
                                                                            <Typography sx={{
                                                                                flexGrow: 1,
                                                                                ...cssMaxLine(1),
                                                                                wordBreak: 'break-word',
                                                                            }} >
                                                                                {submission.notes}
                                                                            </Typography>
                                                                            :
                                                                            <Button
                                                                                className='btn-add-notes'
                                                                                sx={{ textTransform: 'unset' }}
                                                                                startIcon={<AddRoundedIcon />}

                                                                            >Ghi chú
                                                                            </Button>
                                                                    }
                                                                    {
                                                                        submission.color && submission.color !== '#b0acac' ?
                                                                            <Box
                                                                                sx={{
                                                                                    width: 8,
                                                                                    height: 8,
                                                                                    borderRadius: '50%',
                                                                                    flexShrink: '0',
                                                                                    backgroundColor: submission.color,
                                                                                }}
                                                                            />
                                                                            : null
                                                                    }
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                        ))
                                                }
                                                <TableRow>
                                                    <TableCell colSpan={100}>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'flex-end',
                                                                pt: 1,
                                                            }}
                                                        >
                                                            {
                                                                codingChallengeContext.submissionPaginate.component
                                                            }
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                            :
                                            <TableRow>
                                                <TableCell colSpan={100} sx={{ pt: 2 }}>
                                                    <NotFound
                                                        title='Không có bài nào.'
                                                        subTitle={'Có vẽ như bạn chưa gửi bất kỳ bài nào thuộc ' + codingChallengeContext.challenge.title + ' trước đây'}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                    }
                                </TableBody>
                            </>
                            :
                            <TableBody>
                                <SubmissionsSkeleton count={20} />
                            </TableBody>
                    }
                </Table>
            </TableContainer>
            <Dialog
                title="Ghi chú"
                action={<ActionFormNotes
                    colorState={colorState}
                    setColorState={setColorState}
                    onCloseDialogNotes={onCloseDialogNotes}
                    formUpdateProfileRef={formUpdateProfileRef}
                    loadingButton={api.open['save_note']}
                />}
                open={openDialogNotes !== 0}
                onClose={onCloseDialogNotes}
            >
                <FormNotes
                    post={post}
                    formUpdateProfileRef={formUpdateProfileRef}
                    handleSaveNotes={handleSaveNotes}
                    setPost={setPost}
                />
            </Dialog>
        </>;
    }

    if (codingChallengeContext.submissionsPost === 'submitting') {
        return <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Box sx={{
                borderBottom: '1px solid',
                borderColor: 'dividerDark',
                pt: 1,
                pb: 1,
            }}>
                <Skeleton>
                    <Button
                        size="small"
                        sx={{ textTransform: 'unset', fontSize: 14, }}
                        color='inherit'
                        startIcon={<ArrowBackRoundedIcon />}
                    > Tất cả bài đã nộp</Button>
                </Skeleton>
            </Box>
            <Box
                className={"custom_scroll"}
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    margin: 0,
                    maxHeight: '100%',
                    overflowY: 'scroll',
                    pl: 2,
                    pr: 2,
                    pt: 2,
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
                    sx={{
                        maxWidth: 700,
                        margin: '0 auto',
                        pl: 2,
                        pr: 2,
                        pb: 4
                    }}
                >

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 3,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box>
                            <Skeleton>
                                <Typography variant="h4" sx={{ fontSize: 20, color: 'success.main' }} >
                                    Được chấp nhận
                                </Typography>
                            </Skeleton>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >

                                <Skeleton variant='circular' sx={{
                                    width: "18px",
                                    height: "18px",
                                }} />
                                <Skeleton>
                                    <Typography variant='h2' sx={{ fontSize: 12, fontWeight: 'bold', }}>Đặng Thuyền Quân</Typography>
                                </Skeleton>
                                <Skeleton>
                                    <Typography variant='body2'>đã gửi lúc 12/12/2012</Typography>
                                </Skeleton>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                            }}
                        >
                            <Skeleton>
                                <Button>Lời giải</Button>
                            </Skeleton>
                            <Skeleton>
                                <Button>Gửi giải pháp</Button>
                            </Skeleton>
                        </Box>

                    </Box>

                    <Box>
                        <Box
                            sx={{
                                pt: 2,
                                fontFamily: 'monospace',
                                fontSize: 14,
                            }}
                        >
                            <Skeleton />
                            <Skeleton variant='rectangular' sx={{ height: 64 }} />
                            <Skeleton>
                                <Typography variant='body2' sx={{ fontSize: 14, fontFamily: 'monospace', }}>Javascript</Typography>
                            </Skeleton>
                            <Skeleton variant='rectangular' sx={{ height: 200 }} />
                            <Skeleton variant='rectangular' sx={{ mt: 2, height: 200 }} />
                        </Box>
                    </Box>
                </Box >
            </Box >
        </Box>
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Box sx={{
                borderBottom: '1px solid',
                borderColor: 'dividerDark',
                pt: 1,
                pb: 1,
            }}>
                <Button
                    size="small"
                    sx={{ textTransform: 'unset', fontSize: 14, }}
                    color='inherit'
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => codingChallengeContext.setSubmissionsPost('listing')}
                > Tất cả bài đã nộp</Button>
            </Box>
            <Box
                className={"custom_scroll"}
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    margin: 0,
                    maxHeight: '100%',
                    overflowY: 'scroll',
                    pl: 2,
                    pr: 2,
                    pt: 2,
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
                    sx={{
                        maxWidth: 700,
                        margin: '0 auto',
                        pl: 2,
                        pr: 2,
                        pb: 4
                    }}
                >
                    {
                        codingChallengeContext.submissionsPost?.test_status === 'accepted' ?
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 3,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box>
                                    <Typography variant="h4" sx={{ fontSize: 20, color: 'success.main' }} >
                                        {
                                            convertStatusToTitle(codingChallengeContext.submissionsPost?.test_status)
                                        }
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <ImageLazyLoading
                                            src={getImageUrl(user.avatar, '/images/user-default.svg')}
                                            placeholderSrc='/images/user-default.svg'
                                            name={user.full_name}
                                            sx={{
                                                '& .blur': {
                                                    filter: 'unset !important',
                                                },
                                                width: "18px",
                                                height: "18px",
                                                borderRadius: '50%',
                                            }}
                                        />
                                        <Typography variant='h2' sx={{ fontSize: 12, fontWeight: 'bold', }}>{user.full_name}</Typography>
                                        <Typography variant='body2'>đã gửi lúc {dateTimeFormat(codingChallengeContext.submissionsPost.created_at as string)}</Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                    }}
                                >
                                    <Button color='inherit' sx={{ borderRadius: 2, }} variant='contained' onClick={() => {
                                        codingChallengeContext.onChangeTab('editorial');
                                    }}>Lời giải</Button>
                                    <Button color='success' sx={{ borderRadius: 2, }} variant='contained' onClick={() => setActiveSendSolution(codingChallengeContext.submissionsPost as ISubmissionsPostProps)}>Gửi giải pháp</Button>
                                </Box>

                            </Box>
                            :
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 3,
                                    alignItems: 'center'
                                }}
                            >
                                <Typography variant="h4" sx={{ fontSize: 20, color: 'error.main' }} >
                                    {
                                        convertStatusToTitle(codingChallengeContext.submissionsPost?.test_status)
                                    }
                                </Typography>
                                <Typography variant="body2">{codingChallengeContext.submissionsPost?.testcase_passed ?? 0} / {codingChallengeContext.submissionsPost?.testcase_total ?? 0} Bài kiểm tra đã vượt qua</Typography>
                            </Box>
                    }
                    <Box>
                        {
                            codingChallengeContext.submissionsPost?.test_status !== 'accepted' &&
                            <>
                                <Box
                                    sx={{
                                        pt: 2,
                                        fontFamily: 'monospace',
                                        fontSize: 14,
                                    }}
                                >
                                    <Typography variant='body2' sx={{ fontSize: 14, fontFamily: 'monospace' }}>Input</Typography>

                                    {
                                        codingChallengeContext.submissionsPost?.input.map((input, index) => <Box
                                            key={codingChallengeContext.challenge.id + '-' + index}
                                            sx={{
                                                mt: 0.5,
                                                padding: 1,
                                                borderRadius: 1,
                                                backgroundColor: 'divider',
                                                fontFamily: 'monospace',
                                                fontSize: 14,
                                                userSelect: 'text',
                                                '&.error': {
                                                    color: 'error.main',
                                                },
                                                '&.success': {
                                                    color: 'success.main',
                                                }
                                            }}
                                        >
                                            {input.name} = <br />
                                            {input.value}
                                        </Box>)
                                    }
                                </Box>
                                <Box
                                    sx={{
                                        pt: 2,
                                        fontFamily: 'monospace',
                                        fontSize: 14,
                                    }}
                                >
                                    <Typography variant='body2' sx={{ fontSize: 14, fontFamily: 'monospace', }}>Output</Typography>
                                    <Box
                                        sx={{
                                            mt: 0.5,
                                            padding: 1,
                                            borderRadius: 1,
                                            backgroundColor: 'divider',
                                            fontFamily: 'monospace',
                                            fontSize: 14,
                                            userSelect: 'text',
                                            color: 'error.main',
                                        }}
                                    >
                                        {convertValue(codingChallengeContext.submissionsPost?.output)}
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        pt: 2,
                                        fontFamily: 'monospace',
                                        fontSize: 14,
                                    }}
                                >
                                    <Typography variant='body2' sx={{ fontSize: 14, fontFamily: 'monospace', }}>Expected</Typography>
                                    <Box
                                        sx={{
                                            mt: 0.5,
                                            padding: 1,
                                            borderRadius: 1,
                                            backgroundColor: 'divider',
                                            fontFamily: 'monospace',
                                            fontSize: 14,
                                            userSelect: 'text',
                                            '&.error': {
                                                color: 'error.main',
                                            },
                                            '&.success': {
                                                color: 'success.main',
                                            }
                                        }}
                                    >
                                        {convertValue(codingChallengeContext.submissionsPost?.expected)}
                                    </Box>
                                </Box>
                            </>
                        }
                        <Box
                            sx={{
                                pt: 2,
                                fontFamily: 'monospace',
                                fontSize: 14,
                            }}
                        >
                            <Typography variant='body2' sx={{ fontSize: 14, fontFamily: 'monospace', }}>Javascript</Typography>
                            <CodeBlock
                                html={`<pre class="language-javascript"><code>${codingChallengeContext.submissionsPost?.code.js}</code></pre>`}
                                sx={{
                                    '& p>code': {
                                        ['--color']: 'inherit',
                                    }
                                }}
                            />

                        </Box>

                        <FormNotes
                            post={post}
                            formUpdateProfileRef={formUpdateProfileRef}
                            handleSaveNotes={handleSaveNotes}
                            setPost={setPost}
                        />
                        <Box
                            sx={{
                                pt: 1,
                            }}
                        >
                            <ActionFormNotes
                                colorState={colorState}
                                setColorState={setColorState}
                                onCloseDialogNotes={onCloseDialogNotes}
                                formUpdateProfileRef={formUpdateProfileRef}
                                hiddenButtonCancel
                                loadingButton={api.open['save_note']}
                            />
                        </Box>
                    </Box>
                </Box >
            </Box >
        </Box>
    )
}

export default Submissions

function convertStatusToTitle(status: ISubmissionsPostProps['test_status']): string {
    switch (status) {
        case 'accepted':
            return 'Đã được chấp nhận';
        case 'wrong_answer':
            return 'Câu trả lời sai';
        case 'compile_error':
            return 'Lỗi biên dịch';
        case 'runtime_error':
            return 'Lỗi runtime';
        case 'memory_limit':
            return 'Giới hạn bộ nhớ';
        case 'timeout':
            return 'Giới hạn thời gian';
    }

    return 'Đã được chấp nhận';
}

function FormNotes({ post, formUpdateProfileRef, handleSaveNotes, setPost }: {
    post: {
        notes: string;
    },
    formUpdateProfileRef: React.RefObject<{
        submit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
    }>,
    handleSaveNotes: (postForm: JsonFormat) => void,
    setPost: React.Dispatch<React.SetStateAction<{
        notes: string;
    }>>,
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                '& textarea.MuiInputBase-input': {
                    minHeight: '62px',
                }
            }}
        >
            <FormWrapper
                postDefault={{
                    ...post,
                }}
                ref={formUpdateProfileRef}
                onFinish={handleSaveNotes}
            >

                <FieldForm
                    name='notes'
                    component='textarea'
                    config={{
                        title: false,
                        inputProps: {
                            rows: 6,
                        }
                    }}
                    onReview={(value) => {
                        setPost(prev => ({ ...prev, notes: value }));
                    }}
                />
            </FormWrapper>
        </Box>
    )
}

function ActionFormNotes({ colorState, setColorState, onCloseDialogNotes, formUpdateProfileRef, hiddenButtonCancel, loadingButton }: {
    colorState: typeof colorList[number],
    setColorState: (value: React.SetStateAction<typeof colorList[number]>) => void,
    onCloseDialogNotes(): void,
    formUpdateProfileRef: React.RefObject<{
        submit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
    }>,
    hiddenButtonCancel?: boolean,
    loadingButton?: boolean,
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                {
                    colorList.map(color =>
                        <Box
                            key={color}
                            onClick={() => setColorState(color)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                cursor: 'pointer',
                                border: '1px solid ' + color
                            }}
                        >
                            {
                                colorState === color &&
                                <CheckCircleRoundedIcon sx={{ color: color, cursor: 'pointer', }} />
                            }
                        </Box>
                    )
                }
            </Box>
            <Box>
                {
                    !hiddenButtonCancel &&
                    <Button color='inherit' onClick={onCloseDialogNotes}>Hủy bỏ</Button>
                }
                <LoadingButton loading={!!loadingButton} variant='contained' onClick={() => formUpdateProfileRef.current?.submit()}>Lưu</LoadingButton>
            </Box>
        </Box>
    )
}

function FormSubmitSolution({ submission, onBack }: { submission: ISubmissionsPostProps, onBack(): void }) {

    const codingChallengeContext = useCodingChallengeContext();

    const [post, setPost] = React.useState({
        title: '',
        content: `
            <h2>Intuition</h2>

            <p style="font-family: monospace; font-size: 14px; line-height: 19px;">
                <span style="color: #008000;">&lt;!-- Describe your first thoughts on how to solve this problem. --&gt;</span>
            </p>
            <h2>Approach</h2>
            <p style="font-family: monospace; font-size: 14px; line-height: 19px;">
                <span style="color: #008000;">&lt;!-- Describe your approach to solving the problem. --&gt;</span>
            </p>
            <h2>Complexity</h2>
            <p>- Time complexity:</p>
            <p style="font-family: monospace; font-size: 14px; line-height: 19px;">
                <span style="color: #008000;">&lt;!-- Add your time complexity here, e.g. $$O(n)$$ --&gt;</span>
            </p>
            <p>- Space complexity:</p>
            <p style="font-family: monospace; font-size: 14px; line-height: 19px;">
                <span style="color: #008000;">&lt;!-- Add your space complexity here, e.g. $$O(n)$$ --&gt;</span>
            </p>
            <h2>Code</h2>
            <pre class="language-javascript"><code>${submission.code.js}</code></pre>
        `,
    });

    const formUpdateProfileRef = React.useRef<{
        submit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
    }>(null);

    const handleSubmitSolution = async (postForm: JsonFormat) => {

        const result = await codingChallengeService.submitSolution(submission.id as unknown as number, postForm.title, postForm.content);

        if (result) {
            codingChallengeContext.updateListingSolutions(1);
            window.showMessage('Đã gửi lời giải.', 'success');
        }
    };

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}
    >
        <Box sx={{
            borderBottom: '1px solid',
            borderColor: 'dividerDark',
            pt: 1,
            pb: 1,
        }}>
            <Button
                size="small"
                sx={{ textTransform: 'unset', fontSize: 14, }}
                color='inherit'
                onClick={onBack}
                startIcon={<ArrowBackRoundedIcon />}
            > Quay lại</Button>
        </Box>
        <Box
            className={"custom_scroll"}
            sx={{
                position: 'relative',
                zIndex: 2,
                margin: 0,
                maxHeight: '100%',
                overflowY: 'scroll',
                pl: 2,
                pr: 2,
                pt: 2,
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

            <FormWrapper
                ref={formUpdateProfileRef}
                onFinish={handleSubmitSolution}
                postDefault={post}
            >
                <FieldForm
                    name='title'
                    component='text'
                    config={{
                        title: 'Tiêu đề',
                        placeholder: 'Nhập tiêu đề',
                        inputProps: {
                            rows: 6,
                            inputProps: {
                                id: 'title-submission',
                            }
                        }
                    }}
                    post={post}
                    onReview={(value) => {
                        setPost(prev => ({ ...prev, title: value }));
                    }}
                />
                <Box
                    sx={{
                        pt: 3,
                        pb: 2,
                    }}
                >
                    <FieldForm
                        name='content'
                        component='editor'
                        config={{
                            title: false,
                            disableScrollToolBar: true,
                            inputProps: {
                                height: 500,
                            }
                        }}
                        post={post}
                        onReview={(value) => {
                            setPost(prev => ({ ...prev, content: value }));
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        pb: 2,
                    }}
                >
                    <Button color='inherit' onClick={() => {
                        //
                    }}>Hủy bỏ</Button>
                    <Button variant='contained' onClick={() => formUpdateProfileRef.current?.submit()}>Gửi</Button>
                </Box>

            </FormWrapper>
        </Box>
    </Box>
}

function SubmissionsSkeleton({ count }: { count: number }) {
    return <>
        {[...Array(count)].map((_, index) => <TableRow key={index}>
            <TableCell sx={{ height: 55 }}>
                <Skeleton variant='text' />
            </TableCell>
            <TableCell>
                <Skeleton variant='text' />
            </TableCell>
            <TableCell>
                <Skeleton variant='text' />
            </TableCell>
            <TableCell>
                <Skeleton variant='text' />
            </TableCell>
        </TableRow>)
        }
    </>
}