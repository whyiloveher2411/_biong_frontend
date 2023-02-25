import { useTheme } from '@mui/material';
import Footer from 'components/organisms/Footer';
// import Footer from 'components/organisms/Footer';
import Header from 'components/organisms/Header';
import useAjax from 'hook/useApi';
import React from 'react';
import {
    Route, RouteObject, Routes
} from "react-router-dom";

interface Props {
    [key: string]: ANY
}

const Loadable = (Component: React.ElementType) => (props: Props) => {

    return <Component {...props} />;
    // return (
    //     <Suspense fallback={<LinearProgress />}>
    //         <Component {...props} />
    //     </Suspense>
    // );
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
        setTimeout(() => {
            (function (d, s, id) {
                // eslint-disable-next-line no-var
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                //@ts-ignore
                js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
                //@ts-ignore
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }, 1000);
    }, []);

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
