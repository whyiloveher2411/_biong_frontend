import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon'
import { __ } from 'helpers/i18n'
import useAjax from 'hook/useApi'
import { useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
import { ConnectionProps } from 'services/accountService'
import { RootState } from 'store/configureStore'

function Apple({ connections, onLoadData }: {
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
        if (connections !== null && connections.Apple) {
            useAjaxLogin.ajax({
                url: '/vn4-account/me/cancel-connect-social',
                data: {
                    id: connections.Apple.id_social
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
                <Icon icon="Apple" />
                <Typography variant='subtitle1'>Apple</Typography>
                {
                    Boolean(connections !== null && connections.Apple) &&
                    <> - <Typography variant='body2'>{connections?.Apple.title}</Typography></>
                }
            </Box>
            {
                connections !== null && connections.Apple ?
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

export default Apple