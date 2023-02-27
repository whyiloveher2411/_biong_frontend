import { Box, CircularProgress, Typography } from '@mui/material';
import Page from 'components/templates/Page';
import { __ } from 'helpers/i18n';
import { getParamsFromUrl } from 'helpers/url';
import useAjax from 'hook/useApi';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'store/configureStore';

function Connect() {
    const useAjaxLogin = useAjax();

    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    // React.useEffect(() => {
    //     const redirect = getParamsFromUrl(window.location.href, 'redirect');
    //     const params = getParamsFromUrl(window.location.href);
    //     navigate(redirect + '?' + params);
    // }, []);

    React.useEffect(() => {
        if (user.id) {
            const redirect = getParamsFromUrl(window.location.href, 'redirect');
            const params = getParamsFromUrl(window.location.href);
            if (redirect) {
                navigate(redirect + '?' + params);
            } else {

                const state = getParamsFromUrl(window.location.href, 'state');
                const code = getParamsFromUrl(window.location.href, 'code');
                // const redirect = getParamsFromUrl(window.location.href, 'redirect');

                if (state === user.id + '_microsoftConnect' && code) {
                    useAjaxLogin.ajax({
                        url: '/vn4-account/me/connect-microsoft',
                        data: {
                            access_token: code,
                            redirect: window.location.origin + window.location.pathname,
                            scope: 'https://graph.microsoft.com/mail.read',
                            code_challenge: user.id + '_' + user.slug + '_https://login.microsoftonline.com',
                        },
                        success: (result: { success: boolean }) => {
                            if (result.success) {
                                //
                            }
                        },
                        finally: () => {
                            navigate('/user/' + user.slug + '/edit-profile/social-network');
                        }
                    })
                } else if (state === user.id + '_facebookConnect' && code) {
                    useAjaxLogin.ajax({
                        url: '/vn4-account/me/connect-facebook',
                        data: {
                            access_token: code,
                            redirect_uri: window.location.origin + window.location.pathname,
                        },
                        success: (result: { success: boolean }) => {
                            if (result.success) {
                                //
                            }
                        },
                        finally: () => {
                            navigate('/user/' + user.slug + '/edit-profile/social-network');
                        }
                    })
                }

            }
        } else {
            navigate('/');
        }

    }, []);


    return (
        <Page
            title={__('Connecting')}
            description='Từ việc học kiến thức mới đến tìm kiếm công việc, khởi nghiệp hoặc phát triển kinh doanh, hãy chọn lộ trình học tập phù hợp với ước mơ của bạn và bắt đầu chuyến hành trình thành công của bạn.'
            image='https://spacedev.vn/images/share-fb-540x282-2.jpg'
        >
            <Box
                sx={{
                    height: '100%',
                    minHeight: 350,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <CircularProgress />
                <Typography variant="h2">{__('Connecting...')}</Typography>
            </Box>
        </Page>
    )
}

export default Connect