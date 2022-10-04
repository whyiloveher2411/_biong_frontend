import { PaginationProps } from 'components/atoms/TablePagination';
import { ajax } from 'hook/useApi';
import { ReviewItemProps } from './courseService';

export interface OrderProps {
    id: ID,
    title: string,
    date_created: string,
    products?: {
        items?: Array<OrderProductItem>,
    },
    order_status: string,
    payment_method?: string,
    order_type: 'for_myself' | 'gift_giving' | 'gift',
    total_money: string,
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
    my_review?: {
        detail: string,
        id: ID,
        rating: number,
    }
}

const eCommerceService = {

    getOrderOfMe: async (): Promise<{
        orders: OrderProps[],
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
            orders: OrderProps[],
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

    checkPurchased: async (slug: string): Promise<boolean> => {

        let data = await ajax<{
            isPurchased: boolean,
        }>({
            url: 'vn4-ecommerce/me/product/find',
            data: {
                product: slug,
            }
        });

        return data.isPurchased;

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

        result.reviews.data.forEach(item => {

            if (typeof item.ecom_customer_detail === 'string') {
                try {
                    item.customer = JSON.parse(item.ecom_customer_detail);
                } catch (error) {
                    item.customer = null;
                }
            }
        });

        return result;

    }

}

export default eCommerceService;