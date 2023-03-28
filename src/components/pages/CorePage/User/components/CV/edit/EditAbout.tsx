import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardContent } from '@mui/material';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';
import React from 'react';
import { UserCV } from 'services/elearningService/@type';

function EditAbout({ cv, onBack, onReloadCV }: { cv: UserCV | null, onBack: () => void, onReloadCV: () => Promise<void> }) {

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);


    const handleEditAbout = () => {
        setIsLoadingButton(false);

        // if (content) {
        //     (async () => {
        //         const result = await elearningService.user.cv.updateAbout(content);
        //         if (result) {
        //             onReloadCV();
        //             window.showMessage(__('Save changes successfully'), 'success');
        //         }
        //         setIsLoadingButton(false);
        //     })()
        // }
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
                    {__('Edit About')}
                </Button>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    {/* <FieldForm
                        component='editor'
                        config={{
                            title: undefined,
                            editorObjectName: 'SectionVideoNote',
                            disableScrollToolBar: true,
                            inputProps: {
                                height: 300,
                                placeholder: __('Nội dung ghi chú...'),
                                menubar: false,
                            },
                            plugins: ['codesample', 'link', 'hr', 'lists', 'emoticons', 'paste'],
                            toolbar: ['bold italic underline | bullist numlist | hr codesample strikeout | blockquote link emoticons'],
                            setup: (editor: ANY) => {
                                editor.ui.registry.addIcon('code-sample', '<svg width="24" height="24"><path d="M11 14.17 8.83 12 11 9.83 9.59 8.41 6 12l3.59 3.59zm3.41 1.42L18 12l-3.59-3.59L13 9.83 15.17 12 13 14.17z"></path><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04-.39.08-.74.28-1.01.55-.18.18-.33.4-.43.64-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 15v4H5V5h14v10z"></path></svg>');
                                editor.ui.registry.addButton('strikeout', {
                                    icon: 'sourcecode',
                                    tooltip: "Format as code",
                                    onAction: function () {
                                        editor.execCommand('mceToggleFormat', false, 'code');
                                    }
                                });
                            }
                        }}
                        name="content"
                        post={{ content: content }}
                    /> */}
                    <LoadingButton
                        loading={isLoadingButton}
                        loadingPosition='start'
                        color='primary'
                        variant="contained"
                        startIcon={<Icon icon="Save" />}
                        onClick={handleEditAbout}
                    >
                        {__('Save Changes')}
                    </LoadingButton>
                </Box>
            </CardContent>
        </Card>
    )
}

export default EditAbout