import { LoadingButton } from '@mui/lab'
import Box from 'components/atoms/Box'
import Icon from 'components/atoms/Icon'
import Typography from 'components/atoms/Typography'
import { __ } from 'helpers/i18n'
import useAjax from 'hook/useApi'
import useQuery from 'hook/useQuery'
import React from 'react'
import { useDispatch } from 'react-redux'
import { updateAccessToken } from 'store/user/user.reducers'

function Github({ data }: {
    data: { [key: string]: ANY }
}) {

    const [loading, setLoading] = React.useState(false);

    const useAjaxLogin = useAjax();

    const dispatch = useDispatch();

    const urlParam = useQuery({
        state: '',
        code: '',
        redirect: '',
    });


    React.useEffect(() => {

        if (urlParam.query.state === '_githubConnect' && urlParam.query.code) {
            handleEmailResponse(urlParam.query.code + '');
        }

    }, []);

    const handleOnclickConnect = () => {
        setLoading(true);
        window.location.href = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=8c162ae795029c924e35&redirect_uri=https://spacedev.vn/auth&state=_githubConnect'
    }

    const handleEmailResponse = (token: string) => {

        setLoading(true);

        let dataUpload = {
            ...data,
            loginByGithub: token,
            redirect_uri: urlParam.query.redirect
        };

        useAjaxLogin.ajax({
            url: '/vn4-account/login',
            data: dataUpload,
            success: (result: { error: boolean, access_token?: string }) => {
                if (!result.error && result.access_token) {
                    dispatch(updateAccessToken(result.access_token));
                } else {
                    urlParam.changeQuery({
                        code: '',
                        state: '',
                        redirect: '',
                    });
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
                backgroundColor: '#6cc644',
                color: 'white',
                borderRadius: 1,
                height: 48,
                cursor: 'pointer',
                textTransform: 'unset',
                '& .MuiCircularProgress-root': {
                    color: 'white',
                },
                '&:hover': {
                    backgroundColor: '#6cc644',
                    opacity: .7,
                }
            }}
            onClick={handleOnclickConnect}
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
                <Icon icon={{
                    custom: '<svg height="24" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="24" data-view-component="true" class="octicon octicon-mark-github v-align-middle"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>'
                }} />
            </Box>
            {
                !loading &&
                <Typography sx={{ flex: 1 }} align="center" color="white" variant='h5'>{__('Đăng nhập với {{title}}', { title: 'Github' })}</Typography>
            }
        </LoadingButton>
    )
}

export default Github