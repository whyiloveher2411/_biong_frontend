import { ValidatorProps } from "hook/useValidator";
import { createContext } from "react";

const FormContext = createContext({
    post: {},
    onReview: (value: ANY, name: string) => {
        //
    },
    rules: {},
    setRules: (value: ANY) => {
        //
    },
    message: {},
});

export default FormContext;


export interface FormContextProps {
    post: {
        [key: string]: ANY
    },
    onReview: (value: ANY, name: string | object) => void,
    rules: {
        [key: string]: ValidatorProps;
    },
    setRules: React.Dispatch<React.SetStateAction<{
        [key: string]: ValidatorProps;
    }>>,
    message: {
        [key: string]: {
            content: string | null,
        }
    },
}