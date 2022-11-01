import { createContext } from "react";
import { CommentProps } from "services/commentService";

const CommentsContext = createContext({
    commentsData: {},
    toogleShowCommentChild: (commentID: ID) => {
        //
    },
    loadCommentChild: (commentID: ID, current_page: number, per_page: number) => {
        //
    },
    addComment: async (commentID: ID, content: string) => {
        return false;
    }
});

export default CommentsContext;


export interface CommentsContextProps {
    commentsData: {
        [key: ID]: {
            showCommentChild: boolean,
            comment_child_number: number,
            comments: CommentProps[] | null
        }
    }
    toogleShowCommentChild: (commentID: ID, open?: boolean) => void,
    loadCommentChild: (commentID: ID, current_page: number, per_page: number) => void,
    addComment: (commentID: ID, content: string) => Promise<boolean>,
}