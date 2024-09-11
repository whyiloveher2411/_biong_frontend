import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import languageReducer from './language/language.reducers';
import pluginsReducer from './plugins/plugins.reducers';
import rootSaga from './sagas';
import themeReducer from './theme/theme.reducers';
import userReducer from './user/user.reducers';
import shoppingCartReducer from './shoppingCart/shoppingCart.reducers';
import settingsReducer from './setting/settings.reducers';
import layoutReducer from './layout/layout.reducers';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        user: userReducer,
        plugins: pluginsReducer,
        language: languageReducer,
        theme: themeReducer,
        shoppingCart: shoppingCartReducer,
        settings: settingsReducer,
        layout: layoutReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(sagaMiddleware),
    devTools: false
});

sagaMiddleware.run(rootSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;