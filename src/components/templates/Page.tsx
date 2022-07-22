import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Box from 'components/atoms/Box';
import Divider from 'components/atoms/Divider';
import { addClasses } from 'helpers/dom';
import React from 'react';
import { Helmet } from 'react-helmet';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        maxWidth: '100%',
        margin: '0 auto',
        padding: theme.spacing(4),
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
        width: 1280,
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

const Page = ({ title, children, header, isHeaderSticky = false, width = 'lg', isContentCenter = false, className = '', ...rest }: PageProps) => {

    const classes = useStyles();

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
                <Helmet>
                    <title>{title} - {'Course'}</title>
                </Helmet>
                <div className={classes.headTop} id={isHeaderSticky ? "header-section-top" : undefined}>
                    {header}
                    {
                        isHeaderSticky &&
                        <Divider className={classes.divider} color="dark" />
                    }
                </div>
                {children}
            </Box>
        </Box >
    )
}

export default Page
