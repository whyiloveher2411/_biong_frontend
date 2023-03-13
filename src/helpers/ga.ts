import { delayUntil } from "./script";

export function gaEventPageView() {
    delayUntil(() => (window.gtag && document.title && document.title !== '...') ? true : false, () => {
        window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
        });
    });
}

export function gaSetUser(id: ID) {
    delayUntil(() => window.gtag ? true : false, () => {
        window.gtag('set', {
            'user_id': id
        });
    });
}

export function gaEvent(category: string, label: string, value: string) {
    if (window.gtag) {
        window.gtag('event', 'click', {
            'event_category': category,
            'event_label': label,
            'value': value,
        });
    }
}