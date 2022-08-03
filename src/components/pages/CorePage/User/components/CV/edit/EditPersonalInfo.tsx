import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardContent } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import FormWrapper from 'components/atoms/fields/FormWrapper';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';
import React from 'react';
import elearningService from 'services/elearningService';
import { PersonalInfoProps, UserCV } from 'services/elearningService/@type';

function EditPersonalInfo({ cv, onBack, onReloadCV }: { cv: UserCV | null, onBack: () => void, onReloadCV: () => Promise<void> }) {

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const [data, setData] = React.useState<PersonalInfoProps>(cv?.personal_info ?? {
        birthday: '',
        address: '',
        phone_number: '',
        email: '',
        languages: '',
        social: [],
    })

    const handleEditPersonalInfo = () => {
        setIsLoadingButton(true);

        (async () => {
            const result = await elearningService.user.cv.updatePersonalInfo(data);
            if (result) {
                onReloadCV();
                window.showMessage(__('Save changes successfully'), 'success');
            }
            setIsLoadingButton(false);
        })()

    }

    return (
        <FormWrapper
            postDefault={data}
        >
            <Card>
                <CardContent>
                    <Button
                        color='inherit'
                        startIcon={<Icon icon="ArrowBackRounded" />}
                        onClick={() => {
                            // if (isEdited) {
                            //     onReloadCV();
                            // }
                            onBack();
                        }}
                    >
                        {__('Edit PersonalInfo')}
                    </Button>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            mt: 2,
                        }}
                    >
                        <FieldForm
                            component='date_picker'
                            config={{
                                title: __('Birthday'),
                                layout: 'block',

                            }}
                            name="birthday"
                            // post={data}
                            onReview={(value) => {
                                setData(prev => ({ ...prev, birthday: value }));
                            }}
                        />
                        <FieldForm
                            component='textarea'
                            config={{
                                title: __('Address'),
                                layout: 'block',

                            }}
                            name="address"
                            // post={data}
                            onReview={(value) => {
                                setData(prev => ({ ...prev, address: value }));
                            }}
                        />
                        <FieldForm
                            component='text'
                            config={{
                                title: __('Phone Number'),
                                layout: 'block',

                            }}
                            name="phone_number"
                            // post={data}
                            onReview={(value) => {
                                setData(prev => ({ ...prev, phone_number: value }));
                            }}
                        />
                        <FieldForm
                            component='text'
                            config={{
                                title: __('Languages'),
                                layout: 'block',

                            }}
                            name="languages"
                            // post={data}
                            onReview={(value) => {
                                setData(prev => ({ ...prev, languages: value }));
                            }}
                        />
                        <FieldForm
                            component='flexible'
                            config={{
                                title: __('Connect me'),
                                layout: 'block',
                                templates: {
                                    facebook: {
                                        title: __('Facebook'),
                                        items: {
                                            links: { title: __('Link') }
                                        }
                                    },
                                    twitter: {
                                        title: __('Twitter'),
                                        items: {
                                            links: { title: __('Link') }
                                        }
                                    },
                                    youTube: {
                                        title: __('YouTube'),
                                        items: {
                                            links: { title: __('Link') }
                                        }
                                    },
                                    linkedin: {
                                        title: __('LinkedIn'),
                                        items: {
                                            links: { title: __('Link') }
                                        }
                                    },
                                    github: {
                                        title: __('GitHub'),
                                        items: {
                                            links: { title: __('Link') }
                                        }
                                    },
                                }

                            }}
                            name="social"
                            // post={data}
                            onReview={(value) => {
                                setData(prev => ({ ...prev, social: value }));
                            }}
                        />
                        <LoadingButton
                            loading={isLoadingButton}
                            loadingPosition='start'
                            color='primary'
                            variant="contained"
                            startIcon={<Icon icon="Save" />}
                            onClick={handleEditPersonalInfo}
                        >
                            {__('Save Changes')}
                        </LoadingButton>
                    </Box>
                </CardContent>
            </Card>
        </FormWrapper>
    )
}

export default EditPersonalInfo