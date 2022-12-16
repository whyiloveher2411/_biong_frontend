import { Avatar, AvatarGroup, Badge, Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { Theme } from '@mui/material/styles'
import { withStyles } from '@mui/styles'
import Divider from 'components/atoms/Divider'
import Icon from 'components/atoms/Icon'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import Tooltip from 'components/atoms/Tooltip'
import TooltipVerifiedAccount from 'components/molecules/TooltipVerifiedAccount'
import { dateTimefromNow } from 'helpers/date'
import { cssMaxLine } from 'helpers/dom'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import React from 'react'
import { QuestionAndAnswerProps } from 'services/elearningService/@type'
import reactionService, { ReactionSummaryProps } from 'services/reactionService'
import { useUser } from 'store/user/user.reducers'

function QuestionAndAnswerItem({ QAItem, handleOnChooseQuestion, setQuestion, limitRowContent = 3 }: {
    QAItem: QuestionAndAnswerProps,
    handleOnChooseQuestion: (question: QuestionAndAnswerProps) => void,
    limitRowContent?: number,
    setQuestion: (callback: (prev: QuestionAndAnswerProps) => QuestionAndAnswerProps) => void
}) {

    const user = useUser();

    const contentRef = React.useRef<HTMLDivElement>(null);

    const [onlyShowShortDescript, setOnlyShowShortDescript] = React.useState(true);

    const [reactionSummary, setReactionSummary] = React.useState<{
        [K in ReactionType]: number
    }>({
        like: QAItem.count_like ?? 0,
        love: QAItem.count_love ?? 0,
        care: QAItem.count_care ?? 0,
        haha: QAItem.count_haha ?? 0,
        wow: QAItem.count_wow ?? 0,
        sad: QAItem.count_sad ?? 0,
        angry: QAItem.count_angry ?? 0,
    });

    const handleHideTextLong = (notes: NodeListOf<ChildNode>, totalCurrent = 0, level = 1) => {

        notes.forEach(item => {

            let length = 0;

            if (item.nodeType === 3) {
                length = (item.textContent as string).trim().replace(/[\s]+/g, " ").split(" ").length;
            } else {
                length = ((item as HTMLElement).innerText as string).trim().replace(/[\s]+/g, " ").split(" ").length;
            }

            if (totalCurrent < 84) {

                if ((totalCurrent + length) > 90) {

                    if (item.nodeType === 3) {

                        const words = (item.textContent as string).trim().replace(/[\s]+/g, " ").split(" ");

                        const wordsAfter: string[] = [];
                        for (let index = 0; index < (84 - totalCurrent + 1); index++) {
                            wordsAfter.push(words[index]);
                        }
                        item.textContent = wordsAfter.join(' ') + '...';


                        const buttonNode = document.createElement('span');
                        buttonNode.classList.add('btn-seemore');
                        buttonNode.innerText = 'Xem thêm';
                        buttonNode.onclick = () => {
                            setOnlyShowShortDescript(false);
                        };

                        item.parentNode?.append(buttonNode);
                    } else {
                        const notesOfItem: NodeListOf<ChildNode> = item.childNodes;
                        totalCurrent += handleHideTextLong(notesOfItem, totalCurrent, level + 1);
                    }
                }
            } else {
                if (item.nodeType !== 3) {
                    item.remove();
                } else {
                    item.textContent = '';
                }
            }

            totalCurrent += length;
        });

        return totalCurrent;
    }

    React.useEffect(() => {
        setReactionSummary({
            like: QAItem.count_like ?? 0,
            love: QAItem.count_love ?? 0,
            care: QAItem.count_care ?? 0,
            haha: QAItem.count_haha ?? 0,
            wow: QAItem.count_wow ?? 0,
            sad: QAItem.count_sad ?? 0,
            angry: QAItem.count_angry ?? 0,
        });



    }, [QAItem]);

    React.useEffect(() => {
        if (contentRef.current) {
            if (onlyShowShortDescript) {
                if (QAItem.content) {
                    const words = QAItem.content?.split(' ');
                    if (words && words.length > 84) {

                        contentRef.current.innerHTML = QAItem.content;

                        const notes: NodeListOf<ChildNode> = contentRef.current.childNodes;

                        handleHideTextLong(notes);

                    } else {
                        contentRef.current.innerHTML = QAItem.content;
                    }
                }
            } else {
                contentRef.current.innerHTML = QAItem.content;
            }
        }
    }, [onlyShowShortDescript]);

    const totalReaction = reactionType.reduce((total, name) => total + reactionSummary[name], 0);

    const handleReactionClick = (type: string) => () => {

        (async () => {
            const result: {
                summary: { [key: string]: ReactionSummaryProps } | null,
                my_reaction: string,
            } = await reactionService.post({
                post: QAItem.id,
                reaction: type,
                type: 'vn4_elearning_course_qa_reaction',
                user_id: user.id,
            });

            if (result && result.summary) {
                QAItem.my_reaction_type = result.my_reaction;
                setQuestion(prev => ({
                    ...prev,
                    count_like: result.summary?.like?.count ?? 0,
                    count_love: result.summary?.love?.count ?? 0,
                    count_care: result.summary?.care?.count ?? 0,
                    count_haha: result.summary?.haha?.count ?? 0,
                    count_wow: result.summary?.wow?.count ?? 0,
                    count_sad: result.summary?.sad?.count ?? 0,
                    count_angry: result.summary?.angry?.count ?? 0,
                }));
            }
        })()
    }

    return (
        <Box
            sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                pb: 0,
                border: '1px solid',
                position: 'relative',
                borderColor: 'dividerDark',
                borderRadius: 2,
                overflow: 'hidden',
                // cursor: 'pointer',
                backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : 'background.paper'
                // '&:hover': {
                // backgroundColor: 'divider'
                // }
            })}
        // onClick={handleChooseQuestion(question.id)}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    pb: 2,
                }}
            >

                {
                    QAItem.is_incognito ?
                        <Box
                            sx={{
                                borderRadius: '50%',
                                p: '3px',
                                width: 54,
                                height: 54,
                                cursor: 'pointer',
                                backgroundColor: 'text.third',
                                '& .MuiBadge-badge': {
                                    top: 40,
                                    width: 20,
                                    height: 20,
                                    backgroundColor: 'text.third',
                                    color: 'white',
                                }
                            }}
                        >
                            <Tooltip title={'Người dùng ẩn danh'}>
                                <Badge badgeContent={<Icon sx={{ width: 16 }} icon={'StarOutlined'} />}>
                                    <ImageLazyLoading src={'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMTIwdjEyMEgweiIvPjxwYXRoIGQ9Ik02MCAwYzMzLjEzNyAwIDYwIDI2Ljg2MyA2MCA2MHMtMjYuODYzIDYwLTYwIDYwUzAgOTMuMTM3IDAgNjAgMjYuODYzIDAgNjAgMHptMTcuNSA2NC44MzdjLTYuNDU2IDAtMTEuODIyIDQuNTAyLTEzLjIyMiAxMC41MTYtMy4yNjctMS4zOTctNi4zLTEuMDA5LTguNTU2LS4wMzlDNTQuMjgzIDY5LjMgNDguOTE3IDY0LjgzNyA0Mi41IDY0LjgzN2MtNy41MDYgMC0xMy42MTEgNi4wOTItMTMuNjExIDEzLjU4MkMyOC44ODkgODUuOTA4IDM0Ljk5NCA5MiA0Mi41IDkyYzcuMTU2IDAgMTIuOTUtNS41MSAxMy40OTQtMTIuNDk1IDEuMTY3LS44MTUgNC4yNC0yLjMyOCA4LjAxMi4wNzhDNjQuNjI4IDg2LjUyOSA3MC4zODMgOTIgNzcuNSA5MmM3LjUwNiAwIDEzLjYxMS02LjA5MiAxMy42MTEtMTMuNTgxIDAtNy40OS02LjEwNS0xMy41ODItMTMuNjExLTEzLjU4MnptLTM1IDMuODhjNS4zNjcgMCA5LjcyMiA0LjM0NyA5LjcyMiA5LjcwMiAwIDUuMzU1LTQuMzU1IDkuNy05LjcyMiA5LjctNS4zNjcgMC05LjcyMi00LjM0NS05LjcyMi05LjcgMC01LjM1NSA0LjM1NS05LjcwMSA5LjcyMi05LjcwMXptMzUgMGM1LjM2NyAwIDkuNzIyIDQuMzQ3IDkuNzIyIDkuNzAyIDAgNS4zNTUtNC4zNTUgOS43LTkuNzIyIDkuNy01LjM2NyAwLTkuNzIyLTQuMzQ1LTkuNzIyLTkuNyAwLTUuMzU1IDQuMzU1LTkuNzAxIDkuNzIyLTkuNzAxek05NSA1N0gyNXY0aDcwdi00ek03Mi44NzQgMjkuMzRjLS44LTEuODItMi44NjYtMi43OC00Ljc4NS0yLjE0M0w2MCAyOS45MTRsLTguMTI4LTIuNzE3LS4xOTItLjA1OGMtMS45MjgtLjUzMy0zLjk1NC41MS00LjY2OSAyLjM4N0wzOC4xNDQgNTNoNDMuNzEyTDcyLjk1IDI5LjUyNnoiIGZpbGw9IiNEQURDRTAiLz48L2c+PC9zdmc+'} sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                    }} />
                                </Badge>
                            </Tooltip>
                        </Box>
                        :
                        <Box
                            sx={{
                                p: '3px',
                                width: 54,
                                height: 54,
                            }}
                        >
                            <ImageLazyLoading
                                src={getImageUrl(QAItem.author?.avatar, '/images/user-default.svg')}
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                }}
                            />
                        </Box>
                }
                <Box
                    sx={{
                        width: '100%'
                    }}
                >

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                        }}
                    >
                        <Typography
                            sx={{
                                ...cssMaxLine(1),
                                maxWidth: '50%'
                            }}>{QAItem.chapter?.title}</Typography>
                        ·
                        <Typography
                            sx={{
                                ...cssMaxLine(1),
                                maxWidth: '50%'
                            }}>{QAItem.lesson?.title}</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 1,
                        }}
                    >
                        {
                            QAItem.is_incognito ?
                                <Typography>{__('Người dùng ẩn danh')}</Typography>
                                :
                                <Typography>{QAItem.author?.title}</Typography>
                        }
                        {
                            Boolean(QAItem.author?.is_verified) &&
                            <TooltipVerifiedAccount iconSize={20} />
                        }
                        · <span>{dateTimefromNow(QAItem.created_at)}</span>
                    </Box>
                </Box>
            </Box>

            <Typography
                sx={{
                    cursor: 'pointer',
                    fontSize: 18,
                    fontWeight: 500,
                }}
            >
                {QAItem.title}
            </Typography>

            <Box
                ref={contentRef}
                sx={{
                    '& .btn-seemore': {
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontSize: 16,
                        marginLeft: 0.5,
                        '&:hover': {
                            textDecoration: 'underline',
                        }
                    }
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                    height: 28,
                    mt: 1.5,
                    mb: 1.5,
                }}
            >
                <Box>
                    {
                        totalReaction > 0 &&
                        < Tooltip title={
                            <>
                                {
                                    reactionType.map((reaction) => (
                                        reactionList[reaction] && reactionSummary[reaction] ?
                                            <Box key={reaction} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <Avatar alt={reactionList[reaction].title} src={reactionList[reaction].image} sx={{ width: 18, height: 18 }} />
                                                {reactionSummary[reaction]}
                                            </Box>
                                            :
                                            <React.Fragment key={reaction} />
                                    ))
                                }
                            </>
                        }>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 0.2,
                                    bottom: '-11px',
                                    padding: '2px',
                                    borderRadius: 5,
                                    fontSize: 15,
                                    color: 'text.secondary',
                                    cursor: 'pointer',
                                }}
                            >
                                <AvatarGroup sx={{ '& .MuiAvatar-root': { borderColor: 'transparent' } }}>
                                    {
                                        reactionType.filter(reaction => reactionList[reaction] && reactionSummary[reaction]).map((reaction) => (
                                            <Avatar key={reaction} alt={reactionList[reaction].title} src={reactionList[reaction].image} sx={{ width: 18, height: 18 }} />
                                        ))
                                    }
                                </AvatarGroup>
                                {reactionType.reduce((total, name) => total + reactionSummary[name], 0)}
                            </Box>
                        </Tooltip>
                    }
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                    }}
                >
                    <Typography
                        sx={{
                            cursor: 'pointer',
                            '&:hover': {
                                textDecoration: 'underline',
                            }
                        }}
                        onClick={() => handleOnChooseQuestion(QAItem)}
                    >{QAItem.comment_count ?? 0} bình luận</Typography>
                    {
                        QAItem.vote_count ?
                            <Typography>{QAItem.vote_count} lượt vote</Typography>
                            :
                            <></>
                    }
                </Box>
            </Box>
            <Divider color="dark" />
            <Box
                sx={{
                    display: 'flex',
                    gap: 0.5,
                    pt: 0.5,
                    pb: 0.5,
                }}
            >
                <TooltipReaction
                    leaveDelay={50}
                    title={
                        <Box
                            sx={{
                                display: 'flex',
                                padding: '5px 0',
                                '& .reactionItem': {
                                    transition: '0.3s all',
                                    cursor: 'pointer',
                                    margin: '0 5px',
                                    width: 39,
                                    height: 39,
                                    zIndex: 1,
                                },
                                '& .reactionItem:hover': {
                                    transform: 'perspective(1px) translate(0, -3px) scale(1.3, 1.3)',
                                }
                            }}
                        >
                            {
                                reactionType.map((key) => (
                                    <Tooltip key={key} title={__(reactionList[key].title)} onClick={handleReactionClick(key)}>
                                        <img className='reactionItem' src={reactionList[key].image} />
                                    </Tooltip>
                                ))
                            }

                        </Box>
                    }
                    disableInteractive={false}
                    sx={{ background: 'red' }}
                >
                    {
                        QAItem.my_reaction_type && reactionList[QAItem.my_reaction_type as ReactionType] ?
                            <Button
                                sx={{ flex: 1, textTransform: 'none', fontSize: 16, }}
                                color="inherit"
                                startIcon={
                                    <Avatar alt={reactionList[QAItem.my_reaction_type as ReactionType].title} src={reactionList[QAItem.my_reaction_type as ReactionType].image} sx={{ width: 18, height: 18 }} />
                                }
                                onClick={handleReactionClick('')}
                            >
                                {reactionList[QAItem.my_reaction_type as ReactionType].title}
                            </Button>
                            :
                            <Button
                                sx={{ flex: 1, textTransform: 'none', fontSize: 16, }}
                                color="inherit"
                                startIcon={<Icon icon="ThumbUpOffAltOutlined" />}
                                onClick={handleReactionClick(reactionList.like.key)}
                            >
                                Thích
                            </Button>
                    }

                </TooltipReaction>
                <Button
                    sx={{ flex: 1, textTransform: 'none', fontSize: 16, }}
                    color="inherit"
                    startIcon={<Icon icon="ChatBubbleOutlineOutlined" />}
                    onClick={() => handleOnChooseQuestion(QAItem)}
                >
                    Bình luận
                </Button>
                <Button
                    sx={{ flex: 1, textTransform: 'none', fontSize: 16, }}
                    color="inherit"
                    startIcon={
                        QAItem.my_follow === 'follow' ?
                            <Icon icon="StarRounded" sx={{ color: '#faaf00' }} />
                            : <Icon icon="StarBorderRounded" sx={{ color: 'inherit' }} />
                    }
                    onClick={async () => {
                        const result: {
                            summary: { [key: string]: ReactionSummaryProps } | null,
                            my_reaction: string,
                        } = await reactionService.post({
                            post: QAItem.id ?? 0,
                            reaction: QAItem.my_follow === 'follow' ? '' : 'follow',
                            type: 'vn4_elearning_course_qa_follow',
                            user_id: user.id
                        });
                        setQuestion(prev => ({
                            ...prev,
                            my_follow: result.my_reaction,
                        }))
                    }}
                >
                    {
                        QAItem.my_follow === 'follow' ? 'Bỏ theo dõi' : 'Theo dõi'
                    }
                </Button>
            </Box>
            {
                QAItem.my_follow === 'follow' &&
                <Box
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: '100px',
                        overflow: 'hidden',
                        height: '100%',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '-6px',
                            // transformOrigin: 'right',
                            right: '-22px',
                            width: '60px',
                            textAlign: 'center',
                            // writingMode: 'vertical-rl',
                            // textOrientation: 'mixed',
                            backgroundColor: '#faaf00',
                            fontSize: '57px',
                            fontWeight: 500,
                            transform: 'rotate(45deg)',
                        }}
                    >
                        <Icon icon="StarRounded" sx={{ color: 'white' }} />
                    </Box>
                </Box>
            }
        </Box>
    )
}

export default QuestionAndAnswerItem


const TooltipReaction = withStyles((theme: Theme) => ({
    tooltip: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        margin: 5,
        minWidth: 250,
        maxWidth: 450,
        fontSize: 13,
        borderRadius: 50,
        boxShadow: '0 4px 5px 0 rgb(0 0 0 / 14%), 0 1px 10px 0 rgb(0 0 0 / 12%), 0 2px 4px -1px rgb(0 0 0 / 20%)',
        fontWeight: 400,
        lineHeight: '22px',
        '& .MuiTooltip-arrow': {
            color: theme.palette.background.paper,
        }
    }
}))(Tooltip);



const reactionType = [
    'like', 'love', 'care', 'haha', 'wow', 'sad', 'angry'
] as const;

type ReactionType = (typeof reactionType)[number];

const reactionList: {
    [K in ReactionType]: {
        key: string,
        title: string,
        color: string,
        image: string,
        count_column: string,
    }
} = {
    like: {
        key: 'like',
        title: __('Thích'),
        color: 'rgb(32, 120, 244)',
        image: '/images/like.gif',
        count_column: 'count_like',
    },
    love: {
        key: 'love',
        title: __('Yêu thích'),
        color: 'rgb(243, 62, 88)',
        image: '/images/love.gif',
        count_column: 'count_love',
    },
    care: {
        key: 'care',
        title: __('Thương thương'),
        color: 'rgb(247, 177, 37)',
        image: '/images/care.gif',
        count_column: 'count_care',
    },
    haha: {
        key: 'haha',
        title: __('Haha'),
        color: 'rgb(247, 177, 37)',
        image: '/images/haha.gif',
        count_column: 'count_haha',
    },
    wow: {
        key: 'wow',
        title: __('Wow'),
        color: 'rgb(247, 177, 37)',
        image: '/images/wow.gif',
        count_column: 'count_wow',
    },
    sad: {
        key: 'sad',
        title: __('Buồn'),
        color: 'rgb(247, 177, 37)',
        image: '/images/sad.gif',
        count_column: 'count_sad',
    },
    angry: {
        key: 'angry',
        title: __('Phẫn nộ'),
        color: 'rgb(233, 113, 15)',
        image: '/images/angry.gif',
        count_column: 'count_angry',
    },
};