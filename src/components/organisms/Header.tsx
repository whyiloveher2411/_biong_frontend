import { Box, Button, ClickAwayListener, Drawer, Grow, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Paper, Popper, useScrollTrigger } from '@mui/material';
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
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Label from 'components/atoms/Label';
import ShoppingCart from 'components/molecules/Header/ShoppingCart';
import { addClasses } from 'helpers/dom';
import { __ } from 'helpers/i18n';
import { getImageUrl } from 'helpers/image';
import useResponsive from 'hook/useResponsive';
import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";
import { RootState } from 'store/configureStore';
import { useLayoutHeaderFooter } from 'store/layout/layout.reducers';
import { IGlobalMenu, upTimes, useSetting } from 'store/setting/settings.reducers';
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

    const layoutState = useLayoutHeaderFooter();

    const [openMenuMobile, setOpenMenuMobile] = React.useState(false);

    // const menus = [
    //     { title: __('Trang chủ'), link: '/' },
    //     { title: __('Developer Roadmaps'), link: '/roadmap' },
    //     // { title: __('Khám phá'), link: '/explore' },
    //     { title: __('Về chúng tôi'), link: '/about' },
    //     { title: __('Liên hệ'), link: '/contact-us' },
    // ];

    if (!layoutState.headerVisible) {
        return <></>
    }

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

                                    <Menus
                                        variant='mobile'
                                        menus={setting?.global?.menus}
                                        openMenuMobile={openMenuMobile}
                                        pathname={pathname}
                                        setOpenMenuMobile={setOpenMenuMobile}
                                    />

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
                        <Menus
                            variant='desktop'
                            menus={setting.global?.menus}
                            openMenuMobile={openMenuMobile}
                            pathname={pathname}
                            setOpenMenuMobile={setOpenMenuMobile}
                        />
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

function Menus({ menus, variant, setOpenMenuMobile, pathname }: {
    variant: 'mobile' | 'desktop',
    menus?: Array<IGlobalMenu>,
    openMenuMobile: boolean,
    setOpenMenuMobile: React.Dispatch<React.SetStateAction<boolean>>,
    pathname: string
}) {

    const classes = useStyles();

    if (variant === 'desktop') {
        return <Box
            sx={{
                marginLeft: 3,
            }}
        >
            {
                menus?.map((menu, index) => {
                    if (menu.type === 'simple') {
                        return <Button
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
                    }

                    if (menu.type === 'group') {
                        return <MenuGroup
                            key={index}
                            menu={menu}
                            pathname={pathname}
                        />
                    }

                    return <MenuComplex
                        key={index}
                        menu={menu}
                        pathname={pathname}
                    />
                })
            }
        </Box>
    }

    return <List>
        {menus?.map((menu, index) => (
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
}

function MenuGroup({ menu, pathname }: { menu: IGlobalMenu, pathname: string }) {

    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(prev => prev ? null : event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return <ClickAwayListener
        onClickAway={handleClose}
    >
        <Box sx={{
            display: 'inline-block',
        }}>
            <Button
                className={addClasses({
                    [classes.menuItem]: true,
                    active: getActive(menu.link, pathname)
                })}
                onClick={handleClick}
            >
                {menu.title}
                <ArrowDropDownRoundedIcon sx={{
                    transition: 'transform 0.3s',
                    transform: anchorEl ? 'rotate(180deg)' : 'rotate(0deg)',
                    fontSize: 26
                }} />
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                hideBackdrop
                sx={{
                    pointerEvents: 'none',
                    '.MuiMenuItem-root': {
                        pointerEvents: 'all',
                    }
                }}
            >
                {
                    menu.sub_menus?.map((sub_menu, index_submenu) => <MenuItem
                        component={Link}
                        to={sub_menu.link}
                        onClick={() => {
                            window.scroll({
                                top: 0,
                                left: 0,
                                behavior: 'smooth'
                            });
                            handleClose();
                        }}
                        key={index_submenu}
                    >{sub_menu.title}</MenuItem>)
                }
            </Menu>
        </Box>
    </ClickAwayListener>
}

function MenuComplex({ menu, pathname }: { menu: IGlobalMenu, pathname: string }) {
    const classes = useStyles();

    // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const anchorEl = React.useRef<HTMLButtonElement>(null);
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(prev => !prev);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return <ClickAwayListener
        onClickAway={handleClose}
    >
        <Box sx={{
            display: 'inline-block',
        }}>
            <Button
                ref={anchorEl}
                className={addClasses({
                    [classes.menuItem]: true,
                    active: getActive(menu.link, pathname)
                })}
                onClick={handleClick}
            >
                {menu.title}
                <ArrowDropDownRoundedIcon sx={{
                    transition: 'transform 0.3s',
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    fontSize: 26
                }} />
            </Button>
            <Popper
                open={open}
                anchorEl={anchorEl.current}
                transition
                disablePortal
                placement="bottom-start"
            >
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        timeout={0}
                    >
                        <Paper
                            sx={{
                                boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                className={'custom_scroll'}
                                sx={{
                                    maxHeight: '80vh',
                                    overflowY: 'auto',
                                    maxWidth: 1000,
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    pointerEvents: 'all',
                                }}
                            >

                                {
                                    menu.sections?.map((section, index_section) => <Box
                                        key={index_section}
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
                                            width: '100%',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                gridColumnEnd: 'span 3',
                                                p: 4,
                                                pt: 3,
                                                pb: 3,
                                                backgroundColor: '#10162F',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                ...(index_section < (menu.sections as ANY).length - 1 ? {
                                                    borderBottom: '1px solid',
                                                    borderColor: '#F5FCFF',
                                                } : {})

                                            }}
                                        >
                                            <Typography color={'white'} sx={{ whiteSpace: 'normal', fontSize: 20, fontWeight: 'bold', }} >{section.title} </Typography>
                                            <Typography fontSize={14} color={'white'} sx={{ pt: 1, pb: 1, whiteSpace: 'normal', }}>{section.description}</Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    mt: 2,
                                                }}
                                            >
                                                {
                                                    section.button_links?.map((link, index_link) => <Typography
                                                        fontSize={14}
                                                        color={'#FFD300'}
                                                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, }}
                                                        key={index_link}
                                                        component={Link}
                                                        to={link.link}
                                                        onClick={() => {
                                                            window.scroll({
                                                                top: 0,
                                                                left: 0,
                                                                behavior: 'smooth'
                                                            });
                                                            handleClose();
                                                        }}
                                                    >
                                                        {link.title_button}
                                                        <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
                                                    </Typography>)
                                                }
                                            </Box>
                                        </Box>
                                        <Box
                                            sx={{
                                                gridColumnEnd: 'span 9',
                                                ...(index_section < (menu.sections as ANY).length - 1 && {
                                                    borderBottom: '1px solid',
                                                })
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    gridTemplateColumns: 'repeat(12, minmax(0px, 1fr))',
                                                    display: 'grid',
                                                    width: '100%',
                                                    pl: 5,
                                                    pt: 4,
                                                    pb: 2,
                                                    pr: 8,
                                                }}
                                            >
                                                {
                                                    section.links?.map((link, index_link) => <Box
                                                        key={index_link}
                                                        sx={{
                                                            gridColumnEnd: 'span 4',
                                                            gridTemplateColumns: 'minmax(0px, 1fr)',
                                                            pb: 2,
                                                            minHeight: 48,
                                                            pr: 2,
                                                            '&:hover p': {
                                                                color: 'text.link',
                                                            }
                                                        }}
                                                        component={Link} to={link.link}
                                                        onClick={() => {
                                                            window.scroll({
                                                                top: 0,
                                                                left: 0,
                                                                behavior: 'smooth'
                                                            });
                                                            handleClose();
                                                        }}
                                                    >
                                                        <Typography sx={{ fontWeight: link.description ? 'bold' : 'unset', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            {
                                                                link.logo ?
                                                                    <ImageLazyLoading
                                                                        src={getImageUrl(link.logo)}
                                                                        sx={{
                                                                            flexShrink: 0,
                                                                            maxHeight: 24,
                                                                            width: 24,
                                                                        }}
                                                                    />
                                                                    : null
                                                            }
                                                            {link.title}
                                                            {
                                                                link.label?.title ?
                                                                    <Label
                                                                        color={link.label.background_color}
                                                                        textColor={link.label.color}
                                                                        sx={{
                                                                            fontWeight: 'bold'
                                                                        }}
                                                                    >
                                                                        {link.label.title}
                                                                    </Label>
                                                                    : null
                                                            }
                                                        </Typography>
                                                        {
                                                            link.description ?

                                                                <Typography fontSize={14} sx={{ whiteSpace: 'normal', lineHeight: '20px', mt: 0.5 }}>{link.description}</Typography>
                                                                :
                                                                null
                                                        }
                                                    </Box>
                                                    )
                                                }

                                            </Box>
                                            {
                                                section.more_links?.map((link, index_link) => <Box
                                                    component={Link}
                                                    to={link.link}
                                                    key={index_link}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '12px 16px',
                                                        borderTop: '1px solid',
                                                        borderColor: 'divider',
                                                        backgroundColor: 'rgb(255 152 0 / 10%)',
                                                        pl: 6,
                                                        pr: 6,
                                                    }}>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            flex: 1,
                                                            ml: 1
                                                        }}>
                                                        <Typography sx={{ flex: 1, fontWeight: 'bold', fontSize: 14 }}>
                                                            {link.title}
                                                        </Typography>
                                                        <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
                                                    </Box>
                                                </Box>
                                                )
                                            }
                                        </Box>
                                    </Box>)
                                }
                            </Box>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box >
    </ClickAwayListener >
}