import { Badge, Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Divider from 'components/atoms/Divider'
import Icon from 'components/atoms/Icon'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import Tooltip from 'components/atoms/Tooltip'
import TooltipVerifiedAccount from 'components/molecules/TooltipVerifiedAccount'
import { dateTimefromNow } from 'helpers/date'
import { cssMaxLine } from 'helpers/dom'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import useReaction from 'hook/useReaction'
import React from 'react'
import { Link } from 'react-router-dom'
import { QuestionAndAnswerProps } from 'services/elearningService/@type'
import reactionService, { ReactionSummaryProps } from 'services/reactionService'
import { useUser } from 'store/user/user.reducers'
import CourseLearningContext, { CourseLearningContextProps } from '../../context/CourseLearningContext'

function QuestionAndAnswerItem({ QAItem, handleOnChooseQuestion, setQuestion, limitRowContent = 3 }: {
    QAItem: QuestionAndAnswerProps,
    handleOnChooseQuestion: (question: QuestionAndAnswerProps) => void,
    limitRowContent?: number,
    setQuestion: (callback: (prev: QuestionAndAnswerProps) => QuestionAndAnswerProps) => void
}) {

    const user = useUser();

    const courseLearningContext = React.useContext<CourseLearningContextProps>(CourseLearningContext);

    const contentRef = React.useRef<HTMLDivElement>(null);

    const [onlyShowShortDescript, setOnlyShowShortDescript] = React.useState(true);

    const reactionHook = useReaction({
        post: {
            ...QAItem,
            type: 'vn4_elearning_course_qa',
        },
        reactionPostType: 'vn4_elearning_course_qa_reaction',
        keyReactionCurrent: 'my_reaction_type',
        reactionTypes: ['like', 'love', 'care', 'haha', 'wow', 'sad', 'angry'],
        afterReaction: (result) => {
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
        },
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
                            <Link
                                to={"/user/" + QAItem.author?.slug}
                            >
                                <ImageLazyLoading
                                    src={getImageUrl(QAItem.author?.avatar, '/images/user-default.svg')}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                    }}
                                />
                            </Link>
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
                                maxWidth: '50%',
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline',
                                }
                            }}
                            onClick={() => {
                                const chapter = courseLearningContext.course?.course_detail?.content?.findIndex(item => (item.id + '') === (QAItem.chapter?.id + ''));
                                if (chapter !== undefined && chapter > -1) {
                                    const lesson = 0;
                                    if (lesson !== undefined && courseLearningContext.course?.course_detail?.content?.[chapter]?.lessons[0]) {
                                        courseLearningContext.handleChangeLesson({
                                            chapter: courseLearningContext.course?.course_detail?.content?.[chapter].code ?? '',
                                            chapterID: courseLearningContext.course?.course_detail?.content?.[chapter].id ?? 0,
                                            chapterIndex: chapter,
                                            lesson: courseLearningContext.course?.course_detail?.content?.[chapter]?.lessons[lesson]?.code ?? '',
                                            lessonID: courseLearningContext.course?.course_detail?.content?.[chapter]?.lessons[lesson]?.id ?? 0,
                                            lessonIndex: lesson,
                                        });
                                    }
                                }
                            }}
                        >
                            {QAItem.chapter?.title}
                        </Typography>
                        ·
                        <Typography
                            sx={{
                                ...cssMaxLine(1),
                                maxWidth: '50%',
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline',
                                }
                            }}
                            onClick={() => {
                                const chapter = courseLearningContext.course?.course_detail?.content?.findIndex(item => (item.id + '') === (QAItem.chapter?.id + ''));
                                if (chapter !== undefined && chapter > -1) {
                                    const lesson = courseLearningContext.course?.course_detail?.content?.[chapter]?.lessons?.findIndex(item => (item.id + '') === (QAItem.lesson?.id + ''));
                                    if (lesson !== undefined && lesson > -1) {
                                        courseLearningContext.handleChangeLesson({
                                            chapter: courseLearningContext.course?.course_detail?.content?.[chapter].code ?? '',
                                            chapterID: courseLearningContext.course?.course_detail?.content?.[chapter].id ?? 0,
                                            chapterIndex: chapter,
                                            lesson: courseLearningContext.course?.course_detail?.content?.[chapter]?.lessons[lesson]?.code ?? '',
                                            lessonID: courseLearningContext.course?.course_detail?.content?.[chapter]?.lessons[lesson]?.id ?? 0,
                                            lessonIndex: lesson,
                                        });
                                    }
                                }
                            }}
                        >
                            {QAItem.lesson?.title}</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {
                            QAItem.author ?
                                QAItem.is_incognito ?
                                    <Typography>{__('Người dùng ẩn danh')}</Typography>
                                    :
                                    <Typography
                                        component={Link}
                                        to={"/user/" + QAItem.author.slug}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            }
                                        }}
                                    >{QAItem.author.title}</Typography>
                                :
                                <></>
                        }
                        {
                            Boolean(QAItem.author?.is_verified) &&
                            <TooltipVerifiedAccount iconSize={20} />
                        }
                        · <Typography
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline',
                                }
                            }}
                            onClick={() => handleOnChooseQuestion(QAItem)}
                        >{dateTimefromNow(QAItem.created_at)}</Typography>
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
                    {reactionHook.componentSummary}
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
                <Box
                    sx={{
                        flex: 1,
                        '&>button': {
                            width: '100%',
                        }
                    }}
                >
                    {reactionHook.toolTip}
                </Box>
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
                        width: '40px',
                        overflow: 'hidden',
                        height: '40px',
                        pointerEvents: 'none',
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