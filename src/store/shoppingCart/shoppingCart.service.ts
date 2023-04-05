import { ajax } from "hook/useApi";
import { IDiscount, IDiscountDescription, ShoppingCartProps } from "./shoppingCart.reducers";


const shoppingCartService = {

    uploadCartToUser: async (cart: ShoppingCartProps) => {
        const data = await ajax<{
            cart: {
                total_money: number,
                discount?: IDiscount,
                discount_description?: Array<IDiscountDescription>,
            }
        }>({
            url: 'vn4-ecommerce/shoppingcart/save-cart',
            data: {
                ...cart
            }
        });

        return {
            total_money: data.cart.total_money,
            discount: data.cart.discount,
            discount_description: data.cart.discount_description
        }
    },

    loadCartFromServer: async (): Promise<ShoppingCartProps> => {
        let data = await ajax<ShoppingCartProps>({
            url: 'vn4-ecommerce/shoppingcart/load-cart',
        });

        if (typeof data.discount === 'string') {
            try {
                data.discount = JSON.parse(data.discount);
            } catch (error) {
                data.discount = undefined;
            }
        }

        if (typeof data.discount_description === 'string') {
            try {
                data.discount_description = JSON.parse(data.discount_description);
            } catch (error) {
                data.discount_description = undefined;
            }
        }

        return data;
    }
};


export default shoppingCartService;