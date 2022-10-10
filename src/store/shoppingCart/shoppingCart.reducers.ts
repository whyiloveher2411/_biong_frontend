import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCookie, setCookie } from 'helpers/cookie';
import { OrderProductItem } from './../../services/eCommerceService';


const cartDefault: ShoppingCartProps = {
    timer: (new Date()).getTime(),
    products: [],
    is_gift: false,
    code: '',
    payment_method: 'bank_transfer'
};

const initialState = getShoppingCartInitState();

export const slice = createSlice({
    name: 'shoppingCart',
    initialState: initialState,
    reducers: {
        addToCart: (_state: ShoppingCartProps, action: PayloadAction<OrderProductItem | undefined>) => {

            if (action.payload) {
                if (_state.products.findIndex(item => (item.id.toString()) === (action.payload?.id.toString())) === -1) {
                    _state.products.push({
                        id: action.payload?.id.toString(),
                        order_quantity: 1,
                    });
                }
            }
            setCookie('_shoppingCart', _state);

            return _state;
        },
        removeToCart: (_state: ShoppingCartProps, action: PayloadAction<OrderProductItem | undefined>) => {
            if (action.payload) {
                _state.products = _state.products.filter(item => (item.id.toString()) !== action.payload?.id.toString());
                setCookie('_shoppingCart', _state);
            }
        },
        changeGiftStatus: (_state: ShoppingCartProps, action: PayloadAction<boolean | undefined>) => {
            _state.is_gift = action.payload ? true : false;
            setCookie('_shoppingCart', _state);
        },
        updateCart: (_state: ShoppingCartProps, action: PayloadAction<ShoppingCartProps | undefined>) => {
            if (action.payload) {
                _state = {
                    ..._state,
                    ...action.payload
                };
                setCookie('_shoppingCart', _state);
            }
            return _state;
        },
        clearCart: (_state: ShoppingCartProps) => {
            _state = cartDefault;
            setCookie('_shoppingCart', _state);


            return _state;
        },
        clearCacheAfterOrder: (_state: ShoppingCartProps) => {
            _state = cartDefault;
            setCookie('_shoppingCart', _state);

            return _state;
        }
    },
});

function getShoppingCartInitState(): ShoppingCartProps {

    let dataFromCookie = getCookie('_shoppingCart', true) as ShoppingCartProps | null;

    if (dataFromCookie) {
        return {
            ...cartDefault,
            ...dataFromCookie,
            // code: dataFromCookie.code ?? cartDefault.code,
            // timer: dataFromCookie.timer ?? cartDefault.timer,
            // products: dataFromCookie.products ?? cartDefault.products,
            // is_gift: dataFromCookie.is_gift ?? cartDefault.is_gift,
            // payment_method: dataFromCookie.payment_method ?? cartDefault.payment_method,
        }
    }

    return cartDefault;

}

export const { addToCart, removeToCart, clearCart, updateCart, changeGiftStatus, clearCacheAfterOrder } = slice.actions;

export default slice.reducer;

export interface ShoppingCartProps {
    timer: number,
    code: string,
    products: Array<{
        id: ID,
        order_quantity: number,
    }>
    is_gift: boolean,
    payment_method: 'bank_transfer' | 'momo' | 'zalopay',
}

export interface Promotion {
    title: string,
    value: number,
    type: 0 | 1,
}

// export interface ShoppingCartItemProps {
//     id: string
// }