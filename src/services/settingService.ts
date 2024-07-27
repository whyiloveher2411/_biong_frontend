import { ajax } from 'hook/useApi';
import { SettingValue } from 'store/setting/settings.reducers';

const settingService = {

    getAll: async (): Promise<SettingValue> => {
        let data = await ajax<SettingValue>({
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