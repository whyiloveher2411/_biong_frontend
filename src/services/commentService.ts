import { PaginationProps } from './../components/atoms/TablePagination';
import { ajax } from 'hook/useApi';
import { randomString } from 'helpers/string';

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


    getComments: async ({ key, type, per_page, current_page, followType, order }: { key: ID, type: string, current_page: number, per_page: number, followType: string, order: 'default' | 'recently' | 'all' }): Promise<{
        comments: PaginationProps<CommentProps> | null,
        key_id: ID | null,
        count_follow: number | null,
        my_follow: string,
    }> => {

        let post = await ajax<{
            comments: PaginationProps<CommentProps> | null,
            key_id: ID | null,
            count_follow: number | null,
            my_follow: string,
        }>({
            url: 'vn4-comment/get-comment',
            data: {
                key: key,
                length: per_page,
                page: current_page,
                type: type,
                followType: followType,
                order: order,
            }
        });

        return post;
    },

    getCommentsChildren: async ({ per_page, current_page, key, type, parent }: { type: string, current_page: number, per_page: number, key: ID, parent: ID }): Promise<CommentProps[] | null> => {

        let post = await ajax<{
            comments: CommentProps[] | null
        }>({
            url: 'vn4-comment/get-comment',
            data: {
                length: per_page,
                page: current_page,
                key: key,
                parent: parent,
                type: type,
            },
        });

        return post.comments;
    },

    postComment: async (data: {
        key: ID,
        type: string,
        parent?: ID,
        content: string,
        is_incognito: boolean,
        use_id: ID,
        disableUpdateUnread: boolean,
        _addInInfo?: { [key: string]: string }
    }): Promise<boolean> => {

        const randomStr = randomString(24, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!@$%^&*()_+<>?~');
        let type = '';

        Array.from(data.type).forEach((charset, index) => {
            type += charset + ',' + (randomStr[index] ? randomStr[index] : randomStr[0]);
        });


        let dataRequest: { [key: string]: ANY } = {
            // key: data.key,
            // type: data.type,
            content: data.content,
            // parent: data.parent,
            data: window.btoa((new Date()).getTime() + '##' + type + '#' + data.key + '#' + (data.parent ?? 0) + '#' + data.is_incognito + '#' + data.disableUpdateUnread + '#' + data.use_id),
        };

        if (data._addInInfo) {
            dataRequest._addInInfo = window.btoa((new Date()).getTime() + '#' + JSON.stringify(data._addInInfo));
        }

        let post = await ajax<{
            result: boolean
        }>({
            url: 'vn4-comment/post-comment',
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
    is_incognito: number,
    author?: {
        id: ID,
        title: string,
        avatar: string,
        slug: string,
        is_verified?: number,
    },
}
