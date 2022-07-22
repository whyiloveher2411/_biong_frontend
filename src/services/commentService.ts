import { ajax } from 'hook/useApi';
import { ReactionSummaryProps } from './reactionService';

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
    vn4_reaction_summary: string,
    vn4_vote_summary: string,
    reaction_summary: null | Array<ReactionSummaryProps>,
    vote_summary: null | Array<ReactionSummaryProps>,
    my_reaction_type: string | null,
    my_vote: string | null,
    author?: {
        id: ID,
        title: string,
        avatar: string,
        slug: string,
    },
}
