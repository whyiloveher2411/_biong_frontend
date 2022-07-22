import React from "react";

function useRules(props: useValidateFormProps): UseRulesResult {

    const handleValidate = () => {
        //
    };

    const resetValidate = () => {
        props.setState((prev) => {
            if (prev) {
                return { ...prev, rules: {} };
            }
            return null;
        });
    }

    return {
        post: props.post,
        rules: props.rules,
        validate: handleValidate,
        resetValidate: resetValidate,
    }
}

export default useRules

export interface useValidateFormProps {
    setState: (value: React.SetStateAction<UseRulesResult | null>) => void,
    rules: { [key: string]: RuleProps },
    post: { [key: string]: ANY },
}

export interface UseRulesResult {
    post: { [key: string]: ANY },
    rules: { [key: string]: RuleProps; },
    validate: () => void,
    resetValidate: () => void,
}

export interface RuleProps {
    require?: true,
    minLength?: number,
    maxLength?: number,
}