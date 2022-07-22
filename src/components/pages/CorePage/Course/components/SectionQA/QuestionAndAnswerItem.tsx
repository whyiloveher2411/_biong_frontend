import { Box, Button, Link, Typography } from '@mui/material'
import Icon from 'components/atoms/Icon'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import { dateTimefromNow } from 'helpers/date'
import { cssMaxLine } from 'helpers/dom'
import { getImageUrl } from 'helpers/image'
import { extractContent } from 'helpers/string'
import React from 'react'
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
            }}
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
                    onClick={handleChooseQuestion(QAItem.id)}
                >
                    {QAItem.title}
                </Typography>
                <Typography
                    sx={{
                        ...cssMaxLine(1),
                    }}
                >{extractContent(QAItem.content)}</Typography>
                <Typography
                    variant='body2'
                    sx={{
                        display: 'flex',
                        gap: 1,
                        mt: 1,
                    }}
                >
                    <Link>{QAItem.author.title}</Link>
                    · <Link>{QAItem.lesson.title}</Link>
                    · <span>{dateTimefromNow(QAItem.created_at)}</span>
                </Typography>
            </Box>
            <Box
                sx={{
                    width: 100,
                }}
            >
                <Button endIcon={<Icon icon='ArrowUpwardRounded' />}>{QAItem.vote_count ?? 0}</Button>
                <Button endIcon={<Icon icon='ChatBubbleOutlineOutlined' />}>{QAItem.comment_count ?? 0}</Button>
            </Box>

        </Box>
    )
}

export default QuestionAndAnswerItem