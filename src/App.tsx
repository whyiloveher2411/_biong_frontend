import React from 'react';
import ThemeProvider from './theme';
import ScrollToTop from 'components/atoms/ScrollToTop';
import NotistackProvider from 'provider/NotistackProvider';
import Router from 'routes';
import 'moment/locale/vi'
import './App.css';
import moment from 'moment';

moment.locale('vi')

function App() {
    return (
        <ThemeProvider>
            <NotistackProvider>
                <ScrollToTop />
                <Router />
            </NotistackProvider>
        </ThemeProvider>
    )
}

export default App;
