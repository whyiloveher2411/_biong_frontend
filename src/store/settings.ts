
import { createSlice } from '@reduxjs/toolkit';


const initialState: {
    [key: string]: ANY
} = {}

export const slice = createSlice({
    name: 'viewMode',
    initialState: initialState,
    reducers: {
        changeSetting: (state, action) => {
            return { ...state, ...action.payload };
        },
        upTimes: (state) => {
            return { ...state, times: state.times ? state.times + 1 : 1 };
        },
    },
});

export const { changeSetting, upTimes } = slice.actions;

export default slice.reducer;