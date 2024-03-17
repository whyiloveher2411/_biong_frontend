import Box from 'components/atoms/Box';
import Alert from 'components/atoms/Alert';
import Autocomplete from 'components/atoms/Autocomplete';
import FormControl from 'components/atoms/FormControl';
import FormHelperText from 'components/atoms/FormHelperText';
import makeCSS from 'components/atoms/makeCSS';
import TextField from 'components/atoms/TextField';
import Typography from 'components/atoms/Typography';
import React from 'react';
import { FieldFormItemProps } from '../type';
import SpecialNotes from '../SpecialNotes';
import { AlertColor } from '@mui/material';

const useStyles = makeCSS({
    selectItem: {
        whiteSpace: 'unset'
    },
    pointSelect: {
        display: 'inline-block',
        width: 8,
        height: 8,
        marginRight: 8,
        borderRadius: '50%',
        backgroundColor: 'var(--bg)',
    },
    image: {
        display: 'inline-block',
        width: 'var(--width, 20px)',
        marginRight: 8,
        height: 'auto',
        borderRadius: 3,
    }
})

interface Option {
    title: string,
    _key: string,
    color?: string,
    image?: string,
    width?: string,
    description?: string,
}

export default function SelectForm({ config, post, onReview, name }: FieldFormItemProps) {

    const [listOption, setListOption] = React.useState<{
        _key: string,
        title: string,
        description?: string,
        color?: string
    }[]>([]);

    React.useEffect(() => {

        if (config.list_option) {
            setListOption(config.list_option ?
                Object.keys(config.list_option).map((key) => ({ ...config.list_option[key], _key: key }))
                :
                []);
        }

    }, [config.list_option]);

    const classes = useStyles();

    const [value, setValue] = React.useState<{ [key: string]: string } | null>(null);

    React.useEffect(() => {

        let valueInital: { [key: string]: string } | null = null;

        if (post && post[name] && config.list_option && config.list_option[post[name]]) {
            valueInital = { ...config.list_option[post[name]], _key: post[name] };
        } else if (config.defaultValue) {
            valueInital = { ...config.list_option[config.defaultValue], _key: config.defaultValue };
            post[name] = config.defaultValue;
        } else {
            valueInital = null;
        }

        setValue(valueInital);

    }, [post[name]]);


    const onChange = (_e: React.ChangeEvent, value: Option) => {

        let valueUpdate: string;

        if (value) {
            valueUpdate = value._key;
        } else {
            valueUpdate = config.defaultValue ? config.defaultValue : '';
        }

        onReview(valueUpdate, name);

    }

    return (
        <FormControl error={config.inputProps?.error} size={config.size ?? 'medium'} fullWidth variant="outlined">
            <Autocomplete
                options={listOption}
                getOptionLabel={(option: Option) => option.title ? option.title : ''}
                disableClearable
                size={config.size ?? 'medium'}
                renderInput={(params) => {
                    if (value && typeof value.color === 'string') {
                        params.InputProps.startAdornment = <span
                            className={classes.pointSelect}
                            style={{ ['--bg' as string]: value.color, marginLeft: 8 }}
                        >
                        </span>;
                    }

                    if (value && typeof value.image === 'string') {
                        params.InputProps.startAdornment = <img
                            style={{
                                ['--width' as string]: value.width ? value.width : '20px',
                                marginRight: 2,
                                marginLeft: 6,
                            }}
                            className={classes.image}
                            alt='select option'
                            src={value.image}
                        />;
                    }

                    return <>
                        <TextField
                            {...params}
                            label={config.title ? config.title : undefined}
                            variant="outlined"
                            error={config.inputProps?.error ? true : false}
                        />
                        {
                            Boolean(config.note) &&
                            <FormHelperText error={config.inputProps?.error} style={{ display: 'flex', justifyContent: 'space-between' }} ><span dangerouslySetInnerHTML={{ __html: config.note }}></span></FormHelperText>
                        }
                        <SpecialNotes specialNotes={config.special_notes} />
                        {
                            Boolean(value && value.description && !config.disableAlert) &&
                            <Alert severity={(value?.alert_severity as AlertColor | undefined) ?? "info"} sx={{ marginTop: 0.5 }}>
                                <Typography variant="body2">{value?.description}</Typography>
                            </Alert>
                        }
                    </>
                }}
                value={value}
                isOptionEqualToValue={(option: Option, value: Option) => option._key === value._key}
                renderOption={(props, option: Option) => (
                    <li {...props} key={option._key}>
                        <div className={classes.selectItem}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {
                                    Boolean(option.color) &&
                                    <Typography style={{ ['--bg' as string]: option.color }} component="span" className={classes.pointSelect} ></Typography>
                                }
                                {
                                    Boolean(option.image) &&
                                    <img
                                        style={{
                                            ['--width' as string]: option.width ? option.width : '20px'
                                        }}
                                        className={classes.image}
                                        alt='select option'
                                        src={option.image as string}
                                    />
                                }
                                {option.title}
                            </Box>
                            {
                                Boolean(option.description) &&
                                <Typography variant="body2">{option.description}</Typography>
                            }
                        </div>
                    </li>
                )}
                {...config.inputProps}
                error={undefined}
                onChange={onChange}
            />
        </FormControl>

    );

}