import { LoadingButton } from '@mui/lab';
import { Alert, Box, Chip } from '@mui/material';
import Icon from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import MoreButton from 'components/atoms/MoreButton';
import { PaginationProps } from 'components/atoms/TablePagination';
import Typography from 'components/atoms/Typography';
import FieldForm from 'components/atoms/fields/FieldForm';
import NoticeContent from 'components/molecules/NoticeContent';
import { convertHMS } from 'helpers/date';
import { __ } from 'helpers/i18n';
import usePaginate from 'hook/usePaginate';
import useQuery from 'hook/useQuery';
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

    const urlParam = useQuery({
        note_t: 1,
        note_s: 0,
    });

    const [isSubmitingNote, setIsSubmitingNote] = React.useState(false);

    const [content, setContent] = React.useState('');

    const [isLoading, setLoading] = React.useState(false);

    const noteListRef = React.useRef<HTMLDivElement>(null);

    // const [typeNote, setTypeNote] = React.useState<keyof NotesType>('info');

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
                        type_note: 'info',
                    },
                    content
                );
                if (result) {
                    clearEditorContent();
                    loadNotes();
                    if (window._loadNoteOfVideoIframe) {
                        window._loadNoteOfVideoIframe();
                    }
                }

            } else {
                window.showMessage(__('Vui lòng nhập nội dung ghi chú'), 'error');
            }
            setIsSubmitingNote(false);

        })()

    }

    React.useEffect(() => {
        setSearch(prev => ({
            ...prev,
            sort: searchData.sort[Number(urlParam.query.note_s)] ? Number(urlParam.query.note_s) : 0,
            type: searchData.type[Number(urlParam.query.note_t)] ? Number(urlParam.query.note_t) : 1,
        }));
        paginate.set(prev => ({ ...prev, current_page: 0 }));
    }, [chapterAndLessonCurrent, urlParam.query.note_s, urlParam.query.note_t]);

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
            {
                Boolean(
                    course?.course_detail?.content?.[chapterAndLessonCurrent.chapterIndex].lessons[chapterAndLessonCurrent.lessonIndex].type === 'video'
                ) &&
                <Alert sx={{ mb: 3 }} severity="info">
                    <Typography>
                        Double click vào thanh timeline trên video để thêm ghi chú nhanh
                    </Typography>
                </Alert>
            }

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
                        onReview={(value) => {
                            setContent(value);
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        {/* <Box>
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
                                                    setTypeNote(key as keyof NotesType);
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

                        </Box> */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                            }}
                        >
                            <LoadingButton loading={isSubmitingNote} onClick={handleSaveNote} variant="contained">{__('Lưu ghi chú')}</LoadingButton>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
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
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                        mt: 1,
                    }}
                >

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant='h4'>
                            Tất cả các ghi chú trong
                        </Typography>
                        &nbsp;
                        <MoreButton
                            actions={[
                                searchData.type.map((item, index) => ({
                                    ...item,
                                    action: () => {
                                        if (search.type !== index) {
                                            urlParam.changeQuery({
                                                note_t: index,
                                            });
                                        }
                                    },
                                    selected: search.type === index,
                                }))
                            ]}
                        >
                            <Typography variant='h4'
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: '1px solid',
                                    marginBottom: '-2px',
                                    cursor: 'pointer',
                                }}
                            >
                                {search.type === 0 ? __('khóa học này') : __('bài giảng này')}
                                <Icon icon="ArrowDropDown" />
                            </Typography>
                        </MoreButton>
                        &nbsp;&nbsp;
                        <Typography variant='h4' color='text.secondary'>({notes?.total ?? 0})</Typography>
                    </Box>


                    <MoreButton
                        actions={[
                            searchData.sort.map((item, index) => ({
                                ...item,
                                action: () => {
                                    if (search.sort !== index) {
                                        urlParam.changeQuery({
                                            note_s: index,
                                        });
                                    }
                                },
                                selected: search.sort === index,
                            }))
                        ]}
                    >
                        <Typography
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            Sắp xếp: {searchData.sort[search.sort].title}
                            <Icon icon="ArrowDropDown" />
                        </Typography>
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
                                notes.data.map((note) => (
                                    <NoteItem
                                        setChapterAndLessonCurrent={setChapterAndLessonCurrent}
                                        loadNotes={loadNotes}
                                        key={note.id}
                                        note={note} />
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
            title: __('Gân đây nhât'),
            query: 'recent',
        },
        {
            title: __('Thời gian (A-Z)'),
            query: 'time_az',
        },
        {
            title: __('Thời gian (Z-A)'),
            query: 'time_za',
        },
    ],
}