export function addClasses(classList: { [key: string]: boolean | undefined | null }): string {
    let classesResult = '';

    Object.keys(classList).forEach(key => {
        if (key && classList[key]) {
            classesResult += key + ' ';
        }
    });
    return classesResult;
}

export function cssMaxLine(line: number): {
    overflow: string,
    textOverflow: string,
    display: string,
    WebkitLineClamp: number,
    lineClamp: number,
    WebkitBoxOrient: string
} {
    return {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: line,
        lineClamp: line,
        WebkitBoxOrient: 'vertical'
    }
}

export function hoverCardEffect() {
    return {
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            borderColor: 'primary.main',
            '& .bookmark-button': {
                opacity: 1,
            },
        }
    }
}

export function makeid(length: number, group = 'all'): string {

    if (!window.ids) {
        window.ids = {};
    }

    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    if (window.ids[group + '_' + result]) {
        return makeid(length, group);
    }

    window.ids[group + '_' + result] = group;
    return group + '_' + result;
}

export function stringToHtml(str: string) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(str, 'text/html');
    return doc.body.firstElementChild;
}

export function isInViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}


