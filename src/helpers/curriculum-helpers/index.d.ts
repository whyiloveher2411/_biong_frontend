/**
 * Removes every HTML-comment from the string that is provided
 * @param {String} str a HTML-string where the comments need to be removed of
 * @returns {String}
 */
export declare function removeHtmlComments(str: string): string;
/**
 * Removes every CSS-comment from the string that is provided
 * @param {String} str a CSS-string where the comments need to be removed of
 * @returns {String}
 */
export declare function removeCssComments(str: string): string;
/**
 * Removes every JS-comment from the string that is provided
 * @param {String} codeStr a JS-string where the comments need to be removed of
 * @returns {String}
 */
export declare function removeJSComments(codeStr: string): string;
/**
 * Removes every white-space from the string that is provided
 * @param {String} str a String where the white spaces need to be removed of
 * @returns {String}
 */
export declare function removeWhiteSpace(str: string): string;
/**
 * This function helps to escape RegEx patterns
 * @param {String} exp
 * @returns {String}
 */
export declare function escapeRegExp(exp: string): string;
/**
 * This helper checks if a function/method is called with no arguments
 * @param {String} calledFuncName
 * @param {String} callingCode
 * @returns {Boolean}
 */
export declare function isCalledWithNoArgs(calledFuncName: string, callingCode: string): boolean;
export interface ExtendedStyleRule extends CSSStyleRule {
    isDeclaredAfter: (selector: string) => boolean;
}
interface ExtendedStyleDeclaration extends CSSStyleDeclaration {
    getPropVal: (prop: string, strip?: boolean) => string;
}
export declare class CSSHelp {
    doc: Document;
    constructor(doc: Document);
    private _getStyleRules;
    getStyleDeclarations(selector: string): CSSStyleDeclaration[];
    getStyle(selector: string): ExtendedStyleDeclaration | null;
    getStyleRule(selector: string): ExtendedStyleRule | null;
    getCSSRules(element?: string): CSSRule[];
    isPropertyUsed(property: string): boolean;
    getRuleListsWithinMedia(mediaText: string): CSSStyleRule[];
    getStyleSheet(): CSSStyleSheet | null;
    styleSheetToCssRulesArray(styleSheet: ReturnType<CSSHelp['getStyleSheet']>): CSSRule[];
}
export {};
