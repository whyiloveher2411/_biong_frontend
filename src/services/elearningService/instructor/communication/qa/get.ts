import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';
import { QuestionAndAnswerProps } from 'services/elearningService/@type';

const getQa = async (courseID: ID | null, paginate: { current_page: number, per_page: number }, filter: { serach: string, unread: boolean, noAnswer: boolean, noMyAnser: boolean }): Promise<PaginationProps<QuestionAndAnswerProps> | null> => {
    let api = await ajax<{
        questions: PaginationProps<QuestionAndAnswerProps> | null,
    }>({
        url: 'vn4-e-learning/instructor/communication/qa/get',
        data: {
            course_id: courseID,
            page: paginate.current_page,
            length: paginate.per_page,
            ...filter,
        }
    });

    return api.questions;
}

export default getQa