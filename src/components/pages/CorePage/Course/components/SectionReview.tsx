import { Alert, Badge, Box, Button, CardContent, Chip, LinearProgress, LinearProgressProps, Pagination, Rating, Skeleton, Theme, Typography, useTheme } from '@mui/material';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import makeCSS from 'components/atoms/makeCSS';
import { PaginationProps } from 'components/atoms/TablePagination';
import Tooltip from 'components/atoms/Tooltip';
import TooltipVerifiedAccount from 'components/molecules/TooltipVerifiedAccount';
import { dateTimefromNow } from 'helpers/date';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import { nFormatter } from 'helpers/number';
import useDebounce from 'hook/useDebounce';
import useResponsive from 'hook/useResponsive';
import React from 'react';
import { Link } from 'react-router-dom';
import { CourseProps, ReviewItemProps } from 'services/courseService';
import eCommerceService from 'services/eCommerceService';
import { UserState, useUser } from 'store/user/user.reducers';
import ReviewCourse from './ReviewCourse';

const useStyle = makeCSS((theme: Theme) => ({
    chipActive: {
        background: theme.palette.primary.main + ' !important',
        color: 'white',
        '& .MuiChip-deleteIcon, &:hover .MuiChip-deleteIcon': {
            color: '#faaf00',
        },
    }
}));

function SectionReview({
    course,
    isPurchased
}: {
    course: CourseProps | null,
    isPurchased: boolean,
}) {

    const classes = useStyle();

    const theme = useTheme();

    const [isAlreadyReviewed, setIsAlreadyReviewed] = React.useState(false);

    const user = useUser();

    const [filterRating, setFilterRating] = React.useState<{ [key: number]: boolean }>({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
    });

    const debounceValue = useDebounce(filterRating, 500);

    const [openDialogReview, setOpenDialogReview] = React.useState(false);

    // const [paginateConfig, setPaginateConfig] = React.useState<{
    //     current_page: number,
    //     per_page: number,
    // }>({
    //     current_page: 0,
    //     per_page: 5
    // });

    const [isLoadingData, setIsLoadingData] = React.useState(true);

    const [reviewsData, setReviewData] = React.useState<{
        reviews: PaginationProps<ReviewItemProps>,
        dataSumary: {
            [key: string]: {
                rating: number,
                count: number,
            }
        }
    } | null>(null);

    React.useEffect(() => {

        loadReviewApi();

    }, [debounceValue]);

    React.useEffect(() => {

        if (course) {
            (async () => {
                if (user._state === UserState.identify) {
                    let alreadyReviewed = await eCommerceService.checkAlreadyReviewed(course.slug);
                    setIsAlreadyReviewed(alreadyReviewed);
                }
            })()
        }

        if (user._state !== UserState.identify) {
            setIsAlreadyReviewed(true);
        }

    }, [course, user]);

    const loadReviewApi = async (current_page = 0, per_page = 5) => {
        if (course) {
            let reviews = await eCommerceService.getReview(course.slug, {
                current_page: current_page,
                per_page: per_page,
            }, filterRating);

            setReviewData(reviews);
            setIsLoadingData(false);
        }
    }

    let avg = 0;
    let count = 0;
    let total = 0;

    if (reviewsData && reviewsData.dataSumary) {
        for (let key in reviewsData.dataSumary) {
            total += reviewsData.dataSumary[key].count * parseInt(key);
            count += reviewsData.dataSumary[key].count;
        }
    }

    avg = total / count;



    if (!course || !reviewsData) {
        return <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                margin: '0 auto',
            }}
        >
            <Box
                sx={{
                    borderBottom: '1px solid ' + theme.palette.dividerDark
                }}
            >
                <Skeleton>
                    <Typography variant='h3' sx={{ mb: 2 }}>
                        {__('Đánh giá - Nhận xét từ học viên')}
                    </Typography>
                </Skeleton>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            alignItems: 'center',
                            color: 'primary.main',
                        }}
                    >
                        <Skeleton>
                            <Typography variant='h1'>5.0</Typography>
                        </Skeleton>
                        <Rating size='small' precision={0.1} emptyIcon={<Icon icon="Star" style={{ opacity: 0.55 }} fontSize="inherit" />} name="read-only" value={0} readOnly />
                        <Skeleton>
                            <Typography variant='h6'>Course Rating</Typography>
                        </Skeleton>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: '1',
                            gap: 1,
                        }}
                    >

                        {
                            [5, 4, 3, 2, 1].map(rating => (
                                <LinearProgressWithLabelLoading
                                    key={rating}
                                />
                            ))
                        }

                        <Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 3,
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    mt: 2,
                                }}
                            >
                                <Skeleton variant='text'>
                                    <Typography>Lọc xem theo :  </Typography>
                                </Skeleton>
                                {
                                    [5, 4, 3, 2, 1].map(item => (
                                        <Skeleton variant='text' key={item}>
                                            <Chip
                                                key={item}
                                                label={item}
                                                onClick={() => {
                                                    //
                                                }}
                                                onDelete={() => {
                                                    //
                                                }}
                                                deleteIcon={<Icon icon="Star" />}
                                                variant="outlined"
                                            />
                                        </Skeleton>
                                    ))
                                }
                            </Box>
                        </Box>

                    </Box>

                </Box>
            </Box>
            {
                [1, 2, 3, 4, 5].map((item, index) => (
                    <ReviewItemLoading
                        key={item}
                        isDisableBorderBottom={index === 4}
                    />
                ))
            }
        </Box>;
    }

    return (

        <>

            {
                count
                    ?
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            margin: '0 auto',
                        }}
                    >
                        <Box
                            sx={{
                                borderBottom: '1px solid ' + theme.palette.dividerDark
                            }}
                        >
                            <Typography variant='h3' sx={{ mb: 2 }}>
                                {__('Đánh giá - Nhận xét từ học viên')}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                        alignItems: 'center',
                                        color: 'primary.main',
                                    }}
                                >
                                    <Typography variant='h1'>{Number(avg.toFixed(1))}</Typography>
                                    <Rating size='small' precision={0.1} emptyIcon={<Icon icon="Star" style={{ opacity: 0.55 }} fontSize="inherit" />} name="read-only" value={avg} readOnly />
                                    <Typography variant='h6'>{__('{{count}} bài đánh giá', { count: nFormatter(count) })}</Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flex: '1',
                                        gap: 1,
                                    }}
                                >

                                    {
                                        [5, 4, 3, 2, 1].map(rating => (
                                            <LinearProgressWithLabel
                                                key={rating}
                                                count={reviewsData.dataSumary[rating] ? reviewsData.dataSumary[rating].count : 0}
                                                ratting={rating}
                                                value={
                                                    count > 0 ?
                                                        ((reviewsData.dataSumary[rating] ? reviewsData.dataSumary[rating].count : 0) * 100 / count)
                                                        :
                                                        0
                                                }
                                            />
                                        ))
                                    }

                                    <Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                mt: 2,
                                                pb: 4,
                                            }}
                                        >
                                            <Typography>Lọc xem theo :  </Typography>

                                            {
                                                [5, 4, 3, 2, 1].map((item: number) => (
                                                    <Chip
                                                        key={item}
                                                        label={item}
                                                        className={filterRating[item] ? classes.chipActive : ''}
                                                        color={filterRating[item] ? 'primary' : 'default'}
                                                        onClick={() => {
                                                            setFilterRating(prev => {
                                                                prev[item] = !prev[item];
                                                                return { ...prev };
                                                            });
                                                            setIsLoadingData(true);
                                                        }}
                                                        onDelete={() => {
                                                            setFilterRating(prev => {
                                                                prev[item] = !prev[item];
                                                                return { ...prev };
                                                            });
                                                            setIsLoadingData(true);
                                                        }}
                                                        deleteIcon={<Icon icon="Star" />}
                                                        variant={'outlined'}
                                                    />
                                                ))
                                            }
                                        </Box>
                                    </Box>

                                </Box>

                            </Box>
                        </Box>
                        {
                            isLoadingData ?
                                reviewsData.reviews.data.length > 0 ?
                                    reviewsData.reviews.data.map((item, index) => (
                                        <ReviewItemLoading
                                            key={index}
                                            isDisableBorderBottom={index === 4}
                                        />
                                    ))
                                    :
                                    [1, 2, 3, 4, 5].map((item, index) => (
                                        <ReviewItemLoading
                                            key={index}
                                            isDisableBorderBottom={index === 4}
                                        />
                                    ))
                                :
                                <>
                                    {
                                        user._state === UserState.identify && !isAlreadyReviewed && isPurchased ?
                                            <Alert severity='info' icon={false}>
                                                <Typography>
                                                    Để lại đánh giá ngay <Button onClick={() => setOpenDialogReview(true)} variant='text'>Tại đây</Button>
                                                </Typography>
                                            </Alert>
                                            :
                                            <></>
                                    }
                                    {
                                        reviewsData.reviews.total ?
                                            reviewsData.reviews.data.map((item, index) => (
                                                <ReviewItem
                                                    isDisableBorderBottom={index === (reviewsData.reviews.data.length - 1)}
                                                    key={index}
                                                    review={item}
                                                />
                                            ))
                                            :
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    pt: 4,
                                                    pb: 6,
                                                    gap: 3
                                                }}
                                            >
                                                <Rating name="read-only" value={5} sx={{ fontSize: 40 }} readOnly />
                                                <Typography align='center' variant='h3' component='p'>
                                                    {__('Không tìm thấy đánh giá.')}
                                                </Typography>
                                            </Box>
                                    }
                                </>
                        }
                        {
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >

                                <Pagination
                                    count={reviewsData.reviews.last_page}
                                    showFirstButton
                                    showLastButton
                                    page={reviewsData.reviews.current_page ? reviewsData.reviews.current_page : 1}
                                    onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
                                        loadReviewApi(value);
                                        setIsLoadingData(true);
                                    }}
                                />

                                {/*
                        <IconButton
                            disabled={paginateConfig.current_page <= 1}
                            onClick={() => {
                                setPaginateConfig(prev => ({
                                    ...prev,
                                    current_page: prev.current_page - 1
                                }));
                                setIsLoadingData(true);
                            }}
                        >
                            <Icon icon="ArrowBackIosNewRounded" />
                        </IconButton>
                        <IconButton
                            disabled={paginateConfig.current_page >= reviewsData.reviews.last_page}
                            onClick={() => {
                                setPaginateConfig(prev => ({
                                    ...prev,
                                    current_page: (prev.current_page ? prev.current_page : 1) + 1
                                }));
                                setIsLoadingData(true);
                            }}
                        >
                            <Icon icon="ArrowForwardIosRounded" />
                        </IconButton> */}
                            </Box>
                        }
                        {/* {
                    reviewsData.reviews.total &&
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
                        count={reviewsData.reviews.total}
                        rowsPerPage={Number(paginateConfig.per_page)}
                        page={paginateConfig.current_page ? paginateConfig.current_page - 1 : 0}
                        onPageChange={(_event, page) => {
                            setPaginateConfig(prev => ({
                                ...prev,
                                current_page: page + 1
                            }));
                            setIsLoadingData(true);
                        }}
                        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            setPaginateConfig((prev) => ({
                                current_page: parseInt(event.target.value) * (prev.current_page - 1) < reviewsData.reviews.total ? prev.current_page : 1,
                                per_page: parseInt(event.target.value)
                            }));
                            setIsLoadingData(true);
                        }}
                    />
                } */}

                    </Box>
                    :
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            pt: 4,
                            pb: 6,
                            gap: 3
                        }}
                    >
                        <Rating name="read-only" value={5} sx={{ fontSize: 40 }} readOnly />
                        {
                            isPurchased ?
                                <>
                                    <Typography align='center' variant='h3' component='p'>
                                        {__('Hãy là người đầu tiền đánh giá khóa học này')}
                                    </Typography>
                                    <Button onClick={() => setOpenDialogReview(true)} variant='contained'>Đánh giá ngay</Button>
                                </>
                                :
                                <Typography align='center' variant='h3' component='p'>
                                    {__('Chưa có đánh giá nào cho khóa học này')}
                                </Typography>
                        }
                    </Box>
            }
            <ReviewCourse
                open={openDialogReview}
                onClose={() => setOpenDialogReview(false)}
                course={course}
                handleAfterConfimReview={() => { setOpenDialogReview(false); loadReviewApi(); setIsAlreadyReviewed(true); }}
            />
        </>
    )
}

export default SectionReview


function LinearProgressWithLabel({ ratting, count, ...props }: LinearProgressProps & { value: number, count: number, ratting: number }) {

    const isMobile = useResponsive('down', 'sm');

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Rating emptyIcon={<Icon icon="Star" style={{ opacity: 0.55 }} />} name="read-only" value={ratting} readOnly />
            {
                !isMobile &&
                <Box sx={{ width: '100%', mr: 1, flex: 1 }}>
                    <LinearProgress variant="determinate" {...props} />
                </Box>
            }
            <Box sx={{ minWidth: 76 }}>
                <Typography variant="body2" color="text.secondary" noWrap>{count} ({`${Math.round(
                    props.value,
                )}%`})</Typography>
            </Box>
        </Box>
    );
}


function LinearProgressWithLabelLoading() {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Rating emptyIcon={<Icon icon="Star" style={{ opacity: 0.55 }} />} name="read-only" value={0} readOnly />
            <Box sx={{ width: '100%', mr: 1, flex: 1 }}>
                <Skeleton variant='text'></Skeleton>
            </Box>
            <Box sx={{ minWidth: 76 }}>
                <Skeleton variant='text' >
                    <Typography variant="body2" color="text.secondary" noWrap>100 (30%)</Typography>
                </Skeleton>
            </Box>
        </Box>
    );
}

export function ReviewItem({
    review, isDisableBorderBottom = false
}: {
    review: ReviewItemProps,
    isDisableBorderBottom?: boolean
}) {
    const theme = useTheme();

    return (
        <CardContent
            sx={{
                display: 'flex',
                gap: 2,
                pb: 3,
                pt: 3,
                borderBottom: isDisableBorderBottom ? 'none' : '1px solid ' + theme.palette.dividerDark,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexBasis: '50px',
                }}
            >
                {
                    review.customer ?
                        <Link to={'/user/' + review.customer.slug}>
                            <ImageLazyLoading
                                name={review.customer.title}
                                src={getImageUrl(review.customer.avatar)}
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                }}
                            />
                        </Link>
                        :
                        <>
                            <Box
                                sx={{
                                    borderRadius: '50%',
                                    p: '3px',
                                    width: 56,
                                    height: 56,
                                    cursor: 'pointer',
                                    backgroundColor: 'text.third',
                                    '& .MuiBadge-badge': {
                                        top: 40,
                                        width: 20,
                                        height: 20,
                                        backgroundColor: 'text.third',
                                        color: 'white',
                                    }
                                }}
                            >
                                <Tooltip title={'Người dùng ẩn danh'}>
                                    <Badge badgeContent={<Icon sx={{ width: 16 }} icon={'StarOutlined'} />}>
                                        <ImageLazyLoading src={'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMTIwdjEyMEgweiIvPjxwYXRoIGQ9Ik02MCAwYzMzLjEzNyAwIDYwIDI2Ljg2MyA2MCA2MHMtMjYuODYzIDYwLTYwIDYwUzAgOTMuMTM3IDAgNjAgMjYuODYzIDAgNjAgMHptMTcuNSA2NC44MzdjLTYuNDU2IDAtMTEuODIyIDQuNTAyLTEzLjIyMiAxMC41MTYtMy4yNjctMS4zOTctNi4zLTEuMDA5LTguNTU2LS4wMzlDNTQuMjgzIDY5LjMgNDguOTE3IDY0LjgzNyA0Mi41IDY0LjgzN2MtNy41MDYgMC0xMy42MTEgNi4wOTItMTMuNjExIDEzLjU4MkMyOC44ODkgODUuOTA4IDM0Ljk5NCA5MiA0Mi41IDkyYzcuMTU2IDAgMTIuOTUtNS41MSAxMy40OTQtMTIuNDk1IDEuMTY3LS44MTUgNC4yNC0yLjMyOCA4LjAxMi4wNzhDNjQuNjI4IDg2LjUyOSA3MC4zODMgOTIgNzcuNSA5MmM3LjUwNiAwIDEzLjYxMS02LjA5MiAxMy42MTEtMTMuNTgxIDAtNy40OS02LjEwNS0xMy41ODItMTMuNjExLTEzLjU4MnptLTM1IDMuODhjNS4zNjcgMCA5LjcyMiA0LjM0NyA5LjcyMiA5LjcwMiAwIDUuMzU1LTQuMzU1IDkuNy05LjcyMiA5LjctNS4zNjcgMC05LjcyMi00LjM0NS05LjcyMi05LjcgMC01LjM1NSA0LjM1NS05LjcwMSA5LjcyMi05LjcwMXptMzUgMGM1LjM2NyAwIDkuNzIyIDQuMzQ3IDkuNzIyIDkuNzAyIDAgNS4zNTUtNC4zNTUgOS43LTkuNzIyIDkuNy01LjM2NyAwLTkuNzIyLTQuMzQ1LTkuNzIyLTkuNyAwLTUuMzU1IDQuMzU1LTkuNzAxIDkuNzIyLTkuNzAxek05NSA1N0gyNXY0aDcwdi00ek03Mi44NzQgMjkuMzRjLS44LTEuODItMi44NjYtMi43OC00Ljc4NS0yLjE0M0w2MCAyOS45MTRsLTguMTI4LTIuNzE3LS4xOTItLjA1OGMtMS45MjgtLjUzMy0zLjk1NC41MS00LjY2OSAyLjM4N0wzOC4xNDQgNTNoNDMuNzEyTDcyLjk1IDI5LjUyNnoiIGZpbGw9IiNEQURDRTAiLz48L2c+PC9zdmc+'} sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                        }} />
                                    </Badge>
                                </Tooltip>
                            </Box>
                        </>

                }

            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    flex: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                    }}
                >
                    {
                        review.customer ?
                            <>
                                <Typography component={Link} to={'/user/' + review.customer.slug} variant='h5'>{review.customer.title}</Typography>
                                {
                                    Boolean(review.customer.is_verified) &&
                                    <TooltipVerifiedAccount />
                                }
                            </>
                            :
                            <Typography variant='h5'>{__('Người dùng ẩn danh')}</Typography>
                    }
                    <Typography variant='body2'>{dateTimefromNow(review.created_at)}</Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                    }}
                >
                    <Rating emptyIcon={<Icon icon="Star" style={{ opacity: 0.55 }} fontSize="inherit" />} name="read-only" value={review.rating} readOnly />
                </Box>
                <Typography sx={{ lineHeight: '28px' }} color="text.secondary" >{review.detail}</Typography>
            </Box>
        </CardContent>
    )
}


export function ReviewItemLoading({
    isDisableBorderBottom = false
}: {
    isDisableBorderBottom?: boolean
}) {

    const theme = useTheme();

    return (
        <CardContent
            sx={{
                display: 'flex',
                gap: 2,
                pb: 3,
                pt: 3,
                borderBottom: isDisableBorderBottom ? 'none' : '1px solid ' + theme.palette.dividerDark
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexBasis: '50px',
                }}
            >
                <Skeleton variant='circular'
                    sx={{
                        width: 50,
                        height: 50
                    }} />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    flex: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                    }}
                >
                    <Skeleton variant='text' >
                        <Typography variant='h5'>Lorem ipsum dolor sit</Typography>
                    </Skeleton>
                    <Skeleton variant='text' >
                        <Typography variant='body2'>2022-03-23 21:08:31</Typography>
                    </Skeleton>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                    }}
                >
                    <Rating emptyIcon={<Icon icon="Star" style={{ opacity: 0.55 }} fontSize="inherit" />} name="read-only" value={0} readOnly />
                    <Skeleton variant='text' >
                        <Typography variant='h6' sx={{ mt: 0.5 }}>Lorem ipsum dolor sit</Typography>
                    </Skeleton>

                </Box>
                <Skeleton variant='text' >
                    <Typography sx={{ lineHeight: '28px' }} >
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestias, deserunt voluptatem quisquam officia nam doloribus praesentium recusandae, optio quia beatae asperiores, sequi facere rem obcaecati fugiat minima ea error ut.
                    </Typography>
                </Skeleton>
            </Box>
        </CardContent>
    )
}