import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon'
import { __ } from 'helpers/i18n'
import useAjax from 'hook/useApi'
import { useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
import { ConnectionProps } from 'services/accountService'
import { RootState } from 'store/configureStore'

function Twitter({ connections, onLoadData }: {
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
        if (connections !== null && connections.Twitter) {
            useAjaxLogin.ajax({
                url: '/vn4-account/me/cancel-connect-social',
                data: {
                    id: connections.Twitter.id_social
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
                <Icon icon={{ custom: '<svg viewBox="0 0 24 24" aria-hidden="true" class="r-1cvl2hr r-4qtqp9 r-yyyyoo r-16y2uox r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp"><g><path style="color: rgb(29, 155, 240);" d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg>' }} />
                <Typography variant='subtitle1'>Twitter</Typography>
                {
                    Boolean(connections !== null && connections.Twitter) &&
                    <> - <Typography variant='body2'>{connections?.Twitter.title}</Typography></>
                }
            </Box>
            {
                connections !== null && connections.Twitter ?
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

export default Twitter