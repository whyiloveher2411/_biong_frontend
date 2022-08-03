import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon'
import { __ } from 'helpers/i18n'
import useAjax from 'hook/useApi'
import { useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
import { ConnectionProps } from 'services/accountService'
import { RootState } from 'store/configureStore'

function Facebook({ connections, onLoadData }: {
    connections: {
        [key: string]: ConnectionProps
    } | null,
    onLoadData: () => void,
}) {
    const user = useSelector((state: RootState) => state.user);
    const useAjaxLogin = useAjax();
    // const navigate = useNavigate();

    const handleOnclickConnect = () => {
        window.location.href = 'https://www.facebook.com/v14.0/dialog/oauth?client_id=821508425507125&scope=email,user_link&redirect_uri=' + window.location.origin + '/connect&state=' + user.id + '_facebookConnect';
    }

    const handleCancelConnection = () => {
        if (connections !== null && connections.Facebook) {
            useAjaxLogin.ajax({
                url: '/vn4-account/me/cancel-connect-social',
                data: {
                    id: connections.Facebook.id_social
                },
                success: (result: { success: boolean }) => {
                    if (result.success) {
                        onLoadData();
                    }
                },
            })
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 3,
                justifyContent: 'space-between',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                <Icon icon={{ custom: '<svg viewBox="0 0 36 36" class="a8c37x1j ms05siws l3qrxjdp b7h9ocf4" fill="url(#jsc_s_a)" height="24" width="24"><defs><linearGradient x1="50%" x2="50%" y1="97.0782153%" y2="0%" id="jsc_s_a"><stop offset="0%" stop-color="#0062E0"></stop><stop offset="100%" stop-color="#19AFFF"></stop></linearGradient></defs><path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z"></path><path  fill="white" d="M25 23l.8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"></path></svg>' }} />
                <Typography variant='subtitle1'>Facebook</Typography>
                {
                    Boolean(connections !== null && connections.Facebook) &&
                    <> - <Typography variant='body2'>{connections?.Facebook.title}</Typography></>
                }
            </Box>
            {
                connections !== null && connections.Facebook ?
                    <LoadingButton
                        variant='outlined'
                        loading={useAjaxLogin.open}
                        onClick={handleCancelConnection}
                    >
                        {__('Cancel connection')}
                    </LoadingButton>
                    :
                    <LoadingButton
                        variant='outlined'
                        onClick={handleOnclickConnect}
                        loading={useAjaxLogin.open}
                    >
                        {__('Connect')}
                    </LoadingButton>
            }
        </Box>
    )
}

export default Facebook