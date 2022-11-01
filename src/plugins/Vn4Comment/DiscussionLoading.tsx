import { Box, Button, Skeleton, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import { __ } from 'helpers/i18n';

function DiscussionLoading({ length = 10 }: { length?: number }) {
    return <>
        {
            [...Array(length)].map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            borderRadius: '50%',
                            p: '3px',
                            width: 54,
                            height: 54,
                            cursor: 'pointer',
                        }}
                    >
                        <Skeleton variant='circular' sx={{
                            width: 48,
                            height: 48,
                        }} />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                            }}
                        >
                            <Skeleton>
                                <Typography variant='h5'>................................</Typography>
                            </Skeleton>
                            <Skeleton>
                                <Typography color="text.secondary">................</Typography>
                            </Skeleton>
                        </Box>
                        <Skeleton variant='rectangular' sx={{ height: 80 }} />
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                mt: 1,
                            }}
                        >
                            <Skeleton variant='rectangular'>
                                <Button color='inherit' startIcon={<Icon icon="ThumbUpOutlined" />}>
                                    123,567
                                </Button>
                            </Skeleton>
                            <Skeleton variant='rectangular'>
                                <Button color='inherit' startIcon={<Icon icon="ThumbDownOutlined" />}>
                                    123
                                </Button>
                            </Skeleton>
                            <Skeleton variant='rectangular'>
                                <Button
                                    color='inherit'
                                >
                                    {__('Phản hồi')}
                                </Button>
                            </Skeleton>
                        </Box>
                    </Box>
                </Box>
            ))
        }
    </>
}

export default DiscussionLoading