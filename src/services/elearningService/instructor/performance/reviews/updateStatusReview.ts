import { ajax } from 'hook/useApi';

const updateStatusReview = async (review_status: ID, status: 'pending' | 'approved' | 'not-approved'): Promise<'pending' | 'approved' | 'not-approved' | null> => {
    let api = await ajax<{
        review_status: 'pending' | 'approved' | 'not-approved' | null,
    }>({
        url: 'vn4-e-learning/instructor/performance/review/update-status',
        data: {
            review: review_status,
            status: status,
        }
    });

    return api.review_status;
}

export default updateStatusReview