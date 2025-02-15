import FacebookIcon from '@mui/icons-material/Facebook'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import { Box, Tooltip } from '@mui/material'
import Icon from 'components/atoms/Icon'
import MoreButton from 'components/atoms/MoreButton'
import { nFormatter } from 'helpers/number'
import useReaction from 'hook/useReaction'
import useReportPostType from 'hook/useReportPostType'
import { useCodingChallengeContext } from '../context/CodingChallengeContext'

function ContentBottom() {

    const codingChallengeContext = useCodingChallengeContext();

    const reactionHook = useReaction({
        post: {
            ...codingChallengeContext.challenge,
            type: 'e_learning_coding_challenge'
        },
        reactionPostType: 'e_challenge_reaction',
        keyReactionCurrent: 'my_reaction_type',
        reactionTypes: ['like', 'unlike'],
    });


    const dialogReport = useReportPostType({
        dataProps: {
            post: codingChallengeContext.challenge.id,
            type: 'vn4_report_challenge',
        },
        title: 'Báo cáo vấn đề',
        descriptionTop: 'Bằng cách chia sẻ những ý kiến của mình, bạn sẽ giúp chúng tôi xác định các điểm mạnh và điểm yếu của thử thách, từ đó chúng tôi có thể cung cấp những cải tiến và điều chỉnh phù hợp.',
        descriptionBottom: 'Chân thành cảm ơn sự hỗ trợ của bạn và hy vọng rằng bạn sẽ tiếp tục tham gia và chia sẻ ý kiến trong những hoạt động tương lai của chúng tôi.',
        reasonList: {
            'Mô tả hoặc ví dụ không rõ ràng hoặc không chính xác': {
                title: 'Mô tả hoặc ví dụ không rõ ràng hoặc không chính xác'
            },
            'Độ khó không chính xác': {
                title: 'Độ khó không chính xác'
            },
            'Các testcase bị thiếu hoặc không chính xác': {
                title: 'Các testcase bị thiếu hoặc không chính xác'
            },
            'Thời gian chạy quá nghiêm ngặt': {
                title: 'Thời gian chạy quá nghiêm ngặt'
            },
            'Các trường hợp Edge quá khó giải quyết': {
                title: 'Các trường hợp Edge quá khó giải quyết'
            },
            'Khác': {
                title: 'Khác'
            },
        },
    })

    return (<Box
        sx={{
            p: 0.5,
            display: 'flex',
            gap: 1,
            position: 'fixed',
            bottom: 8,
            zIndex: 1000,
        }}
    >
        <Box
            sx={{
                display: 'flex',
                gap: 0.5,
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'divider',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: 13,
                    p: 1,
                    pt: 0.5,
                    pb: 0.5,
                    cursor: 'pointer',
                    color: reactionHook.my_reaction === 'like' ? 'primary.main' : 'inherit'
                }}
                onClick={() => {
                    reactionHook.handleReactionClick(codingChallengeContext.challenge.id, reactionHook.my_reaction === 'like' ? '' : 'like')
                }}
            >
                <ThumbUpAltOutlinedIcon sx={{ fontSize: 16 }} />{reactionHook.counts.like}
            </Box>
            <Box
                sx={{
                    backgroundColor: 'divider',
                    borderRadius: 1,
                    fontSize: 13,
                    p: 1,
                    pt: 0.5,
                    pb: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: reactionHook.my_reaction === 'unlike' ? 'primary.main' : 'inherit'
                }}
                onClick={() => {
                    reactionHook.handleReactionClick(codingChallengeContext.challenge.id, reactionHook.my_reaction === 'unlike' ? '' : 'unlike')
                }}
            >
                <ThumbDownOffAltOutlinedIcon sx={{ fontSize: 16 }} />
            </Box>
        </Box>

        <Box
            sx={{
                backgroundColor: 'divider',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: 13,
                p: 1,
                pt: 0.5,
                pb: 0.5,
                cursor: 'pointer',
            }}
            onClick={() => {
                codingChallengeContext.onChangeTab('discussion')
            }}
        >
            <Icon sx={{ fontSize: 16 }} icon={{ custom: '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="comment" class="svg-inline--fa fa-comment absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"></path></svg>' }} />
            {nFormatter(codingChallengeContext.challenge.comment_count)}
        </Box>

        <MoreButton
            placement='top-start'
            actions={[
                {
                    copy: {
                        title: 'Sao chép đường dẫn',
                        action: () => {
                            let item = window.location.origin + '/exercise/' + codingChallengeContext.challenge.slug;
                            navigator.clipboard.writeText(item);
                            window.showMessage('Đã sao chép liên kết vào bộ nhớ tạm.', 'info');
                        },
                        iconComponent: <LinkRoundedIcon />
                    },
                    facebook: {
                        title: 'Facebook',
                        action: () => {
                            //    
                        },
                        iconComponent: <FacebookIcon sx={{ color: '#4267B2' }} />
                    },
                    linkedin: {
                        title: 'Linkedin',
                        action: () => {
                            //    
                        },
                        iconComponent: <LinkedInIcon sx={{ color: '#2867B2' }} />
                    },
                },
            ]}
        >
            <Tooltip
                title="Chia sẽ"
            >
                <Box
                    sx={{
                        backgroundColor: 'divider',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                        gap: 1,
                        fontSize: 13,
                        p: 1,
                        pt: 0.5,
                        pb: 0.5,
                        cursor: 'pointer',
                    }}
                >
                    <ShareRoundedIcon sx={{ fontSize: 16 }} />
                </Box>
            </Tooltip>
        </MoreButton>

        <Tooltip
            title="Phản hồi"
        >
            <Box
                sx={{
                    backgroundColor: 'divider',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: 13,
                    p: 1,
                    pt: 0.5,
                    pb: 0.5,
                    cursor: 'pointer',
                }}
                onClick={dialogReport.open}
            >
                <HelpOutlineRoundedIcon sx={{ fontSize: 16 }} />
            </Box>
        </Tooltip>
        {
            dialogReport.component
        }
    </Box>
    )
}

export default ContentBottom