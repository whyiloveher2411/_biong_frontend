import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from 'store/configureStore';

interface LayoutState {
    headerVisible: boolean;
    footerVisible: boolean;
    isIframeOauth: boolean;
}

const initialState: LayoutState = {
    headerVisible: true,
    footerVisible: true,
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
