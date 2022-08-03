import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon'
import { __ } from 'helpers/i18n'
import { getParamsFromUrl } from 'helpers/url'
import useAjax from 'hook/useApi'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ConnectionProps } from 'services/accountService'
import { RootState } from 'store/configureStore'

function LinkedIn({ connections, onLoadData }: {
    connections: {
        [key: string]: ConnectionProps
    } | null,
    onLoadData: () => void,
}) {
    const useAjaxLogin = useAjax();

    const user = useSelector((state: RootState) => state.user);

    const navigate = useNavigate();

    const handleOnclickConnect = () => {
        window.location.href = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77gh015eehkbdm&redirect_uri=' + window.location.origin + '/connect%3Fredirect=' + window.location.pathname + '&state=' + user.id + '_linkedInConnect&scope=r_liteprofile%20r_emailaddress'
    }

    const handleCancelConnection = () => {
        if (connections !== null && connections.LinkedIn) {
            useAjaxLogin.ajax({
                url: '/vn4-account/me/cancel-connect-social',
                data: {
                    id: connections.LinkedIn.id_social
                },
                success: (result: { success: boolean }) => {
                    if (result.success) {
                        onLoadData();
                    }
                },
            })
        }
    }

    React.useEffect(() => {
        const state = getParamsFromUrl(window.location.href, 'state');
        const code = getParamsFromUrl(window.location.href, 'code');
        const redirect = getParamsFromUrl(window.location.href, 'redirect');

        if (state === user.id + '_linkedInConnect' && code) {
            useAjaxLogin.ajax({
                url: '/vn4-account/me/connect-linkedin',
                data: {
                    access_token: code,
                    redirect_uri: window.location.origin + '/connect%3Fredirect=' + window.location.pathname,
                },
                success: (result: { success: boolean }) => {
                    if (result.success) {
                        onLoadData();
                    }
                },
                finally: () => {
                    navigate(redirect);
                }
            })
        }

    }, []);

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
                <Icon icon={{
                    custom: '<svg style="color:#0a66c2;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="mercado-match" width="24" height="24" focusable="false"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path></svg>'
                }} />
                <Typography variant='subtitle1'>LinkedIn</Typography>
                {
                    Boolean(connections !== null && connections.LinkedIn) &&
                    <> - <Typography variant='body2'>{connections?.LinkedIn.title}</Typography></>
                }
            </Box>
            {
                connections !== null && connections.LinkedIn ?
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

export default LinkedIn