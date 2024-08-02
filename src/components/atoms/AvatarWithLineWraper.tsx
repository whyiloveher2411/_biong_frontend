import { Tooltip } from '@mui/material'
import ImageLazyLoading from 'components/atoms/ImageLazyLoading'
import React from 'react';
import { Link } from 'react-router-dom'

function AvatarWithLineWraper({ title, link, avatar, index }: { title: string, link: string, avatar: string, index: number }) {

    const [canLoadAvatar, setCanLoadAvatar] = React.useState(false);

    React.useEffect(() => {
        const img = new Image();
        img.onload = function () {
            setCanLoadAvatar(true);
        };
        img.onerror = function () {
            setCanLoadAvatar(false);
        };
        img.src = avatar;
    }, []);

    return (
        <Tooltip
            title={title}
        >
            <Link
                to={link}
            >
                <ImageLazyLoading
                    src={canLoadAvatar ? avatar : '/images/user-default.svg'}
                    placeholderSrc='/images/user-default.svg'
                    name={title}
                    className='avatar-item'
                    sx={{
                        zIndex: 100 - index,
                        borderRadius: '50%',
                        '& .blur': {
                            filter: 'unset !important',
                        },
                        flexShrink: 0,
                        '& .wrapper': {
                            aspectRatio: 1,
                            position: 'relative',
                            zIndex: 0,
                            '--b': '2px',
                            '--c': 'linear-gradient(' + (index * 36) + 'deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                            '& img': {
                                borderRadius: '50%',
                                border: '2px solid',
                            },
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                zIndex: -1,
                                inset: 0,
                                background: 'var(--c,linear-gradient(to right, #9c20aa, #fb3570))',
                                padding: 'var(--b)',
                                borderRadius: '50%',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude',
                            }
                        }
                    }}
                />
            </Link>
        </Tooltip>
    )
}

export default AvatarWithLineWraper
