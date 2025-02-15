import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Alert, AlertTitle, Box, Chip, IconButton, Typography } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import { useCodingChallengeContext } from '../context/CodingChallengeContext';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import React from 'react';
import { Link } from 'react-router-dom';
// import { getImageUrl } from 'helpers/image';
// import { ImageProps } from 'components/atoms/Avatar';
import Divider from 'components/atoms/Divider';
import { colorDifficulty, convertDifficultyToVN } from '../../ProblemsTable';
import { CodingChallengeContentHints, CodingChallengeProps } from 'services/codingChallengeService';
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
                    codingChallengeContext.challenge.content.map((content, index) => (
                        <ContentDetail key={index} content={content} />
                    ))
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

        </Box>
    )
}

export default Description


function ContentDetail({ content }: { content: CodingChallengeProps['content'][number] }) {
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
                            <Typography> <strong>Đầu vào: </strong>{example.input}</Typography>
                            <Typography> <strong>Đầu ra: </strong>{example.output}</Typography>
                            {
                                Boolean(example.explanation) &&
                                <Box><Typography> <strong>Giải thích: </strong> </Typography><CodeBlock html={example.explanation || ''} /></Box>
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
            </Box>;
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

        case 'hints':
            return <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: 'column',
                    mt: 2,
                }}
            >
                {
                    'hints' in content ? content.hints.map((hint, index) => <HintItem hint={hint} />)
                        :
                        null
                }
            </Box>;
    }

    return null;
}

function HintItem({ hint }: { hint: CodingChallengeContentHints['hints'][number] }) {

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
