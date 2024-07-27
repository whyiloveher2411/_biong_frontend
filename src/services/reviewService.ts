import { ajax } from 'hook/useApi';

const reviewService = {

    post: async (data: {
        type: string,
        post: ID,
        rating: number,
        content: string,
    }): Promise<{
        result: boolean,
        meta: {
            rating: number,
            reviewNumber: number,
        }
    } | null> => {

        let post = await ajax<{
            result: boolean,
            meta: {
                rating: number,
                reviewNumber: number,
            }
        }>({
            url: 'vn4-e-learning/review/post',
            data: {
                type: data.type,
                post: data.post,
                rating: data.rating,
                content: data.content,
            },
        });

        if (post?.meta) {
            return post;
        }

        return null;
    },

}

export default reviewService;