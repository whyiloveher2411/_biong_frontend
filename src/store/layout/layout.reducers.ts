import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';

export const app_webview_name = 'app_webview'

export function isAppWebviewClient(): boolean {
    if (typeof window === 'undefined') return false;

    return localStorage.getItem(app_webview_name) === '1'
        || Boolean((window as Record<string, unknown>)[app_webview_name])
        || new URLSearchParams(window.location.search).get('app_webview') === '1';
}

interface LayoutState {
    headerVisible: boolean;
    footerVisible: boolean;
    isIframeOauth: boolean;
}

const isAppWebview = isAppWebviewClient();

const initialState: LayoutState = {
    headerVisible: !isAppWebview,
    footerVisible: !isAppWebview,
    isIframeOauth: false,
};

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        setHeaderVisible: (state, action: PayloadAction<boolean>) => {
            state.headerVisible = action.payload;
        },
        setFooterVisible: (state, action: PayloadAction<boolean>) => {
            state.footerVisible = action.payload;
        },
        setIsIframeOauth: (state, action: PayloadAction<boolean>) => {
            state.isIframeOauth = action.payload;
        },
    },
});

export const { setHeaderVisible, setFooterVisible, setIsIframeOauth } = layoutSlice.actions;

export default layoutSlice.reducer;

// Selector
export const selectLayoutState = (state: { layout: LayoutState }) => state.layout;


export const useLayoutHeaderFooter = (): LayoutState => useSelector((state: RootState) => state.layout);
