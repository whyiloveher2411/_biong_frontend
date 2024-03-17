import MonacoEditor from 'components/atoms/MonacoEditor';
import React from 'react';
import { useCodingChallengeContext } from './context/CodingChallengeContext';
import { Box, Button, IconButton, Typography } from '@mui/material';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
function Coding() {

    const editor = React.useRef<ANY>(null);
    const codingChallengeContext = useCodingChallengeContext();

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pr: 1,
                    pl: 1,
                }}
            >
                <Box>
                    <Typography variant='body2'>Javscript</Typography>
                </Box>
                <Box>
                    <IconButton size='small' onClick={() => {
                        codingChallengeContext.dialogConfirm.onOpen((onClose) => ({
                            title: 'Bạn có chắc không?',
                            message: 'Mã hiện tại của bạn sẽ bị loại bỏ và đặt lại về mã mặc định!',
                            buttons: <>
                                <Button color="inherit" onClick={onClose}>Hủy bỏ</Button>
                                <Button variant='contained' onClick={() => {
                                    // codingChallengeContext.
                                    if (editor.current?.setValue) {
                                        editor.current.setValue(codingChallengeContext.challenge.challenge_files[0].contents);
                                    }
                                    onClose();
                                }}>Xác nhận</Button>
                            </>
                        }));
                    }}>
                        <ReplayRoundedIcon />
                    </IconButton>
                </Box>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                }}
            >
                <MonacoEditor
                    defaultContent={codingChallengeContext.challenge.challenge_files[0].contents}
                    content={codingChallengeContext.challenge.challenge_files[0].contents}
                    language={'javascript'}
                    editor={editor}
                    autoWrapText={true}
                    idPassed={false}
                    afterOnloadMonaco={codingChallengeContext.afterOnLoadMonaco}
                    question={{
                        title: '',
                        content: '',
                    }}
                    onChange={(html, js, css) => {
                        codingChallengeContext.onChangeCode(html, css, js)
                    }}
                    onSubmit={() => {
                        //
                    }}
                />
            </Box>
        </Box>
    )
}

export default Coding