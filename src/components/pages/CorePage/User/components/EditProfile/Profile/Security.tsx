import { LoadingButton } from '@mui/lab';
import { Box, Card, CardActions, CardContent, Collapse, IconButton, InputAdornment, Typography } from '@mui/material';
import Divider from 'components/atoms/Divider';
import FieldForm from 'components/atoms/fields/FieldForm';
import Icon from 'components/atoms/Icon';
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
        active_course_sharing: true,
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

    const randomGoogleAuthenticatorSecret = async () => {

        let randomsecret = await accountService.getRandomGoogleAuthenticatorSecret('RANDOM_SECRET');

        if (randomsecret && randomsecret.secret) {
            setPost(prev => ({
                ...prev,
                google_authenticator_secret: randomsecret?.secret,
                google_authenticator_secret_image: randomsecret?.qrCodeUrl,
            }));

        }
    }

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
            <Card>
                {/* <DraftEditor /> */}
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    <Typography gutterBottom variant="h5" component="div" sx={{ mb: 0 }}>
                        {__('Security')}
                    </Typography>

                    <FieldForm
                        component='true_false'
                        config={{
                            title: __('Private account'),
                            note: __('When your account is private, people won\'t be able to see what you share'),
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
                    <Divider color="dark" />

                    <FieldForm
                        component='true_false'
                        config={{
                            title: __('Course Sharing'),
                            note: __('Show courses you\'re taking on your profile page'),
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
                    <Divider color="dark" />


                    <FieldForm
                        component='true_false'
                        config={{
                            title: __('Two-Factor Authentication'),
                            note: __('Two-factor authentication is an extra layer of security for your account designed to ensure that you\'re the only person who can access your '),
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

                    <Collapse
                        in={Boolean(post.active_two_factor_authen)}
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
                    </Collapse>

                </CardContent>
                <Divider color="dark" />
                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }} >
                    <LoadingButton onClick={handleSubmit} loading={isLoadingButton} loadingPosition="center" color='success' variant='contained'>{__('Save Change')}</LoadingButton>
                </CardActions>

            </Card>
        </Box>
    )
}

export default Security