import { Box, ListItemText } from '@mui/material'
import IconButton from 'components/atoms/IconButton'
import ListItemIcon from 'components/atoms/ListItemIcon'
import Menu from 'components/atoms/Menu'
import MenuItem from 'components/atoms/MenuItem'
import Typography from 'components/atoms/Typography'
import React, { Fragment, memo, useRef, useState } from 'react'
import Divider from './Divider'
import Icon, { IconFormat } from './Icon'


const MoreButton = ({ actions, selected, icon = 'MoreVert', children, onClose, ...rest }: {
    [key: string]: ANY,
    actions: Array<{
        [key: string]: {
            title: React.ReactNode,
            description?: React.ReactNode,
            action: () => void | boolean,
            icon?: IconFormat,
            selected?: boolean,
        }
    } | Array<{
        title: React.ReactNode,
        description?: React.ReactNode,
        action: () => void | boolean,
        icon?: IconFormat,
        selected?: boolean,
    }>>,
    // title?: string,
    selected?: string,
    icon?: IconFormat,
    children?: React.ReactNode,
    onClose?: () => void,
}) => {

    const moreRef = useRef(null)
    const [openMenu, setOpenMenu] = useState(false)

    const handleMenuOpen = () => {
        setOpenMenu(true)
    }

    const handleMenuClose = () => {
        setOpenMenu(false);
        if (onClose) onClose();
    }

    return (
        <Fragment>
            {
                children ?
                    <Box
                        sx={{ display: 'inline-block' }}
                        className='MoreButton-root DropDown-root'
                        onClick={handleMenuOpen}
                        ref={moreRef}
                    >
                        {children}
                    </Box>
                    :
                    <IconButton
                        onClick={handleMenuOpen}
                        className='MoreButton-root DropDown-root'
                        ref={moreRef}
                        size="small">
                        <Icon icon={icon} />
                    </IconButton>
            }
            <Menu
                anchorEl={moreRef.current}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={openMenu}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'transparent',
                        backdropFilter: 'none',
                    }
                }}
                PaperProps={{
                    sx: {
                        borderRadius: '4px',
                    }
                }}
                {...rest}
            >
                {
                    actions.map((group, index) => {
                        let result = Array.isArray(group) ?
                            group.map((action, index2) => (
                                <MenuItem
                                    key={index2}
                                    selected={action.selected}
                                    onClick={() => {
                                        let next = action.action();
                                        if (!next) {
                                            handleMenuClose();
                                        }
                                    }}>
                                    {
                                        Boolean(action.icon) &&
                                        <ListItemIcon>
                                            {
                                                action.icon !== 'empty' &&
                                                <Icon icon={action.icon} />
                                            }
                                        </ListItemIcon>
                                    }
                                    {
                                        action.description ?
                                            <ListItemText>
                                                <Typography noWrap>{action.title}</Typography>
                                                <Typography variant="body2">{action.description}</Typography>
                                            </ListItemText>
                                            :
                                            <Typography variant="inherit" noWrap>
                                                {action.title}
                                            </Typography>
                                    }
                                </MenuItem>
                            ))
                            : Object.keys(group).map((key: string) => (
                                <MenuItem
                                    key={key}
                                    selected={key === selected || group[key].selected}
                                    onClick={() => {
                                        const next = group[key].action();
                                        if (!next) {
                                            handleMenuClose();
                                        }
                                    }}>
                                    {
                                        Boolean(group[key].icon) &&
                                        <ListItemIcon>
                                            {
                                                group[key].icon !== 'empty' &&
                                                <Icon icon={group[key].icon} />
                                            }
                                        </ListItemIcon>
                                    }
                                    {
                                        group[key].description ?
                                            <ListItemText>
                                                <Typography noWrap>{group[key].title}</Typography>
                                                <Typography variant="body2">{group[key].description}</Typography>
                                            </ListItemText>
                                            :
                                            <Typography variant="inherit" noWrap>
                                                {group[key].title}
                                            </Typography>
                                    }
                                </MenuItem>
                            ));
                        if (index !== (actions.length - 1)) {
                            result.push(<Divider color='dark' />);
                        }
                        return result;
                    })
                }
            </Menu>
        </Fragment >
    )
}

export default memo(MoreButton)
