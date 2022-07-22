import { Box, Button } from '@mui/material';
import { Theme } from '@mui/material/styles';
import AppBar from 'components/atoms/AppBar';
import makeCSS from 'components/atoms/makeCSS';
import { useTransferLinkDisableScroll } from 'components/atoms/ScrollToTop';
import Toolbar from 'components/atoms/Toolbar';
import Typography from 'components/atoms/Typography';
import Hook from "components/function/Hook";
import Account from 'components/molecules/Header/Account';
import Notification from 'components/molecules/Header/Notification';
import Search from 'components/molecules/Header/Search';
import ShoppingCart from 'components/molecules/Header/ShoppingCart';
import { __ } from 'helpers/i18n';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from 'store/configureStore';
import { UserState } from 'store/user/user.reducers';



const useStyles = makeCSS(({ breakpoints, palette }: Theme) => ({
    root: {
        boxShadow: "none",
        zIndex: 998,
        '& .MuiIconButton-root': {
            color: 'inherit'
        },
    },
    grow: {
        flexGrow: 1,
    },
    title: {
        display: "block",
        fontWeight: 500,
        fontSize: 29,
        [breakpoints.down("xs")]: {
            display: "none",
        },
        color: palette.primary.contrastText,
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

    return (
        <AppBar className={classes.header + ' ' + classes.root} position="static" id="header-top">
            <Toolbar>
                <Link to="/">
                    <Typography className={classes.title} variant="h2" component="h1" noWrap>
                        {'Dev.Life'}
                    </Typography>
                </Link>

                <Search />

                <div className={classes.grow} />
                <Box
                    sx={{
                        display: "flex",
                        gap: 0.5,
                        alignItems: 'center',
                    }}
                >
                    <Hook hook="TopBar/Right" />
                    {
                        user._state === UserState.identify &&
                        <Button onClick={() => disableScroll('/user/' + user.slug + '/my-learning')} sx={{ color: 'white' }}>{__('My learning')}</Button>
                    }
                    <ShoppingCart />
                    {
                        user._state === UserState.identify &&
                        <>
                            <Notification />
                        </>
                    }
                    <Account />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
