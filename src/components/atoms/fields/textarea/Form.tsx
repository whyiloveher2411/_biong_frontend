import React from 'react'
import OutlinedInput from 'components/atoms/OutlinedInput';
import InputLabel from 'components/atoms/InputLabel';
import FormHelperText from 'components/atoms/FormHelperText';
import FormControl from 'components/atoms/FormControl';
import { FieldFormItemProps } from '../type';
import { makeStyles } from '@mui/styles';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import SpecialNotes from '../SpecialNotes';


const useStyles = makeStyles({
    editor: {
        '&>.MuiInputLabel-outlined.MuiInputLabel-shrink': {
            transform: 'translate(14px, -11px) scale(0.75)'
        },
        '&>.MuiInputBase-root>textarea, &>label': {
            lineHeight: 2.2
        },
        lineHeight: '24px',
    },
})

export default function TextareaForm(props: FieldFormItemProps) {

    const { config, post, name, onReview } = props;
    const classes = useStyles()

    const valueInital = post && post[name] ? post[name] : '';
    const [, setRender] = React.useState(0);

    return (

        <FormControl error={config.inputProps?.error} size={config.size ?? 'medium'} fullWidth variant="outlined">
            {
                Boolean(config.title) &&
                <InputLabel {...config.labelProps}>{config.title}</InputLabel>
            }
            <OutlinedInput
                type='textarea'
                name={name}
                rows={config.rows ?? 1}
                multiline
                defaultValue={valueInital}
                className={classes.editor}
                label={config.title ? config.title : undefined}
                onBlur={e => { onReview(e.target.value, name); setRender(prev => prev + 1); }}
                inputComponent={TextareaAutosize}
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
