import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import IconBit from 'components/atoms/IconBit';
import React from 'react'
import { useDispatch } from 'react-redux';
import accountService from 'services/accountService';
import { updateBitPoint, useUser } from 'store/user/user.reducers';
import Dialog from './Dialog';

function InfoUseBit({ callback, button, title, description, labelButton, bit, reason }: {
    callback: () => void,
    button: (onOpen: () => void) => React.ReactNode,
    title: string,
    description: string,
    labelButton?: string,
    bit: number,
    reason: string,
}) {

    const [openDialogConfirmHint, setOpenDialogConfirmHint] = React.useState(false);

    const user = useUser();

    const [isLoading, setLoading] = React.useState(false);

    const dispath = useDispatch();

    const handleClick = async () => {

        setLoading(true);

        const minusBit = await accountService.me.game.minusBit(bit, reason);

        if (minusBit.result && minusBit.bit !== undefined) {

            dispath(updateBitPoint(minusBit.bit));

            callback();
        }
        setLoading(false);
        setOpenDialogConfirmHint(false);
    }

    return (<>
        {button(() => setOpenDialogConfirmHint(true))}
        <Dialog
            open={openDialogConfirmHint}
            onClose={() => setOpenDialogConfirmHint(false)}
        >

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    alignItems: 'center',
                    maxWidth: 320,
                    margin: '0 auto',
                    pt: 3,
                    pb: 3,
                }}
            >
                <Icon sx={{ fontSize: 52 }} icon={IconBit} />
                <Typography align='center' variant='h3' >{title}</Typography>
                <Typography variant='h5' align='center' sx={{ color: 'text.secondary', lineHeight: '26px' }}>
                    {description}<br />(Bạn có <Icon sx={{ mb: -1 }} icon={IconBit} /> {user.getBitToString()})
                </Typography>
                <LoadingButton
                    loading={isLoading}
                    variant='outlined'
                    size='large'
                    sx={{
                        width: '100%'
                    }}
                    onClick={handleClick}
                    disabled={user.getBit() < bit}
                >
                    {labelButton ? labelButton : 'Mở khóa với'} <Icon renderVersion={isLoading} sx={{ ml: 1, mr: 1, opacity: isLoading ? 0 : 1 }} icon={IconBit} /> {bit}
                </LoadingButton>
            </Box>
        </Dialog>
    </>
    )
}

export default InfoUseBit