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