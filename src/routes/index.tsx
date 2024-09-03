import { useTheme } from '@mui/material';
// import Footer from 'components/organisms/Footer';
import useAjax from 'hook/useApi';
import React from 'react';
import {
    Route, RouteObject, Routes
} from "react-router-dom";

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

    React.useEffect(() => {
        window.showMessage = showMessage;
    }, []);

    return (
        <div className="App" id="warperMain" style={{
            background: theme.palette.body.background
        }}>
            <Header />
            {/* <Sidebar /> */}
            <main style={{
                paddingTop: 64,
                minHeight: 'calc( 100vh - 64px )',
            }}>
                <Routes>
                    {
                        AdminRoute.map((item: RouteObject, index) => (
                            //@ts-ignore
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
