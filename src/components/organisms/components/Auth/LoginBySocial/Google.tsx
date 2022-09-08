import { LoadingButton } from '@mui/lab'
import Box from 'components/atoms/Box'
import Icon from 'components/atoms/Icon'
import Typography from 'components/atoms/Typography'
import { __ } from 'helpers/i18n'
import { addScript } from 'helpers/script'
import useAjax from 'hook/useApi'
import React from 'react'
import { useDispatch } from 'react-redux'
import { updateAccessToken } from 'store/user/user.reducers'

function Google({ data }: {
    data: { [key: string]: ANY }
}) {

    const [loading, setLoading] = React.useState(false);

    const useAjaxLogin = useAjax();

    const dispatch = useDispatch();

    React.useEffect(() => {

        addScript('https://apis.google.com/js/platform.js', 'apis_google_com_platform', () => {

            window.gapi.load('auth2', function () {
                let auth2 = window.gapi.auth2.init({
                    client_id: '1026939504367-e6cnkb7fu63jcbo9vukn699hunnccsdg.apps.googleusercontent.com',
                    cookiepolicy: 'single_host_origin',
                    scope: 'email',
                    plugin_name: "MyCourse",
                });

                let element = document.getElementById('login_by_google');

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

        }, 500);


    }, []);

    const handleEmailResponse = (token: string) => {
        setLoading(true);

        let dataUpload = {
            loginByGoogle: token,
        };

        if (window.__data_login_by_google) {
            dataUpload = {
                ...dataUpload,
                ...window.__data_login_by_google,
            }
        }

        useAjaxLogin.ajax({
            url: '/vn4-account/login',
            data: dataUpload,
            success: (result: { error: boolean, access_token?: string }) => {
                if (!result.error && result.access_token) {
                    dispatch(updateAccessToken(result.access_token));
                }
            },
            finally: () => {
                setLoading(false);
            }
        })
    };

    React.useEffect(() => {
        window.__data_login_by_google = data;

        return () => {

            if (window.__data_login_by_google) {
                delete window.__data_login_by_google;
            }
        };

    }, [data]);

    return (
        <LoadingButton
            size="large"
            loading={loading}
            sx={{
                display: 'flex',
                backgroundColor: '#DB4437',
                color: 'white',
                borderRadius: 1,
                height: 48,
                cursor: 'pointer',
                textTransform: 'unset',
                '& .MuiCircularProgress-root': {
                    color: 'white',
                },
                '&:hover': {
                    backgroundColor: '#DB4437',
                    opacity: .7,
                }
            }}
            id="login_by_google"
        >
            <Box
                sx={{
                    position: 'absolute',
                    left: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                }}
            >
                <Icon icon='Google' />
            </Box>
            {
                !loading &&
                <Typography sx={{ flex: 1 }} align="center" color="white" variant='h5'>{__('Đăng nhập với {{title}}', { title: 'Google' })}</Typography>
            }
            {/* {
                !loadings[item.id] &&
                <Typography sx={{ flex: 1 }} align="center" color="white" variant='h5'>{__('Sign in with {{title}}', { title: item.title })}</Typography>
            } */}
        </LoadingButton>
    )
}

export default Google