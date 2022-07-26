import OutlinedInput from 'components/atoms/OutlinedInput';
import InputLabel from 'components/atoms/InputLabel';
import InputAdornment from 'components/atoms/InputAdornment';
import IconButton from 'components/atoms/IconButton';
import Icon from 'components/atoms/Icon';

import FormHelperText from 'components/atoms/FormHelperText';
import FormControl from 'components/atoms/FormControl';
import React from 'react';
import { FieldFormItemProps } from '../type';
import SpecialNotes from '../SpecialNotes';

export default function NumberForm({ config, post, onReview, name }: FieldFormItemProps) {

    let valueInital =  post && post[name] !== null && post[name] !== undefined ? post[name] : '';

    const [value, setValue] = React.useState(0);

    const step = config.step ? Number(config.step) : 1;

    const onClickButtonQuantity = (addNumber: number) => () => {

        let value = Number(post[name]) + addNumber;
        post[name] = value;
        onReview(value, name);

    }

    return (
        <FormControl error={config.inputProps?.error} size={config.size ?? 'medium'} fullWidth variant="outlined">
            {
                Boolean(config.title) &&
                <InputLabel {...config.labelProps}>{config.title}</InputLabel>
            }
            <OutlinedInput
                type='number'
                variant="outlined"
                name={name}
                value={valueInital}
                label={config.title ? config.title : undefined}
                onBlur={e => { onReview(e.target.value, name) }}
                onChange={e => { setValue(value + 1); post[name] = e.target.value }}
                onWheel={(e: React.WheelEvent<HTMLInputElement>) => (e.target as HTMLElement).blur()}
                startAdornment={
                    config.activeSubtraction ?
                        <InputAdornment position="start">
                            <IconButton
                                aria-label="Add quantity"
                                edge="start"
                                disabled={config.min !== undefined ? Number(post[name]) <= Number(config.min) : false}
                                onClick={onClickButtonQuantity(-step)}
                            >
                                <Icon icon="RemoveRounded" />
                            </IconButton>
                        </InputAdornment>
                        : undefined
                }
                endAdornment={config.activeAddition ? <InputAdornment position="end">
                    <IconButton
                        aria-label="Add number"
                        edge="end"
                        disabled={config.max !== undefined ? Number(post[name]) >= Number(config.max) : false}
                        onClick={onClickButtonQuantity(step)}
                    >
                        <Icon icon="AddRounded" />
                    </IconButton>
                </InputAdornment>
                    :
                    undefined
                }
                {...config.inputProps}
            />
            {
                Boolean(config.note) &&
                <FormHelperText error={config.inputProps?.error}><span dangerouslySetInnerHTML={{ __html: config.note }}></span></FormHelperText>
            }
            <SpecialNotes specialNotes={config.special_notes} />
        </FormControl>
    )
}