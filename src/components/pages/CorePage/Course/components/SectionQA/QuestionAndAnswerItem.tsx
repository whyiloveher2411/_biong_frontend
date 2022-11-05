import { Badge, Box, Button, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import Tooltip from 'components/atoms/Tooltip'
import TooltipVerifiedAccount from 'components/molecules/TooltipVerifiedAccount'
import { dateTimefromNow } from 'helpers/date'
import { cssMaxLine } from 'helpers/dom'
import { __ } from 'helpers/i18n'
import { getImageUrl } from 'helpers/image'
import { extractContent } from 'helpers/string'
import { QuestionAndAnswerProps } from 'services/elearningService/@type'

function QuestionAndAnswerItem({ QAItem, handleChooseQuestion }: {
    QAItem: QuestionAndAnswerProps,
    handleChooseQuestion: (id: ID) => () => void
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                border: '1px solid',
                position: 'relative',
                borderColor: 'dividerDark',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'divider'
                }
            }}
            onClick={handleChooseQuestion(QAItem.id)}
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
                <Typography
                    variant='h5'
                    sx={{
                        ...cssMaxLine(1),
                        cursor: 'pointer',
                    }}
                >
                    {QAItem.title}
                </Typography>
                <Typography
                    sx={{
                        ...cssMaxLine(1),
                    }}
                >{extractContent(QAItem.content)}</Typography>
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
                    · <Typography
                        sx={{
                            ...cssMaxLine(1),
                            maxWidth: '50%'
                        }}>{QAItem.lesson.title}</Typography>
                    · <span>{dateTimefromNow(QAItem.created_at)}</span>
                </Box>
            </Box>
            <Box
                sx={{
                    width: 100,
                }}
            >
                <Button color='inherit' endIcon={<Icon icon='ArrowUpwardRounded' />}>{QAItem.vote_count ?? 0}</Button>
                <Button color='inherit' endIcon={<Icon icon='ChatBubbleOutlineOutlined' />}>{QAItem.comment_count ?? 0}</Button>
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