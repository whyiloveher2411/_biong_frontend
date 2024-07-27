import useValidator, { ValidatorProps, ValidatorResult } from 'hook/useValidator';
import React from 'react'
import FormContext from './FornContext';

interface FormWrapperProps {
    postDefault?: FormData,
    children?: React.ReactNode,
    onFinish?: (post: FormData) => void,
    onFinishFailed?: () => void,
}

const FormWrapper = React.forwardRef(({ postDefault, children, onFinish, onFinishFailed }: FormWrapperProps, ref: React.ForwardedRef<{ submit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void> }>) => {

    const [post, setPost] = React.useState<FormData>({});

    const [isSubmited, setIsSubmited] = React.useState(false);

    const [message, setMessage] = React.useState<{
        [key: string]: {
            content: string | null,
        }
    }>({});

    const [rules, setRules] = React.useState<{ [key: string]: ValidatorProps }>({});

    const validator = useValidator();

    const validateForm = async (): Promise<{
        result: boolean,
        content: {
            [key: string]: ValidatorResult;
        }
    }> => {

        const results = await validator.validate(post, rules);

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

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {

        e?.preventDefault();

        const validatorResult = await validateForm();

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

    React.useImperativeHandle(ref, () => ({
        submit: handleSubmit
    }));

    React.useEffect(() => {
        if (postDefault) {
            setPost({
                ...postDefault,
                __isLoadFirst: true,
            });
        }
    }, [postDefault]);

    React.useEffect(() => {
        (async () => {
            if (isSubmited) {
                const validatorResult = await validateForm();

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
        })()
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
});

export default FormWrapper

export interface FormData {
    [key: string]: ANY
}

export const useFormWrapper = ({ postDefault, onFinish, onFinishFailed }: FormWrapperProps) => {

    const [post, setPost] = React.useState<FormData>({});

    const [isLoading, setIsLoading] = React.useState(false);

    const [isSubmited, setIsSubmited] = React.useState(false);

    const [message, setMessage] = React.useState<{
        [key: string]: {
            content: string | null,
        }
    }>({});

    const [rules, setRules] = React.useState<{ [key: string]: ValidatorProps }>({});

    const validator = useValidator();

    const validateForm = async (): Promise<{
        result: boolean,
        content: {
            [key: string]: ValidatorResult;
        }
    }> => {
        const results = await validator.validate(post, rules);

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

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {

        setIsLoading(true);

        if (e) e.preventDefault();

        const validatorResult = await validateForm();

        if (validatorResult.result) {
            onFinish ? await onFinish(post) : null;
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
        setIsLoading(false);
    }

    React.useEffect(() => {
        if (postDefault) {
            setPost({
                ...postDefault,
                // __isLoadFirst: true,
            });
        }
    }, []);

    React.useEffect(() => {

        (async () => {
            if (isSubmited) {
                const validatorResult = await validateForm();

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
        })()
    }, [post]);

    return {
        post: post,
        setPost: setPost,
        isLoading: isLoading,
        onSubmit: handleSubmit,
        renderFormWrapper: (children: React.ReactNode) => <FormContext.Provider
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
    }
}