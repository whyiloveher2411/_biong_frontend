import { LoadingButton } from '@mui/lab'
import { Box, Button, Chip, IconButton, Paper, Skeleton, Theme, Typography } from '@mui/material'
import FieldForm from 'components/atoms/fields/FieldForm'
import Icon from 'components/atoms/Icon'
import makeCSS from 'components/atoms/makeCSS'
import MoreButton from 'components/atoms/MoreButton'
import { convertHMS } from 'helpers/date'
import { __ } from 'helpers/i18n'
import React from 'react'
import courseService, { ChapterAndLessonCurrentState, CourseNote, NotesType, notesTypes } from 'services/courseService'

const useStyle = makeCSS((theme: Theme) => ({
    noteItem: {
        display: 'flex',
        marginBottom: theme.spacing(4),
        padding: 16,
        border: '1px solid',
        borderColor: theme.palette.dividerDark,
        borderRadius: 4,
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

    const [isSubmitingNote, setIsSubmitingNote] = React.useState(false);

    const [typeNote, setTypeNote] = React.useState<keyof NotesType>(note.type_note ?? 'info');

    const [editorState, setEditorState] = React.useState<{
        content: string,
        editAble: boolean
    }>(
        {
            content: '',
            editAble: false,
        }
    );

    const handleEditNote = () => {
        setEditorState(prev => {
            let content: string;

            try {
                if (note.content) {
                    content = note.content;
                } else {
                    content = '';
                }
            } catch (error) {
                content = '';
            }

            return {
                content,
                editAble: !prev.editAble,
            }
        });
    }

    const handleSaveNote = () => {

        setIsSubmitingNote(true);
        (async () => {
            let valueNote = editorState.content;
            if (valueNote) {

                if (!valueNote.trim()) {
                    return;
                }

                let result = await courseService.noteEdit(
                    note,
                    valueNote,
                    typeNote
                );

                if (result) {
                    loadNotes();
                    handleEditNote();
                    if (window._loadNoteOfVideoIframe) {
                        window._loadNoteOfVideoIframe();
                    }
                }
                setIsSubmitingNote(false);
            }
        })()
    }

    React.useEffect(() => {
        setTypeNote(note.type_note ?? 'info')
    }, [note]);

    return (
        <Box className={classes.noteItem}>
            <Chip
                sx={{ background: '#1c1d1f', color: 'white', mt: 1.5, cursor: 'pointer' }}
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

                                if (window.changeVideoTime) {
                                    window.changeVideoTime(note.time);
                                }
                            }

                            window.__NoteItem_notchangeChapterAndLessonCurrent = true;

                            const main = document.documentElement;
                            if (main) {
                                setTimeout(() => {
                                    main.scrollTo({ behavior: 'smooth', top: 0 });
                                }, 100);
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
                padding: '0px 12px',
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
                    <Box>
                        <Typography sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <strong>{note.chapter?.title}</strong> <span>{note.lesson?.title}</span>
                        </Typography>
                    </Box>
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
                            <FieldForm
                                component='editor'
                                config={{
                                    title: undefined,
                                    disableScrollToolBar: true,
                                    inputProps: {
                                        height: 300,
                                        placeholder: __('Viết một cái gì đó tuyệt vời ...'),
                                        menubar: false,
                                    },
                                    plugins: ['codesample', 'link', 'hr', 'lists', 'emoticons', 'paste'],
                                    toolbar: ['undo redo | formatselect  | bold italic underline | forecolor backcolor | outdent indent | bullist numlist | hr codesample | blockquote link emoticons'],
                                }}
                                name="content"
                                post={editorState}
                                onReview={(value) => {
                                    setEditorState({
                                        content: value,
                                        editAble: true,
                                    });
                                }}
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    mt: 2,
                                }}
                            >
                                <Box>
                                    <MoreButton
                                        actions={[
                                            {
                                                info: {
                                                    title: __('Thông tin'),
                                                    action: () => {
                                                        setTypeNote('info');
                                                    }
                                                },
                                                warning: {
                                                    title: __('Cảnh báo'),
                                                    action: () => {
                                                        setTypeNote('warning');
                                                    }
                                                },
                                                error: {
                                                    title: __('Lỗi'),
                                                    action: () => {
                                                        setTypeNote('error');
                                                    }
                                                },
                                                // debug: {
                                                //     title: __('Gỡ lỗi'),
                                                //     action: () => {
                                                //         setTypeNote('debug');
                                                //     }
                                                // },
                                            }
                                        ]}
                                    >
                                        <Button
                                            variant='outlined'
                                            color='inherit'
                                            endIcon={<Icon icon="ArrowDropDown" />}
                                        >
                                            Ghi chú {notesTypes[typeNote]}
                                        </Button>
                                    </MoreButton>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
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
                                        {__('Hủy bỏ')}
                                    </Button>
                                    <LoadingButton loading={isSubmitingNote} onClick={handleSaveNote} variant="contained">{__('Lưu ghi chú')}</LoadingButton>
                                </Box>
                            </Box>
                        </Box>
                        :
                        <Box sx={{
                            '&>p:first-child': {
                                marginTop: 0,
                            },
                            '&>:last-child': {
                                marginBottom: 0,
                            }
                        }} dangerouslySetInnerHTML={{ __html: note.content }} />
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

export interface LessonPosition extends ChapterAndLessonCurrentState {
    id: ID,
    chapter: string
    chapterIndex: number,
    lesson: string,
    lessonIndex: number,
    stt: number,
}