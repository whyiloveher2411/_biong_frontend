import { useSelector } from 'react-redux';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IconFormat } from 'components/atoms/Icon';
import { RootState } from 'store/configureStore';
import { CourseProps } from 'services/courseService';
import { ImageProps } from 'components/atoms/Avatar';


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
            link: string,
            color: string,
        }>,
        email: string,
        office_address: string,
        phone_number: string,
    }
    global?: {
        menus: Array<IGlobalMenu>,
        notification_name?: string,
        notification: Array<{
            type: 'course',
            title: string,
            content: string,
            course?: CourseProps,
            delete: number,
        }>,
        whats_news?: Array<{
            key: string,
            title: string,
            description: string,
            image: string,
            link: string,
            date_time: string,
        }>
    },
    times: number,
}

export function useSetting() {
    return useSelector((state: RootState) => state.settings);
}

export interface IGlobalMenu {
    type: 'simple' | 'group' | 'complex',
    title: string,
    link: string,
    color_menu: string,
    label?:{
        title: string,
        background_color: string,
        color: string,
    },
    sub_menus?: Array<{
        title: string,
        link: string,
        color_menu: string,
        logo?: ImageProps,
        label?: {
            title: string,
            background_color: string,
            color: string,
        }
    }>,
    sections?: Array<{
        title: string,
        description?: string,
        button_links?: Array<{
            title_button: string,
            link: string,
        }>,
        links: Array<{
            title: string,
            description?: string,
            link: string,
            logo?: ImageProps,
            label?: {
                title: string,
                background_color: string,
                color: string,
            }
        }>,
        more_links?: Array<{
            title: string,
            link: string,
        }>
    }>
}