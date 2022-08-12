// @mui
import { Breakpoint, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------

export default function useResponsive(query: string, key: number | Breakpoint, start?: number | Breakpoint, end?: number | Breakpoint) {
    const theme = useTheme();

    if (query === 'up') {
        const mediaUp = useMediaQuery(theme.breakpoints.up(key));
        return mediaUp;
    }

    if (query === 'down') {
        const mediaDown = useMediaQuery(theme.breakpoints.down(key));
        return mediaDown;
    }

    if (query === 'between' && start && end) {
        const mediaBetween = useMediaQuery(theme.breakpoints.between(start, end));
        return mediaBetween;
    }

    if (query === 'only') {
        const mediaOnly = useMediaQuery(theme.breakpoints.only(key as Breakpoint));
        return mediaOnly;
    }
    return null;
}
