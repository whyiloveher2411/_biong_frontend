
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
    },
});

export const { changeSetting } = slice.actions;

export default slice.reducer;