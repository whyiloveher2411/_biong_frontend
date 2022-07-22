import { ajax } from 'hook/useApi';

const reportService = {

    post: async (data: {
        type: string,
        post: ID,
        reason: string,
        description: string,
    }): Promise<boolean> => {

        let post = await ajax<{
            result: boolean
        }>({
            url: 'vn4-report/post',
            data: {
                type: data.type,
                post: data.post,
                reason: data.reason,
                description: data.description,
            },
        });

        return post.result;
    },

}

export default reportService;