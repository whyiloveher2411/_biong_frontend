import Bookmark from '@mui/icons-material/Bookmark'
import BookmarkBorder from '@mui/icons-material/BookmarkBorder'
import { IconButton } from '@mui/material'
import { UseBookmarks } from 'hook/useBookmarks'
import { Mindmap } from 'services/mindmapService'



function MoreButtonVideoMindmap({ mindmap, bookmark }: { mindmap: Mindmap, bookmark: UseBookmarks }) {

    return <IconButton
        onClick={() => {
            bookmark.toggle(mindmap.id);
        }}
    >
        {
            bookmark.isBookmarked(mindmap.id) ? <Bookmark color='warning' /> : <BookmarkBorder />
        }
    </IconButton>;
}

export default MoreButtonVideoMindmap
