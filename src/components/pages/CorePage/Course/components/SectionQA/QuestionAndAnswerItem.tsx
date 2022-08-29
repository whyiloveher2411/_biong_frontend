import { Box, Button, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
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
            <Box
                sx={{
                    p: '3px',
                    width: 54,
                    height: 54,
                }}
            >
                <ImageLazyLoading
                    src={getImageUrl(QAItem.author.avatar, '/images/user-default.svg')}
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                    }}
                />
            </Box>
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
                    <Typography>{QAItem.author.title}</Typography>
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
                        top: 0,
                        transformOrigin: 'right',
                        bottom: 0,
                        right: 0,
                        width: '24px',
                        textAlign: 'center',
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        backgroundColor: 'dividerDark',
                        fontSize: 12,
                        fontWeight: 500,
                    }}
                >
                    {__('Đang theo dõi')}
                </Box>
            }
        </Box>
    )
}

export default QuestionAndAnswerItem