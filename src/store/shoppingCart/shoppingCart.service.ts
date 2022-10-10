import { ajax } from "hook/useApi";
import { ShoppingCartProps } from "./shoppingCart.reducers";


const shoppingCartService = {

    uploadCartToUser: (cart: ShoppingCartProps) => {
        ajax<{ result: boolean }>({
            url: 'vn4-ecommerce/shoppingcart/save-cart',
            data: {
                ...cart
            }
        });
    },

    loadCartFromServer: async (): Promise<ShoppingCartProps> => {
        let data = await ajax<ShoppingCartProps>({
            url: 'vn4-ecommerce/shoppingcart/load-cart',
        });

        return data;
    }
};


export default shoppingCartService;