import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import Button from 'components/atoms/Button';
import ClickAwayListener from 'components/atoms/ClickAwayListener';
import Divider from 'components/atoms/Divider';
import List from 'components/atoms/List';
import NavigationItem from 'components/molecules/Sidebar/NavigationItem';
import { __ } from 'helpers/i18n';
import React from 'react';
// import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { MenuItem, SidebarProps } from 'services/sidebarService';
// import { RootState } from 'store/configureStore';
// import { UserState } from 'store/user/user.reducers';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
    },
    menuItem1: {
        color: 'inherit',
        display: 'flex',
        textTransform: 'inherit',
        padding: '12px',
        fontSize: 15,
        minWidth: 'auto',
        textAlign: 'left',
        transition: 'none',
        borderBottom: '1px solid ' + theme.palette.dividerDark,
        borderRadius: 0,
    },
    avatar: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    nav: {
        width: 260,
        height: 'calc( 100vh - 66px )',
        maxHeight: 'calc( 100vh - 64px )',
        flex: '0 0 auto',
        zIndex: 3,
        overflowY: 'auto',
        backgroundColor: theme.palette.menu.background,
        borderRight: '1px solid ' + theme.palette.dividerDark,
    },
    subMenu: {
        minWidth: '248px',
        position: 'absolute',
        top: '0',
        background: theme.palette.menu.background,
        right: '-1px',
        transform: 'translateX(100%)',
        zIndex: 1001,
        marginLeft: '1px',
        borderRight: '1px solid ' + theme.palette.dividerDark,
        height: 'calc( 100vh - 66px )',
        maxHeight: 'calc( 100vh - 64px )',
        overflowY: 'auto',
    },
    menuSubTitle: {
        padding: '8px 16px 0 16px',
        fontSize: 17,
    },
    footerLink: {
        '& .MuiButton-root': {
            textTransform: 'none',
            minWidth: 'unset',
        }
    }
}));


const NavigationList = ({ pages, depth }: {
    pages: MenuItem[],
    depth: number,
}) => {

    return (
        <List>
            {pages.reduce(
                (items: React.ReactNode[], menuItem: MenuItem) => reduceChildRoutes({ items, menuItem, depth }), []
            )}
        </List>
    );
};


function getActive(path: string, pathname: string) {
    // return path ? !!matchPath({ path, end: true }, pathname) : false;
    return path ? pathname.search(path) === 0 : false;

}

const reduceChildRoutes = ({ items, menuItem, depth }: {
    menuItem: MenuItem,
    depth: number,
    items: React.ReactNode[],
}) => {

    const { pathname } = useLocation();
    // console.log(pathname);
    const active = getActive(menuItem.href ? menuItem.href : '#', pathname);

    if (menuItem.children) {
        items.push(
            <NavigationItem
                {...menuItem}
                depth={depth}
                key={menuItem.title}
                open={active}
            >
                <NavigationList
                    depth={depth + 1}
                    pages={menuItem.children}
                />
            </NavigationItem>
        );
    } else {
        items.push(
            <NavigationItem
                depth={depth}
                {...menuItem}
                children={undefined}
                key={menuItem.title}
            />
        );
    }

    return items;
};


const MenuList = () => {

    const classes = useStyles();

    // const user = useSelector((state: RootState) => state.user);

    const [subMenuContent, setSubMenuContent] = React.useState<{
        content: SidebarProps,
        key: string,
    } | false>(false);

    return (
        <ClickAwayListener disableReactTree={true} onClickAway={() => { if (subMenuContent !== false) setSubMenuContent(false); }} >
            <div className={classes.root}>
                <nav className={classes.nav + ' custom_scroll custom'} >
                    <NavigationList
                        depth={0}
                        pages={[
                            {
                                title: __('Khóa học'),
                                name: 'courses',
                                icon: 'OndemandVideoOutlined',
                                href: '/instructor/courses',
                            },
                            {
                                title: 'Giao tiếp',
                                name: 'free-tutorials',
                                icon: 'MessageOutlined',
                                href: '/instructor/communication',
                                children: [
                                    {
                                        title: __('Q&A'),
                                        name: 'qa',
                                        href: '/instructor/communication/qa',
                                    },
                                    {
                                        title: __('Note'),
                                        name: 'note',
                                        href: '/instructor/communication/note',
                                    },
                                    // {
                                    //     title: __('Message'),
                                    //     name: 'message',
                                    //     href: '/instructor/communication/message',
                                    // },
                                    {
                                        title: __('Assignments'),
                                        name: 'assignments',
                                        href: '/instructor/communication/assignments',
                                    },
                                    {
                                        title: __('Announcements'),
                                        name: 'announcements',
                                        href: '/instructor/communication/announcements',
                                    },
                                    {
                                        title: __('Comments'),
                                        name: 'comments',
                                        href: '/instructor/communication/comments',
                                    }
                                ]
                            },
                            {
                                title: __('Performance'),
                                name: 'contact',
                                icon: 'EqualizerRounded',
                                href: '/instructor/performance',
                                children: [
                                    {
                                        title: __('Overview'),
                                        name: 'overview',
                                        href: '/instructor/performance/overview',
                                    },
                                    {
                                        title: __('Students'),
                                        name: 'students',
                                        href: '/instructor/performance/students',
                                    },
                                    {
                                        title: __('Reviews'),
                                        name: 'reviews',
                                        href: '/instructor/performance/reviews',
                                    },
                                    // {
                                    //     title: __('Course engagement'),
                                    //     name: 'course-engagement',
                                    //     href: '/instructor/performance/course-engagement',
                                    // },
                                    // {
                                    //     title: __('Traffic & conversion'),
                                    //     name: 'conversion',
                                    //     href: '/instructor/performance/conversion',
                                    // }
                                ]
                            },

                        ]}
                    />
                    {/* {
                        user._state === UserState.identify &&
                        <>
                            <Divider color='dark' />
                            <NavigationList
                                depth={0}
                                pages={[

                                    {
                                        title: 'Favorites',
                                        name: 'favorites',
                                        icon: 'FavoriteBorderRounded',
                                        href: '/favorites'
                                    },
                                ]}
                            />
                        </>
                    } */}
                    <Divider color='dark' />
                    <Box
                        sx={{ padding: 2 }}
                        className={classes.footerLink}
                    >
                        {
                            [
                                // {
                                //     title: 'About',
                                //     href: '/about'
                                // },
                                // {
                                //     title: 'Contact Us',
                                //     href: '/contact-us'
                                // },
                                {
                                    title: 'Advertise',
                                    href: '#'
                                },
                                {
                                    title: 'Copyright',
                                    href: '/terms/copyright-policy'
                                },
                                {
                                    title: 'Privacy Policy',
                                    href: '/terms/privacy-policy'
                                },
                                {
                                    title: 'Terms',
                                    href: '/terms/terms-of-use'
                                },
                            ].map((item, index) => (
                                <Button component={Link} key={index} size="small" to={item.href} color="inherit">{item.title}</Button>
                            ))
                        }
                    </Box>
                    {/* <Typography sx={{ pl: 2, pr: 2, pb: 2 }} variant='body2'>©{new Date().getFullYear()} Course. All Rights Reserved.</Typography> */}
                </nav>
            </div>
        </ClickAwayListener>
    )
}


export default MenuList
