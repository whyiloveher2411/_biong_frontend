export function toCamelCase(str: string): string {
    return str.replaceAll('_', '-').replace(/\b(\w)/g, function (match, capture) {
        return capture.toUpperCase();
    }).replace(/[^a-zA-Z0-9/ ]/g, '');
}

export function unCamelCase(str: string): string {
    return str.replace(/([A-Z])/g, ' $1')
        .replace(/^./, function (str) { return str.toUpperCase(); });
}

export function convertToSlug(text: string, stringReplace = '-') {
    text = text.toString().toLowerCase().trim();

    const sets = [
        { to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶἀ]' },
        { to: 'c', from: '[ÇĆĈČ]' },
        { to: 'd', from: '[ÐĎĐÞ]' },
        { to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]' },
        { to: 'g', from: '[ĜĞĢǴ]' },
        { to: 'h', from: '[ĤḦ]' },
        { to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]' },
        { to: 'j', from: '[Ĵ]' },
        { to: 'ij', from: '[Ĳ]' },
        { to: 'k', from: '[Ķ]' },
        { to: 'l', from: '[ĹĻĽŁ]' },
        { to: 'm', from: '[Ḿ]' },
        { to: 'n', from: '[ÑŃŅŇ]' },
        { to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]' },
        { to: 'oe', from: '[Œ]' },
        { to: 'p', from: '[ṕ]' },
        { to: 'r', from: '[ŔŖŘ]' },
        { to: 's', from: '[ßŚŜŞŠȘ]' },
        { to: 't', from: '[ŢŤ]' },
        { to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]' },
        { to: 'w', from: '[ẂŴẀẄ]' },
        { to: 'x', from: '[ẍ]' },
        { to: 'y', from: '[ÝŶŸỲỴỶỸ]' },
        { to: 'z', from: '[ŹŻŽ]' },
        { to: stringReplace, from: '[·/_,:;\']' }
    ];

    sets.forEach(set => {
        text = text.replace(new RegExp(set.from, 'gi'), set.to)
    });

    return text
        .replace(/\s+/g, stringReplace)    // Replace spaces with -
        .replace(/[^-a-z0-9а-я\u0370-\u03ff\u1f00-\u1fff]+/g, '') // Remove all non-word chars
        .replace(/--+/g, stringReplace)    // Replace multiple - with single -
        .replace(/^-+/, '')      // Trim - from start of text
        .replace(/-+$/, '')      // Trim - from end of text
}

export function randomString(string_length = 24, chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!@#$%^&*()_+<>?~') {
    let randomstring = '';
    for (let i = 0; i < string_length; i++) {
        let rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }

    return randomstring;
}


export function extractContent(html: string) {
    if (html) {
        return new DOMParser()
            .parseFromString(html, "text/html")
            .documentElement.textContent;
    }
    return '';
}

export function convertTimeStrToTimeInt(timeString?: string) {
    const timeArg = timeString?.split(':') ?? [0];
    let timeInt = 0;

    if (timeArg[1]) {
        let num1 = Number(timeArg[0]);
        let num2 = Number(timeArg[1]);

        timeInt = (!Number.isNaN(num1) ? num1 : 0) * 60 + (!Number.isNaN(num2) ? num2 : 0);
    }

    return timeInt;
}

export function formatTime(ms: number): string {
    const abs: number = Math.abs(ms);
    const sign: string = ms < 0 ? '-' : '';

    const minute: number = 60 * 1000;
    const hour: number = 60 * minute;
    const day: number = 24 * hour;

    function roundToTwoDecimal(num: number): string {
        const rounded = Number(num.toFixed(2));
        return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2);
    }

    if (abs < 1000) {
        return `${sign}${Math.round(abs)}ms`;
    } else if (abs < minute) {
        const seconds = abs / 1000;
        return `${sign}${roundToTwoDecimal(seconds)}s`;
    } else if (abs < hour) {
        const minutes = Math.floor(abs / minute);
        const seconds = (abs % minute) / 1000;
        return `${sign}${minutes}m ${roundToTwoDecimal(seconds)}s`;
    } else if (abs < day) {
        const hours = Math.floor(abs / hour);
        const minutes = (abs % hour) / minute;
        return `${sign}${hours}h ${roundToTwoDecimal(minutes)}m`;
    } else {
        const days = Math.floor(abs / day);
        const hours = (abs % day) / hour;
        return `${sign}${days}d ${roundToTwoDecimal(hours)}h`;
    }
}

export function secondsToTime(seconds: number) {
    seconds = Number(seconds);

    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);

    // Đảm bảo rằng phút và giây luôn có hai chữ số
    const mText = m < 10 ? '0' + m : m;
    const sText = s < 10 ? '0' + s : s;

    if (h > 0) {
        // Nếu số giờ lớn hơn 0, hiển thị cả giờ
        return h + ':' + mText + ':' + sText;
    } else {
        // Nếu số giờ bằng 0, chỉ hiển thị phút và giây
        return mText + ':' + sText;
    }
}


export function getStringBetweenString(strStart: string, strEnd: string, strTarget: string) {
    const firstChar = strTarget.indexOf(strStart) + strStart.length;
    const lastChar = strTarget.indexOf(strEnd);
    const newText = strTarget.substring(firstChar, lastChar);
    return newText;
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function trimCharacter(str: string, char: string) {
    if (str) {
        let regex = new RegExp("^" + escapeRegExp(char) + "|" + escapeRegExp(char) + "$", "g");
        return str.replace(regex, '');
    }

    return str;
}

export function levenshteinDistance(a: string, b: string) {
    const matrix = [];

    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Substitution
                    matrix[i][j - 1] + 1,     // Insertion
                    matrix[i - 1][j] + 1      // Deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

export function removeVietnameseAccents(str: string) {
    const accentsMap = [
        { base: 'a', letters: /[àáạảãâầấậẩẫăằắặẳẵ]/g },
        { base: 'e', letters: /[èéẹẻẽêềếệểễ]/g },
        { base: 'i', letters: /[ìíịỉĩ]/g },
        { base: 'o', letters: /[òóọỏõôồốộổỗơờớợởỡ]/g },
        { base: 'u', letters: /[ùúụủũưừứựửữ]/g },
        { base: 'y', letters: /[ỳýỵỷỹ]/g },
        { base: 'd', letters: /[đ]/g },
        { base: 'A', letters: /[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g },
        { base: 'E', letters: /[ÈÉẸẺẼÊỀẾỆỂỄ]/g },
        { base: 'I', letters: /[ÌÍỊỈĨ]/g },
        { base: 'O', letters: /[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g },
        { base: 'U', letters: /[ÙÚỤỦŨƯỪỨỰỬỮ]/g },
        { base: 'Y', letters: /[ỲÝỴỶỸ]/g },
        { base: 'D', letters: /[Đ]/g },
    ];

    for (let i = 0; i < accentsMap.length; i++) {
        str = str.replace(accentsMap[i].letters, accentsMap[i].base);
    }

    return str;
}

export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function replaceEscape(content: string) {
    return content.replace(/\\(n|r|t|b|f|v|'|"|\\)/g, (match, p1) => {
        switch (p1) {
            case 'n':
                return '\n';
            case 'r':
                return '\r';
            case 't':
                return '\t';
            case 'b':
                return '\b';
            case 'f':
                return '\f';
            case 'v':
                return '\v';
            case '\'':
                return '\'';
            case '"':
                return '"';
            case '\\':
                return '\\';
            default:
                return match;
        }
    });
}
export function trimBr(content: string) {
    return content.replace(/<br\s*\/?>/gi, '')
}