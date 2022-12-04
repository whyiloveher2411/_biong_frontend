import { ajax } from 'hook/useApi';

export interface Settings {
    [key: string]: ANY
}

const settingService = {

    getAll: async (): Promise<Settings> => {
        let data = await ajax<Settings>({
            url: 'vn4-e-learning/setting/get',
        });

        return data;
    },
    getLoginConfig: async (): Promise<ANY> => {
        let data = await ajax<ANY>({
            url: 'login/settings',
        });
        return data;
    }

}

export default settingService;