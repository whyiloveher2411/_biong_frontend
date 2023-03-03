import { Box, ListItemText } from '@mui/material'
import IconButton from 'components/atoms/IconButton'
import ListItemIcon from 'components/atoms/ListItemIcon'
import MenuList from '@mui/material/MenuList';
import MenuItem from 'components/atoms/MenuItem'
import Typography from 'components/atoms/Typography'
import React, { Fragment, memo, useRef, useState } from 'react'
import Divider from './Divider'
import Icon, { IconFormat } from './Icon'
import Popper from 'components/atoms/Popper';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import ClickAwayListener from 'components/atoms/ClickAwayListener';

const MoreButton = ({ actions, selected, icon = 'MoreVert', children, onClose, ...rest }: {
    [key: string]: ANY,
    actions: Array<{
        [key: string]: {
            title: React.ReactNode,
            description?: React.ReactNode,
            action: () => void | boolean,
            icon?: IconFormat,
            iconComponent?: React.ReactNode,
            disabled?: boolean,
            selected?: boolean,
        }
    } | Array<{
        title: React.ReactNode,
        description?: React.ReactNode,
        action: () => void | boolean,
        icon?: IconFormat,
        iconComponent?: React.ReactNode,
        disabled?: boolean,
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
            <Popper
                open={openMenu}
                anchorEl={moreRef.current}
                role={undefined}
                placement="bottom-end"
                transition
                disablePortal
                sx={{
                    zIndex: 999
                }}
            >
                {({ TransitionProps, placement }) => (
                    <ClickAwayListener onClickAway={handleMenuClose} >
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement === 'bottom-start' ? 'left top' : 'left bottom',
                            }}
                        >
                            <Paper>
                                <MenuList
                                    autoFocusItem={openMenu}
                                    {...rest}
                                >
                                    {
                                        actions.map((group, index) => {
                                            let result = Array.isArray(group) ?
                                                group.map((action, index2) => (
                                                    <MenuItem
                                                        key={index2}
                                                        selected={action.selected}
                                                        disabled={action.disabled}
                                                        onClick={() => {
                                                            let next = action.action();
                                                            if (!next) {
                                                                handleMenuClose();
                                                            }
                                                        }}>
                                                        {
                                                            Boolean(action.icon || action.iconComponent) &&
                                                            <ListItemIcon>
                                                                {
                                                                    action.icon !== 'empty' &&
                                                                    <Icon icon={action.icon} />
                                                                }
                                                                {
                                                                    action.iconComponent ?
                                                                        action.iconComponent : null
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
                                                        disabled={group[key].disabled}
                                                        onClick={() => {
                                                            const next = group[key].action();
                                                            if (!next) {
                                                                handleMenuClose();
                                                            }
                                                        }}>
                                                        {
                                                            Boolean(group[key].icon || group[key].iconComponent) &&
                                                            <ListItemIcon>
                                                                {
                                                                    group[key].icon !== 'empty' &&
                                                                    <Icon icon={group[key].icon} />
                                                                }
                                                                {
                                                                    group[key].iconComponent ?
                                                                        group[key].iconComponent : null
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
                                </MenuList>
                            </Paper>
                        </Grow>
                    </ClickAwayListener>
                )}
            </Popper>
        </Fragment >
    )
}

export default memo(MoreButton)
