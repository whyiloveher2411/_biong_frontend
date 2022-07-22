import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import Divider from 'components/atoms/Divider';
import FieldForm from 'components/atoms/fields/FieldForm'
import FormWrapper, { FormData } from 'components/atoms/fields/FormWrapper';
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

    const dispatch = useDispatch();

    const handleSubmit = (data: FormData) => {

        (async () => {
            let result = await accountService.updatePassword(data.pass_current, data.pass_new, data.pass_confirm);

            if (result) {
                dispatch(logout());
            }

        })()
    }

    return (
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
                            gap: 3,
                        }}
                    >
                        <Typography gutterBottom variant="h5" component="div" sx={{ mb: 0 }}>
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
    )
}

export default Password