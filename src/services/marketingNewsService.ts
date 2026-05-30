import { ajax } from 'hook/useApi';
import { getLanguage } from 'helpers/i18n';

export interface MarketingHomePost {
    id: string;
    year: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    categoryId?: string;
    categoryName?: string;
    /** Unix timestamp (giây), từ `date_publish` trên S3 */
    datePublish?: number;
}

const marketingNewsService = {
    getHomepagePosts: async (): Promise<MarketingHomePost[]> => {
        const lang = getLanguage()?.code ?? 'vi';

        const data = await ajax<{
            posts?: MarketingHomePost[];
        }>({
            url: 'vn4-e-learning/marketing/get-homepage-posts',
            data: { lang },
        });

        return data.posts ?? [];
    },
};

export default marketingNewsService;
