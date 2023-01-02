import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Box from 'components/atoms/Box';
import Divider from 'components/atoms/Divider';
import { useWebBrowser } from 'components/atoms/WebBrowser';
import Auth from 'components/organisms/Auth';
import { addClasses } from 'helpers/dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';
import { UserState } from 'store/user/user.reducers';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        maxWidth: '100%',
        margin: '0 auto',
        padding: theme.spacing(4, 2),
    },
    rootCenter: {
        padding: theme.spacing(3),
        paddingTop: '10vh',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center'
    },
    headTop: {
        position: 'sticky',
        top: 0,
        background: theme.palette.body.background,
        boxShadow: '6px 0px 0 ' + theme.palette.body.background + ', -6px 0px 0 ' + theme.palette.body.background,
        zIndex: 1000,
    },
    divider: {
        margin: '16px 0 16px 0',
    },
    rootlg: {
        width: 1328,
    },
    rootXl: {
        width: '100%',
    },

}));


interface PageProps {
    [key: string]: ANY,
    title: string,
    children: React.ReactNode,
    isContentCenter?: boolean,
    header?: React.ReactNode,
    width?: 'lg' | 'xl',
    isHeaderSticky?: boolean,
}

const AuthGuard = ({ title, children, header, isHeaderSticky = false, width = 'lg', isContentCenter = false, className = '', ...rest }: PageProps) => {

    const user = useSelector((state: RootState) => state.user);

    const classes = useStyles();

    const webBrowser = useWebBrowser();

    React.useEffect(() => {
        webBrowser.setTitle(title);
    }, [title]);


    if (user._state === UserState.nobody) {
        return <Auth />
    }

    return (
        <Box className={addClasses({
            [classes.root]: true,
            [classes.rootXl]: width === 'xl',
            [classes.rootlg]: width === 'lg',
        })}>
            <Box
                {...rest}
                className={addClasses({
                    [className]: true,
                    [classes.rootCenter]: isContentCenter
                })}
            >
                <div className={classes.headTop} id={isHeaderSticky ? "header-section-top" : undefined}>
                    {header}
                    {
                        isHeaderSticky &&
                        <Divider className={classes.divider} color="dark" />
                    }
                </div>
                {
                    user._state === UserState.identify &&
                    children
                }
            </Box>
        </Box >
    )
}

export default AuthGuard
