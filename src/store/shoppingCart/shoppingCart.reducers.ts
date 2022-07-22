import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCookie, setCookie } from 'helpers/cookie';
import { __ } from 'helpers/i18n';

const initialState = getShoppingCartInitState();

export const slice = createSlice({
    name: 'shoppingCart',
    initialState: initialState,
    reducers: {
        addToCart: (_state, action: PayloadAction<{
            item: ShoppingCartItemProps,
            groupName: keyof ShoppingCartProps['groups']
        } | undefined>) => {

            const dataAfterValidate = {
                ...handleAddToCart(_state, action) as typeof initialState
            };

            _state = dataAfterValidate;

            setCookie('_shoppingCart', dataAfterValidate);
        },
        removeToCart: (_state, action: PayloadAction<{
            item: ShoppingCartItemProps,
            groupName: keyof ShoppingCartProps['groups']
        } | undefined>) => {

            if (action.payload?.item.id && _state.groups[action.payload.groupName].length) {
                let indexItem = _state.groups[action.payload.groupName].findIndex(item => (item.id + '') === (action.payload?.item.id + ''));
                if (indexItem > -1) {
                    _state.groups[action.payload.groupName].splice(indexItem, 1);
                }

                setCookie('_shoppingCart', _state);
            }

        },
        moveProductToGroupOther: (_state, action: PayloadAction<{
            item: ShoppingCartItemProps,
            from: keyof ShoppingCartProps['groups'],
            to: keyof ShoppingCartProps['groups'],
        } | undefined>) => {


            if (action.payload?.item.id && _state.groups[action.payload.from].length) {

                let indexItem = _state.groups[action.payload.from].findIndex(item => (item.id + '') === (action.payload?.item.id + ''));
                if (indexItem > -1) {
                    _state.groups[action.payload.from].splice(indexItem, 1);
                }

                const dataAfterValidate = {
                    ...handleAddToCart(_state, {
                        payload: {
                            item: action.payload.item,
                            groupName: action.payload.to
                        },
                        type: 'AddToCart',
                    }) as typeof initialState
                };

                _state = dataAfterValidate;

                setCookie('_shoppingCart', _state);
            }

        },
        updateCart: (_state, action: PayloadAction<{
            [key: string]: Array<ShoppingCartItemProps>,
        } | undefined>) => {

            if (action.payload) {

                for (let keyGroup in action.payload) {
                    if (!_state.groups[keyGroup]) _state.groups[keyGroup] = [];
                    action.payload[keyGroup].forEach(product => {
                        if (_state.groups[keyGroup].findIndex(item => (item.id + '') === (product.id + '')) === -1) {
                            _state.groups[keyGroup].push(product);
                        }
                    });
                }
                setCookie('_shoppingCart', _state);
            }

        },
        clearCart: (_state) => {
            _state = {
                timer: (new Date()).getTime(),
                groups: {},
                promotions: [],
            };
            setCookie('_shoppingCart', _state);

            return _state;
        },
        clearCacheAfterOrder: (_state) => {
            _state = {
                timer: (new Date()).getTime(),
                groups: {
                    ..._state.groups,
                    products: []
                },
                promotions: [],
            };
            setCookie('_shoppingCart', _state);

            return _state;
        }
    },
});

function getShoppingCartInitState(): ShoppingCartProps {

    let dataFromCookie = getCookie('_shoppingCart', true) as ShoppingCartProps | null;

    if (dataFromCookie) {
        return dataFromCookie;
    }

    return {
        timer: (new Date()).getTime(),
        groups: {

        },
        promotions: []
    };

}

export function handleAddToCart(_state = initialState, action: PayloadAction<{
    item: ShoppingCartItemProps,
    groupName: keyof ShoppingCartProps['groups']
} | undefined>, addData = true) {

    let dk = false;

    if (action.payload?.item.id) {

        dk = true;

        if (Array.isArray(_state.groups?.[action.payload.groupName])) {
            _state.groups[action.payload.groupName].forEach(item => {
                if (item.id === action.payload?.item.id) {
                    dk = false;
                    return false;
                }
            });
        } else {
            if (!_state.groups) {
                _state.groups = {
                    [action.payload.groupName]: []
                };
            } else {
                _state.groups[action.payload.groupName] = [];
            }
        }

        if (dk && addData) {
            _state.groups[action.payload.groupName].push({ id: action.payload.item.id });
        }

    }

    if (!addData) {
        if (dk) {
            return {
                message: __('The course has been added to your cart'),
                messageType: 'success'
            };
        } else {
            return {
                message: __('The course has been added to your cart'),
                messageType: 'info'
            };
        }

    } else {
        _state.timer = (new Date()).getTime();
        return _state;
    }

}

export const { addToCart, removeToCart, clearCart, updateCart, moveProductToGroupOther, clearCacheAfterOrder } = slice.actions;

export default slice.reducer;

export interface ShoppingCartProps {
    timer: number,
    groups: {
        [key: string]: Array<ShoppingCartItemProps>,
    },
    promotions: Array<Promotion>,
}

export interface Promotion {
    title: string,
    value: number,
    type: 0 | 1,
}

export interface ShoppingCartItemProps {
    id: string
}