import { Box, Button, Chip, IconButton, Paper, Skeleton, Theme, Typography } from '@mui/material'
import DraftEditor from 'components/atoms/DraftEditor'
import DraftEditorView from 'components/atoms/DraftEditor/DraftEditorView'
import Icon from 'components/atoms/Icon'
import makeCSS from 'components/atoms/makeCSS'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { convertHMS } from 'helpers/date'
import { __ } from 'helpers/i18n'
import React from 'react'
import courseService, { ChapterAndLessonCurrentState, CourseNote } from 'services/courseService'
import { LessonPosition } from '../SectionLearn'


const useStyle = makeCSS((theme: Theme) => ({
    noteItem: {
        display: 'flex',
        marginBottom: theme.spacing(4),
        '&:hover $noteAction': {
            opacity: '1',
            pointerEvents: 'unset',
        }
    },
    noteAction: {
        display: 'flex',
        gap: 1,
        opacity: 0,
        pointerEvents: 'none'
    }
}));


function NoteItem({ note, handleDeleteNote, loadNotes, setChapterAndLessonCurrent }: {
    note: CourseNote,
    handleDeleteNote: (note: CourseNote) => () => void,
    loadNotes: () => void,
    setChapterAndLessonCurrent: React.Dispatch<React.SetStateAction<ChapterAndLessonCurrentState>>,
}) {

    const classes = useStyle();

    const [editorState, setEditorState] = React.useState<{
        content: EditorState,
        editAble: boolean
    }>(
        {
            content: EditorState.createEmpty(),
            editAble: false,
        }
    );

    const handleEditNote = () => {
        setEditorState(prev => {
            let content: EditorState;

            try {
                if (note.content) {
                    content = EditorState.createWithContent(convertFromRaw(JSON.parse(note.content)));
                } else {
                    content = EditorState.createEmpty();
                }
            } catch (error) {
                content = EditorState.createEmpty();
            }

            return {
                content,
                editAble: !prev.editAble,
            }
        });
    }

    const handleSaveNote = () => {
        (async () => {
            let valueNote = convertToRaw(editorState.content.getCurrentContent());
            if (valueNote) {

                let text = valueNote.blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
                if (!text.trim()) {

                    return;
                }

                let result = await courseService.noteEdit(
                    note
                    ,
                    JSON.stringify(valueNote)
                );

                if (result) {
                    loadNotes();
                    handleEditNote();
                }
            }
        })()
    }

    return (
        <Box className={classes.noteItem}>
            <Chip
                sx={{ background: '#1c1d1f', color: 'white', mt: 0.5, cursor: 'pointer' }}
                label={convertHMS(note.time) ?? '00:00'}
                onClick={() => {

                    let position = window.__course_content?.findIndex((item: LessonPosition) => item.id === note.lesson?.id);

                    if (position > -1) {


                        setChapterAndLessonCurrent(prev => {

                            if (note.lesson?.id === window.__course_content[position].id) {

                                if (window.__hls?.video) {
                                    window.__hls.video.currentTime = note.time;
                                }
                            }

                            if (!window.__hlsTime) window.__hlsTime = {};
                            window.__hlsTime[window.__course_content[position].lesson] = note.time;


                            if (window.__course_content[position].lesson === prev.lesson && window.__course_content[position].chapter === prev.chapter) {

                                let video: HTMLVideoElement | null = document.getElementById('videoCourse_livevideo_html5_api') as HTMLVideoElement | null;

                                if (video && note.time) {
                                    video.currentTime = note.time as number;
                                    video.play();

                                    const main = document.querySelector('#popupLearning');
                                    if (main) {
                                        main.closest('.custom_scroll')?.scrollTo({ behavior: 'smooth', top: 0 });
                                    }
                                }
                            }

                            return {
                                ...prev,
                                ...window.__course_content[position]
                            };
                        });


                    }
                }}
            />
            <Paper elevation={0} sx={{
                padding: '8px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                width: '100%',
                flex: '1',
                ml: 2,
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <strong>{note.chapter?.title}</strong> <span>{note.lesson?.title}</span>
                    </Typography>
                    <Box
                        className={classes.noteAction}
                    >
                        <IconButton
                            onClick={handleEditNote}
                        >
                            <Icon icon="EditOutlined" />
                        </IconButton>
                        <IconButton
                            onClick={handleDeleteNote(note)}
                        >
                            <Icon icon="DeleteOutlined" />
                        </IconButton>
                    </Box>
                </Box>
                {
                    editorState.editAble ?
                        <Box
                            sx={{ width: '100%', flex: '1' }}
                        >
                            <DraftEditor
                                editorState={editorState.content}
                                setEditorState={(content: EditorState) => setEditorState({ editAble: true, content: content })}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 2,
                                    mt: 2,
                                }}
                            >
                                <Button
                                    onClick={() => {
                                        setEditorState(prev => ({
                                            ...prev,
                                            editAble: false
                                        }));
                                    }}
                                    color="inherit"
                                >
                                    {__('Cancel')}
                                </Button>
                                <Button onClick={handleSaveNote} variant="contained">{__('Save note')}</Button>
                            </Box>
                        </Box>
                        :
                        <DraftEditorView value={note.content} />
                }
            </Paper>
        </Box>
    )
}

export function NoteItemLoading() {
    const classes = useStyle();
    return <Box className={classes.noteItem}>
        <Skeleton variant='rectangular' sx={{ width: 56, height: 32 }} />
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                width: '100%',
                flex: '1',
                ml: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: '100%',
                    flex: '1',
                    ml: 2,
                }}
            >
                <Typography sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Skeleton><strong>........ .......... .........</strong></Skeleton><Skeleton> <span>........ ............. ...........</span></Skeleton>
                </Typography>
                <Skeleton variant='rectangular' sx={{ width: '100%', height: 50 }} />
            </Box>
        </Box>
    </Box>
}

export default NoteItem