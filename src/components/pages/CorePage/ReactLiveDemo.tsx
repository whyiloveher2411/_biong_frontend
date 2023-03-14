import React from 'react'
import { transform as babelTransform } from "@babel/standalone";
import ReactDOM from 'react-dom'
import { delayUntil } from 'helpers/script';
import { createRoot } from 'react-dom/client';


// default code
const codeDefault = `
function App() {

const [dem, setDem] = React.useState(0);
  return <div>
    <h1>Hello, World!</h1>
    <p>This is my first React app.</p>
    <button onClick={() => setDem(prev => ++prev)}>{dem}</button>
  </div>
}

const container = window.document.querySelector('#root');
const root = createRoot(container).render(<App />);
`;

function ReactLive() {


    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    const [codeIframe, setcodeIframe] = React.useState<string | null | undefined>('');

    React.useEffect(() => {
        const tcode = babelTransform(codeDefault, { presets: ["es2015", "react"] }).code;
        setcodeIframe(tcode);
    }, []);

    React.useEffect(() => {
        if (codeIframe) {
            delayUntil(() => iframeRef.current?.contentWindow?.document.getElementById('root') ? true : false, () => {
                ((iframeRef.current as HTMLIFrameElement).contentWindow as Window).require = require;
                ((iframeRef.current as HTMLIFrameElement).contentWindow as Window).ReactDOM = ReactDOM;
                ((iframeRef.current as HTMLIFrameElement).contentWindow as Window).React = React;
                ((iframeRef.current as HTMLIFrameElement).contentWindow as Window).createRoot = createRoot;
                // iframeRef.current?.contentWindow.require

                const divElement = document.createElement('div');
                divElement.id = 'root';
                iframeRef.current?.contentWindow?.document.body.appendChild(divElement);

                const script = document.createElement('script');
                script.textContent = codeIframe + '';
                iframeRef.current?.contentWindow?.document.body.appendChild(script);
            });
        }
    }, [codeIframe]);


    return (<>
        <div>ReactLive</div>
        <iframe
            ref={iframeRef}
            src="/live_react.html"

        />
    </>)
}

export default ReactLive



