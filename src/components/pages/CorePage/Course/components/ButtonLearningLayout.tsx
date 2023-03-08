import { Box, Button, Typography } from '@mui/material';
import Icon from 'components/atoms/Icon';
import MenuPopper from 'components/atoms/MenuPopper';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';
import { useUpdateThemeLearning, useUpdateThemeLearningTab } from 'store/user/user.reducers';

function ButtonLearningLayout() {

    const user = useSelector((state: RootState) => state.user);

    const updateThemeLearning = useUpdateThemeLearning();

    const updateThemeLearningTab = useUpdateThemeLearningTab();

    const [anchorEl, setAnchorEl] = React.useState<undefined | HTMLElement>(undefined);

    return (<>
        <Button
            color='inherit'
            startIcon={<Icon icon="AutoAwesomeMosaicOutlined" />}
            sx={{ textTransform: 'none', fontWeight: 400 }}
            onClick={(event) => setAnchorEl(event.currentTarget)}
        >
            Layout
        </Button>
        <MenuPopper
            style={{ zIndex: 1032 }}
            open={anchorEl !== undefined}
            onClose={() => setAnchorEl(undefined)}
            anchorEl={anchorEl}
            paperProps={{
                className: 'custom_scroll',
                sx: {
                    border: '1px solid',
                    borderColor: 'dividerDark',
                    mt: 1,
                }
            }}
        >
            <Box sx={{
                maxWidth: '100%',
                width: 350,
                p: 2,
                pt: 3,
                pb: 3,
                display: 'flex',
                gap: 1.5,
                flexDirection: 'column',
            }}>
                <Typography variant='h3' sx={{ mb: 0 }}>Giao diện học tập</Typography>
                <Typography sx={{ mt: -1 }} variant='body2'>Các cài đặt này sẽ chỉ áp dụng trong màn hình học tập.</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                    }}
                >
                    <Box
                        onClick={() => updateThemeLearning('main_right')}
                        sx={{
                            display: 'flex',
                            gap: 1,
                            borderRadius: 1,
                            height: 150,
                            p: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            ...(user.theme_learning === 'main_right' ?
                                {
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                    border: '1px solid',
                                    borderColor: 'rgba(25, 118, 210, 1)',
                                }
                                : {
                                    borderColor: 'text.third',
                                    border: '1px dashed',
                                })
                        }}
                    >
                        Left
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            '&>div': {
                                display: 'flex',
                                gap: 1,
                                borderRadius: 1,
                                border: '1px dashed',
                                borderColor: 'text.third',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                cursor: 'not-allowed !important',
                                opacity: 0.5,
                                p: 2,
                            }}
                        >
                            Video
                        </Box>
                        <Box
                            sx={{
                                p: 2,
                                height: 42,
                                ...(user.theme_learning_tab === 'tab' ?
                                    {
                                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                        border: '1px solid',
                                        borderColor: 'rgba(25, 118, 210, 1) !important',
                                    }
                                    : {
                                        borderColor: 'text.third',
                                        border: '1px dashed',
                                    })
                            }}
                            onClick={() => {
                                updateThemeLearningTab(user.theme_learning_tab === 'tab' ? 'drawer' : 'tab');
                            }}
                        >
                            Tab content
                        </Box>
                    </Box>
                    <Box
                        onClick={() => updateThemeLearning('main_left')}
                        sx={{
                            display: 'flex',
                            gap: 1,
                            borderRadius: 1,
                            height: 150,
                            p: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            ...(user.theme_learning === 'main_left' ?
                                {
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                    border: '1px solid',
                                    borderColor: 'rgba(25, 118, 210, 1)',
                                }
                                : {
                                    borderColor: 'text.third',
                                    border: '1px dashed',
                                })
                        }}
                    >
                        Right
                    </Box>
                </Box>
            </Box>
        </MenuPopper>
    </>
    )
}

export default ButtonLearningLayout
