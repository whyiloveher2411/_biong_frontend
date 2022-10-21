import { LoadingButton } from '@mui/lab';
import { Box, Button, Chip } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import Icon from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import MoreButton from 'components/atoms/MoreButton';
import { PaginationProps } from 'components/atoms/TablePagination';
import NoticeContent from 'components/molecules/NoticeContent';
import { convertHMS } from 'helpers/date';
import { __ } from 'helpers/i18n';
import useConfirmDialog from 'hook/useConfirmDialog';
import usePaginate from 'hook/usePaginate';
import React from 'react';
import courseService, { ChapterAndLessonCurrentState, CourseNote, CourseProps, NotesType, notesTypes } from 'services/courseService';
import NoteItem, { NoteItemLoading } from './SectionLearn/NoteItem';

function SectionVideoNote({
    course,
    chapterAndLessonCurrent,
    setChapterAndLessonCurrent
}: {
    course: CourseProps | null,
    chapterAndLessonCurrent: ChapterAndLessonCurrentState,
    setChapterAndLessonCurrent: React.Dispatch<React.SetStateAction<ChapterAndLessonCurrentState>>,
}) {

    const [notes, setNotes] = React.useState<PaginationProps<CourseNote> | null>(null);

    const [search, setSearch] = React.useState<{
        query: string,
        type: number,
        sort: number,
        filter: { [key: number]: boolean },
    }>({
        query: '',
        type: 1,
        sort: 0,
        filter: {},
    });

    const [isSubmitingNote, setIsSubmitingNote] = React.useState(false);

    const [content, setContent] = React.useState('');

    const [isLoading, setLoading] = React.useState(false);

    const noteListRef = React.useRef<HTMLDivElement>(null);

    const [typeNote, setTypeNote] = React.useState<keyof NotesType>('info');

    const paginate = usePaginate<CourseNote>({
        name: 'video-note',
        template: 'page',
        onChange: async () => {
            loadNotes();
        },
        // scrollToELementAfterChange: noteListRef,
        // enableLoadFirst: true,
        pagination: notes,
        data: {
            current_page: 0,
            per_page: 10
        }
    });

    const loadNotes = async () => {
        setLoading(true);
        let notes = await courseService.noteGet({
            course: course?.slug ?? '',
            page: paginate.data.current_page,
            length: paginate.data.per_page,
            type: search.type,
            sort: search.sort,
            lesson_current: chapterAndLessonCurrent.lessonID,
        });
        setNotes(notes);
        setLoading(false);
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
        setContent('');
        if (window.__editor['SectionVideoNote']) {
            window.__editor['SectionVideoNote'].setContent('');
        }
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
        setIsSubmitingNote(true);
        (async () => {

            if (content.trim()) {

                // let video: HTMLVideoElement | null = document.getElementById('videoCourse_livevideo_html5_api') as HTMLVideoElement | null;

                let result = await courseService.notePost(
                    {
                        ...chapterAndLessonCurrent,
                        course: course?.slug ?? '',
                        chapter_id: course?.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].id ?? 0,
                        lesson_id: course?.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].lessons[chapterAndLessonCurrent.lessonIndex].id ?? 0,
                        time: window.__videoTimeCurrent ?? 0,
                        type_note: typeNote,
                    },
                    content
                );
                if (result) {
                    clearEditorContent();
                    loadNotes();
                }

            } else {
                window.showMessage(__('Vui lòng nhập nội dung ghi chú'), 'error');
            }
            setIsSubmitingNote(false);

        })()

    }

    React.useEffect(() => {

        if (window.__NoteItem_notchangeChapterAndLessonCurrent) {
            delete window.__NoteItem_notchangeChapterAndLessonCurrent;
            return;
        }

        if (search.type === 1) {
            paginate.set(prev => ({ ...prev, current_page: 0, loadData: true }));
            // loadNotes();
        }
    }, [chapterAndLessonCurrent]);

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
                    mb: 10,
                }}
            >
                <Chip id="videoTimeCurrent" sx={{ background: '#1c1d1f', color: 'white' }} label={'00:00'} />
                <Box
                    sx={{ width: '100%', flex: '1' }}
                >
                    <FieldForm
                        component='editor'
                        config={{
                            title: undefined,
                            editorObjectName: 'SectionVideoNote',
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
                        post={{ content: content }}
                        onReview={(value) => {
                            setContent(value);
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
                            {
                                (() => {

                                    const actions: {
                                        [key: string]: {
                                            title: string,
                                            action: () => void,
                                        }
                                    } = {};

                                    Object.keys(notesTypes).forEach(key => {
                                        if (key !== 'of-the-lecturer') {
                                            actions[key] = {
                                                title: notesTypes[key as keyof NotesType],
                                                action: () => {
                                                    setTypeNote('info');
                                                }
                                            }
                                        }
                                    });

                                    return <MoreButton
                                        actions={[
                                            actions
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
                                })()
                            }

                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                            }}
                        >
                            <Button onClick={clearEditorContent} color="inherit">{__('Làm mới')}</Button>
                            <LoadingButton loading={isSubmitingNote} onClick={handleSaveNote} variant="contained">{__('Lưu ghi chú')}</LoadingButton>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    width: '100%',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Loading isCover open={notes === null || isLoading || paginate.isLoading} sx={{
                    top: -24,
                    left: -24,
                    right: -24,
                    bottom: -24,
                }} />

                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        width: '100%',
                    }}
                >
                    <MoreButton
                        transitionDuration={0}
                        actions={[
                            searchData.type.map((item, index) => ({
                                ...item,
                                action: () => {
                                    setSearch(prev => ({ ...prev, type: index }))
                                    paginate.set(prev => ({ ...prev, current_page: 0 }));
                                },
                                selected: search.type === index,
                            }))
                        ]}
                    >
                        <Button
                            variant='outlined'
                            disableRipple
                            color='inherit'
                            endIcon={<Icon icon="ArrowDropDown" />}
                        >
                            {searchData.type[search.type].title}
                        </Button>
                    </MoreButton>

                    <MoreButton
                        transitionDuration={0}
                        actions={[
                            searchData.sort.map((item, index) => ({
                                ...item,
                                action: () => {
                                    setSearch(prev => ({ ...prev, sort: index }))
                                    paginate.set(prev => ({ ...prev, current_page: 0 }));
                                },
                                selected: search.sort === index,
                            }))
                        ]}
                    >
                        <Button
                            variant='outlined'
                            disableRipple
                            color='inherit'
                            endIcon={<Icon icon="ArrowDropDown" />}
                        >
                            {searchData.sort[search.sort].title}
                        </Button>
                    </MoreButton>
                </Box>

                <Box ref={noteListRef}>
                    {
                        notes && notes?.total > 0 ?
                            paginate.isLoading ?
                                [...Array(10)].map((_, index) => (
                                    <NoteItemLoading key={index} />
                                ))
                                :
                                notes.data.map((note, index) => (
                                    <NoteItem setChapterAndLessonCurrent={setChapterAndLessonCurrent} loadNotes={loadNotes} key={index} note={note} handleDeleteNote={handleDeleteNote} />
                                ))
                            :
                            <NoticeContent
                                title={__('Không tìm thấy ghi chú nào')}
                                variantDescription='h5'
                                description={
                                    search.query || search.type > 0 ?
                                        __('Thử tìm kiếm các từ khóa khác nhau hoặc điều chỉnh bộ lọc của bạn')
                                        :
                                        __('Chưa có ghi chú nào được tạo trong khóa học này.')
                                }
                                image='/images/undraw_no_data_qbuo.svg'
                                disableButtonHome
                            />
                    }
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        {
                            notes !== null &&
                            paginate.component
                        }
                    </Box>
                </Box>


            </Box>

            {confirmDeleteNote.component}
        </Box>
    )
}

export default SectionVideoNote



const searchData = {
    type: [
        {
            title: __('Trong khóa học'),
            query: 'all',
        },
        {
            title: __('Bài giảng hiện tại'),
            query: 'current_lecture',
        },
    ],
    sort: [
        {
            title: __('Săp xêp theo gân đây nhât'),
            query: 'recent',
        },
        {
            title: __('Sắp xếp theo thời gian (A-Z)'),
            query: 'time',
        },
        {
            title: __('Sắp xếp theo thời gian (Z-A)'),
            query: 'time',
        },
    ],
}