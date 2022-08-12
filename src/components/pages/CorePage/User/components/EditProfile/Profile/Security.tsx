import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardActions, CardContent, Grid, Link, Step, StepContent, StepLabel, Stepper, Typography, useTheme } from '@mui/material';
import Divider from 'components/atoms/Divider';
import FieldForm from 'components/atoms/fields/FieldForm';
import FormWrapper, { FormData, useFormWrapper } from 'components/atoms/fields/FormWrapper';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { __ } from 'helpers/i18n';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import accountService from 'services/accountService';
import { RootState } from 'store/configureStore';
import { logout } from 'store/user/user.reducers';

function Security() {

    const user = useSelector((state: RootState) => state.user);

    const [dataTwoFactor, setDataTwoFactor] = React.useState({
        enable: false,
        is_setup: false,
    });
    // const [isLoadingEnableButton, setIsLoadingEnableButton] = React.useState(false);

    const [isSetupTwoFactor, setIsSetupTwoFactor] = React.useState(false);

    const dispatch = useDispatch();

    const handleSubmit = (data: FormData) => {

        (async () => {
            const result = await accountService.updatePassword(data.pass_current, data.pass_new, data.pass_confirm);

            if (result) {
                dispatch(logout());
            }

        })()
    }

    const handleOnChangeStatusTwoFacto = (status: boolean) => {
        // setIsLoadingEnableButton(true);
        const change = accountService.me.security.twoFactor.changeEnable(status);
        Promise.all([change, new Promise(resolve => setTimeout(resolve, 500))]).then(([result]) => {
            setDataTwoFactor(prev => ({
                ...prev,
                enable: result,
            }));
            // setIsLoadingEnableButton(false);
        });
    }

    const handleUpdateStatusTwoFactor = async () => {
        setDataTwoFactor(await accountService.me.security.twoFactor.getData())
    }

    React.useEffect(() => {
        handleUpdateStatusTwoFactor();
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
                <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 1, pt: 2, width: '100%' }}
                >
                    <Typography gutterBottom variant="h5" component="div">
                        {__('Two-factor authentication')}
                    </Typography>
                    {
                        dataTwoFactor.is_setup ?
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {dataTwoFactor.enable ? __('On') : __('Off')}
                                <FieldForm
                                    component='true_false'
                                    config={{
                                        title: undefined,
                                    }}
                                    name="enable"
                                    post={{ enable: dataTwoFactor.enable }}
                                    onReview={(value) => {
                                        handleOnChangeStatusTwoFacto(value ? true : false);
                                    }}

                                />
                            </Box>

                            //     dataTwoFactor.enable ?
                            // <FieldForm


                            // />
                            // <LoadingButton
                            //     loading={isLoadingEnableButton}
                            //     startIcon={<Icon icon="CheckCircleRounded" />}
                            //     onClick={handleOnChangeStatusTwoFacto(false)}
                            //     variant="outlined"
                            // >
                            //     {__('On')}
                            // </LoadingButton>
                            // :
                            // <LoadingButton
                            //     loading={isLoadingEnableButton}
                            //     startIcon={<Icon icon="NotInterested" />}
                            //     onClick={handleOnChangeStatusTwoFacto(true)}
                            //     color="inherit"
                            //     variant="outlined"
                            // >
                            //     {__('Off')}
                            // </LoadingButton>
                            :
                            <></>
                    }
                </Box>
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
                            <TwoFactorSetup onBack={(isDone?: boolean) => {
                                setIsSetupTwoFactor(false);

                                if (isDone) {
                                    handleUpdateStatusTwoFactor();
                                }
                            }} />
                            :
                            <>
                                <Typography variant="h2" align='center' >
                                    {dataTwoFactor.is_setup ? __('Two-factor authentication has been set up.') : __('Two factor authentication is not setup yet.')}
                                </Typography>
                                <Typography align='center' >
                                    {__('Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.')}
                                </Typography>

                                {
                                    dataTwoFactor.is_setup
                                        ?
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <Button onClick={async () => {
                                                await accountService.me.security.twoFactor.remove();
                                                handleUpdateStatusTwoFactor();
                                            }} variant="contained" color='inherit'>
                                                {__('Remove')}
                                            </Button>
                                            {__('OR')}
                                            <Button onClick={() => setIsSetupTwoFactor(true)} variant="contained">
                                                {__('Create new')}
                                            </Button>
                                        </Box>
                                        :
                                        <Button onClick={() => setIsSetupTwoFactor(true)} variant="contained">
                                            {__('Setup two-factor authentication')}
                                        </Button>
                                }

                                <Link>{__('Learn more')}</Link>
                            </>
                    }
                </CardContent>
            </Card>
        </Box>
    )
}

export default Security



function TwoFactorSetup({ onBack }: { onBack: (isDone?: boolean) => void }) {
    const [activeStep, setActiveStep] = React.useState(0);

    const [isSubmit, setIsSubmit] = React.useState(false);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const theme = useTheme();

    const handleSubmitVerify = async (secretKey: string, six_digit_code: string) => {
        setIsSubmit(true);
        const isVerifi = await accountService.me.security.twoFactor.submitVerify(secretKey, six_digit_code);
        if (isVerifi) {
            handleNext();
        }
        setIsSubmit(false);
        return isVerifi;
    }

    const formWrapper = useFormWrapper({
        onFinish: async (post) => {
            handleSubmitVerify(post.secretKey, post.six_digit_code);
        }
    });

    const [twoFactorData, setTwoFactorData] = React.useState<{
        secretKey: string,
        imageQRCode: string,
    }>({
        secretKey: '',
        imageQRCode: '',
    });

    const handleSubmitTwoFactor = async (secretKey: string, six_digit_code: string, enable: boolean) => {
        setIsSubmit(true);
        const update = await accountService.me.security.twoFactor.update(secretKey, six_digit_code, enable);
        if (update) {
            onBack(true);
        }
        setIsSubmit(false);
    }

    React.useEffect(() => {
        (async () => {
            let randomsecret = await accountService.me.security.twoFactor.random();

            if (randomsecret) {
                setTwoFactorData({
                    secretKey: randomsecret?.secret ?? '',
                    imageQRCode: randomsecret?.qrCodeUrl ?? '',
                });
            }
        })()
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} orientation="vertical">

                <Step>
                    <StepLabel>
                        {__('Two-factor authentication')}
                    </StepLabel>
                    <StepContent>
                        <Box
                            sx={{
                                p: 3,
                                border: '1px solid ' + theme.palette.dividerDark,
                                borderRadius: 2,
                            }}
                        >
                            <Typography>{__('Download and install the Authenticator app')}</Typography>

                            <Grid
                                container
                                sx={{
                                    mt: 3,
                                    mb: 3,
                                }}
                            >
                                <Grid
                                    item
                                    xs
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 1,
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
                                        gap: 1,
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
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                justifyContent: 'flex-end',
                                mb: 2,
                                mt: 1,
                            }}
                        >
                            <Button
                                onClick={() => onBack()}
                                color="inherit"
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                            >
                                {__('Continue')}
                            </Button>
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
                                p: 3,
                                border: '1px solid ' + theme.palette.dividerDark,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                borderRadius: 2,
                            }}
                        >
                            <Typography >{__('Scan this QR code in the Authenticator app')}</Typography>
                            <ImageLazyLoading
                                sx={{
                                    width: 200,
                                    height: 200,
                                }}
                                src={twoFactorData.imageQRCode}
                            />
                            <Typography variant='h2' sx={{ textTransform: 'uppercase' }}>{twoFactorData.secretKey}</Typography>
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

                                {
                                    formWrapper.renderFormWrapper(<Box
                                        sx={{ maxWidth: 300 }}
                                    >
                                        <FieldForm
                                            component='number'
                                            config={{
                                                title: __('6-digit code'),
                                                rules: {
                                                    require: true,
                                                    length: 6,
                                                    custom: async (post) => {
                                                        const result = await handleSubmitVerify(twoFactorData.secretKey, post.six_digit_code);

                                                        if (!result) {
                                                            return {
                                                                error: true,
                                                                note: __('Two-factor code verification failed. Please try again.'),
                                                            };
                                                        }

                                                        return null;

                                                    }
                                                },
                                                inputProps: {
                                                    placeholder: __('6-digit code')
                                                }
                                            }}
                                            name="six_digit_code"
                                        />
                                    </Box>)
                                }

                            </Box>

                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                justifyContent: 'flex-end',
                                mb: 2,
                                mt: 1,
                            }}
                        >
                            <Button
                                color="inherit"
                                onClick={handleBack}
                            >
                                {__('Back')}
                            </Button>
                            <LoadingButton

                                loading={isSubmit}
                                variant="contained"
                                onClick={() => {
                                    formWrapper.onSubmit();
                                }}
                            >
                                {__('Continue')}
                            </LoadingButton>
                        </Box>
                    </StepContent>
                </Step>



                <Step>
                    <StepLabel>
                        {__('Two-factor authentication activated')}
                    </StepLabel>
                    <StepContent>
                        <Box
                            sx={{
                                p: 3,
                                border: '1px solid ' + theme.palette.dividerDark,
                                borderRadius: 2,
                            }}
                        >

                            <Typography variant='h4' >{__('Keep the party going?')}</Typography>
                            <Typography sx={{ mt: 1, mb: 1 }}>{__('The next time you login from an unrecognized browser or device, you will need to provide a two-factor authentication code.')}</Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'center',
                                }}
                            >
                                {__('Status: ')}
                                <Icon icon="CheckCircleRounded" color="primary" />
                                {__('On')}
                            </Box>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'flex-end',
                            mb: 2,
                            mt: 1,
                        }}>
                            <Button
                                color="inherit"
                                onClick={() => onBack()}
                            >
                                {__('Cancel')}
                            </Button>
                            <LoadingButton
                                loading={isSubmit}
                                variant="contained"
                                onClick={() => {
                                    handleSubmitTwoFactor(twoFactorData.secretKey, formWrapper.post.six_digit_code, true);
                                }}
                                color="success"
                            >
                                {__('Done')}
                            </LoadingButton>
                        </Box>
                    </StepContent>
                </Step>
            </Stepper>
        </Box>
    );
}