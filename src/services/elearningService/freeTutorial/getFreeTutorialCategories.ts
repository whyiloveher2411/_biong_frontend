import { ajax } from 'hook/useApi';
import { FreeTutorialCategoryProps } from '../@type';

export default async (): Promise<FreeTutorialCategoryProps[] | null> => {

    let api = await ajax<{
        categories: FreeTutorialCategoryProps[],
    }>({
        url: 'vn4-e-learning/free-tutorial/get-category',
    });

    if (api.categories) {
        return api.categories;
    }

    return null;

}