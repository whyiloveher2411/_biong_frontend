import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';
import { ReviewItemProps } from 'services/courseService';

const getReview = async (
    courseID: ID | null,
    paginate: { current_page: number, per_page: number },
    filter: { serach: string, unread: boolean, noAnswer: boolean, noMyAnser: boolean },
    time: {
        startDate: string,
        endDate: string,
    }
): Promise<PaginationProps<ReviewItemProps> | null> => {
    let api = await ajax<{
        reviews: PaginationProps<ReviewItemProps> | null,
    }>({
        url: 'vn4-e-learning/instructor/performance/review/get',
        data: {
            course_id: courseID,
            page: paginate.current_page,
            length: paginate.per_page,
            ...filter,
            time: time,
        }
    });

    return api.reviews;
}

export default getReview