import { Box, Button, ListItemIcon, MenuItem, MenuList, Typography, useTheme } from '@mui/material';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import MenuPopover from 'components/atoms/MenuPopover';
import { LanguageProps, __ } from 'helpers/i18n';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'store/configureStore';
import { change as changeLanguage } from "store/language/language.reducers";
import { refreshScreen } from 'store/user/user.reducers';

export default function Footer() {

    const anchorRef = React.useRef(null);

    const language = useSelector((state: RootState) => state.language);

    const theme = useTheme();

    const dispatch = useDispatch();

    const [langObj, setLangObj] = React.useState<{
        open: boolean,
        languages: Array<LanguageProps>
    }>({
        open: false,
        languages: []
    });

    const renderMenuLanguage = (
        <MenuPopover
            style={{ zIndex: 999 }}
            open={langObj.open}
            anchorEl={anchorRef.current}
            onClose={() => {
                setLangObj(prev => ({
                    ...prev,
                    open: false
                }))
            }}
            PaperProps={{
                sx: {
                    minWidth: 280,
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                },
                className: 'custom_scroll'
            }}
        >
            <MenuList
                autoFocusItem={langObj.open}
            >
                {
                    langObj.languages.map(option => (
                        <MenuItem
                            key={option.code}
                            selected={option.code === language.code}
                            sx={{
                                minHeight: 36,
                                height: 36,
                            }}
                            onClick={() => {
                                if (option.code !== language.code) {
                                    dispatch(changeLanguage(option));
                                    dispatch(refreshScreen()); //Refresh website
                                    setLangObj(prev => ({
                                        ...prev,
                                        open: false,
                                    }))
                                }
                            }}>
                            <ListItemIcon>
                                <img
                                    loading="lazy"
                                    width="20"
                                    src={`https://flagcdn.com/w20/${option.flag.toLowerCase()}.png`}
                                    srcSet={`https://flagcdn.com/w40/${option.flag.toLowerCase()}.png 2x`}
                                    alt=""
                                />
                            </ListItemIcon>
                            <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="inherit" noWrap>
                                    {option.label} {option.note && '(' + option.note + ')'}
                                </Typography>
                                {
                                    option.code === language.code && <Icon icon="Check" />
                                }
                            </Box>
                        </MenuItem>
                    ))
                }

            </MenuList>
        </MenuPopover >
    );

    return (
        <>
            <Box
                sx={{
                    pt: 1.25,
                    mt: 5,
                    background: theme.palette.footer?.background,
                    display: 'flex',
                    justifyContent: 'center',
                }}
                id="footer-main"
            >
                <Box
                    sx={{
                        width: 'var(--containerWidth)',
                        maxWidth: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 3,
                        pl: 2,
                        pr: 2,
                        pt: 3,
                        pb: 3,
                    }}
                >

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            component={Link}
                            to="/"
                            sx={{
                                display: 'flex',
                                gap: 1,
                            }}
                        >
                            <ImageLazyLoading
                                src='/images/LOGO-image-full.svg'
                                sx={{
                                    height: 28,
                                    width: 28,
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: 24,
                                    fontWeight: 500,
                                }}
                                variant="h2" noWrap>
                                {'Spacedev.vn'}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                marginLeft: 3,
                            }}
                        >
                            <Button
                                component={Link}
                                color="inherit"
                                sx={{
                                    textTransform: 'inherit',
                                    fontWeight: 400,
                                    fontSize: '1rem',
                                }}
                                disableRipple
                                to="/terms/privacy-policy"
                            >
                                {__('Quyền riêng tư')}
                            </Button>
                            <Button
                                component={Link}
                                color="inherit"
                                disableRipple
                                to="/terms/terms-of-use"
                                sx={{
                                    textTransform: 'inherit',
                                    fontWeight: 400,
                                    fontSize: '1rem',
                                }}
                            >
                                {__('Điều khoản')}
                            </Button>

                        </Box>
                    </Box>
                </Box >
            </Box >
            {renderMenuLanguage}
        </>
    )
}
