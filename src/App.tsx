import ScrollToTop from 'components/atoms/ScrollToTop';
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
        <ThemeProvider>
            <NotistackProvider>
                <ScrollToTop />
                <Router />
            </NotistackProvider>
        </ThemeProvider>
    )
}

export default App;
