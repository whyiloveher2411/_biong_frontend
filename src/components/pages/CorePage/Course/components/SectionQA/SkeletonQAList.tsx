import { Box, Button, Skeleton, Typography } from '@mui/material'
import FieldForm from 'components/atoms/fields/FieldForm'
import Icon from 'components/atoms/Icon'
import { __ } from 'helpers/i18n'

function SkeletonQAList() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            }}
        >
            <Skeleton>
                <Button
                    variant='contained'
                    disableRipple
                    sx={{
                        mb: 2,
                    }}
                >
                    {__('Đặt một câu hỏi mới')}
                </Button>
            </Skeleton>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    mb: 7,
                }}
            >
                <Skeleton variant='rectangular' sx={{ width: '100%', maxWidth: 'unset' }}>
                    <FieldForm
                        component='text'
                        config={{
                            title: undefined,
                        }}
                        post={{}}
                        name="query"
                        onReview={(value) => {
                            //
                        }}
                    />
                </Skeleton>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        width: '100%',
                    }}
                >
                    <Skeleton variant='rectangular'>
                        <Button
                            variant='outlined'
                            color='inherit'
                            endIcon={<Icon icon="ArrowDropDown" />}
                        >
                            All lectures
                        </Button>
                    </Skeleton>
                    <Skeleton variant='rectangular'>
                        <Button
                            variant='outlined'
                            color='inherit'
                            endIcon={<Icon icon="ArrowDropDown" />}
                        >
                            Sort by recommended
                        </Button>
                    </Skeleton>
                    <Skeleton variant='rectangular'>
                        <Button
                            variant='outlined'
                            color='inherit'
                            endIcon={<Icon icon="ArrowDropDown" />}
                        >
                            Filter questions
                        </Button>
                    </Skeleton>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                }}
            >
                <Skeleton>
                    <Typography variant='h4'>{__('All questions in this course')}</Typography>
                </Skeleton>
                <Skeleton>
                    <Typography variant='h4' color='text.secondary'>(0000)</Typography>
                </Skeleton>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                }}
            >

                {
                    [...Array(10)].map((_item, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    p: '3px',
                                    width: 54,
                                    height: 54,
                                }}
                            >
                                <Skeleton
                                    variant='circular'
                                    sx={{
                                        width: 48,
                                        height: 48,
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    width: '100%'
                                }}
                            >
                                <Skeleton>
                                    <Typography
                                        variant='h5'>
                                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                                    </Typography>
                                </Skeleton>
                                <Skeleton>
                                    <Typography>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit dicta rem tempora expedita deleniti quam</Typography>
                                </Skeleton>
                                <Typography
                                    variant='body2'
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        mt: 2,
                                    }}
                                >
                                    <Skeleton>
                                        <span>Dang Thuyen Quan</span>
                                    </Skeleton>
                                    <Skeleton>
                                        <span>Introduction to HTML</span>
                                    </Skeleton>
                                    <Skeleton>
                                        <span>2022-04-28 14:42:32</span>
                                    </Skeleton>
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: 100,
                                }}
                            >
                                <Skeleton>
                                    <Button endIcon={<Icon icon='ArrowUpwardRounded' />}>0</Button>
                                </Skeleton>
                                <Skeleton>
                                    <Button endIcon={<Icon icon='ChatBubbleOutlineOutlined' />}>0</Button>
                                </Skeleton>
                            </Box>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    )
}

export default SkeletonQAList