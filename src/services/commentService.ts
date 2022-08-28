import { ajax } from 'hook/useApi';

const commentService = {

    post: async (data: {
        type: string,
        parent?: ID,
        post: ID,
        content: string,
        _addInInfo?: { [key: string]: string }
    }): Promise<boolean> => {

        let dataRequest: { [key: string]: ANY } = {
            type: data.type,
            post: data.post,
            content: data.content,
            parent: data.parent,
        };

        if (data._addInInfo) {
            dataRequest._addInInfo = window.btoa((new Date()).getTime() + '#' + JSON.stringify(data._addInInfo));
        }

        let post = await ajax<{
            result: boolean
        }>({
            url: 'vn4-comment/post',
            data: dataRequest,
        });

        return post.result;
    },

}

export default commentService;

export interface CommentProps {
    id: ID,
    content: string,
    created_at: string,
    comment_child_number: number,
    count_like: number,
    count_love: number,
    count_care: number,
    count_haha: number,
    count_wow: number,
    count_sad: number,
    count_angry: number,
    count_useful: number,
    count_not_useful: number,
    my_reaction_type: string | null,
    my_vote: string | null,
    author?: {
        id: ID,
        title: string,
        avatar: string,
        slug: string,
    },
}
