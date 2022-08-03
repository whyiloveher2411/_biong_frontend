import { Box, Button, Card, CardActions, CardContent, Grid, Link, Paper, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material'
import Divider from 'components/atoms/Divider';
import FieldForm from 'components/atoms/fields/FieldForm'
import FormWrapper, { FormData } from 'components/atoms/fields/FormWrapper';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { __ } from 'helpers/i18n'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import accountService from 'services/accountService';
import { RootState } from 'store/configureStore';
import { logout } from 'store/user/user.reducers';

function Password() {

    const user = useSelector((state: RootState) => state.user);

    // const [post, setPost] = React.useState<{
    //     pass_current: string,
    //     pass_new: string,
    //     pass_confirm: string,
    // }>({
    //     pass_current: '',
    //     pass_new: '',
    //     pass_confirm: '',
    // });

    const [isSetupTwoFactor, setIsSetupTwoFactor] = React.useState(false);

    const dispatch = useDispatch();


    const [post, setPost] = React.useState<{
        [key: string]: ANY
    }>({
        is_private_account: false,
        active_two_factor_authen: false,
        active_course_sharing: false,
        google_authenticator_secret: '',
        google_authenticator_secret_image: '',
    });

    const handleSubmit = (data: FormData) => {

        (async () => {
            let result = await accountService.updatePassword(data.pass_current, data.pass_new, data.pass_confirm);

            if (result) {
                dispatch(logout());
            }

        })()
    }


    React.useEffect(() => {

        let data = accountService.getInfoSecurity();

        let randomsecret = accountService.getRandomGoogleAuthenticatorSecret('RANDOM_SECRET');

        Promise.all([data, randomsecret]).then(([data, randomsecret]) => {

            if (data) {
                setPost({
                    ...data,
                    google_authenticator_secret_image: randomsecret?.qrCodeUrl ?? '',
                });
            }

        });
    }, []);


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}
        >


            <FormWrapper
                onFinish={handleSubmit}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    <Card>
                        {/* <DraftEditor /> */}
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            <Typography gutterBottom variant="h5" component="div" sx={{ mb: 1 }}>
                                {__('Password')}
                            </Typography>

                            {
                                !user.first_change_password &&
                                <FieldForm
                                    component='password'
                                    config={{
                                        title: 'Password current',
                                        rules: {
                                            require: true,
                                        }
                                    }}
                                    name="pass_current"
                                />
                            }

                            <FieldForm
                                component='password'
                                config={{
                                    title: 'New Password',
                                    generator: true,
                                    rules: {
                                        require: true,
                                        minLength: 8,
                                        maxLength: 30,
                                        requireNumber: 1,
                                        requireLowercase: 1,
                                        requireUppercase: 1,
                                        requireNonAlphanumericCharacters: 2,
                                    },
                                }}
                                name="pass_new"
                            />

                            <FieldForm
                                component='password'
                                config={{
                                    title: 'Confirm Password',
                                    rules: {
                                        require: true,
                                        equal: {
                                            type: 'field',
                                            value: 'pass_new',
                                            message: __('Xác nhận mật khẩu không giống mật khẩu mới'),
                                        }
                                    },
                                }}
                                name="pass_confirm"
                            />
                        </CardContent>
                        <Divider color="dark" />
                        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }} >
                            <Button type='submit' color='success' variant='contained'>{__('Save Change')}</Button>
                        </CardActions>

                    </Card>
                </Box>
            </FormWrapper>
            <Card>
                <Typography gutterBottom variant="h5" component="div" sx={{ p: 3, pb: 1, width: '100%' }}>
                    {__('Two-factor authentication')}
                </Typography>
                <Divider />
                <CardContent
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: 2,
                        mt: 3,
                    }}
                >
                    {
                        isSetupTwoFactor ?
                            <TwoFactorSetup secretKey={post.google_authenticator_secret} imageQRCode={post.google_authenticator_secret_image} onBack={() => setIsSetupTwoFactor(false)} />
                            :
                            <>
                                <Typography variant="h2" align='center' >
                                    {__('Two factor authentication is not enabled yet.')}
                                </Typography>
                                <Typography align='center' >
                                    {__('Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.')}
                                </Typography>
                                <Button onClick={() => setIsSetupTwoFactor(true)} variant="contained">
                                    {__('Enable two-factor authentication')}
                                </Button>
                                <Link>{__('Learn more')}</Link>
                            </>
                    }
                </CardContent>
            </Card>
        </Box>
    )
}

export default Password



function TwoFactorSetup({ onBack, secretKey, imageQRCode }: { onBack: () => void, secretKey: string, imageQRCode: string }) {
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleOnSubmitVerification = async (post: FormData) => {
        const isVerifi = await accountService.submitVerifyTwoFactor(secretKey, post.six_digit_code);

        if (isVerifi) {
            //
        } else {
            //
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} orientation="vertical">

                <Step>
                    <StepLabel>
                        {__('Two-factor authentication')}
                    </StepLabel>
                    <StepContent>
                        <Typography>{__('Download and install the Authenticator app')}</Typography>

                        <Grid
                            container
                            sx={{
                                mt: 3,
                                mb: 3,
                                maxWidth: 640,
                            }}
                        >
                            <Grid
                                item
                                xs
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <ImageLazyLoading
                                    src='/images/google_authenticator.png'
                                    sx={{
                                        width: 100,
                                        height: 100,
                                    }}
                                />
                                <Typography align='center' variant='subtitle1'>Google Authenticator</Typography>
                                <Link href='https://support.google.com/accounts/answer/1066447?hl=en&co=GENIE.Platform%3DAndroid' target='_blank'>{__('How to setup Google Authenticator')}</Link>
                            </Grid>
                            <Divider orientation="vertical" flexItem>
                                {__('OR')}
                            </Divider>
                            <Grid
                                item
                                xs
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <ImageLazyLoading
                                    src='/images/microsoft-authenticator.svg'
                                    sx={{
                                        width: 100,
                                        height: 100,
                                    }}
                                />
                                <Typography align='center' variant='subtitle1'>Microsoft Authenticator</Typography>
                                <Link href='https://support.microsoft.com/en-us/account-billing/set-up-the-microsoft-authenticator-app-as-your-verification-method-33452159-6af9-438f-8f82-63ce94cf3d29' target='_blank'>{__('How to setup Microsoft Authenticator')}</Link>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography align='center' variant='h4' sx={{ mt: 2 }}>{__('Or any other Authenticator app')}</Typography>
                            </Grid>
                        </Grid>

                        <Box sx={{ mb: 2 }}>
                            <div>
                                <Button
                                    sx={{ mt: 1, mr: 1 }}
                                    disabled
                                >
                                    {__('Back')}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    {__('Continue')}
                                </Button>

                            </div>
                        </Box>
                    </StepContent>
                </Step>



                <Step>
                    <StepLabel>
                        {__('Authentication verification')}
                    </StepLabel>
                    <StepContent>
                        <FormWrapper
                            onFinish={handleOnSubmitVerification}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    mb: 2,
                                }}
                            >
                                <Typography >{__('Scan this QR code in the Authenticator app')}</Typography>
                                <ImageLazyLoading
                                    sx={{
                                        width: 180,
                                        height: 180,
                                    }}
                                    src={imageQRCode}
                                />
                                <Typography variant='h2' sx={{ textTransform: 'uppercase' }}>{secretKey}</Typography>
                                <Typography variant='body2'>{__('If you are unable to scan the QR code, please enter this code manually into the app.')}</Typography>

                                <Divider sx={{ mt: 2 }} />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                        mt: 2,
                                    }}
                                >
                                    <Typography variant='h5'>{__('Enter the code from the application')}</Typography>
                                    <Typography>{__('After scanning the QR code image, the app will display a code that you can enter below.')}</Typography>

                                    <Box
                                        sx={{ maxWidth: 300 }}
                                    >
                                        <FieldForm
                                            component='number'
                                            config={{
                                                title: __('6-digit code'),
                                                rules: {
                                                    require: true,
                                                    length: 6,
                                                },
                                                inputProps: {
                                                    placeholder: __('6-digit code')
                                                }
                                            }}
                                            name="six_digit_code"
                                        />
                                    </Box>
                                </Box>

                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <div>
                                    <Button
                                        sx={{ mt: 1, mr: 1 }}
                                        color="inherit"
                                        onClick={handleBack}
                                    >
                                        {__('Back')}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        type='submit'
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {__('Continue')}
                                    </Button>

                                </div>
                            </Box>
                        </FormWrapper>
                    </StepContent>
                </Step>

            </Stepper>
            {activeStep === 4 && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    );
}