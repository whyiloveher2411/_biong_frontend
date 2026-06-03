import { ajax } from 'hook/useApi';
import { getLanguage } from 'helpers/i18n';
import { convertToURL } from 'helpers/url';

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
    hasAudio?: boolean;
}

const API_PREFIX = convertToURL(process.env.REACT_APP_HOST_API_KEY, '/api/frontend/v1.0/');

export function buildArticleAudioStreamUrl(post: MarketingHomePost, langCode?: string): string {
    const lang = langCode ?? getLanguage()?.code ?? 'vi';
    const params = new URLSearchParams({
        id: post.id,
        year: String(post.year),
        lang,
    });

    return `${API_PREFIX}vn4-e-learning/marketing/stream-article-audio?${params.toString()}`;
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
