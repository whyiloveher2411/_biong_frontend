import { LoadingButton } from "@mui/lab";
import { PaletteMode, Theme } from "@mui/material";
// import { Button, colors, PaletteMode, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Box from "components/atoms/Box";
import Button from "components/atoms/Button";
import Divider from "components/atoms/Divider";
import Icon from "components/atoms/Icon";
import IconBit from "components/atoms/IconBit";
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
import { convertHMS } from "helpers/date";
// import { addClasses } from "helpers/dom";
import { __, getLanguages, LanguageProps } from "helpers/i18n";
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
// import { change as changeLanguage } from "store/language/language.reducers";
// import { changeColorPrimary, changeColorSecondary, changeMode } from "store/theme/theme.reducers";
import { logout, updateAccessToken, updateHeart, updateInfo, UserProps, UserState, useUpdateThemeLearning, useUpdateThemeLearningTab, useUser } from "store/user/user.reducers";

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

    const updateThemeLearning = useUpdateThemeLearning();

    const updateThemeLearningTab = useUpdateThemeLearningTab();
    // const language = useSelector((state: RootState) => state.language);

    const theme = useSelector((state: RootState) => state.theme);

    const [, setLanguages] = React.useState<Array<LanguageProps>>([]);

    const disableScroll = useTransferLinkDisableScroll();

    const classes = useStyles();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [open, setOpen] = React.useState<false | 'account' | 'languages' | 'theme' | 'point-xp' | 'heart' | 'learning-theme'>(false);

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
        }
    }, [user]);

    const handleUpdateViewMode = (mode: PaletteMode | 'auto') => () => {
        dispatch(updateInfo({
            theme: mode
        }));
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
                                to={'/user/' + user.slug + '/edit-profile/overview'}
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
                                key="heart"
                                className={classes.menuItem}
                                onClick={() => setOpen('heart')}
                            >
                                {
                                    [...Array(user.getMaxHeart())].map((_, index) => (
                                        <Icon key={index} sx={index < user.getHeart() ? { color: '#ff2f26' } : {
                                            color: 'text.primary', opacity: 0.2
                                        }} icon="FavoriteRounded" />
                                    ))
                                }
                            </MenuItem>
                            );

                            menus.push(<MenuItem
                                key="point-xp"
                                className={classes.menuItem}
                                onClick={() => setOpen('point-xp')}>
                                <ListItemIcon>
                                    <Icon icon={IconBit} />
                                </ListItemIcon>
                                <Typography noWrap>{__("Bit")}: {user.getBitToString()}</Typography>
                            </MenuItem>
                            );

                            menus.push(<Divider key={'divider-xp'} style={{ margin: '8px 0' }} color="dark" />);

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
                    <Typography noWrap>{__("Giao diện")}: {listTheme[user.theme as keyof typeof listTheme]}</Typography>
                </MenuItem>

                <MenuItem
                    key="edit_theme_learning"
                    className={classes.menuItem}
                    onClick={() => {
                        setOpen('learning-theme');
                    }}>
                    <ListItemIcon>
                        <Icon icon='AutoAwesomeMosaicOutlined' />
                    </ListItemIcon>
                    <Typography noWrap>Giao diện học tập</Typography>
                </MenuItem>

                <Divider style={{ margin: '8px 0' }} color="dark" />

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

    // const renderMenuLanguage = (
    //     <MenuPopper
    //         style={{ zIndex: 1032 }}
    //         open={open === 'languages'}
    //         anchorEl={anchorLoginButton.current ?? anchorRef.current}
    //         onClose={() => {
    //             setOpen(false);
    //         }}
    //         paperProps={{
    //             className: classes.menuAccount + ' custom_scroll',
    //             sx: {
    //                 border: '1px solid',
    //                 borderColor: 'dividerDark',
    //             }
    //         }}
    //     >
    //         <MenuList
    //             autoFocusItem={open === 'languages'}
    //         >
    //             <MenuItem
    //                 onClick={() => {
    //                     setOpen('account');
    //                 }}
    //             >
    //                 <Box
    //                     sx={{
    //                         display: "flex",
    //                         width: 1,
    //                         gridGap: 16,
    //                         alignItems: "center"
    //                     }}
    //                 >
    //                     <IconButton>
    //                         <Icon icon="ArrowBackOutlined" />
    //                     </IconButton>
    //                     <Typography variant="h5" style={{ fontWeight: 'normal' }}>{__("Choose your language")}</Typography>
    //                 </Box>
    //             </MenuItem>
    //             <Divider style={{ margin: '8px 0' }} color="dark" />

    //             {
    //                 languages.map(option => (
    //                     <MenuItem
    //                         key={option.code}
    //                         className={classes.menuItem}
    //                         selected={option.code === language.code}
    //                         onClick={() => {
    //                             if (option.code !== language.code) {
    //                                 dispatch(changeLanguage(option));
    //                                 dispatch(refreshScreen()); //Refresh website
    //                             }
    //                         }}>
    //                         <ListItemIcon>
    //                             <img
    //                                 loading="lazy"
    //                                 width="20"
    //                                 src={`https://flagcdn.com/w20/${option.flag.toLowerCase()}.png`}
    //                                 srcSet={`https://flagcdn.com/w40/${option.flag.toLowerCase()}.png 2x`}
    //                                 alt=""
    //                             />
    //                         </ListItemIcon>
    //                         <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
    //                             <Typography variant="inherit" noWrap>
    //                                 {option.label} {option.note && '(' + option.note + ')'}
    //                             </Typography>
    //                             {
    //                                 option.code === language.code && <Icon icon="Check" />
    //                             }
    //                         </Box>
    //                     </MenuItem>
    //                 ))
    //             }

    //         </MenuList>
    //     </MenuPopper >
    // );


    const renderMenuPointBit = (
        <MenuPopper
            style={{ zIndex: 1032 }}
            open={open === 'point-xp'}
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
            <MenuList>
                <MenuItem
                    onClick={() => setOpen('account')}
                >
                    <Box
                        sx={{
                            display: "flex",
                            width: 1,
                            gridGap: 16,
                            alignItems: "center",
                            cursor: 'pointer',
                        }}
                    >
                        <IconButton>
                            <Icon icon="ArrowBackOutlined" />
                        </IconButton>
                        <Typography variant="h5" style={{ fontWeight: 'normal' }}>Bit của bạn</Typography>
                    </Box>
                </MenuItem>
            </MenuList>
            <Divider color="dark" sx={{ mt: '8px 0' }} />
            <Box

                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 360,
                    p: 2,
                    pb: 1,
                }}
            >
                <Typography variant="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', }} align="center"><Icon sx={{ fontSize: 32 }} icon={IconBit} /> {user.getBitToString()}</Typography>
                <Typography align="center" sx={{ pl: 3, pr: 3, color: 'text.secondary' }}>Bit cho phép bạn làm rất nhiều điều hữu ích. Hãy tiếp tục học hỏi mỗi ngày để thu thập thêm!</Typography>
                <Divider sx={{ mt: 2 }} />

                <Typography variant="h5">Cách kiếm thêm bit:</Typography>

                {
                    [
                        ['Hoàn thành bài học', 10],
                        ['Đọc thêm các khám phá', 10],
                        ['Hoàn thành các bài tập', 10],
                        ['Đặt câu hỏi trong bài học', 10],
                        ['Đánh giá khóa học', 50],
                    ].map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                gap: 1,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography>{item[0]}</Typography>
                            <Typography>{item[1]} Bit</Typography>
                        </Box>
                    ))
                }
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pl: 2,
                    pr: 1,
                    pb: 2,
                }}
            >
                <Typography>Nhiều hơn nữa...</Typography>
                <Button onClick={() => {
                    setOpen(false);
                }} component={Link} to="/terms/play-games-with-spacedev" color="inherit" sx={{ textTransform: 'unset' }} endIcon={<Icon icon='ArrowForwardRounded' />}>Tìm hiểu thêm</Button>
            </Box>
        </MenuPopper >
    );


    const renderMenuHeart = (
        <MenuPopper
            style={{ zIndex: 1032 }}
            open={open === 'heart'}
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
                autoFocusItem={open === 'heart'}
            >
                <MenuItem
                    onClick={() => setOpen('account')}
                >
                    <Box
                        sx={{
                            display: "flex",
                            width: 1,
                            gridGap: 16,
                            alignItems: "center",
                            cursor: 'pointer',
                        }}
                    >
                        <IconButton>
                            <Icon icon="ArrowBackOutlined" />
                        </IconButton>
                        <Typography variant="h5" style={{ fontWeight: 'normal' }}>Tim của bạn</Typography>
                    </Box>
                </MenuItem>
            </MenuList>
            <Divider color="dark" sx={{ mt: '8px 0' }} />
            {
                user.getHeart() > 0 ?
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            p: 2,
                            pb: 2,
                        }}
                    >
                        <Typography variant="h5" align="center">
                            Sử dụng tim của bạn để tiếp tục học hỏi!
                        </Typography>

                        <Typography
                            variant="h2"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center', }}
                            align="center">
                            {
                                [...Array(user.getMaxHeart())].map((_, index) => (
                                    <Icon renderVersion={user.getHeart()} key={index} sx={index < user.getHeart() ? { fontSize: 32, color: '#ff2f26' } : {
                                        fontSize: 32, color: 'text.primary', opacity: 0.2
                                    }} icon="FavoriteRounded" />
                                ))
                            }
                        </Typography>
                        <Typography
                            align="center" sx={{ pl: 3, pr: 3, color: 'text.secondary' }}>
                            Bạn có {user.getHeart()} tim. Hãy thực hiện thử thách tiếp theo của bạn!
                        </Typography>
                        {
                            user.getHeart() < user.getMaxHeart() &&
                            <BoxFillHeartInfo disableShowHeart />
                        }
                    </Box>
                    :
                    <Box
                        sx={{
                            p: 2
                        }}
                    >
                        <BoxFillHeartInfo />
                    </Box>
            }
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
                style={{ maxWidth: 300 }}
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
                        <Typography variant="h5" style={{ fontWeight: 'normal' }}>Giao diện</Typography>
                    </Box>
                </MenuItem>
                <Divider style={{ margin: '8px 0' }} color="dark" />
                <MenuItem disabled style={{ opacity: .7 }}>
                    <ListItemText>
                        <Typography variant="body2" style={{ whiteSpace: 'break-spaces' }}>Tùy chọn cài đặt sẽ áp dụng cho tài khoản này</Typography>
                    </ListItemText>
                </MenuItem>
                <MenuItem
                    className={classes.menuItem}
                    selected={user.theme === 'auto'}
                    onClick={handleUpdateViewMode('auto')}
                >
                    <ListItemIcon sx={{ opacity: user.theme === 'auto' ? 1 : 0 }}>
                        <Icon icon='Check' />
                    </ListItemIcon>
                    <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                        <Typography noWrap>Dùng giao diện của thiết bị</Typography>
                    </Box>
                </MenuItem>
                {
                    Object.keys(themes).map((key: keyof typeof themes) => (
                        <MenuItem
                            className={classes.menuItem}
                            key={key}
                            selected={user.theme === key}
                            onClick={handleUpdateViewMode(key as PaletteMode)}
                        >
                            <ListItemIcon sx={{ opacity: user.theme === key ? 1 : 0 }}>
                                <Icon icon='Check' />
                            </ListItemIcon>
                            <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                                <Typography noWrap>{__('Giao diện')} {themes[key].title}</Typography>
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


    const renderMenuThemeLearning = (
        <MenuPopper
            style={{ zIndex: 1032 }}
            open={open === 'learning-theme'}
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
                autoFocusItem={open === 'learning-theme'}
                style={{ maxWidth: 300 }}
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
                        <Typography variant="h5" style={{ fontWeight: 'normal' }}>Giao diện học tập</Typography>
                    </Box>
                </MenuItem>
                <Divider style={{ margin: '8px 0' }} color="dark" />
                <MenuItem disabled style={{ opacity: .7 }}>
                    <ListItemText>
                        <Typography variant="body2" style={{ whiteSpace: 'break-spaces' }}>Các cài đặt này sẽ chỉ áp dụng trong màn hình học tập.</Typography>
                    </ListItemText>
                </MenuItem>
                <Typography paddingLeft={2} paddingBottom={1} variant="h6" >{__('Layout')}</Typography>
                {
                    [
                        { key: 'main_left', title: 'Chính - Phụ' },
                        { key: 'main_right', title: 'Phụ - Chính' },
                    ].map(item => (
                        <MenuItem
                            key={item.key}
                            className={classes.menuItem}
                            selected={item.key === user.theme_learning}
                            onClick={() => {
                                updateThemeLearning(item.key as UserProps['theme_learning'] ?? 'main_right')
                            }}
                        >
                            <ListItemIcon sx={{ opacity: item.key === user.theme_learning ? 1 : 0 }}>
                                <Icon icon='Check' />
                            </ListItemIcon>
                            <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                                <Typography noWrap>{item.title}</Typography>
                            </Box>
                        </MenuItem>
                    ))
                }

                <Divider style={{ margin: '8px 0' }} color="dark" />
                <Typography paddingLeft={2} paddingBottom={1} variant="h6" >{__('Tab Content')}</Typography>
                {
                    [{ key: 'tab', title: 'Tab' }, { key: 'drawer', title: 'Drawer' }].map((item, index) => (
                        <MenuItem
                            key={index}
                            className={classes.menuItem}
                            onClick={() => {
                                updateThemeLearningTab(item.key as 'drawer' | 'tab');
                            }}
                        >
                            <ListItemIcon sx={{ opacity: item.key === user.theme_learning_tab ? 1 : 0 }}>
                                <Icon icon='Check' />
                            </ListItemIcon>
                            <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                                <Typography noWrap>{item.title}</Typography>
                            </Box>
                        </MenuItem>
                    ))
                }
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
                    <Tooltip title='Tài khoản'>
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
                        </IconButton>
                    </Tooltip>
                </>
            }

            {/* {renderMenuLanguage} */}
            {renderMenu}
            {renderMenuTheme}
            {renderMenuPointBit}
            {renderMenuHeart}
            {renderMenuThemeLearning}
        </>
    )
}

export default Account


export function BoxFillHeartInfo({ disableShowHeart, actionAfterUpdateHeart, afterFillHeart }: { actionAfterUpdateHeart?: () => void, disableShowHeart?: boolean, afterFillHeart?: () => void }) {

    const timeRef = React.useRef<HTMLSpanElement | null>(null);

    const user = useUser();

    const timeCurrent = React.useRef<NodeJS.Timer | null>(null);

    const [isLoading, setIsLoading] = React.useState(false);

    const dispath = useDispatch();

    const handleClickFillHeart = async () => {
        if (user.getBit() >= 40) {
            setIsLoading(true);
            const result = await accountService.me.game.fillHeaderByBit();

            if (result.heart !== user.getHeart()) {
                dispath(updateInfo({
                    heart: result.heart,
                    bit_point: result.bit,
                }));

                if (afterFillHeart) {
                    afterFillHeart();
                }
            }
            setIsLoading(false);
        }
    }

    React.useEffect(() => {

        timeCurrent.current = setInterval(() => {
            const timeFillFull = (Number(user.heart_fill_time_next) ? Number(user.heart_fill_time_next) : 0);
            const timeNeoPass = parseInt(((new Date()).getTime() / 1000).toFixed()) - user.heart_fill_time_next_neo;

            if (timeNeoPass >= timeFillFull) {
                (async () => {
                    if (actionAfterUpdateHeart) {
                        actionAfterUpdateHeart();
                    }
                    const heart = await accountService.updateHeart();
                    dispath(updateHeart(heart));
                    return true;
                })();
            } else {
                if (timeRef.current) {

                    if ((timeFillFull - timeNeoPass) > 0) {
                        timeRef.current.textContent = convertHMS(timeFillFull - timeNeoPass, true, true, true);
                    } else {
                        timeRef.current.textContent = '[Đang cập nhật....]'
                    }
                }
            }
        }, 1000);

        return () => {
            if (timeCurrent.current) {
                clearInterval(timeCurrent.current);
            }
        }

    }, [user.heart_fill_time_next]);


    return <Box
        sx={{
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            width: '100%',
        }}
    >
        {
            !disableShowHeart ?
                <>
                    <Typography variant='h4'>Bạn đã hết tim</Typography>

                    <Box
                        sx={{ display: 'flex', gap: 0.5 }}
                    >
                        <Icon sx={{ fontSize: 40, color: 'text.primary', opacity: 0.2, }} icon="FavoriteRounded" />
                        <Icon sx={{ fontSize: 40, color: 'text.primary', opacity: 0.2, }} icon="FavoriteRounded" />
                        <Icon sx={{ fontSize: 40, color: 'text.primary', opacity: 0.2, }} icon="FavoriteRounded" />
                    </Box>
                </>
                :
                null
        }
        <Typography sx={{ color: 'text.secondary' }} align='center'>Trái tim của bạn sẽ đầy lại sau <Typography component='span' ref={timeRef}>{
            (Number(user.heart_fill_time_next) ? Number(user.heart_fill_time_next) : 0) - (parseInt(((new Date()).getTime() / 1000).toFixed()) - user.heart_fill_time_next_neo) > 0 ?
                convertHMS((Number(user.heart_fill_time_next) ? Number(user.heart_fill_time_next) : 0) - (parseInt(((new Date()).getTime() / 1000).toFixed()) - user.heart_fill_time_next_neo), true, true, true)
                :
                '[Đang cập nhật...]'
        }</Typography>.</Typography>


        <Box
            sx={{
                backgroundColor: 'divider',
                display: 'flex',
                p: 2,
                borderRadius: 1,
                gap: 2,
                mt: 2,
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Icon sx={{ fontSize: 64, color: '#ff2f26' }} icon="FavoriteOutlined" />
                <Icon sx={{ color: 'white', position: 'absolute', }} icon="RestoreRounded" />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography
                    variant='h5'
                    sx={{ lineHeight: '24px', }}
                >
                    Sử dụng bit của bạn để làm đầy Trái tim. (Bạn có <Icon sx={{ marginBottom: -1 }} icon={IconBit} /> {user.getBitToString()} )
                </Typography>

                <LoadingButton
                    loading={isLoading}
                    variant='outlined'
                    size='large'
                    disabled={user.getBit() < 40}
                    onClick={handleClickFillHeart}
                >
                    Làm đầy với <Icon sx={{ ml: 1, mr: 1, opacity: isLoading ? 0 : 1 }} icon={IconBit} /> 40
                </LoadingButton>
            </Box>
        </Box>
    </Box>
}

const listTheme = {
    'auto': 'Giao diện thiết bị',
    'dark': 'Tối',
    'light': 'Sáng'
};