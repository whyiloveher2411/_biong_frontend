import cacheWindow from 'hook/cacheWindow';
import { ajax } from 'hook/useApi';
import { PageContentProps } from '../@type';

export default async (group: string, slugPost: string): Promise<PageContentProps | null> => {
    return cacheWindow('vn4-e-learning/page/get-content/' + group + '/' + slugPost, async () => {
        let api = await ajax<{
            post: PageContentProps,
        }>({
            url: 'vn4-e-learning/page/get-content',
            data: {
                group: group,
                post: slugPost,
            }
        });

        if (api.post) {
            return api.post;
        }

        return null;
    });
}
