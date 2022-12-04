import { call, fork, put } from "redux-saga/effects";
import settingService from "services/settingService";
import { SettingValue, updateSetting } from "./settings.reducers";


function* getSetting() {
    const setting: SettingValue = yield call(settingService.getAll);

    yield put({
        type: updateSetting().type,
        payload: setting
    });
}

export default function* settingSaga() {
    yield fork(getSetting);
}