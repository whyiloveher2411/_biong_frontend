import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';

const generateShortVideoService = {

    getGenerateShortVideo: async (id: string): Promise<IGenerateShortVideo | null> => {
        let result = await ajax<{
            post: IGenerateShortVideo | null
        }>({
            url: `vn4-e-learning/generate-short-video/get`,
            data: {
                id: id
            }
        });

        return result.post || null;
    },

    getGenerateShortVideoList: async (): Promise<PaginationProps<IGenerateShortVideo> | null> => {
        let result = await ajax<{
            posts: PaginationProps<IGenerateShortVideo> | null
        }>({
            url: 'vn4-e-learning/generate-short-video/list',
        });
        return result.posts || null;
    },

    generateShortVideo: async (data: {
        title: string,
        topic: string,
        language: string
    }): Promise<IGenerateShortVideo | null> => {
        let result = await ajax<{
            post: IGenerateShortVideo | null
        }>({
            url: 'vn4-e-learning/generate-short-video/create',
            data: data,
        });

        return result.post || null;
    },
}

export interface IGenerateShortVideo {
    id: string;
    title: string;
    topic: string;
    language: string;
    generate_status: 'new' | 'pending' | 'processing' | 'completed' | 'failed';
}

export default generateShortVideoService;
