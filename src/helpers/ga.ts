export function gaEventPageView(time = 1000) {
    setTimeout(() => {
        window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
        });
    }, time);
}