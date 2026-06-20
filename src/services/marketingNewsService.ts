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
    detailUrl?: string;
}

export type MarketingArticleBlock =
    | { type: 'text'; format: 'markdown' | 'html'; data: string }
    | { type: 'image'; url: string; caption?: string };

export interface MarketingArticleDetail extends MarketingHomePost {
    readMinutes?: number;
    isPro?: boolean;
    author?: string;
    contentFormat?: string;
    blocks: MarketingArticleBlock[];
}

const API_PREFIX = convertToURL(process.env.REACT_APP_HOST_API_KEY, '/api/frontend/v1.0/');
const DEFAULT_LANG = 'vi';

export function buildArticleDetailPath(post: Pick<MarketingHomePost, 'id' | 'year'>): string {
    return `/tin-tuc/${post.year}/${encodeURIComponent(post.id)}`;
}

export function buildArticleAudioStreamUrl(
    post: Pick<MarketingHomePost, 'id' | 'year' | 'audioStreamExp' | 'audioStreamSig' | 'audioStreamLang'>,
    langCode?: string,
): string | null {
    const lang = langCode?.trim() || post.audioStreamLang?.trim() || DEFAULT_LANG;
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
        const data = await ajax<{
            posts?: MarketingHomePost[];
        }>({
            url: 'vn4-e-learning/marketing/get-homepage-posts',
            data: { lang: DEFAULT_LANG },
        });

        return data.posts ?? [];
    },

    getArticleDetail: async ({
        id,
        year,
        lang = DEFAULT_LANG,
    }: {
        id: string;
        year: number;
        lang?: string;
    }): Promise<MarketingArticleDetail | null> => {
        try {
            const data = await ajax<{
                post?: MarketingArticleDetail;
            }>({
                url: 'vn4-e-learning/marketing/get-article-detail',
                data: { id, year, lang },
            });

            return data.post ?? null;
        } catch {
            return null;
        }
    },
};

export default marketingNewsService;
