import { Box, Button, Typography } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import Icon from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import MoreButton from 'components/atoms/MoreButton';
import { PaginationProps } from 'components/atoms/TablePagination';
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

    // const [questionDetail, setQuestionDetail] = React.useState<ID | null>(null);

    const urlParams = useQuery({
        question_id: '',
    });

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
        urlParams.changeQuery({
            question_id: id
        });
    }

    const [activePostQuestion, setActivePostQuestion] = React.useState(false);

    const paginate = usePaginate<QuestionAndAnswerProps>({
        name: 'qal',
        template: 'page',
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
    }, [search]);

    React.useEffect(() => {
        if (search.type === 1 && !urlParams.query.question_id) {
            handleOnLoadQA();
        }
    }, [chapterAndLessonCurrent]);

    const handleOnLoadQA = async () => {
        setLoading(true);

        const qaListDB = elearningService.qa.get({
            ...paginate.data,
            postID: course.id,
            lessonID: chapterAndLessonCurrent.lessonID,
            ...search,
        });

        Promise.all([qaListDB, new Promise(s => setTimeout(s, 500))]).then(([qaListDB]) => {
            setQAList(qaListDB);
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

                // if (qaList === null || isLoading || paginate.isLoading) {
                //     return <SkeletonQAList />;
                // }

                if (activePostQuestion) {
                    return <FormPostQuestion handleOnLoadQA={handleOnLoadQA} chapterAndLessonCurrent={chapterAndLessonCurrent} course={course} onBack={() => setActivePostQuestion(false)} />
                }

                if (urlParams.query.question_id) {
                    return <QuestionDetail handleOnLoadQA={handleOnLoadQA} course={course} chapterAndLessonCurrent={chapterAndLessonCurrent} onBack={() => urlParams.changeQuery({ question_id: '' })} questionID={urlParams.query.question_id} />
                }

                return (
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
                        {
                            qaList === null &&
                            <SkeletonQAList />
                        }
                        {
                            Boolean(qaList === null || isLoading || paginate.isLoading) &&
                            <>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -24,
                                        left: -24,
                                        right: -24,
                                        bottom: -24,
                                        backgroundColor: 'dividerDark',
                                        opacity: 0.3,
                                        zIndex: 2,
                                    }}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        position: 'absolute',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        zIndex: 3,
                                    }}
                                >
                                    <Loading isWarpper open={true} />
                                </Box>
                            </>
                        }

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
                                            placeholder: search.type == 0 ? __('Tìm kiếm tất cả các câu hỏi về khóa học') : __('Tìm kiếm các câu hỏi về bài giảng này'),
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
                                            selected: search.filter[index],
                                            icon: search.filter[index] ? 'Check' : 'empty',
                                        }))
                                    ]}
                                >
                                    <Button
                                        variant='outlined'
                                        disableRipple
                                        color='inherit'
                                        endIcon={<Icon icon="ArrowDropDown" />}
                                    >
                                        {__('Lọc câu hỏi')}
                                    </Button>
                                </MoreButton>
                            </Box>
                        </Box>
                        {
                            qaList && qaList?.total > 0 ?
                                <>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                        }}
                                    >
                                        <Typography variant='h4'>{search.type === 0 ? __('Tất cả các câu hỏi trong khóa học này') : __('Tất cả các câu hỏi trong bài giảng này')}</Typography>
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
                                                <QuestionAndAnswerItem key={index} handleChooseQuestion={handleChooseQuestion} QAItem={item} />
                                            ))
                                        }
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                mt: 4,
                                            }}
                                        >
                                            {
                                                Boolean(qaList?.total) &&
                                                paginate.component
                                            }
                                        </Box>
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
                                                <Typography variant='h4'>{__('Thử tìm kiếm các từ khóa khác nhau hoặc điều chỉnh bộ lọc của bạn')}</Typography>
                                                :
                                                <Typography variant='h4'>{__('Chưa có câu hỏi nào được tạo trong khóa học này.')}</Typography>
                                        }
                                    </Box>
                                </>

                        }

                        <Button
                            variant='outlined'
                            disableRipple
                            onClick={() => setActivePostQuestion(true)}
                        >
                            {__('Đặt một câu hỏi mới')}
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
            title: __('Săp xêp theo gân đây nhât'),
            query: 'recent',
        },
        {
            title: __('Sắp xếp theo lượt bình chọn'),
            query: 'upvoted',
        },
        {
            title: __('Sắp xếp theo khuyến nghị'),
            query: 'recommended',
        }
    ],
    filter: [
        {
            title: __('Câu hỏi tôi đang theo dõi'),
            query: 'i_following',
        },
        {
            title: __('Câu hỏi tôi đã hỏi'),
            query: 'i_asked',
        },
        {
            title: __('Câu hỏi không có câu trả lời'),
            query: 'without_responses',
        }
    ]
}


export default SectionQA