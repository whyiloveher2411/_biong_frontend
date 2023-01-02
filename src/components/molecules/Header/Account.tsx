import { LoadingButton } from "@mui/lab";
import { PaletteMode, Theme } from "@mui/material";
// import { Button, colors, PaletteMode, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Box from "components/atoms/Box";
import Divider from "components/atoms/Divider";
import Icon from "components/atoms/Icon";
import IconButton from "components/atoms/IconButton";
import ImageLazyLoading from "components/atoms/ImageLazyLoading";
import ListItemIcon from "components/atoms/ListItemIcon";
import ListItemText from "components/atoms/ListItemText";
import MenuItem from "components/atoms/MenuItem";
import MenuList from "components/atoms/MenuList";
import MenuPopper from "components/atoms/MenuPopper";
import { useTransferLinkDisableScroll } from "components/atoms/ScrollToTop";
import Tooltip from "components/atoms/Tooltip";
import Typography from "components/atoms/Typography";
import { getCookie, setCookie } from "helpers/cookie";
// import { addClasses } from "helpers/dom";
import { getLanguages, LanguageProps, __ } from "helpers/i18n";
import { getImageUrl } from "helpers/image";
import { addScript } from "helpers/script";
import { themes } from 'helpers/theme';
import useAjax from "hook/useApi";
// import { colorsSchema, shadeColor, themes } from 'helpers/theme';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import accountService from "services/accountService";
import { RootState } from "store/configureStore";
import { change as changeLanguage } from "store/language/language.reducers";
import { changeMode } from "store/theme/theme.reducers";
// import { changeColorPrimary, changeColorSecondary, changeMode } from "store/theme/theme.reducers";
import { logout, refreshScreen, updateAccessToken, UserState } from "store/user/user.reducers";

const useStyles = makeStyles(({ palette }: Theme) => ({
    menuAccount: {
        minWidth: 280,
        maxWidth: '100%',
        maxHeight: '80vh',
        overflowY: 'auto'
    },
    menuItem: {
        minHeight: 36
    },
    colorItem: {
        width: 44,
        height: 44,
        backgroundColor: 'var(--main)',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        '& .MuiIconButton-root': {
            color: 'white',
        }
    },
    colorItemSelected: {
        border: '1px solid ' + palette.text.primary,
    }
}));

function Account() {

    const user = useSelector((state: RootState) => state.user);

    const language = useSelector((state: RootState) => state.language);

    const theme = useSelector((state: RootState) => state.theme);

    const [languages, setLanguages] = React.useState<Array<LanguageProps>>([]);

    const disableScroll = useTransferLinkDisableScroll();

    const classes = useStyles();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [open, setOpen] = React.useState<boolean | string>(false);

    const anchorRef = React.useRef(null);

    const anchorLoginButton = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => prevOpen === false ? 'account' : false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        setOpen(() => false);
        dispatch(logout());
    };

    const handleListKeyDown: React.KeyboardEventHandler = (event: React.KeyboardEvent) => {
        if (event.key === "Tab") {
            event.preventDefault();
            setOpen(false);
        }
    }

    React.useEffect(() => {
        setLanguages(getLanguages());
    }, []);

    const useAjaxLogin = useAjax();

    React.useEffect(() => {
        if (user._state === UserState.nobody && !getCookie('g-one-tap-close')) {
            addScript('https://accounts.google.com/gsi/client', 'g-one-tap', () => {
                window.google.accounts.id.initialize({
                    client_id: '1026939504367-e6cnkb7fu63jcbo9vukn699hunnccsdg.apps.googleusercontent.com',
                    cancel_on_tap_outside: false,
                    callback: (response: ANY) => {

                        let dataUpload = {
                            credential: response.credential,
                        };

                        if (window.__data_login_by_google) {
                            dataUpload = {
                                ...dataUpload,
                                ...window.__data_login_by_google,
                            }
                        }

                        useAjaxLogin.ajax({
                            url: '/vn4-account/login',
                            data: dataUpload,
                            success: (result: { error: boolean, access_token?: string }) => {
                                if (!result.error && result.access_token) {
                                    dispatch(updateAccessToken(result.access_token));
                                }
                            },
                        })
                    }
                });
                window.google.accounts.id.prompt((notification: ANY) => {
                    if (notification.h) {

                        const popupGoogleOneTap = document.getElementById('credential_picker_container');

                        if (popupGoogleOneTap) {

                            //Style in app.css
                            let div = document.createElement("div");
                            div.classList.add('g-one-tap-w');

                            let div2 = document.createElement("div");
                            div2.classList.add('g-one-tap-c');

                            div.append(div2);

                            div.onclick = () => {
                                setCookie('g-one-tap-close', 'true', 1 / 24);
                                popupGoogleOneTap.remove();
                            }
                            popupGoogleOneTap.append(div);
                        }
                    }
                });
            }, 0, 0);
        } else {
            document.getElementById('credential_picker_container')?.remove();

            if (user._state === UserState.identify) {
                if ((user.theme === 'dark' || user.theme === 'light') && user.theme !== theme.palette.mode) {
                    dispatch(changeMode(user.theme));
                }
            }
        }
    }, [user]);

    const handleUpdateViewMode = (mode: PaletteMode) => () => {
        dispatch(changeMode(mode));
        accountService.me.update.updateTheme(mode);
    }

    const renderMenu = (
        <MenuPopper
            style={{ zIndex: 1032 }}
            open={open === 'account'}
            onClose={handleClose}
            anchorEl={anchorLoginButton.current ?? anchorRef.current}
            paperProps={{
                className: classes.menuAccount + ' custom_scroll',
                sx: {
                    border: '1px solid',
                    borderColor: 'dividerDark',
                }
            }}
        >
            <MenuList
                autoFocusItem={open === 'account'}
                onKeyDown={handleListKeyDown}
            >
                {
                    (() => {

                        let menus = [];

                        if (user._state === UserState.identify) {
                            menus.push(<MenuItem
                                key={'account-button'}
                                component={Link}
                                to={'/user/' + user.slug + '/edit-profile'}
                                onClick={handleClose}
                            >
                                <Box
                                    sx={{
                                        display: "flex", width: 1, gridGap: 16
                                    }}
                                >
                                    <ImageLazyLoading
                                        src={getImageUrl(user.avatar, '/images/user-default.svg')}
                                        placeholderSrc='/images/user-default.svg'
                                        name={user.full_name}
                                        sx={{
                                            '& .blur': {
                                                filter: 'unset !important',
                                            },
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: '50%',
                                        }}
                                    />

                                    <div>
                                        <Typography noWrap style={{ maxWidth: 190 }} variant="body1">{user.full_name}</Typography>
                                        <Typography variant="body2">{__("Quản lý tài khoản của bạn")}</Typography>
                                    </div>
                                </Box>
                            </MenuItem>);

                            menus.push(<Divider key={'divider1'} style={{ margin: '8px 0' }} color="dark" />);

                            menus.push(<MenuItem
                                key={'my-learning'}
                                onClick={() => {
                                    disableScroll('/user/' + user.slug + '/my-learning');
                                    handleClose()
                                }}
                            >
                                <ListItemIcon>
                                    <Icon icon='SchoolOutlined' />
                                </ListItemIcon>
                                <Typography noWrap>{__('Khóa học của tôi')}</Typography>
                            </MenuItem>);

                            if (user.is_teacher) {
                                menus.push(<MenuItem
                                    key={'instructor'}
                                    onClick={() => {
                                        disableScroll('/instructor');
                                        handleClose()
                                    }}
                                >
                                    <ListItemIcon>
                                        <Icon icon='DashboardCustomizeOutlined' />
                                    </ListItemIcon>
                                    <Typography noWrap>{__('Giảng viên')}</Typography>
                                </MenuItem>);
                            }

                            menus.push(<Divider key={'divider2'} style={{ margin: '8px 0' }} color="dark" />);
                        }
                        return menus;
                    })()
                }

                <MenuItem
                    className={classes.menuItem}
                    onClick={() => setOpen('theme')}>
                    <ListItemIcon>
                        <Icon icon={themes[theme.palette.mode]?.icon} />
                    </ListItemIcon>
                    <Typography noWrap>{__("Giao diện")}: {theme.palette.mode === 'dark' ? __('Tối') : __('Sáng')}</Typography>
                </MenuItem>

                {/* <MenuItem
                    className={classes.menuItem}
                    onClick={() => setOpen('languages')}>
                    <ListItemIcon>
                        <Icon icon={'Translate'} />
                    </ListItemIcon>
                    <Typography noWrap>{__("Language")}: {language.label}</Typography>
                </MenuItem> */}

                {/* <Divider style={{ margin: '8px 0' }} color="dark" /> */}

                <MenuItem
                    className={classes.menuItem}
                    onClick={() => navigate('/contact-us?subject=support')}>
                    <ListItemIcon>
                        <Icon icon={'HelpOutlineOutlined'} />
                    </ListItemIcon>
                    <Typography noWrap>{__("Trợ giúp & hỗ trợ")}</Typography>
                </MenuItem>

                <MenuItem
                    className={classes.menuItem}
                    onClick={() => navigate('/contact-us?subject=feedback')}>
                    <ListItemIcon>
                        <Icon icon={'SmsFailedOutlined'} />
                    </ListItemIcon>
                    <ListItemText>
                        <Typography noWrap>{__("Đóng góp ý kiến")}</Typography>
                        <Typography variant="body2">{__("Góp phần cải thiện phiên bản mới")}</Typography>
                    </ListItemText>
                </MenuItem>
                {
                    (() => {
                        let menus = [];
                        if (user._state === UserState.identify) {
                            menus.push(<Divider key={'divider'} style={{ margin: '8px 0' }} color="dark" />);
                            menus.push(<MenuItem
                                key={'button-logout'}
                                className={classes.menuItem}
                                onClick={handleLogout}>
                                <ListItemIcon>
                                    <Icon icon={{ custom: '<g><rect fill="none" height="24" width="24" /></g><g><path d="M11,7L9.6,8.4l2.6,2.6H2v2h10.2l-2.6,2.6L11,17l5-5L11,7z M20,19h-8v2h8c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-8v2h8V19z" /></g>' }} />
                                </ListItemIcon>
                                <Typography noWrap>{__("Đăng xuất")}</Typography>
                            </MenuItem>);
                        }
                        return menus;
                    })()
                }

            </MenuList>
        </MenuPopper >
    );

    const renderMenuLanguage = (
        <MenuPopper
            style={{ zIndex: 1032 }}
            open={open === 'languages'}
            anchorEl={anchorLoginButton.current ?? anchorRef.current}
            onClose={() => {
                setOpen(false);
            }}
            paperProps={{
                className: classes.menuAccount + ' custom_scroll',
                sx: {
                    border: '1px solid',
                    borderColor: 'dividerDark',
                }
            }}
        >
            <MenuList
                autoFocusItem={open === 'languages'}
            >
                <MenuItem
                    onClick={() => {
                        setOpen('account');
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            width: 1,
                            gridGap: 16,
                            alignItems: "center"
                        }}
                    >
                        <IconButton>
                            <Icon icon="ArrowBackOutlined" />
                        </IconButton>
                        <Typography variant="h5" style={{ fontWeight: 'normal' }}>{__("Choose your language")}</Typography>
                    </Box>
                </MenuItem>
                <Divider style={{ margin: '8px 0' }} color="dark" />

                {
                    languages.map(option => (
                        <MenuItem
                            key={option.code}
                            className={classes.menuItem}
                            selected={option.code === language.code}
                            onClick={() => {
                                if (option.code !== language.code) {
                                    dispatch(changeLanguage(option));
                                    dispatch(refreshScreen()); //Refresh website
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
        </MenuPopper >
    );

    const renderMenuTheme = (
        <MenuPopper
            style={{ zIndex: 1032 }}
            open={open === 'theme'}
            anchorEl={anchorLoginButton.current ?? anchorRef.current}
            onClose={() => {
                setOpen(false);
            }}
            paperProps={{
                className: classes.menuAccount + ' custom_scroll',
                sx: {
                    border: '1px solid',
                    borderColor: 'dividerDark',
                }
            }}
        >
            <MenuList
                autoFocusItem={open === 'theme'}
                style={{ maxWidth: 288 }}
            >
                <MenuItem
                    onClick={() => setOpen('account')}
                >
                    <Box
                        sx={{
                            display: "flex",
                            width: 1,
                            gridGap: 16,
                            alignItems: "center"
                        }}
                    >
                        <IconButton>
                            <Icon icon="ArrowBackOutlined" />
                        </IconButton>
                        <Typography variant="h5" style={{ fontWeight: 'normal' }}>{__('Appearance')}</Typography>
                    </Box>
                </MenuItem>
                <Divider style={{ margin: '8px 0' }} color="dark" />
                <MenuItem disabled style={{ opacity: .7 }}>
                    <ListItemText>
                        <Typography variant="body2" style={{ whiteSpace: 'break-spaces' }}>{__('Setting applies to this browser only')}</Typography>
                    </ListItemText>
                </MenuItem>
                {
                    Object.keys(themes).map((key: keyof typeof themes) => (
                        <MenuItem
                            className={classes.menuItem}
                            key={key}
                            selected={theme.palette.mode === key}
                            onClick={handleUpdateViewMode(key as PaletteMode)}
                        >
                            <ListItemIcon>
                                <Icon icon={themes[key].icon} />
                            </ListItemIcon>
                            <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                                <Typography noWrap>{__('Appearance')} {themes[key].title}</Typography>
                                {
                                    theme.palette.mode === key && <Icon icon="Check" />
                                }
                            </Box>
                        </MenuItem>
                    ))
                }
                {/* <Divider style={{ margin: '8px 0' }} color="dark" />
                <Box paddingLeft={3} paddingRight={3}>
                    <Typography >{__('Primary')}</Typography>
                    <Box marginTop={1} maxWidth={'100%'} display="flex" gap={0.5} flexWrap="wrap">
                        {
                            Object.keys(colorsSchema).map((key) => (
                                <Tooltip key={key} title={colorsSchema[key].title}>
                                    <div onClick={handleChangeColorPrimary(key)} className={
                                        addClasses({
                                            [classes.colorItem]: true,
                                            [classes.colorItemSelected]: theme.primaryColor === key
                                        })}
                                        style={{
                                            //eslint-disable-next-line
                                            // @ts-ignore: Property does not exist on type
                                            '--dark': colors[key][shadeColor.primary.dark],
                                            //eslint-disable-next-line
                                            // @ts-ignore: Property does not exist on type
                                            '--main': colors[key][shadeColor.primary.main],
                                            //eslint-disable-next-line
                                            // @ts-ignore: Property does not exist on type
                                            '--light': colors[key][shadeColor.primary.light]
                                        }}
                                    >
                                        {
                                            theme.primaryColor === key &&
                                            <IconButton>
                                                <Icon icon="Check" />
                                            </IconButton>
                                        }
                                    </div>
                                </Tooltip>
                            ))
                        }
                    </Box>
                </Box> */}
                {/* <Box padding={[1, 3, 1, 3]}>
                    <Typography>{__('Secondary')}</Typography>
                    <Box marginTop={1} maxWidth={'100%'} display="flex" gap={0.5} flexWrap="wrap">
                        {
                            Object.keys(colorsSchema).map(key => (
                                <Tooltip key={key} title={colorsSchema[key].title}>
                                    <div
                                        key={key}
                                        onClick={handleChangeColorSecondary(key)}
                                        className={
                                            addClasses({
                                                [classes.colorItem]: true,
                                                [classes.colorItemSelected]: theme.secondaryColor === key
                                            })}
                                        style={{
                                            //eslint-disable-next-line
                                            // @ts-ignore: Property does not exist on type
                                            '--dark': colors[key][shadeColor.secondary.dark],
                                            //eslint-disable-next-line
                                            // @ts-ignore: Property does not exist on type
                                            '--main': colors[key][shadeColor.secondary.main],
                                            //eslint-disable-next-line
                                            // @ts-ignore: Property does not exist on type
                                            '--light': colors[key][shadeColor.secondary.light]
                                        }}
                                    >
                                        {
                                            theme.secondaryColor === key &&
                                            <IconButton>
                                                <Icon icon="Check" />
                                            </IconButton>
                                        }
                                    </div>
                                </Tooltip>
                            ))
                        }
                    </Box>
                </Box> */}
            </MenuList>
        </MenuPopper >
    );



    return (
        <>
            {
                user._state === UserState.nobody &&
                <>
                    <IconButton
                        size="large"
                        sx={{ mr: 1, }}
                        onClick={() => {
                            handleUpdateViewMode(theme.palette.mode === 'dark' ? 'light' : 'dark')();
                        }}
                    >
                        {
                            theme.palette.mode === 'dark' ?
                                <Icon color="primary" icon="DarkModeOutlined" />
                                :
                                <Icon color="primary" icon="LightMode" />
                        }
                    </IconButton>
                    <LoadingButton
                        loading={useAjaxLogin.open}
                        sx={{
                            height: 40,
                            borderRadius: 1,
                        }}
                        size="medium"
                        component={Link}
                        to="/auth"
                        variant="outlined"
                        color={theme.palette.mode === 'light' ? 'primary' : 'inherit'}
                    >
                        {__('Đăng nhập')}
                    </LoadingButton>
                </>
            }

            {
                user._state === UserState.identify &&
                <>
                    <Tooltip title={__("Account")}>
                        <IconButton
                            edge="end"
                            color="inherit"
                            ref={anchorRef}
                            aria-controls={open ? "menu-list-grow" : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                            size="large"
                        >
                            <ImageLazyLoading
                                src={getImageUrl(user.avatar, '/images/user-default.svg')}
                                placeholderSrc='/images/user-default.svg'
                                name={user.full_name}
                                sx={{
                                    '& .blur': {
                                        filter: 'unset !important',
                                    },
                                    width: "28px",
                                    height: "28px",
                                    fontSize: 13,
                                    borderRadius: '50%',
                                }}
                            />

                            {/* <Avatar
                                image={user.avatar}
                                name={user.full_name}
                                className={classes.small}
                                variant="circular"
                                src="/images/user-default.svg"
                            /> */}
                        </IconButton>
                    </Tooltip>
                </>
            }

            {renderMenuLanguage}
            {renderMenu}
            {renderMenuTheme}
        </>
    )
}

export default Account