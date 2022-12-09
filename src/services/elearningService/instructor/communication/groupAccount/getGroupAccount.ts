import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';

const getGroupAccount = async (
    paginate: { current_page: number, per_page: number },
): Promise<PaginationProps<GroupAccount> | null> => {
    let api = await ajax<{
        groups: PaginationProps<GroupAccount> | null,
    }>({
        url: 'vn4-e-learning/instructor/communication/group-account/get',
        data: {
            page: paginate.current_page,
            length: paginate.per_page,
        }
    });

    return api.groups;
}

export default getGroupAccount

export interface GroupAccount {
    id: ID,
    title: string,
    description: string,
    created_at: string,
    count: string,
}