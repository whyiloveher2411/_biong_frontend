import { LoadingButton } from '@mui/lab'
import { Box, Typography, useTheme } from '@mui/material'
import Divider from 'components/atoms/Divider'
import FieldForm from 'components/atoms/fields/FieldForm'
import FormWrapper, { FormData } from 'components/atoms/fields/FormWrapper'
import { AuthChildrenProps } from 'components/organisms/Auth'
import Page from 'components/templates/Page'
import { __ } from 'helpers/i18n'
import useAjax from 'hook/useApi'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateAccessToken } from 'store/user/user.reducers'
import LoginBySocial from './LoginBySocial'

function Login({ tabName, handleChangeAuthTab }: AuthChildrenProps) {

    const theme = useTheme();

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
        title={__('Log In')}
        isHeaderSticky
        header={
            <>
                <Typography
                    component="h2"
                    gutterBottom
                    variant="overline"
                >
                    {__('Authentication')}
                </Typography>
                <Typography
                    component="h1"
                    gutterBottom
                    variant="h3"
                >
                    {__('Log In')}
                </Typography>
            </>
        }
    >
        <FormWrapper
            onFinish={handleSubmitForm}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    maxWidth: 500,
                    margin: '0 auto',
                    mt: 6.25,
                }}
            >
                <Typography variant='h2' component='h1'>
                    {__('Log In to Your Account!')}
                </Typography>


                <Divider color='dark' />

                <FieldForm
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
                        title: 'Password',
                        rules: {
                            require: true,
                        }
                    }}
                    name="password"
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <FieldForm
                        component='true_false'
                        config={{
                            title: __('Remember me'),
                            isChecked: true,
                        }}
                        name="remameber_me"
                    />
                    <LoadingButton
                        loading={useAjaxLogin.open}
                        variant='contained'
                        type='submit'
                    >
                        {__('Log In')}
                    </LoadingButton>

                </Box>

                <Divider color='dark'>{__('Or')}</Divider>
                <LoginBySocial />

                <Typography variant='h5' align='center'>
                    {__('or')} <Link style={{ color: theme.palette.link }} to={handleChangeAuthTab(tabName.forgotPassword)}>{__('Forgot Password')}</Link>
                </Typography>

                <Divider color='dark' />

                <Typography variant='h4' align='center'>
                    {__('Don\'t have an account?')} <Link style={{ color: theme.palette.link }} to={handleChangeAuthTab(tabName.signUp)} >{__('Sign up')}</Link>
                </Typography>

            </Box>
        </FormWrapper>
    </Page >
    )
}

export default Login