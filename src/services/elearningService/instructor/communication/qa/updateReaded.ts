import { ajax } from 'hook/useApi';

const updateReaded = async (qa_id: ID): Promise<number> => {
    let api = await ajax<{
        is_unread: number,
    }>({
        url: 'vn4-e-learning/instructor/communication/qa/update-readed',
        data: {
            qa_id: qa_id,
        }
    });

    return api.is_unread;
}

export default updateReaded