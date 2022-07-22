import { ajax } from "hook/useApi";
import { ShoppingCartItemProps } from './shoppingCart.reducers';


const shoppingCartService = {

    uploadCartToUser: (items: { [key: string]: Array<ShoppingCartItemProps> }) => {
        ajax<{ result: boolean }>({
            url: 'vn4-ecommerce/shoppingcart/save-cart',
            data: {
                groups: items
            }
        });
    },

    loadCartFromServer: async (): Promise<Array<ShoppingCartItemProps>> => {
        let data = await ajax<Array<ShoppingCartItemProps>>({
            url: 'vn4-ecommerce/shoppingcart/load-cart',
        });

        return data;
    }
};


export default shoppingCartService;