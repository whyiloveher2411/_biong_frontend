import { Box, Button, Typography } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import Icon from 'components/atoms/Icon';
import MoreButton from 'components/atoms/MoreButton';
import { PaginationProps } from 'components/atoms/TablePagination';
// import NoticeContent from 'components/molecules/NoticeContent';
import { __ } from 'helpers/i18n';
import usePaginate from 'hook/usePaginate';
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

    const [questionDetail, setQuestionDetail] = React.useState<ID | null>(null);

    const [isLoading, setLoading] = React.useState(false);

    const timeTyping = 300;
    const typingTimer = React.useRef<NodeJS.Timeout>();

    const [search, setSearch] = React.useState<{
        query: string,
        type: number,
        sort: number,
        filter: { [key: number]: boolean },
    }>({
        query: '',
        type: 0,
        sort: 2,
        filter: {},
    });

    const handleChooseQuestion = (id: ID) => () => {
        setQuestionDetail(id);
    }

    const [activePostQuestion, setActivePostQuestion] = React.useState(false);

    const paginate = usePaginate<QuestionAndAnswerProps>({
        name: 'qal',
        onChange: async () => {
            handleOnLoadQA();
        },
        pagination: qaList,
        data: {
            current_page: 0,
            per_page: 10
        }
    });

    React.useEffect(() => {
        handleOnLoadQA();
    }, [search, chapterAndLessonCurrent]);

    const handleOnLoadQA = () => {
        setLoading(true);
        (async () => {
            const qaListDB = await elearningService.qa.get({
                ...paginate.data,
                postID: course.id,
                lessonID: chapterAndLessonCurrent.lessonID,
                ...search,
            });
            setQAList(qaListDB);
            setLoading(false);
        })()
    }

    return <Box
        sx={{
            maxWidth: 800,
            margin: '0 auto',
        }}
    >
        {
            (() => {

                if (qaList === null || isLoading || paginate.isLoading) {
                    return <SkeletonQAList />;
                }

                if (activePostQuestion) {
                    return <FormPostQuestion handleOnLoadQA={handleOnLoadQA} chapterAndLessonCurrent={chapterAndLessonCurrent} course={course} onBack={() => setActivePostQuestion(false)} />
                }

                if (questionDetail) {
                    return <QuestionDetail course={course} chapterAndLessonCurrent={chapterAndLessonCurrent} onBack={() => setQuestionDetail(null)} questionID={questionDetail} />
                }

                return (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    width: '100%',
                                }}
                            >
                                <FieldForm
                                    component='text'
                                    config={{
                                        title: undefined,
                                        inputProps: {
                                            placeholder: __('Search all course questions'),
                                            onKeyUp: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                                if (typingTimer.current) {
                                                    clearTimeout(typingTimer.current);
                                                }
                                                typingTimer.current = setTimeout(() => {
                                                    setSearch(prev => ({ ...prev, query: (e.target as HTMLInputElement).value }));
                                                }, timeTyping);
                                            },
                                            onKeyDown: () => {
                                                if (typingTimer.current) {
                                                    clearTimeout(typingTimer.current);
                                                }
                                            },
                                        }
                                    }}
                                    post={search}
                                    name="query"
                                    onReview={(value) => {
                                        //
                                        // if (typingTimer.current) {
                                        //     clearTimeout(typingTimer.current);
                                        // }
                                        // setSearch(prev => ({ ...prev, query: value }));
                                    }}
                                />
                                <Button
                                    variant='contained'
                                    onClick={() => {
                                        handleOnLoadQA();
                                    }}
                                >
                                    <Icon sx={{ fontSize: 32 }} icon="Search" />
                                </Button>
                            </Box>
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
                                            },
                                        }))
                                    ]}
                                >
                                    <Button
                                        variant='outlined'
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
                                            },
                                        }))
                                    ]}
                                >
                                    <Button
                                        variant='outlined'
                                        color='inherit'
                                        endIcon={<Icon icon="ArrowDropDown" />}
                                    >
                                        {searchData.sort[search.sort].title}
                                    </Button>
                                </MoreButton>
                                <MoreButton
                                    transitionDuration={0}
                                    actions={[
                                        searchData.filter.map((item, index: number) => ({
                                            ...item,
                                            action: () => {
                                                setSearch(prev => ({
                                                    ...prev,
                                                    filter: {
                                                        ...prev.filter,
                                                        [index]: !prev.filter[index]
                                                    }
                                                }))
                                            },
                                            icon: search.filter[index] ? 'Check' : 'empty',
                                        }))
                                    ]}
                                >
                                    <Button
                                        variant='outlined'
                                        color='inherit'
                                        endIcon={<Icon icon="ArrowDropDown" />}
                                    >
                                        {__('Filter questions')}
                                    </Button>
                                </MoreButton>
                            </Box>
                        </Box>
                        {
                            qaList?.total > 0 ?
                                <>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                        }}
                                    >
                                        <Typography variant='h4'>{__('All questions in this course')}</Typography>
                                        <Typography variant='h4' color='text.secondary'>({qaList?.total ?? 0})</Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 4,
                                        }}
                                    >
                                        {
                                            qaList?.data.map((item, index) => (
                                                <QuestionAndAnswerItem handleChooseQuestion={handleChooseQuestion} QAItem={item} key={index} />
                                            ))
                                        }
                                        {
                                            Boolean(qaList?.total) &&
                                            paginate.component
                                        }
                                    </Box>
                                </>
                                :
                                <>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                        }}
                                    >
                                        <Typography variant='h4'>{__('No results')}</Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 4,
                                        }}
                                    >
                                        {
                                            search.query || search.type > 0 ?
                                                <Typography variant='h4'>{__('Try searching different keywords or adjusting your filters')}</Typography>
                                                :
                                                <Typography variant='h4'>{__('Chưa có câu hỏi nào được tạo trong khóa học này.')}</Typography>
                                        }
                                    </Box>
                                </>

                        }

                        <Button
                            variant='outlined'
                            onClick={() => setActivePostQuestion(true)}
                        >
                            {__('Ask a new question')}
                        </Button>
                    </Box>
                )

                // return (
                //     <NoticeContent
                //         title={__('Không tìm thấy câu hỏi')}
                //         description={__('Chưa có câu hỏi nào được tạo trong khóa học này')}
                //         image="/images/undraw_empty_xct9.svg"
                //         disableButtonHome
                //     >
                //         <Box
                //             sx={{
                //                 display: 'flex',
                //                 justifyContent: 'center',
                //                 mt: 3,
                //             }}
                //         >
                //             <Button
                //                 color="primary"
                //                 variant="contained"
                //                 onClick={() => setActivePostQuestion(true)}
                //             >
                //                 {__('Create first question')}
                //             </Button>
                //         </Box>
                //     </NoticeContent>
                // )

            })()
        }
    </Box>
}


const searchData = {
    type: [
        {
            title: __('All lectures'),
            query: 'all',
        },
        {
            title: __('Current lecture'),
            query: 'current_lecture',
        },
    ],
    sort: [
        {
            title: __('Sort by mose recent'),
            query: 'recent',
        },
        {
            title: __('Sort by mose upvoted'),
            query: 'upvoted',
        },
        {
            title: __('Sort by recommended'),
            query: 'recommended',
        }
    ],
    filter: [
        {
            title: __('Question I\'m following'),
            query: 'i_following',
        },
        {
            title: __('Question I asked'),
            query: 'i_asked',
        },
        {
            title: __('Question without responses'),
            query: 'without_responses',
        }
    ]
}


export default SectionQA