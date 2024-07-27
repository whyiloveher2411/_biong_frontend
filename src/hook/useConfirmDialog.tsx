import ConfirmDialog from 'components/molecules/ConfirmDialog';
import React from 'react';

function useConfirmDialog(props?: {
    message?: React.ReactNode,
    title?: string,
    labelCancel?: string,
    labelOk?: string,
    renderButtons?: (onConfirm: () => void, onClose: () => void) => React.ReactNode
}): UseConfirmDialogExportProps {

    const [open, setOpen] = React.useState(false);

    const [messageState, setMessageState] = React.useState(props?.message);
    const [titleState, setTitleState] = React.useState(props?.title);
    const [renderButtonsState, setRenderButtonsState] = React.useState<React.ReactNode | undefined>(undefined);

    const [callback, setCallback] = React.useState<(() => void) | null>(null);

    return {
        open: open,
        setOpen: setOpen,
        setMessage: setMessageState,
        setTitle: setTitleState,
        onConfirm: (callbackConfirm: () => void, options?: { message: string }) => {
            setOpen(true);
            if (options?.message) {
                setMessageState(options.message);
            }
            setCallback(() => callbackConfirm);
        },
        onOpen: (callback: (onClose: () => void) => {
            title: string,
            message: React.ReactNode,
            buttons: React.ReactNode
        }) => {
            const data = callback(() => setOpen(false));
            setTitleState(data.title);
            setMessageState(data.message);
            setRenderButtonsState(() => data.buttons)
            setOpen(true);
        },
        component: <ConfirmDialog
            {...props}
            message={messageState}
            title={titleState}
            open={open}
            renderButtons={renderButtonsState ? () => renderButtonsState : props?.renderButtons}
            onClose={() => setOpen(false)}
            onConfirm={() => {
                if (callback) {
                    callback();
                }
                setOpen(false);
            }}
        />
    };
}

export default useConfirmDialog;

export interface UseConfirmDialogExportProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    onConfirm: (callback: () => void, options?: { message: string }) => void,
    component: JSX.Element,
    setMessage: React.Dispatch<React.ReactNode>
    setTitle: React.Dispatch<string>,
    onOpen: (callback: (onClose: () => void) => {
        title: string;
        message: React.ReactNode;
        buttons: React.ReactNode;
    }) => void
}