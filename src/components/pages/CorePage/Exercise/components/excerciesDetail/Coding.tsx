import MonacoEditor from 'components/atoms/MonacoEditor';
import React from 'react';
import { useCodingChallengeContext } from './context/CodingChallengeContext';
import { Box, Button, IconButton, Typography } from '@mui/material';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
function Coding() {

    const editor = React.useRef<ANY>(null);
    const codingChallengeContext = useCodingChallengeContext();
    const language = 'javascript';
    const code_snippet = codingChallengeContext.challenge.code_snippets.find(item => item.langSlug === language);

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
                    <Typography variant='body2'>{language}</Typography>
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

                                        if (code_snippet) {
                                            editor.current.setValue(code_snippet.code || '');
                                        }
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
                    height: 'calc( 100% - 34px )'
                }}
            >
                <MonacoEditor
                    defaultContent={code_snippet?.code || ''}
                    content={code_snippet?.code || ''}
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