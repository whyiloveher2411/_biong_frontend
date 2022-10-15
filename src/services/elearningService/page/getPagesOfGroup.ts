import cacheWindow from 'hook/cacheWindow';
import { ajax } from 'hook/useApi';
import { PageContentProps } from '../@type';

export default async (group: string): Promise<PageContentProps[] | null> => {

    return cacheWindow('vn4-e-learning/page/get-page-of-group/' + group, async () => {

        let api = await ajax<{
            pages: PageContentProps[],
        }>({
            url: 'vn4-e-learning/page/get-page-of-group',
            data: {
                group: group,
            }
        });

        if (api.pages) {
            return api.pages;
        }

        return null;
    })


}
