export function gaEventPageView() {
    if (window.gtag) {
        if (document.title && document.title !== '...') {
            window.gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
            });
        }
    }
}