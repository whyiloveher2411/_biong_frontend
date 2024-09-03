import { ajax } from 'hook/useApi';
import { CourseProps } from './courseService';
import cacheWindow from 'hook/cacheWindow';

const cheatsheetsService = {

    getTopic: async (slug: string): Promise<DocsTopic> => {
        return cacheWindow('docsService_getTopic' + slug, async () => {
            let result = await ajax<{
                post: DocsTopic
            }>({
                url: 'vn4-e-learning/docs/2-get-topic-detail',
                data: {
                    slug
                },
            });

            return result.post;
        })
    },

    getSubtopic: async (slugTopic: string, slug: string): Promise<DocsSubTopic> => {
        return cacheWindow('docsService_getSubtopic_' + slugTopic + '/' + slug, async () => {

            let result = await ajax<{
                post: DocsSubTopic
            }>({
                url: 'vn4-e-learning/docs/3-get-subtopic-detail',
                data: {
                    slug,
                    slug_topic: slugTopic
                },
            });

            return result.post;
        })
    },

    getFunction: async (slugTopic: string, slugSubtopic: string, slug: string): Promise<DocsFunction> => {
        return cacheWindow('docsService_getFunction_' + slugTopic + '/' + slugSubtopic + '/' + slug, async () => {

            let result = await ajax<{
                post: DocsFunction
            }>({
                url: 'vn4-e-learning/docs/4-get-function-detail',
                data: {
                    slug,
                    slug_subtopic: slugSubtopic,
                    slug_topic: slugTopic
                },
            });

            return result.post;
        })
    },

    getTopics: async (): Promise<Array<DocsTopic>> => {
        return cacheWindow('docsService_getTopics', async () => {
            let result = await ajax<{
                posts: Array<DocsTopic>
            }>({
                url: 'vn4-e-learning/docs/1-get-topics',
            });

            return result.posts;
        })
    },

    getSubtopics: async (slugTopic: string): Promise<Array<DocsSubTopic>> => {

        return cacheWindow('docsService_getSubtopics_' + slugTopic, async () => {
            let result = await ajax<{
                posts: Array<DocsSubTopic>
            }>({
                url: 'vn4-e-learning/docs/5-get-subtopics',
                data: {
                    slug_topic: slugTopic
                },
            });

            return result.posts;
        })
    },


    getFunctions: async (slugTopic: string, slugSubtopic: string): Promise<Array<DocsFunction>> => {
        return cacheWindow('docsService_getFunctions_' + slugTopic + '/' + slugSubtopic, async () => {

            let result = await ajax<{
                posts: Array<DocsFunction>
            }>({
                url: 'vn4-e-learning/docs/6-get-functions',
                data: {
                    slug_topic: slugTopic,
                    slug_subtopic: slugSubtopic
                },
            });

            return result.posts;
        })
    },

    getCourseRelated: async (slugTopic: string): Promise<Array<CourseProps> | null> => {
        return cacheWindow('docsService_getCourseRelated_' + slugTopic, async () => {

            let result = await ajax<{
                posts: Array<CourseProps>
            }>({
                url: 'vn4-e-learning/docs/7-get-course-related',
                data: {
                    slug_topic: slugTopic,
                },
            });

            return result.posts;
        })
    },


}

export default cheatsheetsService;

export interface DocsTopic {
    id: ID,
    title: string,
    description: string,
    slug: string,
    introduce: string,
    is_comming?: number
}

export interface DocsSubTopic {
    id: ID,
    title: string,
    description: string,
    slug: string,
    introduce: string,
    topic?: DocsTopic
    is_comming?: number
}

export interface DocsFunction {
    id: ID,
    title: string,
    description: string,
    slug: string,
    content: string | React.ReactNode,
    topic?: DocsTopic,
    subtopic?: DocsSubTopic,
    is_comming?: number
}