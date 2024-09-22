import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import { LoadingButton } from "@mui/lab";
import React from "react";
import bookmarkService, { Bookmarked, BookmarkType } from "services/bookmarkService";
import { useIndexedDB } from "./useApi";
import useQuery from "./useQuery";
import { IconButton } from "@mui/material";
import { Bookmark } from "@mui/icons-material";

function useBookmarks(type: BookmarkType) {

    const { data: bookmarks, setData: setBookmarks, isLoading } = useIndexedDB<Bookmarked>({
        key: 'bookmarks_' + type,
        defaultValue: {}
    });

    const paramUrl = useQuery({
        bookmarks: 'false'
    });

    const toggle = async (id: ID) => {
        bookmarkService.toggle(id, type);
        if (bookmarks[id] === type) {
            setBookmarks(prev => ({ ...prev, [id]: '_removed' as BookmarkType }));
        } else {
            setBookmarks(prev => ({ ...prev, [id]: type }));
        }
    }

    React.useEffect(() => {
        bookmarkService.getBookmarks(type).then(setBookmarks);
    }, []);

    return {
        isFilterByBookmark: paramUrl.query.bookmarks === 'true',
        bookmarks: bookmarks,
        setBookmarks: setBookmarks,
        buttonFilter: paramUrl.query.bookmarks === 'true' ?
            <LoadingButton
                variant="contained"
                color="warning"
                loading={isLoading}
                startIcon={<BookmarkBorder />}
                onClick={() => {
                    paramUrl.changeQuery({ bookmarks: 'false' });
                }}
            >
                Đã bookmark
            </LoadingButton>
            :
            <LoadingButton
                variant="outlined"
                color="warning"
                loading={isLoading}
                startIcon={<BookmarkBorder />}
                onClick={() => {
                    paramUrl.changeQuery({ bookmarks: 'true' });
                }}
            >
                Đã bookmark
            </LoadingButton>
        ,
        iconButton: (id: ID) => (bookmarks[id] === type ?
            <IconButton
                color="warning"
                onClick={() => toggle(id)}
            >
                <Bookmark />
            </IconButton>
            :
            <IconButton
                color="warning"
                onClick={() => toggle(id)}
            >
                <BookmarkBorder />
            </IconButton>
        ),
        toggle: toggle,
        isBookmarked: (id: ID) => {
            return bookmarks[id] === type;
        },
        filterByBookmark: <T extends { id: ID }>(items: T[]): T[] => {
            if (paramUrl.query.bookmarks === 'true') {
                return items.filter(item => bookmarks[item.id] === type);
            }

            return items;
        }
    };
}

export default useBookmarks