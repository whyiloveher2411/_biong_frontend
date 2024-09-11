import { ajax } from 'hook/useApi';
import { CourseProps } from './courseService';
import cacheWindow from 'hook/cacheWindow';
import { ImageProps } from 'components/atoms/Avatar';

const cheatsheetsService = {

    getLanguages: async (): Promise<Array<CheatsheetLanguage>> => {
        return cacheWindow('cheatsheetsService_getLanguages', async () => {
            let result = await ajax<{
                posts: Array<CheatsheetLanguage>
            }>({
                url: 'vn4-e-learning/cheatsheets/1-get-languages',
            });

            return result.posts;
        })
    },

    getSubjects: async (): Promise<Array<CheatsheetSubject>> => {
        return cacheWindow('cheatsheetsService_getSubjects', async () => {

            let result = await ajax<{
                posts: Array<CheatsheetSubject>
            }>({
                url: 'vn4-e-learning/cheatsheets/2-get-subjects',
            });

            return result.posts;
        })
    },

    getCheatsheets: async (slugLanguage?: string, slugSubject?: string): Promise<{ posts: Array<Cheatsheet>, title: string } | null | undefined> => {
        return cacheWindow('cheatsheetsService_getCheatsheets_' + slugLanguage + '/' + slugSubject, async () => {

            let result = await ajax<{
                posts: Array<Cheatsheet>,
                title: string,
            }>({
                url: 'vn4-e-learning/cheatsheets/3-get-cheatsheets',
                data: {
                    slug_subject: slugSubject,
                    slug_language: slugLanguage
                },
            });

            if (result.posts) {
                return result;
            }

            return null;
        });
    },

    getCheatsheet: async (slugCheatsheet?: string): Promise<Cheatsheet | null> => {

        if (!slugCheatsheet) return null;

        return cacheWindow('cheatsheetsService_getCheatsheet_' + slugCheatsheet, async () => {

            let result = await ajax<{
                post: Cheatsheet
            }>({
                url: 'vn4-e-learning/cheatsheets/4-get-cheatsheet',
                data: {
                    slug: slugCheatsheet
                },
            });

            return result.post;
        })
    },

    getModules: async (slugCheatsheet?: string, slugModule?: string): Promise<Array<CheatsheetModule>> => {
        return cacheWindow('cheatsheetsService_getModules_' + slugCheatsheet + '/' + slugModule, async () => {

            let result = await ajax<{
                posts: Array<CheatsheetModule>,
            }>({
                url: 'vn4-e-learning/cheatsheets/5-get-module',
                data: {
                    slug_cheatsheet: slugCheatsheet,
                    slug_module: slugModule,
                },
            });

            return result.posts;
        })
    },

    getModuleDetail: async (slugCheatsheet?: string, slugModule?: string, slug?: string): Promise<CheatsheetModule | null> => {
        return cacheWindow('cheatsheetsService_getModuleDetail_' + slugCheatsheet + '/' + slugModule + '/' + slug, async () => {
            let result = await ajax<{
                post: CheatsheetModule,
            }>({
                url: 'vn4-e-learning/cheatsheets/6-get-module-detail',
                data: {
                    slug_module: slugModule,
                    slug_cheatsheet: slugCheatsheet,
                    slug: slug,
                },
            });

            try {
                result.post.contents = typeof result.post.contents === 'string' ? JSON.parse(result.post.contents) : [];
            } catch (error) {
                result.post.contents = [];
            }

            return result.post;
        })
    },

    getCourseRelated: async (slugLanguage: string, slugSubject: string): Promise<Array<CourseProps> | null> => {
        return cacheWindow('cheatsheetsService_getCourseRelated_' + slugLanguage + '/' + slugSubject, async () => {

            let result = await ajax<{
                posts: Array<CourseProps>
            }>({
                url: 'vn4-e-learning/docs/7-get-course-related',
                data: {
                    slug_subject: slugSubject,
                    slug_language: slugLanguage
                },
            });

            return result.posts;
        })
    },


}

export default cheatsheetsService;

export interface CheatsheetLanguage {
    id: ID,
    title: string,
    slug: string,
}

export interface CheatsheetSubject {
    id: ID,
    title: string,
    slug: string,
}

export interface Cheatsheet {
    id: ID,
    slug: string,
    title: string,
    body: string,
    languages?: Array<CheatsheetLanguage>,
    subjects?: Array<CheatsheetSubject>,
}

export interface CheatsheetModule {
    id: ID,
    title: string,
    slug: string,
    contents: Array<{
        title: string,
        body: string,
        images: Array<ImageProps>,
        code_snippets: Array<{
            language: string,
            text: string,
        }>,
    }>,
}
