import Button from 'components/atoms/Button';
import Card from 'components/atoms/Card';
import CardActions from 'components/atoms/CardActions';
import Collapse from 'components/atoms/Collapse';
import IconButton from 'components/atoms/IconButton';
import Paper from 'components/atoms/Paper';
import Typography from 'components/atoms/Typography';
import Icon from 'components/atoms/Icon';
import { SnackbarContent, useSnackbar } from 'notistack';
import React, { forwardRef, useCallback, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles(({ breakpoints, transitions, palette }: Theme) => ({
    root: {
        [breakpoints.up('sm')]: {
            minWidth: '344px !important',
        },
    },
    card: {
        width: 400,
        maxWidth: '100%',
        backgroundColor: palette.divider,
        boxShadow: 'rgb(9 30 66 / 31%) 0px 0px 1px 0px, rgb(9 30 66 / 25%) 0px 20px 32px -8px',
        position: 'relative',
        '&:before': {
            position: 'absolute',
            content: '""',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: 'var(--bgColor)',
            opacity: 0.08,
            pointerEvents: 'none',
            zIndex: 0,
        },
    },
    message: {
        color: palette.text.primary,
        display: 'flex',
        alignItems: 'center',
        wordBreak: 'break-word',
        lineHeight: '28px',
        '& svg': {
            marginRight: 12
        }
    },
    actionRoot: {
        padding: '8px 8px 8px 16px',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 9,
    },
    icons: {
        marginLeft: 'auto',
        display: 'flex',
    },
    expandOpen: {
        color: palette.text.secondary,
        padding: '8px 8px',
        transform: 'rotate(0deg)',
        transition: transitions.create('transform', {
            duration: transitions.duration.shortest,
        }),
    },
    expand: {
        color: palette.text.secondary,
        padding: '8px 8px',
        transition: transitions.create('transform', {
            duration: transitions.duration.shortest,
        }),
        transform: 'rotate(180deg)',
    },
    collapse: {
        padding: 16,
    },
    checkIcon: {
        fontSize: 20,
        color: '#b3b3b3',
        paddingRight: 4,
    },
    button: {
        padding: 0,
        textTransform: 'none',
    },
}));

interface CustomSnackbarProps {
    [key: string]: any, //eslint-disable-line
    message: {
        [key: string]: any //eslint-disable-line
    }
}

const CustomSnackbar = forwardRef((props: CustomSnackbarProps, ref: React.Ref<HTMLDivElement> | undefined) => {

    const { message } = props;

    const color: {
        [key: string]: {
            backgroundColor: string,
            icon?: React.ReactNode
        },
    } = {
        null: {
            backgroundColor: '#d32f2f',
            icon: <Icon sx={{ color: '#d32f2f' }} icon={{ custom: '<path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />' }} />
        },
        success: {
            backgroundColor: '#43a047',
            icon: <Icon sx={{ color: '#43a047' }} icon="CheckCircleRounded" fontSize="small" />
        },
        error: {
            backgroundColor: '#d32f2f',
            icon: <Icon sx={{ color: '#d32f2f' }} icon={{ custom: '<path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />' }} />
        },
        warning: {
            backgroundColor: '#ff9800',
            icon: <Icon sx={{ color: '#ff9800' }} icon="WarningRounded" fontSize="small" />
        },
        info: {
            backgroundColor: '#2196f3',
            icon: <Icon sx={{ color: '#2196f3' }} icon="ErrorRounded" fontSize="small" />
        },
        default: {
            backgroundColor: 'rgb(49, 49, 49)',
        },
    };

    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(true);

    const handleExpandClick = useCallback(() => {
        setExpanded((oldExpanded) => !oldExpanded);
    }, []);

    const handleDismiss = useCallback(() => {
        closeSnackbar(props.id);
    }, [props.id, closeSnackbar]);


    if (!message) {
        return null;
    }

    if (!message.type) {

        if( !message.options?.variant || !color[message.options.variant] ){
            message.options.variant = 'error';
        }

        return (
            <SnackbarContent ref={ref} className={classes.root}>

                {
                    Boolean(message.options && message.content) &&
                    <Card style={{ ['--bgColor' as string]: color[message.options?.variant].backgroundColor }} className={classes.card} >
                        <CardActions classes={{ root: classes.actionRoot }}>
                            <Typography variant="body1" className={classes.message} >{Boolean(color[message.options?.variant].icon) && color[message.options?.variant].icon} {message.content}</Typography>
                            <div className={classes.icons}>
                                <IconButton className={classes.expand} onClick={handleDismiss}>
                                    <Icon icon="Close" />
                                </IconButton>
                            </div>
                        </CardActions>
                    </Card>
                }

            </SnackbarContent>
        );
    }

    return (
        <SnackbarContent ref={ref} className={classes.root}>
            <Card className={classes.card} >
                <CardActions style={{ backgroundColor: color[message.options.variant].backgroundColor }} classes={{ root: classes.actionRoot }}>
                    <Typography variant="subtitle1" className={classes.message}>{Boolean(color[message.options.variant].icon) && color[message.options.variant].icon} {message.content}</Typography>
                    <div className={classes.icons}>
                        <IconButton
                            aria-label="Show more"
                            className={expanded ? classes.expandOpen : classes.expand}
                            onClick={handleExpandClick}
                        >
                            <Icon icon="ExpandMore" />
                        </IconButton>
                        <IconButton className={classes.expand} onClick={handleDismiss}>
                            <Icon icon="Close" />
                        </IconButton>
                    </div>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Paper className={classes.collapse}>
                        {
                            (() => {
                                switch (message.type) {
                                    case 'download':
                                        return <>
                                            <Typography gutterBottom>{message.download.title}</Typography>
                                            <Button size="small" className={classes.button} download href={message.download.link}>
                                                <Icon icon={'CheckCircle'} className={classes.checkIcon} />
                                                {message.download.button}
                                            </Button>
                                        </>
                                    case 'note':
                                        return <div>{message.note.content}</div>
                                    case 'custom':
                                        return message.custom
                                }

                            })()
                        }
                    </Paper>

                </Collapse>
            </Card>
        </SnackbarContent >
    );
});

export default CustomSnackbar;