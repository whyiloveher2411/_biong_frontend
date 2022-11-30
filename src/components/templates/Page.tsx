import { SxProps, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Box from 'components/atoms/Box';
import { addClasses } from 'helpers/dom';
import React from 'react';
import { Helmet } from 'react-helmet';

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
        // position: 'sticky',
        // top: 0,
        // background: theme.palette.body.background,
        // boxShadow: '6px 0px 0 ' + theme.palette.body.background + ', -6px 0px 0 ' + theme.palette.body.background,
        // zIndex: 1000,
    },
    divider: {
        margin: '16px 0 16px 0',
    },
    rootlg: {
        width: 'var(--maxWidth, 1328px)',
        paddingTop: 0,
    },
    rootXl: {
        width: '100%',
    },

}));


interface PageProps {
    // [key: string]: ANY,
    title: string,
    children: React.ReactNode,
    // header?: React.ReactNode,
    width?: 'lg' | 'xl',
    className?: string,
    sx?: SxProps<Theme> | undefined,
    maxWidth?: string,
}

const Page = ({ title, children, width = 'lg', className = '', maxWidth, ...rest }: PageProps) => {

    const classes = useStyles();

    return (
        <Box className={addClasses({
            [classes.root]: true,
            [classes.rootXl]: width === 'xl',
            [classes.rootlg]: width === 'lg',
        })}
            sx={{
                '--maxWidth': maxWidth ?? '1328px',
            }}
        >
            <Box
                {...rest}
                className={addClasses({
                    [className]: true,
                })}
            >
                <Helmet>
                    <title>{title} - {'Học viện Spacedev'}</title>
                </Helmet>
                {children}
            </Box>
        </Box >
    )
}

export default Page
