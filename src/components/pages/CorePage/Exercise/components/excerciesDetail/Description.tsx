import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Alert, AlertTitle, Box, Chip, IconButton, Typography } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import { useCodingChallengeContext } from './context/CodingChallengeContext';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import React from 'react';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { Link } from 'react-router-dom';
import { getImageUrl } from 'helpers/image';
import { ImageProps } from 'components/atoms/Avatar';
import Divider from 'components/atoms/Divider';
import { colorDifficulty, convertDifficultyToVN } from '../ProblemsTable';
import FlowSubmitChallengeCompany from './FlowSubmitChallengeCompany';

function Description() {

    const codingChallengeContext = useCodingChallengeContext();

    const [activeViewHints, setActiveViewHints] = React.useState<boolean[]>([]);

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
                <Typography variant='h1'>{codingChallengeContext.challenge.id}. {codingChallengeContext.challenge.title} <Chip label={convertDifficultyToVN(codingChallengeContext.challenge.difficulty)} size='small' sx={{ pl: 1, pr: 1, backgroundColor: colorDifficulty(codingChallengeContext.challenge.difficulty), color: 'white' }} /></Typography>
                <Divider color='dark' sx={{ mt: 2, mb: 2 }} />
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
                }

                {

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
                }
                <Divider color='dark' sx={{ mt: 2, mb: 2 }} />
                <CodeBlock
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
                    html={codingChallengeContext.challenge.content}
                >

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flexDirection: 'column',
                        }}
                    >
                        {
                            codingChallengeContext.challenge.content_examples.map((example, index) => (
                                <Alert
                                    key={codingChallengeContext.challenge.content + '_example_' + index}
                                    severity="info"
                                    icon={false}
                                >
                                    <AlertTitle>{example.title}</AlertTitle>
                                    <Typography> <strong>Đầu vào: </strong>{example.input}</Typography>
                                    <Typography> <strong>Đầu ra: </strong>{example.output}</Typography>
                                    {
                                        Boolean(example.explanation) &&
                                        <Typography> <strong>Giải thích: </strong>{example.explanation}</Typography>
                                    }
                                    {
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
                                    }
                                </Alert>
                            ))
                        }
                    </Box>
                    {
                        codingChallengeContext.challenge.content_constraints.length > 0 &&
                        <Alert
                            severity="warning"
                            sx={{
                                mt: 2,
                            }}
                        >
                            <AlertTitle>Hạn chế</AlertTitle>
                            <ul>
                                {
                                    codingChallengeContext.challenge.content_constraints.map((item, index) => (
                                        <li
                                            key={codingChallengeContext.challenge.content + '_constraint_' + index}
                                        >
                                            <Typography>{item}</Typography>
                                        </li>
                                    ))
                                }
                            </ul>
                        </Alert>
                    }
                    <Box
                        sx={{
                            pt: 3,
                            pb: 3,
                        }}
                    >
                        <FlowSubmitChallengeCompany />
                    </Box>
                    {
                        codingChallengeContext.challenge.hints?.length > 0 &&
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: 'column',
                                mt: 2,
                            }}
                        >
                            {
                                codingChallengeContext.challenge.hints.map((hint, index) => <Alert
                                    key={codingChallengeContext.challenge.content + '_hint_' + index}
                                    severity="info"
                                    variant='outlined'
                                    icon={<InfoRoundedIcon />}
                                    action={
                                        <IconButton
                                            onClick={() => setActiveViewHints(prev => {
                                                prev[index] = !prev[index];
                                                return [...prev];
                                            })}
                                            color="inherit" size="small">
                                            {
                                                activeViewHints[index] ?
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
                                    {
                                        activeViewHints[index] ?
                                            <CodeBlock
                                                html={hint}
                                            />
                                            :
                                            'Gợi ý ' + (index + 1)
                                    }
                                </Alert>)
                            }
                        </Box>
                    }
                </CodeBlock>
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
                                    <Typography component={Link} to={"/exercise/" + item.slug} sx={{ fontWeight: 500, fontSize: 14 }}>{item.id}. {item.title}</Typography>
                                    <Chip label={convertDifficultyToVN(item.difficulty)} size='small' sx={{ backgroundColor: colorDifficulty(item.difficulty), color: 'white' }} />
                                </Box>)
                            }
                        </Box>
                    </Alert>
                }
            </Box>
        </Box >
    )
}

export default Description