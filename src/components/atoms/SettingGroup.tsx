import Grid from 'components/atoms/Grid';
import Typography from 'components/atoms/Typography';
import React from 'react';
import makeCSS from './makeCSS';

const useStyles = makeCSS({
    settingTitle: {
        fontSize: 20,
        margin: '10px 0 10px',
        display: 'flex', alignItems: 'center'
    },
    settingDescription: {
        fontSize: 13,
        lineHeight: '24px'
    }
});

function SettingGroup({ title, description, children, ...rest }: {
    [key: string]: ANY,
    title: string,
    description: string,
    children: React.ReactNode,
}) {
    const classes = useStyles();

    return (
        <Grid container spacing={4} {...rest}>
            <Grid item md={4} xs={12}>
                <Typography component="h2" className={classes.settingTitle} variant="h4" >{title}</Typography>
                <Typography component="p" className={classes.settingDescription} >{description}</Typography>
            </Grid>
            <Grid item md={8} xs={12}>
                {
                    children
                }
            </Grid>
        </Grid>
    )
}
export default SettingGroup
