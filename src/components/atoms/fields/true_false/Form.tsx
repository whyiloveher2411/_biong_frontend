import Checkbox from 'components/atoms/Checkbox';
import FormControl from 'components/atoms/FormControl';
import FormControlLabel from 'components/atoms/FormControlLabel';
import FormGroup from 'components/atoms/FormGroup';
import FormLabel from 'components/atoms/FormLabel';
import Switch from 'components/atoms/Switch';
import Typography from 'components/atoms/Typography';
import React from 'react';
import SpecialNotes from '../SpecialNotes';
import { FieldFormItemProps } from '../type';

export default function TrueFalseForm({ config, post, onReview, name, inlineEdit }: FieldFormItemProps) {

    const [value, setValue] = React.useState(0);

    let checked = config.defaultValue ? config.defaultValue : false;

    if (typeof post[name] !== 'undefined') {
        if (post[name] * 1) {
            checked = true;
        } else {
            checked = false;
        }
    }

    if (config.isChecked) {
        return <><FormControlLabel
            style={{ marginRight: 24 }}
            control={<Checkbox
                onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                    onReview(checked ? 1 : 0, name);
                }} checked={Boolean(post[name])} color="primary" />}
            label={config.title}
        />
            {
                Boolean(config.note) &&
                <Typography variant="body2">{config.note}</Typography>
            }
            <SpecialNotes specialNotes={config.special_notes} />
        </>
    }

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">
                {
                    Boolean(!inlineEdit && config.title) &&
                    config.title
                }
                <FormGroup style={{ display: 'inline' }}>
                    <Switch
                        color="primary"
                        name={name}
                        onChange={e => { setValue(value + 1); post[name] = e.target.checked ? 1 : 0; onReview(e.target.checked ? 1 : 0, name); }}
                        checked={checked}
                        inputProps={{ 'aria-label': config.title }}
                    />
                </FormGroup>
            </FormLabel>
            <Typography variant="body2">{config.note}</Typography>
            <SpecialNotes specialNotes={config.special_notes} />
        </FormControl>
    )

}