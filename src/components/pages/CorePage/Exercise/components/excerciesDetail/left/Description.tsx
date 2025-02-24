import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Alert, AlertTitle, Box, Chip, IconButton, Typography } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import React from 'react';
import { Link } from 'react-router-dom';
import { useCodingChallengeContext } from '../context/CodingChallengeContext';
// import { getImageUrl } from 'helpers/image';
// import { ImageProps } from 'components/atoms/Avatar';
import FacebookIcon from '@mui/icons-material/Facebook';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { Tooltip } from '@mui/material';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import MoreButton from 'components/atoms/MoreButton';
import { nFormatter } from 'helpers/number';
import useReaction from 'hook/useReaction';
import useReportPostType from 'hook/useReportPostType';
import { CodingChallengeProps } from 'services/codingChallengeService';
import { colorDifficulty, convertDifficultyToVN } from '../../ProblemsTable';

// import FlowSubmitChallengeCompany from './FlowSubmitChallengeCompany';

function Description() {

    const codingChallengeContext = useCodingChallengeContext();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Box
                className={"custom_scroll"}
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    margin: 0,
                    maxHeight: '100%',
                    overflowY: 'scroll',
                    pl: 2,
                    pr: 2,
                    pt: 2,
                    flexGrow: 1,
                }}
            >
                <Typography variant='h1'>{codingChallengeContext.challenge.order}. {codingChallengeContext.challenge.title_vi || codingChallengeContext.challenge.title}</Typography>
                {/* <Divider color='dark' sx={{ mt: 2, mb: 2 }} />
                {
                    Array.isArray(codingChallengeContext.challenge.tags) && codingChallengeContext.challenge.tags.length > 0 && <Box
                        sx={{ display: 'flex', gap: 1, alignItems: 'center', }}
                    >
                        <Typography>Chủ đề: </Typography>
                        {
                            codingChallengeContext.challenge.tags.map(tag => (
                                <Chip key={tag.id} component={Link} to={"/exercise/tag/" + tag.slug} sx={{ cursor: 'pointer' }} label={tag.title} />
                            ))
                        }
                    </Box>
                } */}

                {/* {

                    Array.isArray(codingChallengeContext.challenge.companies) && codingChallengeContext.challenge.companies.length > 0 && <Box
                        sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2, }}
                    >
                        <Typography>Công ty: </Typography>
                        {
                            codingChallengeContext.challenge.companies.map(company => (
                                <Chip key={company.id} component={Link} to={"/exercise/company/" + company.slug} sx={{ cursor: 'pointer', '.MuiChip-label': { display: 'flex', gap: 1, alignItems: 'center' } }} label={<>{Boolean(company.logo) && <ImageLazyLoading alt={company.title} sx={{ height: 20, width: 'auto' }} src={getImageUrl(company.logo as ImageProps)} />} {company.title}</>} />
                            ))
                        }
                    </Box>
                } */}
                <Divider color='dark' sx={{ mt: 2, mb: 2 }} />

                {
                    codingChallengeContext.challenge.content_vi.map((content, index) => (
                        <ContentDetail key={index} content={content} />
                    ))
                }
                {
                    codingChallengeContext.challenge.hints_vi?.length > 0 &&
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flexDirection: 'column',
                            mt: 2,
                        }}
                    >
                        {
                            codingChallengeContext.challenge.hints_vi?.map((hint, index) => <HintItem key={codingChallengeContext.challenge.id + '_' + index} hint={hint} />)
                        }
                    </Box>
                }
                {/* <Box
                        sx={{
                            pt: 3,
                            pb: 3,
                        }}
                    >
                        <FlowSubmitChallengeCompany />
                    </Box> */}
                {
                    Array.isArray(codingChallengeContext.challenge.similar_questions) && codingChallengeContext.challenge.similar_questions.length > 0 &&
                    <Alert
                        icon={false}
                        sx={{
                            display: 'block',
                            pt: 2,
                            mt: 2,
                            pb: 2,
                            width: '100%',
                        }}
                    >
                        <Typography variant='h3' sx={{ fontWeight: 'bold' }}>Các câu hỏi tương tự</Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                pt: 2,
                                pl: 2,
                            }}
                        >
                            {
                                codingChallengeContext.challenge.similar_questions.map(item => <Box
                                    key={item.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography component={Link} to={"/exercise/" + item.slug} sx={{ fontWeight: 500, fontSize: 14 }}>{item.order}. {item.title}</Typography>
                                    <Chip label={convertDifficultyToVN(item.difficulty)} size='small' sx={{ backgroundColor: colorDifficulty(item.difficulty), color: 'white' }} />
                                </Box>)
                            }
                        </Box>
                    </Alert>
                }
            </Box>
            <DescriptionBottom />
        </Box>
    )
}

export default Description


function ContentDetail({ content }: { content: CodingChallengeProps['content_vi'][number] }) {
    switch (content.type) {
        case 'text':
            return <CodeBlock
                className={"custom_scroll"}
                sx={(theme) => ({
                    position: 'relative',
                    zIndex: 2,
                    margin: 0,
                    'br': {
                        height: 0,
                    },
                    'pre': {
                        borderLeft: '2px solid',
                        borderColor: theme.palette.dividerDark,
                        fontFamily: 'Menlo, sans-serif',
                        pl: 2,
                        whiteSpace: 'normal',
                    },
                    '&>.tab-horizontal': {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '& .tabWarper': {
                            pl: 1,
                        },
                        '& .tabContent': {
                            flexGrow: 1,
                        }
                    },
                    '& .iframe_result': {
                        opacity: 0,
                        position: 'absolute',
                        pointerEvents: 'none !important',
                        background: 'white',
                        left: 0,
                        top: 48,
                        border: 'none',
                        width: '100%',
                        height: 'calc( 100% - 48px)',
                    },
                })}
                html={'text' in content ? content.text : ''}
            />
        case 'examples':
            return <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: 'column',
                }}
            >
                {
                    'examples' in content ? content.examples.map((example, index) => (
                        <Alert
                            key={content.type + '_example_' + index}
                            severity="info"
                            icon={false}
                        >
                            <AlertTitle>Ví dụ {index + 1}</AlertTitle>
                            <Typography> <strong>Đầu vào: </strong><Box component={'span'} dangerouslySetInnerHTML={{ __html: example.input }} /></Typography>
                            <Typography sx={{ mt: 1, }}> <strong>Đầu ra: </strong><Box component={'span'} dangerouslySetInnerHTML={{ __html: example.output }} /></Typography>
                            {
                                Boolean(example.explanation) &&
                                <CodeBlock sx={{ mt: 1, fontSize: 16 }} html={'<strong>Giải thích: </strong>' + example.explanation || ''} />
                            }
                {/* {
                                example.image ?
                                    <ImageLazyLoading
                                        src={example.image}
                                        sx={{
                                            maxWidth: '100%',
                                            mt: 1,
                                        }}
                                    />
                                    :
                                    null
                            } */}
            </Alert>
                    ))
                        :
            null
    }
            </Box >;
        case 'constraints':
    return <Alert
        severity="warning"
        sx={{
            mt: 2,
        }}
    >
        <AlertTitle>Hạn chế</AlertTitle>
        <CodeBlock
            html={
                'constraints' in content ? content.constraints : ''
            }
        />
    </Alert>;
}

return null;
}

function HintItem({ hint }: { hint: { title: string, content: string } }) {

    const [activeViewHint, setActiveViewHint] = React.useState<boolean>(false);

    return <Alert
        severity="info"
        variant='outlined'
        icon={<InfoRoundedIcon />}
        action={
            <IconButton
                onClick={() => setActiveViewHint(prev => !prev)}
                color="inherit" size="small">
                {
                    activeViewHint ?
                        <VisibilityOutlinedIcon />
                        :
                        <VisibilityOffOutlinedIcon />
                }
            </IconButton>
        }
        sx={{
            fontSize: 14,
        }}
    >
        <AlertTitle>{hint.title}</AlertTitle>
        {
            activeViewHint &&
            <CodeBlock
                html={hint.content}
            />
        }
    </Alert>;
}




function DescriptionBottom() {

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
            p: 1,
            display: 'flex',
            gap: 1,
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