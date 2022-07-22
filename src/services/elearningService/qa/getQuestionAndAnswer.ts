import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';
import { QuestionAndAnswerProps } from '../@type';

export default async (
    { per_page, current_page, postID, lessonID, query, type, sort, filter }: {
    current_page: number,
    per_page: number,
    postID: ID,
    lessonID: ID,
    query: string,
    type: number,
    sort: number,
    filter: { [key: number]: boolean },
}): Promise<PaginationProps<QuestionAndAnswerProps> | null> => {

    let api = await ajax<{
        qa: PaginationProps<QuestionAndAnswerProps>,
    }>({
        url: 'vn4-e-learning/course/qa/get',
        data: {
            length: per_page,
            page: current_page,
            post: postID,
            lesson: lessonID,
            search: {
                query: query,
                type: type,
                sort: sort,
                filter: filter,
            }
        },
    });

    if (api.qa) {
        return api.qa;
    }

    return null;

}
