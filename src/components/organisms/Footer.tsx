import { Box, Button, IconButton, ListItemIcon, MenuItem, MenuList, Typography, useTheme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import MenuPopover from 'components/atoms/MenuPopover';
import { LanguageProps, __ } from 'helpers/i18n';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'store/configureStore';
import { change as changeLanguage } from "store/language/language.reducers";
import { upTimes } from 'store/settings';
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
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    zIndex: 809,
                    left: 'auto',
                    padding: 0.5,
                    right: '8px',
                    top: 'calc(50% - 120px)',
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'dividerDark',
                    borderRadius: 1,
                }}
                id="share-box"
            >
                <Tooltip
                    title={__('Gửi qua email')}
                    placement="left"
                    arrow
                >
                    <IconButton
                        size='large'
                        onClick={() => {
                            let link = "mailto:?subject=" + document.title
                                + "&body=" + window.location.href;

                            window.location.href = link;

                            return false
                        }}
                    >
                        <Icon icon="EmailOutlined" />
                    </IconButton>
                </Tooltip>
                <Tooltip
                    title={__('Sao chép liên kết')}
                    placement="left"
                    arrow
                >
                    <IconButton
                        size='large'
                        onClick={() => {
                            let item = window.location.href;
                            navigator.clipboard.writeText(item);
                            window.showMessage(__('Đã sao chép liên kết vào bộ nhớ tạm.'), 'info');
                        }}
                    >
                        <Icon icon="InsertLinkOutlined" />
                    </IconButton>
                </Tooltip>
                <Tooltip
                    title={__('Chia sẻ lên Facebook')}
                    placement="left"
                    arrow
                >
                    <IconButton
                        size='large'
                        sx={{
                            color: '#4267B2'
                        }}
                        onClick={() => {
                            return !window.open('https://www.facebook.com/sharer/sharer.php?app_id=821508425507125&sdk=joey&u=' + window.location.href + '&display=popup&ref=plugin&src=share_button', 'Facebook', 'width=640, height=580, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, top=' + (window.screen.height / 2 - 290) + ', left=' + (window.screen.width / 2 - 320));
                        }}
                    >
                        <Icon icon="Facebook" />
                    </IconButton>
                </Tooltip>
                <Tooltip
                    title={__('Chia sẻ lên Twitter')}
                    placement="left"
                    arrow
                >
                    <IconButton
                        size='large'
                        sx={{
                            color: '#1DA1F2'
                        }}
                        onClick={() => {
                            return !window.open(
                                'https://twitter.com/intent/tweet?url=' + window.location.href + '  &text=' + document.title, 'Twitter', 'width=640, height=580, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, top=' + (window.screen.height / 2 - 290) + ', left=' + (window.screen.width / 2 - 320))
                        }}
                    >
                        <Icon icon="Twitter" />
                    </IconButton>
                </Tooltip>
                <Tooltip
                    title={__('Chia sẻ lên LinkedIn')}
                    placement="left"
                    arrow
                >
                    <IconButton
                        size='large'
                        sx={{
                            color: '#2867B2'
                        }}
                        onClick={() => {
                            return !window.open(
                                'https://www.linkedin.com/shareArticle/?url=' + window.location.href + '&mini=true&text=' + document.title, 'Twitter', 'width=640, height=580, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, top=' + (window.screen.height / 2 - 290) + ', left=' + (window.screen.width / 2 - 320))
                        }}
                    >
                        <Icon icon="LinkedIn" />
                    </IconButton>
                </Tooltip>
            </Box>
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
                            onClick={() => {
                                dispatch(upTimes());
                                window.scroll({
                                    top: 0,
                                    left: 0,
                                    behavior: 'smooth'
                                })
                            }}
                            sx={{
                                display: 'flex',
                                gap: 1,
                                userSelect: 'none',
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

                    <Box>
                        <Button sx={{ textTransform: 'unset', fontWeight: 400, fontSize: 16 }} color='inherit' endIcon={<Icon icon="ArrowUpwardRounded" />} onClick={() => {
                            window.scroll({
                                top: 0,
                                left: 0,
                                behavior: 'smooth'
                            })
                        }} >{__('Lên đầu trang')}</Button>
                    </Box>
                </Box >
            </Box >
            {renderMenuLanguage}
        </>
    )
}
