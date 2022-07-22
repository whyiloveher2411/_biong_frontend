import { Box, Button, Typography } from '@mui/material';
import FieldForm from 'components/atoms/fields/FieldForm';
import Icon from 'components/atoms/Icon';
import MoreButton from 'components/atoms/MoreButton';
import { PaginationProps } from 'components/atoms/TablePagination';
import NoticeContent from 'components/molecules/NoticeContent';
import { __ } from 'helpers/i18n';
import { UsePaginateProps } from 'hook/usePaginate';
import React from 'react';
import { ChapterAndLessonCurrentState, CourseProps } from 'services/courseService';
import { QuestionAndAnswerProps } from 'services/elearningService/@type';
import QuestionAndAnswerItem from './QuestionAndAnswerItem';
import QuestionDetail from './QuestionDetail';

function ListContent({
    course, chapterAndLessonCurrent, qaList, paginate, handleActivePostQA
}: {
    course: CourseProps,
    chapterAndLessonCurrent: ChapterAndLessonCurrentState,
    qaList: PaginationProps<QuestionAndAnswerProps>,
    paginate: UsePaginateProps,
    handleActivePostQA: () => void,
}) {

    const [questionDetail, setQuestionDetail] = React.useState<ID | null>(null);

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

    if (questionDetail) {
        return <QuestionDetail course={course} chapterAndLessonCurrent={chapterAndLessonCurrent} onBack={() => setQuestionDetail(null)} questionID={questionDetail} />
    }

    if (qaList.total > 0) {
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
                                    placeholder: __('Search all course questions')
                                }
                            }}
                            post={search}
                            name="query"
                            onReview={(value) => {
                                setSearch(prev => ({ ...prev, query: value }))
                            }}
                        />
                        <Button
                            variant='contained'
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
                        qaList?.data.length ?
                            qaList?.data.map((item, index) => (
                                <QuestionAndAnswerItem handleChooseQuestion={handleChooseQuestion} QAItem={item} key={index} />
                            ))
                            :
                            <Typography variant='h4'>{__('Chưa có câu hỏi nào được tạo trong khóa học này.')}</Typography>
                    }
                    {
                        Boolean(qaList?.total) &&
                        paginate.component
                    }
                </Box>
                <Button
                    variant='outlined'
                    onClick={handleActivePostQA}
                >
                    {__('Ask a new question')}
                </Button>
            </Box>
        )
    }

    return (
        <NoticeContent
            title={__('Không tìm thấy câu hỏi')}
            description={__('Chưa có câu hỏi nào được tạo trong khóa học này')}
            image="/images/undraw_empty_xct9.svg"
            disableButtonHome
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 3,
                }}
            >
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleActivePostQA}
                >
                    {__('Create first question')}
                </Button>
            </Box>
        </NoticeContent>
    )
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

export default ListContent