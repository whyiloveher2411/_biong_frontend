import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardContent } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';
import React from 'react';
import elearningService from 'services/elearningService';
import { SkillProps, UserCV } from 'services/elearningService/@type';

function EditSkill({ cv, onBack, onReloadCV }: { cv: UserCV | null, onBack: () => void, onReloadCV: () => Promise<void> }) {

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    const [data, setData] = React.useState<{
        skills: Array<SkillProps>,
    }>({
        skills: cv?.skills ?? [],
    })

    const handleEditSkills = () => {
        setIsLoadingButton(true);

        (async () => {
            const result = await elearningService.user.cv.updateSkill(data.skills);
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
                    {__('Edit Skills')}
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
                                title: { title: __('Title'), view: 'text' },
                            }

                        }}
                        name="skills"
                        post={data}
                        onReview={(value) => {
                            setData(prev => ({ ...prev, skills: value }));
                        }}
                    />
                    <LoadingButton
                        loading={isLoadingButton}
                        loadingPosition='start'
                        color='primary'
                        variant="contained"
                        startIcon={<Icon icon="Save" />}
                        onClick={handleEditSkills}
                    >
                        {__('Save Changes')}
                    </LoadingButton>
                </Box>
            </CardContent>
        </Card>
    )
}

export default EditSkill