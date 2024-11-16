import { PaginationProps } from "components/atoms/TablePagination";
import { ajax } from "hook/useApi";
import { AddinData } from "./courseService";

export const REPORT_TYPE = 'vn4_report_blog';

const exploreService = {

    getHomepage: async (): Promise<ExploreProps[]> => {

        let data = await ajax<{ posts: ExploreProps[] }>({
            url: 'vn4-blog/blog/get-homepage',
        });

        return data.posts;

    },

    getCategories: async (): Promise<{ [key: string]: { id: ID, title: string, slug: string } }> => {
        let data = await ajax<{ categories: { [key: string]: { id: ID, title: string, slug: string } } }>({
            url: 'vn4-blog/blog/categories',
        });
        return data.categories;
    },

    gets: async ({ per_page, current_page }: { current_page: number, per_page: number }, cate?: string): Promise<{
        cate?: { id: ID, title: string, slug: string, description: string },
        posts: PaginationProps<ExploreProps>,
        categories: { [key: string]: { id: ID, title: string, slug: string } },
    }> => {

        let data = await ajax<{
            cate?: { id: ID, title: string, slug: string, description: string },
            posts: PaginationProps<ExploreProps>,
            categories: { [key: string]: { id: ID, title: string, slug: string } },
        }>({
            url: 'vn4-blog/blog/posts',
            data: {
                length: per_page,
                page: current_page,
                cate: cate
            }
        });

        return data;

    },
    find: async (slug: string): Promise<{
        blog: ExploreProps,
        reference_post: Array<ExploreProps>
    } | null> => {

        let data = await ajax<{
            blog: ExploreProps
            reference_post: Array<ExploreProps>
        } | null>({
            url: 'vn4-blog/blog/post/find',
            data: {
                slug: slug
            }
        });

        if (data?.blog) {
            return data;
        }

        return null;

        // let result: ExploreProps | null = null;

        // explores.forEach(item => {
        //     if (item.key === slug) {
        //         result = item;
        //         return false;
        //     }
        // });

        // return result;
    },
    getBlogOfMe: async ({ user, current_page, per_page }: { user: ID, current_page: number, per_page: number }): Promise<PaginationProps<ExploreProps> | null> => {

        let data = await ajax<{
            posts: PaginationProps<ExploreProps>
        }>({
            url: 'vn4-blog/blog/get-of-me',
            data: {
                length: per_page,
                page: current_page,
                user: user,
            }
        });

        if (data.posts) {
            return data.posts;
        }
        return null;
        // return courses;
    },

    getSavedPost: async ({ current_page, per_page }: { current_page: number, per_page: number }): Promise<PaginationProps<ExploreProps> | null> => {

        let data = await ajax<{
            posts: PaginationProps<ExploreProps>
        }>({
            url: 'vn4-blog/blog/saved-post',
            data: {
                length: per_page,
                page: current_page,
            }
        });

        if (data.posts) {
            return data.posts;
        }
        return null;
        // return courses;
    },
}

export default exploreService;

export interface ExploreProps {
    id: ID,
    slug: string,
    title: string,
    featured_image: string,
    description: string,
    // content: string,
    view_number: number,
    updated_at: string,
    created_at: string,
    public_date: string,
    read_time?: number,
    comment_count?: number,
    category_data?: {
        id: ID,
        title: string,
        slug: string,
    },
    account_author_detail: null | {
        title: string,
        avatar: string,
        slug: string,
        is_verified: boolean,
    },
    content: Array<AddinData>,

    count_like: number,
    count_love: number,
    count_care: number,
    count_haha: number,
    count_wow: number,
    count_sad: number,
    count_angry: number,
    my_reaction_type: string,

    count_save: number,
    my_save: string,
}
