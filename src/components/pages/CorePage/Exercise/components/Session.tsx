import { ArrowDownwardRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { AccordionSummaryProps, Alert, AlertTitle, Box, Button, Card, CardContent, CardHeader, CircularProgress, FormControl, ListItemText, MenuItem, Select, Theme, Typography } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/styles';
import { useQuery } from '@tanstack/react-query';
import Divider from 'components/atoms/Divider';
import FieldForm from 'components/atoms/fields/FieldForm';
import FormWrapper, { FormData } from 'components/atoms/fields/FormWrapper';
import Dialog from 'components/molecules/Dialog';
import { cssMaxLine } from 'helpers/dom';
import useAjax from 'hook/useApi';
import React from 'react';
import codingChallengeService, { CodingChallengeProps } from 'services/codingChallengeService';
import { colorDifficulty } from './ProblemsTable';
import Label from 'components/atoms/Label';
import useConfirmDialog from 'hook/useConfirmDialog';
import { UserState, useUser } from 'store/user/user.reducers';
import { Link } from 'react-router-dom';

function Session() {

    const user = useUser();

    const firstLoad = React.useRef(false);

    const { isLoading, data: session, refetch } = useChallengeSession();

    const [openDialogSessionManagement, setOpenDialogSessionManagement] = React.useState(false);

    const formUpdateProfileRef = React.useRef<{
        submit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
    }>(null);

    const [expanded, setExpanded] = React.useState<ID | false>(false);

    const handleChangePanel = (panel: ID) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    const confirmDeleteNote = useConfirmDialog({
        renderButtons: (onConfirm, onClose) => <>
            <Button variant='contained' onClick={onClose}>
                Hủy bỏ
            </Button>
            <Button color="inherit" onClick={onConfirm}>
                Đồng ý
            </Button>
        </>
    });

    React.useEffect(() => {
        if (user._state !== UserState.unknown && firstLoad.current) {
            refetch();
        }
        firstLoad.current = true;
    }, [user]);

    React.useEffect(() => {

        if (window.__refreshChallengeSession) {
            refetch();
            delete window.__refreshChallengeSession;
        }

    }, []);

    const apiMutaion = useAjax()

    const handleSubmitCreateSession = async (data: FormData) => {
        if (data.title) {
            apiMutaion.request(async () => {
                const result = await codingChallengeService.createNewSession(data.title);
                if (result) {
                    refetch();
                    setOpenDialogSessionManagement(false);
                }
            });
        }
    }

    if (isLoading) {
        return <></>
    }

    return (
        <>
            <Card
                sx={{
                    mt: 3,
                }}
            >
                <CardHeader
                    title={<Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography>Phiên</Typography>
                        <FormControl size="small" sx={{ width: 150, '.MuiTypography-root': { ...cssMaxLine(1) }, '.MuiSelect-select': { display: 'flex', alignItems: 'center', height: 16, minHeight: 'auto' } }}>
                            <Select
                                value={session.id}
                                onChange={async (e) => {
                                    if (e.target.value === 'new') {
                                        setOpenDialogSessionManagement(true);
                                        return;
                                    }

                                    if (e.target.value !== session.id) {
                                        await codingChallengeService.updateSessionCurrent(e.target.value, 'active');
                                        refetch();
                                        return;
                                    }
                                }}
                            >
                                {
                                    session.sessions.map((s) => <MenuItem selected={s.active ? true : false} key={s.id} value={s.id}>
                                        <ListItemText>
                                            {s.title}
                                        </ListItemText>
                                    </MenuItem>)
                                }

                                <Divider color='dark' />
                                <MenuItem value={'new'}>
                                    <ListItemText>Quản lý phiên</ListItemText>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>}
                />
                <CardContent
                    sx={{
                        display: 'flex',
                        gap: 2,
                        pt: 0,
                    }}
                >
                    <CircularProgressMuiltiLayer
                        total={session.count_easy + session.count_medium + session.count_hard}
                        easy={session.question_easy_count}
                        medium={session.question_medium_count}
                        hard={session.question_hard_count}
                    />
                    <Box
                        sx={{
                            width: '100%',
                        }}
                    >
                        {
                            [
                                {
                                    title: 'Dễ',
                                    color: 'easy',
                                    count: session.question_easy_count,
                                    total: session.count_easy,
                                },
                                {
                                    title: 'Trung bình',
                                    color: 'medium',
                                    count: session.question_medium_count,
                                    total: session.count_medium,
                                },
                                {
                                    title: 'Khó',
                                    color: 'hard',
                                    count: session.question_hard_count,
                                    total: session.count_hard,
                                }
                            ].map((item) => (
                                <Box
                                    key={item.title}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography sx={{
                                        fontSize: 13,
                                        color: colorDifficulty(item.color as CodingChallengeProps['difficulty']),
                                    }}>
                                        {item.title}:
                                    </Typography>
                                    <Typography variant='body2'>
                                        <strong style={{ fontSize: 16 }}>{item.count}</strong> / {item.total}
                                    </Typography>
                                </Box>
                            ))
                        }
                    </Box>
                </CardContent>
            </Card>

            <Dialog
                title="Quản lý phiên"
                open={openDialogSessionManagement}
                onClose={() => setOpenDialogSessionManagement(false)}
            >
                <Alert
                    about='Hướng dẫn'
                    severity="info"
                    sx={{
                        mb: 2
                    }}
                >
                    <AlertTitle>Hướng dẫn</AlertTitle>
                    <Typography sx={{ fontSize: 14 }}>Để bắt đầu lại, hãy tạo một phiên mới và nhấp vào phiên mới để kích hoạt nó.</Typography>
                    <Typography sx={{ fontSize: 14, mt: 0.5 }}>Tiến trình của bạn sẽ được theo dõi riêng trong phiên mới tạo và bạn có thể bắt đầu một vòng luyện tập khác.</Typography>
                </Alert>
                <Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 'bold', mb: 1, }}>Tất cả các phiên của bạn</Typography>
                    {
                        session.sessions.map((s) =>
                            <Accordion expanded={expanded === s.id} onChange={handleChangePanel(s.id)} key={s.id}>
                                <AccordionSummary
                                    expandIcon={s.active ? undefined : <ArrowDownwardRounded />}
                                    sx={(theme: Theme) => ({
                                        backgroundColor: s.active ? theme.palette.mode === 'dark'
                                            ? 'rgba(25, 118, 210, 0.24)'
                                            : 'rgba(25, 118, 210, 0.08)' : 'inherit'
                                    })}
                                >
                                    <Typography>{s.title}</Typography>
                                    {
                                        s.active ?
                                            <Label color='primary' sx={{ backgroundColor: 'primary.main', ml: 'auto' }}>Đang kích hoạt</Label>
                                            : null
                                    }
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormWrapper
                                        postDefault={{
                                            title: s.title
                                        }}
                                        onFinish={(data) => {
                                            if (data.title) {
                                                apiMutaion.request(async () => {
                                                    const result = await codingChallengeService.updateSessionCurrent(s.id, 'change_name', data.title);
                                                    if (result) {
                                                        refetch();
                                                        setOpenDialogSessionManagement(false);
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                                pb: 1,
                                            }}
                                        >
                                            <FieldForm
                                                component='text'
                                                config={{
                                                    title: 'Tên',
                                                    size: 'small',
                                                    rules: {
                                                        require: true,
                                                        minLength: 6,
                                                        maxLength: 30
                                                    },
                                                }}
                                                name="title"
                                            />
                                            <Box>
                                                <LoadingButton
                                                    loading={apiMutaion.open}
                                                    variant='contained'
                                                    color='inherit'
                                                    type='submit'
                                                    size='small'
                                                    sx={{
                                                        mb: 1
                                                    }}
                                                    onClick={() => formUpdateProfileRef.current?.submit()}
                                                >
                                                    Đổi tên
                                                </LoadingButton>
                                            </Box>
                                        </Box>

                                    </FormWrapper>
                                    {
                                        [
                                            ['Số câu hỏi được chấp nhận', s.question_easy_count],
                                            ['Số lượng câu hỏi đã gửi', s.question_medium_count],
                                            ['Số lượng bài nộp được chấp nhận', s.question_hard_count],
                                            ['Số lượng bài nộp', s.question_easy_count],
                                        ].map((item, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography sx={{ fontSize: 14 }}>
                                                    {item[0]}
                                                </Typography>
                                                <Label>{item[1]}</Label>
                                            </Box>
                                        ))
                                    }
                                    {
                                        s.active ?
                                            null
                                            :
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mt: 2,
                                                }}
                                            >
                                                {
                                                    s.removable ?
                                                        <Button
                                                            color='error'
                                                            variant='contained'
                                                            size="small"
                                                            onClick={async () => {
                                                                confirmDeleteNote.onConfirm(async () => {
                                                                    await codingChallengeService.updateSessionCurrent(s.id, 'delete');
                                                                    refetch();
                                                                }, { message: 'Bạn có chắc muốn xóa vĩnh viễn phiên này không?' })
                                                            }}
                                                        >Xóa phiên</Button>
                                                        :
                                                        <Typography />
                                                }
                                                <Button
                                                    variant='contained'
                                                    size="small"
                                                    onClick={async () => {
                                                        await codingChallengeService.updateSessionCurrent(s.id, 'active');
                                                        refetch();
                                                    }}
                                                >Kích hoạt</Button>
                                            </Box>
                                    }
                                </AccordionDetails>
                            </Accordion>
                        )
                    }
                </Box>
                {
                    session.sessions.length >= 5 ?
                        <Alert
                            severity='warning'
                            sx={{ mt: 2 }}
                        >
                            <Typography sx={{ fontSize: 14 }}>Bạn đã sử dụng hết giới hạn miễn phí, bạn có thể tạo không giời hạn bằng cách mua tài khoản premium <Button component={Link} to="/subscribe" size='small'>Tại đây</Button></Typography>
                        </Alert>
                        :
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                pt: 2,
                            }}
                        >
                            <FormWrapper
                                postDefault={{
                                    title: ''
                                }}
                                ref={formUpdateProfileRef}
                                onFinish={handleSubmitCreateSession}
                            >
                                <FieldForm
                                    component='text'
                                    config={{
                                        title: 'Tên',
                                        size: 'small',
                                        rules: {
                                            require: true,
                                            minLength: 6,
                                            maxLength: 30
                                        },
                                    }}
                                    name="title"
                                />
                            </FormWrapper>
                            <Box>
                                <LoadingButton
                                    loading={apiMutaion.open}
                                    variant='contained'
                                    color='primary'
                                    onClick={() => formUpdateProfileRef.current?.submit()}
                                >
                                    Tạo mới
                                </LoadingButton>
                            </Box>
                        </Box>
                }
                {confirmDeleteNote.component}
            </Dialog>
        </>
    )
}

export default Session


function CircularProgressMuiltiLayer({ easy = 0, medium = 0, hard = 0, total = 0 }: { easy: number, medium: number, hard: number, total: number }) {
    return <Box
        sx={{
            flexShrink: 0,
            position: 'relative',
            height: 100,
            width: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            'circle': {
                strokeLinecap: 'round',
            }
        }}
    >
        <CircularProgress variant="determinate" sx={{ position: 'absolute', left: 0, zIndex: 4, color: colorDifficulty('easy') }} size={100} thickness={2} value={(easy * 100) / (total ? total : - Infinity)} />
        <CircularProgress variant="determinate" sx={{ position: 'absolute', left: 0, zIndex: 3, color: colorDifficulty('medium') }} size={100} thickness={2} value={((easy + medium) * 100) / (total ? total : - Infinity)} />
        <CircularProgress variant="determinate" sx={{ position: 'absolute', left: 0, zIndex: 2, color: colorDifficulty('hard') }} size={100} thickness={2} value={((easy + medium + hard) * 100) / (total ? total : - Infinity)} />
        <CircularProgress variant="determinate" sx={{ color: 'dividerDark', position: 'absolute', left: 0, zIndex: 1 }} thickness={2} size={100} value={100} />
        <Typography sx={{
            fontSize: 13
        }}>{
                total ? (Math.round((easy + medium + hard) * 100 / total) ?? 1)
                    :
                    0
            }%</Typography>
    </Box>
}

export const useChallengeSession = () => useQuery({
    queryKey: ['useChallengeSession'], queryFn: () => codingChallengeService.getSessionCurrent(),
    initialData: {
        title: '',
        challenge_attempted: {},
        challenge_solved: {},
        question_easy_count: 0,
        question_hard_count: 0,
        question_medium_count: 0,
        count_easy: 0,
        count_hard: 0,
        count_medium: 0,
        id: 0,
        active: false,
        removable: false,
        sessions: [],
    },
    staleTime: (st) => {
        if (st.state.data?.id !== 0) return Infinity

        return 0;
    },
})

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }: { theme: Theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }: { theme: Theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        {...props}
    />
))(({ theme }: { theme: Theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));