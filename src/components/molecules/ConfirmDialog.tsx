import DialogTitle from 'components/atoms/DialogTitle'
import DialogContentText from 'components/atoms/DialogContentText'
import DialogContent from 'components/atoms/DialogContent'
import DialogActions from 'components/atoms/DialogActions'
import Dialog from 'components/atoms/Dialog'
import Button from 'components/atoms/Button'
import React from 'react'
import { __ } from 'helpers/i18n'

interface ConfirmDialogProp {
    open: boolean,
    onClose: () => void,
    onConfirm: () => void,
    title?: string,
    message?: React.ReactNode,
    labelCancel?: string,
    labelOk?: string,
    renderButtons?: (onConfirm: () => void, onClose: () => void) => React.ReactNode
}
function ConfirmDialog({ open, onClose, onConfirm, renderButtons, title = __('Xác nhận xóa'), message = __('Bạn có chắc chắn muốn xóa vĩnh viễn mục này không?'), labelCancel = __('Hủy bỏ'), labelOk = __('Đồng ý') }: ConfirmDialogProp) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle sx={{ backgroundColor: 'unset', color: 'text.primary' }}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {
                    renderButtons ?
                        renderButtons(onConfirm, onClose)
                        : <>
                            <Button onClick={onClose} color="primary" autoFocus>
                                {labelCancel}
                            </Button>
                            <Button onClick={onConfirm} color="inherit">
                                {labelOk}
                            </Button>
                        </>
                }
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog
