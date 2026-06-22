const SOCIAL_PREVIEW_API_BASE =
    'https://api.spacedev.vn/api/frontend/v1.0/vn4-e-learning/marketing/article-social-preview';

const BOT_USER_AGENT =
    /facebookexternalhit|facebot|meta-externalagent|twitterbot|linkedinbot|whatsapp|slackbot|telegrambot|discordbot|bingbot/i;

const TIN_TUC_PATH = /^\/tin-tuc\/(\d{4})\/([^/]+)\/?$/;

function isSocialCrawler(userAgent: string): boolean {
    return BOT_USER_AGENT.test(userAgent);
}

function buildArticleSocialPreviewUrl(year: string, postId: string): URL {
    const previewUrl = new URL(SOCIAL_PREVIEW_API_BASE);
    previewUrl.searchParams.set('year', year);
    previewUrl.searchParams.set('id', postId);
    previewUrl.searchParams.set('lang', 'vi');
    return previewUrl;
}

export default async function middleware(request: Request) {
    const userAgent = request.headers.get('user-agent') ?? '';
    if (!isSocialCrawler(userAgent)) {
        return;
    }

    const pathname = new URL(request.url).pathname;
    const match = pathname.match(TIN_TUC_PATH);
    if (!match) {
        return;
    }

    const [, year, encodedPostId] = match;
    const postId = decodeURIComponent(encodedPostId);
    const previewUrl = buildArticleSocialPreviewUrl(year, postId);

    const previewResponse = await fetch(previewUrl.toString(), {
        headers: {
            Accept: 'text/html',
        },
    });

    const headers = new Headers();
    const contentType = previewResponse.headers.get('Content-Type');
    if (contentType) {
        headers.set('Content-Type', contentType);
    }
    const cacheControl = previewResponse.headers.get('Cache-Control');
    if (cacheControl) {
        headers.set('Cache-Control', cacheControl);
    }

    return new Response(previewResponse.body, {
        status: previewResponse.status,
        headers,
    });
}

export const config = {
    matcher: ['/tin-tuc/:year/:id', '/tin-tuc/:year/:id/'],
};
