import FormControl from 'components/atoms/FormControl';
import FormHelperText from 'components/atoms/FormHelperText';
import InputLabel from 'components/atoms/InputLabel';
import OutlinedInput from 'components/atoms/OutlinedInput';
import React from 'react';
import SpecialNotes from '../SpecialNotes';
import { FieldFormItemProps } from '../type';

export default function TextForm({ config, post, onReview, name }: FieldFormItemProps) {

    let valueInital = post && post[name] ? post[name] : '';

    const [render, setRender] = React.useState(0);

    const handleOnChange = (e: React.FormEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {

        // post[name] = e.currentTarget.value;

        // setRender(prev => prev + 1);

        onReview(e.currentTarget.value, name);
    };


    return (
        <FormControl error={config.inputProps?.error} size={config.size ?? 'medium'} fullWidth variant="outlined">
            {
                Boolean(config.title) &&
                <InputLabel {...config.labelProps}>{config.title}</InputLabel>
            }
            <OutlinedInput
                type='text'
                value={valueInital}
                label={config.title ? config.title : undefined}
                onBlur={handleOnChange}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRender(render + 1); post[name] = e.currentTarget.value }}
                placeholder={config.placeholder ?? ''}
                {...config.inputProps}
            />
            {

                config.maxLength ?
                    <FormHelperText error={config.inputProps?.error} style={{ display: 'flex', justifyContent: 'space-between' }} >
                        {Boolean(config.note) && <span dangerouslySetInnerHTML={{ __html: config.note }}></span>}
                        <span style={{ marginLeft: 24, whiteSpace: 'nowrap' }}>{valueInital.length + '/' + config.maxLength}</span>
                    </FormHelperText>
                    :
                    config.note ?
                        <FormHelperText error={config.inputProps?.error}><span dangerouslySetInnerHTML={{ __html: config.note }}></span></FormHelperText>
                        : null
            }
            <SpecialNotes specialNotes={config.special_notes} />
        </FormControl>
    )

}

