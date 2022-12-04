import { useSelector } from 'react-redux';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IconFormat } from 'components/atoms/Icon';
import { RootState } from 'store/configureStore';


const initialState: SettingValue = {
    times: 0,
}

export const slice = createSlice({
    name: 'viewMode',
    initialState: initialState,
    reducers: {
        updateSetting: (state: SettingValue, action: PayloadAction<SettingValue | undefined>) => {
            return { ...state, ...action.payload };
        },
        changeSetting: (state, action) => {
            return { ...state, ...action.payload };
        },
        upTimes: (state) => {
            return { ...state, times: state.times ? state.times + 1 : 1 };
        },
    },
});

export const { changeSetting, upTimes, updateSetting } = slice.actions;

export default slice.reducer;

export interface SettingValue {
    contact?: {
        social?: Array<{
            title: string,
            icon: IconFormat,
            link: string
        }>,
        email: string,
        office_address: string,
        phone_number: string,
    }

    times: number,
}

export function useSetting() {
    return useSelector((state: RootState) => state.settings);
}