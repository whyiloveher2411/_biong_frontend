import { all, fork } from "redux-saga/effects";
import pluginSaga from './plugins/plugin.sagas';
import userSaga from './user/user.sagas';
import shoppingCartSaga from './shoppingCart/shoppingCart.saga';

const sagaIndex = function* () {
    yield all([
        fork(userSaga),
        fork(pluginSaga),
        fork(shoppingCartSaga),
        // fork(poupupLoginSaga),
    ]);
}

export default sagaIndex