import DialogTitle from 'components/atoms/DialogTitle';
import DialogContentText from 'components/atoms/DialogContentText';
import DialogContent from 'components/atoms/DialogContent';
import { default as AtomsDialog } from 'components/atoms/Dialog';
import DialogActions from 'components/atoms/DialogActions';
import React from 'react';
import IconButton from '@mui/material/IconButton';
import Icon from 'components/atoms/Icon';
import Divider from 'components/atoms/Divider';
import { SxProps, Theme } from '@mui/material';

interface DialogProps {
    [key: string]: ANY,
    title?: string | React.ReactNode,
    open: boolean,
    onClose: () => void,
    children: React.ReactNode,
    action?: React.ReactNode,
    sx?: SxProps<Theme>,
    style?: { [key: string]: ANY },
    disableIconClose?: boolean,
}

function Dialog({ title, action, open, onClose, children, style, disableIconClose, ...rest }: DialogProps) {

    return (
        <AtomsDialog
            open={open}
            scroll='paper'
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            fullWidth
            onClose={onClose}
            sx={{
                zIndex: 1299
            }}
            {...rest}
        >
            {
                title ?
                    <DialogTitle style={{ fontSize: 18 }}>
                        {title}

                    </DialogTitle>
                    :
                    null
            }
            {
                !disableIconClose &&
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: '6px',
                        top: '6px',
                    }}
                >
                    <Icon icon="ClearRounded" />
                </IconButton>
            }
            <DialogContent dividers={true} className="custom_scroll custom" style={style ?? {}}>
                <DialogContentText
                    component="div"
                    style={{ margin: 0 }}
                    sx={{ color: 'text.primary' }}
                >
                    {children}
                </DialogContentText>
            </DialogContent>
            {
                Boolean(action) &&
                <>
                    <Divider />
                    <DialogActions>
                        {action}
                    </DialogActions>
                </>
            }

        </AtomsDialog>
    )
}

export default Dialog
