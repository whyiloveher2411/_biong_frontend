import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardContent } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';
import React from 'react';
import elearningService from 'services/elearningService';
import { ReferenceProps, UserCV } from 'services/elearningService/@type';

function EditReferences({ cv, onBack, onReloadCV }: { cv: UserCV | null, onBack: () => void, onReloadCV: () => Promise<void> }) {

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const [data, setData] = React.useState<{
        references: Array<ReferenceProps>,
    }>({
        references: cv?.references ?? [],
    })

    const handleEditReferences = () => {
        setIsLoadingButton(true);

        (async () => {
            const result = await elearningService.user.cv.updateReference(data.references);
            if (result) {
                onReloadCV();
                window.showMessage(__('Save changes successfully'), 'success');
            }
            setIsLoadingButton(false);
        })()

    }

    return (
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
                    {__('Edit References')}
                </Button>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    <FieldForm
                        component='repeater'
                        config={{
                            title: undefined,
                            layout: 'block',
                            sub_fields: {
                                full_name: { title: __('Full Name'), view: 'text' },
                                role: { title: __('Role'), view: 'text' },
                                company_name: { title: __('Company name'), view: 'text' },
                                email: { title: __('Email'), view: 'text' },
                            }

                        }}
                        name="references"
                        post={data}
                        onReview={(value) => {
                            setData(prev => ({ ...prev, references: value }));
                        }}
                    />
                    <LoadingButton
                        loading={isLoadingButton}
                        loadingPosition='start'
                        color='primary'
                        variant="contained"
                        startIcon={<Icon icon="Save" />}
                        onClick={handleEditReferences}
                    >
                        {__('Save Changes')}
                    </LoadingButton>
                </Box>
            </CardContent>
        </Card>
    )
}

export default EditReferences