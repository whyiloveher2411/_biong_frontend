import { useTheme } from '@mui/material';
import LinearProgress from 'components/atoms/LinearProgress';
import Footer from 'components/organisms/Footer';
// import Footer from 'components/organisms/Footer';
import Header from 'components/organisms/Header';
import { gaEventPageView } from 'helpers/ga';
import useAjax from 'hook/useApi';
import React, { Suspense } from 'react';
import {
    Route, RouteObject, Routes, useLocation
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

    const theme = useTheme();

    const { showMessage } = useAjax();

    React.useEffect(() => {
        window.showMessage = showMessage;
    }, []);

    const { pathname } = useLocation();

    React.useEffect(() => {
        gaEventPageView();
    }, [pathname]);

    return (
        <div className="App" id="warperMain" style={{
            background: theme.palette.body.background
        }}>
            <Header />
            {/* <Sidebar /> */}
            <main style={{
                paddingTop: 64,
                minHeight: 'calc( 100vh - 135px )',
            }}>
                <Routes>
                    {
                        AdminRoute.map((item: RouteObject, index) => (
                            <Route key={index} {...item} />
                        ))
                    }
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

export default Router
