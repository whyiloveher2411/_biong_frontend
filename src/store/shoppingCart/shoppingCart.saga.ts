import { call, put, select, takeEvery } from "redux-saga/effects";
import { logout, updateAccessToken, UserProps, UserState } from "store/user/user.reducers";
import { addToCart, clearCacheAfterOrder, clearCart, moveProductToGroupOther, removeToCart, ShoppingCartItemProps, ShoppingCartProps, updateCart } from "./shoppingCart.reducers";
import shoppingCartService from "./shoppingCart.service";


function* clearCartSaga() {

    yield put({
        type: clearCart().type
    })

}

//@ts-ignore
const shoppingCartState = (state) => state.shoppingCart;

//@ts-ignore
const userState = (state) => state.user;

function* updateCartToUser() {
    //@ts-ignore
    let shoppingCart: ShoppingCartProps = yield select(shoppingCartState);

    //@ts-ignore
    let user: UserProps = yield select(userState);

    if (user._state === UserState.identify) {
        shoppingCartService.uploadCartToUser(shoppingCart.groups);
    }
}

function* loadCartFromServer() {

    const cart: ShoppingCartItemProps[] = yield call(shoppingCartService.loadCartFromServer);

    yield put({
        type: updateCart().type,
        payload: cart
    });
}

export default function* shoppingCartSaga() {

    yield takeEvery([logout().type], clearCartSaga);

    yield takeEvery([addToCart().type, removeToCart().type, moveProductToGroupOther().type, clearCacheAfterOrder().type], updateCartToUser);

    yield takeEvery([updateAccessToken().type], loadCartFromServer);
}