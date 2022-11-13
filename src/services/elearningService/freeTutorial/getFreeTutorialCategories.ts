import cacheWindow from 'hook/cacheWindow';
import { ajax } from 'hook/useApi';
import { FreeTutorialCategoryProps } from '../@type';

export default async (): Promise<Array<{
    id: ID,
    title: string,
    categories?: FreeTutorialCategoryProps[]
}> | null> => {

    return cacheWindow('vn4-e-learning/free-tutorial/get-category', async () => {

        let api = await ajax<{
            groups: Array<{
                id: ID,
                title: string,
                categories?: FreeTutorialCategoryProps[]
            }> | null
        }>({
            url: 'vn4-e-learning/free-tutorial/get-category',
        });

        if (api.groups) {
            return api.groups;
        }

        return null;
    });

}