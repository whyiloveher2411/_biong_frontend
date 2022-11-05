import { createSlice } from '@reduxjs/toolkit';
import { ImageProps } from 'components/atoms/Avatar';
import { deleteCookie } from 'helpers/cookie';
import { NotificationProps } from 'services/courseService';

export enum UserState {
    'unknown', 'identify', 'nobody'
}

export interface UserProps {
    [key: string]: ANY,
    _state: UserState.unknown | UserState.identify | UserState.nobody,
    id: string | number,
    slug: string,
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
    notification_unread: number,
    notification_important?: NotificationProps[],
    auto_next_lesson?: number,
}

interface ActionProps {
    payload: string | object | undefined
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
    avatar: {
        type_link: '',
        link: '',
    },
    notification_unread: 0,
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
                const stateResult = { ...state, ...action.payload, _state: UserState.identify };
                window.___AutoNextLesson = Boolean(stateResult.auto_next_lesson);
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

export const { updateAccessToken, refreshAccessToken, login, updateInfo, forceUpdateInfo, logout, clearToken, refreshScreen } = slice.actions;

export default slice.reducer;


