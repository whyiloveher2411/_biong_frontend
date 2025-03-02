import { LazyLoadImage } from 'react-lazy-load-image-component';
// @mui
import { Box, SxProps, Theme } from '@mui/material';
// ----------------------------------------------------------------------
export default function ImageLazyLoading({ ratio, disabledEffect = false, effect = 'blur', sx, className, placeholderSrc = "/images/img_placeholder.svg", ...other }: {
    [key: string]: ANY,
    ratio?: '4/3' | '3/4' | '6/4' | '4/6' | '16/9' | '9/16' | '21/9' | '40/21' | '9/21' | '1/1',
    disabledEffect?: boolean,
    effect?: string,
    sx?: SxProps<Theme>,
    src: string,
    placeholderSrc?: string,
    className?: string,
}) {
    if (ratio) {
        return (
            <Box
                component="span"
                className={className}
                sx={[{
                    width: 1,
                    lineHeight: 0,
                    display: 'block',
                    overflow: 'hidden',
                    position: 'relative',
                    pt: getRatio(ratio),
                    '& .wrapper': {
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        lineHeight: 0,
                        position: 'absolute',
                        backgroundSize: 'cover !important',
                    },
                },
                (theme) => ({
                    ...(typeof sx === 'function' ? sx(theme) : sx ?? {}),
                })
                ]}
            >
                <LazyLoadImage
                    wrapperClassName="wrapper"
                    effect={disabledEffect ? undefined : effect}
                    placeholderSrc={placeholderSrc}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', ...sx }}
                    {...other}
                />
            </Box>
        );
    }

    return (
        <Box
            component="span"
            className={className}
            sx={[
                {
                    display: 'block',
                    overflow: 'hidden',
                    '& .wrapper': { width: 1, height: 1, backgroundSize: 'cover !important' },
                },
                (theme) => ({
                    ...(typeof sx === 'function' ? sx(theme) : sx ?? {}),
                })
            ]}
        >
            <LazyLoadImage
                wrapperClassName="wrapper"
                effect={disabledEffect ? undefined : effect}
                placeholderSrc={placeholderSrc}
                style={{ width: '100%', height: '100%', objectFit: 'cover', ...sx }}
                {...other}
            />
        </Box>
    );
}

// ----------------------------------------------------------------------

function getRatio(ratio = '1/1') {
    return {
        '4/3': 'calc(100% / 4 * 3)',
        '3/4': 'calc(100% / 3 * 4)',
        '6/4': 'calc(100% / 6 * 4)',
        '4/6': 'calc(100% / 4 * 6)',
        '16/9': 'calc(100% / 16 * 9)',
        '9/16': 'calc(100% / 9 * 16)',
        '21/9': 'calc(100% / 21 * 9)',
        '9/21': 'calc(100% / 9 * 21)',
        '40/21': 'calc(100% / 40 * 21)',
        '1/1': '100%',
    }[ratio];
}
