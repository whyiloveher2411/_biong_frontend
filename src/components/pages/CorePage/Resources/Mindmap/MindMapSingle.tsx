import { Box, Typography } from '@mui/material';
// import AvatarWithLineWraper from 'components/atoms/AvatarWithLineWraper';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { cssMaxLine } from 'helpers/dom';
import { getImageUrl } from 'helpers/image';
import { UseBookmarks } from 'hook/useBookmarks';
import { Link } from 'react-router-dom';
import { Mindmap } from 'services/mindmapService';
import MoreButtonVideoMindmap from './components/MoreButtonVideoMindmap';

const MindMapSingle = ({ mindmap, link, bookmark }: { mindmap: Mindmap, link: string, bookmark: UseBookmarks }) => {


    return (
        <Box
            sx={{
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer',
                width: 'calc(var(--row-usable-w) / var(--item-per-row) - var(--item-margin) - .01px)',
                mb: 3
            }}
        >

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >

                <Box
                    sx={{
                        position: 'relative',
                    }}
                >
                    <Link
                        to={link}
                    >
                        <ImageLazyLoading
                            src={getImageUrl(mindmap.thumbnail, 'https://i.ytimg.com/vi/' + mindmap.id_youtube_video + '/hqdefault.jpg')}
                            alt={mindmap.title}
                            ratio={'16/9'}
                            sx={{
                                width: '100%',
                                objectFit: 'cover',
                                borderRadius: 2,
                            }}
                        />
                    </Link>
                    <Box
                        sx={{
                            width: '100%',
                            position: 'absolute',
                            background: 'linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))',
                            bottom: 0,
                            height: 64,
                            left: 0,
                        }}
                    >
                        {/* {
                            bookmark.isBookmarked(mindmap.id) ?

                                <IconButton
                                    // onClick={() => bookmark.toggle(mindmap.id)}
                                    color='warning'
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        zIndex: 10,
                                    }}
                                >
                                    <Bookmark />
                                </IconButton>
                                : null
                        } */}
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 1,
                        pt: 1.5,
                    }}
                >
                    {/* <AvatarWithLineWraper
                            index={0}
                            title={'Đặng Thuyền Quân'}
                            link={'/user/dang-thuyen-quan'}
                            avatar={getImageUrl('/images/user-default.svg')}
                            disabledLine
                            sx={{
                                width: 36,
                                height: 36,
                            }}
                        /> */}
                    <Link
                        to={link}
                    >
                        <Typography variant="h2" sx={{ mb: 1, fontSize: '16px', lineHeight: 1.38, fontWeight: 'bold', ...cssMaxLine(2) }}>
                            {mindmap.title}
                        </Typography>
                    </Link>
                    <Box>
                        <MoreButtonVideoMindmap mindmap={mindmap} bookmark={bookmark} />
                    </Box>
                </Box>
                <Link
                    to={`/resources/mindmap/${mindmap.category?.slug}`}
                >
                    <Typography color="text.secondary" variant="body2" sx={{ fontSize: '14px', lineHeight: 1.38 }}>
                        {mindmap.category?.title}
                    </Typography>
                </Link>
            </Box>
        </Box >
    );
};

export default MindMapSingle;