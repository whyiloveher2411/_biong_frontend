import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';
import { GroupAccount } from '../groupAccount/getGroupAccount';

const addNewAnnouncement = async (
    title: string,
    content: string,
    link_redirect: string,
    announcement_type: string,
    accounts: string[],
    group_account: GroupAccount[],
    is_important: number,
    id: ID = 0,
): Promise<PaginationProps<boolean> | null> => {
    let api = await ajax<{
        result: PaginationProps<boolean> | null,
    }>({
        url: 'vn4-e-learning/instructor/communication/announcements/add-new',
        data: {
            title: title,
            content: content,
            accounts: accounts,
            group_account: group_account,
            is_important: is_important,
            link_redirect: link_redirect,
            announcement_type: announcement_type,
            id: id,
        }
    });

    return api.result;
}

export default addNewAnnouncement