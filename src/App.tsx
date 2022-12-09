import ScrollToTop from 'components/atoms/ScrollToTop';
import WebBrowser from 'components/atoms/WebBrowser';
import moment from 'moment';
import 'moment/locale/vi';
import NotistackProvider from 'provider/NotistackProvider';
import Router from 'routes';
import './App.css';
import './helpers/customFunction';
import ThemeProvider from './theme';

moment.locale('vi')

function App() {
    return (
        <WebBrowser>
            <ThemeProvider>
                <NotistackProvider>
                    <ScrollToTop />
                    <Router />
                </NotistackProvider>
            </ThemeProvider>
        </WebBrowser>
    )
}

export default App;
