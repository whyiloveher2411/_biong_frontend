import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardContent } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';
import React from 'react';
import elearningService from 'services/elearningService';
// import elearningService from 'services/elearningService';
import { CertificationProps, EducationProps, UserCV } from 'services/elearningService/@type';


function EditEducation({ cv, onBack, onReloadCV }: { cv: UserCV | null, onBack: () => void, onReloadCV: () => Promise<void> }) {

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const [data, setData] = React.useState<{
        education: Array<EducationProps>,
        certifications: Array<CertificationProps>,
    }>({
        education: cv?.education ?? [],
        certifications: cv?.certifications ?? [],
    })

    const handleEditExperience = () => {
        setIsLoadingButton(true);

        (async () => {
            const result = await elearningService.user.cv.updateEducationAndCertification(data.education, data.certifications);
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
                    {__('Edit Education & Certifications')}
                </Button>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        mt: 2
                    }}
                >
                    <FieldForm
                        component='repeater'
                        config={{
                            title: __('Education'),
                            singular_name: __('Education'),
                            layout: 'block',
                            sub_fields: {
                                school: { title: __('School'), view: 'text' },
                                degree: { title: __('Degree'), view: 'text' },
                                field_of_study: { title: __('Field of study'), view: 'text' },
                                start_date: { title: 'Start Date', view: 'date_picker' },
                                end_date: { title: 'End Date', view: 'date_picker' },
                                grade: { title: __('Grade'), view: 'text' },
                                activities_and_societies: { title: __('Activities and societies'), view: 'textarea' },
                                description: { title: 'Description', view: 'textarea' },
                            }
                        }}
                        name="education"
                        post={data}
                        onReview={(value) => {
                            setData(prev => ({ ...prev, education: value }));
                        }}
                    />
                    <FieldForm
                        component='repeater'
                        config={{
                            title: __('Certifications'),
                            singular_name: __('Certification'),
                            layout: 'block',
                            sub_fields: {
                                certificate: { title: __('Certificate'), view: 'text' },
                                organization: { title: __('Organization'), view: 'text' },
                                time: { title: __('Time'), view: 'date_picker' },
                                website: { title: __('Website'), view: 'text' },
                            }
                        }}
                        name="certifications"
                        post={data}
                        onReview={(value) => {
                            setData(prev => ({ ...prev, certifications: value }));
                        }}
                    />
                    <LoadingButton
                        loading={isLoadingButton}
                        loadingPosition='start'
                        color='primary'
                        variant="contained"
                        startIcon={<Icon icon="Save" />}
                        onClick={handleEditExperience}
                    >
                        {__('Save Changes')}
                    </LoadingButton>
                </Box>
            </CardContent>
        </Card>
    )
}


export default EditEducation