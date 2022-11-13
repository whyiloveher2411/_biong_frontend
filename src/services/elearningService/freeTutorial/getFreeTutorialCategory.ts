import cacheWindow from 'hook/cacheWindow';
import { ajax } from 'hook/useApi';
import { FreeTutorialCategoryProps, FreeTutorialSection } from '../@type';

export default async (slug: string): Promise<{
    category: FreeTutorialCategoryProps,
    sections: FreeTutorialSection[],
} | null> => {

    return cacheWindow('vn4-e-learning/free-tutorial/find-category/' + slug, async () => {

        let api = await ajax<{
            category: FreeTutorialCategoryProps,
            sections: FreeTutorialSection[],
        }>({
            url: 'vn4-e-learning/free-tutorial/find-category',
            data: {
                category: slug,
            }
        });

        if (api.category && api.sections) {
            return {
                category: api.category,
                sections: api.sections,
            };
        }

        return null;
    });

}
