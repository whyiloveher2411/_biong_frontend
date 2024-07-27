import { Box, Rating, Typography } from '@mui/material';
import CodeBlock from 'components/atoms/CodeBlock';
import Divider from 'components/atoms/Divider';
import Icon from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import { useReviewPopup } from 'components/atoms/ReviewPopup';
import React from 'react';
import codingChallengeService from 'services/codingChallengeService';
import { usePremiumContent } from '../..';
import { useCodingChallengeContext } from './context/CodingChallengeContext';
function Editorial() {

    const codingChallengeContext = useCodingChallengeContext();

    const dataReviewPopup = useReviewPopup();

    const premiumContent = usePremiumContent({ titleType: 'hướng dẫn' });

    React.useEffect(() => {

        if (codingChallengeContext.officialsolution === null || codingChallengeContext.challenge.id.toString() !== codingChallengeContext.officialsolution.challenge_id.toString()) {
            codingChallengeContext.setOfficialsolution(null);
        }

        if (codingChallengeContext.officialsolution === null || codingChallengeContext.challenge.id.toString() !== codingChallengeContext.officialsolution.challenge_id.toString()) {
            (async () => {
                const solution = await codingChallengeService.getOfficialsolution(codingChallengeContext.challenge.slug);
                if (solution === null) {
                    // Set challenge chưa có solution
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
                            pt: 2,
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
                    <div dangerouslySetInnerHTML={{ __html: codingChallengeContext.officialsolution.content }} />

                    {
                        codingChallengeContext.officialsolution.approaches.length > 0 &&
                        <Box>

                            <Box>
                                {
                                    codingChallengeContext.officialsolution.approaches.map((solution, index) => (
                                        <Box key={index}>
                                            <Divider sx={{ mt: 3, mb: 3, borderBottom: 3 }} color="dark" />
                                            <Typography variant='h3' sx={{ fontWeight: 'bold' }}>{solution.title}</Typography>
                                            <CodeBlock
                                                html={solution.content}
                                                sx={{
                                                    lineHeight: '30px',
                                                }}
                                            />
                                            <Box>
                                                <Typography variant='h4' sx={{ fontWeight: 'bold' }}>Phân tích</Typography>
                                                <CodeBlock
                                                    html={solution.complexity_time}
                                                    sx={{
                                                        lineHeight: '30px',
                                                    }}
                                                />
                                                <CodeBlock
                                                    html={solution.complexity_memory}
                                                    sx={{
                                                        lineHeight: '30px',
                                                    }}
                                                />
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

export default Editorial