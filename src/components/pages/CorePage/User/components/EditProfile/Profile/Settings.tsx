import { LoadingButton } from '@mui/lab';
import { Box, Card, CardActions, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import FieldForm from 'components/atoms/fields/FieldForm';
import FormWrapper from 'components/atoms/fields/FormWrapper';
import { __ } from 'helpers/i18n';
import React from 'react';
import accountService from 'services/accountService';

function Settings() {

    const [post, setPost] = React.useState<{
        [key: string]: ANY
    }>({
        is_private_account: false,
        active_two_factor_authen: false,
        active_course_sharing: false,
        google_authenticator_secret: '',
    });

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

        Promise.all([data]).then(([data]) => {

            if (data) {
                setPost({
                    ...data,
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
        </Box >
    )
}

export default Settings