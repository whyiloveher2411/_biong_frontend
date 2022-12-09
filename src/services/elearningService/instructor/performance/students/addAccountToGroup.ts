import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';

const addAccountToGroup = async (
    student_id: ID,
    groups: Array<ID>,
): Promise<PaginationProps<boolean> | null> => {
    let api = await ajax<{
        result: PaginationProps<boolean> | null,
    }>({
        url: 'vn4-e-learning/instructor/communication/group-account/add-account',
        data: {
            student_id: student_id,
            groups: groups,
        }
    });

    return api.result;
}

export default addAccountToGroup