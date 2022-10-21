import { Box, Theme, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/system';
import Button from 'components/atoms/Button';
import Typography from 'components/atoms/Typography';
import { __ } from 'helpers/i18n';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';


const useStyles = makeStyles((theme: Theme) => ({
    imageContainer: {
        marginTop: theme.spacing(6),
        display: 'flex',
        justifyContent: 'center',
        marginBottom: theme.spacing(3),
    },
    image: {
        maxWidth: '100%',
        width: 560,
        maxHeight: 300,
        height: 'auto'
    },
    buttonContainer: {
        marginTop: theme.spacing(3),
        display: 'flex',
        justifyContent: 'center'
    }
}));

interface NoticeContentProps {
    title: string,
    description: string,
    image: string,
    buttonLabel?: string,
    buttonLink?: string,
    disableButtonHome?: boolean,
    children?: React.ReactChild,
    variantDescription?: "button" | "caption" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "inherit" | "subtitle1" | "subtitle2" | "body1" | "body2" | "overline"
}

const NoticeContent = ({ title, description, image, buttonLabel = __('Back to home'), buttonLink = '/', disableButtonHome = false, children, variantDescription }: NoticeContentProps) => {

    const classes = useStyles();
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                maxWidth: 800,
                margin: '0 auto',
            }}
        >
            <div className={classes.imageContainer}>
                <img
                    alt="Under development"
                    className={classes.image}
                    src={image}
                />
            </div>
            <Typography
                align="center"
                variant={mobileDevice ? 'h4' : 'h1'}
                sx={{ mb: 2 }}
            >
                {title}
            </Typography>
            <Typography
                align="center"
                variant={variantDescription ?? "subtitle2"}
                dangerouslySetInnerHTML={{ __html: description }}
            />
            {
                !disableButtonHome &&
                <div className={classes.buttonContainer}>
                    <Button
                        color="primary"
                        component={RouterLink}
                        to={buttonLink}
                        variant="contained"
                    >
                        {buttonLabel}
                    </Button>
                </div>
            }
            {children}
        </Box>
    );
};

export default NoticeContent;
