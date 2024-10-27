import { ajax } from 'hook/useApi';

const conversationAiService = {

    getConversation: async (id: ID): Promise<ConversationAi> => {
        let result = await ajax<{
            post: ConversationAi
        }>({
            url: 'vn4-e-learning/conversation-ai/1-get-conversation',
            data: {
                id: id
            },
        });

        return result.post;
    },

    postMessage: async (id: ID, message: string): Promise<{
        post?: ConversationAiMessage,
        message_response?: ConversationAiMessage
    } | undefined> => {
        let result = await ajax<{
            post?: ConversationAiMessage,
            message_response?: ConversationAiMessage
        }>({
            url: 'vn4-e-learning/conversation-ai/2-post-message',
            data: {
                id: id,
                message: message
            },
        });

        return result;
    }
}

export default conversationAiService;

export interface ConversationAi {
    id: ID,
    account: string,
    messages: Array<ConversationAiMessage>
}

interface ConversationAiMessage {
    id: ID,
    account: ID,
    message: string,
    createdAt: Date,
    loading?: boolean
}