// import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'
// import Divider from 'components/atoms/Divider'
import FieldForm from 'components/atoms/fields/FieldForm'
import FormWrapper, { FormData } from 'components/atoms/fields/FormWrapper'
import { AuthChildrenProps } from 'components/organisms/Auth'
import Page from 'components/templates/Page'
import { __ } from 'helpers/i18n'
import useAjax from 'hook/useApi'
import React from 'react'
import { useDispatch } from 'react-redux'
// import { Link } from 'react-router-dom'
import { updateAccessToken } from 'store/user/user.reducers'
import Google from './LoginBySocial/Google'

function Login({ tabName, handleChangeAuthTab }: AuthChildrenProps) {

    // const theme = useTheme();

    const [data, setData] = React.useState({
        remameber_me: 0,
    });

    const dispatch = useDispatch();

    const useAjaxLogin = useAjax();

    const handleSubmitForm = (data: FormData) => {
        useAjaxLogin.ajax({
            url: '/vn4-account/login',
            data: data,
            success: (result: { error: boolean, access_token?: string }) => {
                if (!result.error && result.access_token) {
                    dispatch(updateAccessToken(result.access_token));
                }
            }
        })
    }

    return (<Page
        title={__('Đăng nhập')}
    >
        <FormWrapper
            onFinish={handleSubmitForm}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 500,
                    margin: '0 auto',
                    mt: 12,
                }}
            >
                <Typography variant='h2' component='h1' sx={{ pb: 1 }}>
                    {__('Đăng ký / Đăng nhập')}
                </Typography>

                {/* <FieldForm
                    component='email'
                    config={{
                        title: 'Email',
                        rules: {
                            require: true,
                        }
                    }}
                    name="email"
                />
                <FieldForm
                    component='password'
                    config={{
                        title: __('Mật khẩu'),
                        rules: {
                            require: true,
                        }
                    }}
                    name="password"
                /> */}
                {/* <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                > */}
                <Box>
                    <FieldForm
                        component='true_false'
                        config={{
                            title: __('Duy trì đăng nhập'),
                            isChecked: true,
                        }}
                        name="remameber_me"
                        onReview={(value) => {
                            setData({
                                remameber_me: value ? 1 : 0
                            });
                        }}
                    />
                    <Typography sx={{ fontSize: 14 }}>
                        {__('Lưu lại thông tin đăng nhập và bạn không cần đăng nhập ở các lần truy cập sau.')}
                    </Typography>
                </Box>
                {/* <LoadingButton
                        loading={useAjaxLogin.open}
                        variant='contained'
                        type='submit'
                    >
                        {__('Đăng nhập')}
                    </LoadingButton> */}

                {/* </Box> */}

                {/* <Divider color='dark'>{__('Hoặc')}</Divider> */}

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Google data={{ ...data }} />
                </Box>

                {/* <Typography variant='h5' align='center'>
                    {__('Hoặc')} <Link style={{ color: theme.palette.link }} to={handleChangeAuthTab(tabName.forgotPassword)}>{__('Quên mật khẩu')}</Link>
                </Typography>

                <Divider color='dark' />

                <Typography variant='h4' align='center'>
                    {__('Bạn chưa có tài khoản?')} <Link style={{ color: theme.palette.link }} to={handleChangeAuthTab(tabName.signUp)} >{__('Đăng ký')}</Link>
                </Typography> */}

            </Box>
        </FormWrapper>
    </Page >
    )
}

export default Login