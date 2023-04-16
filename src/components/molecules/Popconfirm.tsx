import React from 'react';
import Box from "components/atoms/Box";
import MenuPopper from "components/atoms/MenuPopper";
import { Button, Typography } from '@mui/material';


interface ConfirmDialogProp {
    onConfirm: () => void,
    title?: string,
    message?: React.ReactNode,
    labelCancel?: string,
    labelOk?: string,
    renderButtons?: (onConfirm: () => void, onClose: () => void) => React.ReactNode,
    children: React.ReactElement,
    icon?: React.ReactElement,
}

function Popconfirm({ onConfirm, renderButtons, children, title = 'Xác nhận xóa', icon, message = 'Bạn có chắc chắn muốn xóa vĩnh viễn mục này không?', labelCancel = 'Hủy bỏ', labelOk = 'Đồng ý' }: ConfirmDialogProp) {

    const [open, setOpen] = React.useState(false);

    const buttonRef = React.useRef<HTMLElement | null>(null);

    const onClose = () => setOpen(false);

    return <>
        {React.cloneElement(children, {
            onClick: () => {
                setOpen(true);
            },
            ref: buttonRef
        })}
        <MenuPopper
            style={{ zIndex: 2147483648 }}
            open={open}
            anchorEl={buttonRef.current}
            onClose={() => {
                setOpen(false);
            }}
            paperProps={{
                elevation: 0,
                sx: {
                    border: '1px solid',
                    borderColor: 'dividerDark',
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                },
            }}
        >
            <Box

                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: 360,
                    p: 2,
                    pb: 1,
                }}
            >
                <Typography variant='h6' sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1, fontWeight: 600 }}>{icon}{title}</Typography>
                <Typography>{message}</Typography>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        justifyContent: 'flex-end',
                    }}
                >
                    {
                        renderButtons ?
                            renderButtons(onConfirm, onClose)
                            : <>
                                <Button size='small' onClick={onClose} color="inherit" autoFocus>
                                    {labelCancel}
                                </Button>
                                <Button size='small' onClick={() => {
                                    onConfirm();
                                    setOpen(false);
                                }} variant='contained' >
                                    {labelOk}
                                </Button>
                            </>
                    }


                </Box>
            </Box>
        </MenuPopper >
    </>
}

export default Popconfirm