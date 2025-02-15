import React from 'react';
import { __ } from 'helpers/i18n';
import { Box, SxProps, Theme } from '@mui/material';

function NotFound({ children, title = __('Nothing To Display.'), subTitle = __('Seems like no data have been created yet.'), img, sx }: {
    children?: React.ReactNode,
    title?: React.ReactNode,
    subTitle?: React.ReactNode,
    img?: string,
    sx?: SxProps<Theme>
}) {

    return (
        <Box sx={{ textAlign: 'center', pt: 3, ...sx }}>
            <img style={{ maxWidth: '100%', margin: '0 auto 16px', display: 'block', maxHeight: 350 }} src={img ? img : "/images/notfound.svg"} />
            <strong>
                {
                    children ?
                        children :
                        <>
                            {title} <br />
                            <span style={{ color: '#ababab', fontSize: '16px' }}>{subTitle}</span>
                            {children}
                        </>
                }
            </strong>
        </Box>
    )
}

export default NotFound
