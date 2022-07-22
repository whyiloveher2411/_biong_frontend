import { getUrlParams } from 'helpers/url';
import React from 'react';
import ForgotPassword from './components/Auth/ForgotPassword';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';

const tabContent = {
    'log-in': Login,
    'sign-up': SignUp,
    'forgot-password': ForgotPassword
};

function Auth() {

    const [tab, setTab] = React.useState<null | keyof typeof tabContent>(null);

    let tabFormUrl: keyof typeof tabContent = getUrlParams(window.location.search, {
        authTab: 'log-in'
    }).authTab as keyof typeof tabContent;

    const handleChangeAuthTab = (tab: keyof typeof tabContent) => {
        return '?authTab=' + tab;
    }

    React.useEffect(() => {
        if (!tabContent[tabFormUrl]) {
            tabFormUrl = 'log-in';
        }
        setTab(tabFormUrl);
    }, [tabFormUrl]);

    if (tab) {
        return React.createElement(tabContent[tab], {
            handleChangeAuthTab: handleChangeAuthTab,
            tabName: {
                logIn: 'log-in',
                signUp: 'sign-up',
                forgotPassword: 'forgot-password',
            }
        });
    }

    return <></>;

}

export default Auth

export type AuthChildrenProps = {
    tabName: TabNameProp,
    handleChangeAuthTab: (tab: keyof typeof tabContent) => string
}

type TabNameProp = {
    logIn: keyof typeof tabContent,
    signUp: keyof typeof tabContent,
    forgotPassword: keyof typeof tabContent,
}