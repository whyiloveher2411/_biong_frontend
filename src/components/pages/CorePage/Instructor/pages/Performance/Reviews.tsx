import { Rating } from '@mui/lab';
import { Box, Button, Card, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Label from 'components/atoms/Label';
import Loading from 'components/atoms/Loading';
import MoreButton from 'components/atoms/MoreButton';
import { PaginationProps } from 'components/atoms/TablePagination';
import FieldForm from 'components/atoms/fields/FieldForm';
import { dateTimefromNow } from 'helpers/date';
import { cssMaxLine } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import usePaginate from 'hook/usePaginate';
import useQuery from 'hook/useQuery';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { ReviewItemProps } from 'services/courseService';
import elearningService from 'services/elearningService';
import useCourse from '../../useCourse';



function Reviews({ setTitle }: { setTitle: (title: string) => void }) {

    const urlParam = useQuery({
        course: 0,
        review: 0,
        unread: 1,
        noAnswer: 0,
        noMyAnser: 0,
        serach: '',
        time: 0,
    });

    const [search, setSearch] = React.useState('');

    const { courses } = useCourse();

    const [reviews, setReviews] = React.useState<PaginationProps<ReviewItemProps> | null>(null);

    const [reviewCurrent, setReviewCurrent] = React.useState<ReviewItemProps | null>(null);

    const paginate = usePaginate({
        name: 'i_qa',
        data: { current_page: 0, per_page: 10 },
        enableLoadFirst: true,
        onChange: async (data) => {
            const reviewsData = await elearningService.instructor.performance.reviews.get(urlParam.query.course, data, {
                noAnswer: (urlParam.query.noAnswer + '') === '1',
                unread: (urlParam.query.unread + '') === '1',
                noMyAnser: (urlParam.query.noMyAnser + '') === '1',
                serach: urlParam.query.serach + '',
            }, timeRange[Number(urlParam.query.time)] ? {
                ...(timeRange[Number(urlParam.query.time)].range()),
            } : {
                ...(timeRange[1].range()),
            });
            setReviews(reviewsData);

            if (reviewsData?.data.length && !reviewCurrent) {

                let findIndex = 0;

                if (urlParam.query.review) {
                    findIndex = reviewsData?.data.findIndex(item => (item.id + '') === (urlParam.query.review + ''));
                }

                if (findIndex < 0) {
                    findIndex = 0;
                }

                urlParam.changeQuery({
                    review: reviewsData?.data[findIndex].id
                });
                setReviewCurrent(reviewsData?.data[findIndex]);
            }

        },
        isChangeUrl: true,
        pagination: reviews,
    });


    const updateStatus = async (review_id: ID, status: string) => {

        const result = await elearningService.instructor.performance.reviews.updateStatus(review_id, status as ReviewStatus);

        paginate.set(prev => ({
            ...prev,
            loadData: true,
        }));

        if (result && reviewCurrent && reviewCurrent.id === review_id) {
            setReviewCurrent(prev => (prev ? {
                ...prev,
                review_status: result
            } : null));
        }
    }


    React.useEffect(() => {

        if (urlParam.query.review && reviews && reviews.data.length) {

            const indexreview = reviews.data.findIndex(item => (item.id + '') === (urlParam.query.review + ''));

            if (indexreview > -1) {
                setReviewCurrent(reviews.data[indexreview]);
            }
        }

    }, [urlParam.query.review]);


    React.useEffect(() => {
        // paginate.set({
        //     current_page: 0,
        //     per_page: 10,
        //     loadData: true,
        // });

        setTitle('Đánh giá');
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
            Đánh giá
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
                mb: 1,
            }}
        >
            <Box>

            </Box>
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
                            reviews?.data.map((QAItem, index) => (
                                <Box
                                    key={QAItem.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: 2,
                                        padding: 2,
                                        borderBottom: (index + 1) < reviews?.data.length ? '1px solid' : '',
                                        borderColor: 'dividerDark',
                                        cursor: 'pointer',
                                        backgroundColor: reviewCurrent?.id === QAItem.id ? 'divider' : 'unset',
                                        '&:hover': {
                                            backgroundColor: 'divider',
                                        },
                                    }}
                                    onClick={() => {
                                        urlParam.changeQuery({
                                            review: QAItem.id
                                        })
                                    }}
                                >
                                    <Box>
                                        <ImageLazyLoading
                                            src={getImageUrl(QAItem.customer?.avatar, '/images/user-default.svg')}
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
                                            {QAItem.detail}
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <Typography variant='subtitle2'>{QAItem.customer?.title}</Typography>
                                            <Typography variant='body2'>{dateTimefromNow(QAItem.created_at)}</Typography>

                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mt: 0.5,
                                            }}
                                        >
                                            <Rating name="read-only" value={QAItem.rating} readOnly />
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            flexShrink: 0,
                                            width: 12,
                                            height: 12,
                                            opacity: 1,
                                            borderRadius: '50%',
                                            backgroundColor: statusColor[QAItem.review_status].color
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

                        if (reviewCurrent) {

                            // const index = reviews.data.findIndex(item => (item.id + '') === (urlParam.query.review + ''));

                            // if (index > -1) {

                            const courseIndex = courses ? courses.findIndex(item => (item.id + '') === (reviewCurrent.ecom_prod + '')) : -1;


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
                                        >{__('Đánh giá trong khóa học')}&nbsp;
                                            <Typography sx={{ color: 'link' }} component={Link} to={"/instructor/courses/" + courses?.[courseIndex].id}>{courseIndex > -1 ? courses?.[courseIndex].title : ''}</Typography>
                                        </Typography>
                                        {/* <Typography variant='body2'>Câu hỏi được đặt trong bài học&nbsp;
                                            <Typography sx={{ color: 'link' }} component={Link} to={"/instructor/courses/" + courses?.[courseIndex].id}>{reviewCurrent.lesson?.title}</Typography>
                                        </Typography> */}
                                    </Box>
                                    {
                                        <Label
                                            color={statusColor[reviewCurrent.review_status].color}
                                            sx={{
                                                flexShrink: 0,
                                            }}
                                        >{statusColor[reviewCurrent.review_status].title}</Label>
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
                                                Object.keys(statusColor).map(key => (
                                                    {
                                                        title: statusColor[key].title,
                                                        selected: key === reviewCurrent.review_status,
                                                        action() {
                                                            updateStatus(reviewCurrent.id, key as ReviewStatus);
                                                        },
                                                    }
                                                ))
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
                                                src={getImageUrl(reviewCurrent.customer?.avatar, '/images/user-default.svg')}
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
                                                gap: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 1,
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography>{reviewCurrent.customer?.title}</Typography>
                                                · <span>{dateTimefromNow(reviewCurrent.created_at)}</span>
                                            </Box>
                                            <Rating name="read-only" value={reviewCurrent.rating} readOnly />
                                            <div dangerouslySetInnerHTML={{ __html: reviewCurrent.detail }} />
                                        </Box>
                                    </Box>
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

export default Reviews

type ReviewStatus = "pending" | "approved" | "not-approved"

const statusColor: { [key: string]: { title: string, color: string } } = {
    'pending': { 'title': 'Chờ xét duyệt', 'color': '#3f51b5' },
    'approved': { 'title': 'Chấp nhận', 'color': '#43a047' },
    'not-approved': { 'title': 'Không chấp nhận', 'color': 'rgb(255 41 41)' }
};

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