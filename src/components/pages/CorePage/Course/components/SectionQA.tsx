import { Box, Button, IconButton, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FieldForm from 'components/atoms/fields/FieldForm';
import Icon from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import MoreButton from 'components/atoms/MoreButton';
import { PaginationProps } from 'components/atoms/TablePagination';
import NoticeContent from 'components/molecules/NoticeContent';
// import NoticeContent from 'components/molecules/NoticeContent';
import { __ } from 'helpers/i18n';
import usePaginate from 'hook/usePaginate';
import useQuery from 'hook/useQuery';
import React from 'react';
import { ChapterAndLessonCurrentState, CourseProps } from 'services/courseService';
import elearningService from 'services/elearningService';
import { QuestionAndAnswerProps } from 'services/elearningService/@type';
import FormPostQuestion from './SectionQA/FormPostQuestion';
import QuestionAndAnswerItem from './SectionQA/QuestionAndAnswerItem';
import QuestionDetail from './SectionQA/QuestionDetail';
import SkeletonQAList from './SectionQA/SkeletonQAList';

function SectionQA({
    course,
    chapterAndLessonCurrent
}: {
    course: CourseProps,
    chapterAndLessonCurrent: ChapterAndLessonCurrentState
}) {

    const [qaList, setQAList] = React.useState<PaginationProps<QuestionAndAnswerProps> | null>(null);

    const [questionDetail, setQuestionDetail] = React.useState<QuestionAndAnswerProps | null>(null);

    const urlParams = useQuery({
        question_id: '',
        active_post_question: '0',
        qa_query: '',
        qa_type: 1,
        qa_sort: 0,
        qa_filter: '{}',
    });

    const [isLoading, setLoading] = React.useState(false);

    // const typingTimer = React.useRef<NodeJS.Timeout>();

    const [search, setSearch] = React.useState<{
        query: string,
        type: number,
        sort: number,
        filter: { [key: number]: boolean },
    }>({
        query: urlParams.query.qa_query + '',
        type: Number(urlParams.query.qa_type) ?? 1,
        sort: Number(urlParams.query.qa_sort) ?? 0,
        filter: (() => {
            if (typeof urlParams.query.qa_filter === 'string') {
                try {
                    return JSON.parse(urlParams.query.qa_filter);
                } catch (error) {
                    return {}
                }
            }

            return {}
        })(),
    });

    const listQaRef = React.useRef(null);

    const paginate = usePaginate<QuestionAndAnswerProps>({
        name: 'qal',
        template: 'page',
        // scrollToELementAfterChange: listQaRef,
        onChange: async () => {
            handleOnLoadQA();
        },
        pagination: qaList,
        data: {
            current_page: 0,
            per_page: 10
        }
    });
    // React.useEffect(() => {
    //     handleOnLoadQA();
    // }, [search]);


    React.useEffect(() => {
        if (search.type === 1) {
            paginate.set(prev => ({ ...prev, current_page: 0, loadData: true }));
            // handleOnLoadQA();
        }
    }, [chapterAndLessonCurrent]);

    React.useEffect(() => {
        paginate.set(prev => ({ ...prev, current_page: 0, loadData: true }));
    }, []);

    const handleOnChooseQuestion = (question: QuestionAndAnswerProps) => {
        setQuestionDetail(question);
        urlParams.changeQuery({ question_id: question.id });
    }

    const handleOnLoadQA = async () => {
        setLoading(true);

        const qaListDB = elearningService.qa.get({
            ...paginate.data,
            postID: course.id,
            lessonID: chapterAndLessonCurrent.lessonID,
            ...search,
        });

        Promise.all([qaListDB]).then(([qaListDB]) => {
            setQAList(qaListDB);

            if (qaListDB && Number(urlParams.query.question_id)) {
                const index = qaListDB.data.findIndex(item => (item.id + '') === (urlParams.query.question_id + ''));

                if (index > -1) {
                    setQuestionDetail(qaListDB.data[index]);
                }
            }
            setLoading(false);
        })
    }

    return <Box
        sx={{
            maxWidth: 800,
            margin: '0 auto',
        }}
    >
        {
            (() => {

                return (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        {
                            qaList === null ?
                                <SkeletonQAList />
                                :
                                <Box>
                                    <Button
                                        variant='contained'
                                        disableRipple
                                        sx={{
                                            mb: 2,
                                        }}
                                        onClick={() => urlParams.changeQuery({ active_post_question: '1' })}
                                    >
                                        {__('Đặt một câu hỏi mới')}
                                    </Button>
                                </Box>
                        }

                        <Loading isCover open={qaList === null || isLoading || paginate.isLoading} sx={{
                            top: -24,
                            left: -24,
                            right: -24,
                            bottom: -24,
                        }} />
                        {
                            qaList !== null &&
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    mb: 7,
                                }}
                            >

                                <FieldForm
                                    component='text'
                                    config={{
                                        title: undefined,
                                        inputProps: {
                                            placeholder: __('Tìm kiếm tất cả các câu hỏi'),
                                            endAdornment: <IconButton
                                                onClick={() => {
                                                    handleOnLoadQA();
                                                }}
                                            >
                                                <Icon icon="Search" />
                                            </IconButton>,
                                            onKeyUp: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                                if (e.key === 'Enter') {
                                                    handleOnLoadQA();
                                                }
                                            },
                                            // onKeyUp: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                            //     if (typingTimer.current) {
                                            //         clearTimeout(typingTimer.current);
                                            //     }
                                            //     typingTimer.current = setTimeout(() => {
                                            //         setSearch(prev => ({ ...prev, query: (e.target as HTMLInputElement).value }));
                                            //         paginate.set(prev => ({ ...prev, current_page: 0, loadData: true }));
                                            //     }, timeTyping);
                                            // },
                                            // onKeyDown: () => {
                                            //     if (typingTimer.current) {
                                            //         clearTimeout(typingTimer.current);
                                            //     }
                                            // },
                                        }
                                    }}
                                    post={search}
                                    name="query"
                                    onReview={(value) => {
                                        setSearch(prev => ({ ...prev, query: value }));
                                        // paginate.set(prev => ({ ...prev, current_page: 0, loadData: true }));
                                    }}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        gap: 2,
                                        width: '100%',
                                    }}
                                >
                                    <FormGroup
                                        sx={{
                                            flexDirection: 'row',
                                        }}
                                    >
                                        {
                                            searchData.filter.map((item, index) => (
                                                <FormControlLabel key={index} control={<Checkbox
                                                    checked={search.filter[index] ? true : false}
                                                    onChange={() => {
                                                        setSearch(prev => {
                                                            const filters = {
                                                                ...prev.filter,
                                                                [index]: !prev.filter[index]
                                                            };
                                                            urlParams.changeQuery({ qa_filter: JSON.stringify(filters) });
                                                            return {
                                                                ...prev,
                                                                filter: filters
                                                            };
                                                        });
                                                        paginate.set(prev => ({ ...prev, current_page: 0 }));
                                                    }}
                                                />} label={item.title} />
                                            ))
                                        }
                                    </FormGroup>
                                </Box>
                            </Box>
                        }

                        {
                            qaList !== null &&
                            <>

                                <Box
                                    ref={listQaRef}
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
                                            Tất cả các câu hỏi trong
                                        </Typography>
                                        &nbsp;

                                        <MoreButton
                                            actions={[
                                                searchData.type.map((item, index) => ({
                                                    ...item,
                                                    action: () => {
                                                        if (search.type !== index) {
                                                            setSearch(prev => ({ ...prev, type: index }));
                                                            urlParams.changeQuery({ qa_type: index });
                                                            paginate.set(prev => ({ ...prev, current_page: 0 }));
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
                                                    marginBottom: '-1px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {search.type === 0 ? __('khóa học này') : __('bài giảng này')}
                                                <Icon icon="ArrowDropDown" />
                                            </Typography>
                                        </MoreButton>
                                        &nbsp;&nbsp;
                                        <Typography variant='h4' color='text.secondary'>({qaList?.total ?? 0})</Typography>

                                    </Box>

                                    <MoreButton
                                        actions={[
                                            searchData.sort.map((item, index) => ({
                                                ...item,
                                                action: () => {
                                                    if (search.sort !== index) {
                                                        urlParams.changeQuery({ qa_sort: index });
                                                        setSearch(prev => ({ ...prev, sort: index }));
                                                        paginate.set(prev => ({ ...prev, current_page: 0 }));
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
                                {qaList?.total > 0 ?
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 4,
                                        }}
                                    >
                                        {
                                            qaList?.data.map((item, index) => (
                                                <QuestionAndAnswerItem
                                                    key={item.id}
                                                    QAItem={item}
                                                    handleOnChooseQuestion={handleOnChooseQuestion}
                                                    setQuestion={(callback) => {
                                                        const question = callback(item);
                                                        setQAList((prev) => {
                                                            if (prev) {
                                                                const index = prev.data.findIndex(item => (item.id + '') === (question.id) + '');
                                                                if (index > -1) {
                                                                    prev.data[index] = question;

                                                                    return { ...prev };
                                                                }
                                                            } else {
                                                                return prev;
                                                            }
                                                            return null;
                                                        })
                                                    }}
                                                />
                                            ))
                                        }
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            {
                                                Boolean(qaList?.total) &&
                                                paginate.component
                                            }
                                        </Box>
                                    </Box>
                                    :
                                    <Box sx={{ mb: 4 }}>
                                        <NoticeContent
                                            title={__('Bạn không tìm thấy nội dung mình muốn?')}
                                            variantDescription='h5'
                                            description={
                                                search.query || search.type > 0 ?
                                                    __('Thử tìm kiếm các từ khóa khác nhau hoặc điều chỉnh bộ lọc của bạn')
                                                    :
                                                    __('Hãy để lại câu hỏi trong biểu mẫu phản hồi của chúng tôi.')
                                            }
                                            image='/images/undraw_no_data_qbuo.svg'
                                            disableButtonHome
                                        />
                                    </Box>
                                }
                            </>
                        }
                    </Box>
                )
            })()
        }

        <FormPostQuestion
            handleOnLoadQA={handleOnLoadQA}
            chapterAndLessonCurrent={chapterAndLessonCurrent}
            course={course}
        />

        <QuestionDetail
            onClose={() => { setQuestionDetail(null); urlParams.changeQuery({ question_id: 0 }); }}
            questionDetail={questionDetail}
            course={course}
            chapterAndLessonCurrent={chapterAndLessonCurrent}
            setQuestion={(callback) => {
                if (questionDetail && qaList) {
                    const question = callback(questionDetail);
                    setQuestionDetail(question);
                    setQAList(prev => {

                        if (prev) {
                            const index = qaList.data.findIndex(item => (item.id + '') === (question.id) + '');

                            if (index > -1) {
                                prev.data[index] = question;
                                return { ...prev };
                            }

                            return prev;
                        }
                        return null;
                    });
                }
            }}
        />
    </Box >
}


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
            title: __('Gần đây nhât'),
            query: 'recent',
            description: 'Hiển thị câu hỏi từ mới nhất đến cũ nhất.',
        },
        {
            title: __('Sự quan tâm'),
            description: 'Hiển thị câu hỏi có nhiều lượt tương tác nhất.',
            query: 'upvoted',
        },
        {
            title: __('Số bình luận'),
            description: 'Hiển thị câu hỏi nhiều thảo luận nhất.',
            query: 'comment_count',
        },
    ],
    filter: [
        {
            title: __('Tôi đang theo dõi'),
            query: 'i_following',
        },
        {
            title: __('Câu hỏi của tôi'),
            query: 'i_asked',
        },
        {
            title: __('Không có câu trả lời'),
            query: 'without_responses',
        }
    ]
}


export default SectionQA