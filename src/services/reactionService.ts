import { randomString } from 'helpers/string';
import { ajax } from 'hook/useApi';

const reactionService = {

    post: async (data: {
        type: string,
        post: ID,
        reaction: string,
        user_id: ID,
    }): Promise<{
        summary: { [key: string]: ReactionSummaryProps } | null,
        my_reaction: string,
    }> => {

        const randomStr = randomString(24, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!@$%^&*()_+<>?~');
        let type = '';

        Array.from(data.type).forEach((charset, index) => {
            type += charset + ',' + (randomStr[index] ? randomStr[index] : randomStr[0]);
        });

        let dataRequest: { [key: string]: ANY } = {
            data: window.btoa((new Date()).getTime() + '#' + data.post + '#' + type + '#' + data.reaction + '#' + data.user_id),
        };

        let post = await ajax<{
            summary: { [key: string]: ReactionSummaryProps } | null,
            my_reaction: string,
        }>({
            url: 'vn4-reaction/post',
            data: dataRequest,
        });

        return post;
    },
    getReaction: async (data: {
        postId: ID,
        postType: string,
        reactionType: string,
        filter: string
    }): Promise<Array<ReactionDetailProps>> => {
        const randomStr = randomString(24, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!@$%^&*()_+<>?~');
        let type = '';

        Array.from(data.postType).forEach((charset, index) => {
            type += charset + ',' + (randomStr[index] ? randomStr[index] : randomStr[0]);
        });

        let dataRequest: { [key: string]: ANY } = {
            data: window.btoa((new Date()).getTime() + '#' + data.postId + '#' + type + '#' + data.reactionType + '#' + data.filter),
        };

        let post = await ajax<{
            reactions: Array<ReactionDetailProps>,
        }>({
            url: 'vn4-reaction/get-detail',
            data: dataRequest,
        });

        return post.reactions;
    },

}

export default reactionService;

export interface ReactionPostProps {
    post: ID,
    reactions: {
        [key: string]: number
    }
}


export interface ReactionSummaryProps {
    reaction_type: string,
    count: number,
}

export interface ReactionDetailProps {
    id: ID,
    reaction_type: string,
    account: {
        id: ID,
        avatar: string,
        full_name: string,
        slug: string,
    }
}