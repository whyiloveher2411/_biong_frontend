import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';
const createNotification = async (
    id: ID,
): Promise<PaginationProps<boolean> | null> => {
    let api = await ajax<{
        result: PaginationProps<boolean> | null,
    }>({
        url: 'vn4-e-learning/instructor/communication/announcements/create-notification',
        data: {
            request: id,
        }
    });

    return api.result;
}

export default createNotification