import cacheWindow from 'hook/cacheWindow';
import { ajax } from 'hook/useApi';

const bookmarkService = {
    toggle: async (id: ID, type: BookmarkType): Promise<boolean> => {
        let data = await ajax<{
            action: 'add' | 'remove'
        }>({
            url: 'vn4-e-learning/bookmark/toggle',
            data: {
                id: id,
                type: type,
            }
        });

        return data.action === 'add';
    },
    getBookmarks: async (type: BookmarkType): Promise<Bookmarked> => {
        return cacheWindow('bookmarks_' + type, async () => {
            let data = await ajax<{
                status: boolean,
                bookmarks: Bookmarked,
            }>({
                url: 'vn4-e-learning/bookmark/get',
                data: {
                    type: type,
                }
            });

            return data.status ? data.bookmarks : {};
        });
    }
}

export default bookmarkService;

export type BookmarkType = '_removed' | 'cheatsheet' | 'docs' | 'mindmap';

export type Bookmarked = { [key: ID]: BookmarkType };