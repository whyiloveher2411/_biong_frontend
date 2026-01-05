import { Box, useTheme } from '@mui/material';
// import Footer from 'components/organisms/Footer';
import useAjax from 'hook/useApi';
import React from 'react';
import {
    Route, RouteObject, Routes
} from "react-router-dom";
import { app_webview_name, setFooterVisible, setHeaderVisible, useLayoutHeaderFooter } from 'store/layout/layout.reducers';
import { useDispatch } from 'react-redux';

const Header = React.lazy(() => import("components/organisms/Header"));
const Footer = React.lazy(() => import("components/organisms/Footer"));

// const Loadable = (Component: React.ElementType) => (props: Props) => {

//     return <Component {...props} />;
// return (
//     <Suspense fallback={<LinearProgress />}>
//         <Component {...props} />
//     </Suspense>
// );
// };

//Admin Screen
const CorePage = React.lazy(() => import("components/pages/CorePage/index"));
const NotFound = React.lazy(() => import("components/pages/NotFound/index"));

const AdminRoute = [
    {
        path: '/',
        element: <CorePage />
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
        path: '/:page/:tab/:subtab1/:subtab2/:subtab3',
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

    const layoutState = useLayoutHeaderFooter();


    const dispatch = useDispatch();

    React.useEffect(() => {
        window.showMessage = showMessage;

        if (window[app_webview_name]) {
            localStorage.setItem(app_webview_name, '1');
            dispatch(setHeaderVisible(false));
            dispatch(setFooterVisible(false));
        }

    }, []);

    return (
        <div className="App" id="warperMain" style={{
            background: theme.palette.body.background
        }}>
            {layoutState.headerVisible && <Header />}
            {/* <Sidebar /> */}
            <Box sx={(theme) => ({
                paddingTop: layoutState.headerVisible ? '64px' : 0,
                minHeight: layoutState.headerVisible ? `calc( 100vh - ${64 + 64}px )` : '100vh',
                backgroundColor: 'var(--bgBody)',
                '--bgBody': theme.palette.mode === 'light' ? layoutState.isIframeOauth ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' : '#f2f4f7' : '#1c1c1d',
            })}>
                <Routes>
                    {
                        AdminRoute.map((item: RouteObject, index) => (
                            //@ts-ignore
                            <Route key={index} {...item} />
                        ))
                    }
                </Routes>
            </Box>
            {layoutState.footerVisible && <Footer />}
        </div>
    )
}

export default Router
