import { PaginationProps } from "components/atoms/TablePagination";
import { ajax } from "hook/useApi";

export const REPORT_TYPE = 'vn4_report_blog';

const exploreService = {

    gets: async ({ per_page, current_page }: { current_page: number, per_page: number }): Promise<PaginationProps<ExploreProps>> => {

        let data = await ajax<{ posts: PaginationProps<ExploreProps> }>({
            url: 'vn4-blog/blog/posts',
            data: {
                length: per_page,
                page: current_page
            }
        });

        data.posts.data.forEach((item: ExploreProps) => {
            if (typeof item.account_author_detail === 'string') {
                try {
                    item.account_author_detail = JSON.parse(item.account_author_detail);
                } catch (error) {
                    item.account_author_detail = null;
                }
            }
        });

        return data.posts;

    },
    find: async (slug: string): Promise<ExploreProps | null> => {

        let data = await ajax<{
            blog: ExploreProps
        } | null>({
            url: 'vn4-blog/blog/post/find',
            data: {
                slug: slug
            }
        });

        if (data?.blog) {

            if (typeof data.blog.account_author_detail === 'string') {
                try {
                    data.blog.account_author_detail = JSON.parse(data.blog.account_author_detail);
                } catch (error) {
                    data.blog.account_author_detail = null;
                }
            }

            return data.blog;
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

            data.posts.data.forEach((item: ExploreProps) => {
                if (typeof item.account_author_detail === 'string') {
                    try {
                        item.account_author_detail = JSON.parse(item.account_author_detail);
                    } catch (error) {
                        item.account_author_detail = null;
                    }
                }
            });

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
    content: string,
    view_number: number,
    updated_at: string,
    account_author_detail: null | {
        title: string,
        avatar: string,
        slug: string,
    }
}
