import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();

    const firstRef = React.useRef(true);

    React.useEffect(() => {
        if (window.__disable_scroll) {
            window.__disable_scroll = false;
        } else {
            if (firstRef.current) {
                firstRef.current = false;
                return;
            }

            setTimeout(() => {
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                })
            }, 1);


            // const main = document.querySelector('#root');
            // if (main) {
            //     // main.scrollTo({ behavior: 'smooth', top: 0 });
            //     main.scrollTop = 0;
            // }
        }

    }, [pathname]);

    return null;
}

export default ScrollToTop

export function useTransferLinkDisableScroll() {

    const navigate = useNavigate();

    return (to: string) => {
        window.__disable_scroll = true;
        navigate(to);
    }

}
