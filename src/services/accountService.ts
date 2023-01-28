import { ajax } from 'hook/useApi';
import { UserProps } from 'store/user/user.reducers';

export const REPORT_TYPE = 'vn4_report_account';

export interface IUser {
    user?: UserProps,
    error?: boolean,
    user_re_login?: object,
}

const accountService = {

    getInfo: async (): Promise<IUser> => {
        let data = await ajax<IUser>({
            url: 'vn4-account/info',
        });

        if (Array.isArray(data.user?.notification_important)) {
            data.user?.notification_important.forEach(item => {

                try {
                    if (typeof item.addin_data === 'string') {
                        item.addin_data = JSON.parse(item.addin_data);
                    }

                    if (!item.addin_data) {
                        item.addin_data = {};
                    }
                } catch (error) {
                    item.addin_data = {};
                }

            })
        }

        return data;
    },

    getProfile: async (): Promise<{ [key: string]: string }> => {
        let data = await ajax<{
            data: {
                [key: string]: string
            },
        }>({
            url: 'vn4-account/get-profile',
        });

        return data.data;
    },
    updateInfo: async (dataBody: { [key: string]: string }): Promise<boolean> => {

        let data = await ajax<{
            result: boolean,
        }>({
            url: 'vn4-account/update-profile',
            data: dataBody
        });

        return data.result;
    },

    getConnectSocial: async (): Promise<{
        [key: string]: ConnectionProps
    } | null> => {
        let data = await ajax<{
            connections?: {
                [key: string]: ConnectionProps
            },
        }>({
            url: 'vn4-account/me/get-connections',
        });

        if (data.connections) {
            return data.connections;
        }

        return null;
    },

    updatePassword: async (passCurrent: string, passNew: string, passConfirm: string): Promise<boolean> => {

        // if (!passCurrent) {
        //     window.showMessage('Vui lòng nhập mật khẩu hiện tại');
        //     return false;
        // }
        if (passNew !== passConfirm) {
            window.showMessage('Xác nhận mật khẩu không giống mật khẩu mới')
            return false;
        }

        let data = await ajax<{
            result: boolean,
        }>({
            url: 'vn4-account/me/security/update-password',
            data: {
                password_current: passCurrent,
                password_new: passNew,
            }
        });

        return data.result;
    },
    getInfoSecurity: async (): Promise<{
        [key: string]: ANY
    } | null> => {
        let result = await ajax<{
            data: {
                [key: string]: boolean
            } | undefined
        }>({
            url: 'vn4-account/get-security',
        });

        if (result.data) {
            return result.data;
        }

        return null;
    },

    // getRandomGoogleAuthenticatorSecret: async (action: 'RANDOM_SECRET' | 'GET'): Promise<{
    //     qrCodeUrl: string,
    //     secret: string,
    // } | null> => {

    //     let result = await ajax<{
    //         qrCodeUrl: string,
    //         secret: string,
    //     }>({
    //         url: 'vn4-account/random-google-authenticator-secret',
    //         data: {
    //             action: action
    //         }
    //     });

    //     if (result.qrCodeUrl && result.secret) {
    //         return result;
    //     }

    //     return null;
    // },

    updateSecurity: async (dataBody: { [key: string]: ANY }): Promise<boolean> => {

        let data = await ajax<{
            result: boolean,
        }>({
            url: 'vn4-account/update-security',
            data: dataBody
        });

        return data.result;

    },

    getProfileOfAccount: async (slug: string): Promise<UserProps | null> => {

        let data = await ajax<{
            user: UserProps,
        }>({
            url: 'vn4-account/profile-user',
            data: {
                slug: slug
            }
        });

        if (data.user) {
            return { ...data.user, slug: slug };
        }

        return null;
    },

    updateHeartWrongAnswer: async (): Promise<{
        heart?: number,
        heart_fill_time_next?: string,
    }> => {
        let data = await ajax<{
            heart?: number,
            heart_fill_time_next?: string,
        }>({
            url: 'vn4-account/me/update-heart-wrong-answer',
        });

        return data;

    },

    updateHeart: async (): Promise<{
        heart?: number,
        heart_fill_time_next?: string,
    }> => {
        let data = await ajax<{
            heart?: number,
            heart_fill_time_next?: string,
        }>({
            url: 'vn4-account/me/update-heart',
        });

        return data;

    },

    me: {
        update: {
            avatar: async (base64Image: string): Promise<boolean> => {
                let data = await ajax<{
                    result: boolean,
                }>({
                    url: 'vn4-account/me/update-avatar',
                    data: {
                        base64: base64Image,
                    }
                });

                return data.result;
            },
            banner: async (base64Image: string): Promise<boolean> => {
                let data = await ajax<{
                    result: boolean,
                }>({
                    url: 'vn4-account/me/update-banner',
                    data: {
                        base64: base64Image,
                    }
                });

                return data.result;
            },
            updateTheme: async (mode: 'light' | 'dark' | 'auto'): Promise<boolean> => {
                let data = await ajax<{
                    result: boolean,
                }>({
                    url: 'vn4-account/me/update-theme-mode',
                    data: {
                        mode: mode,
                    }
                });

                return data.result;
            },
            updateThemeLearning: async (mode: 'main_left' | 'main_right'): Promise<boolean> => {
                let data = await ajax<{
                    result: boolean,
                }>({
                    url: 'vn4-account/me/update-theme-learning',
                    data: {
                        mode: mode,
                    }
                });

                return data.result;
            },

        },
        security: {
            twoFactor: {
                getData: async (): Promise<{
                    enable: boolean,
                    is_setup: boolean,
                }> => {

                    let data = await ajax<{
                        enable?: boolean,
                        is_setup?: boolean,
                    }>({
                        url: 'vn4-account/me/two-factor/get-data',
                    });

                    return {
                        enable: data.enable ?? false,
                        is_setup: data.is_setup ?? false,
                    };
                },
                changeEnable: async (enable: boolean): Promise<boolean> => {
                    let data = await ajax<{
                        enable?: boolean,
                    }>({
                        url: 'vn4-account/me/two-factor/change-enable',
                        data: {
                            enable: enable,
                        }
                    });

                    if (data.enable) {
                        return true;
                    }
                    return false;
                },
                random: async (): Promise<{
                    qrCodeUrl: string,
                    secret: string,
                } | null> => {

                    let data = await ajax<{
                        qrCodeUrl: string,
                        secret: string,
                    }>({
                        url: 'vn4-account/me/two-factor/get-random',
                    });

                    if (data.qrCodeUrl && data.secret) {
                        return data;
                    }
                    return null;
                },
                remove: async (): Promise<boolean> => {

                    let data = await ajax<{
                        success: boolean,
                    }>({
                        url: 'vn4-account/me/two-factor/remove',
                    });

                    return data.success ? true : false;
                },
                submitVerify: async (secret_key: string, six_digit_code: string): Promise<boolean> => {
                    let data = await ajax<{
                        isVerify?: boolean,
                    }>({
                        url: 'vn4-account/me/two-factor/verify',
                        data: {
                            secret_key: secret_key,
                            six_digit_code: six_digit_code,
                        }
                    });

                    if (data.isVerify) {
                        return true;
                    }

                    return false;
                },
                update: async (secret_key: string, six_digit_code: string, enable: boolean): Promise<boolean> => {
                    let data = await ajax<{
                        success?: boolean,
                    }>({
                        url: 'vn4-account/me/two-factor/update',
                        data: {
                            secret_key: secret_key,
                            six_digit_code: six_digit_code,
                            enable: enable,
                        }
                    });

                    if (data.success) {
                        return true;
                    }

                    return false;
                },
            }
        },
        game: {
            fillHeaderByBit: async (): Promise<{
                heart: number,
                bit: number,
            }> => {
                let data = await ajax<{
                    heart: number,
                    bit: number,
                }>({
                    url: 'vn4-account/me/game/fill-heart-by-bit',
                });

                return data;
            },
            minusBit: async (bit: number, reason: string): Promise<{
                result: boolean,
                bit: number,
            }> => {

                let data = await ajax<{
                    result?: boolean,
                    bit?: number,
                }>({
                    url: 'vn4-account/me/game/minus-bit',
                    data: {
                        bit: bit,
                        reason: reason,
                    }
                });

                return {
                    result: data.result ?? false,
                    bit: data.bit ?? 0,
                };

            }
        }
    }
}

export default accountService;

export interface ConnectionProps {
    title: string,
    id_social: string,
}