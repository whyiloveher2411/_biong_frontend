import { PaginationProps } from 'components/atoms/TablePagination';
import cacheWindow from 'hook/cacheWindow';
import { ajax } from 'hook/useApi';

const mindmapService = {

    getMindmapCategories: async (): Promise<Array<MindmapCategory>> => {
        return cacheWindow('getMindmapCategories', async () => {
            let result = await ajax<{
                categories: Array<MindmapCategory> | null
            }>({
                url: 'vn4-e-learning/mindmaps/categories',
            });

            return result.categories || [];
        })
    },

    getMindmaps: async (slug?: string, data?: {
        current_page: number,
        per_page: number
    }): Promise<PaginationProps<Mindmap> | null> => {
        let result = await ajax<{
            posts: PaginationProps<Mindmap> | null
        }>({
            url: 'vn4-e-learning/mindmaps/1-get-mindmaps',
            data: {
                category: slug,
                ...data
            },
        });

        if (!result.posts) {
            return null;
        }

        result.posts.data.forEach((mindmap: Mindmap) => {
            try {
                if (typeof mindmap.category === 'string') {
                    mindmap.category = JSON.parse(mindmap.category);
                }
            } catch (error) {
                mindmap.category = undefined;
            }
        });

        return result.posts;
    },

    getMindmap: async (slug: string): Promise<Mindmap | null> => {
        return cacheWindow('getMindmap_' + slug, async () => {

            let result = await ajax<{
                post: Mindmap | undefined
            }>({
                url: 'vn4-e-learning/mindmaps/2-get-mindmap',
                data: {
                    slug: slug
                },
            });

            if (!result.post) {
                return null;
            }

            try {
                if (typeof result.post.subtitles_target === 'string') {
                    result.post.subtitles_target = JSON.parse(result.post.subtitles_target);
                }
            } catch (error) {
                result.post.subtitles_target = [];
            }

            try {
                if (typeof result.post.subtitles_source === 'string') {
                    result.post.subtitles_source = JSON.parse(result.post.subtitles_source);
                }
            } catch (error) {
                result.post.subtitles_source = [];
            }

            result.post.mindmap_related?.forEach((mindmap) => {
                try {
                    if (typeof mindmap.category === 'string') {
                        mindmap.category = JSON.parse(mindmap.category);
                    }
                } catch (error) {
                    mindmap.category = undefined;
                }
            });

            const combinedSubtitles = result.post.subtitles_source.map((sourceSubtitle) => {
                const targetSubtitle = result.post?.subtitles_target?.find(target =>
                    parseFloat(target.start) === parseFloat(sourceSubtitle.start)
                );

                return {
                    start: sourceSubtitle.start,
                    duration: sourceSubtitle.duration,
                    text: sourceSubtitle.text,
                    target: targetSubtitle ? targetSubtitle.text : '',
                };
            });

            result.post.subtitles_combined = combinedSubtitles;

            return result.post;
        })
    },


}

export default mindmapService;

export interface MindmapCategory {
    id: ID,
    title: string,
    slug: string,
    status: string,
    icon: string,
}


export interface Mindmap {
    id: ID,
    title: string,
    description: string,
    summary: string,
    slug: string,
    mindmap: string,
    id_youtube_video: string,
    thumbnail: string,
    subtitles_combined?: Array<{
        start: string,
        duration: string,
        text: string,
        target: string,
    }>,
    subtitles_target: Array<{
        start: string,
        duration: string,
        text: string,
    }>,
    subtitles_source: Array<{
        start: string,
        duration: string,
        text: string,
    }>,
    category?: MindmapCategory,
    mindmap_related?: Array<Mindmap>
}