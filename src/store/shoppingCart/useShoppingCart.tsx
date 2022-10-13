import { __ } from "helpers/i18n";
import useAjax from "hook/useApi";
import { useDispatch, useSelector } from "react-redux";
import { CourseProps } from "services/courseService";
import { OrderProductItem } from "services/eCommerceService";
import { RootState } from "store/configureStore";
import { addToCart, changeGiftStatus, clearCacheAfterOrder, removeToCart, ShoppingCartProps, updateCart } from "./shoppingCart.reducers";

export default () => {

    const data = useSelector((state: RootState) => state.shoppingCart);
    const dispatch = useDispatch();

    const useAjax1 = useAjax();

    return {
        data: data,
        loadCartSummary: (callback: (courses: Array<CourseProps>) => void) => {
            useAjax1.ajax({
                url: '/vn4-ecommerce/shoppingcart/load-summary',
                data: {
                    ...data
                },
                success: (result: { courses: Array<CourseProps> }) => {
                    callback(result.courses);
                }
            });
        },
        updateCart: (cart: ShoppingCartProps) => {
            dispatch(updateCart(cart));
        },
        changeGiftStatus: (isGift: boolean) => {
            dispatch(changeGiftStatus(isGift));
        },
        removeToCart: (item: OrderProductItem) => {
            dispatch(removeToCart(item));
        },
        addToCart: (item: OrderProductItem) => {
            dispatch(addToCart(item));
            window.showMessage(__('Khóa học đã được thêm vào giỏ hàng'), 'success');
        },
        clearCacheAfterOrder: () => {
            dispatch(clearCacheAfterOrder());
        }
    };
};