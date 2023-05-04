


import { Slider, SliderThumb } from '@mui/material';
import ImageLazyLoading from 'components/atoms/ImageLazyLoading';
import { getImageUrl } from 'helpers/image';
import React from 'react';
import { UserState, useUser } from 'store/user/user.reducers';

function SidebarThumbnail({ value, max }: {
    value: number,
    max: number,
}) {
    return (
        <Slider
            size="medium"
            value={value}
            max={max}
            sx={{
                '& .MuiBox-root': {
                    overflow: 'unset',
                }
            }}
            components={{
                Thumb: AvatarUser
            }}
        />
    )
}

export default SidebarThumbnail

type AvatarUserThumbComponentProps = React.HTMLAttributes<unknown>

function AvatarUser(props: AvatarUserThumbComponentProps) {
    const { children, ...other } = props;
    const user = useUser();
    return (
        <SliderThumb {...other}>
            {children}
            <ImageLazyLoading
                src={user._state === UserState.identify ? getImageUrl(user.avatar, '/images/user-default.svg') : '/images/user-default.svg'}
                placeholderSrc='/images/user-default.svg'
                name={user.full_name}
                sx={(theme) => ({
                    '& .blur': {
                        filter: 'unset !important',
                    },
                    width: "30px",
                    height: "30px",
                    borderRadius: '50%',
                    flexShrink: 0,
                    '& .wrapper': {
                        aspectRatio: 1,
                        position: 'relative',
                        zIndex: 0,
                        '--b': '10px',
                        '--c': 'linear-gradient(140deg,red,yellow,green)',
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
                })}
            />
        </SliderThumb>
    );
}