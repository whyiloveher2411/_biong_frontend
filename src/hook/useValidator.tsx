import { FormData } from "components/atoms/fields/FormWrapper";
import { __ } from "helpers/i18n";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useValidator() {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRun = async (value: any, rules: ValidatorProps, post: FormData): Promise<ValidatorResult> => {
        if (rules.rules.require && !value) {
            return {
                error: true,
                note: __('{{fieldsName}} is require', {
                    fieldsName: rules.title
                }),
            };
        }

        if (rules.rules.length !== undefined) {

            if (value && String(value).length !== (rules.rules.length ?? 0)) {
                return {
                    error: true,
                    note: __('{{fieldsName}} must be {{length}} characters', {
                        fieldsName: rules.title,
                        length: rules.rules.length ?? '0',
                    }),
                };
            }

        }

        if (rules.rules.minLength !== undefined) {

            if (value && String(value).length < (rules.rules.minLength ?? 0)) {
                return {
                    error: true,
                    note: __('{{fieldsName}} minimum length is {{minLength}}', {
                        fieldsName: rules.title,
                        minLength: rules.rules.minLength ?? '0',
                    }),
                };
            }

        }

        if (rules.rules.maxLength) {

            if (value && String(value).length > (rules.rules.maxLength ?? 0)) {

                return {
                    error: true,
                    note: __('{{fieldsName}} maximum length is {{maxLength}}', {
                        fieldsName: rules.title,
                        maxLength: rules.rules.maxLength ?? '0',
                    }),
                };
            }

        }

        if (rules.rules.isEmail) {
            //
            if (value && !String(value).toLowerCase().match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {

                return {
                    error: true,
                    note: __('Invalid email format'),
                };
            }
        }

        if (rules.rules.isPhoneNumber) {

            if (value) {
                let regex = /^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/im;

                if (!value.match(regex)) {
                    return {
                        error: true,
                        note: __('Invalid phone number'),
                    };
                }
            }
        }

        if (rules.rules.requireNumber) {
            if (value) {

                if (String(value).replace(/[^0-9]/g, '').length < rules.rules.requireNumber) {
                    return {
                        error: true,
                        note: __('Require at least {{count}} number', {
                            count: rules.rules.requireNumber
                        }),
                    };
                }
            }
        }

        if (rules.rules.requireLowercase) {
            if (value) {

                if (String(value).replace(/[^a-z]/g, '').length < rules.rules.requireLowercase) {
                    return {
                        error: true,
                        note: __('Require at least {{count}} lowercase', {
                            count: rules.rules.requireLowercase
                        }),
                    };
                }
            }
        }

        if (rules.rules.requireUppercase) {
            if (value) {

                if (String(value).replace(/[^A-Z]/g, '').length < rules.rules.requireUppercase) {
                    return {
                        error: true,
                        note: __('Require at least {{count}} UPPERCASE', {
                            count: rules.rules.requireUppercase
                        }),
                    };
                }
            }
        }

        if (rules.rules.requireNonAlphanumericCharacters) {
            if (value) {

                if (String(value).replace(/[a-zA-Z0-9]*/g, '').length < rules.rules.requireNonAlphanumericCharacters) {
                    return {
                        error: true,
                        note: __('Require at least {{count}} Non-alphanumeric characters', {
                            count: rules.rules.requireNonAlphanumericCharacters
                        }),
                    };
                }
            }
        }

        if (rules.rules.equal) {
            if (value) {
                if (rules.rules.equal.type === 'field') {
                    if (value !== post[rules.rules.equal.value]) {
                        return {
                            error: true,
                            note: rules.rules.equal.message,
                        };
                    }
                } else if (rules.rules.equal.type === 'value') {
                    if (value !== rules.rules.equal.value) {
                        return {
                            error: true,
                            note: rules.rules.equal.message,
                        };
                    }
                }
            }
        }

        if (rules.rules.custom) {
            const result = await rules.rules.custom(post);

            if (result && result.error) {
                return result;
            }
        }


        return {
            error: false,
            note: '',
        };
    }

    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        run: async (value: any, rules: ValidatorProps, post: FormData): Promise<ValidatorResult> => {
            return await handleRun(value, rules, post);
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validate: async function (post: { [key: string]: ANY }, rules: { [key: string]: ValidatorProps }, ...keys: string[]): Promise<{ [key: string]: ValidatorResult }> {

            const results: { [key: string]: ValidatorResult } = {};

            if (post !== undefined && rules !== undefined) {

                if (keys.length < 1) {
                    keys = Object.keys(rules);
                }

                keys.forEach(async (key) => {
                    const result = await handleRun(post[key], rules[key], post);

                    if (result.error) {
                        results[key] = result;
                    }
                })
            }

            return results;
        },
    };
}

export interface ValidatorProps {
    title: string,
    preValidate?: boolean,
    rules: InputRule
}

export interface InputRule {
    require?: true,
    length?: number,
    minLength?: number,
    maxLength?: number,
    isEmail?: boolean,
    isPhoneNumber?: boolean,
    requireLowercase?: number,
    requireUppercase?: number,
    requireNumber?: number,
    requireNonAlphanumericCharacters?: number,
    custom?: (post: FormData) => Promise<{
        error: boolean,
        note: string,
    } | void | null>,
    equal?: {
        type: 'field' | 'value',
        value: string,
        message: string,
    }
}

export interface ValidatorResult {
    error: boolean,
    note: string | null,
}