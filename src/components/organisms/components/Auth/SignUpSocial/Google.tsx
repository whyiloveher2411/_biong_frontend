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

function Google() {

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
        useAjaxLogin.ajax({
            url: '/vn4-account/sign-up/by-google',
            data: {
                signUpByGoogle: token
            },
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
                <Typography sx={{ flex: 1 }} align="center" color="white" variant='h5'>{__('Đăng ký với {{title}}', { title: 'Google' })}</Typography>
            }
        </LoadingButton>
    )
}

export default Google