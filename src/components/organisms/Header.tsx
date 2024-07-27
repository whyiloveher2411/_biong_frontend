import { Box, Button, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, useScrollTrigger } from '@mui/material';
import { Theme } from '@mui/material/styles';
import AppBar from 'components/atoms/AppBar';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import makeCSS from 'components/atoms/makeCSS';
import { useTransferLinkDisableScroll } from 'components/atoms/ScrollToTop';
import Toolbar from 'components/atoms/Toolbar';
import Typography from 'components/atoms/Typography';
import Account from 'components/molecules/Header/Account';
import Notification from 'components/molecules/Header/Notification';
// import Notification from 'components/molecules/Header/Notification';
import ShoppingCart from 'components/molecules/Header/ShoppingCart';
import { addClasses } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import useResponsive from 'hook/useResponsive';
import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";
import { RootState } from 'store/configureStore';
import { upTimes, useSetting } from 'store/setting/settings.reducers';
import { UserState } from 'store/user/user.reducers';



const useStyles = makeCSS(({ breakpoints, palette }: Theme) => ({
    root: {
        // boxShadow: "none",
        zIndex: 1032,
        '& .MuiIconButton-root': {
            color: 'inherit'
        },
    },
    hamburgerMenu: {
        marginLeft: 12,
    },
    logoWarper: {
        paddingLeft: 8,
        paddingRight: 8,
        [breakpoints.up('lg')]: {
            marginLeft: 7,
        },
    },
    toolbar: {
        padding: 0,
    },
    grow: {
        flexGrow: 1,
    },
    menuItem: {
        // color: palette.primary.contrastText,
        paddingTop: 10,
        fontWeight: 400,
        fontSize: '16px',
        textTransform: 'initial',
        color: 'inherit',
        opacity: 0.8,
        position: 'relative',
        paddingLeft: 12,
        paddingRight: 12,
        '&.active': {
            color: 'inherit',
            opacity: 1,
            '&:after': {
                content: '""',
                backgroundColor: palette.primary.main,
                bottom: '-10px',
                height: '2px',
                left: '12px',
                position: 'absolute',
                width: 'calc(100% - 24px)',
                zIndex: '840'
            }
        }
    },
    title: {
        display: "block",
        fontWeight: 500,
        fontSize: 24,
        [breakpoints.down("xs")]: {
            display: "none",
        },
        // color: palette.primary.contrastText,
    },
    header: {
        background: palette.header?.background ? palette.header.background : palette.primary.main,
        borderRadius: 0,
    },
}));

export default function Header() {

    const user = useSelector((state: RootState) => state.user);

    const setting = useSetting();

    const disableScroll = useTransferLinkDisableScroll();

    const classes = useStyles();

    const dispath = useDispatch();

    const isDesktop = useResponsive('up', 'lg');

    const isTablet = useResponsive('up', 'md');

    const { pathname } = useLocation();

    const [openMenuMobile, setOpenMenuMobile] = React.useState(false);

    // const menus = [
    //     { title: __('Trang chủ'), link: '/' },
    //     { title: __('Developer Roadmaps'), link: '/roadmap' },
    //     // { title: __('Khám phá'), link: '/explore' },
    //     { title: __('Về chúng tôi'), link: '/about' },
    //     { title: __('Liên hệ'), link: '/contact-us' },
    // ];

    return (
        <ElevationScroll>
            <AppBar color='inherit' className={classes.header + ' ' + classes.root} position="fixed" id="header-top">
                <Toolbar className={classes.toolbar}>
                    {
                        !isDesktop &&
                        <>
                            <IconButton onClick={() => setOpenMenuMobile(true)} className={classes.hamburgerMenu}>
                                <Icon icon="MenuRounded" />
                            </IconButton>
                            <Drawer
                                anchor={'left'}
                                open={openMenuMobile}
                                transitionDuration={0}
                                onClose={() => {
                                    setOpenMenuMobile(false);
                                }}
                            >
                                <Box
                                    sx={{ width: 250 }}
                                    role="presentation"
                                // onClick={toggleDrawer(anchor, false)}
                                // onKeyDown={toggleDrawer(anchor, false)}
                                >
                                    <Box
                                        component={Link}
                                        to="/"
                                        onClick={() => {
                                            dispath(upTimes());
                                            window.scroll({
                                                top: 0,
                                                left: 0,
                                                behavior: 'smooth'
                                            })
                                        }}
                                        className={classes.logoWarper}
                                        sx={{
                                            display: 'flex',
                                            pt: 2,
                                            pb: 2,
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
                                        <Typography className={classes.title} variant="h2" component="h1" noWrap>
                                            {'Spacedev.vn'}
                                        </Typography>
                                    </Box>
                                    <List>
                                        {setting.global?.menus.map((menu, index) => (
                                            <ListItem onClick={() => setOpenMenuMobile(false)} component={Link} to={menu.link} key={index} disablePadding>
                                                <ListItemButton>
                                                    <ListItemText primary={menu.title} />
                                                </ListItemButton>
                                                {
                                                    !!menu.color_menu &&
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '10px',
                                                            left: 8,
                                                            borderRadius: '50%',
                                                            width: '8px',
                                                            height: '8px',
                                                            backgroundColor: menu.color_menu + '.main',
                                                            ':before': {
                                                                content: '""',
                                                                display: 'block',
                                                                borderRadius: '50%',
                                                                width: '8px',
                                                                height: '8px',
                                                                animation: 'ping 1s cubic-bezier(0,0,.2,1) infinite',
                                                                backgroundColor: menu.color_menu + '.main',
                                                            }
                                                        }}
                                                    />
                                                }
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>

                            </Drawer>
                        </>
                    }
                    <Box
                        component={Link}
                        to="/"
                        onClick={() => {
                            dispath(upTimes());
                            window.scroll({
                                top: 0,
                                left: 0,
                                behavior: 'smooth'
                            })
                        }}
                        className={classes.logoWarper}
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
                        {
                            isTablet ?
                                <Typography className={classes.title} variant="h2" component="h1" noWrap>
                                    {'Spacedev.vn'}
                                </Typography> : null
                        }
                    </Box>
                    {
                        isDesktop &&
                        <Box
                            sx={{
                                marginLeft: 3,
                            }}
                        >
                            {
                                setting.global?.menus.map((menu, index) => (
                                    <Button
                                        key={index}
                                        className={addClasses({
                                            [classes.menuItem]: true,
                                            active: getActive(menu.link, pathname)
                                        })}
                                        component={Link}
                                        to={menu.link}
                                        onClick={() => {
                                            window.scroll({
                                                top: 0,
                                                left: 0,
                                                behavior: 'smooth'
                                            })
                                        }}
                                    >
                                        {menu.title}
                                        {
                                            !!menu.color_menu &&
                                            <Box
                                                component="span"
                                                sx={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: 0,
                                                    borderRadius: '50%',
                                                    width: '8px',
                                                    height: '8px',
                                                    backgroundColor: menu.color_menu + '.main',
                                                    ':before': {
                                                        content: '""',
                                                        display: 'block',
                                                        borderRadius: '50%',
                                                        width: '8px',
                                                        height: '8px',
                                                        animation: 'ping 1s cubic-bezier(0,0,.2,1) infinite',
                                                        backgroundColor: menu.color_menu + '.main',
                                                    }
                                                }}
                                            />
                                        }
                                    </Button>
                                ))
                            }
                        </Box>
                    }
                    {/* <Search /> */}

                    <div className={classes.grow} />
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: 'center',
                            paddingRight: 2,
                        }}
                    >

                        {/* <Button
                            sx={{
                                mr: 1,
                                fontSize: 16,
                                textTransform: 'unset',
                                fontWeight: 400,
                            }}
                            component={Link}
                            to={'/business'}
                            variant='contained'
                        >Giải pháp cho doanh nghiệp</Button> */}

                        {/* <WhatsNews /> */}
                        {
                            user._state === UserState.identify && isTablet &&
                            <Button
                                component={Link}
                                to={'/user/' + user.slug + '/my-learning'}
                                sx={{
                                    fontSize: 16,
                                    textTransform: 'unset',
                                    fontWeight: 400,
                                }}
                                color='inherit' onClick={() => disableScroll('/user/' + user.slug + '/my-learning')}>{__('Khóa học của tôi')}</Button>
                        }
                        <ShoppingCart />
                        {
                            user._state === UserState.identify &&
                            <>
                                <Notification user={user} />
                            </>
                        }

                        <Account isMobile={!isTablet} />
                    </Box>
                </Toolbar>
            </AppBar>
        </ElevationScroll >
    );
}

export function getActive(path: string, current_path: string) {
    return path ? (
        !!matchPath({ path, end: true }, current_path)
        || path === current_path
        || (current_path.includes(path) && path !== '/'))
        : false;
}

function ElevationScroll(props: Props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
    children: React.ReactElement;
}