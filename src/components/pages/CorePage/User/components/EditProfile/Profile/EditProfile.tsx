// import DraftEditor from 'components/atoms/DraftEditor'
import { LoadingButton } from '@mui/lab'
import { Card, CardActions, CardContent, Typography } from '@mui/material'
import Divider from 'components/atoms/Divider'
import FieldForm from 'components/atoms/fields/FieldForm'
import FormWrapper, { FormData } from 'components/atoms/fields/FormWrapper'
import { __ } from 'helpers/i18n'
import React from 'react'
import { useDispatch } from 'react-redux'
import userService from 'services/accountService'
import { forceUpdateInfo } from 'store/user/user.reducers'

function EditProfile({ onLoadProfile }: {
    onLoadProfile: () => void,
}) {

    const [post, setPost] = React.useState<{ [key: string]: string }>({});

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const dispatch = useDispatch();

    const handleSubmit = (data: FormData) => {
        setIsLoadingButton(true);
        (async () => {
            let result = await userService.updateInfo(data);
            setIsLoadingButton(false);
            if (result) {
                dispatch(forceUpdateInfo());
                onLoadProfile();
            }
        })()
    }

    React.useEffect(() => {

        (async () => {
            let result = await userService.getProfile();
            setIsLoadingButton(false);
            setPost(result);
        })()

    }, []);

    return (
        <Card>
            <FormWrapper
                postDefault={post}
                onFinish={handleSubmit}
            >
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >

                    <Typography gutterBottom variant="h5" component="div" sx={{ mb: 1 }}>
                        {__('Thông tin cá nhân')}
                    </Typography>

                    <FieldForm
                        component='text'
                        config={{
                            title: __('Email'),
                            inputProps: {
                                readOnly: true,
                                disabled: true,
                            },
                            rules: {
                                require: true,
                            },
                        }}
                        name="email"
                    />

                    <FieldForm
                        component='text'
                        config={{
                            title: __('Họ tên'),
                            rules: {
                                require: true,
                                minLength: 6,
                                maxLength: 60,
                            }
                        }}
                        name="full_name"
                    />

                    {/* <FieldForm
                        component='text'
                        config={{
                            title: __('Job Title'),
                            rules: {
                                maxLength: 60,
                            }
                        }}
                        name="job_title"
                    /> */}

                    <FieldForm
                        component='text'
                        config={{
                            title: __('Số điện thoại'),
                            rules: {
                                require: true,
                                isPhoneNumber: true,
                            }
                        }}
                        name="phone"
                    />

                    {/* <FieldForm
                        component='date_picker'
                        config={{
                            title: 'Birthday'
                        }}
                        name="birthday"
                    /> */}
                </CardContent>
                <Divider color="dark" />
                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }} >
                    <LoadingButton type='submit' loading={isLoadingButton} loadingPosition="center" color='success' variant='contained'>{__('Lưu thay đổi')}</LoadingButton>
                </CardActions>
            </FormWrapper>
        </Card >
    )
}

export default EditProfile