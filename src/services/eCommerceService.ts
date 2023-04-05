import { PaginationProps } from 'components/atoms/TablePagination';
import cacheWindow from 'hook/cacheWindow';
import { ajax } from 'hook/useApi';
import { ReviewItemProps } from './courseService';
import { IDiscount, IDiscountDescription } from 'store/shoppingCart/shoppingCart.reducers';

export type OrderStatusValue = 'in-cart' | 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed';
export interface OrderProps {
    id: ID,
    title: string,
    date_created: string,
    products?: {
        items?: Array<OrderProductItem>,
    },
    order_status: OrderStatusValue,
    payment_method?: string,
    order_type: 'for_myself' | 'gift_giving' | 'gift',
    total_money: string,
    discount?: IDiscount,
    discount_description?: Array<IDiscountDescription>,
}

export interface OrderProductItem extends Product {
    order_quantity: number
}

export interface Product {
    [key: string]: ANY,
    id: ID,
    price: string,
    slug: string,
    title: string,
    featured_image: string,
}

export interface ProductWithMyReview extends Product {
    is_trial?: 0 | 1,
    my_review?: {
        detail: string,
        id: ID,
        rating: number,
        is_incognito: number,
    }
}

const eCommerceService = {

    getOrderOfMe: async ({ per_page, current_page }: { current_page: number, per_page: number }): Promise<{
        orders: PaginationProps<OrderProps>,
        status: {
            list_option: {
                [key: string]: {
                    title: string,
                    color: string
                }
            }
        }
    }> => {

        let data = await ajax<{
            orders: PaginationProps<OrderProps>,
            status: {
                list_option: {
                    [key: string]: {
                        title: string,
                        color: string
                    }
                }
            }
        }>({
            url: 'vn4-ecommerce/me/order',
            data: {
                length: per_page,
                page: current_page,
            }
        });

        return data;
    },

    getOrderDetail: async (id: ID): Promise<{
        order: OrderProps,
        status: {
            list_option: {
                [key: string]: {
                    title: string,
                    color: string
                }
            }
        }
    } | null> => {

        let data = await ajax<{
            order: OrderProps,
            status: {
                list_option: {
                    [key: string]: {
                        title: string,
                        color: string
                    }
                }
            }
        }>({
            url: 'vn4-ecommerce/me/order-detail',
            data: {
                order_id: id
            }
        });

        if (data.order) {

            if (typeof data.order.discount === 'string') {
                try {
                    data.order.discount = JSON.parse(data.order.discount);
                } catch (error) {
                    data.order.discount = undefined;
                }
            }

            if (typeof data.order.discount_description === 'string') {
                try {
                    data.order.discount_description = JSON.parse(data.order.discount_description);
                } catch (error) {
                    data.order.discount_description = undefined;
                }
            }
            return data;
        }

        return null;
    },

    getProductOfMe: async (): Promise<ProductWithMyReview[] | null> => {

        let data = await ajax<{
            products: ProductWithMyReview[],
        }>({
            url: 'vn4-ecommerce/me/product',
        });

        if (data.products) {
            return data.products;
        }

        return null;
    },

    checkPurchased: (slug: string): Promise<boolean> => {
        return cacheWindow('vn4-ecommerce/me/product/find/' + slug, async () => {
            let data = await ajax<{
                isPurchased: boolean,
            }>({
                url: 'vn4-ecommerce/me/product/find',
                data: {
                    product: slug,
                }
            });

            return data.isPurchased;
        });
    },

    checkAlreadyReviewed: async (slug: string): Promise<boolean> => {
        let data = await ajax<{
            alreadyReviewed: boolean,
        }>({
            url: 'vn4-ecommerce/me/product/check-already-reviewed',
            data: {
                product: slug,
            }
        });

        return data.alreadyReviewed;
    },

    getReview: async (slug: string, { per_page, current_page }: { current_page: number, per_page: number }, rating?: { [key: number]: boolean }): Promise<{
        reviews: PaginationProps<ReviewItemProps>,
        dataSumary: {
            [key: string]: {
                rating: number,
                count: number,
            }
        }
    }> => {

        let ratingFilter = [];

        if (rating) {
            for (let key in rating) {
                if (rating[key]) {
                    ratingFilter.push(key);
                }
            }
        }

        let result = await ajax<{
            reviews: PaginationProps<ReviewItemProps>,
            dataSumary: {
                [key: number]: {
                    rating: number,
                    count: number,
                }
            }
        }>({
            url: 'vn4-ecommerce/product/reviews/post',
            data: {
                product: slug,
                ratings: ratingFilter,
                length: per_page,
                page: current_page
            }
        });

        return result;
    }

}

export default eCommerceService;