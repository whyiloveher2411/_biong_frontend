import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';
import { addScript } from 'helpers/script';
import { getUrlParams } from "helpers/url";
import useAjax from 'hook/useApi';
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateAccessToken } from 'store/user/user.reducers';

function LoginBySocial() {

    const useAjaxLogin = useAjax();

    const [loadings, setLoadings] = React.useState<{ [key: string]: boolean }>({});

    const dispatch = useDispatch();

    React.useEffect(() => {

        const stateLogin = getUrlParams(window.location.search, {
            code: 0,
            state: 0
        });

        if (stateLogin.state === 'linkedInLogin' && stateLogin.code) {
            handleLoginBylinkedIn(stateLogin.code + '');
        }

        if (stateLogin.state === 'githubLogin' && stateLogin.code) {
            handleLoginByGithub(stateLogin.code + '');
        }

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

        addScript('https://alcdn.msftauth.net/lib/1.2.1/js/msal.js', 'apis_microsoft_authen', () => {
            //
        }, 500);

    }, []);

    const handleEmailResponse = (token: string) => {
        setLoadings(prev => ({ ...prev, login_by_google: true }));
        useAjaxLogin.ajax({
            url: '/vn4-account/login',
            data: {
                loginByGoogle: token
            },
            success: (result: { error: boolean, access_token?: string }) => {
                if (!result.error && result.access_token) {
                    dispatch(updateAccessToken(result.access_token));
                }
            },
            finally: () => {
                setLoadings(prev => ({ ...prev, login_by_google: false }));
            }
        })
    };

    const handleOnClickButton = (id: string) => () => {
        if (id === 'login_by_linkedIn') {
            window.location.href = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77gh015eehkbdm&redirect_uri=http://localhost:3033/auth&state=linkedInLogin&scope=r_liteprofile%20r_emailaddress'
        } else if (id === 'login_by_gitHub') {
            window.location.href = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=8c162ae795029c924e35&redirect_uri=http://localhost:3033/auth&state=githubLogin'
        } else if (id === 'login_by_microsoft') {
            handleOnClickButtonMicrosoft()
        }
    }

    const handleLoginBylinkedIn = (code: string) => {
        setLoadings(prev => ({ ...prev, login_by_linkedIn: true }));
        useAjaxLogin.ajax({
            url: '/vn4-account/login',
            data: {
                loginBylinkedIn: code
            },
            success: (result: { error: boolean, access_token?: string }) => {
                if (!result.error && result.access_token) {
                    dispatch(updateAccessToken(result.access_token));
                }
            },
            finally: () => {
                setLoadings(prev => ({ ...prev, login_by_linkedIn: false }));
            }
        })
    }

    const handleLoginByGithub = (code: string) => {
        setLoadings(prev => ({ ...prev, login_by_gitHub: true }));
        useAjaxLogin.ajax({
            url: '/vn4-account/login',
            data: {
                loginByGithub: code
            },
            success: (result: { error: boolean, access_token?: string }) => {
                if (!result.error && result.access_token) {
                    dispatch(updateAccessToken(result.access_token));
                }
            },
            finally: () => {
                setLoadings(prev => ({ ...prev, login_by_gitHub: false }));
            }
        })
    }

    const handleOnClickButtonMicrosoft = () => {
        const msalConfig = {
            auth: {
                clientId: 'c3bf4a3b-74f9-4193-9076-da84cc314ff9',
                authority: 'https://login.microsoftonline.com/common',
                redirectUri: 'http://localhost:3033/auth',
                scopes: ["openid", "profile", "User.Read"],
            },
            cache: {
                cacheLocation: 'sessionStorage', // This configures where your cache will be stored
                storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
            },
        }

        const myMSALObj = new window.Msal.UserAgentApplication(msalConfig)

        const loginRequest = {
            scopes: ["openid", "profile", "User.Read"],
        }

        myMSALObj.acquireTokenPopup(loginRequest).then((loginResponse: JsonFormat) => {
            console.log(loginResponse);
            setLoadings(prev => ({ ...prev, login_by_microsoft: true }));
            useAjaxLogin.ajax({
                url: '/vn4-account/login',
                data: {
                    loginByMicrosoft: loginResponse.accessToken
                },
                success: (result: { error: boolean, access_token?: string }) => {
                    if (!result.error && result.access_token) {
                        dispatch(updateAccessToken(result.access_token));
                    }
                },
                finally: () => {
                    setLoadings(prev => ({ ...prev, login_by_microsoft: false }));
                }
            })
        }).catch(function (error: ANY) {
            console.log(error)
        })
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            {
                [
                    {
                        title: 'Google',
                        color: '#DB4437',
                        icon: 'Google',
                        id: 'login_by_google',
                    },
                    {
                        title: 'LinkedIn',
                        color: '#0A66C2',
                        icon: 'LinkedIn',
                        id: 'login_by_linkedIn',
                    },
                    {
                        title: 'Github',
                        color: '#6cc644',
                        icon: 'GitHub',
                        id: 'login_by_gitHub',
                    },
                    {
                        title: 'Microsoft',
                        color: '#F25022',
                        icon: { custom: '<image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEXz8/PzUyWBvAYFpvD/ugjz9fb19Pbz+fr39fr69vPy9foAofD/tgDzRQB9ugAAo/Df6dCv0Xjz2dPzTBfzl4PznImz04CAx/H60oHS5vJ5xPH60Hn16dIAnvDz7u3z4t7n7dzzNADzkXurz3BwtQDzvrLM36zf6/Os2PL336z07d/7z3RN8WfWAAABg0lEQVR4nO3cyVLCYBCFURwCkXlygDBFUBTf//3cSGIVf5WrDi7O9wJdp3p/Wy1JkvSrLLzqVDu8FHAzjW57JrZ34+hSH5yWg9jK187PrXx/GMZ2GF9+MZsObmKbzSvhZHgb25CQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCwUWE5i21QC/fB86Xp/dLt/DG4t/MGbf7+FNxkl9jZzTrR1TvCeXjJIWFJkv7uIbzqVDe8LAE8Lp+D+zgTu5/FS2zFKUFcrEex9ZaV8Ksf3Sol7N3FNqqFRf8+NkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQsJmhetebOtr75dmi+iO1anTKrrNJbDRsvCuDJQk6Z/1DSzvYqEfRCNJAAAAAElFTkSuQmCC"  height="24" width="24" />' },
                        id: 'login_by_microsoft'
                    },
                    // {
                    //     title: 'Facebook',
                    //     color: '#3B5998',
                    //     icon: 'Facebook',
                    //     id: 'login_by_facebook',
                    // },
                    // {
                    //     title: 'Twitter',
                    //     color: '#55ACEE',
                    //     icon: 'Twitter',
                    //     id: 'login_by_twitter',
                    // },
                ].map((item, index) => (
                    <LoadingButton
                        key={index}
                        size="large"
                        loading={loadings[item.id]}
                        onClick={handleOnClickButton(item.id)}
                        sx={{
                            display: 'flex',
                            backgroundColor: item.color,
                            color: 'white',
                            borderRadius: 1,
                            height: 48,
                            cursor: 'pointer',
                            textTransform: 'unset',
                            '& .MuiCircularProgress-root': {
                                color: 'white',
                            },
                            '&:hover': {
                                backgroundColor: item.color,
                                opacity: .7,
                            }
                        }}
                        id={item.id}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 48,
                                opacity: loadings[item.id] ? 0 : 1,
                            }}
                        >
                            <Icon icon={item.icon} />
                        </Box>
                        {
                            !loadings[item.id] &&
                            <Typography sx={{ flex: 1 }} align="center" color="white" variant='h5'>{__('Sign in with {{title}}', { title: item.title })}</Typography>
                        }
                    </LoadingButton>
                    // <Box
                    //     key={index}
                    //     sx={{
                    //         display: 'flex',
                    //         background: item.color,
                    //         color: 'white',
                    //         borderRadius: 1,
                    //         cursor: 'pointer',
                    //         '&:hover': {
                    //             opacity: .7,
                    //         }
                    //     }}
                    //     id={item.id}
                    // >
                    //     <Box
                    //         sx={{
                    //             display: 'flex',
                    //             alignItems: 'center',
                    //             justifyContent: 'center',
                    //             width: 48,
                    //             height: 48
                    //         }}
                    //     >
                    //         <Icon icon={item.icon} />
                    //     </Box>
                    //     <Typography sx={{ lineHeight: '48px', flex: 1 }} align="center" color="white" variant='h5'>{__('Continue with {{title}}', { title: item.title })}</Typography>
                    // </Box>
                ))
            }

        </Box>
    )
}

export default LoginBySocial