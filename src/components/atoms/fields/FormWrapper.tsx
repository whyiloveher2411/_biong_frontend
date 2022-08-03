import useValidator, { ValidatorProps, ValidatorResult } from 'hook/useValidator';
import React from 'react'
import FormContext from './FornContext';

interface FormWrapperProps {
    postDefault?: FormData,
    children: React.ReactNode,
    onFinish?: (post: FormData) => void,
    onFinishFailed?: () => void,
}

function FormWrapper({ postDefault, children, onFinish, onFinishFailed }: FormWrapperProps) {

    const [post, setPost] = React.useState<FormData>({});

    const [isSubmited, setIsSubmited] = React.useState(false);

    const [message, setMessage] = React.useState<{
        [key: string]: {
            content: string | null,
        }
    }>({});

    const [rules, setRules] = React.useState<{ [key: string]: ValidatorProps }>({});

    const validator = useValidator();

    const validateForm = (): {
        result: boolean,
        content: {
            [key: string]: ValidatorResult;
        }
    } => {
        const results = validator.validate(post, rules);

        if (Object.keys(results).length > 0) {
            return {
                result: false,
                content: results
            };
        }

        return {
            result: true,
            content: {}
        };
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validatorResult = validateForm();

        if (validatorResult.result) {
            onFinish ? onFinish(post) : null;
        } else {

            let messageTemp: {
                [key: string]: {
                    content: string | null,
                }
            } = {};

            for (let key in validatorResult.content) {
                messageTemp[key] = {
                    content: validatorResult.content[key].note,
                };
            }

            setMessage(messageTemp);

            setRules(prev => {

                for (let key in prev) {
                    prev[key].preValidate = true;
                }

                return { ...prev };
            });
            onFinishFailed ? onFinishFailed() : null;
        }

        setIsSubmited(true);
    }

    React.useEffect(() => {
        if (postDefault) {
            setPost({
                ...postDefault,
                __isLoadFirst: true,
            });
        }
    }, [postDefault]);

    React.useEffect(() => {

        if (isSubmited) {
            const validatorResult = validateForm();

            let messageTemp: {
                [key: string]: {
                    content: string | null,
                }
            } = {};

            for (let key in validatorResult.content) {
                messageTemp[key] = {
                    content: validatorResult.content[key].note,
                };
            }
            setMessage(messageTemp);
        }

    }, [post]);

    return (
        <form
            onSubmit={handleSubmit}
        >
            <FormContext.Provider
                value={{
                    post: post,
                    onReview: (value: ANY, name: string) => {
                        setPost(prev => ({
                            ...prev,
                            __isLoadFirst: false,
                            [name]: value
                        }));
                    },
                    rules: rules,
                    setRules: setRules,
                    message: message,
                    isBindData: true,
                }}
            >
                {
                    children
                }
            </FormContext.Provider>
        </form>
    )
}

export default FormWrapper

export interface FormData {
    [key: string]: ANY
}