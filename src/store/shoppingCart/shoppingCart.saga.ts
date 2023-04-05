import { call, put, select, takeEvery } from "redux-saga/effects";
import { logout, updateAccessToken, UserProps, UserState } from "store/user/user.reducers";
import { addToCart, changeGiftStatus, changeQuantity, clearCacheAfterOrder, clearCart, IDiscount, IDiscountDescription, loadCartFormServer, removeToCart, ShoppingCartProps, updateCart, updateCartFormServer } from "./shoppingCart.reducers";
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

        const cart: {
            total_money: number,
            discount?: IDiscount,
            discount_description?: Array<IDiscountDescription>,
        } = yield call(() => shoppingCartService.uploadCartToUser(shoppingCart));

        if (typeof cart.discount === 'string') {
            try {
                cart.discount = JSON.parse(cart.discount);
            } catch (error) {
                cart.discount = undefined;
            }
        }

        if (typeof cart.discount_description === 'string') {
            try {
                cart.discount_description = JSON.parse(cart.discount_description);
            } catch (error) {
                cart.discount_description = undefined;
            }
        }

        yield put({
            type: updateCartFormServer().type,
            payload: {
                discount: cart.discount,
                discount_description: cart.discount_description
            }
        });

    }
}

function* loadCartFromServer() {

    const cart: ShoppingCartProps = yield call(shoppingCartService.loadCartFromServer);

    yield put({
        type: updateCartFormServer().type,
        payload: cart
    });
}

export default function* shoppingCartSaga() {

    yield takeEvery([logout().type], clearCartSaga);

    yield takeEvery(
        [
            addToCart().type,
            removeToCart().type,
            clearCacheAfterOrder().type,
            changeGiftStatus().type,
            updateCart().type,
            changeQuantity().type,
        ],
        updateCartToUser);

    yield takeEvery([updateAccessToken().type, loadCartFormServer().type], loadCartFromServer);
}