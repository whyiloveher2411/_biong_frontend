


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
                sx={{
                    '& .blur': {
                        filter: 'unset !important',
                    },
                    width: "24px",
                    height: "24px",
                    borderRadius: '50%',
                }}
            />
        </SliderThumb>
    );
}