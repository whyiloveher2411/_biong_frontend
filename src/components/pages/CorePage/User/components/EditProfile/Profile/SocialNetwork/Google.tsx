import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon'
import { __ } from 'helpers/i18n'
import { addScript } from 'helpers/script'
import useAjax from 'hook/useApi'
import React from 'react'
import { ConnectionProps } from 'services/accountService'

function Google({ connections, onLoadData }: {
    connections: {
        [key: string]: ConnectionProps
    } | null,
    onLoadData: (callback?: () => void) => void,
}) {

    const useAjaxLogin = useAjax();

    React.useEffect(() => {
        addScript('https://apis.google.com/js/platform.js', 'apis_google_com_platform', () => {
            handleInitGoogleLib();
        }, 500);
    }, []);

    const handleInitGoogleLib = () => {
        window.gapi.load('auth2', function () {
            let auth2 = window.gapi.auth2.init({
                client_id: '1026939504367-e6cnkb7fu63jcbo9vukn699hunnccsdg.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                scope: 'email',
                plugin_name: "MyCourse",
            });

            let element = document.getElementById('connect-google');

            auth2.attachClickHandler(element, { theme: 'dark' },
                function (googleUser: ANY) {

                    handleEmailResponse(googleUser.getAuthResponse().access_token);

                }, function (error: ANY) {
                    //
                },
                function (error: ANY) {
                    //
                }
            );
        });
    }

    const handleEmailResponse = (token: string) => {
        useAjaxLogin.ajax({
            url: '/vn4-account/me/connect-google',
            data: {
                access_token: token
            },
            success: (result: { success: boolean }) => {
                if (result.success) {
                    onLoadData();
                }
            },
        })
    };

    const handleCancelConnection = () => {
        if (connections !== null && connections.Google) {
            useAjaxLogin.ajax({
                url: '/vn4-account/me/cancel-connect-social',
                data: {
                    id: connections.Google.id_social
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
                <Icon icon={{ custom: '<image href="/images/google.png"  height="24" width="24" />' }} />
                <Typography variant='subtitle1'>Google</Typography>
                {
                    Boolean(connections !== null && connections.Google) &&
                    <> - <Typography variant='body2'>{connections?.Google.title}</Typography></>
                }
            </Box>
            <LoadingButton
                variant='outlined'
                loading={useAjaxLogin.open}
                onClick={handleCancelConnection}
                sx={{
                    display: connections !== null && connections.Google ? 'block' : 'none'
                }}
            >
                {__('Cancel connection')}
            </LoadingButton>
            <LoadingButton
                variant='outlined'
                loading={useAjaxLogin.open}
                id="connect-google"
                sx={{
                    display: connections !== null && connections.Google ? 'none' : 'block'
                }}
            >
                {__('Connect')}
            </LoadingButton>

        </Box>
    )
}

export default Google