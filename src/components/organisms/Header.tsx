import { Box, Button, IconButton, useScrollTrigger } from '@mui/material';
import { Theme } from '@mui/material/styles';
import AppBar from 'components/atoms/AppBar';
import Icon from 'components/atoms/Icon';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import makeCSS from 'components/atoms/makeCSS';
import { useTransferLinkDisableScroll } from 'components/atoms/ScrollToTop';
import Toolbar from 'components/atoms/Toolbar';
import Typography from 'components/atoms/Typography';
import Hook from "components/function/Hook";
import Account from 'components/molecules/Header/Account';
// import Notification from 'components/molecules/Header/Notification';
import ShoppingCart from 'components/molecules/Header/ShoppingCart';
import { addClasses } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import useResponsive from 'hook/useResponsive';
import React from 'react';
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";
import { RootState } from 'store/configureStore';
import { UserState } from 'store/user/user.reducers';



const useStyles = makeCSS(({ breakpoints, palette }: Theme) => ({
    root: {
        // boxShadow: "none",
        zIndex: 1031,
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

    const disableScroll = useTransferLinkDisableScroll();

    const classes = useStyles();

    const isDesktop = useResponsive('up', 'lg');

    const { pathname } = useLocation();

    return (
        <ElevationScroll>
            <AppBar color='inherit' className={classes.header + ' ' + classes.root} position="fixed" id="header-top">
                <Toolbar className={classes.toolbar}>
                    {
                        !isDesktop &&
                        <IconButton className={classes.hamburgerMenu}>
                            <Icon icon="MenuRounded" />
                        </IconButton>
                    }
                    <Box
                        component={Link}
                        to="/"
                        className={classes.logoWarper}
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
                        <Typography className={classes.title} variant="h2" component="h1" noWrap>
                            {'Spacedev.vn'}
                        </Typography>
                    </Box>
                    {
                        isDesktop &&
                        <Box
                            sx={{
                                marginLeft: 3,
                            }}
                        >
                            <Button
                                className={addClasses({
                                    [classes.menuItem]: true,
                                    active: getActive('/', pathname)
                                })}
                                component={Link}
                                disableRipple
                                to="/"
                            >
                                {__('Trang chủ')}
                            </Button>

                            <Button
                                className={addClasses({
                                    [classes.menuItem]: true,
                                    active: getActive('/about', pathname)
                                })}
                                component={Link}
                                disableRipple
                                to="/about"
                            >
                                {__('Về chúng tôi')}
                            </Button>
                            <Button
                                className={addClasses({
                                    [classes.menuItem]: true,
                                    active: getActive('/contact-us', pathname)
                                })}
                                component={Link}
                                disableRipple
                                to="/contact-us"
                            >
                                {__('Liên hệ')}
                            </Button>
                        </Box>
                    }
                    {/* <Search /> */}

                    <div className={classes.grow} />
                    <Box
                        sx={{
                            display: "flex",
                            gap: 0.5,
                            alignItems: 'center',
                            paddingRight: 2,
                        }}
                    >
                        <Hook hook="TopBar/Right" />
                        {
                            user._state === UserState.identify &&
                            <Button disableRipple color='inherit' onClick={() => disableScroll('/user/' + user.slug + '/my-learning')}>{__('My learning')}</Button>
                        }
                        <ShoppingCart />
                        {/* {
                        user._state === UserState.identify &&
                        <>
                            <Notification />
                        </>
                    } */}
                        <Account />
                    </Box>
                </Toolbar>
            </AppBar>
        </ElevationScroll >
    );
}

export function getActive(path: string, pathname: string) {
    return path ? !!matchPath({ path, end: true }, pathname) : false;
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