import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';

const addNewAnnouncement = async (
    title: string,
    content: string,
    accounts: string[],
): Promise<PaginationProps<boolean> | null> => {
    let api = await ajax<{
        result: PaginationProps<boolean> | null,
    }>({
        url: 'vn4-e-learning/instructor/communication/announcements/add-new',
        data: {
            title: title,
            content: content,
            accounts: accounts,
        }
    });

    return api.result;
}

export default addNewAnnouncement