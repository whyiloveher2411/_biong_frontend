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
    if( str ){
        let regex = new RegExp("^" + escapeRegExp(char) + "|" + escapeRegExp(char) + "$", "g");
        return str.replace(regex, '');
    }

    return str;
}