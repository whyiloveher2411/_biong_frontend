import React from 'react';
import Popper from 'components/atoms/Popper';
import Grow from 'components/atoms/Grow';
import Paper from 'components/atoms/Paper';
import ClickAwayListener from 'components/atoms/ClickAwayListener';

import { PopperProps, SxProps } from '@mui/material';

interface MenuPopperProps extends PopperProps {
    onClose: () => void,
    paperProps?: object,
    disableTransition?: boolean,
    children: ANY,
    sx?: SxProps
}
function MenuPopper({ onClose, disableTransition, children, paperProps, ...rest }: MenuPopperProps) {
    return <Popper
        style={{ zIndex: 9999 }}
        transition
        placement="bottom"
        {...rest}
    >
        {({ TransitionProps, placement }) => (
            <ClickAwayListener onClickAway={onClose} >
                <Grow
                    {...TransitionProps}
                    timeout={disableTransition ? 0 : 'auto'}
                    style={{
                        transformOrigin:
                            placement === "bottom" ? "center top" : "center bottom",
                    }}
                >
                    <Paper {...paperProps}>
                        {children}
                    </Paper>
                </Grow>
            </ClickAwayListener>
        )
        }
    </Popper >;
}

export default MenuPopper;
