import { ajax } from 'hook/useApi';
import { UserProps } from 'store/user/user.reducers';

export const REPORT_TYPE = 'vn4_report_account';

export interface IUser {
    user: object,
    error?: boolean,
    user_re_login?: object,
}

const accountService = {

    getInfo: async (): Promise<IUser> => {
        let data = await ajax<IUser>({
            url: 'vn4-account/info',
        });

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
            url: 'vn4-account/update-password',
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

    getRandomGoogleAuthenticatorSecret: async (action: 'RANDOM_SECRET' | 'GET'): Promise<{
        qrCodeUrl: string,
        secret: string,
    } | null> => {

        let result = await ajax<{
            qrCodeUrl: string,
            secret: string,
        }>({
            url: 'vn4-account/random-google-authenticator-secret',
            data: {
                action: action
            }
        });

        if (result.qrCodeUrl && result.secret) {
            return result;
        }

        return null;
    },

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

    submitVerifyTwoFactor: async (secret_key: string, six_digit_code: string): Promise<boolean> => {
        let data = await ajax<{
            isVerify?: boolean,
        }>({
            url: 'vn4-account/me/two-factor/verify',
            data: {
                secret_key: secret_key,
                six_digit_code: six_digit_code,
            }
        });

        if( data.isVerify ){
            return true;
        }

        return false;
    },
}

export default accountService;

export interface ConnectionProps {
    title: string,
    id_social: string,
}