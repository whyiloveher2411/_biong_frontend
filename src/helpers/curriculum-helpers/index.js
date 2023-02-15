import { strip } from './strip.js';
/**
 * Removes every HTML-comment from the string that is provided
 * @param {String} str a HTML-string where the comments need to be removed of
 * @returns {String}
 */
export function removeHtmlComments(str) {
    return str.replace(/<!--[\s\S]*?(-->|$)/g, "");
}
/**
 * Removes every CSS-comment from the string that is provided
 * @param {String} str a CSS-string where the comments need to be removed of
 * @returns {String}
 */
export function removeCssComments(str) {
    return str.replace(/\/\*[\s\S]+?\*\//g, "");
}
/**
 * Removes every JS-comment from the string that is provided
 * @param {String} codeStr a JS-string where the comments need to be removed of
 * @returns {String}
 */
export function removeJSComments(codeStr) {
    // TODO: publish type declarations and re-enable eslint
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return strip(codeStr);
    }
    catch (err) {
        return codeStr;
    }
}
/**
 * Removes every white-space from the string that is provided
 * @param {String} str a String where the white spaces need to be removed of
 * @returns {String}
 */
export function removeWhiteSpace(str) {
    return str.replace(/\s/g, '');
}
/**
 * This function helps to escape RegEx patterns
 * @param {String} exp
 * @returns {String}
 */
export function escapeRegExp(exp) {
    return exp.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/**
 * This helper checks if a function/method is called with no arguments
 * @param {String} calledFuncName
 * @param {String} callingCode
 * @returns {Boolean}
 */
export function isCalledWithNoArgs(calledFuncName, callingCode) {
    var _a;
    const noCommentsCallingCode = strip(callingCode);
    const funcExp = `^\\s*?${escapeRegExp(calledFuncName)}\\(\\s*?\\)`;
    const matches = (_a = new RegExp(funcExp, "gm").exec(noCommentsCallingCode)) !== null && _a !== void 0 ? _a : [];
    return Boolean(matches.length);
}
const getIsDeclaredAfter = (styleRule) => (selector) => {
    var _a, _b, _c, _d;
    const cssStyleRules = (_b = Array.from(((_a = styleRule.parentStyleSheet) === null || _a === void 0 ? void 0 : _a.cssRules) || [])) === null || _b === void 0 ? void 0 : _b.filter(ele => ele.type === CSSRule.STYLE_RULE);
    const previousStyleRule = cssStyleRules.find(ele => (ele === null || ele === void 0 ? void 0 : ele.selectorText) === selector);
    if (!previousStyleRule)
        return false;
    const currPosition = Array.from(((_c = styleRule.parentStyleSheet) === null || _c === void 0 ? void 0 : _c.cssRules) || []).indexOf(styleRule);
    const prevPosition = Array.from(((_d = previousStyleRule === null || previousStyleRule === void 0 ? void 0 : previousStyleRule.parentStyleSheet) === null || _d === void 0 ? void 0 : _d.cssRules) || []).indexOf(previousStyleRule);
    return currPosition > prevPosition;
};
export class CSSHelp {
    constructor(doc) {
        this.doc = doc;
    }
    _getStyleRules() {
        const styleSheet = this.getStyleSheet();
        return this.styleSheetToCssRulesArray(styleSheet).filter(ele => ele.type === CSSRule.STYLE_RULE);
    }
    getStyleDeclarations(selector) {
        var _a;
        return (_a = this._getStyleRules()) === null || _a === void 0 ? void 0 : _a.filter(ele => (ele === null || ele === void 0 ? void 0 : ele.selectorText) === selector).map(x => x.style);
    }
    getStyle(selector) {
        var _a;
        const style = (_a = this._getStyleRules().find(ele => (ele === null || ele === void 0 ? void 0 : ele.selectorText) === selector)) === null || _a === void 0 ? void 0 : _a.style;
        if (!style)
            return null;
        style.getPropVal = (prop, strip = false) => {
            return strip
                ? style.getPropertyValue(prop).replace(/\s+/g, '')
                : style.getPropertyValue(prop);
        };
        return style;
    }
    getStyleRule(selector) {
        var _a;
        const styleRule = (_a = this._getStyleRules()) === null || _a === void 0 ? void 0 : _a.find(ele => (ele === null || ele === void 0 ? void 0 : ele.selectorText) === selector);
        if (styleRule) {
            return Object.assign(Object.assign({}, styleRule), { isDeclaredAfter: (selector) => getIsDeclaredAfter(styleRule)(selector) });
        }
        else {
            return null;
        }
    }
    getCSSRules(element) {
        const styleSheet = this.getStyleSheet();
        const cssRules = this.styleSheetToCssRulesArray(styleSheet);
        switch (element) {
            case 'media':
                return cssRules.filter(ele => ele.type === CSSRule.MEDIA_RULE);
            case 'fontface':
                return cssRules.filter(ele => ele.type === CSSRule.FONT_FACE_RULE);
            case 'import':
                return cssRules.filter(ele => ele.type === CSSRule.IMPORT_RULE);
            case 'keyframes':
                return cssRules.filter(ele => ele.type === CSSRule.KEYFRAMES_RULE);
            default:
                return cssRules;
        }
    }
    isPropertyUsed(property) {
        return this._getStyleRules().some(ele => { var _a; return (_a = ele.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(property); });
    }
    getRuleListsWithinMedia(mediaText) {
        const medias = this.getCSSRules('media');
        const cond = medias === null || medias === void 0 ? void 0 : medias.find(x => { var _a; return ((_a = x === null || x === void 0 ? void 0 : x.media) === null || _a === void 0 ? void 0 : _a.mediaText) === mediaText; });
        const cssRules = cond === null || cond === void 0 ? void 0 : cond.cssRules;
        return Array.from(cssRules || []);
    }
    getStyleSheet() {
        var _a, _b, _c, _d, _e;
        // TODO: Change selector to match exactly 'styles.css'
        const link = (_a = this.doc) === null || _a === void 0 ? void 0 : _a.querySelector("link[href*='styles']");
        // When using the styles.css tab, we add a 'fcc-injected-styles' class so we can target that. This allows users to add external scripts without them interfering
        const stylesDotCss = (_b = this.doc) === null || _b === void 0 ? void 0 : _b.querySelector('style.fcc-injected-styles');
        // For steps that use <style> tags, where they don't add the above class - most* browser extensions inject styles with class/media attributes, so it filters those
        const styleTag = (_c = this.doc) === null || _c === void 0 ? void 0 : _c.querySelector('style:not([class]):not([media])');
        if ((_e = (_d = link === null || link === void 0 ? void 0 : link.sheet) === null || _d === void 0 ? void 0 : _d.cssRules) === null || _e === void 0 ? void 0 : _e.length) {
            return link.sheet;
        }
        else if (stylesDotCss) {
            return stylesDotCss.sheet;
        }
        else if (styleTag) {
            return styleTag.sheet;
        }
        else {
            return null;
        }
    }
    styleSheetToCssRulesArray(styleSheet) {
        return Array.from((styleSheet === null || styleSheet === void 0 ? void 0 : styleSheet.cssRules) || []);
    }
}
//# sourceMappingURL=index.js.map