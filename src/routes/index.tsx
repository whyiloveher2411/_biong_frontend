import { Theme } from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import LinearProgress from 'components/atoms/LinearProgress';
import Footer from 'components/organisms/Footer';
import Header from 'components/organisms/Header';
import Sidebar from 'components/organisms/Sidebar';
import useAjax from 'hook/useApi';
import React, { Suspense } from 'react';
import {
    Route, RouteObject, Routes
} from "react-router-dom";

interface Props {
    [key: string]: ANY
}

const Loadable = (Component: React.ElementType) => (props: Props) => {
    return (
        <Suspense fallback={<LinearProgress />}>
            <Component {...props} />
        </Suspense>
    );
};

//Admin Screen
const CorePage = Loadable(React.lazy(() => import("components/pages/CorePage/index")));
const NotFound = Loadable(React.lazy(() => import("components/pages/NotFound/index")));

const useStyles = makeStyles({
    root: {
        flex: '1 1 auto',
        display: 'flex',
        overflow: 'hidden',
        zIndex: 997,
    },
    warperMain: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
    },
    main: {
        position: 'relative',
        minHeight: 'calc(100% + 0.5px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
});

const AdminRoute = [
    {
        path: '/',
        element: <CorePage pageCustom="HomePage" />
    },
    {
        path: '/:page',
        element: <CorePage />,
    },
    {
        path: '/:page/:tab',
        element: <CorePage />,
    },
    {
        path: '/:page/:tab/:subtab1',
        element: <CorePage />,
    },
    {
        path: '/:page/:tab/:subtab1/:subtab2',
        element: <CorePage />,
    },
    {
        path: '*',
        element: <NotFound />
    },
];

function Router() {

    const classes = useStyles();

    const theme: Theme = useTheme();

    const { showMessage } = useAjax();

    React.useEffect(() => {
        window.showMessage = showMessage;
    }, []);

    return (
        <div className="App" style={{ background: theme.palette.body.background }}>
            <Header />
            <div className={classes.root}>

                <Sidebar />

                <div id="warperMain" className={classes.warperMain + ' custom_scroll'}>
                    <main className={classes.main}>
                        <Routes>
                            {
                                AdminRoute.map((item: RouteObject, index) => (
                                    <Route key={index} {...item} />
                                ))
                            }
                        </Routes>

                        <Footer />
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Router
