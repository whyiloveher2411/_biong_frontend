import { CssBaseline } from '@mui/material';
import { createTheme, StyledEngineProvider, ThemeProvider as MUIThemeProvider, Theme } from '@mui/material/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';
import type { } from '@mui/lab/themeAugmentation';
import { UserState, useUser } from 'store/user/user.reducers';
import { changeMode } from 'store/theme/theme.reducers';

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
        if (user._state === UserState.identify) {

            let themeMode = user.theme;

            if (themeMode === 'auto') {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    themeMode = 'dark';
                } else {
                    themeMode = 'light';
                }
            }

            if ((themeMode === 'dark' || themeMode === 'light') && themeMode !== theme.palette.mode) {
                dispatch(changeMode(themeMode));
            }
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
