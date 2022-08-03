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

function Github({ connections, onLoadData }: {
    connections: {
        [key: string]: ConnectionProps
    } | null,
    onLoadData: () => void,
}) {
    const user = useSelector((state: RootState) => state.user);
    const useAjaxLogin = useAjax();
    const navigate = useNavigate();

    const handleOnclickConnect = () => {
        window.location.href = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=8c162ae795029c924e35&redirect_uri=' + window.location.href + '&redirect=' + window.location.pathname + '&state=' + user.id + '_githubConnect'
    }

    const handleCancelConnection = () => {
        if (connections !== null && connections.Github) {
            useAjaxLogin.ajax({
                url: '/vn4-account/me/cancel-connect-social',
                data: {
                    id: connections.Github.id_social
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

        if (state === user.id + '_githubConnect' && code) {
            useAjaxLogin.ajax({
                url: '/vn4-account/me/connect-github',
                data: {
                    access_token: code,
                    redirect_uri: window.location.origin + redirect,
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
                    custom: '<svg height="24" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="24" data-view-component="true" class="octicon octicon-mark-github v-align-middle"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>'
                }} />
                <Typography variant='subtitle1'>Github</Typography>
                {
                    Boolean(connections !== null && connections.Github) &&
                    <> - <Typography variant='body2'>{connections?.Github.title}</Typography></>
                }
            </Box>
            {
                connections !== null && connections.Github ?
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

export default Github