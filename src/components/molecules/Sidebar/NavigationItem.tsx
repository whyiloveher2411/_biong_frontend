import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Collapse from 'components/atoms/Collapse';
import Icon, { IconFormat } from 'components/atoms/Icon';
import Label from 'components/atoms/Label';
import ListItem from 'components/atoms/ListItem';
import ListItemButton from 'components/atoms/ListItemButton';
import ListItemIcon from 'components/atoms/ListItemIcon';
import ListItemText from 'components/atoms/ListItemText';
import SvgIcon from 'components/atoms/SvgIcon';
import { addClasses } from 'helpers/dom';
import { fade } from 'helpers/mui4/color';
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';


interface NavigationItemProps {
    [key: string]: ANY,
    title: string,
    href?: string,
    depth?: number,
    children?: React.ReactNode,
    icon?: IconFormat,
    className?: string,
    open?: boolean,
    label?: {
        [key: string]: ANY,
    },
    svgIcon?: string,
}

const NavigationItem = ({
    title,
    href,
    depth = 0,
    children,
    icon,
    className = '',
    open: openProp = false,
    label,
    svgIcon,
    ...rest
}: NavigationItemProps) => {

    const classes = useStyles();
    const [open, setOpen] = useState(openProp);

    const { pathname } = useLocation();
    // console.log(pathname);
    const active = getActive(href ? href : '#', pathname);

    const handleToggle = () => {
        setOpen(open => !open);
    };

    let paddingLeft = 16;

    if (depth > 0) {
        paddingLeft = 16 * depth;
    }

    const style = {
        paddingLeft
    };

    if (children) {
        return (
            <ListItem
                {...rest}
                className={addClasses({
                    [classes.item]: true,
                    [className]: true
                })}
                disableGutters
                disablePadding
            >
                <ListItemButton
                    className={classes.button}
                    onClick={handleToggle}
                    style={style}
                >
                    {svgIcon ?
                        <ListItemIcon>
                            <SvgIcon className={classes.icon}>
                                <svg dangerouslySetInnerHTML={{ __html: svgIcon }} />
                            </SvgIcon>
                        </ListItemIcon>
                        :
                        <ListItemIcon>
                            <Icon icon={icon} className={classes.icon} />
                        </ListItemIcon>
                    }
                    <ListItemText>
                        {title}
                    </ListItemText>
                    {open ? (
                        <Icon icon="ExpandLess" color="inherit" className={classes.expandIcon} />
                    ) : (
                        <Icon icon="ExpandMore" color="inherit" className={classes.expandIcon} />
                    )}
                </ListItemButton>
                <Collapse in={open}>{children}</Collapse>
            </ListItem>
        );
    }
    return (
        <ListItem
            {...rest}
            className={addClasses({
                [classes.itemLeaf]: true,
                [className]: true,
            })}
            disableGutters
            disablePadding
        >
            {href ?
                <ListItemButton
                    className={addClasses({
                        [classes.buttonLeaf]: true,
                        [`depth-${depth}`]: true,
                        [classes.active]: active
                    })}
                    // activeClassName={classes.active}
                    style={style}
                    component={NavLink}
                    to={href}>
                    {svgIcon ?
                        <ListItemIcon>
                            <SvgIcon className={classes.icon}>
                                <svg dangerouslySetInnerHTML={{ __html: svgIcon }} />
                            </SvgIcon>
                        </ListItemIcon>
                        :
                        <ListItemIcon>
                            <Icon icon={icon} className={classes.icon} />
                        </ListItemIcon>
                    }
                    <ListItemText className={classes.itemText}>
                        {title}
                        {label && <Label {...label} className={classes.label}
                        >{label.title}</Label>}
                    </ListItemText>
                </ListItemButton>
                :
                <ListItemButton
                    className={addClasses({
                        [classes.buttonLeaf]: true,
                        [`depth-${depth}`]: true,
                    })}
                    style={style}
                    component={NavLink}
                    to={'#'}
                >
                    {svgIcon ?
                        <ListItemIcon>
                            <SvgIcon className={classes.icon}>
                                <svg dangerouslySetInnerHTML={{ __html: svgIcon }} />
                            </SvgIcon>
                        </ListItemIcon>
                        :
                        <ListItemIcon>
                            <Icon icon={icon} className={classes.icon} />
                        </ListItemIcon>
                    }
                    <ListItemText className={classes.itemText}>
                        {title}
                        {label && <Label {...label} className={classes.label}>{label.title}</Label>}
                    </ListItemText>
                </ListItemButton>
            }
        </ListItem >
    );
};

export default NavigationItem;

export function getActive(path: string, pathname: string) {
    // return path ? !!matchPath({ path, end: true }, pathname) : false;
    return path ? pathname.search(path) === 0 : false;

}


const useStyles = makeStyles(({ typography, palette, spacing }: Theme) => ({
    item: {
        display: 'block',
        paddingTop: 0,
        paddingBottom: 0
    },
    itemLeaf: {
        display: 'flex',
        paddingTop: 0,
        paddingBottom: 0
    },
    button: {
        color: 'inherit',
        padding: '10px 8px',
        justifyContent: 'flex-start',
        textTransform: 'none',
        letterSpacing: 0,
        width: '100%',
    },
    buttonLeaf: {
        color: 'inherit',
        padding: '10px 8px',
        justifyContent: 'flex-start',
        textTransform: 'none',
        letterSpacing: 0,
        borderRadius: 0,
        width: '100%',
        fontWeight: typography.fontWeightRegular,
        '&.depth-0': {
            fontWeight: typography.fontWeightMedium
        },
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        marginRight: spacing(1),
        marginBottom: 3,
    },
    expandIcon: {
        marginLeft: 'auto',
        height: 16,
        width: 16
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto'
    },
    itemText: {
        '& .MuiTypography-root': {
            display: 'flex',
            alignItems: 'center',
        }
    },
    active: {
        fontWeight: typography.fontWeightMedium,
        backgroundColor: fade(palette.text.primary, 0.1),
    }
}));