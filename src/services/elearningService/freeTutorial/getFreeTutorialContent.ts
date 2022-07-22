import { ajax } from 'hook/useApi';
import { FreeTutorialContent } from '../@type';

export default async (category: string, sectionSlug: string, slug: string): Promise<FreeTutorialContent | null> => {

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

}
