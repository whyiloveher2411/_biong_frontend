import { __ } from 'helpers/i18n';
import { VariantType } from 'notistack';
import React from 'react';
import { Navigate } from 'react-router-dom';


interface RedirectWithMessageProps {
    to?: string,
    message?: string,
    code?: number,
    variant?: VariantType,
}
function RedirectWithMessage({ to, message = __('You dont\'t have permission to access on this page'), code = 403, variant = 'error' }:

    RedirectWithMessageProps) {

    React.useEffect(() => {
        window.showMessage(message, variant);
    }, []);

    if (to) {
        return <Navigate to={to} />
    }

    return <Navigate to={'/error-' + code} />
}

export default RedirectWithMessage
