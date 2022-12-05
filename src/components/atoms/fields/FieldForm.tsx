import Hook from 'components/function/Hook';
import useValidator from 'hook/useValidator';
import React from 'react';
import FormContext, { FormContextProps } from './FornContext';
import { FieldFormProps } from './type';

function FieldForm(props: FieldFormProps) {

    const validator = useValidator();

    //@ts-ignore
    const formContext = React.useContext<FormContextProps>(FormContext);

    const [propsState, setPropsState] = React.useState<FieldFormProps>({
        ...props,
        // post: props.post ? props.post : formContext.post,
        post: Object.keys(formContext.post).length ? formContext.post : props.post ? props.post : {},
        onReview: (value?: ANY, key?: null | string | JsonFormat | { [key: string]: ANY }) => {
            if (typeof key === 'string' && formContext.onReview) {
                formContext.onReview(value, key);
            }
            if (props.onReview) {
                props.onReview(value, key);
            }
        }
    });

    const [first, setFirst] = React.useState(true);

    React.useEffect(() => {
        if (formContext.isBindData) {
            setPropsState(prev => ({
                ...prev,
                post: formContext.post,
            }));
        }
    }, [formContext.post]);

    React.useLayoutEffect(() => {

        if (propsState.config.rules) {
            setPropsState(prev => ({
                ...prev,
                config: {
                    ...prev.config,
                    note: formContext.message[propsState.name]?.content ?? ' ',
                    inputProps: {
                        ...prev.config.inputProps,
                        error: formContext.message[propsState.name] ? true : false,
                    }
                }
            }));
        }

    }, [formContext.message[propsState.name]])

    React.useLayoutEffect(() => {
        (async () => {
            if (propsState.config.rules && !formContext.post.__isLoadFirst) {

                if (first) {
                    propsState.config.noteTemp = propsState.config.note ? propsState.config.note : ' ';
                }

                if (propsState.config.preValidator || !first || formContext.rules?.[props.name]?.preValidate) {
                    const validate = await validator.run(formContext.post[props.name], {
                        title: propsState.config.rules.title ?? String(propsState.config.title),
                        rules: propsState.config.rules
                    }, formContext.post);
                    propsState.config.note = validate.error ? validate.note : propsState.config.noteTemp;

                    propsState.config.inputProps = {
                        ...propsState.config.inputProps,
                        error: validate.error,
                    };

                    setPropsState({ ...propsState, post: formContext.post });
                } else {
                    formContext.setRules(prev => ({
                        ...prev,
                        [props.name]: {
                            title: propsState.config.rules?.title ?? (typeof propsState.config.title === 'string' ? propsState.config.title : ''),
                            rules: propsState.config.rules ?? {},
                        }
                    }));
                    propsState.config.note = propsState.config.noteTemp;

                    propsState.config.inputProps = {
                        ...propsState.config.inputProps,
                        onChange: (e: { target: { value: ANY } }) => {
                            // debounce( () => {
                            // alert(2);
                            formContext.onReview(e.target.value, propsState.name);
                            // },1000);
                        }
                    };
                    setPropsState({ ...propsState, post: formContext.post });

                }

                setFirst(false);
            }
        })()
    }, [
        formContext.post?.[propsState.name], formContext.rules?.[props.name]?.preValidate
    ]);

    if (propsState.config.customViewForm) {
        return <Hook hook={propsState.config.customViewForm} fieldtype={"form"} {...propsState} />
    }
    //eslint-disable-next-line
    let resolved = require(`./${propsState.component}/Form`).default;
    return React.createElement(resolved, { ...propsState, fieldtype: "form" });
}

export default FieldForm
