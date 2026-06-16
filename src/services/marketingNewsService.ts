import { ajax } from 'hook/useApi';
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
    /** Token stream audio — HMAC từ backend, gắn id/year/lang/exp */
    audioStreamExp?: number;
    audioStreamSig?: string;
    /** Ngôn ngữ đã ký trong token — phải khớp khi gọi stream */
    audioStreamLang?: string;
}

const API_PREFIX = convertToURL(process.env.REACT_APP_HOST_API_KEY, '/api/frontend/v1.0/');

export function buildArticleAudioStreamUrl(post: MarketingHomePost, langCode?: string): string | null {
    const lang = 'vi';
    const exp = post.audioStreamExp;
    const sig = post.audioStreamSig?.trim();

    if (!exp || !sig) {
        return null;
    }

    const params = new URLSearchParams({
        id: post.id,
        year: String(post.year),
        lang,
        exp: String(exp),
        sig,
    });

    return `${API_PREFIX}vn4-e-learning/marketing/stream-article-audio?${params.toString()}`;
}

const marketingNewsService = {
    getHomepagePosts: async (): Promise<MarketingHomePost[]> => {
        const lang = 'vi';

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
