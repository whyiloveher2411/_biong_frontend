import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardActions, CardContent, Grid, Link, Paper, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import FieldForm from 'components/atoms/fields/FieldForm';
import FormWrapper from 'components/atoms/fields/FormWrapper';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { __ } from 'helpers/i18n';
import React from 'react';
import accountService from 'services/accountService';

function Security() {

    const [post, setPost] = React.useState<{
        [key: string]: ANY
    }>({
        is_private_account: false,
        active_two_factor_authen: false,
        active_course_sharing: false,
        google_authenticator_secret: '',
    });

    const [isSetupTwoFactor, setIsSetupTwoFactor] = React.useState(false);

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const handleSubmit = () => {

        setIsLoadingButton(true);
        (async () => {
            await accountService.updateSecurity(post);
            setIsLoadingButton(false);
        })()
    }

    // const randomGoogleAuthenticatorSecret = async () => {

    //     let randomsecret = await accountService.getRandomGoogleAuthenticatorSecret('RANDOM_SECRET');

    //     if (randomsecret && randomsecret.secret) {
    //         setPost(prev => ({
    //             ...prev,
    //             google_authenticator_secret: randomsecret?.secret,
    //             google_authenticator_secret_image: randomsecret?.qrCodeUrl,
    //         }));

    //     }
    // }

    React.useEffect(() => {
        let data = accountService.getInfoSecurity();

        let randomsecret = accountService.getRandomGoogleAuthenticatorSecret('GET');

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
                postDefault={post}
            >
                <Card>
                    {/* <DraftEditor /> */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            p: 3,
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography variant='h6'>{__('Private account')}</Typography>
                            <Typography>{__('When your account is private, people won\'t be able to see what you share')}</Typography>
                        </Box>
                        <Box>
                            <FieldForm
                                component='true_false'
                                config={{
                                    title: false,
                                }}
                                post={post}
                                name="is_private_account"
                                onReview={(value) => {
                                    setPost(prev => ({
                                        ...prev,
                                        is_private_account: value
                                    }));
                                }}
                            />
                        </Box>
                    </Box>
                    <Divider color="dark" />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            p: 3,
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography variant='h6'>{__('Course Sharing')}</Typography>
                            <Typography>{__('Show courses you\'re taking on your profile page')}</Typography>
                        </Box>
                        <Box>
                            <FieldForm
                                component='true_false'
                                config={{
                                    title: false,
                                }}
                                post={post}
                                name="active_course_sharing"
                                onReview={(value) => {
                                    setPost(prev => ({
                                        ...prev,
                                        active_course_sharing: value
                                    }));
                                }}
                            />
                        </Box>
                    </Box>
                    {/* <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            p: 3,
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography variant='h6'>{__('Two-factor Authentication')}</Typography>
                            <Typography>{__('Two-factor authentication is an extra layer of security for your account designed to ensure that you\'re the only person who can access your ')}</Typography>
                        </Box>
                        <Box>
                            <FieldForm
                                component='true_false'
                                config={{
                                    title: false,
                                }}
                                post={post}
                                name="active_two_factor_authen"
                                onReview={async (value) => {

                                    if (value) {
                                        if (!post.google_authenticator_secret) {
                                            let randomsecret = await accountService.getRandomGoogleAuthenticatorSecret('RANDOM_SECRET');

                                            if (randomsecret) {
                                                setPost(prev => ({
                                                    ...prev,
                                                    active_two_factor_authen: value,
                                                    google_authenticator_secret: randomsecret?.secret,
                                                    google_authenticator_secret_image: randomsecret?.qrCodeUrl,
                                                }));

                                                return;
                                            }
                                        }
                                    }

                                    setPost(prev => ({
                                        ...prev,
                                        active_two_factor_authen: value
                                    }));
                                }}
                            />
                        </Box>
                    </Box>
                    <Collapse
                        in={Boolean(post.active_two_factor_authen)}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                p: 3,
                                pt: 0,
                                gap: 2,
                            }}
                        >
                            <FieldForm
                                component='text'
                                config={{
                                    title: __('Google Authenticator Secret'),
                                    inputProps: {
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton
                                                aria-label="random Google Authenticator Secret"
                                                edge="end"
                                                onClick={randomGoogleAuthenticatorSecret}
                                                onMouseDown={(e) => { e.preventDefault(); }}
                                            >
                                                <Icon icon="Refresh" />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                }}
                                post={post}
                                name="google_authenticator_secret"
                                onReview={(value) => {
                                    setPost(prev => ({
                                        ...prev,
                                        google_authenticator_secret: value
                                    }));
                                }}
                            />

                            <ImageLazyLoading
                                sx={{
                                    width: 180,
                                    height: 180,
                                }}
                                src={post.google_authenticator_secret_image}
                            />
                        </Box>
                    </Collapse> */}
                    <Divider color="dark" />
                    <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }} >
                        <LoadingButton onClick={handleSubmit} loading={isLoadingButton} loadingPosition="center" color='success' variant='contained'>{__('Save Change')}</LoadingButton>
                    </CardActions>
                </Card>
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
                            <TwoFactorSetup qrCode={post.google_authenticator_secret} imageQRCode={post.google_authenticator_secret_image} onBack={() => setIsSetupTwoFactor(false)} />
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
        </Box >
    )
}

export default Security

function TwoFactorSetup({ onBack, qrCode, imageQRCode }: { onBack: () => void, qrCode: string, imageQRCode: string }) {
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
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                mb: 3,
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
                            <Typography variant='h2' sx={{ textTransform: 'uppercase' }}>{qrCode}</Typography>
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
                                <FormWrapper>
                                    <Box
                                        sx={{ maxWidth: 300 }}
                                    >
                                        <FieldForm
                                            component='number'
                                            config={{
                                                title: __('6-digit code'),
                                                rules: {
                                                    require: true,
                                                    maxLength: 6,
                                                },
                                                inputProps: {
                                                    placeholder: __('6-digit code')
                                                }
                                            }}
                                            name="six_digit_code"
                                        />
                                    </Box>
                                </FormWrapper>
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
                        {__('Scan QR Code')}
                    </StepLabel>
                    <StepContent>
                        <Typography >{__('Scan this QR code in the Authenticator app')}</Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                mt: 3,
                                mb: 3,

                            }}
                        >
                            <ImageLazyLoading
                                sx={{
                                    width: 180,
                                    height: 180,
                                }}
                                src={imageQRCode}
                            />
                            <Typography variant='h2' sx={{ textTransform: 'uppercase' }}>{qrCode}</Typography>
                            <Typography>{__('If you are unable to scan the QR code, please enter this code manually into the app.')}</Typography>
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
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    {__('Continue')}
                                </Button>

                            </div>
                        </Box>
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