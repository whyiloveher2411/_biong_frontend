import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';

const addNewGroupAccount = async (
    id: null | ID,
    title: string,
    description: string,
): Promise<PaginationProps<boolean> | null> => {
    let api = await ajax<{
        result: PaginationProps<boolean> | null,
    }>({
        url: 'vn4-e-learning/instructor/communication/group-account/edit-or-add-new',
        data: {
            id: id,
            title: title,
            description: description,
        }
    });

    return api.result;
}

export default addNewGroupAccount