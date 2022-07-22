import useAjax from "hook/useApi";
import { useFloatingMessages } from "hook/useFloatingMessages";
import { VariantType } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import courseService, { CourseProps } from "services/courseService";
import { RootState } from "store/configureStore";
import { addToCart, clearCacheAfterOrder, handleAddToCart, moveProductToGroupOther, removeToCart, ShoppingCartItemProps } from "./shoppingCart.reducers";

export default () => {

    const data = useSelector((state: RootState) => state.shoppingCart);
    const dispatch = useDispatch();

    const useAjax1 = useAjax();

    const { showMessage } = useFloatingMessages();

    return {
        data: data,
        loadCartSummary: (callback: (group: { [key: string]: Array<CourseProps> }) => void) => {
            useAjax1.ajax({
                url: '/vn4-ecommerce/shoppingcart/load-summary',
                data: {
                    groups: data.groups
                },
                success: (result: { [key: string]: Array<CourseProps> }) => {

                    for (let keyGroup in result) {
                        if (result[keyGroup]) {
                            result[keyGroup].forEach(item => {
                                courseService.parseLeturerDetail(item);
                            });
                        }
                    }

                    callback(result);
                }
            });
        },
        removeToCart: (item: ShoppingCartItemProps, groupName = 'products') => {
            dispatch(removeToCart({ item: item, groupName: groupName }));
        },
        moveProductToGroupOther: (item: ShoppingCartItemProps, from = 'products', to: string) => {
            dispatch(moveProductToGroupOther({
                item: item,
                from: from,
                to: to
            }));
        },
        addToCart: (item: ShoppingCartItemProps, groupName = 'products') => {
            dispatch(addToCart({ item, groupName: groupName }));
            const message = handleAddToCart(data, { payload: { item, groupName: groupName }, type: 'addToCart' }, false) as { message: string, messageType: VariantType }
            showMessage(message.message, message.messageType);
        },
        clearCacheAfterOrder: () => {
            dispatch(clearCacheAfterOrder());
        }
    };
};