import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Card, CardContent, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import CodeBlock from "components/atoms/CodeBlock";
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import FieldForm from 'components/atoms/fields/FieldForm';
import FormWrapper from 'components/atoms/fields/FormWrapper';
import Dialog from 'components/molecules/Dialog';
import NotFound from 'components/molecules/NotFound';
import { dateTimeFormat, dateTimefromNow } from 'helpers/date';
import { cssMaxLine } from 'helpers/dom';
import { getImageUrl } from 'helpers/image';
import { delayUntil } from 'helpers/script';
import { formatBytes, formatTime } from 'helpers/string';
import { useStatedApi } from 'hook/useApi';
import useQuery from 'hook/useQuery';
import cloneDeep from 'lodash/cloneDeep';
import React from "react";
import codingChallengeService, { convertValue } from "services/codingChallengeService";
import { useUser } from 'store/user/user.reducers';
import { ISubmissionsPostProps } from '../../ExerciseDetail';
import { useCodingChallengeContext } from "../context/CodingChallengeContext";

const colorList = [
    '#b0acac',
    '#ffb800',
    '#007aff',
    '#01b328',
    '#f74397',
    '#af52de',
] as const;

// const reviewResult: Array<{
//     title: string,
//     result: number,
//     icon: React.ReactNode,
//     total: number
// }> = [
//         {
//             title: 'Độ phức tạp thời gian',
//             result: 18,
//             total: 20,
//             icon: <AccessTimeRoundedIcon />
//         },
//         {
//             title: 'Độ phức tạp không gian',
//             result: 15,
//             total: 20,
//             icon: <PublicRoundedIcon />
//         },
//         {
//             title: 'Cấu trúc và tổ chức code',
//             result: 8,
//             total: 10,
//             icon: <AddToQueueOutlinedIcon />
//         },
//         {
//             title: 'Naming conventions',
//             result: 5,
//             total: 5,
//             icon: <BoltOutlinedIcon />
//         },

//         {
//             title: 'Tối ưu hóa',
//             result: 9,
//             total: 10,
//             icon: <DriveFileRenameOutlineOutlinedIcon />
//         },

//         {
//             title: 'Độ sạch của code',
//             result: 8,
//             total: 10,
//             icon: <BlurOnOutlinedIcon />
//         },
//         {
//             title: 'Comments và documentation',
//             result: 6,
//             total: 10,
//             icon: <CommentOutlinedIcon />
//         },
//         {
//             title: 'Sử dụng cấu trúc dữ liệu',
//             result: 8,
//             total: 10,
//             icon: <BusinessOutlinedIcon />
//         },
//         {
//             title: 'Độc đáo và sáng tạo',
//             result: 5,
//             total: 5,
//             icon: <AutoFixOffOutlinedIcon />
//         },
//     ]

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
                                            Bộ nhớ
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
                                                                    opacity: 0,
                                                                    pointerEvents: 'none',
                                                                },
                                                                '&:hover .btn-add-notes': {
                                                                    opacity: 1,
                                                                    pointerEvents: 'all',
                                                                }
                                                            }}
                                                            key={submission.id}
                                                            hover
                                                            role="checkbox"
                                                            tabIndex={-1}
                                                            onClick={() => {

                                                                const submissionClone = cloneDeep(submission);

                                                                // try {
                                                                //     if (typeof submissionClone.input === 'string') {
                                                                //         submissionClone.input = JSON.parse(submissionClone.input);
                                                                //     }
                                                                // } catch (error) {
                                                                //     submissionClone.input = []
                                                                // }
                                                                try {
                                                                    if (typeof submissionClone.info_last_testcase === 'string') {
                                                                        submissionClone.info_last_testcase = JSON.parse(submissionClone.info_last_testcase);
                                                                    }
                                                                } catch (error) {
                                                                    submissionClone.info_last_testcase = undefined;
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
                                                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 14, }}><AccessTimeRoundedIcon /> {submission.test_status === 'accepted' ? formatTime(submission.execution_time) : 'N/A'}</Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ width: 100, whiteSpace: 'nowrap' }}>
                                                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 14, }}><MemoryRoundedIcon /> {submission.test_status === 'accepted' ? formatBytes(submission.memory) : 'N/A'}</Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ width: 100, whiteSpace: 'nowrap' }} >
                                                                {submission.success_case}/{submission.total_case}
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
                                                {
                                                    codingChallengeContext.submissions.last_page !== 1 &&
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
                                                }
                                            </>
                                            :
                                            <TableRow>
                                                <TableCell colSpan={100} sx={{ pt: 2 }}>
                                                    <NotFound
                                                        title='Chưa có bài nộp nào'
                                                        subTitle={`Bạn chưa nộp bài giải nào cho bài tập "${codingChallengeContext.challenge.title}". Hãy thử sức với bài tập này nhé!`}
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
                                            pt: 1,
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
                                                width: "28px",
                                                height: "28px",
                                                borderRadius: '50%',
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <Typography variant='h2' sx={{ lineHeight: '18px', fontSize: 12, fontWeight: 'bold', }}>{user.full_name}</Typography>
                                            <Typography variant='body2'>đã gửi lúc {dateTimeFormat(codingChallengeContext.submissionsPost.created_at as string)}</Typography>
                                        </Box>
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
                                <Typography variant="body2">{countTestPass(codingChallengeContext.submissionsPost.result) ?? 0} / {codingChallengeContext.submissionsPost.result.length ?? 1} Test case thành công</Typography>
                            </Box>
                    }


                    {
                        codingChallengeContext.submissionsPost?.test_status === 'accepted' &&
                        <>
                            <Card
                                sx={{
                                    mt: 2,
                                }}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            flex: 1,
                                        }}
                                    >
                                        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 14, mb: 0.5 }}><AccessTimeRoundedIcon /> Thời gian chạy</Typography>
                                        <Typography variant="h3">{formatTime(codingChallengeContext.submissionsPost.execution_time)}</Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            flex: 1,
                                        }}
                                    >
                                        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 14, mb: 0.5 }}><MemoryRoundedIcon /> Bộ nhớ</Typography>
                                        <Typography variant="h3">{formatBytes(codingChallengeContext.submissionsPost.memory)}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                            {/* <Alert
                                variant='standard'
                                severity='success'
                                icon={false}
                                sx={{
                                    mt: 3
                                }}
                            >
                                <Typography variant='h2' sx={{ fontSize: 18, mb: 1, fontWeight: 'bold', }}>Đánh giá từ người hướng dẫn</Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'center',
                                        pb: 2,
                                        mb: 2,
                                        borderBottom: '1px solid',
                                        borderColor: 'dividerDark',
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 'bold', fontSize: 50 }}>4,7</Typography>
                                    <Box>
                                        <Rating
                                            size="large"
                                            precision={0.1}
                                            value={5}
                                            emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                                        />
                                        <Typography sx={{ fontWeight: 'bold', opacity: 0.7, fontSize: 16 }}>Based on 567 ratings</Typography>
                                    </Box>
                                </Box>
                                <Grid
                                    container
                                    spacing={1}
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {
                                        reviewResult.map((item, index) => <Grid
                                            item
                                            md={6}
                                            key={index}
                                            sx={{
                                                width: '50%',
                                                display: 'flex',
                                                gap: 1,
                                            }}
                                        >
                                            {item.icon}
                                            <Box
                                                sx={{ flex: 1 }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <Typography>{item.title}</Typography>
                                                    <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>{item.result}</Typography>
                                                </Box>
                                                <LinearProgress variant='determinate' value={item.result * 100 / item.total} />
                                            </Box>
                                        </Grid>)
                                    }
                                </Grid>
                            </Alert> */}
                        </>
                    }

                    <Box>
                        {
                            codingChallengeContext.submissionsPost?.test_status !== 'accepted' ?

                                codingChallengeContext.submissionsPost?.test_status === 'runtime_error' ?
                                    <Alert severity='error' sx={{ mt: 1 }}>
                                        <Typography variant='body2'>{codingChallengeContext.submissionsPost.status_str}</Typography>
                                    </Alert>
                                    :
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
                                                codingChallengeContext.submissionsPost?.info_last_testcase ?
                                                    Object.keys(codingChallengeContext.submissionsPost.info_last_testcase.input).map((key) => {
                                                        if (key === 'expected') return <React.Fragment key={codingChallengeContext.challenge.id + '-' + key} />
                                                        const value = (codingChallengeContext.submissionsPost as ISubmissionsPostProps).info_last_testcase?.input[key];
                                                        return <Box
                                                            key={codingChallengeContext.challenge.id + '-' + key}
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
                                                            {key} = <br />
                                                            {convertValue(value)}
                                                        </Box>
                                                    })
                                                    : null
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
                                                {convertValue(codingChallengeContext.submissionsPost?.info_last_testcase?.output)}
                                            </Box>
                                        </Box>
                                        <Box
                                            sx={{
                                                pt: 2,
                                                fontFamily: 'monospace',
                                                fontSize: 14,
                                            }}
                                        >
                                            <Typography variant='body2' sx={{ fontSize: 14, fontFamily: 'monospace', }}>Mong đợi</Typography>
                                            <Box
                                                sx={{
                                                    mt: 0.5,
                                                    padding: 1,
                                                    borderRadius: 1,
                                                    backgroundColor: 'divider',
                                                    fontFamily: 'monospace',
                                                    fontSize: 14,
                                                    userSelect: 'text',
                                                    color: 'success.main',
                                                }}
                                            >
                                                {convertValue(codingChallengeContext.submissionsPost?.info_last_testcase?.input.expected)}
                                            </Box>
                                        </Box>
                                    </>
                                : null
                        }
                        <Box
                            sx={{
                                pt: 2,
                                fontFamily: 'monospace',
                                fontSize: 14,
                                pb: 2,
                            }}
                        >
                            <CodeBlock
                                html={`<pre class="language-javascript"><code>${codingChallengeContext.submissionsPost.code}</code></pre>`}
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
        title: submission.title,
        content: submission.content_submit_solution ?? `
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
            <pre class="language-javascript"><code>${submission.code}</code></pre>
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

const countTestPass = (str: string): number => {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '1') count++;
    }
    return count;
};