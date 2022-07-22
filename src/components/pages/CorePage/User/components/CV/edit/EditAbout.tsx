import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardContent } from '@mui/material';
import DraftEditor, { getDarftContent } from 'components/atoms/DraftEditor';
import Icon from 'components/atoms/Icon';
import { convertFromRaw, EditorState } from 'draft-js';
import { __ } from 'helpers/i18n';
import React from 'react';
import elearningService from 'services/elearningService';
import { UserCV } from 'services/elearningService/@type';

function EditAbout({ cv, onBack, onReloadCV }: { cv: UserCV | null, onBack: () => void, onReloadCV: () => Promise<void> }) {

    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );

    const [isLoadingButton, setIsLoadingButton] = React.useState(false);

    React.useEffect(() => {
        let content: EditorState;

        try {
            if (cv?.about) {
                content = EditorState.createWithContent(convertFromRaw(JSON.parse(cv?.about)));
            } else {
                content = EditorState.createEmpty();
            }
        } catch (error) {
            content = EditorState.createEmpty();
        }

        setEditorState(content);

    }, []);

    const handleEditAbout = () => {
        setIsLoadingButton(true);
        let content = getDarftContent(editorState);

        if (content) {
            (async () => {
                const result = await elearningService.user.cv.updateAbout(content);
                if (result) {
                    onReloadCV();
                    window.showMessage(__('Save changes successfully'), 'success');
                }
                setIsLoadingButton(false);
            })()
        }
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
                    <DraftEditor
                        editorState={editorState}
                        setEditorState={setEditorState}
                    />
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