import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import { Box, CircularProgress, IconButton, InputBase, Skeleton } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import Page from 'components/templates/Page';
import { getImageUrl } from 'helpers/image';
import { compiler } from 'markdown-to-jsx';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { useDispatch } from 'react-redux';
import conversationAiService, { ConversationAi } from 'services/conversationAiService';
import { setFooterVisible, setHeaderVisible, setIsIframeOauth } from 'store/layout/layout.reducers';
import { useUser } from 'store/user/user.reducers';

function AiChatPage({page, tab}: {page: string, tab: string}) {
    const [input, setInput] = React.useState('');

    const [conversation, setConversation] = React.useState<ConversationAi>({
        id: '',
        account: '',
        messages: [],
    });

    const [loading, setLoading] = React.useState(false);

    const refMessageBox = React.useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    const user = useUser();

    React.useEffect(() => {

        (async () => {
            const conversation = await conversationAiService.getConversation(tab);
            setConversation(conversation);
        })();

        dispatch(setHeaderVisible(false));
        dispatch(setFooterVisible(false));
        dispatch(setIsIframeOauth(true));
        return () => {
            dispatch(setHeaderVisible(true));
            dispatch(setFooterVisible(true));
            dispatch(setIsIframeOauth(false));
        };
    }, []);


    const handleSend = async () => {
        if (input.trim()) {
            if (!conversation) return;

            if (loading) return;

            setLoading(true);
            setInput('');

            setConversation({
                ...conversation, messages: [...conversation.messages, {
                    id: Date.now(),
                    account: user.id,
                    message: input,
                    createdAt: new Date(),
                }, {
                    id: Date.now(),
                    account: '0',
                    message: input,
                    createdAt: new Date(),
                    loading: true,
                }]
            });

            const message = await conversationAiService.postMessage(tab, input);

            if (!message?.post || !message?.message_response) return;

            setConversation(prev => {
                prev.messages.pop();
                return {
                    ...prev,
                    messages: [...prev.messages, message.message_response]
                } as ConversationAi;
            });


            setLoading(false);
        }
    };

    React.useEffect(() => {
        refMessageBox.current?.scrollTo({ top: refMessageBox.current.scrollHeight, behavior: 'smooth' });
    }, [conversation]);

    return (
        <Page
            title="Chat với AI"
            description="Giao diện trò chuyện với AI"
            image="https://example.com/chat-ai.jpg"
            maxWidth="100%"
            sx={{
                paddingRight: '0',
                marginRight: '-16px',
                marginLeft: '-16px',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: 'calc(100vh - 32px)',
                    margin: '0 auto',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                }}
            >
                <Box
                    ref={refMessageBox}
                    className='chat-container custom_scroll custom'
                    sx={{
                        height: '100vh',
                        overflowY: 'auto', borderRadius: '4px', mb: 6, p: 0
                    }}
                >
                    {conversation?.messages.map((msg, index) => (
                        <Box key={index} sx={{
                            display: 'flex',
                            justifyContent: parseInt(msg.account + '') ? 'flex-end' : 'flex-start',
                            p: '18px 20px',
                            width: '100%',
                            maxWidth: '1264px',
                            margin: '0 auto',
                        }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    justifyContent: 'flex-end',
                                    maxWidth: '70%',
                                    ...(parseInt(msg.account + '') ? {
                                    } : {
                                        flexDirection: 'row-reverse',
                                    }),
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: msg.loading ? 'unset' : (parseInt(msg.account + '') ? 'primary.main' : 'divider'), // Đổi màu giống messageer
                                        maxWidth: '100%',
                                        wordWrap: 'break-word',
                                        borderRadius: '1.5rem',
                                        padding: '10px 20px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {
                                        msg.loading ?
                                            < Skeleton
                                                variant="rounded"
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    zIndex: 10,
                                                }}
                                            />
                                            : null
                                    }
                                    <CodeBlock
                                        html={renderToString(compiler(msg.message))}
                                        sx={(theme) => ({
                                            opacity: msg.loading ? 0 : 1,
                                            '& > .codeBlock-content > p:nth-child(1)': {
                                                mt: 0,
                                            },
                                            color: theme.palette.mode === 'dark' || (parseInt(msg.account + ''))  ? 'white !important' : 'inherit !important',
                                            '& a': {
                                                color: theme.palette.mode === 'dark' || (parseInt(msg.account + ''))  ? 'white !important' : 'inherit !important',
                                                textDecoration: 'underline !important',
                                            },
                                        })}
                                    />
                                </Box>
                                <ImageLazyLoading
                                    src={parseInt(msg.account + '') ? getImageUrl(user.avatar, '/images/user-default.svg') : '/images/LOGO-image-full.svg'}
                                    placeholderSrc='/images/user-default.svg'
                                    name={user.full_name}
                                    sx={{
                                        mt: 1,
                                        flexShrink: 0,
                                        '& .blur': {
                                            filter: 'unset !important',
                                        },
                                        width: "28px",
                                        height: "28px",
                                        fontSize: 13,
                                        borderRadius: '50%',
                                    }}
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box
                sx={{
                    position: 'fixed',
                    minHeight: 48,
                    bottom: 24,
                    width: '100%',
                    maxWidth: '1264px',
                    pl: 2,
                    pr: 2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        minHeight: 48,
                        display: 'flex',
                        borderRadius: '1.5rem',
                        overflow: 'hidden',
                        backgroundColor: loading ? 'rgba(255, 255, 255, 0.2)' : 'divider',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        p: '4px 8px 4px 24px',
                        width: '100%',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <InputBase
                        placeholder="Nhập câu hỏi của bạn"
                        inputProps={{ 'aria-label': 'search google maps' }}
                        multiline
                        disabled={loading}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        sx={{
                            width: '100%',
                            pointerEvents: loading ? 'none' : 'auto',
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                            }
                        }}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }}
                    />

                    {loading ?
                        <CircularProgress
                            size={28}
                            sx={{
                                flexShrink: 0,
                            }}
                        />
                        :
                        <IconButton
                            onClick={handleSend}
                            sx={{
                                flexShrink: 0,
                            }}
                        >
                            <ArrowUpwardRoundedIcon />
                        </IconButton>
                    }
                </Box>
            </Box>
        </Page>
    )
}

export default AiChatPage
