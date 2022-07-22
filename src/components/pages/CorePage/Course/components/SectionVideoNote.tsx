import { Box, Button, Chip } from '@mui/material';
import DraftEditor from 'components/atoms/DraftEditor';
import { PaginationProps } from 'components/atoms/TablePagination';
import { convertToRaw, EditorState } from 'draft-js';
import { convertHMS } from 'helpers/date';
import { __ } from 'helpers/i18n';
import useConfirmDialog from 'hook/useConfirmDialog';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import courseService, { ChapterAndLessonCurrentState, CourseNote, CourseProps } from 'services/courseService';
import NoteItem, { NoteItemLoading } from './SectionLearn/NoteItem';

function SectionVideoNote({
    course,
    chapterAndLessonCurrent,
    setChapterAndLessonCurrent
}: {
    course: CourseProps | null,
    chapterAndLessonCurrent: ChapterAndLessonCurrentState,
    setChapterAndLessonCurrent: React.Dispatch<React.SetStateAction<ChapterAndLessonCurrentState>>
}) {

    const [notes, setNotes] = React.useState<PaginationProps<CourseNote> | null>(null);

    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );

    const noteListRef = React.useRef<HTMLDivElement>(null);

    const paginate = usePaginate<CourseNote>({
        name: 'note',
        onChange: async () => {
            await loadNotes();
        },
        scrollToELementAfterChange: noteListRef,
        enableLoadFirst: true,
        pagination: notes,
        data: {
            current_page: 0,
            per_page: 10
        }
    });

    const loadNotes = async () => {
        let notes = await courseService.noteGet({
            course: course?.slug ?? '',
            page: paginate.data.current_page,
            length: paginate.data.per_page,
        });
        setNotes(notes);
    }

    React.useEffect(() => {

        let video: HTMLVideoElement | null = document.getElementById('videoCourse_livevideo_html5_api') as HTMLVideoElement | null;

        if (video) {
            const videoTimeCurrent = document.querySelector('#videoTimeCurrent .MuiChip-label') as HTMLSpanElement;

            if (videoTimeCurrent) {
                videoTimeCurrent.innerText = convertHMS(video?.currentTime ?? 0) ?? '00:00';
            }
        }

    }, []);

    const clearEditorContent = () => {
        setEditorState(EditorState.createEmpty());
    }

    const confirmDeleteNote = useConfirmDialog();

    const handleDeleteNote = (note: CourseNote) => () => {
        confirmDeleteNote.onConfirm(async () => {
            let result = await courseService.noteDelete({
                ...chapterAndLessonCurrent,
                course: course?.slug ?? '',
                chapter_id: course?.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].id ?? 0,
                lesson_id: course?.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].lessons[chapterAndLessonCurrent.lessonIndex].id ?? 0,
            }, note);

            if (result) {
                loadNotes();
            }
        });
    }

    const handleSaveNote = () => {

        (async () => {

            let valueNote = convertToRaw(editorState.getCurrentContent());

            if (valueNote) {

                let text = valueNote.blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
                if (!text.trim()) {

                    return;
                }

                let video: HTMLVideoElement | null = document.getElementById('videoCourse_livevideo_html5_api') as HTMLVideoElement | null;

                let result = await courseService.notePost(
                    {
                        ...chapterAndLessonCurrent,
                        course: course?.slug ?? '',
                        chapter_id: course?.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].id ?? 0,
                        lesson_id: course?.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].lessons[chapterAndLessonCurrent.lessonIndex].id ?? 0,
                        time: video?.currentTime ?? 0,
                    },
                    JSON.stringify(valueNote)
                );

                if (result) {
                    clearEditorContent();
                    loadNotes();
                }
            }

        })()

    }

    return (
        <Box
            sx={{
                maxWidth: 800,
                margin: '0 auto',
            }}
        >

            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 4,
                }}
            >
                <Chip id="videoTimeCurrent" sx={{ background: '#1c1d1f', color: 'white' }} label={'00:00'} />
                <Box
                    sx={{ width: '100%', flex: '1' }}
                >
                    <DraftEditor
                        editorState={editorState}
                        setEditorState={setEditorState}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <Button onClick={clearEditorContent} color="inherit">{__('Cancel')}</Button>
                        <Button onClick={handleSaveNote} variant="contained">{__('Save note')}</Button>
                    </Box>
                </Box>
            </Box>

            <Box ref={noteListRef}>
                {
                    notes !== null ?
                        paginate.isLoading ?
                            [...Array(10)].map((_, index) => (
                                <NoteItemLoading key={index} />
                            ))
                            :
                            notes.data.map((note, index) => (
                                <NoteItem setChapterAndLessonCurrent={setChapterAndLessonCurrent} loadNotes={loadNotes} key={index} note={note} handleDeleteNote={handleDeleteNote} />
                            ))
                        :
                        [...Array(10)].map((_, index) => (
                            <NoteItemLoading key={index} />
                        ))
                }
                {
                    notes !== null &&
                    paginate.component
                }
            </Box>

            {confirmDeleteNote.component}
        </Box>
    )
}

export default SectionVideoNote