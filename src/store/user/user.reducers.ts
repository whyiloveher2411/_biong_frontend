import { createSlice } from '@reduxjs/toolkit';
import { ImageProps } from 'components/atoms/Avatar';
import { deleteCookie } from 'helpers/cookie';
import { numberWithSeparator } from 'helpers/number';
import { clearAllCacheWindow } from 'hook/cacheWindow';
import { useDispatch, useSelector } from 'react-redux';
import accountService from 'services/accountService';
import { NotificationProps } from 'services/courseService';
import { RootState } from 'store/configureStore';

export enum UserState {
    'unknown', 'identify', 'nobody'
}

export interface UserProps {
    // [key: string]: ANY,
    _state: UserState.unknown | UserState.identify | UserState.nobody,
    id: string | number,
    slug: string,
    account_status?: 'actived' | 'locked' | 'blocked',
    email: string,
    website?: string,
    accessToken?: string,
    job_title?: string,
    full_name: string,
    avatar: ImageProps,
    banner?: ImageProps,
    role: string,
    permission: string,
    birthday: string,
    is_private_account?: number,
    first_change_password?: boolean,
    active_course_sharing?: number,
    is_verified?: number,
    is_teacher?: number,
    notification_unread: number,
    notification_important?: NotificationProps[],
    auto_next_lesson?: number,
    show_chapter_video?: number,
    theme_learning?: 'main_right' | 'main_left',
    theme_learning_tab?: 'tab' | 'drawer',
    theme?: 'light' | 'dark' | 'auto',
    heart?: number,
    heart_fill_time_next?: string,
    heart_fill_time_next_neo: number,
    bit_point?: number,
    max_heart?: number,
    getMaxHeart: () => number,
    getHeart: () => number,
    getBit: () => number,
    getBitToString: () => string,
    getThemeLearning: () => 'main_right' | 'main_left',
    getThemeLearningTab: () => 'tab' | 'drawer'
}

interface ActionProps {
    payload: number | string | object | undefined
}

const initialState: UserProps = {
    _state: UserState.unknown,
    id: 0,
    slug: '',
    email: '',
    full_name: '',
    role: '',
    permission: '',
    first_change_password: false,
    birthday: '',
    theme: (window._theme_mode as UserProps['theme']),
    avatar: {
        type_link: '',
        link: '',
    },
    notification_unread: 0,
    heart_fill_time_next_neo: parseInt(((new Date()).getTime() / 1000).toFixed()),
    getHeart: function () {
        return this.heart ?? 0;
    },
    getMaxHeart: function () {
        return this.max_heart ?? 3;
    },
    getBit: function () {
        return this.bit_point ?? 0;
    },
    getBitToString: function () {
        return numberWithSeparator(this.bit_point ?? 0);
    },
    getThemeLearning: function () {
        return this.theme_learning === 'main_left' ? 'main_left' : 'main_right';
    },
    theme_learning_tab: 'tab',
    getThemeLearningTab: function () {
        return this.theme_learning_tab === 'drawer' ? 'drawer' : 'tab';
    }
}

export const slice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        updateAccessToken: (state: UserProps, action: ActionProps): UserProps => {
            if (typeof action.payload === 'string') {
                setAccessToken(action.payload);
                return { ...state, accessToken: action.payload, _state: UserState.unknown };
            }
            return state;
        },
        login: (state: UserProps, action: ActionProps): UserProps => {
            if (typeof action.payload === 'object') {
                return { ...state, ...action.payload, _state: UserState.identify };
            }
            return state;
        },
        refreshAccessToken: (state: UserProps, action: ActionProps): UserProps => {
            if (typeof action.payload === 'string') {
                setAccessToken(action.payload);
                return { ...state, accessToken: action.payload };
            }

            return state;
        },
        updateInfo: (state: UserProps, action: ActionProps): UserProps => {
            if (typeof action.payload === 'object') {
                const stateResult = { ...state, ...action.payload };
                window.___AutoNextLesson = Boolean(stateResult.auto_next_lesson);
                return stateResult;
            }

            return state;
        },
        updateHeart: (state: UserProps, action: {
            payload: {
                heart?: number,
                heart_fill_time_next?: string,
            }
        }): UserProps => {
            if (typeof action.payload === 'object') {
                const stateResult = {
                    ...state,
                    ...action.payload,
                    heart_fill_time_next_neo: parseInt(((new Date()).getTime() / 1000).toFixed()),
                };
                return stateResult;
            }
            return state;
        },
        updateBitPoint: (state: UserProps, action: ActionProps): UserProps => {
            if (typeof action.payload === 'number') {
                const stateResult = {
                    ...state,
                    bit_point: action.payload,
                };
                return stateResult;
            }
            return state;
        },
        forceUpdateInfo: (state: UserProps): UserProps => {
            return { ...state };
        },
        logout: (): UserProps => {
            clearAccessToken();
            deleteCookie('g-one-tap-close');
            clearAllCacheWindow();
            return { ...initialState, _state: UserState.nobody };
        },
        clearToken: (): UserProps => {
            clearAccessToken();
            return { ...initialState, _state: UserState.nobody };
        },
        refreshScreen: (state: UserProps): UserProps => {
            return { ...state };
        },

    },
});


export function getAccessToken() {

    if (localStorage.getItem('access_token')) {
        return localStorage.getItem('access_token');
    }

    return null;
}

export function clearAccessToken() {
    localStorage.removeItem('access_token');
}

export function setAccessToken(access_token: string) {
    localStorage.setItem('access_token', access_token);
}

export const { updateAccessToken, refreshAccessToken, login, updateBitPoint, updateInfo, updateHeart, forceUpdateInfo, logout, clearToken, refreshScreen } = slice.actions;

export default slice.reducer;


export const useUser = (): UserProps => useSelector((state: RootState) => state.user);


export const useUpdateBitPoint = () => {

    const dispath = useDispatch();

    return (heart: number) => {
        dispath(updateBitPoint(heart));
    }
}

export const useUpdateThemeLearning = () => {

    const dispath = useDispatch();

    return (theme_learning: 'main_right' | 'main_left') => {
        dispath(updateInfo({
            theme_learning: theme_learning,
        }));

        accountService.me.update.updateThemeLearning(theme_learning);
    }
}

export const useUpdateThemeLearningTab = () => {
    const dispath = useDispatch();

    return (theme_learning_tab: 'drawer' | 'tab') => {
        dispath(updateInfo({
            theme_learning_tab: theme_learning_tab,
        }));

        accountService.me.update.updateThemeLearningTab(theme_learning_tab);

    }
}