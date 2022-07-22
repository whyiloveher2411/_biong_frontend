import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardContent } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';
import React from 'react';
import elearningService from 'services/elearningService';
import { ExperienceProps, UserCV } from 'services/elearningService/@type';


function EditExperience({ cv, onBack, onReloadCV }: { cv: UserCV | null, onBack: () => void, onReloadCV: () => Promise<void> }) {

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const [data, setData] = React.useState<{
        work_experience: Array<ExperienceProps>
    }>({
        work_experience: cv?.work_experience ?? []
    })
    // const [isEdited, setIsEdited] = React.useState(false);

    const handleEditExperience = () => {
        setIsLoadingButton(true);

        (async () => {
            const result = await elearningService.user.cv.updateExperience(data.work_experience);
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
                    {__('Edit Experience')}
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
                            singular_name: __('Work Experience'),
                            sub_fields: {
                                company_name: { title: 'Company name', view: 'text' },
                                title: { title: 'Title', view: 'text' },
                                employment_type: {
                                    title: 'Employment Type', view: 'select',
                                    list_option: {
                                        full_time: { title: 'Full Time' },
                                        part_time: { title: 'Part Time' },
                                        self_employed: { title: 'Self-employed' },
                                        freelance: { title: 'Freelance' },
                                        contract: { title: 'Contract' },
                                        internship: { title: 'Internship' },
                                        apprenticeship: { title: 'Apprenticeship' },
                                        seasonal: { title: 'Seasonal' },
                                    }
                                },
                                location: { title: 'Location', view: 'text' },
                                start_date: { title: 'Start Date', view: 'date_picker' },
                                end_date: { title: 'End Date', view: 'date_picker' },
                                industry: { title: 'Industry', view: 'text' },
                                description: { title: 'Description', view: 'textarea' },
                            }
                        }}
                        name="work_experience"
                        post={data}
                        onReview={(value) => {
                            setData({ work_experience: value });
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


export default EditExperience