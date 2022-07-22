import { call, fork, put, takeEvery } from "redux-saga/effects";
import userService, { IUser } from 'services/accountService';
import { clearToken, forceUpdateInfo, getAccessToken, updateAccessToken, updateInfo } from "./user.reducers";


function* checkInfo() {
    const accessToken = getAccessToken();

    if (accessToken) {

        const info: IUser = yield call(userService.getInfo);

        if (info.user) {

            yield put({
                type: updateInfo().type,
                payload: { ...info.user }
            });

        } else {

            if (info.error) {
                yield put({
                    type: clearToken().type,
                });
            }
        }

    } else {

        yield put({
            type: clearToken().type,
        });

    }

}

export default function* userSaga() {
    yield fork(checkInfo);
    yield takeEvery([updateAccessToken().type, forceUpdateInfo().type], checkInfo);
}