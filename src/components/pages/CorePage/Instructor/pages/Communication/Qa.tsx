import { Badge, Box, Button, Card, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import Icon, { IconFormat } from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Label from 'components/atoms/Label';
import Loading from 'components/atoms/Loading';
import MoreButton from 'components/atoms/MoreButton';
import { PaginationProps } from 'components/atoms/TablePagination';
import Tooltip from 'components/atoms/Tooltip';
import FieldForm from 'components/atoms/fields/FieldForm';
import { dateTimefromNow } from 'helpers/date';
import { cssMaxLine } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import usePaginate from 'hook/usePaginate';
import useQuery from 'hook/useQuery';
import moment from 'moment';
import Comments from 'plugins/Vn4Comment/Comments';
import React from 'react';
import { Link } from 'react-router-dom';
import elearningService from 'services/elearningService';
import { QuestionAndAnswerProps } from 'services/elearningService/@type';
import useCourse from '../../useCourse';



function Qa({ setTitle }: { setTitle: (title: string) => void }) {

    const urlParam = useQuery({
        course: 0,
        question: 0,
        unread: 0,
        noAnswer: 0,
        noMyAnser: 0,
        serach: '',
        time: 0,
    });

    const [search, setSearch] = React.useState('');

    const { courses } = useCourse();

    const [questions, setQuestions] = React.useState<PaginationProps<QuestionAndAnswerProps> | null>(null);

    const [questionCurrent, setQuestionCurrent] = React.useState<QuestionAndAnswerProps | null>(null);

    const paginate = usePaginate({
        name: 'i_qa',
        data: { current_page: 0, per_page: 10 },
        enableLoadFirst: true,
        onChange: async (data) => {
            const questionsData = await elearningService.instructor.communication.qa.get(urlParam.query.course, data, {
                noAnswer: (urlParam.query.noAnswer + '') === '1',
                unread: (urlParam.query.unread + '') === '1',
                noMyAnser: (urlParam.query.noMyAnser + '') === '1',
                serach: urlParam.query.serach + '',
            }, timeRange[Number(urlParam.query.time)] ? {
                ...(timeRange[Number(urlParam.query.time)].range()),
            } : {
                ...(timeRange[1].range()),
            });
            setQuestions(questionsData);

            if (questionsData?.data.length && !questionCurrent) {

                let findIndex = 0;

                if (urlParam.query.question) {
                    findIndex = questionsData?.data.findIndex(item => (item.id + '') === (urlParam.query.question + ''));
                }

                if (findIndex < 0) {
                    findIndex = 0;
                }

                urlParam.changeQuery({
                    question: questionsData?.data[findIndex].id
                });
                setQuestionCurrent(questionsData?.data[findIndex]);
            }

        },
        isChangeUrl: true,
        pagination: questions,
    });

    const updateReaded = async (qa_id: ID) => {
        const result = await elearningService.instructor.communication.qa.updateReaded(qa_id);

        paginate.set(prev => ({
            ...prev,
            loadData: true,
        }));

        if (questionCurrent && questionCurrent.id === qa_id) {
            setQuestionCurrent(prev => (prev ? {
                ...prev,
                is_unread: result,
            } : null));
        }
    }

    React.useEffect(() => {

        if (urlParam.query.question && questions && questions.data.length) {

            const indexQuestion = questions.data.findIndex(item => (item.id + '') === (urlParam.query.question + ''));

            if (indexQuestion > -1) {
                setQuestionCurrent(questions.data[indexQuestion]);
            }
        }

    }, [urlParam.query.question]);


    React.useEffect(() => {
        // paginate.set({
        //     current_page: 0,
        //     per_page: 10,
        //     loadData: true,
        // });
        setTitle('Hỏi đáp');

    }, []);

    React.useEffect(() => {
        if (!urlParam.isFirstLoad) {
            (async () => {
                paginate.set({
                    current_page: 0,
                    per_page: 10,
                    loadData: true,
                });
            })();
        }
    }, [
        urlParam.query.course,
        urlParam.query.unread,
        urlParam.query.noAnswer,
        urlParam.query.noMyAnser,
        urlParam.query.serach,
        urlParam.query.time
    ]);

    React.useEffect(() => {
        setSearch(urlParam.query.serach + '');
    }, [urlParam.query.serach]);


    const listSelectCourse = courses ? courses.map((item) => ({
        title: item.title,
        selected: (urlParam.query.course + '') === (item.id + ''),
        action() {
            urlParam.changeQuery({
                course: item.id,
            })
            paginate.set({
                current_page: 0,
                per_page: 10,
            });
        },
    })) : [];

    let indexCourseSelected = -1;

    if (courses && courses?.length > 1) {
        indexCourseSelected = courses.findIndex(item => (item.id + '') === (urlParam.query.course + ''));
        listSelectCourse.unshift({
            title: 'Tất cả khóa học',
            selected: indexCourseSelected === -1,
            action() {
                urlParam.changeQuery({
                    course: 0,
                });
                paginate.set({
                    current_page: 0,
                    per_page: 10,
                });
            },
        });
        if (indexCourseSelected === -1) {
            indexCourseSelected = 0;
        } else {
            indexCourseSelected++;
        }
    } else {
        indexCourseSelected = 0;
    }

    return (<>
        <Typography variant='h2' sx={{
            mb: 4, display: 'flex',
            alignItems: 'center',
            '& .MoreButton-root': {
                display: 'flex',
            }
        }}>
            Q&A
            <MoreButton
                actions={[listSelectCourse]}
            >
                <Button
                    endIcon={<Icon icon="ExpandMoreOutlined" />}
                    sx={{
                        fontSize: 'inherit',
                        padding: 0,
                        marginLeft: 3,
                        textTransform: 'initial',
                        color: 'inherit',
                        lineHeight: 'unset',
                    }}
                >
                    {
                        listSelectCourse[indexCourseSelected]?.title ?? '...'
                    }
                </Button>
            </MoreButton>
        </Typography>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <FormGroup
                sx={{
                    flexDirection: 'row',
                }}
            >
                <FormControlLabel control={<Checkbox checked={(urlParam.query.unread + '') === '1'} onClick={() => urlParam.changeQuery({
                    unread: (urlParam.query.unread + '') === '1' ? 0 : 1
                })} />} label="Chưa đọc" />
                <FormControlLabel control={<Checkbox checked={(urlParam.query.noAnswer + '') === '1'} onClick={() => urlParam.changeQuery({
                    noAnswer: (urlParam.query.noAnswer + '') === '1' ? 0 : 1
                })} />} label="Không có câu trả lời" />
                <FormControlLabel control={<Checkbox checked={(urlParam.query.noMyAnser + '') === '1'} onClick={() => urlParam.changeQuery({
                    noMyAnser: (urlParam.query.noMyAnser + '') === '1' ? 0 : 1
                })} />} label="Không có câu trả lời của tôi" />
            </FormGroup>
            <MoreButton
                actions={[
                    timeRange.map((item, index) => ({
                        title: item.title,
                        selected: (index + '') === (urlParam.query.time + ''),
                        action: () => {
                            urlParam.changeQuery({
                                time: index
                            });
                        }
                    }))
                ]}
            >
                <Button variant='outlined' color='inherit' startIcon={<Icon icon="AccessTimeOutlined" />}>
                    {timeRange[Number(urlParam.query.time)] ? timeRange[Number(urlParam.query.time)].title : '7 Ngày qua'}
                </Button>
            </MoreButton>
        </Box>
        <Card>
            <Box
                sx={{
                    display: 'flex',
                    // border: '1px solid',
                    // borderTop: 0,
                    // borderColor: 'dividerDark',
                    height: 'calc(100vh - 64px - 24px - 64px - 42px - 24px - 24px )',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        width: 400,
                        maxWidth: '100%',
                        flexShrink: 0,
                        borderRight: '1px solid',
                        borderColor: 'dividerDark',
                        position: 'relative',
                    }}
                >
                    <Loading open={paginate.isLoading} isCover />
                    <Box
                        sx={{
                            display: 'flex',
                            borderBottom: '1px solid',
                            borderColor: 'dividerDark',
                            '& .MuiInputBase-root': {
                                borderRadius: '0',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: "none",
                            },
                        }}
                    >
                        <FieldForm
                            component='text'
                            config={{
                                title: false,
                                size: 'small',
                                placeholder: 'Tìm kiêm bằng từ khóa',
                                inputProps: {
                                    onKeyUp: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        if (e.key === 'Enter') {
                                            urlParam.changeQuery({
                                                serach: (e.target as HTMLInputElement).value
                                            });
                                        }
                                    },
                                }
                            }}
                            name="search"
                            post={{ search: search }}
                            onReview={() => {
                                //
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid',
                                borderColor: 'dividerDark',
                                width: 40,
                                borderTop: 0,
                                borderRight: 0,
                                borderBottom: 0,
                                cursor: 'pointer',

                            }}
                        >
                            <Icon sx={{
                                opacity: 0.7,
                                '&:hover': {
                                    opacity: 1,
                                }
                            }} icon="SearchOutlined" />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            height: 'calc(100% - 40px - 52px)',
                            overflow: 'auto',
                            borderBottom: '1px solid',
                            borderColor: 'dividerDark',
                        }}
                    >
                        {
                            questions?.data.map((QAItem, index) => (
                                <Box
                                    key={QAItem.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: 2,
                                        padding: 2,
                                        borderBottom: (index + 1) < questions?.data.length ? '1px solid' : '',
                                        borderColor: 'dividerDark',
                                        cursor: 'pointer',
                                        backgroundColor: questionCurrent?.id === QAItem.id ? 'divider' : 'unset',
                                        '&:hover': {
                                            backgroundColor: 'divider',
                                        },
                                    }}
                                    onClick={() => {
                                        urlParam.changeQuery({
                                            question: QAItem.id
                                        })
                                    }}
                                >
                                    <Box>
                                        <ImageLazyLoading
                                            src={getImageUrl(QAItem.author?.avatar, '/images/user-default.svg')}
                                            sx={{
                                                width: 54,
                                                height: 54,
                                                borderRadius: '50%',
                                                flexShrink: 0,
                                            }} />
                                    </Box>
                                    <Box
                                        sx={{
                                            width: '100%',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                ...cssMaxLine(3)
                                            }}
                                        >
                                            {QAItem.title}
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <Typography variant='subtitle2'>{QAItem.author?.title}</Typography>
                                            <Typography variant='body2'>{dateTimefromNow(QAItem.created_at)}</Typography>

                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mt: 0.5,
                                            }}
                                        >
                                            <Icon sx={{ color: 'text.secondary', fontSize: 16, }} icon="InsertCommentOutlined" /> &nbsp;{QAItem.comment_count}
                                            &nbsp;&nbsp;&nbsp;
                                            <Icon sx={{ color: 'text.secondary', fontSize: 16, }} icon="ArrowUpwardRounded" /> &nbsp;{QAItem.vote_count ?? 0}

                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            flexShrink: 0,
                                            width: 12,
                                            height: 12,
                                            opacity: Number(QAItem.is_unread) === 1 ? 1 : 0,
                                            borderRadius: '50%',
                                            backgroundColor: 'primary.main'
                                        }}
                                    />
                                </Box>
                            ))
                        }
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        {
                            paginate.component
                        }
                    </Box>
                </Box>

                <Box
                    sx={{
                        width: '100%',
                    }}
                >


                    {(() => {

                        if (questionCurrent) {

                            // const index = questions.data.findIndex(item => (item.id + '') === (urlParam.query.question + ''));

                            // if (index > -1) {

                            const courseIndex = courses ? courses.findIndex(item => (item.id + '') === (questionCurrent.course + '')) : -1;


                            return <>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        padding: 1,
                                        borderBottom: '1px solid',
                                        borderColor: 'dividerDark',
                                    }}
                                >
                                    <ImageLazyLoading src={getImageUrl(courses?.[courseIndex].featured_image)} sx={{
                                        width: 50,
                                        height: 50,
                                        flexShrink: 0,
                                    }} />
                                    <Box
                                        sx={{
                                            width: '100%',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                ...cssMaxLine(1)
                                            }}
                                        >{questionCurrent.is_incognito ? __('Câu hỏi ẩn danh trong khóa học') : __('Câu hỏi công khai trong khóa học')}&nbsp;
                                            <Typography sx={{ color: 'link' }} component={Link} to={"/instructor/courses/" + courses?.[courseIndex].id}>{courseIndex > -1 ? courses?.[courseIndex].title : ''}</Typography>
                                        </Typography>
                                        <Typography variant='body2'>Câu hỏi được đặt trong bài học&nbsp;
                                            <Typography sx={{ color: 'link' }} component={Link} to={"/instructor/courses/" + courses?.[courseIndex].id}>{questionCurrent.lesson?.title}</Typography>
                                        </Typography>
                                    </Box>
                                    {
                                        Boolean(questionCurrent.is_unread) &&
                                        <Label
                                            sx={{
                                                flexShrink: 0,
                                            }}
                                        >Chưa đọc</Label>
                                    }
                                    <Box
                                        sx={{
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <MoreButton
                                            actions={[
                                                [
                                                    {
                                                        title: questionCurrent.is_unread ? 'Đánh dấu đã đọc' : 'Đánh dấu chưa đọc',
                                                        action() {
                                                            updateReaded(questionCurrent.id);
                                                        },
                                                    }
                                                ]
                                            ]}
                                        />
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        height: 'calc(100% - 50px)',
                                        overflow: 'auto',
                                        padding: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            mb: 5,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                p: '3px',
                                                width: 54,
                                                height: 54,
                                            }}
                                        >
                                            <ImageLazyLoading
                                                src={getImageUrl(questionCurrent.author?.avatar, '/images/user-default.svg')}
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: '50%',
                                                }}
                                            />
                                        </Box>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Typography
                                                        variant='h5'
                                                    >
                                                        {questionCurrent.title}
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            gap: 1,
                                                            mt: 1,
                                                            mb: 2,
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Typography>{questionCurrent.author?.title}</Typography>
                                                        · <Typography
                                                            sx={{
                                                                ...cssMaxLine(1),
                                                                maxWidth: '50%'
                                                            }}>{questionCurrent.lesson?.title}</Typography>
                                                        · <span>{dateTimefromNow(questionCurrent.created_at)}</span>
                                                    </Box>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <Button endIcon={<Icon icon='ArrowUpwardRounded' />}>{questionCurrent.vote_count ?? 0}</Button>
                                                </Box>
                                            </Box>
                                            <div dangerouslySetInnerHTML={{ __html: questionCurrent.content }} />
                                        </Box>
                                    </Box>
                                    <Comments
                                        keyComment={questionCurrent.id}
                                        type="vn4_comment_course_qa"
                                        followType='vn4_elearning_course_qa_follow'
                                        activeVote
                                        disableUpdateUnread={true}
                                        customAvatar={(comment, level) => {

                                            let label: {
                                                title?: string | undefined;
                                                icon?: IconFormat | undefined;
                                                color: string;
                                            };

                                            // if (comment.author) {
                                            //     if ((course.course_detail?.owner + '') === (comment.author.id + '')) {
                                            //         label = getLabelProp('Product Owner');
                                            //     } else if (instructors[comment.author.id] !== undefined) {
                                            //         label = getLabelProp(instructors[comment.author.id].position);
                                            //     } else {
                                            //         label = getLabelProp('Student');
                                            //     }
                                            // } else {
                                            label = getLabelProp('Student');
                                            // }

                                            const style = level > 1 ? {
                                                avatarWraper: 30,
                                                avatar: 24,
                                                line2: {
                                                    left: 14,
                                                    top: 33,
                                                },
                                            } : {
                                                avatarWraper: 54,
                                                avatar: 48,
                                                line2: {
                                                    left: 27,
                                                    top: 59,
                                                },
                                            };

                                            return <Box
                                                sx={{
                                                    borderRadius: '50%',
                                                    p: '3px',
                                                    width: style.avatarWraper,
                                                    height: style.avatarWraper,
                                                    cursor: 'pointer',
                                                    background: label.color,
                                                    '& .MuiBadge-badge': {
                                                        top: level === 1 ? 40 : 20,
                                                        width: 20,
                                                        height: 20,
                                                        background: label.color,
                                                        color: 'white',
                                                    }
                                                }}
                                            >
                                                {
                                                    label.title ?
                                                        <Tooltip title={label.title}>
                                                            <Badge badgeContent={label.icon ? <Icon sx={{ width: 16 }} icon={label.icon} /> : <></>}>
                                                                <ImageLazyLoading src={getImageUrl(comment.author?.avatar, '/images/user-default.svg')} sx={{
                                                                    width: style.avatar,
                                                                    height: style.avatar,
                                                                    borderRadius: '50%',
                                                                }} />
                                                            </Badge>
                                                        </Tooltip>
                                                        :
                                                        <Badge badgeContent={label.icon ? <Icon sx={{ width: 16 }} icon={label.icon} /> : <></>}>
                                                            <ImageLazyLoading src={getImageUrl(comment.author?.avatar, '/images/user-default.svg')} sx={{
                                                                width: style.avatar,
                                                                height: style.avatar,
                                                                borderRadius: '50%',
                                                            }} />
                                                        </Badge>
                                                }
                                            </Box>
                                        }}
                                    />
                                </Box>
                            </>
                            // }
                        }
                    })()}
                </Box>
            </Box>
        </Card>
    </>)
}

export default Qa



const getLabelProp = (type: string): {
    title?: string,
    icon?: IconFormat,
    color: string,
} => {
    switch (type) {
        case 'Teacher':
            return {
                title: __('Giảng viên'),
                icon: 'BookmarksOutlined',
                color: '#ed6c02',
            };
        case 'Mentor':
            return {
                title: __('Trợ giảng'),
                icon: 'PriorityHighRounded',
                color: '#3f51b5',
            };
        case 'Product Owner':
            return {
                title: __('Chủ sở hữu khóa học'),
                icon: 'Star',
                color: '#8204d9',
            };
        default:
            return {
                color: 'transparent',
            };
    }
}


const timeRange = [
    {
        title: __('Tất cả'),
        range: () => {
            return {
                startDate: '-1',
                endDate: '-1',
            }
        }
    },
    {
        title: __('Hôm nay'),
        range: () => {
            const objMoment = moment();
            return {
                endDate: objMoment.format('YYYY-MM-DD 23:59:59'),
                startDate: objMoment.format('YYYY-MM-DD 00:00:00'),
            }
        }
    },
    {
        title: __('7 ngày qua'),
        range: () => {
            const objMoment = moment();
            return {
                endDate: objMoment.subtract(1, 'days').format('YYYY-MM-DD 23:59:59'),
                startDate: objMoment.subtract(6, 'days').format('YYYY-MM-DD 00:00:00'),
            }
        }
    },
    {
        title: __('30 ngày qua'),
        range: () => {
            const objMoment = moment();
            return {
                endDate: objMoment.subtract(1, 'days').format('YYYY-MM-DD 23:59:59'),
                startDate: objMoment.subtract(29, 'days').format('YYYY-MM-DD 00:00:00'),
            }
        }
    },
    {
        title: __('60 ngày qua'),
        range: () => {
            const objMoment = moment();
            return {
                endDate: objMoment.subtract(1, 'days').format('YYYY-MM-DD 23:59:59'),
                startDate: objMoment.subtract(59, 'days').format('YYYY-MM-DD 00:00:00'),
            }
        }
    },
    {
        title: __('90 ngày qua'),
        range: () => {
            const objMoment = moment();
            return {
                endDate: objMoment.subtract(1, 'days').format('YYYY-MM-DD 23:59:59'),
                startDate: objMoment.subtract(89, 'days').format('YYYY-MM-DD 00:00:00'),
            }
        }
    },
    {
        title: __('Trong năm qua'),
        range: () => {
            const objMoment = moment();
            return {
                endDate: objMoment.subtract(1, 'days').format('YYYY-MM-DD 23:59:59'),
                startDate: objMoment.subtract(354, 'days').format('YYYY-MM-DD 00:00:00'),
            }
        }
    },

];