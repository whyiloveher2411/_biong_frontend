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


console.log("%cBạn đang tìm gì đó?", "font-size:56px;padding: 5px;  border: 1px dashed white; font-weight: 800; text-transform: uppercase;background: rgb(131,58,180);background: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%);text-shadow: 2px 2px black; color: #ece2ca;");

console.log('%cNếu bạn đang có các vấn đề gì trong quá trình sử dụng, hãy liên hệ với chúng tôi ngay tại đây ' + window.location.origin + '/contact-us', 'font-size:40px;padding: 5px; border: 1px dashed white;  font-weight: 400; background-image: radial-gradient( circle 1192px at 21.5% 49.5%,  rgba(91,21,55,1) 0.1%, rgba(0,0,0,1) 100.2% );text-shadow: 2px 2px black; color: #ece2ca;');