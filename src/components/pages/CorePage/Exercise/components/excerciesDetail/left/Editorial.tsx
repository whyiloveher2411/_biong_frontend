import { Box, Rating, Typography } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import { useReviewPopup } from 'components/atoms/ReviewPopup';
import React from 'react';
import codingChallengeService from 'services/codingChallengeService';
import { usePremiumContent } from '../../..';
import { useCodingChallengeContext } from '../context/CodingChallengeContext';
import EditorialStepByStep from './EditorialStepByStep';
import NotFound from 'components/molecules/NotFound';
function Editorial() {

    const codingChallengeContext = useCodingChallengeContext();

    const dataReviewPopup = useReviewPopup();

    const premiumContent = usePremiumContent({ titleType: 'hướng dẫn' });

    React.useEffect(() => {

        if (codingChallengeContext.officialsolution === null || codingChallengeContext.officialsolution === false || codingChallengeContext.challenge.id.toString() !== codingChallengeContext.officialsolution?.challenge_id.toString()) {
            codingChallengeContext.setOfficialsolution(null);
        }

        if (codingChallengeContext.officialsolution === null || codingChallengeContext.officialsolution === false || codingChallengeContext.challenge.id.toString() !== codingChallengeContext.officialsolution?.challenge_id.toString()) {
            (async () => {
                const solution = await codingChallengeService.getOfficialsolution(codingChallengeContext.challenge.slug);
                if (solution === null) {
                    // Set challenge chưa có solution
                    codingChallengeContext.setOfficialsolution(false);
                } else if (solution === 'subscription_required') {
                    premiumContent.set(true);
                } else {
                    codingChallengeContext.setOfficialsolution({
                        ...solution,
                        challenge_id: codingChallengeContext.challenge.id,
                    });
                }
            })();
        }

    }, [codingChallengeContext.challenge]);

    if (premiumContent.show) {
        return premiumContent.component
    }

    if (codingChallengeContext.officialsolution) {
        return (
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
                }}
            >
                <Box
                    sx={{
                        maxWidth: 700,
                        m: '0 auto',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            pt: 2,
                            pb: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                            }}
                        >
                            <Rating
                                size="medium"
                                precision={0.1}
                                value={parseFloat(codingChallengeContext.officialsolution.rating ? codingChallengeContext.officialsolution.rating + '' : '5') ?? 5}
                                onChange={(_event, newValue) => {
                                    dataReviewPopup.handleConfirmReview({
                                        content: '',
                                        post: codingChallengeContext.challenge.id,
                                        rating: newValue || 5,
                                        type: 'e_review_off_sol'
                                    }, 'Cảm ơn bạn để lại đánh giá!', (result) => {
                                        if (result?.meta) {
                                            codingChallengeContext.setOfficialsolution(prev => {
                                                if (prev) {
                                                    prev.rating = result.meta.rating;
                                                    prev.reviewNumber = result.meta.reviewNumber;
                                                }
                                                return prev;
                                            });
                                        }
                                    });
                                }}
                                emptyIcon={< Icon icon="Star" style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                            <Typography fontSize={14} ><strong>{parseFloat((codingChallengeContext.officialsolution.rating ?? 5) + '').toFixed(1)}</strong> ({codingChallengeContext.officialsolution.reviewNumber} lượt đánh giá)</Typography>
                        </Box>
                    </Box>
                    {
                        codingChallengeContext.officialsolution.content ?
                            <>
                                <Divider sx={{ mt: 2, mb: 2, borderBottom: 3 }} color="dark" />
                                <div dangerouslySetInnerHTML={{ __html: codingChallengeContext.officialsolution.content }} />
                            </>
                            :
                            null
                    }
                    <EditorialStepByStep id={1} />
                    {
                        codingChallengeContext.officialsolution.approaches.length > 0 &&
                        <Box>

                            <Box>
                                {
                                    codingChallengeContext.officialsolution.approaches.map((solution, index) => (
                                        <Box key={index}>
                                            <Divider sx={{ mt: 2, mb: 2, borderBottom: 3 }} color="dark" />
                                            <Typography variant='h3' sx={{ fontWeight: 'bold' }}>{solution.title}</Typography>
                                            <CodeBlock
                                                html={solution.content}
                                                sx={{
                                                    lineHeight: '30px',
                                                    mt: 2,
                                                }}
                                            />
                                            {
                                                solution.step_by_step?.find(step => !!step.comment) ?
                                                    <Box sx={{ my: 2 }}>
                                                        <EditorialStepByStep id={1} steps={solution.step_by_step} />
                                                    </Box>
                                                    :
                                                    <CodeBlock
                                                        html={'<pre class="language-javascript"><code>' + solution.code_sample + '</code></pre>'}
                                                        sx={{
                                                            lineHeight: '30px',
                                                            my: 2
                                                        }}
                                                    />
                                            }
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 1,
                                                    mt: 2,
                                                }}
                                            >
                                                {
                                                    solution.complexity_time &&
                                                    <CodeBlock
                                                        html={'<strong>⏱️ Thời gian chạy:</strong> ' + solution.complexity_time}
                                                        sx={{
                                                                lineHeight: '30px',
                                                            }}
                                                        />
                                                }

                                                {
                                                    solution.complexity_memory &&
                                                    <CodeBlock
                                                        html={'<strong>🖥️ Bộ nhớ:</strong> ' + solution.complexity_memory}
                                                        sx={{
                                                            lineHeight: '30px',
                                                        }}
                                                    />
                                                }

                                                {
                                                    solution.pros &&
                                                    <CodeBlock
                                                        html={'<strong>🤟 Ưu điểm:</strong> ' + solution.pros}
                                                    sx={{
                                                        lineHeight: '30px',
                                                    }}
                                                    />
                                                }

                                                {
                                                    solution.cons &&
                                                    <CodeBlock
                                                        html={'<strong>👎 Nhược điểm:</strong> ' + solution.cons}
                                                    sx={{
                                                        lineHeight: '30px',
                                                        }}
                                                    />
                                                }
                                            </Box>
                                        </Box>
                                    ))
                                }
                            </Box>
                        </Box>
                    }
                </Box>
            </Box>
        )
    }


    if (codingChallengeContext.officialsolution === null) {
        return <Box
            className={"custom_scroll"}
            sx={{
                position: 'relative',
                zIndex: 2,
                margin: 0,
                height: '100%',
                overflowY: 'scroll',
                pl: 2,
                pr: 2,
            }}
        >
            <Loading open isCover isWarpper />
        </Box>
    }

    return <NotFound
        title='Bài tập này chưa có hướng dẫn chi tiết'
        subTitle='Chúng tôi đang cập nhật hướng dẫn giải chi tiết cho bài tập này. Vui lòng quay lại sau!'
    />
}

export default Editorial