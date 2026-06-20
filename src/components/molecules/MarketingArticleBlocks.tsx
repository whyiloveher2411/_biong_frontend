import { Box, Typography } from '@mui/material';
import Markdown from 'components/atoms/Markdown';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { MarketingArticleBlock } from 'services/marketingNewsService';
import React from 'react';

type MarketingArticleBlocksProps = {
    blocks: MarketingArticleBlock[];
};

function MarketingArticleBlocks({ blocks }: MarketingArticleBlocksProps) {
    if (!blocks.length) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            {blocks.map((block, index) => {
                if (block.type === 'text') {
                    if (!block.data?.trim()) {
                        return null;
                    }

                    if (block.format === 'html') {
                        return (
                            <Box
                                key={`text-${index}`}
                                sx={{
                                    '& p': { mb: 2, lineHeight: 1.7 },
                                    '& img': { maxWidth: '100%', height: 'auto' },
                                }}
                                dangerouslySetInnerHTML={{ __html: block.data }}
                            />
                        );
                    }

                    return (
                        <Markdown key={`text-${index}`} sx={{ '& p': { lineHeight: 1.7 } }}>
                            {block.data}
                        </Markdown>
                    );
                }

                if (block.type === 'image' && block.url?.trim()) {
                    return (
                        <Box key={`image-${index}`}>
                            <ImageLazyLoading
                                src={block.url}
                                alt={block.caption?.trim() || ''}
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: 2,
                                }}
                            />
                            {block.caption?.trim() ? (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', mt: 1 }}
                                >
                                    {block.caption}
                                </Typography>
                            ) : null}
                        </Box>
                    );
                }

                return null;
            })}
        </Box>
    );
}

export default MarketingArticleBlocks;
