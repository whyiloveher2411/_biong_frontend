export function gaEventPageView() {
    if (window.gtag) {
        window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
        })
    }
}