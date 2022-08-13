import { Box, Button, Typography, useTheme } from '@mui/material'
import Divider from 'components/atoms/Divider';
import FieldForm from 'components/atoms/fields/FieldForm'
import { AuthChildrenProps } from 'components/organisms/Auth';
import Page from 'components/templates/Page'
import { __ } from 'helpers/i18n'
import React from 'react';
import { Link } from 'react-router-dom';

function SignIn({ tabName, handleChangeAuthTab }: AuthChildrenProps) {

    const theme = useTheme();

    const [post, setPost] = React.useState({
        email: '',
    });

    return (<Page
        title={__('Forgot Password')}
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
                {__('Forgot Password')}
            </Typography>
            <Divider color='dark' />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    mb: 3,
                }}
            >
                <Typography align='center'>
                    {__('Please enter your email address below and we will send you a link to reset your password.')}
                </Typography>
                <FieldForm
                    component='email'
                    config={{
                        title: 'Email',
                    }}
                    post={post}
                    name="email"
                    onReview={(value) => {
                        setPost(prevValue => ({
                            ...prevValue,
                            email: value
                        }))
                    }}

                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <Button
                        variant='contained'
                        onClick={() => {
                            //
                        }}
                    >
                        {__('Forgot Password')}
                    </Button>

                    <Typography>
                        {__('or')} <Link to={handleChangeAuthTab(tabName.logIn)} style={{ color: theme.palette.link }} >Log In</Link>.
                    </Typography>
                </Box>
            </Box>
        </Box>
    </Page>
    )
}

export default SignIn