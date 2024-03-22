import type { } from '@mui/lab/themeAugmentation';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, StyledEngineProvider, Theme, createTheme } from '@mui/material/styles';
import { getThemeMode } from 'helpers/theme';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';
import { changeMode } from 'store/theme/theme.reducers';
import { useUser } from 'store/user/user.reducers';

interface Props {
    children: React.ReactNode
}

function ThemeProvider({ children }: Props) {
    const theme = useSelector((state: RootState) => state.theme);

    const user = useUser();

    const dispatch = useDispatch();

    const themeStore: Theme = createTheme({
        ...theme,
        typography: {
            ...theme.typography,
            "fontFamily": `"main","Helvetica","Arial",sans-serif`,
        }
    });

    React.useEffect(() => {
        let themeMode = getThemeMode( user.theme + '' );

        if ((themeMode === 'dark' || themeMode === 'light') && themeMode !== theme.palette.mode) {
            dispatch(changeMode(themeMode));
        }
    }, [user.theme]);

    return (
        <StyledEngineProvider injectFirst>
            <MUIThemeProvider theme={themeStore}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </StyledEngineProvider>
    )
}

export default ThemeProvider
