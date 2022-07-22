import React from 'react';
import Popper from 'components/atoms/Popper';
import Grow from 'components/atoms/Grow';
import Paper from 'components/atoms/Paper';
import ClickAwayListener from 'components/atoms/ClickAwayListener';

import { PopperProps } from '@mui/material';

interface MenuPopperProps extends PopperProps {
    onClose: () => void,
    paperProps?: object,
    disableTransition?: boolean,
    children: ANY,
}
function MenuPopper({ onClose, disableTransition, children, paperProps, ...rest }: MenuPopperProps) {
    return <Popper
        style={{ zIndex: 9999 }}
        transition
        placement="bottom"
        {...rest}
    >
        {({ TransitionProps, placement }) => (
            <Grow
                {...TransitionProps}
                timeout={disableTransition ? 0 : 'auto'}
                style={{
                    transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                }}
            >
                <Paper {...paperProps}>
                    <ClickAwayListener children={children} onClickAway={onClose} />
                </Paper>
            </Grow>
        )
        }
    </Popper >;
}

export default MenuPopper;
