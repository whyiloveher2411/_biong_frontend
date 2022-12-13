import { CircularProgressProps } from '@mui/material';
import Loading from 'components/atoms/Loading';
import { useWebBrowser } from 'components/atoms/WebBrowser';
import { getLanguage } from 'helpers/i18n';
import { convertToURL } from 'helpers/url';
import _ from 'lodash';
import { SnackbarOrigin, VariantType } from 'notistack';
import React from 'react';
// import { useDispatch } from 'react-redux';
// import { updatePopupRelogin } from 'store/popupRelogin/popupRelogin.reducers';
import { UserProps } from 'store/user/user.reducers';
import { useFloatingMessages } from './useFloatingMessages';


const productMode = process.env.REACT_APP_ENV;
const urlPrefixDefault = convertToURL(process.env.REACT_APP_HOST_API_KEY, '/api/frontend/v1.0/');

const language = getLanguage();
// const language = { code: 'vi' };

interface Props {
    loadingType?: false | 'custom',
    circularProps?: CircularProgressProps,
}

export default function useAjax(props?: Props): UseAjaxProps {

    // const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);

    const { showMessage } = useFloatingMessages();

    const callbackSuccess = async (params: ParamsApiProps, response: Response) => {

        let { success } = params;

        if (!response.ok) {

            if (params.error) {
                params.error(response);
                return;
            }

            let result: ResultFromApiProps = await response.json();

            if (result.message) {

                showMessage(result.message);

                return;
            } else {
                throw Error(response.statusText);
            }
        }

        // let result: ResultFromApiProps = await response.json();

        let result: ResultFromApiProps = {};

        if (productMode === 'production') {

            let dataText = await response.text();

            if (dataText) {

                // dataText = dataText.substring(9);

                const randomString = dataText.substring(15, 25);
                dataText = dataText.substring(31);

                dataText = dataText.replace('##~~~' + randomString + '~~##', dataText.slice(-1));

                dataText = dataText.slice(0, -7);

                try {
                    result = JSON.parse(dataText);
                } catch (error) {
                    console.log('Error');
                }
            }
        } else {
            result = await response.json();
        }

        if (result.message) {
            showMessage(result.message);
        }

        if (result.require_login) {
            requestLogin(params.url, {
                callback: bind,
                params: params
            }, result.user_re_login);
        }

        if (success) {
            success(result);
        }

    }

    const requestLogin = (url: string | undefined, param: {
        callback: (params: ParamsApiProps) => void,
        params: ParamsApiProps
    }, user?: UserProps) => {

        if (!url) {
            url = window.location.href;
        }

        if (!window.__afterLogin) window.__afterLogin = {};
        window.__afterLogin[url] = param;

        // dispatch(updatePopupRelogin({ open: true, updateUser: false, user: user }));

    }

    const callbackError = (error: ANY) => {
        showMessage(error.toString(), 'error');
    }

    const callbackFinally = (params: ParamsApiProps) => {
        if (params.finally) {
            params.finally();
        }
        setOpen(false);
    }

    const bind = (params: ParamsApiProps) => {

        let { url = '', urlPrefix = null, headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Origin': '',
        }, method = 'POST', data = {}, loading = true } = params;

        if (localStorage.getItem('access_token')) {
            headers.Authorization = 'Bearer ' + localStorage.getItem('access_token');
        }

        if (loading) {
            setOpen(true);
        }

        if (!data) data = {};

        data.__l = window.btoa(language.code + '#' + Date.now());

        fetch(convertToURL((urlPrefix ?? urlPrefixDefault), url), {
            headers: headers,
            method: method,
            body: JSON.stringify(data)
        }).then(async (response) => {
            callbackSuccess(params, response);
        }).catch(function (error) {
            callbackError(error);
        }).finally(() => {
            callbackFinally(params);
        });
    };

    React.useEffect(() => {
        return () => setOpen(false);
    }, []);


    return {
        ajax: bind,
        open: open,
        setOpen: setOpen,
        Loading: <Loading open={open} isWarpper={props?.loadingType === 'custom'} circularProps={props?.circularProps} />,
        callbackSuccess: callbackSuccess,
        callbackError: callbackError,
        callbackFinally: callbackFinally,
        requestLogin: requestLogin,
        showMessage
    };
}



export interface UseAjaxProps {
    ajax: (params: ParamsApiProps) => void;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    Loading: JSX.Element;
    callbackSuccess: (params: ParamsApiProps, response: Response) => Promise<void>;
    callbackError: (error: ANY) => void;
    callbackFinally: (params: ParamsApiProps) => void;
    requestLogin: (url: string | undefined, param: ANY) => void;
    showMessage: (message: string | MessageFromApiProps, type?: VariantType, snackbarOrigin?: SnackbarOrigin | undefined) => void
}

export async function ajax<T>(params: ANY): Promise<T> {

    let { url = '', urlPrefix = null, headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
    }, method = 'POST', data = {} } = params;

    data.__l = window.btoa(language.code + '#' + Date.now());

    if (localStorage.getItem('access_token')) {
        headers.Authorization = 'Bearer ' + localStorage.getItem('access_token');
    }

    let paramForFetch: ANY = {
        headers: headers,
        method: method,
    };

    if (data) {
        paramForFetch.body = JSON.stringify(data);
    }

    const respon: Promise<T> = await fetch(convertToURL((urlPrefix ?? urlPrefixDefault), url), paramForFetch)
        .then(async (response) => {
            let data: JsonFormat = {};

            if (productMode === 'production') {

                let dataText = await response.text();

                if (dataText) {

                    // dataText = dataText.substring(9);

                    const randomString = dataText.substring(15, 25);

                    dataText = dataText.substring(31);

                    dataText = dataText.replace('##~~~' + randomString + '~~##', dataText.slice(-1));

                    dataText = dataText.slice(0, -7);

                    try {
                        data = JSON.parse(dataText);
                    } catch (error) {
                        console.log('Error');
                    }
                }
            } else {
                data = await response.json();
            }

            // let arrsData = dataText.split('##_###');

            // if (arrsData.length === 5) {

            //     try {

            //         arrsData[3] = arrsData[3].replace('##~~~' + arrsData[2] + '~~##', arrsData[0]);
            //         let str = JSON.parse(arrsData[3]);
            //         console.log(str);

            //         data = str;

            //     } catch (error) {
            //         console.log(error);
            //     }

            // }

            // let data = await response.json();
            if (data && data.message) {
                window.showMessage(data.message);
            }
            return data;
        }).catch(function (error) {
            return error;
        }).finally(() => {
            return params;
        });

    return respon;
}

export function useIndexedDB<T>({ key, defaultValue, isUseLocalStorage }: {
    key: string,
    defaultValue: T,
    isUseLocalStorage?: boolean,
}) {


    const [isLoading, setLoading] = React.useState(false);

    const webBrowser = useWebBrowser();

    const isChanedState = React.useRef(false);

    const isGetFormLocalStorage = React.useRef(false);

    let dateTemp: T = window.__indexDBStore[key] ?? defaultValue;

    if (isUseLocalStorage && !isGetFormLocalStorage.current) {
        isGetFormLocalStorage.current = true;
        try {
            const dataString = localStorage.getItem(key);
            if (dataString) {
                dateTemp = JSON.parse(dataString);
            }
        } catch (error) {
            dateTemp = defaultValue;
        }
    }

    const [data, setData] = React.useState<typeof dateTemp>(dateTemp);

    const callQuery = async (callback: () => Promise<T>) => {

        setLoading(true);
        const dataCallback = await callback();

        setData(prev => {

            isChanedState.current = true;
            if (_.isEqual(prev, dataCallback)) {
                return prev;
            }

            if (isUseLocalStorage) {
                if (dataCallback !== undefined && dataCallback !== null) {
                    let dataSaveLocalStorage = '';
                    try {
                        dataSaveLocalStorage = JSON.stringify(dataCallback);
                    } catch (error) {
                        dataSaveLocalStorage = '';
                    }
                    localStorage.setItem(key, dataSaveLocalStorage);
                }
            } else {
                webBrowser.indexedDB.insertData(key, dataCallback);
            }

            // if (dataCallback !== undefined && dataCallback !== null) {

            //     // let dataSaveLocalStorage = '';
            //     // try {
            //     //     dataSaveLocalStorage = JSON.stringify(dataCallback);
            //     // } catch (error) {
            //     //     dataSaveLocalStorage = '';
            //     // }
            //     // localStorage.setItem(key, dataSaveLocalStorage);
            // }

            return dataCallback
        });

        setLoading(false);
    }

    React.useEffect(() => {
        if (!isUseLocalStorage) {
            (async () => {
                if (!window.__indexDBSuccess) {
                    while (!window.__indexDBSuccess) {
                        await new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(10);
                            }, 10);
                        });
                    }
                }

                if (isChanedState.current) {
                    return;
                }

                if (window.__indexDBStore[key] !== undefined) {
                    setData(prev => {
                        if (_.isEqual(prev, window.__indexDBStore[key])) {
                            return prev;
                        }
                        return window.__indexDBStore[key];
                    });
                }
            })();
        }
    }, []);

    return {
        data: data,
        setData: (dataFromCallback: T | ((preValue: T) => T), keyChange?: string) => {

            setData(prev => {

                isChanedState.current = true;

                if (typeof dataFromCallback !== 'function') {
                    if (_.isEqual(prev, dataFromCallback)) {
                        return prev;
                    }

                    if (isUseLocalStorage) {
                        let dataSaveLocalStorage = '';
                        try {
                            dataSaveLocalStorage = JSON.stringify(dataFromCallback);
                        } catch (error) {
                            dataSaveLocalStorage = '';
                        }
                        localStorage.setItem(keyChange ? keyChange : key, dataSaveLocalStorage);
                    } else {
                        webBrowser.indexedDB.insertData(keyChange ? keyChange : key, dataFromCallback);
                    }
                } else {
                    const dataCallback = (dataFromCallback as (preValue: T) => (T))(prev);

                    if (_.isEqual(prev, dataCallback)) {
                        return prev;
                    }

                    if (isUseLocalStorage) {
                        let dataSaveLocalStorage = '';
                        try {
                            dataSaveLocalStorage = JSON.stringify(dataCallback);
                        } catch (error) {
                            dataSaveLocalStorage = '';
                        }
                        localStorage.setItem(keyChange ? keyChange : key, dataSaveLocalStorage);
                    } else {
                        webBrowser.indexedDB.insertData(keyChange ? keyChange : key, dataCallback);
                    }

                    return dataCallback;
                }

                // if (dataFromCallback !== undefined && dataFromCallback !== null) {

                //     let dataSaveLocalStorage = '';
                //     try {
                //         dataSaveLocalStorage = JSON.stringify(dataFromCallback);
                //     } catch (error) {
                //         dataSaveLocalStorage = '';
                //     }

                //     localStorage.setItem(key, dataSaveLocalStorage);
                //     return dataFromCallback;
                // }

                return dataFromCallback;
            });

        },
        loadDataLocal: (key: string) => {
            (async () => {
                if (!window.__indexDBSuccess) {
                    while (!window.__indexDBSuccess) {
                        await new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(10);
                            }, 10);
                        });
                    }
                }

                if (window.__indexDBStore[key] !== undefined) {
                    setData(prev => {
                        if (_.isEqual(prev, window.__indexDBStore[key])) {
                            return prev;
                        }
                        return window.__indexDBStore[key];
                    });
                }
            })();
        },
        isLoading: isLoading,
        callQuery: callQuery
    };
}

export interface ParamsApiProps {
    url?: string,
    urlPrefix?: string,
    headers?: JsonFormat,
    method?: string,
    data?: JsonFormat,
    loading?: boolean,
    success?: (result: ANY) => void,
    error?: (response: Response) => void,
    finally?: () => void
}

export interface MessageFromApiProps {
    content: string,
    options: {
        variant: VariantType,
        anchorOrigin: SnackbarOrigin
    }
}

export interface ResultFromApiProps {
    message?: MessageFromApiProps,
    [key: string]: ANY,
}