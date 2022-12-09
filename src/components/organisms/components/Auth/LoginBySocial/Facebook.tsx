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

function Facebook({ data }: {
    data: { [key: string]: ANY }
}) {

    const [loading, setLoading] = React.useState(false);

    const useAjaxLogin = useAjax();

    const dispatch = useDispatch();

    const urlParam = useQuery({
        state: '',
        code: '',
    });

    const handleOnclickConnect = () => {
        setLoading(true);
        window.location.href = 'https://www.facebook.com/v14.0/dialog/oauth?client_id=821508425507125&scope=email,user_link&redirect_uri=' + window.location.origin + '/auth&state=_facebookConnect';
    }

    React.useEffect(() => {

        if (urlParam.query.state === '_facebookConnect' && urlParam.query.code) {
            handleEmailResponse(urlParam.query.code + '');
        }

    }, [urlParam.query.state]);

    const handleEmailResponse = (token: string) => {
        setLoading(true);

        let dataUpload = {
            ...data,
            loginByFacebook: token,
            redirect_uri: window.location.origin + '/auth',
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
                backgroundColor: '#3B5998',
                color: 'white',
                borderRadius: 1,
                height: 48,
                cursor: 'pointer',
                textTransform: 'unset',
                '& .MuiCircularProgress-root': {
                    color: 'white',
                },
                '&:hover': {
                    backgroundColor: '#3B5998',
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
                <Icon icon='Facebook' />
            </Box>
            {
                !loading &&
                <Typography sx={{ flex: 1 }} align="center" color="white" variant='h5'>{__('Đăng nhập với {{title}}', { title: 'Facebook' })}</Typography>
            }
        </LoadingButton>
    )
}

export default Facebook