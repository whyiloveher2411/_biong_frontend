import cacheWindow from 'hook/cacheWindow';
import { ajax } from 'hook/useApi';
import { FreeTutorialContent } from '../@type';

export default (category: string, sectionSlug: string, slug: string): Promise<FreeTutorialContent | null> => {

    return cacheWindow('vn4-e-learning/free-tutorial/find-content/' + category + '/' + sectionSlug + '/' + slug, async () => {
        let api = await ajax<{
            post: FreeTutorialContent,
        }>({
            url: 'vn4-e-learning/free-tutorial/find-content',
            data: {
                category: category,
                section: sectionSlug,
                post: slug,
            }
        });

        if (api.post) {
            return api.post;
        }

        return null;

    });

}
